/**
 * capture-pdf.ts — Screenshot-to-PDF helper.
 *
 * Lane 6 · Council Final Apr 23 2026
 * Replaces all bespoke jsPDF render paths across the codebase.
 * Every route's "Download PDF" button calls this helper.
 *
 * Usage:
 *   import { captureToPdf } from '@/lib/capture-pdf';
 *   await captureToPdf(divRef.current, 'christies-market-report.pdf');
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Captures a DOM element as a high-resolution screenshot and saves it as a PDF.
 *
 * @param element  The root DOM element to capture (use a React ref).
 * @param filename The output filename (include .pdf extension).
 */
export async function captureToPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,               // 2× resolution for print quality
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgH = (canvas.height * pageW) / canvas.width;

  let heightLeft = imgH;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
  heightLeft -= pageH;

  while (heightLeft > 0) {
    position = heightLeft - imgH;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
    heightLeft -= pageH;
  }

  pdf.save(filename);
}
