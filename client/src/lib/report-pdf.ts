/**
 * report-pdf.ts
 *
 * Downloads the Market Report PDF by calling the server-side /api/pdf/report
 * endpoint, which uses Puppeteer + system Chromium to render the live /report
 * page and return a pixel-accurate PDF.
 *
 * This approach bypasses all client-side color-parsing limitations (e.g.,
 * html2canvas cannot handle Tailwind 4's oklch() CSS color functions).
 *
 * Called from: ReportPage.tsx Section1 → handleDownload
 */

export async function generateReportPdf(): Promise<void> {
  const response = await fetch("/api/pdf/report", { method: "GET" });

  if (!response.ok) {
    const detail = await response.text().catch(() => "unknown error");
    throw new Error(`PDF generation failed (${response.status}): ${detail}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Christies_EH_Market_Report.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
