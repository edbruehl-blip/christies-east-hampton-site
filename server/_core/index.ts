import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerTtsRoute } from "../tts-route";
import { registerMarketRoute } from "../market-route";
import { registerWhatsAppRoute, startWhatsAppScheduler } from "../whatsapp-route";
import { registerWhatsAppInbound } from "../whatsapp-inbound";
import listingsRouter, { syncListings } from "../listings-sync-route";
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

async function startServer() {
  const app = express();
  const server = createServer(app);

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

  // Market data proxy — bypasses CORS on Yahoo Finance for deployed environments
  registerMarketRoute(app);

  // William WhatsApp — 8AM morning brief + 8PM pipeline summary via ElevenLabs + Twilio
  registerWhatsAppRoute(app);
  startWhatsAppScheduler();

  // WhatsApp inbound webhook — receives Twilio POST, routes NEWS/PIPE/STATUS/BRIEF commands
  registerWhatsAppInbound(app);

  // Listings sync — Christie's API → MAPS tab
  app.use('/api/listings', listingsRouter);

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
