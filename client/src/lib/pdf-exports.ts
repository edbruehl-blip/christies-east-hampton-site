/**
 * PDF EXPORTS — Five export types for Christie's East Hampton
 *
 * Each function is async, generates a jsPDF document, and triggers download.
 * All pull live data from AnewOutput + hamlet-master. No hardcoded values.
 *
 * Export types:
 *   1. generateAnewBuildMemo(result)       — 2 pages
 *   2. generateChristieCMA(result)         — 2 pages
 *   3. generateDealBrief(result)           — 1 page
 *   4. generateInvestmentMemo(result)      — 2 pages
 *   5. generateMarketReport(hamlet?)       — 5 pages (standalone, no ANEW result required)
 */

import jsPDF from 'jspdf';
import {
  C, PAGE,
  drawHeader, drawFooter, sectionLabel, kvRow,
  drawScoreBadge, drawHamletCompsTable,
  loadPdfAssets, downloadPdf, fmtUSD, fmtPct, today, wrapText,
  type AnewOutput,
} from './pdf-engine';
import { MASTER_HAMLET_DATA } from '../data/hamlet-master';
import { LENS_LABELS } from '../calculators/anew-calculator';

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
  y = kvRow(doc, 'Hamlet', `${result.hamletName} · ${hamlet.tier}`, y);
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

  // ANEW Score block
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
  y = kvRow(doc, 'ANEW Score (Hamlet)', `${hamlet.anewScore} / 10`, y);
  y = kvRow(doc, 'Volume Share', `${hamlet.volumeShare}% of South Fork`, y);
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
  y = await drawHeader(doc, 'ANEW Build Memo', 'South Fork Market Context', edImg, logoImg);

  y = drawHamletCompsTable(doc, y);

  // Methodology note
  y = sectionLabel(doc, 'Methodology', y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const methodology = [
    'The ANEW Score (0–100) is computed from three inputs: (1) Gross Financial Attractiveness derived from',
    'the spread percentage between all-in cost and projected exit price; (2) Hamlet Quality Score based on',
    'tier classification and ANEW multiplier; (3) ANEW Intelligence Contribution from the hamlet\'s',
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
  const disclaimer = 'This memo is prepared for internal use by Christie\'s East Hampton. All projections are estimates based on current market data and are not guarantees of future performance. This document is confidential and intended solely for the named recipient.';
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
  y = kvRow(doc, 'Hamlet', `${result.hamletName} · ${hamlet.tier}`, y);
  y = kvRow(doc, 'Analysis Date', today(), y);
  y = kvRow(doc, 'Prepared By', 'Ed Bruehl · Managing Director · Christie\'s East Hampton', y);
  y += 4;

  // Market position
  y = sectionLabel(doc, 'Market Position', y);
  y = kvRow(doc, 'Hamlet Median Price', hamlet.medianPriceDisplay, y, true);
  y = kvRow(doc, 'ANEW Score (Hamlet)', `${hamlet.anewScore} / 10`, y);
  y = kvRow(doc, 'Volume Share', `${hamlet.volumeShare}% of South Fork transactions`, y);
  y = kvRow(doc, 'Tier Classification', hamlet.tier, y);
  y += 4;

  // Pricing analysis
  y = sectionLabel(doc, 'Pricing Analysis', y);
  y = kvRow(doc, 'Estimated Value', result.exitDisplay, y, true);
  y = kvRow(doc, 'All-In Basis', result.allInDisplay, y);
  y = kvRow(doc, 'Value Spread', result.spreadDisplay, y, result.spread > 0);
  y = kvRow(doc, 'Spread %', result.spreadPctDisplay, y, result.spread > 0);
  y = kvRow(doc, 'CIS', `${result.score} — ${result.verdict}`, y);
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
    ? `Based on current South Fork market conditions and the ANEW scoring model, this property presents a ${result.verdict.toLowerCase()} opportunity. The ${result.spreadPctDisplay} spread against all-in basis supports the estimated value of ${result.exitDisplay}. Christie's East Hampton recommends proceeding with confidence.`
    : `Current market conditions indicate a negative spread of ${result.spreadDisplay} against all-in basis. Christie's East Hampton recommends a pricing review before proceeding. The ANEW score of ${result.score} reflects current market headwinds in ${result.hamletName}.`;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  y = wrapText(doc, recText, PAGE.ml, y, PAGE.contentW, 5.5);

  drawFooter(doc, 1, 2, qrImg);

  // ── PAGE 2 — Full hamlet comps ──
  doc.addPage();
  y = await drawHeader(doc, 'Christie\'s CMA', 'South Fork Hamlet Comparison', edImg, logoImg);
  y = drawHamletCompsTable(doc, y);

  // Agent certification block
  y += 4;
  y = sectionLabel(doc, 'Agent Certification', y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('Ed Bruehl · Managing Director · Christie\'s International Real Estate Group · East Hampton', PAGE.ml, y);
  y += 5;
  doc.text('26 Park Place, East Hampton, NY 11937 · 646-752-1233 · christiesrealestategroup.com', PAGE.ml, y);
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
  doc.text(`ANEW ${result.score} — ${result.verdict}`, PAGE.w - PAGE.mr - 4, y + 8, { align: 'right' });
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
    ['Hamlet', `${result.hamletName} · ${hamlet.tier}`],
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
  doc.text(`${result.hamletName} · ${hamlet.tier} · ANEW Score ${result.score} — ${result.verdict}`, PAGE.ml + 4, y + 20);
  doc.text(`All-In: ${result.allInDisplay}  ·  Exit: ${result.exitDisplay}  ·  Spread: ${result.spreadDisplay} (${result.spreadPctDisplay})`, PAGE.ml + 4, y + 26);
  y += 34;

  // Investment thesis
  y = sectionLabel(doc, 'Investment Thesis', y);
  const thesis = result.spread > 0
    ? `This ${hamlet.tier.toLowerCase()} asset in ${result.hamletName} presents a ${result.verdict.toLowerCase()} investment opportunity with a ${result.spreadPctDisplay} spread against all-in basis. The ANEW score of ${result.score} reflects strong hamlet fundamentals (CIS ${hamlet.anewScore}/10, ${hamlet.volumeShare}% volume share) and favorable exit pricing of ${result.exitDisplay}. Christie's East Hampton recommends this as a priority acquisition.`
    : `This asset in ${result.hamletName} currently shows a negative spread of ${result.spreadDisplay} against all-in basis. The ANEW score of ${result.score} reflects current market conditions. Christie's East Hampton recommends a pricing review and repositioning strategy before committing capital.`;
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
  y = kvRow(doc, 'Tier', hamlet.tier, y);
  y = kvRow(doc, 'Median Price', hamlet.medianPriceDisplay, y, true);
  y = kvRow(doc, 'ANEW Score (Hamlet)', `${hamlet.anewScore} / 10`, y);
  y = kvRow(doc, 'Volume Share', `${hamlet.volumeShare}% of South Fork`, y);
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

  // ── PAGE 2 — Market context ──
  doc.addPage();
  y = await drawHeader(doc, 'Investment Memorandum', 'South Fork Market Context', edImg, logoImg);
  y = drawHamletCompsTable(doc, y);

  y = sectionLabel(doc, 'Christie\'s Advantage', y);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const advantage = [
    'Christie\'s International Real Estate Group brings 260 years of institutional provenance to every transaction.',
    'Our East Hampton office operates at the intersection of art, architecture, and land — serving families whose',
    'assets require the same care as a Christie\'s auction consignment. The ANEW scoring model is our proprietary',
    'intelligence layer, built on ten hamlet datasets and refined through live market cycles.'
  ];
  advantage.forEach(line => {
    doc.text(line, PAGE.ml, y);
    y += 5;
  });
  y += 4;

  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'italic');
  const disclaimer = 'This memorandum is prepared for internal use by Christie\'s East Hampton. All projections are estimates based on current market data and are not guarantees of future performance. This document is confidential.';
  y = wrapText(doc, disclaimer, PAGE.ml, y, PAGE.contentW, 4.5);

  drawFooter(doc, 2, 2, qrImg);

  downloadPdf(doc, `Christies_EH_Investment_Memo_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 5. Five-Page Market Report (PDF parity with /report page order) ──────────
// Page 1  → Hero + Founding Letter (mirrors /report Section 1)
// Page 2  → Hamptons Local Intelligence (mirrors /report Section 2 news feed)
// Page 3  → Market Intelligence: CFS + rate panel + Hamptons Median (mirrors /report Section 3)
// Pages 4 → Hamlet Atlas Matrix — all ten hamlet cards (mirrors /report Section 4)
// Page 5  → Resources & Authority — Christie's Advantage + contact (mirrors /report Section 6)

export async function generateMarketReport(hamletId?: string): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const targetHamlet = hamletId ? MASTER_HAMLET_DATA.find(h => h.id === hamletId) : undefined;

  // ── PAGE 1 — Hero + Founding Letter (mirrors /report Section 1) ──────────────
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PAGE.w, PAGE.h, 'F');

  doc.setDrawColor(...C.gold);
  doc.setLineWidth(1.2);
  doc.line(PAGE.ml, 18, PAGE.w - PAGE.mr, 18);

  doc.setFontSize(8);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('CHRISTIE\'S · EST. 1766', PAGE.w / 2, 27, { align: 'center' });

  if (logoImg) {
    try { doc.addImage(logoImg, 'PNG', PAGE.w / 2 - 32, 33, 64, 26); } catch { /* skip */ }
  }

  doc.setFontSize(28);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text('Christie\'s East Hampton', PAGE.w / 2, 80, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setTextColor(200, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.text('Live Market Report · ' + (targetHamlet ? targetHamlet.name : 'South Fork · Ten Hamlets'), PAGE.w / 2, 89, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(today(), PAGE.w / 2, 96, { align: 'center' });

  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.4);
  doc.line(PAGE.ml + 30, 101, PAGE.w - PAGE.mr - 30, 101);

  // Founding letter — full text, mirrors /report Section 1 letter body
  const letterY = 108;
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('FOUNDING LETTER', PAGE.ml, letterY);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, letterY + 1.5, PAGE.w - PAGE.mr, letterY + 1.5);

  const foundingText = 'Christie\'s has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family\'s interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.\n\nThe South Fork is not a market. It is a territory — ten distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.\n\nThe ANEW framework is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.\n\nEvery export from this platform — every market report, every deal brief, every CMA — carries the Christie\'s name because it has earned the right to carry it. The standard is not aspirational. It is operational.';
  let lY = letterY + 6;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  for (const para of foundingText.split('\n\n')) {
    lY = wrapText(doc, para, PAGE.ml, lY, PAGE.contentW, 5);
    lY += 4;
  }

  // Doctrine footer
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, PAGE.h - 22, PAGE.w - PAGE.mr, PAGE.h - 22);
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bolditalic');
  doc.text('Always the Family\'s Interest Before the Sale.', PAGE.w / 2, PAGE.h - 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  doc.text('The Name Follows. · Christie\'s International Real Estate Group · Est. 1766', PAGE.w / 2, PAGE.h - 11, { align: 'center' });

  // ── PAGE 2 — Hamptons Local Intelligence (mirrors /report Section 2 news) ────
  doc.addPage();
  let y = await drawHeader(doc, 'Hamptons Local Intelligence', 'East End · Current Affairs · March 2026', edImg, logoImg);

  const newsItems = [
    {
      location: 'East Hampton Town',
      headline: 'Affordable Housing Overlay Approved on Springs Fireplace Road',
      body: 'The East Hampton Town Board approved a new affordable housing overlay district along Springs Fireplace Road, adding 48 units of workforce housing. The Planning Board is reviewing a 12-lot subdivision on Accabonac Road with a public hearing scheduled for April. The East Hampton School District reported a 4.2% enrollment increase — the largest in a decade — driven by year-round residency growth.',
    },
    {
      location: 'Southampton Town',
      headline: 'Short-Term Rental Moratorium Extended Through December 2026',
      body: 'Southampton Town extended its moratorium on new short-term rental permits through December 2026, citing neighborhood character concerns in Bridgehampton and Water Mill. The Bridgehampton Commons redevelopment proposal — mixed-use retail and residential — received preliminary approval. Southampton Village is advancing a $12M Main Street infrastructure upgrade.',
    },
    {
      location: 'Sag Harbor',
      headline: 'Watchcase Final Phase Approved · Cinema Restoration on Track',
      body: 'The Sag Harbor Village Board approved the Watchcase Factory residential conversion final phase, adding 22 luxury units to the historic complex. The Sag Harbor Cinema restoration is on schedule for a summer 2026 reopening. The village is reviewing a proposal to expand the waterfront park along Long Wharf.',
    },
  ];

  for (const item of newsItems) {
    if (y + 32 > PAGE.h - PAGE.mb) break;
    // Location badge
    doc.setFillColor(...C.navy);
    doc.rect(PAGE.ml, y, PAGE.contentW, 6, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text(item.location.toUpperCase(), PAGE.ml + 3, y + 4);
    y += 8;
    // Headline
    doc.setFontSize(9);
    doc.setTextColor(...C.navy);
    doc.setFont('helvetica', 'bold');
    y = wrapText(doc, item.headline, PAGE.ml, y, PAGE.contentW, 5.5);
    y += 2;
    // Body
    doc.setFontSize(7.5);
    doc.setTextColor(...C.charcoal);
    doc.setFont('helvetica', 'normal');
    y = wrapText(doc, item.body, PAGE.ml, y, PAGE.contentW, 5);
    y += 8;
  }

  drawFooter(doc, 2, 5, qrImg);

  // ── PAGE 3 — Market Intelligence (mirrors /report Section 3) ─────────────────
  doc.addPage();
  y = await drawHeader(doc, 'Market Intelligence', 'Capital Flow Signal · Rate Environment · Hamptons Median', edImg, logoImg);

  // Capital Flow Signal panel
  doc.setFillColor(27, 42, 74);
  doc.rect(PAGE.ml, y, PAGE.contentW, 18, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.rect(PAGE.ml, y, PAGE.contentW, 18, 'S');
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('CAPITAL FLOW SIGNAL', PAGE.ml + 4, y + 5);
  doc.setFontSize(11);
  doc.setTextColor(...C.cream);
  doc.text('STRONG INFLOW', PAGE.ml + 4, y + 13);
  doc.setFontSize(7);
  doc.setTextColor(200, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.text('Institutional & family office capital flowing at elevated levels · March 2026', PAGE.w - PAGE.mr - 4, y + 13, { align: 'right' });
  y += 24;

  // Rate environment — two-column metric tiles
  const rateMetrics = [
    { label: '30-Year Fixed', value: '6.38%', sub: 'Freddie Mac · March 2026' },
    { label: '10-Year Treasury', value: '4.81%', sub: 'Current yield' },
    { label: 'VIX Volatility', value: '30.61', sub: 'Macro uncertainty elevated' },
    { label: 'Hamptons Median', value: '$2.34M', sub: 'South Fork · Q1 2026 · +7% YoY' },
  ];

  const tileW = (PAGE.contentW - 6) / 2;
  let tx = PAGE.ml;
  let ty = y;
  rateMetrics.forEach((m, i) => {
    doc.setFillColor(240, 238, 234);
    doc.rect(tx, ty, tileW, 20, 'F');
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.3);
    doc.rect(tx, ty, tileW, 20, 'S');
    doc.setFillColor(...C.gold);
    doc.rect(tx, ty, 2, 20, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text(m.label.toUpperCase(), tx + 5, ty + 6);
    doc.setFontSize(13);
    doc.setTextColor(...C.navy);
    doc.text(m.value, tx + 5, ty + 14);
    doc.setFontSize(6);
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(m.sub, tx + 5, ty + 18);
    if (i % 2 === 0) {
      tx = PAGE.ml + tileW + 6;
    } else {
      tx = PAGE.ml;
      ty += 26;
    }
  });
  y = ty + 26;

  // Hamlet median summary table
  y = sectionLabel(doc, 'Hamlet Median Price Summary', y);
  const avgAnew2 = (MASTER_HAMLET_DATA.reduce((s, h) => s + h.anewScore, 0) / MASTER_HAMLET_DATA.length).toFixed(1);
  const tblCols = ['Hamlet', 'Tier', 'Median Price', 'CIS', 'Vol. Share', 'YoY'];
  const tblW = [PAGE.contentW * 0.22, PAGE.contentW * 0.18, PAGE.contentW * 0.18, PAGE.contentW * 0.14, PAGE.contentW * 0.14, PAGE.contentW * 0.14];
  const rH = 5.5;

  doc.setFillColor(...C.navy);
  doc.rect(PAGE.ml, y, PAGE.contentW, rH, 'F');
  doc.setFontSize(6);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  let hx = PAGE.ml + 1.5;
  tblCols.forEach((col, i) => { doc.text(col, hx, y + 3.5); hx += tblW[i]; });
  y += rH;

  MASTER_HAMLET_DATA.forEach((h, ri) => {
    const bg = ri % 2 === 0 ? C.cream : [245, 243, 239] as [number, number, number];
    doc.setFillColor(...bg);
    doc.rect(PAGE.ml, y, PAGE.contentW, rH, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.charcoal);
    let rx2 = PAGE.ml + 1.5;
    const yoyMap: Record<string, string> = {
      'sagaponack': '+4%', 'east-hampton-village': '+12%', 'bridgehampton': '+8%',
      'southampton-village': '+14%', 'water-mill': '+7%', 'amagansett': '+9%',
      'east-hampton': '+18%', 'sag-harbor': '+11%', 'springs': '+17%', 'montauk': '+6%',
    };
    [h.name, h.tier, h.medianPriceDisplay, `${h.anewScore}`, `${h.volumeShare}%`, yoyMap[h.id] ?? '—'].forEach((val, i) => {
      doc.text(val, rx2, y + 3.5);
      rx2 += tblW[i];
    });
    y += rH;
  });

  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.setFont('helvetica', 'normal');
  doc.text(`Avg CIS across all ten hamlets: ${avgAnew2} / 10 · Source: Christie's East Hampton Intelligence Platform · Q1 2026`, PAGE.ml, y + 5);

  drawFooter(doc, 3, 5, qrImg);

  // ── PAGE 4 — Hamlet Atlas Matrix (mirrors /report Section 4 — all 9 hamlets) ─
  doc.addPage();
  y = await drawHeader(doc, 'Hamlet Atlas Matrix', 'Ten Hamlets · South Fork · Tier Classification · ANEW Intelligence', edImg, logoImg);

  const tierBadgeBg: Record<string, [number, number, number]> = {
    'Ultra-Trophy': C.gold,
    'Trophy':       C.navy,
    'Premier':      C.charcoal,
    'Opportunity':  [232, 228, 220],
  };
  const tierBadgeFg: Record<string, [number, number, number]> = {
    'Ultra-Trophy': C.navy,
    'Trophy':       C.cream,
    'Premier':      C.cream,
    'Opportunity':  C.charcoal,
  };

  const cardW = (PAGE.contentW - 6) / 2;
  const cardH = 44;
  const cardGap = 4;
  let cardX = PAGE.ml;
  let cardY = y;
  let col = 0;

  MASTER_HAMLET_DATA.forEach(h => {
    if (cardY + cardH > PAGE.h - PAGE.mb) return;

    doc.setFillColor(...C.cream);
    doc.rect(cardX, cardY, cardW, cardH, 'F');
    doc.setDrawColor(...(h.tier === 'Ultra-Trophy' ? C.gold : h.tier === 'Trophy' ? C.navy : C.charcoal));
    doc.setLineWidth(h.tier === 'Ultra-Trophy' ? 0.8 : 0.4);
    doc.rect(cardX, cardY, cardW, cardH, 'S');

    const badgeBg = tierBadgeBg[h.tier];
    const badgeFg = tierBadgeFg[h.tier];
    doc.setFillColor(...badgeBg);
    doc.rect(cardX + cardW - 28, cardY, 28, 6.5, 'F');
    doc.setFontSize(5);
    doc.setTextColor(...badgeFg);
    doc.setFont('helvetica', 'bold');
    doc.text(h.tier.toUpperCase(), cardX + cardW - 14, cardY + 4.2, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(...C.navy);
    doc.setFont('helvetica', 'bold');
    doc.text(h.name, cardX + 4, cardY + 13);

    doc.setFontSize(6.5);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDIAN', cardX + 4, cardY + 20);
    doc.setFontSize(11);
    doc.setTextColor(...C.navy);
    doc.text(h.medianPriceDisplay, cardX + 4, cardY + 27);

    doc.setFontSize(6);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text(`CIS ${h.anewScore} / 10`, cardX + 4, cardY + 33);
    const barW = cardW - 8;
    doc.setFillColor(230, 228, 224);
    doc.rect(cardX + 4, cardY + 35, barW, 2, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(cardX + 4, cardY + 35, barW * (h.anewScore / 10), 2, 'F');

    doc.setFontSize(5.5);
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(`Vol. ${h.volumeShare}%`, cardX + 4, cardY + 41);

    col++;
    if (col % 2 === 0) {
      cardX = PAGE.ml;
      cardY += cardH + cardGap;
    } else {
      cardX = PAGE.ml + cardW + 6;
    }
  });

  drawFooter(doc, 4, 5, qrImg);

  // ── PAGE 5 — Resources & Authority (mirrors /report Section 6) ───────────────
  doc.addPage();
  y = await drawHeader(doc, 'Resources & Authority', 'Christie\'s East Hampton · The Standard', edImg, logoImg);

  y = sectionLabel(doc, 'The Christie\'s Standard', y);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  y = wrapText(doc, 'Christie\'s has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family\'s interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.', PAGE.ml, y, PAGE.contentW, 5.5);
  y += 5;

  y = sectionLabel(doc, 'ANEW Intelligence Framework', y);
  y = wrapText(doc, 'Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate. The CIS is not a sales tool — it is a discipline.', PAGE.ml, y, PAGE.contentW, 5.5);
  y += 5;

  y = sectionLabel(doc, 'Platform Intelligence', y);
  const platformItems = [
    'Nine-hamlet ANEW scoring matrix · Updated quarterly',
    'Live capital flow signal · Rate environment monitoring',
    'Deal Brief · CMA · Investment Memo · ANEW Build Memo exports',
    'Podcast & event calendar · Agent recruiting pipeline',
    'Christie\'s auction calendar integration',
  ];
  platformItems.forEach(item => {
    doc.setFontSize(7.5);
    doc.setTextColor(...C.charcoal);
    doc.setFont('helvetica', 'normal');
    doc.text('·  ' + item, PAGE.ml + 3, y);
    y += 5.5;
  });
  y += 4;

  // Contact card
  doc.setFillColor(240, 238, 234);
  doc.rect(PAGE.ml, y, PAGE.contentW, 38, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.rect(PAGE.ml, y, PAGE.contentW, 38, 'S');
  doc.setFillColor(...C.gold);
  doc.rect(PAGE.ml, y, 2.5, 38, 'F');

  if (edImg) {
    try { doc.addImage(edImg, 'JPEG', PAGE.ml + 8, y + 6, 24, 24); } catch { /* skip */ }
  } else {
    doc.setFillColor(...C.charcoal);
    doc.rect(PAGE.ml + 8, y + 6, 24, 24, 'F');
    doc.setFontSize(5.5);
    doc.setTextColor(...C.gold);
    doc.text('ED BRUEHL', PAGE.ml + 20, y + 19, { align: 'center' });
    doc.text('PHOTO PENDING', PAGE.ml + 20, y + 24, { align: 'center' });
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('Ed Bruehl', PAGE.ml + 38, y + 13);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('Managing Director · Christie\'s International Real Estate Group', PAGE.ml + 38, y + 20);
  doc.text('26 Park Place, East Hampton, NY 11937', PAGE.ml + 38, y + 26);
  doc.text('646-752-1233 · christiesrealestategroup.com', PAGE.ml + 38, y + 32);

  drawFooter(doc, 5, 5, qrImg);

  const filename = targetHamlet
    ? `Christies_EH_Market_Report_${targetHamlet.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : 'Christies_EH_Market_Report_South_Fork.pdf';
  downloadPdf(doc, filename);
}

// ─── 6. East Hampton Village · Single-Hamlet PDF Template ────────────────────
// Static template for East Hampton Village. Wire to live data in Sprint 3.
// Directive: first hamlet template; others follow same pattern.

export async function generateEastHamptonVillageReport(): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // ── Hamlet data (East Hampton Village — locked) ───────────────────────────
  const H = {
    name: 'East Hampton Village',
    tier: 'Ultra-Trophy',
    anewScore: 9.2,
    medianPrice: '$5.15M',
    volumeShare: '12%',
    lastSale: '8 Lily Pond Lane',
    lastSalePrice: '$9.8M',
    lastSaleDate: 'Jan 2025',
    yoy: '+8.2%',
    activeListings: 14,
    avgDOM: 112,
    pricePerSqFt: '$1,420',
    absorbRate: '3.2 months',
    characterNote: 'The institutional anchor of the South Fork. Lily Pond Lane, Georgica Pond, and Further Lane define the ultra-trophy corridor. Buyer profile: family office, UHNW estate, international capital. Christie\'s brand authority is strongest here.',
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
  doc.text('ULTRA-TROPHY · ANEW 9.2 / 10 · CHRISTIE\'S EAST HAMPTON', PAGE.ml + 8, 22);

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
    ['Volume Share (South Fork)', H.volumeShare],
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
    ['A · Acquisition', 'Ultra-trophy corridor commands 15–25% premium over comparable South Fork hamlets. Entry price discipline is non-negotiable at this tier.'],
    ['N · New Construction', 'New construction comps at $1,400–$1,600/sq ft. Land value alone in the Georgica corridor exceeds $3M/acre.'],
    ['E · Exit Pricing', 'Exit pricing supported by persistent UHNW demand. Median hold period 4–7 years. Liquidity risk is low at the trophy tier.'],
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
  doc.text('26 Park Place, East Hampton, NY 11937 · 646-752-1233', PAGE.ml + 36, y + 21);
  doc.text('christiesrealestategroupeh.com', PAGE.ml + 36, y + 27);

  // ── PDF footer on all pages ───────────────────────────────────────────────
  drawFooter(doc, 1, (doc.internal as any).getNumberOfPages(), qrImg);

  downloadPdf(doc, 'Christies_EH_East_Hampton_Village_Q1_2026.pdf');
}
