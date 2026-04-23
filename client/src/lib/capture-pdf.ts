/**
 * capture-pdf.ts — Screenshot-to-PDF helper.
 *
 * Lane 6 · Council Final Apr 23 2026 · F2 reflow
 * Replaces all bespoke jsPDF render paths across the codebase.
 * Every route's "Download PDF" button calls this helper.
 *
 * Page-split strategy:
 *   1. If the root element contains children with [data-pdf-page="N"] attributes,
 *      each marker is captured as its own canvas and placed on its own PDF page.
 *      This gives deterministic, content-aware page breaks.
 *   2. If no markers are found, falls back to the naive threshold split
 *      (original behaviour — single tall canvas sliced every letter-height).
 *
 * Usage:
 *   import { captureToPdf } from '@/lib/capture-pdf';
 *   await captureToPdf(divRef.current, 'christies-market-report.pdf');
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const SCALE = 2; // 2× resolution for print quality

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
  const pdf = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // ── Deterministic split via [data-pdf-page] markers ─────────────────────────────
  const markers = Array.from(
    element.querySelectorAll<HTMLElement>('[data-pdf-page]')
  ).sort((a, b) => {
    const na = parseInt(a.getAttribute('data-pdf-page') ?? '0', 10);
    const nb = parseInt(b.getAttribute('data-pdf-page') ?? '0', 10);
    return na - nb;
  });

  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const canvas = await html2canvas(marker, {
        scale: SCALE,
        useCORS: true,
        backgroundColor: '#0D1B2A',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgH = (canvas.height * pageW) / canvas.width;

      if (i > 0) pdf.addPage();

      if (imgH <= pageH) {
        // Content fits on one page — place at top
        pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);
      } else {
        // Content taller than one page — slice it
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
      }
    }
    pdf.save(filename);
    return;
  }

  // ── Fallback: single-canvas naive threshold split ───────────────────────────
  const canvas = await html2canvas(element, {
    scale: SCALE,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
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
