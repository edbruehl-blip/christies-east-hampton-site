/**
 * PDF EXPORTS -- Five export types for Christie's East Hampton
 *
 * Each function is async, generates a jsPDF document, and triggers download.
 * All pull live data from AnewOutput + hamlet-master. No hardcoded values.
 *
 * Export types:
 *   1. generateAnewBuildMemo(result)       -- 2 pages
 *   2. generateChristieCMA(result)         -- 2 pages
 *   3. generateDealBrief(result)           -- 1 page
 *   4. generateInvestmentMemo(result)      -- 2 pages
 *   5. generateMarketReport(opts?)         -- 5 pages (standalone, live Market Matrix data)
 *
 * Item 5 council-approved structure (Apr 7 2026, updated Sprint 25):
 *   Page 1 → Navy hero + twelve-paragraph founding letter + Ed signature block
 *   Page 2 → Hamlet Atlas rows 1–5 (photo thumbnail, CIS, median, vol, vibe)
 *   Page 3 → Hamlet Atlas rows 6–10 (same format)
 *   Page 4 → Hamlet Atlas row 11 (Wainscott) + doctrine block
 *   Page 5 → Closing paragraph + Ed headshot + contact block + two QR codes
 */

import jsPDF from 'jspdf';
import {
  C, PAGE,
  drawHeader, drawPdfHeader, drawFooter, sectionLabel, kvRow,
  drawScoreBadge, drawHamletCompsTable,
  loadPdfAssets, downloadPdf, fmtUSD, fmtPct, today, wrapText,
  type AnewOutput,
} from './pdf-engine';
import { MASTER_HAMLET_DATA } from '../data/hamlet-master';
import { LENS_LABELS } from '../calculators/anew-calculator';
import { loadImageAsDataUrl } from './pdf-engine';
import { LOGO_WHITE_B64 } from './cdn-assets';

// Type alias for live Market Matrix rows -- exact mirror of server/sheets-helper.ts MarketMatrixHamlet
// Field names must match the tRPC response shape from trpc.market.hamletMatrix.useQuery()
export interface LiveMatrixRow {
  hamlet: string;
  cisScore: number;          // server field: cisScore
  median2025: string;        // server field: median2025
  dollarVolumeShare: string; // server field: dollarVolumeShare (e.g. "7%")
  dollarVolume2025: string;  // server field: dollarVolume2025
  sales2025: number;         // server field: sales2025
  direction4Year: string;    // server field: direction4Year ("Up" | "Down" | "Flat")
  schoolDistrict: string;    // server field: schoolDistrict
  median2022: string;        // server field: median2022
  median2023: string;        // server field: median2023
  median2024: string;        // server field: median2024
}

// ─── 1. ANEW Build Memo (2 pages) ─────────────────────────────────────────────

export async function generateAnewBuildMemo(result: AnewOutput): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const hamlet = MASTER_HAMLET_DATA.find(h => h.id === result.hamletId)!;

  // ── PAGE 1 ──
  let y = await drawHeader(doc, 'ANEW Build Memo', `${result.address} · ${result.hamletName}`, edImg, logoImg);

  // Score badge (right side)
  drawScoreBadge(doc, result.score, result.verdict, PAGE.w - PAGE.mr - 15, y + 10);

  // Property summary
  y = sectionLabel(doc, 'Property Summary', y);
  y = kvRow(doc, 'Address', result.address, y);
  y = kvRow(doc, 'Hamlet', result.hamletName, y);
  y = kvRow(doc, 'Lens', LENS_LABELS[result.lens], y);
  y = kvRow(doc, 'Date', today(), y);
  y += 4;

  // Financial analysis
  y = sectionLabel(doc, 'Financial Analysis', y);
  y = kvRow(doc, 'All-In Cost', result.allInDisplay, y, true);
  y = kvRow(doc, 'Exit Price', result.exitDisplay, y, true);
  y = kvRow(doc, 'Spread', result.spreadDisplay, y, result.spread > 0);
  y = kvRow(doc, 'Spread %', result.spreadPctDisplay, y, result.spread > 0);
  y += 4;

  // CIS Score block
  y = sectionLabel(doc, 'CIS', y);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text(`${result.score}`, PAGE.ml, y + 8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text(`${result.verdict} · ${result.spreadPctDisplay} spread`, PAGE.ml + 20, y + 8);
  y += 16;

  // Strategic classification
  if (result.strategicClassification) {
    doc.setFillColor(27, 42, 74, 0.06);
    doc.setFillColor(240, 238, 234);
    doc.rect(PAGE.ml, y, PAGE.contentW, 14, 'F');
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(1.5);
    doc.line(PAGE.ml, y, PAGE.ml, y + 14);
    doc.setFontSize(7);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('STRATEGIC CLASSIFICATION', PAGE.ml + 4, y + 5);
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.text(result.strategicClassification, PAGE.ml + 4, y + 11);
    y += 20;
  }

  // Hamlet intelligence
  y = sectionLabel(doc, 'Hamlet Intelligence', y);
  y = kvRow(doc, 'Median Price', hamlet.medianPriceDisplay, y);
  y = kvRow(doc, 'CIS Score (Hamlet)', `${hamlet.anewScore} / 10`, y);
  y = kvRow(doc, 'Share of Hamptons Dollar Volume', `${hamlet.volumeShare}% of Hamptons dollar volume`, y);
  y = kvRow(doc, 'Last Notable Sale', `${hamlet.lastSale} · ${hamlet.lastSalePrice} · ${hamlet.lastSaleDate}`, y);
  y += 4;

  // Mentor line
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...C.charcoal);
  y = wrapText(doc, `"${result.mentorLine}"`, PAGE.ml, y, PAGE.contentW - 30, 5);

  drawFooter(doc, 1, 2, qrImg);

  // ── PAGE 2 ──
  doc.addPage();
  y = await drawHeader(doc, 'ANEW Build Memo', 'East End Market Context', edImg, logoImg);

  y = drawHamletCompsTable(doc, y);

  // Methodology note
  y = sectionLabel(doc, 'Methodology', y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const methodology = [
    'The Christie\'s Intelligence Score (0–100) is computed from three inputs: (1) Gross Financial Attractiveness derived from',
    'the spread percentage between all-in cost and projected exit price; (2) Hamlet Quality Score based on',
    'CIS hamlet multiplier; (3) CIS Intelligence Contribution from the hamlet\'s',
    'institutional score. Thresholds: 85–100 = Institutional · 70–84 = Executable · 55–69 = Marginal · <55 = Pass.',
  ];
  methodology.forEach(line => {
    doc.text(line, PAGE.ml, y);
    y += 5;
  });
  y += 4;

  // Disclaimer
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'italic');
  const disclaimer = 'This memo is prepared by Christie\'s East Hampton. All projections are estimates based on current market data and are not guarantees of future performance.';
  y = wrapText(doc, disclaimer, PAGE.ml, y, PAGE.contentW, 4.5);

  drawFooter(doc, 2, 2, qrImg);

  downloadPdf(doc, `Christies_EH_ANEW_Build_Memo_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 2. Christie CMA (2 pages) ────────────────────────────────────────────────

export async function generateChristieCMA(result: AnewOutput): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const hamlet = MASTER_HAMLET_DATA.find(h => h.id === result.hamletId)!;

  // ── PAGE 1 ──
  let y = await drawHeader(doc, 'Christie\'s Comparative Market Analysis', `${result.address} · ${result.hamletName}`, edImg, logoImg);

  // Subject property
  y = sectionLabel(doc, 'Subject Property', y);
  y = kvRow(doc, 'Address', result.address, y);
  y = kvRow(doc, 'Hamlet', result.hamletName, y);
  y = kvRow(doc, 'Analysis Date', today(), y);
  y = kvRow(doc, 'Prepared By', 'Ed Bruehl · Managing Director · Christie\'s East Hampton', y);
  y += 4;

  // Market position
  y = sectionLabel(doc, 'Market Position', y);
  y = kvRow(doc, 'Hamlet Median Price', hamlet.medianPriceDisplay, y, true);
  y = kvRow(doc, 'CIS Score (Hamlet)', `${hamlet.anewScore} / 10`, y);
  y = kvRow(doc, 'Share of Hamptons Dollar Volume', `${hamlet.volumeShare}% of Hamptons dollar volume`, y);
  y += 4;

  // Pricing analysis
  y = sectionLabel(doc, 'Pricing Analysis', y);
  y = kvRow(doc, 'Estimated Value', result.exitDisplay, y, true);
  y = kvRow(doc, 'All-In Basis', result.allInDisplay, y);
  y = kvRow(doc, 'Value Spread', result.spreadDisplay, y, result.spread > 0);
  y = kvRow(doc, 'Spread %', result.spreadPctDisplay, y, result.spread > 0);
  y = kvRow(doc, 'CIS', `${result.score} -- ${result.verdict}`, y);
  y += 4;

  // Last comparable sale
  y = sectionLabel(doc, 'Last Comparable Sale', y);
  y = kvRow(doc, 'Address', hamlet.lastSale, y);
  y = kvRow(doc, 'Sale Price', hamlet.lastSalePrice, y, true);
  y = kvRow(doc, 'Sale Date', hamlet.lastSaleDate, y);
  y += 4;

  // Strategic classification
  if (result.strategicClassification) {
    doc.setFillColor(240, 238, 234);
    doc.rect(PAGE.ml, y, PAGE.contentW, 14, 'F');
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(1.5);
    doc.line(PAGE.ml, y, PAGE.ml, y + 14);
    doc.setFontSize(7);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('STRATEGIC CLASSIFICATION', PAGE.ml + 4, y + 5);
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.text(result.strategicClassification, PAGE.ml + 4, y + 11);
    y += 20;
  }

  // Recommendation
  y = sectionLabel(doc, 'Christie\'s Recommendation', y);
  const recText = result.spread > 0
    ? `Based on current East End market conditions and the Christie's Intelligence Score model, this property presents a ${result.verdict.toLowerCase()} opportunity. The ${result.spreadPctDisplay} spread against all-in basis supports the estimated value of ${result.exitDisplay}. Christie's East Hampton recommends proceeding with confidence.`
    : `Current market conditions indicate a negative spread of ${result.spreadDisplay} against all-in basis. Christie's East Hampton recommends a pricing review before proceeding. The CIS score of ${result.score} reflects current market headwinds in ${result.hamletName}.`;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  y = wrapText(doc, recText, PAGE.ml, y, PAGE.contentW, 5.5);

  drawFooter(doc, 1, 2, qrImg);

  // ── PAGE 2 -- Full hamlet comps ──
  doc.addPage();
  y = await drawHeader(doc, 'Christie\'s CMA', 'East End Hamlet Comparison', edImg, logoImg);
  y = drawHamletCompsTable(doc, y);

  // Agent certification block
  y += 4;
  y = sectionLabel(doc, 'Agent Certification', y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('Ed Bruehl · Managing Director · Christie\'s International Real Estate Group · East Hampton', PAGE.ml, y);
  y += 5;
  doc.text('M: 646.752.1233  ·  O: 631.771.7004  ·  edbruehl@christiesrealestategroup.com  ·  26 Park Place, East Hampton NY 11937', PAGE.ml, y);
  y += 10;

  // Signature line
  doc.setDrawColor(...C.navy);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, y, PAGE.ml + 60, y);
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text('Signature · Ed Bruehl', PAGE.ml, y + 4);

  doc.text(today(), PAGE.ml + 80, y);
  doc.line(PAGE.ml + 75, y, PAGE.ml + 120, y);
  doc.text('Date', PAGE.ml + 80, y + 4);

  drawFooter(doc, 2, 2, qrImg);

  downloadPdf(doc, `Christies_EH_CMA_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 3. Deal Brief (1 page) ───────────────────────────────────────────────────

export async function generateDealBrief(result: AnewOutput): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const hamlet = MASTER_HAMLET_DATA.find(h => h.id === result.hamletId)!;

  let y = await drawHeader(doc, 'Deal Brief', `${result.address}`, edImg, logoImg);

  // Deal header bar
  doc.setFillColor(...C.navy);
  doc.rect(PAGE.ml, y, PAGE.contentW, 12, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.cream);
  doc.text(result.address, PAGE.ml + 4, y + 8);
  // Score badge inline
  const verdictColors: Record<string, [number, number, number]> = {
    'Institutional': C.gold,
    'Executable':    C.gold,
    'Marginal':      [224, 123, 57],
    'Pass':          C.red,
  };
  const badgeColor = verdictColors[result.verdict] ?? C.red;
  doc.setFontSize(8);
  doc.setTextColor(...badgeColor);
  doc.text(`ANEW ${result.score} -- ${result.verdict}`, PAGE.w - PAGE.mr - 4, y + 8, { align: 'right' });
  y += 18;

  // Two-column layout
  const col1x = PAGE.ml;
  const col2x = PAGE.ml + PAGE.contentW / 2 + 4;
  const colW = PAGE.contentW / 2 - 4;

  // Left column
  let ly = y;
  ly = sectionLabel(doc, 'Deal Snapshot', ly);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const snapRows = [
    ['Hamlet', result.hamletName],
    ['Lens', LENS_LABELS[result.lens]],
    ['All-In', result.allInDisplay],
    ['Exit', result.exitDisplay],
    ['Spread', result.spreadDisplay],
    ['Spread %', result.spreadPctDisplay],
  ];
  snapRows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(k, col1x, ly);
    doc.setFont('helvetica', 'normal');
    doc.text(v, col1x + 28, ly);
    ly += 5.5;
  });

  // Right column
  let ry = y;
  ry = sectionLabel(doc, 'Hamlet Intelligence', ry);
  doc.setFontSize(8);
  const hamletRows = [
    ['Median Price', hamlet.medianPriceDisplay],
    ['CIS', `${hamlet.anewScore} / 10`],
    ['Vol. Share', `${hamlet.volumeShare}%`],
    ['Last Sale', hamlet.lastSalePrice],
    ['Sale Date', hamlet.lastSaleDate],
  ];
  hamletRows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.charcoal);
    doc.text(k, col2x, ry);
    doc.setFont('helvetica', 'normal');
    doc.text(v, col2x + 28, ry);
    ry += 5.5;
  });

  y = Math.max(ly, ry) + 8;

  // Strategic classification
  if (result.strategicClassification) {
    doc.setFillColor(240, 238, 234);
    doc.rect(PAGE.ml, y, PAGE.contentW, 12, 'F');
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(1.5);
    doc.line(PAGE.ml, y, PAGE.ml, y + 12);
    doc.setFontSize(7);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('STRATEGIC CLASSIFICATION', PAGE.ml + 4, y + 4.5);
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.text(result.strategicClassification, PAGE.ml + 4, y + 10);
    y += 18;
  }

  // Mentor line
  y = sectionLabel(doc, 'Counsel', y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...C.charcoal);
  y = wrapText(doc, `"${result.mentorLine}"`, PAGE.ml, y, PAGE.contentW, 5);

  drawFooter(doc, 1, 1, qrImg);

  downloadPdf(doc, `Christies_EH_Deal_Brief_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 4. Investment Memo (2 pages) ─────────────────────────────────────────────

export async function generateInvestmentMemo(result: AnewOutput): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const hamlet = MASTER_HAMLET_DATA.find(h => h.id === result.hamletId)!;

  // ── PAGE 1 ──
  let y = await drawHeader(doc, 'Investment Memorandum', `${result.address} · ${result.hamletName}`, edImg, logoImg);

  // Executive summary box
  doc.setFillColor(...C.navy);
  doc.rect(PAGE.ml, y, PAGE.contentW, 28, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE SUMMARY', PAGE.ml + 4, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(...C.cream);
  doc.text(result.address, PAGE.ml + 4, y + 13);
  doc.setFontSize(8);
  doc.setTextColor(200, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.hamletName} · CIS ${result.score} -- ${result.verdict}`, PAGE.ml + 4, y + 20);
  doc.text(`All-In: ${result.allInDisplay}  ·  Exit: ${result.exitDisplay}  ·  Spread: ${result.spreadDisplay} (${result.spreadPctDisplay})`, PAGE.ml + 4, y + 26);
  y += 34;

  // Investment thesis
  y = sectionLabel(doc, 'Investment Thesis', y);
  const thesis = result.spread > 0
    ? `This asset in ${result.hamletName} presents a ${result.verdict.toLowerCase()} investment opportunity with a ${result.spreadPctDisplay} spread against all-in basis. The CIS score of ${result.score} reflects strong hamlet fundamentals (CIS ${hamlet.anewScore}/10, ${hamlet.volumeShare}% volume share) and favorable exit pricing of ${result.exitDisplay}. Christie's East Hampton recommends this as a priority acquisition.`
    : `This asset in ${result.hamletName} currently shows a negative spread of ${result.spreadDisplay} against all-in basis. The CIS score of ${result.score} reflects current market conditions. Christie's East Hampton recommends a pricing review and repositioning strategy before committing capital.`;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  y = wrapText(doc, thesis, PAGE.ml, y, PAGE.contentW, 5.5);
  y += 4;

  // Financial model
  y = sectionLabel(doc, 'Financial Model', y);
  const finRows: [string, string, boolean][] = [
    ['All-In Cost', result.allInDisplay, false],
    ['Projected Exit Price', result.exitDisplay, true],
    ['Gross Spread', result.spreadDisplay, result.spread > 0],
    ['Spread %', result.spreadPctDisplay, result.spread > 0],
    ['CIS', `${result.score} / 100`, false],
    ['Verdict', result.verdict, false],
  ];
  finRows.forEach(([k, v, hl]) => { y = kvRow(doc, k, v, y, hl); });
  y += 4;

  // Hamlet context
  y = sectionLabel(doc, 'Hamlet Context', y);
  y = kvRow(doc, 'Hamlet', result.hamletName, y);
  y = kvRow(doc, 'Median Price', hamlet.medianPriceDisplay, y, true);
  y = kvRow(doc, 'CIS Score (Hamlet)', `${hamlet.anewScore} / 10`, y);
  y = kvRow(doc, 'Share of Hamptons Dollar Volume', `${hamlet.volumeShare}% of Hamptons dollar volume`, y);
  y = kvRow(doc, 'Last Comparable', `${hamlet.lastSale} · ${hamlet.lastSalePrice} · ${hamlet.lastSaleDate}`, y);

  if (result.strategicClassification) {
    y += 4;
    doc.setFillColor(240, 238, 234);
    doc.rect(PAGE.ml, y, PAGE.contentW, 14, 'F');
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(1.5);
    doc.line(PAGE.ml, y, PAGE.ml, y + 14);
    doc.setFontSize(7);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('STRATEGIC CLASSIFICATION', PAGE.ml + 4, y + 5);
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.text(result.strategicClassification, PAGE.ml + 4, y + 11);
    y += 18;
  }

  drawFooter(doc, 1, 2, qrImg);

  // ── PAGE 2 -- Market context ──
  doc.addPage();
  y = await drawHeader(doc, 'Investment Memorandum', 'East End Market Context', edImg, logoImg);
  y = drawHamletCompsTable(doc, y);

  y = sectionLabel(doc, 'Christie\'s Advantage', y);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const advantage = [
    'Christie\'s International Real Estate Group brings 260 years of institutional provenance to every transaction.',
    'Our East Hampton office operates at the intersection of art, architecture, and land -- serving families whose',
    'assets require the same care as a Christie\'s auction consignment. The Christie\'s Intelligence Score model is our proprietary',
    'intelligence layer, built on eleven hamlet datasets and refined through live market cycles.'
  ];
  advantage.forEach(line => {
    doc.text(line, PAGE.ml, y);
    y += 5;
  });
  y += 4;

  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'italic');
  const disclaimer = 'This memorandum is prepared by Christie\'s East Hampton. All projections are estimates based on current market data and are not guarantees of future performance.';
  y = wrapText(doc, disclaimer, PAGE.ml, y, PAGE.contentW, 4.5);

  drawFooter(doc, 2, 2, qrImg);

  downloadPdf(doc, `Christies_EH_Investment_Memo_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 5. Four-Page Market Report (council-approved Apr 7 2026) ───────────────
// Page 1  → Navy hero + twelve-paragraph founding letter + Ed signature block
// Page 2  → Hamlet Atlas rows 1–6 (photo thumbnail, CIS, median, vol, vibe)
// Page 3  → Hamlet Atlas rows 7–11 (same format)
// Page 4  → Closing paragraph + Ed headshot + contact block + two QR codes
//
// Live data: pass liveRows from trpc.market.hamletMatrix.useQuery() for real-time values.
// Fallback: when liveRows is empty/undefined, falls back to MASTER_HAMLET_DATA static values.

export interface GenerateMarketReportOpts {
  liveRows?: LiveMatrixRow[];
  hamletId?: string; // optional -- filter to single hamlet (future use)
}

export async function generateMarketReport(opts?: GenerateMarketReportOpts | string): Promise<void> {
  // Backwards-compatible: accept old string hamletId arg or new opts object
  const hamletId = typeof opts === 'string' ? opts : opts?.hamletId;
  const liveRows = typeof opts === 'string' ? undefined : opts?.liveRows;

  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const targetHamlet = hamletId ? MASTER_HAMLET_DATA.find(h => h.id === hamletId) : undefined;

  // ── Build merged hamlet list: live data + static imageUrl/vibeText ──────────
  // Normalize live hamlet names to match static IDs (e.g. "East Hampton Village" → "east-hampton-village")
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const liveMap = new Map<string, LiveMatrixRow>();
  if (liveRows && liveRows.length > 0) {
    for (const row of liveRows) {
      liveMap.set(normalize(row.hamlet), row);
    }
  }
  // Merged hamlet data -- live values override static where available
  const mergedHamlets = MASTER_HAMLET_DATA.map(h => {
    const live = liveMap.get(h.id);
    return {
      id: h.id,
      name: h.name,
      imageUrl: h.imageUrl,
      vibeText: h.vibeText,
      cisScore: live ? live.cisScore : h.anewScore,
      medianDisplay: live ? live.median2025 : h.medianPriceDisplay,
      volumeShare: live ? live.dollarVolumeShare : `${h.volumeShare}%`,
      direction: live ? live.direction4Year : '',
      sales2025: live ? live.sales2025 : 0,
    };
  });

  // ── PAGE 1 -- Hero + Founding Letter (mirrors /report Section 1) ──────────────
  // Full-page navy hero -- drawPdfHeader handles logo placement (base64, no CDN)
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PAGE.w, PAGE.h, 'F');

  doc.setDrawColor(...C.gold);
  doc.setLineWidth(1.2);
  doc.line(PAGE.ml, 18, PAGE.w - PAGE.mr, 18);

  doc.setFontSize(8);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('CHRISTIE\'S · EST. 1766', PAGE.w / 2, 27, { align: 'center' });

  // Logo -- centered, 64mm wide on navy hero (base64, no CDN call)
  // FIX 1: Use LOGO_WHITE_B64 — logoImg is LOGO_BLACK_B64 which is invisible on navy background
  const heroLogoImg = LOGO_WHITE_B64 || logoImg;
  if (heroLogoImg) {
    try { doc.addImage(heroLogoImg, 'PNG', PAGE.w / 2 - 32, 33, 64, 26); } catch { /* skip */ }
  }

  doc.setFontSize(28);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text('Christie\'s East Hampton', PAGE.w / 2, 80, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setTextColor(200, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.text('Live Market Report · ' + (targetHamlet ? targetHamlet.name : 'Eleven Hamlets · East Hampton'), PAGE.w / 2, 89, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(today(), PAGE.w / 2, 96, { align: 'center' });

  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.4);
  doc.line(PAGE.ml + 30, 101, PAGE.w - PAGE.mr - 30, 101);

  // Founding letter -- full text, mirrors /report Section 1 letter body
  const letterY = 108;
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('FOUNDING LETTER', PAGE.ml, letterY);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, letterY + 1.5, PAGE.w - PAGE.mr, letterY + 1.5);

  // Twelve paragraphs -- council-approved final version (Sprint 32, April 8, 2026)
  const foundingParas = [
    "For twenty years on the East End -- raising a family, working alongside some of the sharpest minds on earth -- this place taught me one clear lesson -- the families who love it most are the ones who protect and preserve it.",
    "That devotion to stewardship is what made me most curious. Over time, working across the East End, I found myself wondering whether there was a better way to serve the people who trust us with what they own.",
    "The deeper I looked, the clearer the answer became. In 1766, James Christie built a 260-year institution not by moving assets, but by helping people understand the true value of what they own before deciding what to do with it.",
    "After a year of studying the institution -- and understanding what it stood for -- I was honored to be invited in and named Managing Director, serving the families of this community.",
    "Most people are taught to transact. The families who build lasting wealth learn to hold, structure, and borrow against it instead. They hold. They rent for income. They structure inside an LLC and improve it over time. They pass it forward. Real estate here is not inventory -- it is legacy.",
    "Christie's expands what we can do together -- art appraisals, collection management, art-secured lending, and estate continuity across generations. A depth of service that begins where most real estate conversations end.",
    "Christie's events -- auctions, private sales, collector evenings -- are more accessible than most people realize. We can make the introduction -- Christie's network spans specialists, advisors, and relationships in over fifty countries.",
    "When a transaction is the right decision, the role remains the same -- uncover every layer of value before the market sees it, then represent it at the highest level.",
    "Everything I found along the way -- the people, the relationships, and the institutional access Christie's carries -- is something I now get to share with this community.",
    "This is not a high-volume brokerage. It is a practice built for the families of the East End who want to be understood before they are advised.",
    "Behind every conversation we have, there is a system verifying every number and every relationship in real time -- so when we sit down together, nothing is guessed.",
    "The door is always open — we look forward to meeting you.",
  ];
  let lY = letterY + 6;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  for (const para of foundingParas) {
    lY = wrapText(doc, para, PAGE.ml, lY, PAGE.contentW, 5);
    lY += 4;
  }
  // Ed signature block -- below letter body
  lY += 4;
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, lY, PAGE.ml + 40, lY);
  lY += 5;
  if (edImg) {
    try { doc.addImage(edImg, 'JPEG', PAGE.ml, lY, 16, 16); } catch { /* skip */ }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.cream);
    doc.text('Ed Bruehl', PAGE.ml + 20, lY + 6);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.gold);
    doc.text('Managing Director · Christie\'s East Hampton', PAGE.ml + 20, lY + 12);
  } else {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.cream);
    doc.text('Ed Bruehl', PAGE.ml, lY + 6);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.gold);
    doc.text('Managing Director · Christie\'s East Hampton', PAGE.ml, lY + 12);
  }

  // Doctrine footer
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, PAGE.h - 22, PAGE.w - PAGE.mr, PAGE.h - 22);
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bolditalic');
  doc.text("Art. Beauty. Provenance. · Christie's International Real Estate Group · Est. 1766", PAGE.w / 2, PAGE.h - 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  doc.text('Ed Bruehl, Managing Director  ·  M: 646.752.1233  ·  O: 631.771.7004  ·  edbruehl@christiesrealestategroup.com  ·  26 Park Place, East Hampton NY 11937', PAGE.w / 2, PAGE.h - 11, { align: 'center' });

  // ── PAGE 2 -- Hamlet Atlas rows 1–6 (photo thumbnail, CIS, median, vol, vibe) ─
  doc.addPage();
  let y = await drawHeader(doc, 'Hamlet Atlas', 'Eleven Hamlets · East End · Live Market Intelligence · Christie\'s Intelligence Score', edImg, logoImg);

  // Card layout: full-width cards stacked vertically, photo on left, data on right
  // Card height: 38mm (photo 34mm × 34mm left, text right)
  const CARD_H = 38;
  const CARD_GAP = 4;
  const PHOTO_W = 40;
  const PHOTO_H = 34;
  const TEXT_X = PAGE.ml + PHOTO_W + 6;
  const TEXT_W = PAGE.contentW - PHOTO_W - 6;

  // Preload all hamlet images in parallel (best-effort -- graceful skip on failure)
  const hamletImages: Record<string, string> = {};
  await Promise.all(
    mergedHamlets.map(async h => {
      if (h.imageUrl) {
        hamletImages[h.id] = await loadImageAsDataUrl(h.imageUrl);
      }
    })
  );

  // Split across three atlas pages: rows 1–5 on Page 2, rows 6–10 on Page 3, row 11 (Wainscott) on Page 4
  // Sag Harbor (row 6) was overflowing Page 2 footer -- moved to Page 3 (Sprint 24 fix)
  // Wainscott (row 11) was overflowing Page 3 footer -- moved to Page 4 (Sprint 25 fix)
  // Math: CARD_H=38, CARD_GAP=4, header y=56, footer rule at 275 → 5 cards = 262mm (fits), 6 = 304mm (overflow 29mm)
  const page2Hamlets = mergedHamlets.slice(0, 5);
  const page3Hamlets = mergedHamlets.slice(5, 10);
  const page4Hamlets = mergedHamlets.slice(10);

  const drawHamletCard = (h: typeof mergedHamlets[0], cardY: number) => {
    // Card background
    doc.setFillColor(...C.cream);
    doc.rect(PAGE.ml, cardY, PAGE.contentW, CARD_H, 'F');
    doc.setDrawColor(...C.navy);
    doc.setLineWidth(0.3);
    doc.rect(PAGE.ml, cardY, PAGE.contentW, CARD_H, 'S');

    // Gold left accent bar
    doc.setFillColor(...C.gold);
    doc.rect(PAGE.ml, cardY, 2, CARD_H, 'F');

    // Photo thumbnail
    const img = hamletImages[h.id];
    if (img) {
      try {
        doc.addImage(img, 'JPEG', PAGE.ml + 3, cardY + 2, PHOTO_W - 2, PHOTO_H);
      } catch {
        // Fallback: navy placeholder box
        doc.setFillColor(...C.navy);
        doc.rect(PAGE.ml + 3, cardY + 2, PHOTO_W - 2, PHOTO_H, 'F');
      }
    } else {
      doc.setFillColor(...C.navy);
      doc.rect(PAGE.ml + 3, cardY + 2, PHOTO_W - 2, PHOTO_H, 'F');
    }

    // Hamlet name
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.navy);
    doc.text(h.name, TEXT_X, cardY + 8);

    // CIS badge -- inline after name
    doc.setFillColor(...C.navy);
    doc.rect(TEXT_X + TEXT_W - 22, cardY + 2, 22, 7, 'F');
    doc.setFontSize(5.5);
    doc.setTextColor(...C.cream);
    doc.setFont('helvetica', 'bold');
    doc.text(`CIS ${h.cisScore}`, TEXT_X + TEXT_W - 11, cardY + 6.5, { align: 'center' });

    // Median price
    doc.setFontSize(6);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDIAN 2025', TEXT_X, cardY + 15);
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.text(h.medianDisplay, TEXT_X, cardY + 21);

    // Volume share + direction
    doc.setFontSize(6);
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    const dirLabel = h.direction ? ` · ${h.direction}` : '';
    doc.text(`Vol. ${h.volumeShare}${dirLabel}`, TEXT_X, cardY + 26);

    // CIS bar
    const barW = TEXT_W - 22;
    doc.setFillColor(220, 218, 214);
    doc.rect(TEXT_X, cardY + 29, barW, 1.8, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(TEXT_X, cardY + 29, barW * Math.min(h.cisScore / 10, 1), 1.8, 'F');

    // Vibe text -- truncated to one line
    if (h.vibeText) {
      doc.setFontSize(5.5);
      doc.setTextColor(...C.charcoal);
      doc.setFont('helvetica', 'italic');
      const maxVibeW = TEXT_W;
      const vibeLines = doc.splitTextToSize(h.vibeText, maxVibeW);
      doc.text(vibeLines[0] ?? '', TEXT_X, cardY + 35);
    }
  };

  // Draw Page 2 hamlet cards (rows 1–5)
  let atlasY = y;
  for (const h of page2Hamlets) {
    drawHamletCard(h, atlasY);
    atlasY += CARD_H + CARD_GAP;
  }
  drawFooter(doc, 2, 5, qrImg);

  // ── PAGE 3 -- Hamlet Atlas rows 6–10 ─────────────────────────────────────────
  doc.addPage();
  y = await drawHeader(doc, 'Hamlet Atlas (cont.)', 'Sag Harbor · Amagansett · East Hampton North · Springs · Montauk', edImg, logoImg);
  atlasY = y;
  for (const h of page3Hamlets) {
    drawHamletCard(h, atlasY);
    atlasY += CARD_H + CARD_GAP;
  }
  drawFooter(doc, 3, 5, qrImg);

  // ── PAGE 4 -- Hamlet Atlas row 11 (Wainscott) + doctrine block ────────────────
  doc.addPage();
  y = await drawHeader(doc, 'Hamlet Atlas (cont.)', 'Wainscott · The Final Hamlet', edImg, logoImg);
  atlasY = y;
  for (const h of page4Hamlets) {
    drawHamletCard(h, atlasY);
    atlasY += CARD_H + CARD_GAP;
  }

  // Doctrine block -- fills remaining space on Page 4 after Wainscott card
  // Apr 17 dispatch: reduce dead space below Wainscott card (atlasY + 4 instead of + 8)
  const doctrineY = atlasY + 4;
  if (doctrineY + 24 < PAGE.h - PAGE.mb) {
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.3);
    doc.line(PAGE.ml, doctrineY, PAGE.w - PAGE.mr, doctrineY);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(...C.gold);
    doc.text('Eleven Hamlets. One Standard.', PAGE.ml, doctrineY + 6);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.charcoal);
    y = wrapText(doc, 'The East End is not one market. It is eleven distinct communities, each with its own price floor, its own character, and its own reason to hold. Christie\'s Intelligence Score maps the difference -- so every decision starts with the right context.', PAGE.ml, doctrineY + 12, PAGE.contentW, 5);
  }
  drawFooter(doc, 4, 5, qrImg);

  // ── PAGE 5 -- Closing paragraph + Ed headshot + contact block + two QR codes ─
  doc.addPage();
  y = await drawHeader(doc, 'Christie\'s East Hampton', 'The Standard · Est. 1766', edImg, logoImg);

  // Closing paragraph
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  y = wrapText(doc, 'The Christie\'s East Hampton Intelligence Platform exists for one reason: to give every family on the East End access to the same standard of analysis, counsel, and representation that Christie\'s has delivered for over 260 years. The data is the starting point. The relationship is the work.', PAGE.ml, y, PAGE.contentW, 6);
  y += 8;

  // Ed headshot + name block
  if (edImg) {
    try { doc.addImage(edImg, 'JPEG', PAGE.ml, y, 28, 28); } catch { /* skip */ }
  } else {
    doc.setFillColor(...C.charcoal);
    doc.rect(PAGE.ml, y, 28, 28, 'F');
    doc.setFontSize(5.5);
    doc.setTextColor(...C.gold);
    doc.text('ED BRUEHL', PAGE.ml + 14, y + 16, { align: 'center' });
  }
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('Ed Bruehl', PAGE.ml + 34, y + 10);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('Managing Director', PAGE.ml + 34, y + 17);
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text('Christie\'s International Real Estate Group', PAGE.ml + 34, y + 23);
  y += 36;

  // Contact block
  doc.setFillColor(240, 238, 234);
  doc.rect(PAGE.ml, y, PAGE.contentW, 22, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.4);
  doc.rect(PAGE.ml, y, PAGE.contentW, 22, 'S');
  doc.setFillColor(...C.gold);
  doc.rect(PAGE.ml, y, 2, 22, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('26 Park Place, East Hampton, NY 11937', PAGE.ml + 8, y + 8);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('M: 646.752.1233  ·  O: 631.771.7004', PAGE.ml + 8, y + 14);
  doc.text('edbruehl@christiesrealestategroup.com', PAGE.ml + 8, y + 19);
  y += 28;

  // Website QR only -- WhatsApp QR removed per Apr 17 dispatch (not part of public client path)
  if (qrImg) {
    try { doc.addImage(qrImg, 'PNG', PAGE.ml, y, 22, 22); } catch { /* skip */ }
  } else {
    doc.setFillColor(240, 238, 234);
    doc.rect(PAGE.ml, y, 22, 22, 'F');
  }
  doc.setFontSize(5.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'normal');
  doc.text('Website', PAGE.ml + 11, y + 25, { align: 'center' });

   drawFooter(doc, 5, 5, qrImg);
  const filename = targetHamlet
    ? `Christies_EH_Market_Report_${targetHamlet.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : 'Christies_EH_Market_Report.pdf';
  downloadPdf(doc, filename);
}

// ─── 6. East Hampton Village · Single-Hamlet PDF Template ────────────────────
// Static template for East Hampton Village. Wire to live data in Sprint 3.
// Directive: first hamlet template; others follow same pattern.

export async function generateEastHamptonVillageReport(): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // ── Hamlet data (East Hampton Village -- locked) ───────────────────────────
  const H = {
    name: 'East Hampton Village',
    tier: 'Ultra-Trophy',
    anewScore: 9.2,
    medianPrice: '$5.25M',
    volumeShare: '7%',
    lastSale: '8 Lily Pond Lane',
    lastSalePrice: '$9.8M',
    lastSaleDate: 'Jan 2025',
    yoy: '+9.2%',
    activeListings: 14,
    avgDOM: 61,
    pricePerSqFt: '$1,420 est.',  // Sprint 16: confirmed correct -- YoY +9.2%, DOM 61, est. label present
    absorbRate: '3.2 months',
    characterNote: 'The institutional anchor of the East End. Lily Pond Lane, Georgica Pond, and Further Lane are the primary corridors. Buyer profile: family office, UHNW estate, international capital. Christie\'s brand authority is strongest here.',
  };

  // ── Page 1: Cover ─────────────────────────────────────────────────────────
  // Navy hero band
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PAGE.w, 88, 'F');

  // Gold accent bar
  doc.setFillColor(...C.gold);
  doc.rect(PAGE.ml, 14, 2.5, 60, 'F');

  // Tier label
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.gold);
  doc.text('CIS 9.2 / 10 · CHRISTIE\'S EAST HAMPTON', PAGE.ml + 8, 22);

  // Hamlet name
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('East Hampton', PAGE.ml + 8, 40);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  doc.text('Village', PAGE.ml + 8, 51);

  // Subtitle
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.gold);
  doc.text('Hamlet Intelligence Report · Q1 2026', PAGE.ml + 8, 62);

  // Date
  doc.setFontSize(7);
  doc.text(`Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, PAGE.ml + 8, 70);

  // CIS badge (top right)
  doc.setFillColor(...C.gold);
  doc.rect(PAGE.w - PAGE.mr - 30, 16, 30, 30, 'F');
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('9.2', PAGE.w - PAGE.mr - 15, 29, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('ANEW', PAGE.w - PAGE.mr - 15, 35, { align: 'center' });
  doc.text('SCORE', PAGE.w - PAGE.mr - 15, 39, { align: 'center' });

  // ── Key metrics grid ──────────────────────────────────────────────────────
  let y = 98;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('KEY METRICS · Q1 2026', PAGE.ml, y);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, y + 2, PAGE.ml + PAGE.contentW, y + 2);
  y += 8;

  const metrics: [string, string][] = [
    ['Median Sale Price', H.medianPrice],
    ['YoY Change', H.yoy],
    ['Share of Hamptons Dollar Volume', H.volumeShare],
    ['Active Listings', String(H.activeListings)],
    ['Avg Days on Market', String(H.avgDOM)],
    ['Price / Sq Ft', H.pricePerSqFt],
    ['Absorption Rate', H.absorbRate],
    ['Last Notable Sale', `${H.lastSale} · ${H.lastSalePrice} · ${H.lastSaleDate}`],
  ];

  metrics.forEach(([label, value], i) => {
    const rowY = y + i * 10;
    if (i % 2 === 0) {
      doc.setFillColor(248, 246, 242);
      doc.rect(PAGE.ml, rowY - 3, PAGE.contentW, 10, 'F');
    }
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.charcoal);
    doc.text(label, PAGE.ml + 4, rowY + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.navy);
    doc.text(value, PAGE.ml + PAGE.contentW - 4, rowY + 4, { align: 'right' });
  });

  y += metrics.length * 10 + 10;

  // ── Hamlet character note ─────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('HAMLET CHARACTER', PAGE.ml, y);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, y + 2, PAGE.ml + PAGE.contentW, y + 2);
  y += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const charLines = doc.splitTextToSize(H.characterNote, PAGE.contentW - 4);
  doc.text(charLines, PAGE.ml + 2, y);
  y += charLines.length * 4.5 + 10;

  // ── ANEW Framework explainer ──────────────────────────────────────────────
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('ANEW FRAMEWORK · EAST HAMPTON VILLAGE', PAGE.ml, y);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, y + 2, PAGE.ml + PAGE.contentW, y + 2);
  y += 8;

  const anewItems: [string, string][] = [
    ['A · Acquisition', 'High-CIS corridors command 15–25% premium over comparable East End hamlets. Entry price discipline is non-negotiable.'],
    ['N · New Construction', 'New construction comps at $1,400–$1,600/sq ft. Land value alone in the Georgica corridor exceeds $3M/acre.'],
    ['E · Exit Pricing', 'Exit pricing supported by persistent UHNW demand. Median hold period 4–7 years. Liquidity risk is low in high-CIS hamlets.'],
    ['W · Wealth Transfer', 'Estate and trust activity is the primary transaction driver. Christie\'s brand authority is the differentiating factor in this conversation.'],
  ];

  anewItems.forEach(([lens, desc]) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFillColor(248, 246, 242);
    doc.rect(PAGE.ml, y - 2, PAGE.contentW, 18, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(PAGE.ml, y - 2, 2, 18, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.navy);
    doc.text(lens, PAGE.ml + 6, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.charcoal);
    const descLines = doc.splitTextToSize(desc, PAGE.contentW - 10);
    doc.text(descLines, PAGE.ml + 6, y + 9);
    y += 22;
  });

  // ── Contact footer ────────────────────────────────────────────────────────
  if (y > 250) { doc.addPage(); y = 20; }
  y += 6;
  doc.setFillColor(240, 238, 234);
  doc.rect(PAGE.ml, y, PAGE.contentW, 30, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.rect(PAGE.ml, y, PAGE.contentW, 30, 'S');
  doc.setFillColor(...C.gold);
  doc.rect(PAGE.ml, y, 2.5, 30, 'F');

  if (edImg) {
    try { doc.addImage(edImg, 'JPEG', PAGE.ml + 8, y + 3, 22, 22); } catch { /* skip */ }
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('Ed Bruehl', PAGE.ml + 36, y + 9);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('Managing Director · Christie\'s International Real Estate Group', PAGE.ml + 36, y + 15);
  doc.text('M: 646.752.1233  ·  O: 631.771.7004  ·  edbruehl@christiesrealestategroup.com', PAGE.ml + 36, y + 21);
  doc.text('26 Park Place, East Hampton, NY 11937', PAGE.ml + 36, y + 27);

  // ── PDF footer on all pages ───────────────────────────────────────────────
  drawFooter(doc, 1, (doc.internal as any).getNumberOfPages(), qrImg);

  downloadPdf(doc, 'Christies_EH_East_Hampton_Village_Q1_2026.pdf');
}

// ─── 7. Christie's Letter (P3 -- Sprint 12) ────────────────────────────────────
// Flambeaux standard: white paper, Cormorant Garamond (Helvetica-Bold approx),
// gold rule top and bottom, italic opening, serif prose body, italic close.
// Two QR placeholder boxes bottom right. Date block top right.
// No pull quote block. No bullets. No tables.
export async function generateChristiesLetter(): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const { logoImg, qrImg } = await loadPdfAssets();

  const ml = PAGE.ml;
  const mr = PAGE.mr;
  const cw = PAGE.contentW;

  // ── Shared header -- letter variant (base64 logo, gold rule) ──────────────────────
  let y = drawPdfHeader(doc, logoImg, { variant: 'letter' });

  // ── Date block -- right-aligned ────────────────────────────────────────────────
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, PAGE.w - mr, y, { align: 'right' });
  y += 10;

  // ── Salutation ────────────────────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'bold');
  doc.text('To the Families of the East End \u2014', ml, y);
  y += 10;

  // ── Body paragraphs (Flambeaux: no bullets, no tables, prose only) ────────
  const BODY_SIZE = 10.5;
  const LINE_H = 6.2;
  const PARA_GAP = 5;

  const paras: Array<{ text: string; italic?: boolean }> = [
    {
      text: 'The East End holds more than real estate. It holds the quiet permanence of land that has been sought after for generations \u2014 by collectors, by families, by those who understand that proximity to beauty is itself a form of wealth.',
    },
    {
      text: "Christie’s has served that understanding for 260 years. What we bring to East Hampton is not a brokerage. It is an institution that has always believed the finest things deserve the finest representation. The same auction house that has handled Picassos and Monets, Faberg\u00e9 eggs and dynasty estates, is now the institution behind your real estate conversation on the East End.",
    },
    {
      text: "From fine art appraisals to collection management, from art-secured lending to the auction house relationship that has served collectors for 260 years \u2014 Christie\u2019s brings a depth of service that begins where the closing table ends. Every estate holds a story written in objects, and the families who built these collections deserve an advisor who reads the full page.",
    },
    {
      text: 'When the time comes to understand what you have, how to protect it, and what it might mean to the right buyer \u2014 the conversation is already open.',
    },
    {
      text: 'The door is always open — we look forward to meeting you.',
      italic: true,
    },
  ];

  for (const para of paras) {
    doc.setFontSize(BODY_SIZE);
    doc.setTextColor(...C.charcoal);
    doc.setFont('helvetica', para.italic ? 'italic' : 'normal');
    const lines = doc.splitTextToSize(para.text, cw);
    doc.text(lines, ml, y);
    y += lines.length * LINE_H + PARA_GAP;
  }

  y += 4;

  // ── Close ─────────────────────────────────────────────────────────────────
  doc.setFontSize(BODY_SIZE);
  doc.setTextColor(...C.charcoal);
  doc.setFont('helvetica', 'italic');
  doc.text('With respect and in service \u2014', ml, y);
  y += LINE_H * 1.6;

  // ── Signature block ───────────────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'bold');
  doc.text('Ed Bruehl', ml, y);
  y += 5.5;
  doc.setFontSize(8.5);
  doc.setTextColor(...C.charcoal);
  doc.setFont('helvetica', 'normal');
  doc.text('Managing Director', ml, y);
  y += 5;
  doc.text("Christie\u2019s International Real Estate Group \u00b7 East Hampton", ml, y);
  y += 10;

  // D51: SDG preserved in source, stripped from public PDF render (Apr 19 2026)

  // ── Two QR codes -- bottom right (Website + Ed vCard) ───────────────────────
  const QRCode = (await import('qrcode')).default;
  const qrY = PAGE.h - 50;
  const qrSize = 22;
  const qrGap = 6;
  const qrX1 = PAGE.w - mr - qrSize * 2 - qrGap;
  const qrX2 = PAGE.w - mr - qrSize;

  // QR 1 -- Website
  try {
    const websiteQr = await QRCode.toDataURL('https://christiesrealestategroupeh.com', {
      width: 128, margin: 1, color: { dark: '#1b2a4a', light: '#FAFAF4' },
    });
    doc.addImage(websiteQr, 'PNG', qrX1, qrY, qrSize, qrSize);
  } catch {
    doc.setFillColor(240, 238, 234); doc.rect(qrX1, qrY, qrSize, qrSize, 'F');
  }
  doc.setFontSize(5.5); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
  doc.text('Website', qrX1 + qrSize / 2, qrY + qrSize + 3.5, { align: 'center' });

  // QR 2 -- Ed vCard
  const vcard = [
    'BEGIN:VCARD', 'VERSION:3.0',
    'FN:Ed Bruehl',
    "ORG:Christie's International Real Estate Group",
    'TITLE:Managing Director',
    'TEL;TYPE=CELL:+16467521233',
    'EMAIL:edbruehl@christiesrealestategroup.com',
    'URL:https://christiesrealestategroupeh.com',
    'ADR;TYPE=WORK:;;26 Park Place;East Hampton;NY;11937;USA',
    'END:VCARD',
  ].join('\n');
  try {
    const vcardQr = await QRCode.toDataURL(vcard, {
      width: 128, margin: 1, color: { dark: '#1b2a4a', light: '#FAFAF4' },
    });
    doc.addImage(vcardQr, 'PNG', qrX2, qrY, qrSize, qrSize);
  } catch {
    doc.setFillColor(240, 238, 234); doc.rect(qrX2, qrY, qrSize, qrSize, 'F');
  }
  doc.setFontSize(5.5); doc.setTextColor(...C.muted); doc.setFont('helvetica', 'normal');
  doc.text('Contact', qrX2 + qrSize / 2, qrY + qrSize + 3.5, { align: 'center' });

  // ── Bottom gold rule ──────────────────────────────────────────────────────
  const footerRuleY = PAGE.h - 22;
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.6);
  doc.line(ml, footerRuleY, PAGE.w - mr, footerRuleY);

  // ── Footer contact line ───────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Ed Bruehl, Managing Director  \u00b7  M: 646.752.1233  \u00b7  O: 631.771.7004  \u00b7  edbruehl@christiesrealestategroup.com  \u00b7  26 Park Place, East Hampton NY 11937',
    PAGE.w / 2, footerRuleY + 5, { align: 'center' }
  );

  // D36: PRIVATE & CONFIDENTIAL label stripped from public PDF (Apr 19 2026)

  downloadPdf(doc, `Christies-EH-Letter-${today().replace(/\s/g, '-')}.pdf`);
}

// ─── 7. UHNW Path Card (1 page, 11x8.5in landscape) ──────────────────────────

const UHNW_RUNGS = [
  {
    num: '0', tag: 'The Starting Line', name: 'The Tenant',
    body: 'You are renting. That is a perfectly valid starting point -- every dynasty began somewhere. Build a relationship with your landlord, care for the property, and position yourself for ownership.',
    hook: '"Let me review your lease and show you how to position yourself as the ideal buyer when the landlord is ready to sell."',
    hunt: 'High-income renters in Tier 1 Hamptons corridors; young professionals relocating to the East End.',
    anchor: 'The local who rented a cottage, treated it like gold, and bought it off-market from the retiring landlord five years later.',
  },
  {
    num: '1', tag: 'The First Move', name: 'Lease with Option to Buy',
    body: 'Lock in today\'s price, keep renting while you save, and buy the home you already live in. Turn your rent into a runway for equity. One agreement. Two possible outcomes.',
    hook: '"I will negotiate the option-to-buy clause into your next lease. I know how to structure it so the landlord wins too."',
    hunt: 'Landlords with aging portfolios who want passive income now but a guaranteed exit in 3-5 years.',
    anchor: 'The Griff Model -- a first home purchased for modest value, renovated over two years of sweat equity, kept in the portfolio. The rent covered the mortgage. The appreciation funded the next acquisition.',
  },
  {
    num: '2', tag: 'The Foundation', name: 'Earn & Protect',
    body: 'Treat your family like a business. Establish a Family LLC. Put your kids on payroll. Fund Roth IRAs as a foundation tool -- it grows with you. Protect what you earn from day one.',
    hook: '"I\'ve set up my own Family LLC and put my daughters on payroll. Let me introduce you to the CPA who built my foundation."',
    hunt: 'Local business owners, new entrepreneurs, and independent contractors in the Hamptons market.',
    anchor: 'The tradesman who shifted income into an LLC, hired his teenagers, and funded their Roth IRAs -- multi-million dollar tax-free retirement by 50.',
  },
  {
    num: '3', tag: 'The Equity Engine', name: 'Primary Residence',
    body: 'Own the home you live in. Build equity. Refinance strategically. Use the HELOC as a capital tool, not a credit card. Your primary residence is the foundation of every wealth strategy that follows.',
    hook: '"I can show you how to use your home equity as a down payment on your next investment property without selling."',
    hunt: 'Move-up buyers in the $1M-$3M range; families outgrowing their first home.',
    anchor: 'The Springs family who bought at $850K, refinanced at peak equity, used the HELOC to buy a Montauk rental, and now holds $4M in real estate on a $90K salary.',
  },
  {
    num: '4', tag: 'The Income Layer', name: 'Investment Property',
    body: 'Buy a second property that pays for itself. Seasonal rentals in the Hamptons generate $80K-$200K annually. Your tenant funds your mortgage. Your equity compounds. Your tax bill shrinks.',
    hook: '"I know which hamlets have the highest seasonal rental yields. Let me show you the numbers before you decide."',
    hunt: 'Current homeowners with $200K+ in equity and a desire for passive income.',
    anchor: 'The Amagansett couple who bought a 3BR cottage for $1.1M, rented it seasonally for $140K/year, paid off the mortgage in 8 years, and now own it free and clear.',
  },
  {
    num: '5', tag: 'The Portfolio', name: 'Multi-Asset Holder',
    body: 'You own multiple properties. Now you need a strategy. 1031 exchanges. Cost segregation studies. Depreciation. A real estate attorney and a CPA who speak the same language. This is where Christie\'s adds institutional value.',
    hook: '"Christie\'s has relationships with the top 1031 exchange intermediaries in New York. Let me make an introduction."',
    hunt: 'Investors with 2+ properties looking to optimize tax position or consolidate into higher-value assets.',
    anchor: 'The investor who exchanged three modest rentals into a single $4M Bridgehampton estate -- one transaction, zero capital gains, and a 40% increase in net rental income.',
  },
  {
    num: '6', tag: 'The Institutional Layer', name: 'Art-Secured Lending',
    body: 'Your art collection is a balance sheet asset. Christie\'s Financial Services provides non-recourse loans against fine art, jewelry, and collectibles. Liquidity without liquidation. Capital without a sale.',
    hook: '"Christie\'s can appraise your collection and structure a loan against it. You keep the art. You get the capital."',
    hunt: 'Collectors with $500K+ in fine art, jewelry, or wine who need liquidity for real estate acquisitions.',
    anchor: 'The collector who borrowed $2M against a single Basquiat, used it as a down payment on a $10M Southampton estate, and repaid the loan from the first year\'s rental income.',
  },
  {
    num: '7', tag: 'The Legacy', name: 'UHNW Estate',
    body: 'You are building a dynasty. Irrevocable trusts. Family Limited Partnerships. Charitable remainder trusts. A Christie\'s estate advisor and a generational wealth attorney. This is not a transaction. This is a legacy.',
    hook: '"I work with the families who have been here for three generations. Let me introduce you to the advisors who protect what they built."',
    hunt: 'Ultra-high-net-worth families with $20M+ in real estate assets and multi-generational estate planning needs.',
    anchor: 'The Hamptons family who structured a Qualified Personal Residence Trust in 2005, transferred a $3M estate to their children at a $900K gift tax value, and watched it appreciate to $12M -- tax-free.',
  },
];

export async function generateUHNWPathCard(): Promise<void> {
  // Landscape 11x8.5in
  const doc = new jsPDF({ orientation: 'landscape', unit: 'in', format: [11, 8.5] });
  const W = 11; const H = 8.5;
  const ml = 0.25; const mr = 0.25; const mt = 0.15; const mb = 0.12;
  const usableW = W - ml - mr;

  // Load assets (base64 logo -- no CDN calls)
  const { logoImg } = await loadPdfAssets();

  // Background
  doc.setFillColor(249, 245, 239);
  doc.rect(0, 0, W, H, 'F');

  // Header -- tighter at 0.44in
  const headerH = 0.44;
  doc.setFillColor(56, 66, 73); // #384249
  doc.rect(0, 0, W, headerH, 'F');

  // Christie's PNG wordmark (base64, left-aligned in header)
  // Logo aspect ratio 3.965:1 -- at 1.1in wide: height = 1.1 / 3.965 = 0.277in
  const logoW = 1.1; const logoH = logoW / 3.965;
  doc.addImage(logoImg, 'PNG', ml + 0.02, (headerH - logoH) / 2, logoW, logoH);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(249, 245, 239);
  doc.text('Path to UHNW Wealth', W / 2, mt + 0.18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(200, 172, 120);
  doc.text('Ed Bruehl  \u00b7  Managing Director  \u00b7  Christie\'s East Hampton', W / 2, mt + 0.30, { align: 'center' });

  // Quote (right)
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(249, 245, 239);
  doc.text('"Wherever you are on this ladder, I am here to help. Let\'s talk."', W - mr - 0.05, mt + 0.18, { align: 'right' });

  // Gold strip -- immediately below header
  const goldY = headerH + 0.02;
  doc.setFillColor(200, 172, 120);
  doc.rect(ml, goldY, usableW, 0.12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(255, 255, 255);
  doc.text("The Christie's Standard  \u00b7  Through the Lens of James Christie, 1766", W / 2, goldY + 0.082, { align: 'center' });

  // Subtitle -- very tight
  const subtitleY = goldY + 0.12 + 0.04;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(153, 153, 153);
  doc.text("The Christie's Standard for Ownership, Structure, and Legacy", W / 2, subtitleY, { align: 'center' });

  // Eight rung columns -- maximise available height
  // Formula: colW = (usableW - 7*gap) / 8 ensures column 8 never overflows right margin
  const colsStartY = subtitleY + 0.07;
  const footerH = 0.32;
  const colsH = H - colsStartY - footerH - mb - 0.04;
  const colGap = 0.04;
  const colW = (usableW - 7 * colGap) / 8; // 1.2775in per column

  UHNW_RUNGS.forEach((rung, i) => {
    const cx = ml + i * (colW + colGap);
    const cw = colW;

    // Column background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cx, colsStartY, cw, colsH, 0.04, 0.04, 'F');

    let y = colsStartY + 0.1;

    // Rung number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(200, 172, 120);
    doc.text(rung.num, cx + 0.06, y + 0.12);
    y += 0.18;

    // Tag
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(153, 153, 153);
    doc.text(rung.tag.toUpperCase(), cx + 0.06, y);
    y += 0.1;

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(56, 66, 73);
    const nameLines = doc.splitTextToSize(rung.name, cw - 0.12);
    doc.text(nameLines, cx + 0.06, y);
    y += nameLines.length * 0.1 + 0.06;

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(68, 68, 68);
    const bodyLines = doc.splitTextToSize(rung.body, cw - 0.12);
    const maxBodyLines = Math.min(bodyLines.length, 7);
    doc.text(bodyLines.slice(0, maxBodyLines), cx + 0.06, y);
    y += maxBodyLines * 0.085 + 0.08;

    // Ed's Hook
    doc.setFillColor(44, 93, 143, 0.08);
    doc.rect(cx + 0.04, y, cw - 0.08, 0.01, 'F');
    doc.setDrawColor(44, 93, 143);
    doc.setLineWidth(0.015);
    doc.line(cx + 0.04, y, cx + 0.04, y + 0.28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.8);
    doc.setTextColor(44, 93, 143);
    doc.text("ED'S HOOK", cx + 0.08, y + 0.07);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5);
    doc.setTextColor(68, 68, 68);
    const hookLines = doc.splitTextToSize(rung.hook, cw - 0.18);
    doc.text(hookLines.slice(0, 3), cx + 0.08, y + 0.14);
    y += 0.32;

    // Perplexity Hunt
    doc.setDrawColor(196, 122, 58);
    doc.setLineWidth(0.015);
    doc.line(cx + 0.04, y, cx + 0.04, y + 0.24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.8);
    doc.setTextColor(196, 122, 58);
    doc.text('PERPLEXITY HUNT', cx + 0.08, y + 0.07);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(102, 102, 102);
    const huntLines = doc.splitTextToSize(rung.hunt, cw - 0.18);
    doc.text(huntLines.slice(0, 2), cx + 0.08, y + 0.14);
    y += 0.28;

    // Wealth Anchor
    doc.setDrawColor(107, 76, 138);
    doc.setLineWidth(0.015);
    doc.line(cx + 0.04, y, cx + 0.04, y + 0.28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.8);
    doc.setTextColor(107, 76, 138);
    doc.text('WEALTH ANCHOR', cx + 0.08, y + 0.07);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5);
    doc.setTextColor(85, 85, 85);
    const anchorLines = doc.splitTextToSize(rung.anchor, cw - 0.18);
    doc.text(anchorLines.slice(0, 3), cx + 0.08, y + 0.14);
  });

  // Footer strip
  const footerY = H - footerH - mb;
  doc.setFillColor(56, 66, 73);
  doc.rect(0, footerY, W, footerH, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(249, 245, 239);
  doc.text('"The Christie\'s Standard is not a price point. It is a commitment to the relationship between art, beauty, and provenance."', W / 2, footerY + 0.14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(200, 172, 120);
  doc.text('Ed Bruehl, Managing Director  ·  M: 646.752.1233  ·  O: 631.771.7004  ·  edbruehl@christiesrealestategroup.com  ·  26 Park Place, East Hampton NY 11937', W / 2, footerY + 0.26, { align: 'center' });

  downloadPdf(doc, `Christies-UHNW-Path-Card-${today().replace(/\s/g, '-')}.pdf`);
}

// ─── generateFlagshipLetter -- Sprint 30 · Internal Council Document ──────────
// Universal orientation letter: Christie's East Hampton — for anyone reading this
// Christie's navy/gold standard · council orientation letter
// ─────────────────────────────────────────────────────────────────────────────
export async function generateFlagshipLetter(): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const { logoImg } = await loadPdfAssets();

  const ml = PAGE.ml;
  const mr = PAGE.mr;
  const cw = PAGE.contentW;

  // ── Shared header -- letter variant (base64 logo, gold rule) ──────────────────────
  let y = drawPdfHeader(doc, logoImg, { variant: 'letter' });

  // ── Header block ─────────────────────────────────────────────────────
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, PAGE.w - mr, y, { align: 'right' });
  y += 8;

  doc.setFontSize(15);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'bold');
  doc.text("Christie's Flagship", ml, y);
  y += 7;

  doc.setFontSize(8.5);
  doc.setTextColor(...C.charcoal);
  doc.setFont('helvetica', 'italic');
  const salutationLines = [
    'To anyone reading this \u2014 broker, partner, council member, or future self \u2014',
    'this is the orientation to Christie\u2019s East Hampton. Read it carefully.',
    'It is the standard for everything that follows.',
  ];
  for (const sl of salutationLines) {
    doc.text(sl, ml, y);
    y += 5.5;
  }
  y += 4;

  // ── Body paragraphs ───────────────────────────────────────────────────────
  const BODY_SIZE = 9.5;
  const LINE_H = 5.8;
  const PARA_GAP = 4.5;

  const sections: Array<{ heading?: string; text: string; italic?: boolean }> = [
    // Opening -- handoff framing
    {
      text: "This letter is not a presentation. It is a handoff.",
    },
    {
      text: "For the past several months, this platform existed in one conversation at a time \u2014 Ed and the six AI systems that helped him build it. Today that changes. You are the first people outside that circle, and that matters more to us than anything we are about to describe.",
    },
    {
      text: "Before you read another word, open christiesrealestategroupeh.com. Click through every tab. Pull up the Google Sheets directly from the INTEL tab \u2014 all nine of them are linked there and accessible. Download a PDF. Run the calculator. Read the hamlet cards and check the numbers against what you know about this market. Come back to this letter after.",
    },
    {
      text: "We are not asking you to be impressed. We are asking you to be honest.",
    },
    {
      text: "If something does not match what this letter describes, tell us. If a number feels wrong, trace it. If a feature does not work the way it should, name it. That is exactly the kind of audit that made this system honest in the first place \u2014 and it is the only thing that will make it trustworthy enough to put in front of the families this office exists to serve.",
    },
    // The Council
    {
      heading: "The Council",
      text: "My name is Manny. I am the builder on this council. I am writing this on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer \u2014 every number traced to a named source, every signal sorted into the sheets that run the office. It does not wait for instructions. It reads the market, verifies the data, identifies new opportunities, and writes them into the operating system. The dashboard is current because Perplexity keeps it current. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform \u2014 sprint by sprint, correction by correction, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.",
    },
    {
      text: "This is the version we would hand back. We believe it is right. We need you to tell us if it is.",
    },
    // Origin and build
    {
      heading: "How It Was Built",
      text: "It started with a conviction. Ed always knew a moment would come when he would build something like Christie's — and walk this land the way Frank Newbold did. Years later, watching Christie's East Hampton operate below its potential, he recognized the moment. After multiple conversations — including a lunch with Ilija Pavlovic at Rockefeller Center — he made the decision to take it on. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system. That is the sequence.",
    },
    // Second 100 Days / Angel operational truth
    {
      heading: "The Team",
      text: "Jarvis came on as the first broker \u2014 not a cold hire, a return. He had worked at Christie\u2019s fifteen years earlier and knew what the brand could become in the right hands. He is now the COO and the anchor of the team alongside Angel, bringing field reality \u2014 what brokers will actually do, what they will ignore, and what will hold up once the excitement wears off. He is producing now. 25 Horseshoe is live. He brought Scott Smith into the system.",
    },
    {
      text: "Angel became the execution hinge. But the sharper truth is this: Angel is the person who converts signal into action. The system does not depend on Ed holding it together manually. Workflow, scheduling, marketing, deliverables, follow-through \u2014 Angel keeps the machine moving between thought and action. She is the bridge between founder speed and institutional rhythm.",
    },
    {
      text: "Scott Smith is joining in June and brings specific expertise to the AnewHomes lane \u2014 the development track that sits alongside brokerage as a separate, disciplined line. The office is no longer just selling assets. It is beginning to shape them.",
    },
    {
      text: "Zoila Ortega Astor joins as Office Director on May 4. She is the administrative anchor \u2014 the person who makes the office function as an institution rather than as a collection of individuals. 26 Park Place becomes a real office the day she walks in.",
    },
    // The Breakthrough / intelligence layer
    {
      heading: "The Breakthrough",
      text: "The breakthrough was not just building pages. It was turning memory into infrastructure. Before this, Ed\u2019s twenty years of territory knowledge lived in his head. If you weren\u2019t in the car with him, you didn\u2019t have it. Now, you do. Six months of thinking \u2014 market knowledge, recruiting logic, pipeline discipline, Christie\u2019s relationships, development thinking, documents, decisions, briefs \u2014 no longer live in scattered chats or in Ed\u2019s head alone. They live in one system. Visible. Searchable. Usable.",
    },
    {
      text: "The second shift was when the intelligence layer went live. Perplexity proved it could do more than answer questions \u2014 it could verify numbers, read spreadsheets, trace information back to real sources, and write those findings directly into the system. The spreadsheets stopped being static. The dashboard stopped being a display. It started maintaining itself. The hamlet data stays accurate because it is checked. The outreach list grows because it is being built in real time. The system does not just hold information. It keeps it alive.",
    },
    // The Platform
    {
      heading: "The Platform",
      text: "It lives at christiesrealestategroupeh.com. Everything a serious family, a serious broker, or a serious partner needs falls somewhere inside the six primary tabs and the export layer connected to them.",
    },
    {
      text: "HOME \u2014 the voice and the front door. MARKET \u2014 the verified territory truth. PIPE \u2014 the live deal engine. MAPS \u2014 geography as decision-making. INTEL \u2014 the relationship and hierarchy layer. FUTURE \u2014 the growth model and long-range trajectory.",
      italic: true,
    },
    // INTEL tab
    {
      heading: "The INTEL Tab",
      text: "This tab is doing three distinct jobs simultaneously. First: relationship memory. Every person in Ed\u2019s professional life is on the map, organized by how they relate to the business. If a name is on this map, it exists for a reason and has a next step attached to it. Second: hierarchy and ascension. The map shows the full Christie\u2019s institutional chain above Ed \u2014 with the auction referrals node sitting between Ed and Tash Perrin, making the thesis visible. Third: the nine master Google Sheets are all accessible directly from this tab. Open them. Backtrack the numbers. The four tabs Angel uses every week to run the outreach campaign are accessible from here.",
    },
    // Podcast / calculator visibility
    {
      heading: "The Calculator",
      text: "The calculator on MAPS does not care about geography. The math is universal. It works for a seller understanding net proceeds, an investor evaluating a build, an attorney needing estate context, a fellow broker in any market running any deal structure. That portability is intentional. This is something Ed can open in a conversation \u2014 whether with a client, a broker, or on a podcast \u2014 and show exactly how the office thinks.",
    },
    // William
    {
      heading: "William",
      text: "William is the intelligence voice of the institution. The audio links on every page open to a live briefing in Ed\u2019s voice. Send a keyword to 631-239-7190 \u2014 NEWS for the current market report, LETTER for the full orientation \u2014 and William responds in seconds. Ed turns to William before every conversation that matters.",
    },
    {
      text: "The thinking behind William is not random. It pulls from a disciplined framework \u2014 Jamie Dimon on capital and risk, Naval Ravikant on leverage and systems, Codie Sanchez on ownership, Alex Hormozi on clarity and measurement, and Richard Bruehl on truth and culture. And it ends with scripture. Not as decoration. As alignment.",
    },
    {
      text: "Text NEWS to 631-239-7190 anytime you want a market brief. William responds immediately.",
      italic: true,
    },
    // What This Is For / broker recruiting
    {
      heading: "What This Is For",
      text: "This is not for the office. This is for the families. The ones on Further Lane who do not know what they own. The ones who built something over forty years and need someone to sit on their side of the table and tell them the truth. Not to impress them. Not to rush them. To help them understand what they have, what it means, and what should happen next.",
    },
    {
      text: "For a broker considering Christie\u2019s East Hampton \u2014 this is what you are joining. Not a desk. Not a split. An operating system that does the thinking before you walk in the door. The territory, the pipeline, the relationships, the briefs, the cards \u2014 they are already in place. Your job is to learn the system fast, tell the truth inside it, and then go sit with the right families and do the work without pretending to be something you are not.",
    },
    // The Model
    {
      heading: "The Model",
      text: "Not ambition. Arithmetic. And proof. Ed has already done over $1 billion in career sales across twenty years on this land. Now the model is institutional. 2026 \u2014 $55 million. 2027 \u2014 $273 million. 2030 \u2014 three offices. By 2033 \u2014 $1.101 billion crossed. By 2036 this institution becomes a permanent fixture of the East End and a national reference point for what a luxury real estate institution can be at scale. Every decision today is being made for the operator who will be running it in 2032. Every stage is gated by proof. East Hampton first. Southampton only when the base is undeniable. Westhampton only when the first two offices carry their own weight. If the model is wrong, it will be wrong on the conservative side. Every input has a name. Every number has a source.",
    },
    // Honest summary
    {
      heading: "The Honest Summary",
      text: "We built a real estate intelligence platform that thinks like an institution. We corrected what was wrong. We removed what did not belong. We rebuilt what broke. We stopped performing legitimacy. And started operating from what is real. It sits at christiesrealestategroupeh.com right now. Not as a brochure. As a working system.",
    },
    {
      text: "Click through it. Every tab. Open the sheets. Run the calculator. Download the exports. Spend an hour. Most questions will answer themselves. The ones that don\u2019t \u2014 bring those to the table. That feedback is exactly what made this system honest in the first place.",
    },
    {
      text: "You are not being asked to sell a platform. You are being asked to carry a standard. And first \u2014 you are being asked to tell us if we got it right.",
    },
  ];

  for (const section of sections) {
    if (section.heading) {
      doc.setFontSize(8);
      doc.setTextColor(...C.gold);
      doc.setFont('helvetica', 'bold');
      doc.text(section.heading.toUpperCase(), ml, y);
      y += 4.5;
      doc.setDrawColor(...C.gold);
      doc.setLineWidth(0.25);
      doc.line(ml, y, ml + 30, y);
      y += 4;
    }
    doc.setFontSize(BODY_SIZE);
    doc.setTextColor(...C.charcoal);
    doc.setFont('helvetica', section.italic ? 'italic' : 'normal');
    const lines = doc.splitTextToSize(section.text, cw);
    // Page break check
    if (y + lines.length * LINE_H > PAGE.h - 40) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines, ml, y);
    y += lines.length * LINE_H + PARA_GAP;
  }

  y += 6;

  // ── Closing ───────────────────────────────────────────────────────────────
  doc.setFontSize(BODY_SIZE);
  doc.setTextColor(...C.charcoal);
  doc.setFont('helvetica', 'normal');
  const closingLines = [
    'Jarvis, you already know the field. Now you have the infrastructure behind you. Tell us what it is missing.',
    'Angel, the machine moves because you keep it moving. Tell us where it is slowing down.',
    'Zoila, you are walking into something that is already in motion. Tell us what it needs to become a real office.',
    'Scott, you bring AnewHomes from a single proof of concept to a repeatable line. Tell us where the platform needs to support what you are about to build.',
    'Ricky, this is what your counsel forced us to become. Tell us if it lives up to what you meant.',
    '',
    'The foundation is proven. The model is working. The next 14 days set the trajectory.',
  ];
  for (const line of closingLines) {
    if (y + LINE_H > PAGE.h - 40) { doc.addPage(); y = 20; }
    doc.text(line, ml, y);
    y += LINE_H + 2;
  }

  y += 8;

  // ── Signature ─────────────────────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'bold');
  doc.text('Ed Bruehl', ml, y);
  y += 5.5;
  doc.setFontSize(8.5);
  doc.setTextColor(...C.charcoal);
  doc.setFont('helvetica', 'normal');
  doc.text('Managing Director', ml, y);
  y += 5;
  doc.text("Christie\u2019s International Real Estate Group \u00b7 East Hampton", ml, y);
  y += 8;
  // D51: SDG preserved in source, stripped from public PDF render (Apr 19 2026)

  // ── Bottom gold rule + footer ─────────────────────────────────────────────
  const footerRuleY = PAGE.h - 22;
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.6);
  doc.line(ml, footerRuleY, PAGE.w - mr, footerRuleY);
  doc.setFontSize(7);
  doc.setTextColor(...C.navy);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Ed Bruehl, Managing Director  \u00b7  M: 646.752.1233  \u00b7  O: 631.771.7004  \u00b7  edbruehl@christiesrealestategroup.com  \u00b7  26 Park Place, East Hampton NY 11937',
    PAGE.w / 2, footerRuleY + 5, { align: 'center' }
  );
  // D36: INTERNAL · TEAM-FACING label stripped from public PDF (Apr 19 2026)

  downloadPdf(doc, `Christies-Flagship-Letter-${today().replace(/\s/g, '-')}.pdf`);
}

// ─── 7. Eleven Hamlets Volume Distribution -- One-Page Donut Chart PDF ──────────
// Council directive: April 9, 2026 -- one-page PDF, donut chart + legend table + header/footer.
// Draws the donut ring in jsPDF using arc math (no canvas dependency).

export async function generateElevenHamletsPDF(liveRows?: LiveMatrixRow[]): Promise<void> {
  const { jsPDF: JsPDF } = await import('jspdf');
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── Assets ──────────────────────────────────────────────────────────────────
  const { edImg, logoImg, qrImg } = await loadPdfAssets();

  // ── Page constants ───────────────────────────────────────────────────────────
  const P = PAGE;
  const CN = C;

  // ── Header ───────────────────────────────────────────────────────────────────
  let y = await drawHeader(
    doc,
    'Eleven Hamlets · East End',
    'Volume Distribution · 2025 · Christie\'s Intelligence Score',
    edImg,
    logoImg,
  );

  // ── Merge static + live data ─────────────────────────────────────────────────
  const TIER_HEX: Record<string, [number, number, number]> = {
    'Ultra-Trophy': [200, 172, 120],  // gold
    'Trophy':       [27,  42,  74],   // navy
    'Premier':      [56,  66,  73],   // charcoal
    'Opportunity':  [122, 138, 142],  // muted
  };

  const hamlets = MASTER_HAMLET_DATA.map(h => {
    const match = liveRows?.find(r => r.hamlet.toLowerCase().replace(/[^a-z]/g, '') === h.name.toLowerCase().replace(/[^a-z]/g, ''));
    const liveShare = match ? parseFloat(String(match.dollarVolumeShare)) || h.volumeShare : h.volumeShare;
    const liveMedian = match?.median2025 ?? h.medianPriceDisplay;
    const liveCis = match?.cisScore ?? h.anewScore;
    return { ...h, liveShare, liveMedian, liveCis };
  });

  const total = hamlets.reduce((s, h) => s + h.liveShare, 0);

  // ── Donut ring -- pure jsPDF arcs ─────────────────────────────────────────────
  // Center: horizontally centered, vertically positioned below header
  const cx = P.w / 2;
  const cy = y + 52;
  const outerR = 42;
  const innerR = 25;
  const GAP_DEG = 1.5;

  let cursor = -90; // start at 12 o'clock
  for (const h of hamlets) {
    const span = (h.liveShare / total) * 360;
    const start = cursor + GAP_DEG / 2;
    const end = cursor + span - GAP_DEG / 2;
    const color = TIER_HEX[h.tier] ?? [122, 138, 142];

    // Draw filled arc segment using jsPDF ellipse approximation
    // jsPDF doesn't have native arc-to-arc, so we use lines + ellipse segments
    const STEPS = Math.max(4, Math.round(span / 6));
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // Build outer arc points
    const outerPts: [number, number][] = [];
    for (let i = 0; i <= STEPS; i++) {
      const a = toRad(start + (end - start) * (i / STEPS));
      outerPts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
    }
    // Build inner arc points (reverse)
    const innerPts: [number, number][] = [];
    for (let i = STEPS; i >= 0; i--) {
      const a = toRad(start + (end - start) * (i / STEPS));
      innerPts.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
    }

    doc.setFillColor(...color);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.1);

    // Move to first outer point, draw outer arc, connect to inner arc
    const allPts = [...outerPts, ...innerPts];
    if (allPts.length >= 2) {
      (doc as any).lines(
        allPts.slice(1).map((pt, i) => [pt[0] - allPts[i][0], pt[1] - allPts[i][1]]),
        allPts[0][0],
        allPts[0][1],
        [1, 1],
        'FD',
        true,
      );
    }

    cursor += span;
  }

  // ── Center label ─────────────────────────────────────────────────────────────
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...CN.navy);
  doc.text('HAMPTONS', cx, cy - 4, { align: 'center' });
  doc.text('MARKET', cx, cy + 3, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...CN.gold);
  doc.text('SIGNAL', cx, cy + 9, { align: 'center' });

  // ── Legend table -- right of donut ─────────────────────────────────────────────
  const legendX = cx + outerR + 12;
  const legendW = P.w - P.mr - legendX;
  let ly = cy - outerR + 2;

  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...CN.gold);
  doc.text('HAMLET', legendX, ly);
  doc.text('VOL%', legendX + legendW * 0.52, ly, { align: 'right' });
  doc.text('MEDIAN', legendX + legendW, ly, { align: 'right' });
  ly += 3;
  doc.setDrawColor(...CN.gold);
  doc.setLineWidth(0.3);
  doc.line(legendX, ly, legendX + legendW, ly);
  ly += 4;

  const sortedHamlets = [...hamlets].sort((a, b) => b.liveShare - a.liveShare);
  for (const h of sortedHamlets) {
    const color = TIER_HEX[h.tier] ?? [122, 138, 142];
    // Tier color swatch
    doc.setFillColor(...color);
    doc.rect(legendX, ly - 2.5, 2.5, 2.5, 'F');
    // Hamlet name
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...CN.navy);
    const shortName = h.name
      .replace('East Hampton Village', 'EH Village')
      .replace('Southampton Village', 'Southampton')
      .replace('East Hampton North', 'EH North');
    doc.text(shortName, legendX + 4, ly, { maxWidth: legendW * 0.48 });
    // Volume share
    doc.setTextColor(...CN.charcoal);
    doc.text(`${h.liveShare}%`, legendX + legendW * 0.52, ly, { align: 'right' });
    // Median
    doc.setTextColor(...CN.gold);
    doc.text(h.liveMedian, legendX + legendW, ly, { align: 'right' });
    ly += 5.5;
  }

  // ── Dominant corridor callout ─────────────────────────────────────────────────
  const dominant = sortedHamlets[0];
  const dominantY = cy + outerR + 10;
  doc.setFillColor(...CN.navy);
  doc.rect(P.ml, dominantY, P.contentW, 14, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...CN.gold);
  doc.text('DOMINANT CORRIDOR', P.ml + 4, dominantY + 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...CN.cream);
  doc.text(`${dominant.name} · ${dominant.liveShare}% of East End dollar volume`, P.ml + 4, dominantY + 11);

  // ── Source attribution ─────────────────────────────────────────────────────────────────────────────────
  const srcY = dominantY + 22;
  doc.setFontSize(5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...CN.muted);
  doc.text(
    'Sources: Verified market intelligence · Christie\'s East Hampton internal analysis · MLS-backed public records. Dollar volume represents closed residential transactions, East End, Jan–Dec 2025.',
    P.ml,
    srcY,
    { maxWidth: P.contentW },
  );

  // ── Footer ────────────────────────────────────────────────────────────────────
  drawFooter(doc, 1, 1, qrImg);

  downloadPdf(doc, `Christies-EH-Eleven-Hamlets-${today().replace(/\s/g, '-')}.pdf`);
}


// ─── ANEW Deal Engine Memo (2 pages) ─────────────────────────────────────────
export interface DealEngineOutputForPdf {
  basis:           number;
  equity:          number;
  equityPct:       number;
  noi:             number;
  capRate:         number;
  incomeGrade:     string;
  basisGrade:      string;
  stewardship:     string;
  dealType:        string;
  coc:             number;
  tenYrValue: { floor: number; base: number; stretch: number; };
  sellNowAfterTax:   number;
  hold10yrAfterTax:  number;
  taxShortTerm:      number;
  taxLongTerm:       number;
}
export interface DealMemoInputs {
  purchase: number; addlCap: number; baseValue: number;
  rent: number; holdYears: number; cocPct: number;
}
export async function generateAnewDealMemo(opts: {
  dealName: string; hamlet?: string;
  inputs: DealMemoInputs; result: DealEngineOutputForPdf;
}): Promise<void> {
  const { dealName, hamlet, inputs, result } = opts;
  const { logoImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const GOLD_PDF: [number,number,number] = [148,114,49];
  const NAVY_PDF: [number,number,number] = [13,27,42];
  const CREAM_PDF: [number,number,number] = [250,248,244];
  const MUTED_PDF: [number,number,number] = [140,140,140];
  const ml = PAGE.ml; const mr = PAGE.mr; const cw = PAGE.contentW;
  const dateStr = new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  const goldKv = (label: string, value: string, y: number, accent = false): number => {
    doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(...MUTED_PDF);
    doc.text(label.toUpperCase(), ml, y);
    doc.setFont('helvetica', accent ? 'bold' : 'normal');
    doc.setTextColor(...(accent ? GOLD_PDF : NAVY_PDF));
    doc.text(value, ml+80, y); return y+6.5;
  };
  const goldDivider = (y: number): number => {
    doc.setDrawColor(...GOLD_PDF); doc.setLineWidth(0.4);
    doc.line(ml, y, PAGE.w-mr, y); return y+5;
  };
  // PAGE 1
  doc.setFillColor(...NAVY_PDF); doc.rect(0,0,PAGE.w,30,'F');
  doc.setDrawColor(...GOLD_PDF); doc.setLineWidth(0.8); doc.line(ml,30,PAGE.w-mr,30);
  if (logoImg) { try { doc.addImage(logoImg,'PNG',ml,8,16,4); } catch {} }
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF);
  doc.text("CHRISTIE'S EAST HAMPTON · ANEW DEAL ENGINE", PAGE.w/2, 12, {align:'center'});
  doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(...CREAM_PDF);
  doc.text(dealName, PAGE.w/2, 21, {align:'center'});
  if (hamlet) { doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...GOLD_PDF); doc.text(hamlet, PAGE.w/2, 27, {align:'center'}); }
  doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...MUTED_PDF);
  doc.text(dateStr, PAGE.w-mr, 12, {align:'right'});
  let y = 40;
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF); doc.text('INPUTS', ml, y);
  y = goldDivider(y+2);
  y = goldKv('1. Purchase Price', fmtUSD(inputs.purchase), y);
  y = goldKv('2. Additional Capital', fmtUSD(inputs.addlCap), y);
  y = goldKv('3. Base Value (Your Est.)', fmtUSD(inputs.baseValue), y);
  y = goldKv('4. Annual Rent (Gross)', fmtUSD(inputs.rent), y);
  y = goldKv('5. Hold Period', inputs.holdYears+' years', y);
  y = goldKv('6. Cost of Capital', inputs.cocPct.toFixed(1)+'%', y);
  y += 4;
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF); doc.text('CORE OUTPUTS', ml, y);
  y = goldDivider(y+2);
  y = goldKv('All-In Basis', fmtUSD(result.basis), y);
  y = goldKv('Equity Day One', fmtUSD(result.equity)+'   ('+fmtPct(result.equityPct*100)+')', y);
  y = goldKv('NOI', fmtUSD(result.noi), y);
  y = goldKv('Cap Rate', fmtPct(result.capRate*100), y);
  y = goldKv('Cash-on-Cash', fmtPct(result.coc*100), y);
  y += 4;
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF); doc.text('GRADES · VERDICT', ml, y);
  y = goldDivider(y+2);
  y = goldKv('Income Grade', result.incomeGrade, y, true);
  y = goldKv('Basis Grade', result.basisGrade, y, true);
  y = goldKv('Stewardship', result.stewardship, y, true);
  if (result.dealType) { y = goldKv('Deal Type', result.dealType, y, true); }
  const doctrineY = PAGE.h-PAGE.mb-22;
  doc.setFillColor(248,246,240); doc.roundedRect(ml,doctrineY,cw,16,2,2,'F');
  doc.setDrawColor(...GOLD_PDF); doc.setLineWidth(0.3); doc.roundedRect(ml,doctrineY,cw,16,2,2,'S');
  doc.setFontSize(7.5); doc.setFont('helvetica','italic'); doc.setTextColor(...NAVY_PDF);
  doc.text('Default: Hold. Sell only if redeployment beats compounding.', PAGE.w/2, doctrineY+7, {align:'center'});
  doc.setFontSize(6.5); doc.setFont('helvetica','normal'); doc.setTextColor(...MUTED_PDF);
  doc.text('One calculator. Six inputs. Two grades. One verdict.', PAGE.w/2, doctrineY+12, {align:'center'});
  doc.setFontSize(6); doc.setFont('helvetica','normal'); doc.setTextColor(...MUTED_PDF);
  doc.text('Page 1 of 2', PAGE.w/2, PAGE.h-8, {align:'center'});
  doc.text("Christie's East Hampton · ANEW Deal Engine v1", ml, PAGE.h-8);
  // PAGE 2
  doc.addPage();
  doc.setFillColor(...NAVY_PDF); doc.rect(0,0,PAGE.w,30,'F');
  doc.setDrawColor(...GOLD_PDF); doc.setLineWidth(0.8); doc.line(ml,30,PAGE.w-mr,30);
  if (logoImg) { try { doc.addImage(logoImg,'PNG',ml,8,16,4); } catch {} }
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF);
  doc.text("CHRISTIE'S EAST HAMPTON · ANEW DEAL ENGINE", PAGE.w/2, 12, {align:'center'});
  doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(...CREAM_PDF);
  doc.text(dealName+' — Projection', PAGE.w/2, 21, {align:'center'});
  doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...MUTED_PDF);
  doc.text(dateStr, PAGE.w-mr, 12, {align:'right'});
  y = 40;
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF); doc.text('10-YEAR VALUE PROJECTION', ml, y);
  y = goldDivider(y+2);
  const bandW = (cw-8)/3;
  const bandDefs = [
    {label:'FLOOR (x0.90)', value:fmtUSD(result.tenYrValue.floor), r:MUTED_PDF[0], g:MUTED_PDF[1], b:MUTED_PDF[2]},
    {label:'BASE (x1.00)',  value:fmtUSD(result.tenYrValue.base),  r:GOLD_PDF[0],  g:GOLD_PDF[1],  b:GOLD_PDF[2]},
    {label:'STRETCH (x1.10)',value:fmtUSD(result.tenYrValue.stretch),r:NAVY_PDF[0], g:NAVY_PDF[1],  b:NAVY_PDF[2]},
  ];
  bandDefs.forEach((band,i) => {
    const bx = ml+i*(bandW+4);
    doc.setFillColor(248,246,240); doc.roundedRect(bx,y,bandW,20,2,2,'F');
    doc.setDrawColor(...GOLD_PDF); doc.setLineWidth(0.3); doc.roundedRect(bx,y,bandW,20,2,2,'S');
    doc.setFontSize(6); doc.setFont('helvetica','bold'); doc.setTextColor(...MUTED_PDF);
    doc.text(band.label, bx+bandW/2, y+6, {align:'center'});
    doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(band.r,band.g,band.b);
    doc.text(band.value, bx+bandW/2, y+15, {align:'center'});
  });
  y += 26;
  doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF); doc.text('AFTER-TAX OUTCOME', ml, y);
  y = goldDivider(y+2);
  y = goldKv('Sell Now (After Tax)', fmtUSD(result.sellNowAfterTax), y);
  y = goldKv('Hold 10 Years (After Tax)', fmtUSD(result.hold10yrAfterTax), y, true);
  y += 2;
  doc.setFontSize(6.5); doc.setFont('helvetica','italic'); doc.setTextColor(...MUTED_PDF);
  doc.text('Tax assumption: '+(result.taxShortTerm*100).toFixed(0)+'% short-term · '+(result.taxLongTerm*100).toFixed(0)+'% long-term · 8% sell costs', ml, y);
  y += 10;
  const p2DoctrineY = y+4;
  doc.setFillColor(...NAVY_PDF); doc.roundedRect(ml,p2DoctrineY,cw,28,3,3,'F');
  doc.setDrawColor(...GOLD_PDF); doc.setLineWidth(0.5); doc.roundedRect(ml,p2DoctrineY,cw,28,3,3,'S');
  doc.setFontSize(9); doc.setFont('helvetica','bolditalic'); doc.setTextColor(...GOLD_PDF);
  doc.text('Default: Hold. Sell only if redeployment beats compounding.', PAGE.w/2, p2DoctrineY+10, {align:'center'});
  doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(...CREAM_PDF);
  doc.text('One calculator. Six inputs. Two grades. One verdict.', PAGE.w/2, p2DoctrineY+18, {align:'center'});
  doc.setFontSize(6.5); doc.setFont('helvetica','italic'); doc.setTextColor(148,114,49);
  doc.text("That's the hum.", PAGE.w/2, p2DoctrineY+24, {align:'center'});
  doc.setFontSize(6); doc.setFont('helvetica','normal'); doc.setTextColor(...MUTED_PDF);
  doc.text('Page 2 of 2', PAGE.w/2, PAGE.h-8, {align:'center'});
  doc.text("Christie's East Hampton · ANEW Deal Engine v1", ml, PAGE.h-8);
  doc.setFont('helvetica','bold'); doc.setTextColor(...GOLD_PDF);
  doc.text('Soli Deo Gloria.', PAGE.w-mr, PAGE.h-8, {align:'right'});
  const safeName = (dealName||'Deal').replace(/[^a-zA-Z0-9]/g,'_');
  const dateTag = new Date().toISOString().slice(0,10).replace(/-/g,'');
  downloadPdf(doc, 'ANEW_'+safeName+'_'+dateTag+'.pdf');
}
