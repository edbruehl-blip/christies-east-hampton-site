import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerTtsRoute, warmFlagshipCache } from "../tts-route";
import { registerMarketRoute } from "../market-route";
import { registerWhatsAppRoute, startWhatsAppScheduler } from "../whatsapp-route";
import { registerWhatsAppInbound } from "../whatsapp-inbound";
import listingsRouter, { syncListings } from "../listings-sync-route";
import pdfRouter from "../pdf-route";
import cron from "node-cron";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

/**
 * Ensure Chrome is available for Puppeteer PDF generation.
 * On the deployed Manus container, pnpm install may skip postinstall scripts.
 * This routine runs at startup and downloads Chrome programmatically if not found.
 * Takes ~30s on first cold start, then Chrome is cached in .puppeteer-cache/.
 */
async function ensureChromiumAvailable(): Promise<void> {
  const { existsSync } = await import('fs');
  const systemCandidates = [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/local/bin/chromium',
  ];
  // Check system Chrome first
  for (const p of systemCandidates) {
    if (existsSync(p)) {
      console.log(`[Chromium] System Chrome found: ${p}`);
      return;
    }
  }
  // Check if puppeteer already has Chrome downloaded
  try {
    const { default: puppeteer } = await import('puppeteer') as { default: { executablePath: () => string } };
    const bundled = puppeteer.executablePath();
    if (existsSync(bundled)) {
      console.log(`[Chromium] Bundled Chrome found: ${bundled}`);
      return;
    }
    // Chrome not found — download it now
    console.log('[Chromium] No Chrome binary found. Downloading via puppeteer install...');
    const { install, Browser } = await import('puppeteer') as unknown as { install: (opts: { browser: string; buildId?: string }) => Promise<void>; Browser: { CHROME: string } };
    if (typeof install === 'function') {
      await install({ browser: Browser.CHROME });
      console.log('[Chromium] Chrome download complete.');
    } else {
      // Fallback: use puppeteer's CLI-equivalent
      const { execSync } = await import('child_process');
      execSync('node node_modules/puppeteer/install.mjs', { stdio: 'inherit', timeout: 120_000 });
      console.log('[Chromium] Chrome download complete via install.mjs.');
    }
  } catch (e) {
    console.warn('[Chromium] Could not auto-download Chrome:', e);
    console.warn('[Chromium] PDF generation will fail until Chrome is available.');
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Ensure Chrome is available for PDF generation (BLOCKING — server waits before accepting requests)
  // This guarantees PDF endpoints never fail with "No Chromium binary found" on cold start.
  // On deployed containers without system Chrome, this downloads Chrome once (~30s) then caches it.
  try {
    await ensureChromiumAvailable();
  } catch (e) {
    console.warn('[Chromium] Chrome not available — PDF generation will fail:', e);
  }

  // Resolve port first so the PDF route knows which port to navigate to
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // TTS route — raw Express (no tRPC) so there is no request timeout cap
  registerTtsRoute(app);

  // Pre-generate flagship letter audio cache on startup (non-blocking)
  // This eliminates the 8–15s ElevenLabs latency on first desktop click.
  const elevenKey = process.env.ELEVENLABS_API_KEY;
  if (elevenKey) {
    warmFlagshipCache(elevenKey);
  }

  // Market data proxy — bypasses CORS on Yahoo Finance for deployed environments
  registerMarketRoute(app);

  // William WhatsApp — 8AM morning brief + 8PM pipeline summary via ElevenLabs + Twilio
  registerWhatsAppRoute(app);
  startWhatsAppScheduler();

  // WhatsApp inbound webhook — receives Twilio POST, routes NEWS/PIPE/STATUS/BRIEF commands
  registerWhatsAppInbound(app);

  // Listings sync — Christie's API → MAPS tab
  app.use('/api/listings', listingsRouter);

  // PDF render — Puppeteer-based PDF generation for the market report
  app.use(pdfRouter);

  // Temporary debug endpoint — check Chromium availability on deployed server
  app.get('/api/debug/chromium', async (_req, res) => {
    const { execSync } = await import('child_process');
    const { existsSync } = await import('fs');
    const candidates = [
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/local/bin/chromium',
      '/usr/local/bin/chromium-browser',
      '/opt/google/chrome/google-chrome',
      '/snap/bin/chromium',
    ];
    const found = candidates.filter(p => existsSync(p));
    let whichOutput = '';
    try { whichOutput = execSync('which chromium chromium-browser google-chrome 2>/dev/null || echo none').toString().trim(); } catch { whichOutput = 'exec error'; }
    let puppeteerPath = '';
    try { const { default: puppeteer } = await import('puppeteer'); puppeteerPath = puppeteer.executablePath(); } catch (e: unknown) { puppeteerPath = String(e); }
    res.json({ found, whichOutput, puppeteerPath, env: process.env.NODE_ENV });
  });

  // 6AM daily listing sync (America/New_York)
  cron.schedule('0 0 6 * * *', async () => {
    console.log('[Listings Cron] 6AM daily sync starting...');
    try {
      const result = await syncListings();
      console.log(`[Listings Cron] Synced ${result.listings.length} listings at ${result.syncedAt}`);
    } catch (err) {
      console.error('[Listings Cron] Sync failed:', err);
    }
  }, { timezone: 'America/New_York' });

  // Run an initial sync on server start (non-blocking)
  syncListings().catch(err => console.error('[Listings] Initial sync failed:', err));

  // Development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

}

startServer().catch(console.error);
