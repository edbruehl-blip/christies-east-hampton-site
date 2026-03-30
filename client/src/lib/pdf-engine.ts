/**
 * PDF ENGINE — Christie's East Hampton
 * Shared utilities for all five export types.
 *
 * Design tokens (mirrored from index.css):
 *   Navy   #1B2A4A   Charcoal #384249   Gold #C8AC78   Cream #FAF8F4
 *
 * Fonts: Helvetica (jsPDF built-in) used throughout.
 *   Cormorant Garamond is a web font — not embeddable in jsPDF without WOFF2 base64.
 *   We approximate with Helvetica-Bold for display headings.
 *
 * Two doctrine lines (footer, every page):
 *   Line 1: "Always the Family's Interest Before the Sale. The Name Follows."
 *   Line 2: "Christie's International Real Estate Group · Est. 1766 · East Hampton"
 *
 * CDN assets (confirmed image/jpeg or image/png, 200 OK):
 *   Ed headshot:  https://files.manuscdn.com/user_upload_by_module/session_file/115914870/...
 *   CIREG logo:   https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png  (black, for light bg)
 *   QR code:      generated inline via qrcode.js (no external dep needed — use placeholder box)
 */

import jsPDF from 'jspdf';
import { ED_HEADSHOT_PRIMARY, LOGO_BLACK } from './cdn-assets';
import { MASTER_HAMLET_DATA } from '../data/hamlet-master';
import type { AnewOutput } from '../calculators/anew-calculator';

// ─── Color constants ──────────────────────────────────────────────────────────

export const C = {
  navy:    [27,  42,  74]  as [number, number, number],
  gold:    [200, 172, 120] as [number, number, number],
  cream:   [250, 248, 244] as [number, number, number],
  charcoal:[56,  66,  73]  as [number, number, number],
  white:   [255, 255, 255] as [number, number, number],
  muted:   [122, 138, 142] as [number, number, number],
  red:     [192, 57,  43]  as [number, number, number],
};

// ─── Page geometry ────────────────────────────────────────────────────────────

export const PAGE = {
  w: 215.9,   // letter width mm
  h: 279.4,   // letter height mm
  ml: 18,     // margin left
  mr: 18,     // margin right
  mt: 18,     // margin top (after header)
  mb: 22,     // margin bottom (before footer)
  contentW: 215.9 - 36, // 179.9mm
};

// ─── Image cache ──────────────────────────────────────────────────────────────

const _imgCache: Record<string, string> = {};

export async function loadImageAsDataUrl(url: string): Promise<string> {
  if (_imgCache[url]) return _imgCache[url];
  try {
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        _imgCache[url] = result;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Return empty string — caller will skip image gracefully
    return '';
  }
}

// ─── Shared header ────────────────────────────────────────────────────────────

/**
 * Draws the navy header band on the current page.
 * Returns the Y coordinate where body content should begin.
 */
export async function drawHeader(
  doc: jsPDF,
  title: string,
  subtitle: string,
  edImgData: string,
  logoImgData: string,
): Promise<number> {
  const bandH = 38;

  // Navy band
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PAGE.w, bandH, 'F');

  // Gold rule at bottom of band
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(0, bandH, PAGE.w, bandH);

  // Ed headshot (circular crop approximated with clipping)
  if (edImgData) {
    try {
      doc.addImage(edImgData, 'JPEG', PAGE.ml, 5, 20, 20);
    } catch { /* skip */ }
  } else {
    // Placeholder box
    doc.setFillColor(...C.charcoal);
    doc.rect(PAGE.ml, 5, 20, 20, 'F');
    doc.setFontSize(5);
    doc.setTextColor(...C.gold);
    doc.text('ED BRUEHL', PAGE.ml + 10, 15, { align: 'center' });
  }

  // Title block (right of headshot)
  const tx = PAGE.ml + 24;
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('CHRISTIE\'S EAST HAMPTON · ED BRUEHL · MANAGING DIRECTOR', tx, 11);

  doc.setFontSize(13);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text(title, tx, 20);

  doc.setFontSize(8);
  doc.setTextColor(200, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, tx, 27);

  // CIREG logo (top-right)
  if (logoImgData) {
    try {
      doc.addImage(logoImgData, 'PNG', PAGE.w - PAGE.mr - 36, 8, 36, 14);
    } catch { /* skip */ }
  }

  // Date line (bottom of band)
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.setFontSize(6.5);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, PAGE.w - PAGE.mr, bandH - 4, { align: 'right' });

  return bandH + 8; // y start for body
}

// ─── Shared footer ────────────────────────────────────────────────────────────

export function drawFooter(doc: jsPDF, pageNum: number, totalPages: number, qrImg = '') {
  const y = PAGE.h - 14;

  // Gold rule
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, y, PAGE.w - PAGE.mr, y);

  // Doctrine line 1
  doc.setFontSize(6.5);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'bolditalic');
  doc.text("Always the Family's Interest Before the Sale. The Name Follows.", PAGE.ml, y + 4);

  // Doctrine line 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.muted);
  doc.text("Christie's International Real Estate Group · Est. 1766 · East Hampton", PAGE.ml, y + 8);

  // Page number
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.text(`${pageNum} / ${totalPages}`, PAGE.w - PAGE.mr, y + 4, { align: 'right' });

  // QR code — linktr.ee/edbruehlrealestate
  if (qrImg) {
    try {
      doc.addImage(qrImg, 'PNG', PAGE.w - PAGE.mr - 12, y - 1, 12, 12);
    } catch {
      doc.setFillColor(240, 238, 234);
      doc.rect(PAGE.w - PAGE.mr - 12, y - 1, 12, 12, 'F');
    }
  } else {
    doc.setFillColor(240, 238, 234);
    doc.rect(PAGE.w - PAGE.mr - 12, y - 1, 12, 12, 'F');
  }
}

// ─── Section label ────────────────────────────────────────────────────────────

export function sectionLabel(doc: jsPDF, text: string, y: number): number {
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text(text.toUpperCase(), PAGE.ml, y);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, y + 1.5, PAGE.w - PAGE.mr, y + 1.5);
  return y + 6;
}

// ─── Key-value row ────────────────────────────────────────────────────────────

export function kvRow(doc: jsPDF, label: string, value: string, y: number, highlight = false): number {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.charcoal);
  doc.text(label, PAGE.ml, y);

  doc.setFont('helvetica', highlight ? 'bold' : 'normal');
  doc.setTextColor(highlight ? C.navy[0] : C.charcoal[0], highlight ? C.navy[1] : C.charcoal[1], highlight ? C.navy[2] : C.charcoal[2]);
  doc.text(value, PAGE.ml + 70, y);
  return y + 6;
}

// ─── Score badge ──────────────────────────────────────────────────────────────

export function drawScoreBadge(doc: jsPDF, score: number, verdict: string, x: number, y: number) {
  const verdictColors: Record<string, [number, number, number]> = {
    'Institutional': C.navy,
    'Executable':    C.gold,
    'Marginal':      [224, 123, 57],
    'Pass':          C.red,
  };
  const bg = verdictColors[verdict] ?? C.red;

  // Circle
  doc.setFillColor(...bg);
  doc.circle(x, y, 10, 'F');

  // Score number
  doc.setFontSize(14);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score}`, x, y + 1.5, { align: 'center', baseline: 'middle' });

  // Verdict label below
  doc.setFontSize(7);
  doc.setTextColor(...bg);
  doc.setFont('helvetica', 'bold');
  doc.text(verdict.toUpperCase(), x, y + 14, { align: 'center' });
}

// ─── Hamlet comps table ───────────────────────────────────────────────────────

export function drawHamletCompsTable(doc: jsPDF, y: number): number {
  y = sectionLabel(doc, 'South Fork Market Comps', y);

  const rows = MASTER_HAMLET_DATA.map(h => [
    h.name,
    h.tier,
    h.medianPriceDisplay,
    `${h.anewScore}`,
    `${h.volumeShare}%`,
  ]);

  // Simple manual table
  const cols = ['Hamlet', 'Tier', 'Median Price', 'ANEW Score', 'Vol. Share'];
  const colW = [50, 35, 35, 28, 28];
  const rowH = 6;

  // Header row
  doc.setFillColor(...C.navy);
  doc.rect(PAGE.ml, y, PAGE.contentW, rowH, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  let cx = PAGE.ml + 2;
  cols.forEach((col, i) => {
    doc.text(col, cx, y + 4);
    cx += colW[i];
  });
  y += rowH;

  // Data rows
  rows.forEach((row, ri) => {
    const bg = ri % 2 === 0 ? C.cream : [245, 243, 239] as [number, number, number];
    doc.setFillColor(...bg);
    doc.rect(PAGE.ml, y, PAGE.contentW, rowH, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.charcoal);
    cx = PAGE.ml + 2;
    row.forEach((cell, i) => {
      doc.text(cell, cx, y + 4);
      cx += colW[i];
    });
    y += rowH;
  });

  return y + 6;
}

// ─── Trigger download ─────────────────────────────────────────────────────────

export function downloadPdf(doc: jsPDF, filename: string) {
  doc.save(filename);
}

// ─── Pre-load both CDN images ─────────────────────────────────────────────────

const QR_LINKTREE_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/PyhWsQjMFaamcdei.png';

export async function loadPdfAssets(): Promise<{ edImg: string; logoImg: string; qrImg: string }> {
  const [edImg, logoImg, qrImg] = await Promise.all([
    loadImageAsDataUrl(ED_HEADSHOT_PRIMARY),
    loadImageAsDataUrl(LOGO_BLACK),
    loadImageAsDataUrl(QR_LINKTREE_URL),
  ]);
  return { edImg, logoImg, qrImg };
}

// ─── Format helpers ───────────────────────────────────────────────────────────

export function fmtUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function today(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Wrap text helper ─────────────────────────────────────────────────────────

export function wrapText(doc: jsPDF, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const lines = doc.splitTextToSize(text, maxW);
  doc.text(lines, x, y);
  return y + lines.length * lineH;
}

// ─── Re-export AnewOutput for convenience ─────────────────────────────────────

export type { AnewOutput };
