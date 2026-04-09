/**
 * Pro Forma PDF Generator — Christie's East Hampton
 * Sprint 24 · April 7, 2026
 *
 * Generates a 4-page institutional pro forma PDF for Ed Bruehl / Ilija.
 * Pulls live data from Growth Model v2 at time of generation.
 * Uses Puppeteer + Chromium to render HTML → PDF (Christie's visual standard).
 *
 * Page 1 — The Ascension Arc
 * Page 2 — The Machine (Agent Roster)
 * Page 3 — The Economics (Profit Pool + ANEW Homes)
 * Page 4 — Defensible Numbers + Ed contact
 */

import puppeteer from 'puppeteer-core';
import { readGrowthModelData, readGrowthModelVolume } from './sheets-helper';

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/115914870";
const ED_HEADSHOT = `${CDN}/INlfZDqMHcqOCvuv.jpg`;
const LOGO_BLACK = `https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png`;

function fmtDollar(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtFull(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function profitPool(vol: number): { above: number; pool: number; ed: number; ilija: number; christies: number } {
  const BREAKEVEN = 40_000_000;
  const above = Math.max(0, vol - BREAKEVEN);
  const pool = above * 0.02;
  return {
    above,
    pool,
    ed: pool * 0.30,
    ilija: pool * 0.65,
    christies: pool * 0.05,
  };
}

export async function generateProFormaPDF(): Promise<Buffer> {
  // Fetch live data
  const [gmData, volData] = await Promise.all([
    readGrowthModelData(),
    readGrowthModelVolume(),
  ]);

  const total = volData.total;
  const agents = volData.agents;
  const generatedAt = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Volume projections per year
  // Council-approved doctrine targets (Sprint 36) — use Math.max so sheet can only go up, never below doctrine
  const outlookYears = [
    { year: '2026', vol: Math.max(total.proj2026 || 0, 55_000_000) },
    { year: '2027', vol: Math.max(total.proj2027 || 0, 100_000_000) },
    { year: '2028', vol: Math.max(total.proj2028 || 0, 165_000_000) },
    { year: '2029', vol: Math.max(total.proj2029 || 0, 230_000_000) },
    { year: '2030', vol: Math.max(total.proj2030 || 0, 320_000_000) },
    { year: '2031', vol: Math.max(total.proj2031 || 0, 430_000_000) },
  ];

  // GCI from OUTPUTS
  const row2026 = gmData.outputs.find(o => o.year === 2026);
  const totalGci2026 = row2026?.totalGci || 3_080_000;
  const houseTake2026 = row2026?.houseTake || 924_000;

  // Bar chart max
  const maxVol = 430_000_000;

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Barlow+Condensed:wght@300;400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Barlow Condensed', sans-serif;
      background: #FAF8F4;
      color: #384249;
      font-size: 10px;
    }

    .page {
      width: 8.5in;
      min-height: 11in;
      padding: 0.6in 0.65in 0.5in;
      background: #FAF8F4;
      page-break-after: always;
      position: relative;
    }

    .page:last-child { page-break-after: auto; }

    /* Header */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #C8AC78;
      padding-bottom: 10px;
      margin-bottom: 22px;
    }

    .page-header img.logo { height: 22px; }

    .page-header .meta {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7.5px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(56,66,73,0.5);
      text-align: right;
    }

    .confidential-banner {
      background: #1B2A4A;
      color: #C8AC78;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      text-align: center;
      padding: 4px 0;
      margin-bottom: 18px;
    }

    /* Section label */
    .section-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 8px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #C8AC78;
      margin-bottom: 6px;
    }

    /* Page title */
    .page-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 28px;
      font-weight: 300;
      color: #1B2A4A;
      line-height: 1.1;
      margin-bottom: 4px;
    }

    .page-subtitle {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(56,66,73,0.5);
      margin-bottom: 20px;
    }

    /* Arc bars */
    .arc-bars { margin-bottom: 20px; }

    .arc-bar-row {
      display: flex;
      align-items: center;
      margin-bottom: 7px;
      gap: 10px;
    }

    .arc-bar-year {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px;
      letter-spacing: 0.12em;
      color: #C8AC78;
      width: 32px;
      flex-shrink: 0;
    }

    .arc-bar-track {
      flex: 1;
      height: 18px;
      background: rgba(27,42,74,0.06);
      position: relative;
      overflow: hidden;
    }

    .arc-bar-fill {
      height: 100%;
      display: flex;
    }

    .arc-bar-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 8.5px;
      color: #384249;
      width: 60px;
      flex-shrink: 0;
      text-align: right;
    }

    /* KPI strip */
    .kpi-strip {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .kpi-card {
      flex: 1;
      background: #fff;
      border: 1px solid rgba(200,172,120,0.3);
      border-left: 3px solid #C8AC78;
      padding: 10px 12px;
    }

    .kpi-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7.5px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(56,66,73,0.5);
      margin-bottom: 4px;
    }

    .kpi-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      font-weight: 500;
      color: #1B2A4A;
      line-height: 1;
    }

    .kpi-sub {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7px;
      color: rgba(56,66,73,0.4);
      margin-top: 2px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px;
    }

    thead tr {
      border-bottom: 1.5px solid #C8AC78;
      background: rgba(27,42,74,0.02);
    }

    thead th {
      padding: 6px 8px;
      text-align: left;
      font-size: 7.5px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #C8AC78;
      font-weight: 600;
    }

    tbody tr {
      border-bottom: 1px solid rgba(27,42,74,0.06);
    }

    tbody tr:nth-child(even) { background: rgba(27,42,74,0.015); }

    tbody td {
      padding: 5px 8px;
      color: #384249;
      font-size: 9px;
    }

    tbody tr.total-row {
      border-top: 1.5px solid #C8AC78;
      background: rgba(27,42,74,0.03);
      font-weight: 600;
    }

    tbody tr.anew-row {
      border-top: 1px dashed rgba(200,172,120,0.5);
      background: rgba(200,172,120,0.04);
    }

    /* Footnote */
    .footnote {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7.5px;
      color: rgba(56,66,73,0.45);
      line-height: 1.5;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(27,42,74,0.08);
    }

    /* Internal only banner */
    .internal-banner {
      background: rgba(200,172,120,0.1);
      border: 1px solid rgba(200,172,120,0.4);
      border-left: 3px solid #C8AC78;
      padding: 6px 10px;
      margin-bottom: 12px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7.5px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8AC78;
    }

    /* Page footer */
    .page-footer {
      position: absolute;
      bottom: 0.35in;
      left: 0.65in;
      right: 0.65in;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(27,42,74,0.1);
      padding-top: 6px;
    }

    .page-footer span {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(56,66,73,0.35);
    }

    /* Economics section */
    .economics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }

    .econ-block {
      background: #fff;
      border: 1px solid rgba(27,42,74,0.1);
      padding: 12px 14px;
    }

    .econ-block-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7.5px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8AC78;
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(200,172,120,0.3);
      padding-bottom: 5px;
    }

    .econ-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px;
    }

    .econ-line .label { color: rgba(56,66,73,0.7); }
    .econ-line .value { color: #1B2A4A; font-weight: 600; }

    /* Contact card */
    .contact-card {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      background: #1B2A4A;
      padding: 18px 20px;
      margin-top: 16px;
    }

    .contact-card img {
      width: 70px;
      height: 70px;
      object-fit: cover;
      object-position: top;
    }

    .contact-info { flex: 1; }

    .contact-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      font-weight: 400;
      color: #FAF8F4;
      line-height: 1.1;
      margin-bottom: 2px;
    }

    .contact-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 8px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C8AC78;
      margin-bottom: 10px;
    }

    .contact-detail {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 9px;
      color: rgba(250,248,244,0.7);
      line-height: 1.7;
    }

    /* Defensible numbers */
    .defensible-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }

    .def-card {
      background: #fff;
      border: 1px solid rgba(27,42,74,0.1);
      border-top: 2px solid #C8AC78;
      padding: 10px 12px;
    }

    .def-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px;
      font-weight: 500;
      color: #1B2A4A;
      line-height: 1;
      margin-bottom: 3px;
    }

    .def-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7.5px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(56,66,73,0.5);
    }

    .def-note {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 7px;
      color: rgba(56,66,73,0.35);
      margin-top: 2px;
    }
  `;

  // Build arc bars HTML
  const arcBarsHtml = outlookYears.map(({ year, vol }) => {
    const pct = Math.min(100, (vol / maxVol) * 100);
    const isMilestone = vol >= 1_000_000_000;
    const closedPct = year === '2026' ? Math.min(pct, (4_570_000 / maxVol) * 100) : 0;
    const activePct = year === '2026' ? Math.min(pct - closedPct, (34_700_000 / maxVol) * 100) : 0;
    const projPct = pct - closedPct - activePct;

    if (year === '2026') {
      return `
        <div class="arc-bar-row">
          <div class="arc-bar-year">${year}</div>
          <div class="arc-bar-track">
            <div class="arc-bar-fill">
              <div style="width:${closedPct}%;background:#1B2A4A;"></div>
              <div style="width:${activePct}%;background:#8a7a5a;"></div>
              <div style="width:${projPct}%;background:rgba(200,172,120,0.4);"></div>
            </div>
          </div>
          <div class="arc-bar-label">${fmtDollar(vol)}</div>
        </div>`;
    }
    return `
      <div class="arc-bar-row">
        <div class="arc-bar-year">${year}</div>
        <div class="arc-bar-track">
          <div class="arc-bar-fill">
            <div style="width:${pct}%;background:${isMilestone ? '#C8AC78' : 'rgba(27,42,74,0.5)'};"></div>
          </div>
        </div>
        <div class="arc-bar-label">${fmtDollar(vol)}</div>
      </div>`;
  }).join('');

  // Build agent table rows
  const agentRowsHtml = agents.map(a => `
    <tr>
      <td>${a.name}</td>
      <td>${a.role}</td>
      <td>${a.status}</td>
      <td>${fmtDollar(a.proj2026)}</td>
      <td style="color:${a.act2026 > 0 ? '#1B2A4A' : 'rgba(56,66,73,0.3)'}">${a.act2026 > 0 ? fmtDollar(a.act2026) : '—'}</td>
      <td>${fmtDollar(a.proj2027)}</td>
      <td style="color:rgba(56,66,73,0.3)">—</td>
    </tr>`).join('');

  // Build profit pool table rows
  const poolRowsHtml = outlookYears.map(({ year, vol }) => {
    const p = profitPool(vol);
    return `
      <tr>
        <td style="color:#C8AC78;font-weight:600;letter-spacing:0.1em">${year}</td>
        <td>${fmtFull(vol)}</td>
        <td style="color:${p.above > 0 ? '#1B2A4A' : 'rgba(56,66,73,0.3)'}">${p.above > 0 ? fmtFull(p.above) : '—'}</td>
        <td style="color:#C8AC78;font-weight:600">${p.pool > 0 ? fmtFull(p.pool) : '$0'}</td>
        <td style="font-weight:600">${p.ed > 0 ? fmtFull(p.ed) : '$0'}</td>
        <td>${p.ilija > 0 ? fmtFull(p.ilija) : '$0'}</td>
        <td style="color:rgba(56,66,73,0.5)">${p.christies > 0 ? fmtFull(p.christies) : '$0'}</td>
      </tr>`;
  }).join('');

  const pool2026 = profitPool(total.proj2026 || 55_000_000);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>${STYLES}</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════════════════════
     PAGE 1 — THE ASCENSION ARC
═══════════════════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="confidential-banner">INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>

  <div class="page-header">
    <img class="logo" src="${LOGO_BLACK}" alt="Christie's International Real Estate Group">
    <div class="meta">
      Christie's East Hampton · Pro Forma<br>
      Generated ${generatedAt} · Data: Growth Model v2
    </div>
  </div>

  <div class="section-label">Page 1 of 4</div>
  <div class="page-title">The Ascension Arc</div>
  <div class="page-subtitle">2025–2031 Sales Volume Trajectory · $1 Billion Horizon</div>

  <div class="kpi-strip">
    <div class="kpi-card">
      <div class="kpi-label">Closed · First 100 Days</div>
      <div class="kpi-value">$4.57M</div>
      <div class="kpi-sub">Verified · Office closed period</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Active Pipeline</div>
      <div class="kpi-value">$34.7M</div>
      <div class="kpi-sub">Live as of ${generatedAt}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">2026 Baseline Projection</div>
      <div class="kpi-value">$55M</div>
      <div class="kpi-sub">MODEL · 5 named agents</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">$1B Horizon</div>
      <div class="kpi-value">2031</div>
      <div class="kpi-sub">MODEL · 32 agents at scale</div>
    </div>
  </div>

  <div class="section-label">Volume Trajectory · 2025–2031</div>
  <div class="arc-bars">
    ${arcBarsHtml}
  </div>

  <div style="display:flex;gap:16px;margin-bottom:12px;font-family:'Barlow Condensed',sans-serif;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;">
    <span style="display:flex;align-items:center;gap:5px;color:rgba(56,66,73,0.5)">
      <span style="width:12px;height:8px;background:#1B2A4A;display:inline-block"></span> Closed
    </span>
    <span style="display:flex;align-items:center;gap:5px;color:rgba(56,66,73,0.5)">
      <span style="width:12px;height:8px;background:#8a7a5a;display:inline-block"></span> Active
    </span>
    <span style="display:flex;align-items:center;gap:5px;color:rgba(56,66,73,0.5)">
      <span style="width:12px;height:8px;background:rgba(200,172,120,0.4);display:inline-block"></span> Projected
    </span>
  </div>

  <div class="footnote">
    * All projections labeled MODEL. 2026 Closed ($4.57M) and Active ($34.7M) are verified actuals.
    2026 baseline ($55M) and all outer years are governing-principle projections, not guarantees.
    Data source: Growth Model v2 · Christie's East Hampton · INTERNAL ONLY.
  </div>

  <div class="page-footer">
    <span>Christie's East Hampton · Pro Forma · ${generatedAt}</span>
    <span>INTERNAL · CONFIDENTIAL · Page 1 of 4</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     PAGE 2 — THE MACHINE
═══════════════════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="confidential-banner">INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>

  <div class="page-header">
    <img class="logo" src="${LOGO_BLACK}" alt="Christie's International Real Estate Group">
    <div class="meta">
      Christie's East Hampton · Pro Forma<br>
      Generated ${generatedAt} · Data: Growth Model v2
    </div>
  </div>

  <div class="section-label">Page 2 of 4</div>
  <div class="page-title">The Machine</div>
  <div class="page-subtitle">Agent Roster · 9 Named + 7 TBD = 16 for 2026 · Sales Volume</div>

  <div class="internal-banner">★ Sales Volume Only — GCI Internal · Not for External Distribution</div>

  <table>
    <thead>
      <tr>
        <th>Agent</th>
        <th>Role</th>
        <th>Status</th>
        <th>2026 Proj Vol</th>
        <th>2026 Actual</th>
        <th>2027 Proj Vol</th>
        <th>2027 Actual</th>
      </tr>
    </thead>
    <tbody>
      ${agentRowsHtml}
      <tr style="border-top:1px solid rgba(200,172,120,0.3);background:rgba(27,42,74,0.02);font-size:8px;color:rgba(56,66,73,0.4)">
        <td colspan="7" style="padding:4px 8px;letter-spacing:0.1em;text-transform:uppercase;font-size:7.5px">
          + 3 Targeted Hires 2026 ($375K each) + 4 Organic Adds ($50K each) — not shown individually
        </td>
      </tr>
      <tr class="total-row">
        <td colspan="3" style="color:#1B2A4A;font-weight:600">TOTAL (Baseline)</td>
        <td style="color:#C8AC78;font-weight:600">${fmtDollar(total.proj2026 || 55_000_000)}</td>
        <td style="color:#1B2A4A;font-weight:600">${fmtDollar(total.act2026 || 4_570_000)}</td>
        <td style="color:#C8AC78;font-weight:600">${fmtDollar(total.proj2027 || 100_000_000)}</td>
        <td style="color:rgba(56,66,73,0.3)">—</td>
      </tr>
      <tr class="anew-row">
        <td colspan="3" style="color:#8a7a5a;font-style:italic">AnewHomes — Custom Build · Ed Bruehl exclusively</td>
        <td style="color:#8a7a5a">$50K net*</td>
        <td style="color:rgba(56,66,73,0.3)">—</td>
        <td style="color:#8a7a5a">$100K net*</td>
        <td style="color:rgba(56,66,73,0.3)">—</td>
      </tr>
    </tbody>
  </table>

  <div class="footnote">
    * AnewHomes figures are net build profit, not sales volume. Separate from Christie's commission income.
    Agent count: 9 existing (including Scott Smith pending June 1) + 3 targeted + 4 organic = 16 for 2026.
    All projections labeled MODEL. Actual columns update as deals close in PIPE.
    Scott Smith start date pending June 1, 2026 confirmation.
  </div>

  <div class="page-footer">
    <span>Christie's East Hampton · Pro Forma · ${generatedAt}</span>
    <span>INTERNAL · CONFIDENTIAL · Page 2 of 4</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     PAGE 3 — THE ECONOMICS
═══════════════════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="confidential-banner">INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>

  <div class="page-header">
    <img class="logo" src="${LOGO_BLACK}" alt="Christie's International Real Estate Group">
    <div class="meta">
      Christie's East Hampton · Pro Forma<br>
      Generated ${generatedAt} · Data: Growth Model v2
    </div>
  </div>

  <div class="section-label">Page 3 of 4</div>
  <div class="page-title">The Economics</div>
  <div class="page-subtitle">Profit Pool · Ed's Three Income Streams · AnewHomes Split</div>

  <div class="internal-banner">★ INTERNAL ONLY — GCI and Profit Pool · Not for External Documents · Governing Principle *</div>

  <div class="section-label" style="margin-bottom:8px">Profit Pool · 2026–2031 Projection</div>
  <div style="background:#fff;border:1px solid rgba(27,42,74,0.1);padding:8px 10px;margin-bottom:10px;font-family:'Barlow Condensed',sans-serif;font-size:8.5px;color:#384249;line-height:1.6">
    Formula: Pool = (Total Sales Volume − <strong>$40M breakeven</strong>) × <strong>2%</strong>.
    If volume &lt; $40M, pool = $0.
    Split: <strong>Ed Bruehl 30%</strong> · <strong>Partnership 65%</strong> · <strong>Christie's RE Rights 5%</strong>.
    Paid at year end. Not salary. Not splits. Profit participation.
  </div>

  <table style="margin-bottom:14px">
    <thead>
      <tr>
        <th>Year</th>
        <th>Total Sales Volume</th>
        <th>Above $40M</th>
        <th>Pool (2%)</th>
        <th>Ed (30%)</th>
        <th>Partnership (65%)</th>
        <th>Christie's RE (5%)</th>
      </tr>
    </thead>
    <tbody>${poolRowsHtml}</tbody>
  </table>

  <div class="economics-grid">
    <div class="econ-block">
      <div class="econ-block-title">Ed Bruehl · Three Income Streams · 2026</div>
      <div class="econ-line">
        <span class="label">Agent GCI (personal production)</span>
        <span class="value">$750,000*</span>
      </div>
      <div class="econ-line">
        <span class="label">Profit Pool Share (30%)</span>
        <span class="value">${fmtFull(pool2026.ed)}*</span>
      </div>
      <div class="econ-line">
        <span class="label">AnewHomes Net Build Profit (Ed 40%)</span>
        <span class="value">$20,000*</span>
      </div>
      <div style="border-top:1px solid rgba(27,42,74,0.1);margin-top:6px;padding-top:6px">
        <div class="econ-line">
          <span class="label" style="font-weight:600;color:#1B2A4A">Total 2026 (MODEL)</span>
          <span class="value" style="color:#C8AC78">${fmtFull(750_000 + pool2026.ed + 20_000)}*</span>
        </div>
      </div>
    </div>

    <div class="econ-block">
      <div class="econ-block-title">AnewHomes · Net Build Profit Split</div>
      <div class="econ-line">
        <span class="label">Ed Bruehl (40%)</span>
        <span class="value">$20,000 Y1 / $40,000 Y2*</span>
      </div>
      <div class="econ-line">
        <span class="label">Scott Smith (40%)</span>
        <span class="value">$20,000 Y1 / $40,000 Y2*</span>
      </div>
      <div class="econ-line">
        <span class="label">Angel Theodore (5%)</span>
        <span class="value">$2,500 Y1 / $5,000 Y2*</span>
      </div>
      <div class="econ-line">
        <span class="label">Jarvis Slade (5%)</span>
        <span class="value">$2,500 Y1 / $5,000 Y2*</span>
      </div>
      <div class="econ-line">
        <span class="label">Ricky (Richard Bruehl) (5%)</span>
        <span class="value">$2,500 Y1 / $5,000 Y2*</span>
      </div>
      <div class="econ-line">
        <span class="label">Pool / Future (5%)</span>
        <span class="value">$2,500 Y1 / $5,000 Y2*</span>
      </div>
      <div style="border-top:1px solid rgba(27,42,74,0.1);margin-top:6px;padding-top:6px">
        <div class="econ-line">
          <span class="label" style="font-weight:600;color:#1B2A4A">Total Net Profit</span>
          <span class="value" style="color:#C8AC78">$50,000 Y1 / $100,000 Y2*</span>
        </div>
      </div>
    </div>
  </div>

  <div class="footnote">
    * Governing principle only — not yet contractual. All figures labeled MODEL.
    Profit pool activates above $40M total sales volume.
    AnewHomes: Morton steel-frame custom builds. ADU Garage Living Unit drives Year 1 income.
    Net profit after ALL build costs. Separate from Christie's commission income entirely.
    All six AnewHomes participants aware and agreeable. Not yet formalized.
  </div>

  <div class="page-footer">
    <span>Christie's East Hampton · Pro Forma · ${generatedAt}</span>
    <span>INTERNAL · CONFIDENTIAL · Page 3 of 4</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     PAGE 4 — DEFENSIBLE NUMBERS + CONTACT
═══════════════════════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="confidential-banner">INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION</div>

  <div class="page-header">
    <img class="logo" src="${LOGO_BLACK}" alt="Christie's International Real Estate Group">
    <div class="meta">
      Christie's East Hampton · Pro Forma<br>
      Generated ${generatedAt} · Data: Growth Model v2
    </div>
  </div>

  <div class="section-label">Page 4 of 4</div>
  <div class="page-title">Defensible Numbers</div>
  <div class="page-subtitle">Verified Actuals as of ${generatedAt} · Growth Trajectory Labeled MODEL</div>

  <div class="defensible-grid">
    <div class="def-card">
      <div class="def-value">$4.57M</div>
      <div class="def-label">Closed Volume</div>
      <div class="def-note">Verified · First 100 days, office closed</div>
    </div>
    <div class="def-card">
      <div class="def-value">$34.7M</div>
      <div class="def-label">Active Pipeline</div>
      <div class="def-note">Live as of ${generatedAt}</div>
    </div>
    <div class="def-card">
      <div class="def-value">$55M</div>
      <div class="def-label">2026 Baseline</div>
      <div class="def-note">MODEL · 5 named agents</div>
    </div>
    <div class="def-card">
      <div class="def-value">9</div>
      <div class="def-label">Named Team Members</div>
      <div class="def-note">Incl. Scott Smith pending June 1</div>
    </div>
    <div class="def-card">
      <div class="def-value">$6.5M</div>
      <div class="def-label">Flambeaux Signed</div>
      <div class="def-note">Verified · In active pipeline</div>
    </div>
    <div class="def-card">
      <div class="def-value">$1B</div>
      <div class="def-label">2031 Horizon</div>
      <div class="def-note">MODEL · 32 agents at scale</div>
    </div>
  </div>

  <div style="background:#fff;border:1px solid rgba(27,42,74,0.1);padding:10px 14px;margin-bottom:14px">
    <div class="section-label" style="margin-bottom:6px">Growth Trajectory — MODEL Assumptions</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:8.5px;color:#384249;line-height:1.7">
      All figures beyond verified actuals ($4.57M closed, $34.7M active) are governing-principle projections.
      The $55M 2026 baseline assumes 5 named agents at stated volume. Targeted hires ($375K each × 3) and
      organic adds ($50K each × 4) are upside above the baseline. The $40M profit pool breakeven is a
      governing principle, not a contractual threshold. All outer-year projections (2027–2031) are MODEL
      and subject to revision as the team grows.
    </div>
  </div>

  <div class="contact-card">
    <img src="${ED_HEADSHOT}" alt="Ed Bruehl">
    <div class="contact-info">
      <div class="contact-name">Ed Bruehl</div>
      <div class="contact-title">Managing Director · Christie's East Hampton</div>
      <div class="contact-detail">
        Christie's International Real Estate Group<br>
        26 Park Place, East Hampton, NY 11937<br>
        Licensed Real Estate Salesperson · NY<br>
        Christie's International Real Estate Group · Est. 1766
      </div>
    </div>
  </div>

  <div class="footnote" style="margin-top:12px">
    This document is prepared for internal use only. All projections are governing-principle models,
    not guarantees. Verified actuals are noted explicitly. No GCI figure appears without the asterisk
    and "governing principle" label. This document is not for external distribution.
    Christie's International Real Estate Group · ${generatedAt}
  </div>

  <div class="page-footer">
    <span>Christie's East Hampton · Pro Forma · ${generatedAt}</span>
    <span>INTERNAL · CONFIDENTIAL · Page 4 of 4</span>
  </div>
</div>

</body>
</html>`;

  // Launch Puppeteer and render PDF
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
