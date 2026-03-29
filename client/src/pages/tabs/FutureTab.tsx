/**
 * FUTURE TAB — Growth Model, Agent Roster, and 300-Day Arc.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 * Data source: Growth Model v2 Google Sheet (manual sync — locked sheet ID)
 */

import { MatrixCard } from '@/components/MatrixCard';

// ─── Growth Model v2 Data (synced from sheet) ─────────────────────────────────

const OUTLOOK = [
  { year: 2026, agents: 3,  gci: '$875K',   avgGci: '$292K', milestone: 'Foundation — Ed + 2 agents' },
  { year: 2027, agents: 6,  gci: '$1.56M',  avgGci: '$260K', milestone: 'First team layer' },
  { year: 2028, agents: 10, gci: '$2.50M',  avgGci: '$250K', milestone: 'Operating scale' },
  { year: 2029, agents: 14, gci: '$3.08M',  avgGci: '$220K', milestone: 'Regional authority' },
  { year: 2030, agents: 18, gci: '$3.60M',  avgGci: '$200K', milestone: 'Institutional presence' },
  { year: 2031, agents: 22, gci: '$4.40M',  avgGci: '$200K', milestone: 'Full South Fork coverage' },
];

const ROSTER = [
  { name: 'Ed Bruehl',       role: 'Managing Director',         status: 'Active',  tier: 'Founding' },
  { name: 'Seat 2',          role: 'Senior Associate',          status: 'Recruiting', tier: 'Q2 2026' },
  { name: 'Seat 3',          role: 'Associate',                 status: 'Recruiting', tier: 'Q2 2026' },
  { name: 'Seat 4',          role: 'Associate',                 status: 'Target',  tier: 'Q3 2026' },
  { name: 'Seat 5',          role: 'Associate',                 status: 'Target',  tier: 'Q3 2026' },
  { name: 'Seat 6',          role: 'Associate',                 status: 'Target',  tier: 'Q4 2026' },
];

const ARC_PHASES = [
  { phase: 'Phase I',   days: '1–90',    label: 'Foundation',    description: 'Establish systems, deploy ANEW calculator, first two agent hires, first three listings.' },
  { phase: 'Phase II',  days: '91–180',  label: 'Activation',    description: 'First closings, INTEL document library live, Paumanok Map deployed, morning brief cadence locked.' },
  { phase: 'Phase III', days: '181–270', label: 'Acceleration',  description: 'Six agents operating, Growth Model v2 on pace, first council brief published, podcast launched.' },
  { phase: 'Phase IV',  days: '271–300', label: 'Consolidation', description: 'Full South Fork market authority established. Annual GCI run rate confirmed. Year 2 plan locked.' },
];

export default function FutureTab() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>Growth Model v2 · 300-Day Arc</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>Future</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          Synced from Growth Model v2 · Last updated March 2026
        </p>
      </div>

      <div className="px-6 py-8" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* 2026–2031 Outlook Table */}
        <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          2026–2031 GCI Outlook
        </div>
        <MatrixCard variant="default" className="mb-10 overflow-x-auto">
          <table className="w-full text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #C8AC78' }}>
                {['Year', 'Agents', 'GCI', 'Avg / Agent', 'Milestone'].map(h => (
                  <th key={h} className="px-4 py-3 text-left uppercase text-[10px]" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OUTLOOK.map((row, i) => (
                <tr key={row.year} style={{ borderBottom: '1px solid rgba(27,42,74,0.08)', background: i === 0 ? 'rgba(200,172,120,0.06)' : 'transparent' }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1B2A4A', fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem' }}>{row.year}</td>
                  <td className="px-4 py-3" style={{ color: '#384249' }}>{row.agents}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#1B2A4A' }}>{row.gci}</td>
                  <td className="px-4 py-3" style={{ color: '#384249' }}>{row.avgGci}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#7a8a8e' }}>{row.milestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </MatrixCard>

        {/* Agent Roster */}
        <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Agent Roster — 2026
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {ROSTER.map(agent => (
            <MatrixCard key={agent.name} variant={agent.status === 'Active' ? 'active' : 'default'} className="p-4">
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem' }}>{agent.name}</div>
              <div className="text-sm mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{agent.role}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-[10px] uppercase" style={{ fontFamily: '"Barlow Condensed", sans-serif', background: agent.status === 'Active' ? '#1B2A4A' : 'rgba(27,42,74,0.08)', color: agent.status === 'Active' ? '#C8AC78' : '#7a8a8e', letterSpacing: '0.12em' }}>{agent.status}</span>
                <span className="text-[10px]" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.1em' }}>{agent.tier}</span>
              </div>
            </MatrixCard>
          ))}
        </div>

        {/* 300-Day Arc */}
        <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          300-Day Arc
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {ARC_PHASES.map(phase => (
            <MatrixCard key={phase.phase} variant="default" className="p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 flex items-center justify-center border" style={{ borderColor: '#C8AC78', background: 'rgba(200,172,120,0.08)' }}>
                  <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: '0.75rem', letterSpacing: '0.1em' }}>{phase.days}</span>
                </div>
                <div>
                  <div className="uppercase text-[10px] mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>{phase.phase} · {phase.label}</div>
                  <div className="text-sm leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{phase.description}</div>
                </div>
              </div>
            </MatrixCard>
          ))}
        </div>

        {/* Google Sheet link */}
        <div className="text-center">
          <a
            href="https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.18em' }}
          >
            Open Growth Model v2 Sheet
          </a>
        </div>

      </div>
    </div>
  );
}
