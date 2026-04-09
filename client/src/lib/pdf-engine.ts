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
 *   Line 1: "Art. Beauty. Provenance. · Christie's International Real Estate Group · Est. 1766"
 *   Line 2: "26 Park Place, East Hampton, NY 11937 · 646-752-1233"
 *
 * CDN assets (confirmed image/jpeg or image/png, 200 OK):
 *   Ed headshot:  https://files.manuscdn.com/user_upload_by_module/session_file/115914870/...
 *   CIREG logo:   https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png  (black, for light bg)
 *   QR code:      generated inline via qrcode.js (no external dep needed — use placeholder box)
 */

import jsPDF from 'jspdf';
import { ED_HEADSHOT_PRIMARY, LOGO_BLACK_B64 } from './cdn-assets';
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
    // Route external CDN URLs through the server-side image proxy to avoid CORS failures.
    // Same-origin URLs (relative paths) are fetched directly.
    const fetchUrl = url.startsWith('http')
      ? `/api/img-proxy?url=${encodeURIComponent(url)}`
      : url;
    const res = await fetch(fetchUrl, { mode: 'cors' });
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
  // Flambeaux standard: CIREG logo centered at top, single gold rule beneath
  // Title centered in serif treatment (Helvetica-Bold approximates Cormorant Garamond)
  const cx = PAGE.w / 2;

  // CIREG logo — centered, 44mm wide
  if (logoImgData) {
    try {
      doc.addImage(logoImgData, 'PNG', cx - 22, 8, 44, 17);
    } catch { /* skip */ }
  } else {
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.setFont('helvetica', 'bold');
    doc.text("CHRISTIE'S INTERNATIONAL REAL ESTATE GROUP", cx, 18, { align: 'center' });
  }

  // Single gold rule beneath logo
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, 28, PAGE.w - PAGE.mr, 28);

  // Title — centered, gold, serif-weight
  doc.setFontSize(15);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text(title, cx, 38, { align: 'center' });

  // Subtitle — centered, muted
  if (subtitle) {
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, cx, 45, { align: 'center' });
  }

  // Horizontal rule under title
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, 50, PAGE.w - PAGE.mr, 50);

  // Date line — right-aligned, small
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, PAGE.w - PAGE.mr, 45, { align: 'right' });

  return 56; // y start for body (generous spacing after header)
}

// ─── Universal PDF header (Sprint 41 consolidation) ─────────────────────────

/**
 * drawPdfHeader — single shared header for every PDF export.
 *
 * Variants:
 *   'standard'  — centered logo, gold rule, title + subtitle block (portrait, white bg)
 *                 Used by: ANEW Build, CMA, Deal Brief, Investment Memo, EH Village, Broker Onboarding
 *   'letter'    — centered logo, gold rule, no title block (portrait, white bg, letter format)
 *                 Used by: Christie's Letter, Flagship Letter
 *   'navy-bar'  — full-width navy band, left-aligned logo, gold rule (portrait)
 *                 Used by: Market Report p1, Card Stock p1
 *   'landscape' — left-aligned logo, gold rule, centered title (landscape)
 *                 Used by: Ascension Arc
 *
 * Always uses LOGO_BLACK_B64 from loadPdfAssets() — never a CDN URL.
 * Returns the Y coordinate where body content should begin.
 */
export function drawPdfHeader(
  doc: jsPDF,
  logoImgData: string,
  opts: {
    variant: 'standard' | 'letter' | 'navy-bar' | 'landscape';
    title?: string;
    subtitle?: string;
    /** Page width override for landscape (default: PAGE.w) */
    pageW?: number;
    /** Page margin override (default: PAGE.ml) */
    ml?: number;
    mr?: number;
  },
): number {
  const {
    variant,
    title = '',
    subtitle = '',
    pageW = PAGE.w,
    ml = PAGE.ml,
    mr = PAGE.mr,
  } = opts;
  const cx = pageW / 2;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (variant === 'navy-bar') {
    // ── Navy header bar (portrait) ──────────────────────────────────────────
    doc.setFillColor(...C.navy);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.8);
    doc.line(ml, 28, pageW - mr, 28);
    const py = 6;
    if (logoImgData) {
      // Navy bar: 16×4mm logo (aspect 3.965:1) left-aligned
      try { doc.addImage(logoImgData, 'PNG', ml, py + 4, 16, 4); } catch { /* skip */ }
    }
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.gold);
    doc.text("CHRISTIE'S INTERNATIONAL REAL ESTATE GROUP", ml + 20, py + 5);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.cream);
    doc.text('East Hampton · 26 Park Place · 646-752-1233', ml + 20, py + 10);
    if (title) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...C.cream);
      doc.text(title, pageW - mr, py + 5, { align: 'right' });
    }
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.cream);
    doc.text(dateStr, pageW - mr, py + 10, { align: 'right' });
    return 34; // y start for body
  }

  if (variant === 'landscape') {
    // ── Landscape header ────────────────────────────────────────────────────
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.8);
    doc.line(ml, 8, pageW - mr, 8);
    if (logoImgData) {
      // Landscape: 44×11mm logo (aspect 3.965:1) left-aligned
      try { doc.addImage(logoImgData, 'PNG', ml, 10, 44, 11); } catch {
        doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.navy);
        doc.text("CHRISTIE'S INTERNATIONAL REAL ESTATE GROUP", ml, 17);
      }
    }
    if (title) {
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...C.navy);
      doc.text(title, cx, 15, { align: 'center' });
    }
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...C.muted);
    doc.text(dateStr, pageW - mr, 13, { align: 'right' });
    if (subtitle) doc.text(subtitle, pageW - mr, 17.5, { align: 'right' });
    doc.setDrawColor(...C.gold); doc.setLineWidth(0.3);
    doc.line(ml, 22, pageW - mr, 22);
    return 26; // y start for body
  }

  if (variant === 'letter') {
    // ── Letter format (Christie's Letter, Flagship Letter) ──────────────────
    // 44×17mm at Y=8 matches the working drawHeader() dimensions exactly
    if (logoImgData) {
      try { doc.addImage(logoImgData, 'PNG', cx - 22, 8, 44, 17); } catch { /* skip */ }
    } else {
      doc.setFontSize(9); doc.setTextColor(...C.navy); doc.setFont('helvetica', 'bold');
      doc.text("CHRISTIE'S INTERNATIONAL REAL ESTATE GROUP", cx, 18, { align: 'center' });
    }
    doc.setDrawColor(...C.gold); doc.setLineWidth(0.6);
    doc.line(ml, 28, pageW - mr, 28);
    return 36; // y start for body (caller adds date block)
  }

  // ── Standard (default) ────────────────────────────────────────────────────
  // Centered logo, gold rule, title + subtitle, date right-aligned
  if (logoImgData) {
    try { doc.addImage(logoImgData, 'PNG', cx - 22, 8, 44, 11); } catch { /* skip */ }
  } else {
    doc.setFontSize(9); doc.setTextColor(...C.navy); doc.setFont('helvetica', 'bold');
    doc.text("CHRISTIE'S INTERNATIONAL REAL ESTATE GROUP", cx, 18, { align: 'center' });
  }
  doc.setDrawColor(...C.gold); doc.setLineWidth(0.5);
  doc.line(ml, 28, pageW - mr, 28);
  if (title) {
    doc.setFontSize(15); doc.setTextColor(...C.gold); doc.setFont('helvetica', 'bold');
    doc.text(title, cx, 38, { align: 'center' });
  }
  if (subtitle) {
    doc.setFontSize(8); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
    doc.text(subtitle, cx, 45, { align: 'center' });
  }
  doc.setDrawColor(...C.gold); doc.setLineWidth(0.3);
  doc.line(ml, 50, pageW - mr, 50);
  doc.setFontSize(6.5); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
  doc.text(dateStr, pageW - mr, 45, { align: 'right' });
  return 56;
}

// ─── Shared footer ────────────────────────────────────────────────────────────

export function drawFooter(doc: jsPDF, pageNum: number, totalPages: number, qrImg = '') {
  // Flambeaux standard: footer rule at bottom, Christie's address centered, Private & Confidential
  const y = PAGE.h - 16;
  const cx = PAGE.w / 2;

  // Gold footer rule
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, y, PAGE.w - PAGE.mr, y);

  // Christie's address — centered
  doc.setFontSize(6.5);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'normal');
  doc.text("Christie's International Real Estate Group · 26 Park Place, East Hampton NY 11937", cx, y + 5, { align: 'center' });

  // Private & Confidential — centered, small caps style
  doc.setFontSize(5.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIVATE & CONFIDENTIAL', cx, y + 10, { align: 'center' });

  // Page number — right-aligned
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(`${pageNum} / ${totalPages}`, PAGE.w - PAGE.mr, y + 5, { align: 'right' });

  // QR code — left side
  if (qrImg) {
    try {
      doc.addImage(qrImg, 'PNG', PAGE.ml, y - 1, 12, 12);
    } catch {
      doc.setFillColor(240, 238, 234);
      doc.rect(PAGE.ml, y - 1, 12, 12, 'F');
    }
  } else {
    doc.setFillColor(240, 238, 234);
    doc.rect(PAGE.ml, y - 1, 12, 12, 'F');
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
    h.medianPriceDisplay,
    `${h.anewScore} / 10`,
    `${h.volumeShare}%`,
  ]);

  // Simple manual table
  const cols = ['Hamlet', 'Median Price', 'CIS Score', 'Vol. Share'];
  const colW = [60, 45, 40, 31];
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

const QR_LINKTREE_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/qr-linktree_61501da5.png'; // permanent webdev CDN (re-uploaded Sprint 24)

export async function loadPdfAssets(): Promise<{ edImg: string; logoImg: string; qrImg: string }> {
  // Logo is base64-embedded — no CDN fetch needed, always renders cleanly
  const logoImg = LOGO_BLACK_B64;
  const [edImg, qrImg] = await Promise.all([
    loadImageAsDataUrl(ED_HEADSHOT_PRIMARY),
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
