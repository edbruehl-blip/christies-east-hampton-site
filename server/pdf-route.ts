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
import { sdk } from './_core/sdk';

const router = Router();

// Detect the running server port from the environment or default
function getServerPort(): number {
  return parseInt(process.env.PORT ?? '3000', 10);
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

  let browser = null;
  try {
    const port = getServerPort();
    const targetUrl = `http://localhost:${port}${urlPath}`;

    console.log(`[PDF] Photographing ${targetUrl}`);

    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
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

    // Letter paper width at 96dpi = 816px. Use 1x scale for clean rendering.
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });

    // Navigate and wait for all network activity to settle (fonts, images, tRPC data)
    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 45_000,
    });

    // Wait for Google Fonts (Cormorant Garamond + Barlow Condensed)
    await page.evaluate(() => document.fonts.ready);

    // Additional wait for tRPC data to render (live sheet data)
    await new Promise((resolve) => setTimeout(resolve, 2000));

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

    await browser.close();
    browser = null;

    console.log(`[PDF] Generated ${filename} (${pdfBuffer.length} bytes)`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store',
    });

    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch { /* ignore */ }
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
      executablePath: '/usr/bin/chromium-browser',
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
