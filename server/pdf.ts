/**
 * server/pdf.ts
 *
 * Express route: GET /api/pdf/report
 *
 * Uses puppeteer-core with:
 *   - @sparticuz/chromium in production (serverless-compatible, bundled binary)
 *   - System Chromium (/usr/bin/chromium-browser) in local development
 *
 * This bypasses all color-parsing limitations of html2canvas (oklch).
 */

import type { Express, Request, Response } from "express";
import puppeteer from "puppeteer-core";

async function getChromiumPath(): Promise<string> {
  // In production, use @sparticuz/chromium which bundles its own binary
  if (process.env.NODE_ENV === "production") {
    const chromium = await import("@sparticuz/chromium");
    return await chromium.default.executablePath();
  }
  // In development, use the system Chromium
  return "/usr/bin/chromium-browser";
}

async function getChromiumArgs(): Promise<string[]> {
  const baseArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
  ];

  if (process.env.NODE_ENV === "production") {
    const chromium = await import("@sparticuz/chromium");
    return [...chromium.default.args, ...baseArgs];
  }

  return baseArgs;
}

export function registerPdfRoute(app: Express, serverPort: number): void {
  app.get("/api/pdf/report", async (req: Request, res: Response) => {
    let browser;
    try {
      const [executablePath, args] = await Promise.all([
        getChromiumPath(),
        getChromiumArgs(),
      ]);

      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args,
      });

      const page = await browser.newPage();

      // Mobile viewport — matches the mobile/web view exactly
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

      // Navigate to the live /report page on this same server
      const reportUrl = `http://localhost:${serverPort}/report`;
      await page.goto(reportUrl, { waitUntil: "networkidle0", timeout: 30000 });

      // Wait for the hero image and letter to render
      await page.waitForSelector("#report-page-content", { timeout: 10000 });

      // Small extra delay to allow fonts and images to settle
      await new Promise(resolve => setTimeout(resolve, 1500));

      const pdfBuffer = await page.pdf({
        width: "390px",
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="Christies_EH_Market_Report.pdf"'
      );
      res.send(Buffer.from(pdfBuffer));
    } catch (err) {
      console.error("[PDF] Generation failed:", err);
      res.status(500).json({ error: "PDF generation failed", detail: String(err) });
    } finally {
      if (browser) await browser.close();
    }
  });
}
