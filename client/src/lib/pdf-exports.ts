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
  const { edImg, logoImg } = await loadPdfAssets();
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
  y = sectionLabel(doc, 'ANEW Score', y);
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

  drawFooter(doc, 1, 2);

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

  drawFooter(doc, 2, 2);

  downloadPdf(doc, `Christies_EH_ANEW_Build_Memo_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 2. Christie CMA (2 pages) ────────────────────────────────────────────────

export async function generateChristieCMA(result: AnewOutput): Promise<void> {
  const { edImg, logoImg } = await loadPdfAssets();
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
  y = kvRow(doc, 'ANEW Score', `${result.score} — ${result.verdict}`, y);
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

  drawFooter(doc, 1, 2);

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

  drawFooter(doc, 2, 2);

  downloadPdf(doc, `Christies_EH_CMA_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 3. Deal Brief (1 page) ───────────────────────────────────────────────────

export async function generateDealBrief(result: AnewOutput): Promise<void> {
  const { edImg, logoImg } = await loadPdfAssets();
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
    ['ANEW Score', `${hamlet.anewScore} / 10`],
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

  drawFooter(doc, 1, 1);

  downloadPdf(doc, `Christies_EH_Deal_Brief_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 4. Investment Memo (2 pages) ─────────────────────────────────────────────

export async function generateInvestmentMemo(result: AnewOutput): Promise<void> {
  const { edImg, logoImg } = await loadPdfAssets();
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
    ? `This ${hamlet.tier.toLowerCase()} asset in ${result.hamletName} presents a ${result.verdict.toLowerCase()} investment opportunity with a ${result.spreadPctDisplay} spread against all-in basis. The ANEW score of ${result.score} reflects strong hamlet fundamentals (ANEW ${hamlet.anewScore}/10, ${hamlet.volumeShare}% volume share) and favorable exit pricing of ${result.exitDisplay}. Christie's East Hampton recommends this as a priority acquisition.`
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
    ['ANEW Score', `${result.score} / 100`, false],
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

  drawFooter(doc, 1, 2);

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
    'intelligence layer, built on nine hamlet datasets and refined through live market cycles.',
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

  drawFooter(doc, 2, 2);

  downloadPdf(doc, `Christies_EH_Investment_Memo_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 5. Five-Page Market Report ───────────────────────────────────────────────

export async function generateMarketReport(hamletId?: string): Promise<void> {
  const { edImg, logoImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const targetHamlet = hamletId ? MASTER_HAMLET_DATA.find(h => h.id === hamletId) : undefined;

  // ── PAGE 1 — Cover ──
  // Full navy cover
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PAGE.w, PAGE.h, 'F');

  // Gold rule top
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(1.5);
  doc.line(PAGE.ml, 20, PAGE.w - PAGE.mr, 20);

  // Christie's mark
  doc.setFontSize(9);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('CHRISTIE\'S INTERNATIONAL REAL ESTATE GROUP', PAGE.w / 2, 30, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('EST. 1766 · EAST HAMPTON', PAGE.w / 2, 37, { align: 'center' });

  // Logo
  if (logoImg) {
    try {
      doc.addImage(logoImg, 'PNG', PAGE.w / 2 - 30, 42, 60, 24);
    } catch { /* skip */ }
  }

  // Report title
  doc.setFontSize(26);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Christie\'s', PAGE.w / 2, 90, { align: 'center' });
  doc.text('Hamptons Market Report', PAGE.w / 2, 103, { align: 'center' });

  // Gold rule
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml + 30, 110, PAGE.w - PAGE.mr - 30, 110);

  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(200, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(targetHamlet ? `${targetHamlet.name} · ${targetHamlet.tier}` : 'South Fork · Nine Hamlets', PAGE.w / 2, 118, { align: 'center' });
  doc.setFontSize(9);
  doc.text(today(), PAGE.w / 2, 126, { align: 'center' });

  // Ed headshot on cover
  if (edImg) {
    try {
      doc.addImage(edImg, 'JPEG', PAGE.w / 2 - 15, 145, 30, 30);
    } catch { /* skip */ }
  }
  doc.setFontSize(9);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text('Ed Bruehl', PAGE.w / 2, 180, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  doc.text('Managing Director · Christie\'s East Hampton', PAGE.w / 2, 186, { align: 'center' });
  doc.text('26 Park Place, East Hampton, NY 11937 · 646-752-1233', PAGE.w / 2, 192, { align: 'center' });

  // Bottom doctrine
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, PAGE.h - 28, PAGE.w - PAGE.mr, PAGE.h - 28);
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bolditalic');
  doc.text("Always the Family's Interest Before the Sale. The Name Follows.", PAGE.w / 2, PAGE.h - 22, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  doc.text("Christie's International Real Estate Group · Est. 1766 · East Hampton", PAGE.w / 2, PAGE.h - 16, { align: 'center' });

  // ── PAGE 2 — South Fork Overview ──
  doc.addPage();
  let y = await drawHeader(doc, 'South Fork Overview', 'Nine Hamlets · Current Market Conditions', edImg, logoImg);

  y = sectionLabel(doc, 'Market Summary', y);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const summary = 'The South Fork real estate market comprises nine distinct hamlets, each with its own price corridor, buyer profile, and institutional character. Sagaponack and East Hampton Village anchor the ultra-trophy tier. Bridgehampton, Southampton Village, and Water Mill form the trophy corridor. Sag Harbor, Amagansett, and East Hampton proper represent the premier tier. Springs offers the most accessible entry point with the strongest volume share.';
  y = wrapText(doc, summary, PAGE.ml, y, PAGE.contentW, 5.5);
  y += 6;

  // Key metrics
  const totalVolume = MASTER_HAMLET_DATA.reduce((s, h) => s + h.volumeShare, 0);
  const avgAnew = (MASTER_HAMLET_DATA.reduce((s, h) => s + h.anewScore, 0) / MASTER_HAMLET_DATA.length).toFixed(1);
  const medians = MASTER_HAMLET_DATA.map(h => h.medianPrice);
  const sfMedian = medians.reduce((s, m) => s + m, 0) / medians.length;

  y = sectionLabel(doc, 'Key Market Metrics', y);
  y = kvRow(doc, 'Hamlets Tracked', '9', y);
  y = kvRow(doc, 'South Fork Median (Avg)', fmtUSD(sfMedian), y, true);
  y = kvRow(doc, 'Average ANEW Score', `${avgAnew} / 10`, y);
  y = kvRow(doc, 'Volume Share Tracked', `${totalVolume}%`, y);
  y += 4;

  y = drawHamletCompsTable(doc, y);

  drawFooter(doc, 2, 5);

  // ── PAGE 3 — Ultra-Trophy & Trophy Hamlets ──
  doc.addPage();
  y = await drawHeader(doc, 'Ultra-Trophy & Trophy Hamlets', 'Sagaponack · East Hampton Village · Bridgehampton · Southampton · Water Mill', edImg, logoImg);

  const topHamlets = MASTER_HAMLET_DATA.filter(h => h.tier === 'Ultra-Trophy' || h.tier === 'Trophy');
  topHamlets.forEach(h => {
    if (y > PAGE.h - PAGE.mb - 40) { return; } // overflow guard
    y = sectionLabel(doc, h.name, y);
    y = kvRow(doc, 'Tier', h.tier, y);
    y = kvRow(doc, 'Median Price', h.medianPriceDisplay, y, true);
    y = kvRow(doc, 'ANEW Score', `${h.anewScore} / 10`, y);
    y = kvRow(doc, 'Volume Share', `${h.volumeShare}%`, y);
    y = kvRow(doc, 'Last Sale', `${h.lastSale} · ${h.lastSalePrice} · ${h.lastSaleDate}`, y);
    y = kvRow(doc, 'Anchor Dining', h.restaurants.anchor, y);
    y += 4;
  });

  drawFooter(doc, 3, 5);

  // ── PAGE 4 — Premier & Opportunity Hamlets ──
  doc.addPage();
  y = await drawHeader(doc, 'Premier & Opportunity Hamlets', 'Sag Harbor · Amagansett · East Hampton · Springs', edImg, logoImg);

  const lowerHamlets = MASTER_HAMLET_DATA.filter(h => h.tier === 'Premier' || h.tier === 'Opportunity');
  lowerHamlets.forEach(h => {
    if (y > PAGE.h - PAGE.mb - 40) { return; }
    y = sectionLabel(doc, h.name, y);
    y = kvRow(doc, 'Tier', h.tier, y);
    y = kvRow(doc, 'Median Price', h.medianPriceDisplay, y, true);
    y = kvRow(doc, 'ANEW Score', `${h.anewScore} / 10`, y);
    y = kvRow(doc, 'Volume Share', `${h.volumeShare}%`, y);
    y = kvRow(doc, 'Last Sale', `${h.lastSale} · ${h.lastSalePrice} · ${h.lastSaleDate}`, y);
    y = kvRow(doc, 'Anchor Dining', h.restaurants.anchor !== 'TBD' ? h.restaurants.anchor : 'TBD — next pass', y);
    y += 4;
  });

  drawFooter(doc, 4, 5);

  // ── PAGE 5 — Christie's Advantage + Contact ──
  doc.addPage();
  y = await drawHeader(doc, 'The Christie\'s Advantage', 'Why Christie\'s East Hampton', edImg, logoImg);

  y = sectionLabel(doc, 'Institutional Provenance Since 1766', y);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const p1 = 'Christie\'s has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family\'s interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.';
  y = wrapText(doc, p1, PAGE.ml, y, PAGE.contentW, 5.5);
  y += 6;

  y = sectionLabel(doc, 'The South Fork Standard', y);
  const p2 = 'The South Fork is not a market. It is a territory — nine distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.';
  y = wrapText(doc, p2, PAGE.ml, y, PAGE.contentW, 5.5);
  y += 6;

  y = sectionLabel(doc, 'ANEW Intelligence', y);
  const p3 = 'This platform exists to carry the Christie\'s standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.';
  y = wrapText(doc, p3, PAGE.ml, y, PAGE.contentW, 5.5);
  y += 8;

  // Contact block
  doc.setFillColor(240, 238, 234);
  doc.rect(PAGE.ml, y, PAGE.contentW, 32, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.rect(PAGE.ml, y, PAGE.contentW, 32, 'S');

  if (edImg) {
    try {
      doc.addImage(edImg, 'JPEG', PAGE.ml + 4, y + 4, 22, 22);
    } catch { /* skip */ }
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('Ed Bruehl', PAGE.ml + 30, y + 10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('Managing Director · Christie\'s International Real Estate Group', PAGE.ml + 30, y + 16);
  doc.text('26 Park Place, East Hampton, NY 11937', PAGE.ml + 30, y + 21);
  doc.text('646-752-1233 · christiesrealestategroup.com', PAGE.ml + 30, y + 26);

  drawFooter(doc, 5, 5);

  const filename = targetHamlet
    ? `Christies_EH_Market_Report_${targetHamlet.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : 'Christies_EH_Market_Report_South_Fork.pdf';
  downloadPdf(doc, filename);
}
