/**
 * FUTURE TAB — Growth Model, Agent Roster, and 300-Day Arc.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 * Data source: Growth Model v2 Google Sheet (manual sync — locked sheet ID)
 */

import { MatrixCard } from '@/components/MatrixCard';
import { useCallback } from 'react';

// ─── 2026 Scorecard ──────────────────────────────────────────────────────────
const SCORECARD_2026 = [
  { value: '52', label: 'Podcasts', sub: 'Weekly cadence · Full year' },
  { value: '12', label: 'Collector Events', sub: 'Monthly · Curated audience' },
  { value: '12', label: 'Agents', sub: 'Target roster · Dec 2026' },
  { value: '12', label: 'Raving Fans', sub: 'Institutional advocates' },
];

// ─── Growth Model v2 Data (synced from sheet) ─────────────────────────────────

const OUTLOOK = [
  { year: 2026, agents: 15, gci: '$3.95M',  gciNum: 3.95,  avgGci: '$263K', milestone: 'Base case — 15 agents, $3.95M GCI · $158M volume · $1.185M house take by December 2026' },
  { year: 2027, agents: 6,  gci: '$1.56M',  gciNum: 1.56,  avgGci: '$260K', milestone: 'First team layer' },
  { year: 2028, agents: 10, gci: '$2.50M',  gciNum: 2.50,  avgGci: '$250K', milestone: 'Operating scale' },
  { year: 2029, agents: 14, gci: '$3.08M',  gciNum: 3.08,  avgGci: '$220K', milestone: 'Regional authority' },
  { year: 2030, agents: 18, gci: '$3.60M',  gciNum: 3.60,  avgGci: '$200K', milestone: 'Institutional presence' },
  { year: 2031, agents: 22, gci: '$4.40M',  gciNum: 4.40,  avgGci: '$200K', milestone: 'Full South Fork coverage' },
];

const ROSTER = [
  { name: 'Ed Bruehl',  role: 'Managing Director', status: 'Active',     tier: 'Founding' },
  { name: 'Seat 2',     role: 'Senior Associate',  status: 'Recruiting', tier: 'Q2 2026' },
  { name: 'Seat 3',     role: 'Associate',          status: 'Recruiting', tier: 'Q2 2026' },
  { name: 'Seat 4',     role: 'Associate',          status: 'Target',     tier: 'Q3 2026' },
  { name: 'Seat 5',     role: 'Associate',          status: 'Target',     tier: 'Q3 2026' },
  { name: 'Seat 6',     role: 'Associate',          status: 'Target',     tier: 'Q4 2026' },
];

const ARC_PHASES = [
  { phase: 'Phase I',   days: '1–90',    label: 'Foundation',    description: 'Establish systems, deploy ANEW calculator, first two agent hires, first three listings.' },
  { phase: 'Phase II',  days: '91–180',  label: 'Activation',    description: 'First closings, INTEL document library live, Paumanok Map deployed, morning brief cadence locked.' },
  { phase: 'Phase III', days: '181–270', label: 'Acceleration',  description: 'Six agents operating, Growth Model v2 on pace, first council brief published, podcast launched.' },
  { phase: 'Phase IV',  days: '271–300', label: 'Consolidation', description: 'Full South Fork market authority established. Annual GCI run rate confirmed. Year 2 plan locked.' },
];

// Ascension milestones — from Christie's Ascension UPDATED deck (April 2026)
// Labels match deck exactly: staged milestones, not calendar years
const ASCENSION_MILESTONES = [
  { id: 1, label: '1ST 100 DAYS',     period: 'Mar–Jun 2026',  volume: '$2.5M',   status: 'BUILT',     agents: '',         detail: 'Ed Bruehl solo · 2 closings · Base case entry · Systems deployed' },
  { id: 2, label: '2ND 100 DAYS',     period: 'Jun–Sep 2026',  volume: '$13.62M', status: 'BUILDING',  agents: '',         detail: 'First agent hires · Podcast + events cadence locked · INTEL library live' },
  { id: 3, label: '3RD 100 DAYS',     period: 'Sep–Dec 2026',  volume: '$20M+',   status: 'LAUNCHING', agents: '',         detail: "Operating scale · South Fork market presence established · Christie's brand deployed" },
  { id: 4, label: 'END OF 2026',      period: 'December 2026', volume: '$143M+',  status: '',          agents: '15 Agents', detail: 'Institutional listing pipeline · 15 agents operating · $158M volume run rate' },
  { id: 5, label: 'FULL YEAR 2027',   period: 'Full Season',   volume: '$280M+',  status: '',          agents: '22 Agents', detail: 'Family office relationships active · UHNW collector network · 22 agents' },
  { id: 6, label: '2028–2031 →',  period: 'EH · Southampton · Westhampton', volume: '$3B', status: '', agents: '', detail: "Full South Fork coverage · Christie's East Hampton as market authority" },
];

const LABEL_FONT: React.CSSProperties = { fontFamily: '"Barlow Condensed", sans-serif' };

// CIREG logo (white version for dark backgrounds)
const CIREG_LOGO = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';
// CIREG logo (black version for light backgrounds)
const CIREG_LOGO_DARK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';

function exportAscensionPDF() {
  const win = window.open('', '_blank');
  if (!win) return;

  const heights = [20, 32, 44, 60, 76, 100];
  const statusColors: Record<string, string> = {
    BUILT: '#2D5A3D',
    BUILDING: '#C8AC78',
    LAUNCHING: '#1B2A4A',
  };

  const barsHTML = ASCENSION_MILESTONES.map((m, i) => {
    const pct = heights[i] ?? 100;
    const barH = Math.round((pct / 100) * 180);
    const isFilled = i === 0;
    const statusBadge = m.status
      ? `<div style="display:inline-block;margin-top:6px;padding:2px 8px;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif;background:${statusColors[m.status] ?? '#1B2A4A'};color:#FAF8F4;border-radius:2px;">${m.status}</div>`
      : m.agents
      ? `<div style="display:inline-block;margin-top:6px;padding:2px 8px;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif;background:rgba(27,42,74,0.12);color:#1B2A4A;border-radius:2px;">${m.agents}</div>`
      : '';
    return `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:220px;">
        <div style="font-family:'Cormorant Garamond',serif;color:${isFilled ? '#C8AC78' : '#1B2A4A'};font-size:${m.volume.length > 5 ? '13px' : '15px'};font-weight:600;line-height:1;margin-bottom:6px;text-align:center;">${m.volume}</div>
        <div style="width:100%;height:${barH}px;background:${isFilled ? 'linear-gradient(to top,#1B2A4A 0%,#2a3f5f 100%)' : 'linear-gradient(to top,rgba(27,42,74,0.12) 0%,rgba(27,42,74,0.22) 100%)'};border-top:3px solid ${isFilled ? '#C8AC78' : 'rgba(200,172,120,0.35)'};position:relative;">
          ${isFilled ? '<div style="position:absolute;top:8px;left:50%;transform:translateX(-50%);font-family:\'Barlow Condensed\',sans-serif;color:#C8AC78;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;">Now</div>' : ''}
        </div>
        <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;margin-top:6px;text-align:center;">${m.label}</div>
        <div style="font-family:'Source Sans 3',sans-serif;color:#7a8a8e;font-size:9px;line-height:1.3;text-align:center;margin-top:2px;">${m.period}</div>
        ${statusBadge}
      </div>`;
  }).join('');

  const arcHTML = ARC_PHASES.map(p => `
    <div style="border:1px solid rgba(27,42,74,0.12);padding:16px;background:#fff;">
      <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:4px;">${p.phase} · ${p.label} · Days ${p.days}</div>
      <div style="font-family:'Source Sans 3',sans-serif;color:#384249;font-size:11px;line-height:1.5;">${p.description}</div>
    </div>`).join('');

  const scorecardHTML = SCORECARD_2026.map(s => `
    <div style="border:1px solid rgba(27,42,74,0.12);padding:16px;background:#fff;text-align:center;">
      <div style="font-family:'Cormorant Garamond',serif;color:#1B2A4A;font-size:28px;font-weight:400;line-height:1;">${s.value}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;margin-top:4px;">${s.label}</div>
      <div style="font-family:'Source Sans 3',sans-serif;color:rgba(27,42,74,0.45);font-size:10px;margin-top:2px;">${s.sub}</div>
    </div>`).join('');

  win.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Christie’s East Hampton · The First 300 Days + Ascension</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Source+Sans+3:wght@400;600&family=Barlow+Condensed:wght@400;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 18mm 20mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Source Sans 3', sans-serif; background: #FAF8F4; color: #1B2A4A; margin: 0; padding: 0; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head><body>

<!-- HEADER -->
<div style="text-align:center;padding:20px 0 12px;border-bottom:1px solid rgba(200,172,120,0.4);margin-bottom:20px;">
  <img src="${CIREG_LOGO_DARK}" alt="Christie's International Real Estate Group" style="height:40px;margin-bottom:8px;display:block;margin-left:auto;margin-right:auto;">
  <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin-top:4px;">Christie’s East Hampton · Growth Model</div>
</div>

<!-- TITLE -->
<div style="text-align:center;margin-bottom:20px;">
  <div style="font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:#1B2A4A;letter-spacing:1px;">The First 300 Days + Ascension</div>
  <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(27,42,74,0.45);margin-top:4px;">Pro Forma · April 2026 · Ilija Pavlović Review Copy · Targets, Not Actuals</div>
</div>

<!-- 2026 SCORECARD (TARGETS) -->
<div style="margin-bottom:20px;">
  <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;">2026 Scorecard · Targets</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
    ${scorecardHTML}
  </div>
</div>

<!-- ASCENSION STAIRCASE -->
<div style="margin-bottom:20px;">
  <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;">Ascension Arc · Sales Volume Trajectory · Staged Milestones</div>
  <div style="border:1px solid rgba(27,42,74,0.12);background:#fff;padding:20px 24px;">
    <div style="display:flex;align-items:flex-end;gap:6px;height:220px;">
      ${barsHTML}
    </div>
  </div>
</div>

<!-- 300-DAY ARC -->
<div style="margin-bottom:20px;">
  <div style="font-family:'Barlow Condensed',sans-serif;color:#C8AC78;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;">300-Day Arc · Execution Phases</div>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
    ${arcHTML}
  </div>
</div>

<!-- FOOTER -->
<div style="border-top:1px solid rgba(200,172,120,0.4);padding-top:12px;margin-top:8px;text-align:center;">
  <div style="font-family:'Barlow Condensed',sans-serif;color:rgba(27,42,74,0.4);font-size:9px;letter-spacing:0.18em;text-transform:uppercase;">Christie’s International Real Estate Group · 26 Park Place, East Hampton NY 11937 · Private &amp; Confidential</div>
  <div style="font-family:'Barlow Condensed',sans-serif;color:rgba(200,172,120,0.5);font-size:8px;letter-spacing:0.14em;text-transform:uppercase;margin-top:3px;">Art. Beauty. Provenance. · Since 1766</div>
</div>

</body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 800);
}

export default function FutureTab() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Growth Model v2 · 300-Day Arc
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>
          Future
        </h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          Synced from Growth Model v2 · Last updated March 2026
        </p>
      </div>

      <div className="px-6 py-8" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── 2026 Scorecard ─────────────────────────────────────────────────── */}
        <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          2026 Scorecard
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SCORECARD_2026.map(item => (
            <MatrixCard key={item.label} variant="default" className="p-5">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontSize: '2.5rem', fontWeight: 400, lineHeight: 1 }}>
                {item.value}
              </div>
              <div className="mt-1" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                {item.label}
              </div>
              <div className="mt-1" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(27,42,74,0.45)', fontSize: 11 }}>
                {item.sub}
              </div>
            </MatrixCard>
          ))}
        </div>

        {/* ── Ascension Arc ────────────────────────────────────────────────────── */}
        <div className="uppercase mb-4" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Ascension Arc · Sales Volume Trajectory
        </div>
        <MatrixCard variant="default" className="mb-10 p-6">
          {/* Ascending staircase bars — navy and gold, Ascension deck logic */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, minWidth: 560, height: 220, paddingBottom: 0 }}>
              {ASCENSION_MILESTONES.map((m, i) => {
                // Bar heights ascend: 20% → 32% → 44% → 60% → 76% → 100%
                const heights = [20, 32, 44, 60, 76, 100];
                const pct = heights[i] ?? 100;
                const barH = Math.round((pct / 100) * 180);
                const isFilled = i === 0;
                const statusColors: Record<string, string> = { BUILT: '#2D5A3D', BUILDING: '#C8AC78', LAUNCHING: '#1B2A4A' };
                return (
                  <div key={m.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 240 }}>
                    {/* Volume label above bar */}
                    <div style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      color: isFilled ? '#C8AC78' : '#1B2A4A',
                      fontSize: m.volume.length > 5 ? '0.85rem' : '1rem',
                      fontWeight: 600, lineHeight: 1, marginBottom: 6, textAlign: 'center',
                    }}>
                      {m.volume}
                    </div>
                    {/* Staircase bar */}
                    <div style={{
                      width: '100%',
                      height: barH,
                      background: isFilled
                        ? 'linear-gradient(to top, #1B2A4A 0%, #2a3f5f 100%)'
                        : 'linear-gradient(to top, rgba(27,42,74,0.12) 0%, rgba(27,42,74,0.22) 100%)',
                      borderTop: `3px solid ${isFilled ? '#C8AC78' : 'rgba(200,172,120,0.35)'}`,
                      borderLeft: '1px solid rgba(27,42,74,0.08)',
                      borderRight: '1px solid rgba(27,42,74,0.08)',
                      position: 'relative',
                    }}>
                      {isFilled && (
                        <div style={{
                          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                          ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>
                          Now
                        </div>
                      )}
                    </div>
                    {/* Milestone label below bar */}
                    <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6, textAlign: 'center' }}>
                      {m.label}
                    </div>
                    <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.62rem', lineHeight: 1.3, textAlign: 'center', marginTop: 2 }}>
                      {m.period}
                    </div>
                    {m.status && (
                      <div style={{ marginTop: 4, padding: '2px 6px', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', ...LABEL_FONT, background: statusColors[m.status] ?? '#1B2A4A', color: '#FAF8F4', borderRadius: 2 }}>
                        {m.status}
                      </div>
                    )}
                    {!m.status && m.agents && (
                      <div style={{ marginTop: 4, padding: '2px 6px', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', ...LABEL_FONT, background: 'rgba(27,42,74,0.1)', color: '#1B2A4A', borderRadius: 2 }}>
                        {m.agents}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Detail rows */}
          <div className="mt-8 border-t pt-6" style={{ borderColor: 'rgba(27,42,74,0.08)' }}>
            <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.2em' }}>
              Milestone Detail · Ilija ProForma March 2026 v4 · Christie&apos;s Ascension UPDATED
            </div>
            <div className="flex flex-col gap-2">
              {ASCENSION_MILESTONES.map(m => (
                <div key={m.id} className="flex items-start gap-4 py-2 border-b" style={{ borderColor: 'rgba(27,42,74,0.05)' }}>
                  <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 10, minWidth: 80, letterSpacing: '0.1em' }}>{m.label}</div>
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontSize: '1rem', fontWeight: 600, minWidth: 80 }}>{m.volume}</div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.8rem', flex: 1 }}>{m.detail}</div>
                  {m.status && <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{m.status}</div>}
                </div>
              ))}
            </div>
          </div>
        </MatrixCard>

        {/* ── 2026–2031 Outlook Table ────────────────────────────────────────── */}
        <div className="uppercase mb-4" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          2026–2031 GCI Outlook
        </div>
        <MatrixCard variant="default" className="mb-10 overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #C8AC78' }}>
                {['Year', 'Agents', 'GCI', 'Avg / Agent', 'Milestone'].map(h => (
                  <th key={h} className="px-4 py-3 text-left" style={{
                    ...LABEL_FONT, color: '#C8AC78',
                    fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OUTLOOK.map((row, i) => (
                <tr key={row.year} style={{
                  borderBottom: '1px solid rgba(27,42,74,0.08)',
                  background: i === 0 ? 'rgba(200,172,120,0.06)' : 'transparent',
                }}>
                  <td className="px-4 py-3 font-semibold" style={{
                    color: '#1B2A4A', fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem',
                  }}>
                    {row.year}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#384249' }}>{row.agents}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1B2A4A' }}>{row.gci}</td>
                  <td className="px-4 py-3" style={{ color: '#384249' }}>{row.avgGci}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#7a8a8e' }}>{row.milestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MatrixCard>

        {/* ── Agent Roster ──────────────────────────────────────────────────── */}
        <div className="uppercase mb-4" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Agent Roster — 2026
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {ROSTER.map(agent => (
            <MatrixCard key={agent.name} variant={agent.status === 'Active' ? 'active' : 'default'} className="p-4">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem' }}>
                {agent.name}
              </div>
              <div className="text-sm mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>
                {agent.role}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-[10px] uppercase" style={{
                  ...LABEL_FONT,
                  background: agent.status === 'Active' ? '#1B2A4A' : 'rgba(27,42,74,0.08)',
                  color: agent.status === 'Active' ? '#C8AC78' : '#7a8a8e',
                  letterSpacing: '0.12em',
                }}>
                  {agent.status}
                </span>
                <span className="text-[10px]" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.1em' }}>
                  {agent.tier}
                </span>
              </div>
            </MatrixCard>
          ))}
        </div>

        {/* ── 300-Day Arc ───────────────────────────────────────────────────── */}
        <div className="uppercase mb-4" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          300-Day Arc
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {ARC_PHASES.map(phase => (
            <MatrixCard key={phase.phase} variant="default" className="p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center border" style={{
                  width: 56, height: 56,
                  borderColor: '#C8AC78', background: 'rgba(200,172,120,0.08)',
                }}>
                  <span style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: '0.7rem', letterSpacing: '0.08em', textAlign: 'center', lineHeight: 1.3 }}>
                    {phase.days}
                  </span>
                </div>
                <div>
                  <div className="uppercase text-[10px] mb-1" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.16em' }}>
                    {phase.phase} · {phase.label}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>
                    {phase.description}
                  </div>
                </div>
              </div>
            </MatrixCard>
          ))}
        </div>

        {/* ── Export + Google Sheet link ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 pb-4">
          <button
            onClick={exportAscensionPDF}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ ...LABEL_FONT, borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.18em', background: 'rgba(200,172,120,0.08)' }}
          >
            ↓ Export PDF · 300 Days + Ascension
          </button>
          <a
            href="https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ ...LABEL_FONT, borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.18em' }}
          >
            Open Growth Model v2 Sheet
          </a>
        </div>

      </div>
    </div>
  );
}
