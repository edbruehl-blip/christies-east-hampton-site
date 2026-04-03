/**
 * FUTURE TAB — Growth Model, Agent Roster, and 300-Day Arc.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 * Data source: Growth Model v2 Google Sheet (manual sync — locked sheet ID)
 */

import { MatrixCard } from '@/components/MatrixCard';

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

// Ascension milestones — from Ilija ProForma March 2026 v4 + Christie's Ascension UPDATED
const ASCENSION_MILESTONES = [
  { id: 1, label: 'Year 1 · 2026',   volume: '$2.5M',   sub: 'Foundation · First closings',          actual: true,  detail: 'Ed Bruehl solo · 1 agent · 2 closings · Base case entry' },
  { id: 2, label: 'Year 2 · 2027',   volume: '$13.62M', sub: 'First team layer · 6 agents',           actual: false, detail: '6 agents operating · $2.27M avg GCI/agent · Podcast + events cadence locked' },
  { id: 3, label: 'Year 3 · 2028',   volume: '$20M+',   sub: 'Operating scale · 10 agents',           actual: false, detail: '10 agents · $2M avg · South Fork market presence established' },
  { id: 4, label: 'Year 4 · 2029',   volume: '$143M+',  sub: 'Regional authority · 14 agents',        actual: false, detail: "14 agents · Institutional listing pipeline · Christie's brand fully deployed" },
  { id: 5, label: 'Year 5 · 2030',   volume: '$280M+',  sub: 'Institutional presence · 18 agents',   actual: false, detail: '18 agents · Family office relationships active · UHNW collector network' },
  { id: 6, label: 'Year 6 · 2031',   volume: '$3B',     sub: 'Full South Fork coverage · 22 agents', actual: false, detail: "22 agents · Full territory coverage · Christie's East Hampton as market authority" },
];

const LABEL_FONT: React.CSSProperties = { fontFamily: '"Barlow Condensed", sans-serif' };

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
                return (
                  <div key={m.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 220 }}>
                    {/* Volume label above bar */}
                    <div style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      color: m.actual ? '#C8AC78' : '#1B2A4A',
                      fontSize: m.volume.length > 5 ? '0.85rem' : '1rem',
                      fontWeight: 600, lineHeight: 1, marginBottom: 6, textAlign: 'center',
                    }}>
                      {m.volume}
                    </div>
                    {/* Staircase bar */}
                    <div style={{
                      width: '100%',
                      height: barH,
                      background: m.actual
                        ? 'linear-gradient(to top, #1B2A4A 0%, #2a3f5f 100%)'
                        : 'linear-gradient(to top, rgba(27,42,74,0.12) 0%, rgba(27,42,74,0.22) 100%)',
                      borderTop: `3px solid ${m.actual ? '#C8AC78' : 'rgba(200,172,120,0.35)'}`,
                      borderLeft: '1px solid rgba(27,42,74,0.08)',
                      borderRight: '1px solid rgba(27,42,74,0.08)',
                      position: 'relative',
                    }}>
                      {m.actual && (
                        <div style={{
                          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                          ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>
                          Now
                        </div>
                      )}
                    </div>
                    {/* Year label below bar */}
                    <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6, textAlign: 'center' }}>
                      {m.label.split(' · ')[0]}
                    </div>
                    <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.62rem', lineHeight: 1.3, textAlign: 'center', marginTop: 2 }}>
                      {m.sub.split(' · ')[0]}
                    </div>
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
                  {m.actual && <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>✓ Actual</div>}
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

        {/* ── Google Sheet link ─────────────────────────────────────────────── */}
        <div className="text-center pb-4">
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
