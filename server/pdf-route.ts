/**
 * PDF Route — Puppeteer-based PDF generation
 *
 * Endpoints:
 *   GET /api/pdf?url=/pro-forma  → Universal live-URL-first PDF endpoint (new architecture)
 *   GET /api/pdf/report          → Legacy market report PDF (preserved)
 *
 * New Architecture (Doctrine 31 — Google Drive Default):
 *   The live URL is the master. The PDF is the photograph.
 *   Puppeteer photographs the live URL and produces the PDF.
 *   No separate PDF code. No separate data layers.
 *
 * URL patterns:
 *   /pro-forma                   → 4-page institutional pro forma
 *   /letters/flagship            → Flagship AI-Letter
 *   /letters/james-christie      → James Christie Letter
 *   /cards/bike                  → Bike Card
 *   /cards/uhnw-path             → UHNW Wealth Path Card
 *   /agendas/monday-flagship     → Monday Flagship Meeting Agenda
 *   /briefs/morning              → Morning Brief
 *
 * Puppeteer binary: /usr/bin/chromium (confirmed working April 12, 2026)
 */

import { Router, type Request, type Response } from 'express';
import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';
import { sdk } from './_core/sdk';

/**
 * Resolve the best available Chromium/Chrome binary.
 * Priority:
 *   1. /usr/bin/chromium          (sandbox / Ubuntu dev)
 *   2. /usr/bin/chromium-browser  (some Ubuntu variants)
 *   3. /usr/bin/google-chrome     (some CI environments)
 *   4. puppeteer bundled Chrome   (deployed Manus container — .puppeteer-cache/ in project dir)
 *   5. puppeteer bundled Chrome   (fallback — ~/.cache/puppeteer)
 *
 * The deployed Manus container runs `pnpm install` which triggers puppeteer's postinstall
 * and downloads Chrome to .puppeteer-cache/ (configured via package.json puppeteer.cacheDirectory).
 * We resolve the path via dynamic import() — require() fails in ESM context.
 */
async function getChromiumPath(): Promise<string> {
  const candidates = [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/local/bin/chromium',
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      console.log(`[PDF] Using system Chromium: ${p}`);
      return p;
    }
  }
  // Fall back to puppeteer bundled Chrome via dynamic import (ESM-safe)
  try {
    const puppeteerFull = await import('puppeteer') as { default: { executablePath: () => string } };
    const bundled = puppeteerFull.default.executablePath();
    if (existsSync(bundled)) {
      console.log(`[PDF] Using bundled Chrome: ${bundled}`);
      return bundled;
    }
    console.warn(`[PDF] puppeteer.executablePath() returned ${bundled} but file not found`);
  } catch (e) {
    console.warn('[PDF] puppeteer dynamic import failed:', e);
  }
  throw new Error('No Chromium binary found. Install chromium-browser or puppeteer.');
}

/**
 * Wait for Chrome to become available (polls every 3s, up to 60s).
 * This handles the race condition where a PDF request arrives before the
 * background ensureChromiumAvailable() download completes on a cold start.
 * On deployed containers without system Chrome, Chrome downloads in ~30s.
 */
async function waitForChromium(timeoutMs = 60_000): Promise<string> {
  const pollIntervalMs = 3_000;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      return await getChromiumPath();
    } catch {
      const remaining = Math.round((deadline - Date.now()) / 1000);
      console.log(`[PDF] Chrome not ready yet, retrying... (${remaining}s remaining)`);
      await new Promise(r => setTimeout(r, pollIntervalMs));
    }
  }
  throw new Error('Chrome did not become available within 60 seconds. PDF generation failed.');
}

const router = Router();

// Detect the running server port from the environment or default
function getServerPort(): number {
  return parseInt(process.env.PORT ?? '3000', 10);
}

// ─── Persistent Browser Pool ─────────────────────────────────────────────────
// Keep a single warm Chromium instance alive between PDF requests.
// browser.newPage() per export (~20ms) vs puppeteer.launch() per export (~1.5s).
// Health check restarts the browser if it dies.
// 5-minute idle timeout: browser closes if no requests arrive, rebuilds on next.
let poolBrowser: import('puppeteer-core').Browser | null = null;
let poolIdleTimer: ReturnType<typeof setTimeout> | null = null;
const POOL_IDLE_MS = 5 * 60 * 1000; // 5 minutes

async function getBrowserFromPool(): Promise<import('puppeteer-core').Browser> {
  // Reset idle timer on every use
  if (poolIdleTimer) {
    clearTimeout(poolIdleTimer);
    poolIdleTimer = null;
  }

  // Health-check existing instance
  if (poolBrowser) {
    try {
      // If the browser process is still alive, pages() resolves quickly
      await poolBrowser.pages();
      console.log('[PDF Pool] Reusing warm browser');
      schedulePoolIdle();
      return poolBrowser;
    } catch {
      console.warn('[PDF Pool] Warm browser died, relaunching...');
      poolBrowser = null;
    }
  }

  // Launch fresh browser
  const execPath = await waitForChromium();
  poolBrowser = await puppeteer.launch({
    executablePath: execPath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-extensions',
    ],
  });
  console.log('[PDF Pool] Fresh browser launched');
  schedulePoolIdle();
  return poolBrowser;
}

function schedulePoolIdle(): void {
  poolIdleTimer = setTimeout(async () => {
    if (poolBrowser) {
      console.log('[PDF Pool] Idle timeout — closing browser to free memory');
      try { await poolBrowser.close(); } catch { /* ignore */ }
      poolBrowser = null;
    }
  }, POOL_IDLE_MS);
}

/**
 * Generic live-URL-first PDF endpoint — new architecture
 * Usage: GET /api/pdf?url=/pro-forma
 *        GET /api/pdf?url=/letters/flagship
 *        GET /api/pdf?url=/cards/bike
 *
 * The url parameter is a relative path on this server.
 * Puppeteer navigates to http://localhost:{port}{url}, waits for fonts + data,
 * then renders to Letter PDF and returns it.
 *
 * No auth gate — all live URL renderers are internal-only by design.
 * The confidential banner on each document is the access control.
 *
 * Filename is derived from the url path:
 *   /pro-forma           → Christies_EH_Pro_Forma.pdf
 *   /letters/flagship    → Christies_EH_Flagship_Letter.pdf
 *   /cards/bike          → Christies_EH_Bike_Card.pdf
 */
const URL_TO_FILENAME: Record<string, string> = {
  '/market':                 'Christies_EH_Market_Report',
  '/pro-forma':              'Christies_EH_Pro_Forma',
  '/letters/flagship':       'Christies_EH_Flagship_Letter',
  '/letters/james-christie': 'Christies_EH_James_Christie_Letter',
  '/cards/bike':             'Christies_EH_Bike_Card',
  '/cards/uhnw-path':        'Christies_EH_UHNW_Path_Card',
  '/agendas/monday-flagship':'Christies_EH_Monday_Flagship_Agenda',
  '/briefs/morning':         'Christies_EH_Morning_Brief',
};

function urlToFilename(urlPath: string): string {
  const base = URL_TO_FILENAME[urlPath];
  if (base) return base;
  // Fallback: convert /some/path → Christies_EH_Some_Path
  const slug = urlPath.replace(/^\//, '').replace(/\//g, '_').replace(/-/g, '_');
  return `Christies_EH_${slug.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('_')}`;
}

router.get('/api/pdf', async (req: Request, res: Response) => {
  const urlPath = req.query.url as string;

  if (!urlPath || !urlPath.startsWith('/')) {
    res.status(400).json({ error: 'Missing or invalid url parameter. Must be a relative path like /pro-forma' });
    return;
  }

  // Block dangerous paths
  if (urlPath.includes('..') || urlPath.includes('//') || urlPath.startsWith('/api')) {
    res.status(400).json({ error: 'Invalid url path' });
    return;
  }

  const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const filename = `${urlToFilename(urlPath)}_${today}.pdf`;

  let page: import('puppeteer-core').Page | null = null;
  try {
    const port = getServerPort();
    // Append ?pdf=1 so the page can detect PDF render mode and switch to light-mode styles
    const targetUrl = `http://localhost:${port}${urlPath}${urlPath.includes('?') ? '&' : '?'}pdf=1`;

    console.log(`[PDF] Photographing ${targetUrl}`);

    // Use persistent browser pool — avoids 1.5s cold-start per request
    const browser = await getBrowserFromPool();
    page = await browser.newPage();

    // Letter paper width at 96dpi = 816px. Use 1x scale for clean rendering.
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });

    // Path-aware wait strategy:
    // /future — Chart.js canvas renders synchronously; no external network fetches needed.
    //           Use domcontentloaded + short post-load wait for fastest export.
    // All other paths — keep networkidle0 to ensure tRPC data and external assets settle.
    const isFuturePath = urlPath === '/future' || urlPath.startsWith('/future?');
    const waitUntilStrategy = isFuturePath ? 'domcontentloaded' : 'networkidle0';
    const postLoadWaitMs   = isFuturePath ? 600 : 2000;

    await page.goto(targetUrl, {
      waitUntil: waitUntilStrategy,
      timeout: 45_000,
    });

    // Activate @media print CSS for non-/future paths.
    // For /future: the isPdfMode React dual-substrate system handles cream rendering
    // via inline styles. emulateMediaType('print') would trigger future-print.css
    // @media print rules that fight the isPdfMode inline styles with !important overrides.
    // Skip it for /future — the ?pdf=1 param is the sole cream trigger.
    if (!isFuturePath) {
      await page.emulateMediaType('print');
    }

    // Wait for fonts to load — capped at 3s for /future (Georgia is system stack, no CDN needed)
    // capped at 5s for all other paths (Cormorant Garamond, Barlow Condensed from Google Fonts CDN)
    const fontTimeout = isFuturePath ? 3000 : 5000;
    await page.evaluate(async (timeout: number) => {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise<void>(resolve => setTimeout(resolve, timeout)),
        ]);
        // Force font rendering by measuring text in each font family used on the page
        const testEl = document.createElement('span');
        testEl.style.cssText = 'position:absolute;visibility:hidden;font-size:72px;top:-9999px';
        document.body.appendChild(testEl);
        for (const font of ['Playfair Display', 'Cormorant Garamond', 'Barlow Condensed', 'Inter', 'Source Sans 3', 'Georgia']) {
          testEl.style.fontFamily = `'${font}', serif`;
          testEl.textContent = 'AaBbCcDdEeFf1234';
          void testEl.offsetWidth; // force layout reflow
        }
        document.body.removeChild(testEl);
      } catch { /* proceed with system fonts if CDN unavailable */ }
    }, fontTimeout);

    // Post-load wait: Chart.js canvas needs one animation frame to rasterize
    await new Promise((resolve) => setTimeout(resolve, postLoadWaitMs));

    // Hide the print/back buttons before photographing
    await page.evaluate(() => {
      const noPrint = document.querySelector('.no-print') as HTMLElement | null;
      if (noPrint) noPrint.style.display = 'none';
    });

    // Generate PDF — Letter format, print background colors preserved
    const pdfBuffer = await page.pdf({
      timeout: 45_000,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    // Close the page (not the browser) — pool keeps browser alive for next request
    await page.close();
    page = null;

    console.log(`[PDF] Generated ${filename} (${pdfBuffer.length} bytes)`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store',
    });

    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    // Close the page on error; browser pool stays alive
    if (page) {
      try { await page.close(); } catch { /* ignore */ }
    }
    console.error('[PDF] Error generating PDF:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      error: 'PDF generation failed',
      message: errMsg,
      url: urlPath,
    });
  }
});

router.get('/api/pdf/report', async (req: Request, res: Response) => {
  // ── Auth gate — require valid Manus session ──────────────────────────────
  try {
    await sdk.authenticateRequest(req);
  } catch {
    res.status(401).json({ error: 'Unauthorized — please log in to download the market report.' });
    return;
  }

  let browser = null;
  try {
    const port = getServerPort();
    const reportUrl = `http://localhost:${port}/report`;

    browser = await puppeteer.launch({
      executablePath: await waitForChromium(),
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions',
      ],
    });

    const page = await browser.newPage();

    // Set viewport to match the report's max-width
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1.5 });

    // Navigate and wait for all network activity to settle
    await page.goto(reportUrl, {
      waitUntil: 'networkidle0',
      timeout: 30_000,
    });

    // Wait for Cormorant Garamond and Barlow Condensed fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Additional wait for images and lazy-loaded content
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate PDF — A4 landscape, print background colors preserved
    const pdfBuffer = await page.pdf({
      timeout: 30_000,
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      scale: 0.82,
    });

    await browser.close();
    browser = null;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Christies_EH_Market_Report.pdf"',
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store',
    });

    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch { /* ignore */ }
    }
    console.error('[PDF Route] Error generating PDF:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[PDF Route] Full error:', errMsg);
    res.status(500).json({
      error: 'PDF generation failed',
      message: errMsg,
    });
  }
});

// ── Image proxy — allows browser-side jsPDF to fetch CDN images without CORS errors ──
// Usage: GET /api/img-proxy?url=<encoded-url>
router.get('/api/img-proxy', async (req: Request, res: Response) => {
  const url = req.query.url as string;
  if (!url || !url.startsWith('http')) {
    res.status(400).json({ error: 'Missing or invalid url parameter' });
    return;
  }
  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream returned ${upstream.status}` });
      return;
    }
    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    });
    res.send(buffer);
  } catch (err) {
    console.error('[img-proxy] Error fetching', url, err);
    res.status(500).json({ error: 'Proxy fetch failed' });
  }
});

export default router;
