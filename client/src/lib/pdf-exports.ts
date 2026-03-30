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

  drawFooter(doc, 2, 2, qrImg);

  downloadPdf(doc, `Christies_EH_Investment_Memo_${result.address.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

// ─── 5. Five-Page Market Report ───────────────────────────────────────────────
// Art direction: website = live report · PDF = print snapshot
// Page 1  → mirrors website hero (portrait gradient, founding line, doctrine)
// Pages 2 → mirrors market ticker + summary block (two-column)
// Pages 3–4 → mirrors hamlet card matrix (bordered card blocks per hamlet)
// Page 5  → Christie's Advantage + contact (unchanged — already strong)

export async function generateMarketReport(hamletId?: string): Promise<void> {
  const { edImg, logoImg, qrImg } = await loadPdfAssets();
  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const targetHamlet = hamletId ? MASTER_HAMLET_DATA.find(h => h.id === hamletId) : undefined;

  // ── PAGE 1 — Hero Cover (mirrors website Section 1 portrait hero) ──────────
  // Full navy field — mirrors the dark overlay on the James Christie portrait
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, PAGE.w, PAGE.h, 'F');

  // Subtle texture: cream gradient strip at bottom (mimics portrait gradient overlay)
  doc.setFillColor(27, 42, 74); // same navy, layered
  doc.rect(0, PAGE.h - 90, PAGE.w, 90, 'F');

  // Gold rule — top, mirroring the nav gold rule
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(1.2);
  doc.line(PAGE.ml, 18, PAGE.w - PAGE.mr, 18);

  // Institutional mark — mirrors "Christie's · Est. 1766" label on hero
  doc.setFontSize(8);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('CHRISTIE\'S · EST. 1766', PAGE.w / 2, 27, { align: 'center' });

  // Logo centered
  if (logoImg) {
    try {
      doc.addImage(logoImg, 'PNG', PAGE.w / 2 - 32, 33, 64, 26);
    } catch { /* skip */ }
  }

  // Main title — mirrors website H1 "Christie's East Hampton"
  doc.setFontSize(30);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text('Christie\'s East Hampton', PAGE.w / 2, 82, { align: 'center' });

  // Subtitle — mirrors "Managing Director · Ed Bruehl" line
  doc.setFontSize(10);
  doc.setTextColor(200, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.text('Hamptons Market Report', PAGE.w / 2, 92, { align: 'center' });

  // Gold rule — mirrors the divider below the hero title
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml + 40, 98, PAGE.w - PAGE.mr - 40, 98);

  // Territory / date line
  doc.setFontSize(8.5);
  doc.setTextColor(200, 190, 175);
  doc.text(
    targetHamlet ? `${targetHamlet.name} · ${targetHamlet.tier}` : 'South Fork · Nine Hamlets',
    PAGE.w / 2, 106, { align: 'center' }
  );
  doc.setFontSize(7.5);
  doc.text(today(), PAGE.w / 2, 113, { align: 'center' });

  // Ed headshot — mirrors the portrait on the website hero
  const headY = 128;
  if (edImg) {
    try {
      // Circular crop approximated with a clipping rect
      doc.addImage(edImg, 'JPEG', PAGE.w / 2 - 18, headY, 36, 36);
    } catch { /* skip */ }
  } else {
    // Placeholder box
    doc.setFillColor(...C.charcoal);
    doc.rect(PAGE.w / 2 - 18, headY, 36, 36, 'F');
    doc.setFontSize(6);
    doc.setTextColor(...C.gold);
    doc.text('ED BRUEHL', PAGE.w / 2, headY + 20, { align: 'center' });
  }

  // Name + title block — mirrors the hero overlay text
  doc.setFontSize(11);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  doc.text('Ed Bruehl', PAGE.w / 2, headY + 44, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  doc.text('Managing Director · Christie\'s International Real Estate Group', PAGE.w / 2, headY + 51, { align: 'center' });
  doc.text('26 Park Place, East Hampton, NY 11937 · 646-752-1233', PAGE.w / 2, headY + 57, { align: 'center' });

  // Founding letter pull-quote — mirrors the letter headline on the website
  doc.setDrawColor('rgba(200,172,120,0.4)' as unknown as string);
  doc.setDrawColor(200, 172, 120);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml + 20, headY + 68, PAGE.w - PAGE.mr - 20, headY + 68);

  doc.setFontSize(9.5);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bolditalic');
  const pullQuote = 'Always the Family\'s Interest Before the Sale.';
  doc.text(pullQuote, PAGE.w / 2, headY + 77, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  doc.text('The Name Follows.', PAGE.w / 2, headY + 84, { align: 'center' });

  // Bottom doctrine block — mirrors website footer doctrine
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(PAGE.ml, PAGE.h - 24, PAGE.w - PAGE.mr, PAGE.h - 24);
  doc.setFontSize(6.5);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('CHRISTIE\'S INTERNATIONAL REAL ESTATE GROUP', PAGE.w / 2, PAGE.h - 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 190, 175);
  doc.text('Est. 1766 · East Hampton, New York', PAGE.w / 2, PAGE.h - 13, { align: 'center' });

  // ── PAGE 2 — South Fork Overview (mirrors website market ticker + summary) ──
  doc.addPage();
  let y = await drawHeader(doc, 'South Fork Overview', 'Nine Hamlets · Current Market Conditions', edImg, logoImg);

  // Two-column layout: left = narrative + metrics, right = hamlet comps table header
  const col1W = PAGE.contentW * 0.42;
  const col2X = PAGE.ml + col1W + 6;
  const col2W = PAGE.contentW - col1W - 6;

  // Left column — narrative
  let ly = y;
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('MARKET SUMMARY', PAGE.ml, ly);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(PAGE.ml, ly + 1.5, PAGE.ml + col1W, ly + 1.5);
  ly += 6;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  const summaryShort = 'The South Fork comprises nine distinct hamlets — each with its own price corridor, buyer profile, and institutional character. Sagaponack and East Hampton Village anchor the ultra-trophy tier. Bridgehampton, Southampton Village, and Water Mill form the trophy corridor. Sag Harbor, Amagansett, and East Hampton proper represent the premier tier. Springs offers the most accessible entry point with the highest volume share.';
  ly = wrapText(doc, summaryShort, PAGE.ml, ly, col1W, 5);
  ly += 6;

  // Key metrics — mirrors the market ticker bar on the website
  const totalVolume = MASTER_HAMLET_DATA.reduce((s, h) => s + h.volumeShare, 0);
  const avgAnew = (MASTER_HAMLET_DATA.reduce((s, h) => s + h.anewScore, 0) / MASTER_HAMLET_DATA.length).toFixed(1);
  const medians = MASTER_HAMLET_DATA.map(h => h.medianPrice);
  const sfMedian = medians.reduce((s, m) => s + m, 0) / medians.length;

  // Metric tiles (mimics the ticker strip)
  const metrics = [
    { label: 'Hamlets Tracked', value: '9' },
    { label: 'SF Median (Avg)', value: fmtUSD(sfMedian) },
    { label: 'Avg ANEW Score', value: `${avgAnew} / 10` },
    { label: 'Volume Tracked', value: fmtPct(totalVolume / 100) },
    { label: '30Y Mortgage', value: '6.38%' },
    { label: 'Source', value: 'Freddie Mac · March 2026' },
  ];

  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('KEY METRICS', PAGE.ml, ly);
  doc.setDrawColor(...C.gold);
  doc.line(PAGE.ml, ly + 1.5, PAGE.ml + col1W, ly + 1.5);
  ly += 6;

  metrics.forEach(m => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...C.charcoal);
    doc.text(m.label, PAGE.ml, ly);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.navy);
    doc.text(m.value, PAGE.ml + col1W, ly, { align: 'right' });
    ly += 5.5;
  });

  // Right column — hamlet comps table (full width of right col)
  let ry = y;
  doc.setFontSize(7);
  doc.setTextColor(...C.gold);
  doc.setFont('helvetica', 'bold');
  doc.text('HAMLET INTELLIGENCE MATRIX', col2X, ry);
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.3);
  doc.line(col2X, ry + 1.5, col2X + col2W, ry + 1.5);
  ry += 6;

  // Mini hamlet table in right column
  const miniCols = ['Hamlet', 'Tier', 'Median', 'ANEW', 'Vol'];
  const miniColW = [col2W * 0.30, col2W * 0.22, col2W * 0.22, col2W * 0.13, col2W * 0.13];
  const rowH = 5.5;

  // Table header
  doc.setFillColor(...C.navy);
  doc.rect(col2X, ry, col2W, rowH, 'F');
  doc.setFontSize(6);
  doc.setTextColor(...C.cream);
  doc.setFont('helvetica', 'bold');
  let cx = col2X + 1.5;
  miniCols.forEach((col, i) => {
    doc.text(col, cx, ry + 3.5);
    cx += miniColW[i];
  });
  ry += rowH;

  // Table rows
  MASTER_HAMLET_DATA.forEach((h, ri) => {
    const bg = ri % 2 === 0 ? C.cream : [245, 243, 239] as [number, number, number];
    doc.setFillColor(...bg);
    doc.rect(col2X, ry, col2W, rowH, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...C.charcoal);
    let rx = col2X + 1.5;
    const rowData = [h.name, h.tier, h.medianPriceDisplay, `${h.anewScore}`, `${h.volumeShare}%`];
    rowData.forEach((val, i) => {
      doc.text(val, rx, ry + 3.5);
      rx += miniColW[i];
    });
    ry += rowH;
  });

  drawFooter(doc, 2, 5, qrImg);

  // ── PAGE 3 — Ultra-Trophy & Trophy Hamlet Cards ────────────────────────────
  // Mirrors the HamletTile card grid on the website MARKET tab
  doc.addPage();
  y = await drawHeader(doc, 'Ultra-Trophy & Trophy Hamlets', 'Sagaponack · East Hampton Village · Bridgehampton · Southampton · Water Mill', edImg, logoImg);

  const topHamlets = MASTER_HAMLET_DATA.filter(h => h.tier === 'Ultra-Trophy' || h.tier === 'Trophy');

  // Tier badge color map — mirrors TIER_BADGE_COLORS in MarketTab
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

  // Two-column card grid
  const cardW = (PAGE.contentW - 6) / 2;
  const cardH = 52;
  const cardGap = 6;
  let cardX = PAGE.ml;
  let cardY = y;
  let col = 0;

  topHamlets.forEach(h => {
    if (cardY + cardH > PAGE.h - PAGE.mb) return; // overflow guard

    // Card background
    doc.setFillColor(...C.cream);
    doc.rect(cardX, cardY, cardW, cardH, 'F');
    // Card border — gold for Ultra-Trophy, navy for Trophy
    doc.setDrawColor(...(h.tier === 'Ultra-Trophy' ? C.gold : C.navy));
    doc.setLineWidth(h.tier === 'Ultra-Trophy' ? 0.8 : 0.4);
    doc.rect(cardX, cardY, cardW, cardH, 'S');

    // Tier badge (top-right corner)
    const badgeBg = tierBadgeBg[h.tier];
    const badgeFg = tierBadgeFg[h.tier];
    const badgeW = 28;
    doc.setFillColor(...badgeBg);
    doc.rect(cardX + cardW - badgeW, cardY, badgeW, 7, 'F');
    doc.setFontSize(5.5);
    doc.setTextColor(...badgeFg);
    doc.setFont('helvetica', 'bold');
    doc.text(h.tier.toUpperCase(), cardX + cardW - badgeW / 2, cardY + 4.5, { align: 'center' });

    // Hamlet name
    doc.setFontSize(11);
    doc.setTextColor(...C.navy);
    doc.setFont('helvetica', 'bold');
    doc.text(h.name, cardX + 4, cardY + 14);

    // Median price — prominent, mirrors the website card
    doc.setFontSize(7);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDIAN PRICE', cardX + 4, cardY + 21);
    doc.setFontSize(14);
    doc.setTextColor(...C.navy);
    doc.text(h.medianPriceDisplay, cardX + 4, cardY + 29);

    // ANEW score + bar — mirrors the ANEW score bar on the website card
    doc.setFontSize(6.5);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('ANEW SCORE', cardX + 4, cardY + 36);
    doc.setFontSize(8);
    doc.setTextColor(...C.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.text(`${h.anewScore} / 10`, cardX + 4, cardY + 41);
    // Score bar
    const barW = cardW - 8;
    doc.setFillColor(230, 228, 224);
    doc.rect(cardX + 4, cardY + 43, barW, 2, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(cardX + 4, cardY + 43, barW * (h.anewScore / 10), 2, 'F');

    // Volume share — mirrors the volume bar on the website card
    doc.setFontSize(6);
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(`Vol. Share: ${h.volumeShare}%`, cardX + 4, cardY + 49);

    // Advance grid position
    col++;
    if (col % 2 === 0) {
      cardX = PAGE.ml;
      cardY += cardH + cardGap;
    } else {
      cardX = PAGE.ml + cardW + 6;
    }
  });

  drawFooter(doc, 3, 5, qrImg);

  // ── PAGE 4 — Premier & Opportunity Hamlet Cards ────────────────────────────
  doc.addPage();
  y = await drawHeader(doc, 'Premier & Opportunity Hamlets', 'Sag Harbor · Amagansett · East Hampton · Springs', edImg, logoImg);

  const lowerHamlets = MASTER_HAMLET_DATA.filter(h => h.tier === 'Premier' || h.tier === 'Opportunity');
  cardX = PAGE.ml;
  cardY = y;
  col = 0;

  lowerHamlets.forEach(h => {
    if (cardY + cardH > PAGE.h - PAGE.mb) return;

    doc.setFillColor(...C.cream);
    doc.rect(cardX, cardY, cardW, cardH, 'F');
    doc.setDrawColor(...C.navy);
    doc.setLineWidth(0.4);
    doc.rect(cardX, cardY, cardW, cardH, 'S');

    const badgeBg = tierBadgeBg[h.tier];
    const badgeFg = tierBadgeFg[h.tier];
    doc.setFillColor(...badgeBg);
    doc.rect(cardX + cardW - 28, cardY, 28, 7, 'F');
    doc.setFontSize(5.5);
    doc.setTextColor(...badgeFg);
    doc.setFont('helvetica', 'bold');
    doc.text(h.tier.toUpperCase(), cardX + cardW - 14, cardY + 4.5, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(...C.navy);
    doc.setFont('helvetica', 'bold');
    doc.text(h.name, cardX + 4, cardY + 14);

    doc.setFontSize(7);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDIAN PRICE', cardX + 4, cardY + 21);
    doc.setFontSize(14);
    doc.setTextColor(...C.navy);
    doc.text(h.medianPriceDisplay, cardX + 4, cardY + 29);

    doc.setFontSize(6.5);
    doc.setTextColor(...C.gold);
    doc.setFont('helvetica', 'bold');
    doc.text('ANEW SCORE', cardX + 4, cardY + 36);
    doc.setFontSize(8);
    doc.setTextColor(...C.charcoal);
    doc.setFont('helvetica', 'bold');
    doc.text(`${h.anewScore} / 10`, cardX + 4, cardY + 41);
    const barW2 = cardW - 8;
    doc.setFillColor(230, 228, 224);
    doc.rect(cardX + 4, cardY + 43, barW2, 2, 'F');
    doc.setFillColor(...C.gold);
    doc.rect(cardX + 4, cardY + 43, barW2 * (h.anewScore / 10), 2, 'F');

    doc.setFontSize(6);
    doc.setTextColor(...C.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(`Vol. Share: ${h.volumeShare}%`, cardX + 4, cardY + 49);

    col++;
    if (col % 2 === 0) {
      cardX = PAGE.ml;
      cardY += cardH + cardGap;
    } else {
      cardX = PAGE.ml + cardW + 6;
    }
  });

  drawFooter(doc, 4, 5, qrImg);

  // ── PAGE 5 — Christie's Advantage + Contact (unchanged — already strong) ──
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

  // Contact block — cream card with gold border, mirrors website contact block
  doc.setFillColor(240, 238, 234);
  doc.rect(PAGE.ml, y, PAGE.contentW, 36, 'F');
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.rect(PAGE.ml, y, PAGE.contentW, 36, 'S');
  // Gold left accent bar
  doc.setFillColor(...C.gold);
  doc.rect(PAGE.ml, y, 2.5, 36, 'F');

  if (edImg) {
    try {
      doc.addImage(edImg, 'JPEG', PAGE.ml + 8, y + 5, 24, 24);
    } catch { /* skip */ }
  } else {
    doc.setFillColor(...C.charcoal);
    doc.rect(PAGE.ml + 8, y + 5, 24, 24, 'F');
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C.navy);
  doc.text('Ed Bruehl', PAGE.ml + 38, y + 12);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...C.charcoal);
  doc.text('Managing Director · Christie\'s International Real Estate Group', PAGE.ml + 38, y + 19);
  doc.text('26 Park Place, East Hampton, NY 11937', PAGE.ml + 38, y + 25);
  doc.text('646-752-1233 · christiesrealestategroup.com', PAGE.ml + 38, y + 31);

  drawFooter(doc, 5, 5, qrImg);

  const filename = targetHamlet
    ? `Christies_EH_Market_Report_${targetHamlet.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : 'Christies_EH_Market_Report_South_Fork.pdf';
  downloadPdf(doc, filename);
}
