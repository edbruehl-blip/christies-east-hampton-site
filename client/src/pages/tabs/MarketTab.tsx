/**
 * MARKET TAB — East End market intelligence dashboard.
 * Design: navy #1B2A4A · gold #947231 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels/badges)
 * Modules:
 *   - Hamptons Market Signal — ten-hamlet volume-share donut ring (Hamptons-native, no macro)
 *   - Rate Environment sidebar (mortgage corridor, Hamptons Median)
 *   - Ten hamlet tiles in tier order (Ultra-Trophy → Trophy → Premier → Opportunity)
 *   - Each tile: hamlet name, median price, tier badge, volume share bar
 *
 * DIRECTIVE: The core Hamptons market instrument must stay Hamptons-native.
 * Do NOT use VIX, S&P, or broad macro indicators inside this ring or its score.
 *
 * Sprint 11: Live overlay from Market Matrix Google Sheet via market.hamletMatrix tRPC procedure.
 * Falls back to static hamlet-master.ts values if sheet is unavailable.
 */

import { useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { MatrixCard } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA, TIER_ORDER, type HamletData, type HamletTier } from '@/data/hamlet-master';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

// ─── Tier color palette ───────────────────────────────────────────────────────

const TIER_COLORS: Record<HamletTier, string> = {
  'Ultra-Trophy': '#947231',   // gold
  'Trophy':       '#1B2A4A',   // navy
  'Premier':      '#384249',   // charcoal
  'Opportunity':  '#8a9ba8',   // slate
};

const TIER_BADGE_COLORS: Record<HamletTier, { bg: string; text: string }> = {
  'Ultra-Trophy': { bg: '#947231', text: '#1B2A4A' },
  'Trophy':       { bg: '#1B2A4A', text: '#FAF8F4' },
  'Premier':      { bg: '#384249', text: '#FAF8F4' },
  'Opportunity':  { bg: '#e8e4dc', text: '#384249' },
};

// ─── Live overlay types ───────────────────────────────────────────────────────

// LiveMatrixRow mirrors server/sheets-helper.ts MarketMatrixHamlet exactly
interface LiveMatrixRow {
  hamlet: string;
  median2025: string;
  dollarVolumeShare: string; // was: volumeShare (now string e.g. "7%")
  dollarVolume2025: string;  // was: dollarVolume
  sales2025: number;
  direction4Year: string;    // was: direction
  schoolDistrict: string;
  median2022: string;
  median2023: string;
  median2024: string;
}

// MergedHamlet extends static HamletData with live sheet values.
// isLive = true means the sheet row was found and values are current.
interface MergedHamlet extends HamletData {
  liveMedian: string;
  liveVolumeShare: number;
  liveDollarVolume: string;
  liveSales: number;
  liveDirection: string;
  isLive: boolean;
}

function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

function mergeHamletData(
  staticData: HamletData[],
  liveRows: LiveMatrixRow[] | undefined
): MergedHamlet[] {
  return staticData.map(h => {
    const match = liveRows?.find(r => normalizeName(r.hamlet) === normalizeName(h.name));
    return {
      ...h,
      liveMedian: match?.median2025 ?? h.medianPriceDisplay,
      liveVolumeShare: parseFloat(String(match?.dollarVolumeShare ?? h.volumeShare)) || h.volumeShare,
      liveDollarVolume: match?.dollarVolume2025 ?? '',
      liveSales: match?.sales2025 ?? 0,
      liveDirection: match?.direction4Year ?? '',
      isLive: !!match,
    };
  });
}

// ─── Hamptons Market Signal Donut ─────────────────────────────────────────────

interface DonutSegment {
  hamlet: MergedHamlet;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  pct: number;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildArcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number, innerR: number): string {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, endDeg);
  const iStart = polarToXY(cx, cy, innerR, endDeg);
  const iEnd = polarToXY(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`,
    `L ${iStart.x} ${iStart.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${iEnd.x} ${iEnd.y}`,
    'Z',
  ].join(' ');
}

function HamletDonut({ data }: { data: MergedHamlet[] }) {
  const cx = 160;
  const cy = 160;
  const outerR = 130;
  const innerR = 78;
  const labelR = outerR + 22;
  const total = data.reduce((s, h) => s + h.liveVolumeShare, 0);

  const segments: DonutSegment[] = [];
  let cursor = 0;
  for (const hamlet of data) {
    const pct = hamlet.liveVolumeShare / total;
    const span = pct * 360;
    const startAngle = cursor;
    const endAngle = cursor + span;
    const midAngle = cursor + span / 2;
    segments.push({ hamlet, startAngle, endAngle, midAngle, pct });
    cursor += span;
  }

  const dominant = [...data].sort((a, b) => b.liveVolumeShare - a.liveVolumeShare)[0];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={320}
        height={320}
        viewBox="0 0 320 320"
        aria-label="Ten-hamlet volume share donut"
        style={{ overflow: 'visible' }}
      >
        {segments.map(seg => {
          const color = TIER_COLORS[seg.hamlet.tier];
          const gap = 1.2;
          return (
            <path
              key={seg.hamlet.id}
              d={buildArcPath(cx, cy, outerR, seg.startAngle + gap / 2, seg.endAngle - gap / 2, innerR)}
              fill={color}
              opacity={0.92}
              style={{ transition: 'opacity 0.2s' }}
            />
          );
        })}

        <text
          x={cx}
          y={cy - 14}
          textAnchor="middle"
          fill="#1B2A4A"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}
        >
          HAMPTONS
        </text>
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="#1B2A4A"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em' }}
        >
          MARKET
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fill="#947231"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.16em' }}
        >
          SIGNAL
        </text>

        {segments.filter(s => s.pct >= 0.06).map(seg => {
          const pos = polarToXY(cx, cy, labelR, seg.midAngle);
          const anchor = pos.x < cx - 4 ? 'end' : pos.x > cx + 4 ? 'start' : 'middle';
          const shortName = seg.hamlet.name
            .replace('East Hampton Village', 'EH Village')
            .replace('Southampton Village', 'Southampton')
            .replace('East Hampton', 'E. Hampton');
          return (
            <g key={`label-${seg.hamlet.id}`}>
              <text
                x={pos.x}
                y={pos.y - 4}
                textAnchor={anchor}
                fill="#1B2A4A"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9.5, letterSpacing: '0.08em', fontWeight: 600 }}
              >
                {shortName.toUpperCase()}
              </text>
              <text
                x={pos.x}
                y={pos.y + 9}
                textAnchor={anchor}
                fill="#947231"
                style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: 9, fontWeight: 600 }}
              >
                {seg.hamlet.liveVolumeShare}%
              </text>
            </g>
          );
        })}
      </svg>

      <div className="text-center" style={{ maxWidth: 260 }}>
        <span
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          Dominant corridor
        </span>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.125rem', marginTop: 2 }}
        >
          {dominant?.name} &middot; {dominant?.liveVolumeShare}% of volume
        </div>
      </div>
    </div>
  );
}

// ─── Market Report PDF Button (D65 — html2canvas screenshot of live render) ────────────────────────────
// D65 ABSOLUTE: PDF = html2canvas screenshot of live page. No server Chrome. No parallel render paths.
function MarketReportPdfButton({ marketRef }: { marketRef: React.RefObject<HTMLDivElement | null> }) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    if (loading) return;
    setLoading(true);
    const toastId = toast.loading('Generating Market Report PDF…');
    try {
      const { captureToPdf } = await import('@/lib/capture-pdf');
      const el = marketRef.current ?? document.body;
      const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      await captureToPdf(el, `christies-east-hampton-market-${today}.pdf`);
      toast.success('Market Report PDF downloaded', { id: toastId });
    } catch (err: any) {
      console.error('Market Report PDF error:', err);
      toast.error(`PDF failed: ${err.message ?? 'Unknown error'}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        letterSpacing: '0.18em',
        fontSize: 11,
        textTransform: 'uppercase' as const,
        background: '#1B2A4A',
        color: '#947231',
        border: '1px solid rgba(200,172,120,0.3)',
        padding: '10px 24px',
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {loading ? 'Generating…' : 'DOWNLOAD MARKET PDF'}
    </button>
  );
}

// ─── Hamlet Tile ──────────────────────────────────────────────────────────────

function HamletTile({ hamlet }: { hamlet: MergedHamlet }) {
  const badge = TIER_BADGE_COLORS[hamlet.tier];
  const maxVolume = Math.max(...MASTER_HAMLET_DATA.map(h => h.volumeShare));
  const heroSrc = hamlet.imageUrl || hamlet.photo;

  return (
    <MatrixCard
      variant="active"
      className="flex flex-col cursor-pointer group hover:shadow-md transition-shadow overflow-hidden !p-0"
    >
      {heroSrc && (
        <div className="relative w-full overflow-hidden" style={{ height: 160 }}>
          <img
            src={heroSrc}
            alt={hamlet.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ display: 'block' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(27,42,74,0.72) 100%)' }}
          />
          {/* Tier badge removed per April 7 directive — clean photography only */}
        </div>
      )}

      <div className="p-5 flex flex-col gap-3">
        {/* Tier badge + hamlet name */}
        <div className="flex items-start justify-between gap-2">
          <h3
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.125rem', lineHeight: 1.2 }}
          >
            {hamlet.name}
          </h3>
        </div>

        {/* Median price */}
        <div>
          <div
            className="text-[10px] uppercase tracking-wider mb-0.5"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.14em' }}
          >
            Median Price
          </div>
          <div
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.375rem' }}
          >
            {hamlet.liveMedian}
          </div>
        </div>


        {/* Volume share bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', letterSpacing: '0.12em' }}
            >
              Share of Hamptons Dollar Volume
            </span>
            <span
              style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.7)', fontSize: '0.8125rem' }}
            >
              {hamlet.liveVolumeShare}%
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(27,42,74,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(hamlet.liveVolumeShare / maxVolume) * 100}%`, background: '#1B2A4A' }}
            />
          </div>
        </div>

        {/* Last notable sale */}
        {hamlet.lastSale && (
          <div
            className="text-xs pt-1 border-t"
            style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', borderColor: 'rgba(27,42,74,0.08)' }}
          >
            Last sale: <span style={{ color: 'rgba(250,248,244,0.7)' }}>{hamlet.lastSale} &middot; {hamlet.lastSalePrice}</span>
          </div>
        )}

        {/* Live indicator */}
        {hamlet.isLive && (
          <div
            className="text-[9px] pt-1 border-t flex items-center gap-1"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(27,42,74,0.35)', borderColor: 'rgba(27,42,74,0.06)', letterSpacing: '0.04em', lineHeight: 1.4 }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#947231', display: 'inline-block', flexShrink: 0 }} />
            Live &middot; Market Matrix
          </div>
        )}

        {/* Per-card source attribution removed per April 7 directive — single citation at matrix footer only */}

        {/* B4: View Full Report CTA */}
        <Link
          href={`/report?hamlet=${hamlet.id}`}
          className="block mt-1 pt-2 border-t text-center"
          style={{
            borderColor: 'rgba(27,42,74,0.08)',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#947231',
            textDecoration: 'none',
          }}
        >
          View Full Report
        </Link>
      </div>
    </MatrixCard>
  );
}

// ─── Rate Environment sidebar ─────────────────────────────────────────────────

function RateEnvironment({ liveMortgageRate, mortgageDate, treasuryRate, treasuryChange }: {
  liveMortgageRate: string;
  mortgageDate: string;
  treasuryRate: string;
  treasuryChange: number | null;
}) {
  // Format FRED observation date ("2025-03-27") → "March 27, 2025"
  const formattedDate = (() => {
    if (!mortgageDate) return 'Freddie Mac PMMS';
    try {
      const [year, month, day] = mortgageDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return `Freddie Mac · ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    } catch {
      return 'Freddie Mac PMMS';
    }
  })();

  return (
    <div className="flex flex-col gap-4">
      {/* Mortgage corridor */}
      <div
        className="p-5 border"
        style={{ borderColor: 'rgba(200,172,120,0.2)', background: 'rgba(13,27,42,0.7)' }}
      >
        <div
          className="uppercase mb-2"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 10, letterSpacing: '0.18em' }}
        >
          30Y Mortgage Corridor
        </div>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}
        >
          {liveMortgageRate}
        </div>
        <div
          className="mt-1"
          style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}
        >
          {formattedDate}
        </div>
      </div>

      {/* Hamptons Median */}
      <div
        className="p-5 border"
        style={{ borderColor: 'rgba(200,172,120,0.2)', background: 'rgba(13,27,42,0.7)' }}
      >
        <div
          className="uppercase mb-2"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 10, letterSpacing: '0.18em' }}
        >
          Hamptons Median
        </div>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}
        >
          $2.34M
        </div>
        <div
          className="mt-1"
          style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}
        >
            All ten hamlets &middot; trailing 12 months
        </div>
      </div>

      {/* 10-Year Treasury */}
      <div
        className="p-5 border"
        style={{ borderColor: 'rgba(200,172,120,0.2)', background: 'rgba(13,27,42,0.7)' }}
      >
        <div
          className="uppercase mb-2"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 10, letterSpacing: '0.18em' }}
        >
          10-Year Treasury
        </div>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}
        >
          {treasuryRate}
        </div>
        {treasuryChange !== null && (
          <div
            className="mt-1"
            style={{ fontFamily: '"Source Sans 3", sans-serif', color: treasuryChange >= 0 ? '#c0392b' : '#27ae60', fontSize: '0.75rem' }}
          >
            {treasuryChange >= 0 ? '+' : ''}{treasuryChange.toFixed(2)}% today
          </div>
        )}
        <div
          className="mt-1"
          style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}
        >
          ^TNX · Yahoo Finance
        </div>
      </div>

      {/* Last Significant Sale Spotlight — KILLED V2 Apr 18 2026
           Per-hamlet last sale data already on each hamlet tile card.
           Standalone Sagaponack block was redundant. M3 Thursday will wire live data per hamlet.
           Do not restore this block — data redistributes naturally to hamlet tiles. */}

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketTab() {
  const marketRef = useRef<HTMLDivElement>(null);
  const { data: mortgageData } = trpc.market.mortgageRate.useQuery(undefined, {
    staleTime: 24 * 60 * 60 * 1000, // 24h — matches FRED cache
    retry: false,
  });
  const liveMortgageRate = mortgageData?.rate ?? '6.38%';
  const mortgageDate = mortgageData?.date ?? '';

  // SD7 Item Two: 10-Year Treasury live rate
  const { data: treasuryData } = trpc.market.treasuryRate.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 min cache
    retry: false,
  });
  const liveTreasuryRate = treasuryData?.rate ?? '4.51%';
  const liveTreasuryChange = treasuryData?.change ?? null;

  const { data: matrixResponse, isLoading: matrixLoading } = trpc.market.hamletMatrix.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000,
    // Sprint 16: auto-refresh every 5 minutes so sheet updates are visible without a page reload
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: false, // only refetch when tab is active
  });

  // matrixResponse is { hamlets: LiveMatrixRow[], error: string | null }
  // Extract the hamlets array before passing to mergeHamletData
  const matrixRows = matrixResponse?.hamlets;

  const mergedData = useMemo(() => {
    // D2 Apr 24 2026: east-hampton-north filtered at render boundary (ten canonical hamlets)
    const merged = mergeHamletData(MASTER_HAMLET_DATA, matrixRows)
      .filter(h => h.id !== 'east-hampton-north');
    return [...merged].sort((a, b) => b.medianPrice - a.medianPrice);
  }, [matrixRows]);

  const tierGroups = TIER_ORDER.map(tier => ({
    tier,
    hamlets: mergedData.filter(h => h.tier === tier),
  }));

  return (
    <div ref={marketRef} className="min-h-screen" style={{ background: 'transparent' }}>


      {/* ── Market Signal Hero Row: Donut + Rate Environment (two-column) ──────────────────── */}
      <section className="px-6 py-10" style={{ background: 'transparent' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '24px 28px' }}>

          <div
            className="uppercase mb-2"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Hamptons Market Signal
          </div>
          <h2
            className="mb-8"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', lineHeight: 1.25 }}
          >
            Ten-Hamlet Volume Distribution &middot; Hamptons Territory
          </h2>

          {/* Two-column hero: donut left, rate environment right — stacks on mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'start' }}
            className="market-hero-grid"
          >
            <div className="flex justify-center">
              <HamletDonut data={mergedData} />
            </div>
            <div>
              <div
                className="uppercase mb-4"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 11 }}
              >
                Rate Environment
              </div>
              <RateEnvironment
                liveMortgageRate={liveMortgageRate}
                mortgageDate={mortgageDate}
                treasuryRate={liveTreasuryRate}
                treasuryChange={liveTreasuryChange}
              />
            </div>
          </div>

          {/* Market Report PDF button — D65: html2canvas screenshot of live /market render. */}
          <MarketReportPdfButton marketRef={marketRef} />
          </div>{/* /mount frame */}
        </div>
      </section>

      {/* ── Hamlet Tiles by Tier ──────────────────────────────────────────── */}
      <section className="px-6 pb-14" style={{ background: 'transparent' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '24px 28px' }}>

          <div className="flex items-center justify-between mb-6">
            <div
              className="uppercase"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 11 }}
            >
              Hamlet Intelligence Matrix
            </div>
            {matrixLoading && (
              <div
                style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}
              >
                Loading live data&hellip;
              </div>
            )}
            {!matrixLoading && matrixRows && (
              <div className="flex items-center gap-1.5">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#947231', display: 'inline-block' }} />
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}>
                  Live &middot; Market Matrix
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {mergedData.map(hamlet => (
              <HamletTile key={hamlet.id} hamlet={hamlet} />
            ))}
          </div>

          {/* Single source attribution — bottom of matrix only (April 7 directive) */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(27,42,74,0.08)' }}>
            <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#9aabb0', fontSize: '0.7rem', letterSpacing: '0.04em', lineHeight: 1.6 }}>
              Sources: Verified market intelligence · Christie's East Hampton internal analysis · The Real Deal · Behind The Hedges · MLS-backed public records.
              Dollar volume figures represent closed residential transactions, East End, Jan–Dec 2025. Last sale data: verified, representative, no outliers per institutional methodology.
            </p>
          </div>
          </div>{/* /mount frame */}
        </div>
      </section>

      {/* Rate Environment moved to hero row above hamlet tiles — April 16 2026 */}
      {/* P1 — Request Territory Briefing CTA removed per Apr 22 directive */}


    </div>
  );
}
