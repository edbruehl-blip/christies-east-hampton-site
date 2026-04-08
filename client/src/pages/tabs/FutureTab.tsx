/**
 * FUTURE TAB — Sprint 11 Item 5 Rebuild
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 * Data source: Growth Model v2 VOLUME tab (LIVE — service account, publicProcedure)
 *
 * GCI GATE (Sprint 26 Item 1):
 *   - Unauthenticated: Ascension Arc + 300-Day Proof + Volume-only agent table (no GCI columns)
 *   - Authenticated: Full view including GCI columns, Profit Pool, ANEW Homes profit, Verified Numbers
 *   - Server procedure stays publicProcedure (service account is the credential)
 *   - Gate is client-side only — GCI data does not render without a valid session
 */

import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { generateFutureReportPDF } from '@/lib/pdf-exports';

// ─── Council-governed milestone targets ──────────────────────────────────────
const MILESTONE_TARGETS = {
  2025: { volume: 15_000_000, displayVolume: '$15M', label: 'Baseline', note: 'Bonita DeWolf pre-launch baseline', isBaseline: true },
  2026: { volume: 55_000_000, displayVolume: '$55M', label: 'Target', note: null, isBaseline: false },
  2027: { volume: 105_000_000, displayVolume: '$100M–$110M', label: '$100M–$110M', note: null, isBaseline: false },
  2028: { volume: 165_000_000, displayVolume: '$165M', label: '$165M', note: null, isBaseline: false },
  2029: { volume: 230_000_000, displayVolume: '$230M', label: '$230M', note: null, isBaseline: false },
  2030: { volume: 320_000_000, displayVolume: '$320M', label: '$320M', note: null, isBaseline: false },
  2031: { volume: 430_000_000, displayVolume: '$430M', label: '$430M', note: null, isBaseline: false },
} as const;

const LABEL_FONT: React.CSSProperties = { fontFamily: '"Barlow Condensed", sans-serif' };
const SERIF: React.CSSProperties = { fontFamily: '"Cormorant Garamond", serif' };
const SANS: React.CSSProperties = { fontFamily: '"Source Sans 3", sans-serif' };

const MAX_VOLUME = MILESTONE_TARGETS[2031].volume;
const CHART_HEIGHT = 220; // px

function fmtVol(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000 % 1 === 0 ? (n / 1_000_000).toFixed(0) : (n / 1_000_000).toFixed(2))}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

// ─── GCI Locked Placeholder ──────────────────────────────────────────────────
// Shown in place of any GCI/internal section when user is not authenticated
function GciLockedPlaceholder({ label }: { label: string }) {
  return (
    <div className="mb-10 p-8 border text-center" style={{
      background: 'rgba(27,42,74,0.02)',
      borderColor: 'rgba(200,172,120,0.3)',
      borderStyle: 'dashed',
    }}>
      <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔒</div>
      <div style={{ ...SERIF, color: '#1B2A4A', fontSize: '1rem', fontWeight: 400, marginBottom: 6 }}>
        Internal Data — Authentication Required
      </div>
      <div style={{ ...SANS, color: '#7a8a8e', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 16, maxWidth: 400, margin: '0 auto 16px' }}>
        GCI figures and compensation data are internal only. Sign in to view.
      </div>
      <a
        href={getLoginUrl()}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '9px 20px',
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#FAF8F4',
          background: '#1B2A4A',
          border: '1px solid #C8AC78',
          textDecoration: 'none',
        }}
      >
        Sign In to View
      </a>
    </div>
  );
}

// ─── Pro Forma Button Component ─────────────────────────────────────────────
function ProFormaButton() {
  const generateProForma = trpc.future.generateProForma.useMutation();

  const handleGenerate = async () => {
    try {
      const result = await generateProForma.mutateAsync();
      const byteChars = atob(result.pdf);
      const byteNums = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNums);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      a.download = `Christies_EH_ProForma_${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Pro forma generation failed:', err);
      alert('Pro forma generation failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={generateProForma.isPending}
      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.18em', background: 'rgba(27,42,74,0.04)' }}
    >
      {generateProForma.isPending ? '⏳ Generating…' : '↓ Generate Pro Forma · 4-Page PDF'}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FutureTab() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const { data: volData, isLoading: volLoading } = trpc.future.volumeData.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const agents = volData?.agents ?? [];
  const total = volData?.total ?? {
    proj2026: 0, act2026: 0, projGci2026: 0, actGci2026: 0,
    proj2027: 0, act2027: 0, projGci2027: 0, actGci2027: 0,
    proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0,
    proj2029: 0, act2029: 0, projGci2029: 0, actGci2029: 0,
    proj2030: 0, act2030: 0, projGci2030: 0, actGci2030: 0,
    proj2031: 0, act2031: 0, projGci2031: 0, actGci2031: 0,
  };

  const liveAct2026 = useMemo(() => {
    if (!volData) return 4_570_000;
    return volData.total.act2026 || 4_570_000;
  }, [volData]);

  const ARC_BARS = useMemo(() => {
    const closed2026 = volData?.total.act2026 || 4_570_000;
    const active2026 = volData?.total.proj2026
      ? Math.max(0, volData.total.proj2026 - closed2026)
      : 13_620_000;
    const projected2026 = Math.max(0, MILESTONE_TARGETS[2026].volume - closed2026 - active2026);
    return [
      { year: '2025', ...MILESTONE_TARGETS[2025], segments: null, isClosed: true },
      {
        year: '2026',
        ...MILESTONE_TARGETS[2026],
        segments: [
          { label: 'Closed',    value: closed2026,    color: '#1B2A4A' },
          { label: 'Active',    value: active2026,    color: '#8a7a5a' },
          { label: 'Projected', value: projected2026, color: 'rgba(200,172,120,0.35)' },
        ],
        isClosed: false,
      },
      { year: '2027', ...MILESTONE_TARGETS[2027], segments: null, isClosed: false },
      { year: '2028', ...MILESTONE_TARGETS[2028], segments: null, isClosed: false },
      { year: '2029', ...MILESTONE_TARGETS[2029], segments: null, isClosed: false },
      { year: '2030', ...MILESTONE_TARGETS[2030], segments: null, isClosed: false },
      { year: '2031', ...MILESTONE_TARGETS[2031], segments: null, isClosed: false },
    ];
  }, [volData]);

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Growth Model v2 · 300-Day Arc · Ascension
        </div>
        <h2 style={{ ...SERIF, color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>
          Future
        </h2>
        <div className="flex items-center gap-3 mt-2">
          {volData && !volLoading ? (
            <span style={{ ...LABEL_FONT, color: '#4ade80', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ● Live · Growth Model v2 · VOLUME tab
            </span>
          ) : volLoading ? (
            <span style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Loading…
            </span>
          ) : null}
          <span style={{ ...SANS, color: 'rgba(250,248,244,0.45)', fontSize: '0.75rem' }}>
            Sales volume only · Private &amp; Confidential
          </span>
          {!authLoading && !isAuthenticated && (
            <span style={{ ...LABEL_FONT, color: 'rgba(200,172,120,0.5)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              · GCI data requires sign-in
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-8" style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>

        {/* ── Ascension Arc ────────────────────────────────────────────────────── */}
        <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Ascension Arc · Sales Volume Trajectory
        </div>
        <div className="mb-10 p-6 border" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minWidth: 700, height: CHART_HEIGHT + 60, paddingBottom: 0 }}>
              {ARC_BARS.map((bar) => {
                const sqrtPct = Math.sqrt(bar.volume / MAX_VOLUME);
                const barH = Math.max(8, Math.round(sqrtPct * CHART_HEIGHT));
                return (
                  <div key={bar.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: CHART_HEIGHT + 60 }}>
                    <div style={{
                      ...SERIF, color: '#1B2A4A', fontWeight: 600,
                      fontSize: bar.displayVolume.length > 6 ? '0.82rem' : '1rem',
                      lineHeight: 1, marginBottom: 6, textAlign: 'center',
                    }}>
                      {bar.displayVolume}
                    </div>
                    {bar.segments ? (
                      <div style={{ width: '100%', height: barH, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', borderTop: '3px solid #C8AC78' }}>
                        {[...bar.segments].reverse().map((seg) => {
                          const segH = Math.round((seg.value / bar.volume) * barH);
                          return (
                            <div key={seg.label} style={{ width: '100%', height: segH, background: seg.color, flexShrink: 0 }} />
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{
                        width: '100%', height: barH,
                        background: bar.isBaseline
                          ? 'linear-gradient(to top, rgba(27,42,74,0.15) 0%, rgba(27,42,74,0.22) 100%)'
                          : 'linear-gradient(to top, rgba(200,172,120,0.18) 0%, rgba(200,172,120,0.28) 100%)',
                        borderTop: `3px solid ${bar.isBaseline ? 'rgba(27,42,74,0.35)' : '#C8AC78'}`,
                      }} />
                    )}
                    <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, textAlign: 'center' }}>
                      {bar.year}
                    </div>
                  </div>
                );
              })}
              {/* $1B Horizon */}
              <div style={{ flex: 0.7, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: CHART_HEIGHT + 60 }}>
                <div style={{ ...SERIF, color: '#C8AC78', fontWeight: 700, fontSize: '1rem', textAlign: 'center', marginBottom: 6, lineHeight: 1.2 }}>
                  $1B<br />Run Rate
                </div>
                <div style={{
                  width: 2, height: CHART_HEIGHT,
                  background: 'repeating-linear-gradient(to bottom, #C8AC78 0, #C8AC78 5px, transparent 5px, transparent 10px)',
                }} />
                <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 6, textAlign: 'center', lineHeight: 1.3 }}>
                  2032–2033<br />Horizon
                </div>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t" style={{ borderColor: 'rgba(27,42,74,0.08)' }}>
            {[
              { color: '#1B2A4A', label: `2026 Closed · ${fmtVol(liveAct2026)}` },
              { color: '#8a7a5a', label: '2026 Active Pipeline · $13.62M' },
              { color: 'rgba(200,172,120,0.35)', border: '#C8AC78', label: '2026 Projected to $55M Total' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div style={{ width: 12, height: 12, background: l.color, border: l.border ? `1px solid ${l.border}` : undefined, flexShrink: 0 }} />
                <span style={{ ...LABEL_FONT, color: '#384249', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 300-Day Proof ────────────────────────────────────────────────────── */}
        <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          300-Day Proof
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'First 100 Days', period: 'Dec 2025 – Mar 2026', volume: '$4.57M', desc: 'Closed volume. Office open. Systems deployed. Ed Bruehl solo.', badge: 'Closed', badgeBg: '#2D5A3D', badgeColor: '#FAF8F4' },
            { label: 'Second 100 Days', period: 'Mar – May 1, 2026', volume: '$13.62M', desc: 'Active pipeline. First agent hires. Podcast and events cadence locked.', badge: 'Active', badgeBg: '#C8AC78', badgeColor: '#1B2A4A' },
            { label: 'Third 100 Days', period: 'May 1 – Aug 2026', volume: '$55M', desc: 'Projected total. Operating scale. South Fork market presence established.', badge: 'Projected', badgeBg: 'rgba(27,42,74,0.1)', badgeColor: '#1B2A4A' },
          ].map(block => (
            <div key={block.label} className="p-5 border" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
              <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>{block.label}</div>
              <div style={{ ...LABEL_FONT, color: 'rgba(27,42,74,0.4)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{block.period}</div>
              <div style={{ ...SERIF, color: '#1B2A4A', fontWeight: 600, fontSize: '2rem', lineHeight: 1 }}>{block.volume}</div>
              <div className="mt-3 text-sm leading-relaxed" style={{ ...SANS, color: '#384249', fontSize: '0.8rem' }}>{block.desc}</div>
              <div className="mt-3 inline-block px-2 py-0.5" style={{ ...LABEL_FONT, background: block.badgeBg, color: block.badgeColor, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{block.badge}</div>
            </div>
          ))}
        </div>

        {/* ── Agent Volume Table ────────────────────────────────────────────── */}
        {/* Unauthenticated: volume columns only. Authenticated: + GCI columns */}
        <div className="flex items-center justify-between mb-3">
          <div className="uppercase" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
            Agent Volume · 2026 · {isAuthenticated ? 'Sales Volume + GCI' : 'Sales Volume'}
          </div>
          {volData && !volLoading && (
            <span style={{ ...LABEL_FONT, color: '#4ade80', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ● Live · VOLUME tab
            </span>
          )}
        </div>
        <div className="mb-10 border overflow-x-auto" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
          <table className="w-full text-sm" style={{ ...SANS, borderCollapse: 'collapse', minWidth: isAuthenticated ? 800 : 600 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #C8AC78' }}>
                <th className="px-4 py-3 text-left" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Agent</th>
                <th className="px-3 py-3 text-left" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Role</th>
                <th className="px-3 py-3 text-left" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Status</th>
                <th className="px-3 py-3 text-right" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', borderLeft: '1px solid rgba(200,172,120,0.3)' }}>Proj Vol 2026</th>
                <th className="px-3 py-3 text-right" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Act Vol 2026</th>
                {isAuthenticated && <>
                  <th className="px-3 py-3 text-right" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', borderLeft: '1px solid rgba(200,172,120,0.15)' }}>Proj GCI 2026</th>
                  <th className="px-3 py-3 text-right" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Act GCI 2026</th>
                </>}
              </tr>
            </thead>
            <tbody>
              {(agents.length > 0 ? agents : [
                { name: 'Ed Bruehl', role: 'Managing Director', status: 'Active', proj2026: 30_000_000, act2026: 4_570_000, projGci2026: 900_000, actGci2026: 0, proj2027: 50_000_000, act2027: 0, projGci2027: 0, actGci2027: 0, proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0, startYear: '2025' },
                { name: 'Jarvis Slade', role: 'Agent', status: 'Active', proj2026: 5_000_000, act2026: 0, projGci2026: 150_000, actGci2026: 0, proj2027: 15_000_000, act2027: 0, projGci2027: 0, actGci2027: 0, proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0, startYear: '2026' },
                { name: 'Bonita DeWolf', role: 'Agent', status: 'Active', proj2026: 15_000_000, act2026: 0, projGci2026: 450_000, actGci2026: 0, proj2027: 20_000_000, act2027: 0, projGci2027: 0, actGci2027: 0, proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0, startYear: '2026' },
                { name: 'Scott Smith', role: 'Agent', status: 'Pending (June 1)', proj2026: 1_500_000, act2026: 0, projGci2026: 45_000, actGci2026: 0, proj2027: 3_000_000, act2027: 0, projGci2027: 0, actGci2027: 0, proj2028: 0, act2028: 0, projGci2028: 0, actGci2028: 0, startYear: '2026' },
              ]).map((agent, i) => (
                <tr key={agent.name} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(27,42,74,0.015)' }}>
                  <td className="px-4 py-3" style={{ ...SERIF, color: '#1B2A4A', fontWeight: 600, fontSize: '0.9rem' }}>{agent.name}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: '#384249' }}>{agent.role}</td>
                  <td className="px-3 py-3">
                    <span className="px-2 py-0.5 text-[9px] uppercase" style={{ ...LABEL_FONT, background: agent.status === 'Active' ? 'rgba(27,42,74,0.08)' : 'rgba(200,172,120,0.15)', color: agent.status === 'Active' ? '#1B2A4A' : '#C8AC78', letterSpacing: '0.1em' }}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-sm text-right" style={{ color: '#C8AC78', fontWeight: 600, borderLeft: '1px solid rgba(200,172,120,0.15)' }}>{fmtVol(agent.proj2026)}</td>
                  <td className="px-3 py-3 text-sm text-right font-semibold" style={{ color: '#1B2A4A' }}>
                    {(agent.act2026 ?? 0) > 0 ? fmtVol(agent.act2026) : <span style={{ color: 'rgba(27,42,74,0.25)' }}>—</span>}
                  </td>
                  {isAuthenticated && <>
                    <td className="px-3 py-3 text-sm text-right" style={{ color: '#8a7a5a', borderLeft: '1px solid rgba(200,172,120,0.1)' }}>
                      {(agent.projGci2026 ?? 0) > 0 ? fmtVol(agent.projGci2026) : <span style={{ color: 'rgba(27,42,74,0.2)' }}>—</span>}
                    </td>
                    <td className="px-3 py-3 text-sm text-right" style={{ color: '#384249' }}>
                      {(agent.actGci2026 ?? 0) > 0 ? fmtVol(agent.actGci2026) : <span style={{ color: 'rgba(27,42,74,0.2)' }}>—</span>}
                    </td>
                  </>}
                </tr>
              ))}
              {/* ANEW Homes row */}
              <tr style={{ borderBottom: '1px solid rgba(200,172,120,0.2)', background: 'rgba(200,172,120,0.04)' }}>
                <td className="px-4 py-3" style={{ ...SERIF, color: '#8a7a5a', fontWeight: 600, fontSize: '0.85rem' }}>ANEW Homes</td>
                <td className="px-3 py-3 text-sm" style={{ color: '#7a8a8e' }}>Custom Build · Ed Bruehl exclusively</td>
                <td className="px-3 py-3">
                  <span className="px-2 py-0.5 text-[9px] uppercase" style={{ ...LABEL_FONT, background: 'rgba(200,172,120,0.15)', color: '#C8AC78', letterSpacing: '0.1em' }}>Active</span>
                </td>
                <td className="px-3 py-3 text-sm text-right" style={{ color: '#C8AC78', fontWeight: 600, borderLeft: '1px solid rgba(200,172,120,0.15)' }}>—</td>
                <td className="px-3 py-3 text-sm text-right" style={{ color: 'rgba(27,42,74,0.25)' }}>—</td>
                {isAuthenticated && <>
                  <td className="px-3 py-3 text-sm text-right" style={{ color: 'rgba(27,42,74,0.2)', borderLeft: '1px solid rgba(200,172,120,0.1)' }}>—</td>
                  <td className="px-3 py-3 text-sm text-right" style={{ color: 'rgba(27,42,74,0.2)' }}>—</td>
                </>}
              </tr>
              {/* Total row */}
              <tr style={{ borderTop: '2px solid #C8AC78', background: 'rgba(200,172,120,0.05)' }}>
                <td className="px-4 py-3" colSpan={3} style={{ ...LABEL_FONT, color: '#1B2A4A', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Total · 16 Agents (9 existing incl. Scott Smith pending June 1 + 3 targeted + 4 organic)
                </td>
                <td className="px-3 py-3 text-sm text-right font-semibold" style={{ color: '#C8AC78', borderLeft: '1px solid rgba(200,172,120,0.15)' }}>
                  {fmtVol(total.proj2026 || 55_000_000)}
                </td>
                <td className="px-3 py-3 text-sm text-right font-semibold" style={{ color: '#1B2A4A' }}>
                  {(total.act2026 ?? 0) > 0 ? fmtVol(total.act2026) : fmtVol(liveAct2026)}
                </td>
                {isAuthenticated && <>
                  <td className="px-3 py-3 text-sm text-right font-semibold" style={{ color: '#8a7a5a', borderLeft: '1px solid rgba(200,172,120,0.1)' }}>
                    {(total.projGci2026 ?? 0) > 0 ? fmtVol(total.projGci2026) : '$3.08M'}
                  </td>
                  <td className="px-3 py-3 text-sm text-right font-semibold" style={{ color: '#384249' }}>
                    {(total.actGci2026 ?? 0) > 0 ? fmtVol(total.actGci2026) : <span style={{ color: 'rgba(27,42,74,0.25)' }}>—</span>}
                  </td>
                </>}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── Profit Pool — GATED ──────────────────────────────────────────────── */}
        <div className="uppercase mb-2" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Profit Pool · 2026–2031 Projection
        </div>
        {!authLoading && !isAuthenticated ? (
          <GciLockedPlaceholder label="Profit Pool · Internal Data" />
        ) : isAuthenticated ? (
          <>
            <div className="mb-3 px-4 py-2 border" style={{ background: 'rgba(27,42,74,0.03)', borderColor: 'rgba(200,172,120,0.5)', borderLeftWidth: 3 }}>
              <span style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                ★ INTERNAL ONLY — NOT FOR EXTERNAL DOCUMENTS · Governing principle, not yet contractual *
              </span>
            </div>
            <div className="mb-4 px-4 py-3 border" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
              <p style={{ ...SANS, color: '#384249', fontSize: '0.8rem', lineHeight: 1.65, margin: 0 }}>
                Formula: Pool = (Total Sales Volume − <strong style={{ color: '#1B2A4A' }}>$40M breakeven</strong>) × <strong style={{ color: '#1B2A4A' }}>2%</strong>.
                If volume &lt; $40M, pool = $0.&nbsp;&nbsp;
                Split: <strong style={{ color: '#1B2A4A' }}>Ed Bruehl 30%</strong> · <strong style={{ color: '#1B2A4A' }}>Ilija 65%</strong> · <strong style={{ color: '#1B2A4A' }}>Christie's RE Rights 5%</strong>.
                Paid at year end. Not salary. Not splits. Profit participation.
              </p>
            </div>
            <div className="mb-4 border overflow-x-auto" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
              <table className="w-full" style={{ ...SANS, borderCollapse: 'collapse', minWidth: 680 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #C8AC78', background: 'rgba(27,42,74,0.02)' }}>
                    {['Year', 'Total Sales Volume', 'Above $40M Breakeven', 'Pool (2%)', 'Ed Bruehl (30%)', 'Ilija (65%)', "Christie's RE (5%)"].map(h => (
                      <th key={h} className="px-3 py-3 text-left" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { year: '2026', vol: total.proj2026 || 55_000_000 },
                    { year: '2027', vol: total.proj2027 || 93_000_000 },
                    { year: '2028', vol: total.proj2028 || 133_000_000 },
                    { year: '2029', vol: total.proj2029 || 230_000_000 },
                    { year: '2030', vol: total.proj2030 || 320_000_000 },
                    { year: '2031', vol: total.proj2031 || 430_000_000 },
                  ].map((row, i) => {
                    const BREAKEVEN = 40_000_000;
                    const aboveBreakeven = Math.max(0, row.vol - BREAKEVEN);
                    const pool = aboveBreakeven * 0.02;
                    const edShare = pool * 0.30;
                    const ilijaShare = pool * 0.65;
                    const christiesShare = pool * 0.05;
                    return (
                      <tr key={row.year} style={{ borderBottom: '1px solid rgba(27,42,74,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(27,42,74,0.015)' }}>
                        <td className="px-3 py-3" style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 10, letterSpacing: '0.12em', fontWeight: 600 }}>{row.year}</td>
                        <td className="px-3 py-3" style={{ ...SANS, color: '#384249', fontSize: '0.85rem' }}>{fmtVol(row.vol)}</td>
                        <td className="px-3 py-3" style={{ ...SANS, color: aboveBreakeven > 0 ? '#1B2A4A' : 'rgba(27,42,74,0.3)', fontSize: '0.85rem' }}>{aboveBreakeven > 0 ? fmtVol(aboveBreakeven) : '—'}</td>
                        <td className="px-3 py-3 font-semibold" style={{ ...SANS, color: '#C8AC78', fontSize: '0.85rem' }}>{pool > 0 ? fmtVol(pool) : '$0'}</td>
                        <td className="px-3 py-3 font-semibold" style={{ ...SANS, color: '#1B2A4A', fontSize: '0.85rem' }}>{edShare > 0 ? fmtVol(edShare) : '$0'}</td>
                        <td className="px-3 py-3" style={{ ...SANS, color: '#384249', fontSize: '0.85rem' }}>{ilijaShare > 0 ? fmtVol(ilijaShare) : '$0'}</td>
                        <td className="px-3 py-3" style={{ ...SANS, color: '#7a8a8e', fontSize: '0.85rem' }}>{christiesShare > 0 ? fmtVol(christiesShare) : '$0'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mb-10 px-4 py-3 border-l-2" style={{ borderColor: 'rgba(200,172,120,0.5)', background: 'rgba(200,172,120,0.03)' }}>
              <p style={{ ...SANS, color: 'rgba(27,42,74,0.5)', fontSize: '0.75rem', lineHeight: 1.6, margin: 0 }}>
                * Governing principle only — not yet contractual. Pool activates above $40M total sales volume.
                GCI data lives only in this section, clearly labeled as internal. Targets above are MODEL projections, not guarantees.
              </p>
            </div>
          </>
        ) : (
          // Auth still loading — show subtle placeholder
          <div className="mb-10 p-6 border" style={{ background: 'rgba(27,42,74,0.02)', borderColor: 'rgba(200,172,120,0.2)' }}>
            <div style={{ ...LABEL_FONT, color: 'rgba(200,172,120,0.4)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Loading…</div>
          </div>
        )}

        {/* ── Verified Numbers — GATED ─────────────────────────────────────────── */}
        <div className="uppercase mb-3" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Verified Numbers · April 7, 2026
        </div>
        {!authLoading && !isAuthenticated ? (
          <GciLockedPlaceholder label="Verified Numbers · Internal Data" />
        ) : isAuthenticated ? (
          <>
            <div className="mb-3 px-4 py-2 border" style={{ background: 'rgba(27,42,74,0.03)', borderColor: 'rgba(200,172,120,0.5)', borderLeftWidth: 3 }}>
              <span style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                ★ INTERNAL ONLY · Growth trajectory labeled as MODEL — not a guarantee
              </span>
            </div>
            <div className="mb-10 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Closed Volume 2026', value: '$4,570,000', note: 'Verified actuals · Ed Bruehl solo · First 100 days', badge: 'Closed', badgeBg: '#2D5A3D', badgeColor: '#FAF8F4', valColor: '#2D5A3D' },
                { label: 'Active Pipeline', value: '$34,700,000', note: 'Named deals in active pipeline as of April 7, 2026', badge: 'Active', badgeBg: 'rgba(200,172,120,0.2)', badgeColor: '#C8AC78', valColor: '#C8AC78' },
                { label: 'Named Team Members', value: '9', note: 'On payroll or contracted as of April 7, 2026', badge: 'Verified', badgeBg: 'rgba(27,42,74,0.08)', badgeColor: '#1B2A4A', valColor: '#1B2A4A' },
                { label: 'Flambeaux Listing', value: '$6,500,000', note: 'Flambeaux · Active listing · Anchor deal for Q2 2026', badge: 'Active', badgeBg: 'rgba(200,172,120,0.2)', badgeColor: '#C8AC78', valColor: '#8a7a5a' },
                { label: '2026 Baseline Target', value: '$55,000,000', note: 'Full-year sales volume target · MODEL projection', badge: 'MODEL', badgeBg: 'rgba(27,42,74,0.06)', badgeColor: 'rgba(27,42,74,0.4)', valColor: 'rgba(27,42,74,0.4)' },
                { label: 'Growth Trajectory', value: '$430M by 2031', note: 'Ascension arc · Council-governed · MODEL projections only', badge: 'MODEL', badgeBg: 'rgba(27,42,74,0.06)', badgeColor: 'rgba(27,42,74,0.4)', valColor: 'rgba(27,42,74,0.3)' },
              ].map(item => (
                <div key={item.label} className="p-4 border" style={{ background: '#fff', borderColor: 'rgba(27,42,74,0.1)' }}>
                  <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ ...SERIF, color: item.valColor, fontWeight: 600, fontSize: '1.4rem', lineHeight: 1.1, marginBottom: 4 }}>{item.value}</div>
                  <div style={{ ...SANS, color: '#7a8a8e', fontSize: '0.72rem', lineHeight: 1.5, marginBottom: 6 }}>{item.note}</div>
                  <span className="inline-block px-2 py-0.5" style={{ ...LABEL_FONT, background: item.badgeBg, color: item.badgeColor, fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{item.badge}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* ── ANEW Homes Net Build Profit — GATED ─────────────────────────────── */}
        <div className="uppercase mb-3 mt-2" style={{ ...LABEL_FONT, color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          ANEW Homes · Net Build Profit
        </div>
        {!authLoading && !isAuthenticated ? (
          <GciLockedPlaceholder label="ANEW Homes · Internal Data" />
        ) : isAuthenticated ? (
          <>
            <div className="mb-3 px-4 py-2 border" style={{ background: 'rgba(200,172,120,0.06)', borderColor: 'rgba(200,172,120,0.5)', borderLeftWidth: 3 }}>
              <span style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                ★ INTERNAL ONLY — NOT FOR EXTERNAL DOCUMENTS
              </span>
              <div style={{ ...SANS, color: '#7a8a8e', fontSize: '0.72rem', marginTop: 4 }}>
                ANEW Homes — Morton steel-frame custom builds. Products: Ranch · Cottage · Legacy Land Play · ADU Garage Living Unit.
                ADU drives Year 1 income — construction management fees on client land, no land acquisition required.
                Net profit after ALL build costs. Separate from Christie's commission income entirely.
              </div>
            </div>
            <div className="mb-4 overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
                <thead>
                  <tr style={{ background: '#1B2A4A' }}>
                    {['Participant', 'Share', 'Year 1 Net ($50K pool)', 'Year 2 Net ($100K pool)', 'Notes'].map(h => (
                      <th key={h} style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 12px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ed Bruehl', share: '45%', y1: '$22,500', y2: '$45,000', note: 'Managing partner · ANEW Homes lead' },
                    { name: 'Scott Smith', share: '45%', y1: '$22,500', y2: '$45,000', note: 'Build operations partner · pending June 1' },
                    { name: 'Jarvis Slade', share: '5%', y1: '$2,500', y2: '$5,000', note: 'Advisory participant' },
                    { name: 'Angel Theodore', share: '5%', y1: '$2,500', y2: '$5,000', note: 'Advisory participant' },
                  ].map((row, i) => (
                    <tr key={row.name} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(27,42,74,0.03)', borderBottom: '1px solid rgba(27,42,74,0.08)' }}>
                      <td style={{ ...SERIF, color: '#1B2A4A', fontWeight: 600, fontSize: '0.85rem', padding: '8px 12px' }}>{row.name}</td>
                      <td style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 10, letterSpacing: '0.1em', padding: '8px 12px' }}>{row.share}</td>
                      <td style={{ ...SERIF, color: '#2D5A3D', fontWeight: 600, fontSize: '0.9rem', padding: '8px 12px' }}>{row.y1}</td>
                      <td style={{ ...SERIF, color: '#2D5A3D', fontWeight: 600, fontSize: '0.9rem', padding: '8px 12px' }}>{row.y2}</td>
                      <td style={{ ...SANS, color: '#7a8a8e', fontSize: '0.72rem', padding: '8px 12px' }}>{row.note}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'rgba(27,42,74,0.06)', borderTop: '2px solid rgba(27,42,74,0.15)' }}>
                    <td style={{ ...LABEL_FONT, color: '#1B2A4A', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 12px', fontWeight: 700 }}>TOTAL</td>
                    <td style={{ ...LABEL_FONT, color: '#1B2A4A', fontSize: 9, letterSpacing: '0.1em', padding: '8px 12px' }}>100%</td>
                    <td style={{ ...SERIF, color: '#1B2A4A', fontWeight: 700, fontSize: '0.9rem', padding: '8px 12px' }}>$50,000</td>
                    <td style={{ ...SERIF, color: '#1B2A4A', fontWeight: 700, fontSize: '0.9rem', padding: '8px 12px' }}>$100,000</td>
                    <td style={{ ...SANS, color: '#7a8a8e', fontSize: '0.72rem', padding: '8px 12px' }}>Net build profit after all costs</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mb-10 px-4 py-3 border" style={{ background: 'rgba(200,172,120,0.04)', borderColor: 'rgba(200,172,120,0.3)' }}>
              <div style={{ ...LABEL_FONT, color: '#C8AC78', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
                <strong style={{ color: '#1B2A4A' }}>Label:</strong> ANEW Homes — Net Build Profit · Separate from Christie's commission income.
              </div>
              <div style={{ ...SANS, color: '#7a8a8e', fontSize: '0.7rem', lineHeight: 1.6, marginTop: 2 }}>
                <strong style={{ color: '#1B2A4A' }}>*</strong> Governing principle — not yet formalized. All four participants aware and agreeable.
              </div>
            </div>
          </>
        ) : null}

        {/* ── Export + Sheet Link ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-4 pb-8">
          <button
            onClick={() => generateFutureReportPDF({ agents: agents.map(a => ({ ...a, act2027: 0 })), total, liveAct2026: total.act2026 })}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ ...LABEL_FONT, borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.18em', background: 'rgba(200,172,120,0.08)' }}
          >
            ↓ Export PDF · Ascension Arc
          </button>
          <ProFormaButton />
          <a
            href="https://docs.google.com/spreadsheets/d/1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ ...LABEL_FONT, borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.18em' }}
          >
            Open Growth Model v2
          </a>
        </div>

      </div>
    </div>
  );
}
