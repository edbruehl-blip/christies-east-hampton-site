/**
 * report-pdf.ts
 *
 * Downloads the Market Report PDF using the client-side jsPDF engine.
 * This is the same approach used for all other PDF exports on the platform
 * (hamlet PDFs, Christie's Letter, Deal Brief, etc.) and works without
 * any server dependency or Chromium requirement.
 *
 * The Puppeteer /api/pdf/report route was removed because the production
 * deployment container does not have Chromium installed.
 *
 * Called from: ReportPage.tsx → handlePdfDownload + handleDownload
 */

import { generateMarketReport } from './pdf-exports';

export async function generateReportPdf(): Promise<void> {
  await generateMarketReport();
}
