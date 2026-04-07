/**
 * PDF Route — Puppeteer-based PDF generation for the Christie's Market Report
 *
 * Endpoint: GET /api/pdf/report
 * Returns: application/pdf — Christies_EH_Market_Report.pdf
 *
 * Architecture:
 *   - Launches Chromium headless (system binary at /usr/bin/chromium-browser)
 *   - Navigates to the /report route on the running dev/prod server
 *   - Waits for all fonts and images to load
 *   - Renders to A4 PDF with print stylesheet applied
 *   - Returns the PDF buffer directly to the client
 *
 * Flambeaux print standards:
 *   - A4 landscape (297mm × 210mm) — matches the report's wide grid layout
 *   - Margins: 0 (sections handle their own padding)
 *   - Print background: true (preserves navy/cream color blocks)
 *   - Scale: 0.85 (fits the 1100px max-width into A4 without clipping)
 */

import { Router, type Request, type Response } from 'express';
import puppeteer from 'puppeteer-core';
import { sdk } from './_core/sdk';

const router = Router();

// Detect the running server port from the environment or default
function getServerPort(): number {
  return parseInt(process.env.PORT ?? '3000', 10);
}

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

export default router;
