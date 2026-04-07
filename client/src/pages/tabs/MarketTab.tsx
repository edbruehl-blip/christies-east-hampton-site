/**
 * MARKET TAB — South Fork market intelligence dashboard.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels/badges)
 * Modules:
 *   - Hamptons Market Signal — eleven-hamlet volume-share donut ring (Hamptons-native, no macro)
 *   - Rate Environment sidebar (mortgage corridor, Hamptons Median)
 *   - Eleven hamlet tiles in tier order (Ultra-Trophy → Trophy → Premier → Opportunity)
 *   - Each tile: hamlet name, median price, Christie's Intelligence Score (CIS), tier badge, volume share bar
 *
 * DIRECTIVE: The core Hamptons market instrument must stay Hamptons-native.
 * Do NOT use VIX, S&P, or broad macro indicators inside this ring or its score.
 *
 * Sprint 11: Live overlay from Market Matrix Google Sheet via market.hamletMatrix tRPC procedure.
 * Falls back to static hamlet-master.ts values if sheet is unavailable.
 */

import { useMemo } from 'react';
import { MatrixCard } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA, TIER_ORDER, type HamletData, type HamletTier } from '@/data/hamlet-master';
import { trpc } from '@/lib/trpc';

// ─── Tier color palette ───────────────────────────────────────────────────────

const TIER_COLORS: Record<HamletTier, string> = {
  'Ultra-Trophy': '#C8AC78',   // gold
  'Trophy':       '#1B2A4A',   // navy
  'Premier':      '#384249',   // charcoal
  'Opportunity':  '#8a9ba8',   // slate
};

const TIER_BADGE_COLORS: Record<HamletTier, { bg: string; text: string }> = {
  'Ultra-Trophy': { bg: '#C8AC78', text: '#1B2A4A' },
  'Trophy':       { bg: '#1B2A4A', text: '#FAF8F4' },
  'Premier':      { bg: '#384249', text: '#FAF8F4' },
  'Opportunity':  { bg: '#e8e4dc', text: '#384249' },
};

// ─── Live overlay types ───────────────────────────────────────────────────────

interface LiveMatrixRow {
  hamlet: string;
  cis: number;
  median2025: string;
  volumeShare: number;
  dollarVolume: string;
  sales2025: number;
  direction: string;
}

// MergedHamlet extends static HamletData with live sheet values.
// isLive = true means the sheet row was found and values are current.
interface MergedHamlet extends HamletData {
  liveMedian: string;
  liveCis: number;
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
      liveCis: (match as any)?.cisScore ?? (match as any)?.cis ?? h.anewScore,
      liveVolumeShare: parseFloat(String((match as any)?.dollarVolumeShare ?? (match as any)?.volumeShare ?? h.volumeShare)) || h.volumeShare,
      liveDollarVolume: match?.dollarVolume ?? '',
      liveSales: match?.sales2025 ?? 0,
      liveDirection: match?.direction ?? '',
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
        aria-label="Eleven-hamlet volume share donut"
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
          fill="#C8AC78"
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
                fill="#C8AC78"
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
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          Dominant corridor
        </span>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.125rem', marginTop: 2 }}
        >
          {dominant?.name} &middot; {dominant?.liveVolumeShare}% of volume
        </div>
      </div>
    </div>
  );
}

// ─── Hamlet Tile ──────────────────────────────────────────────────────────────

function HamletTile({ hamlet }: { hamlet: MergedHamlet }) {
  const badge = TIER_BADGE_COLORS[hamlet.tier];
  const maxVolume = Math.max(...MASTER_HAMLET_DATA.map(h => h.volumeShare));
  const heroSrc = hamlet.imageUrl || hamlet.photo;

  return (
    <MatrixCard
      variant={hamlet.tier === 'Ultra-Trophy' ? 'active' : 'default'}
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
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2 }}
          >
            {hamlet.name}
          </h3>
          <span
            className="shrink-0 px-2 py-0.5 text-[10px] uppercase tracking-wider"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#C8AC78', letterSpacing: '0.12em' }}
          >
            CIS {hamlet.liveCis.toFixed(1)}
          </span>
        </div>

        {/* Median price */}
        <div>
          <div
            className="text-[10px] uppercase tracking-wider mb-0.5"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em' }}
          >
            Median Price
          </div>
          <div
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.375rem' }}
          >
            {hamlet.liveMedian}
          </div>
        </div>

        {/* CIS bar */}
        <div className="flex items-center gap-3">
          <div>
            <div
              className="text-[10px] uppercase tracking-wider mb-0.5"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em' }}
            >
              CIS
            </div>
            <div
              style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontWeight: 600, fontSize: '1.125rem' }}
            >
              {hamlet.liveCis.toFixed(1)}
              <span style={{ fontSize: '0.75rem', color: '#7a8a8e', marginLeft: 2 }}>/10</span>
            </div>
          </div>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(27,42,74,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${hamlet.liveCis * 10}%`, background: '#C8AC78' }}
            />
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
              style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.8125rem' }}
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
            Last sale: <span style={{ color: '#384249' }}>{hamlet.lastSale} &middot; {hamlet.lastSalePrice}</span>
          </div>
        )}

        {/* Live indicator */}
        {hamlet.isLive && (
          <div
            className="text-[9px] pt-1 border-t flex items-center gap-1"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(27,42,74,0.35)', borderColor: 'rgba(27,42,74,0.06)', letterSpacing: '0.04em', lineHeight: 1.4 }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4caf50', display: 'inline-block', flexShrink: 0 }} />
            Live &middot; Market Matrix
          </div>
        )}

        {/* Per-card source attribution removed per April 7 directive — single citation at matrix footer only */}
      </div>
    </MatrixCard>
  );
}

// ─── Rate Environment sidebar ─────────────────────────────────────────────────

function RateEnvironment() {
  return (
    <div className="flex flex-col gap-4">
      {/* Mortgage corridor */}
      <div
        className="p-5 border"
        style={{ borderColor: 'rgba(27,42,74,0.15)', background: '#fff' }}
      >
        <div
          className="uppercase mb-2"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em' }}
        >
          30Y Mortgage Corridor
        </div>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.75rem' }}
        >
          6.38%
        </div>
        <div
          className="mt-1"
          style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}
        >
          Freddie Mac weekly avg &middot; March 2026
        </div>
      </div>

      {/* Hamptons Median */}
      <div
        className="p-5 border"
        style={{ borderColor: 'rgba(27,42,74,0.15)', background: '#fff' }}
      >
        <div
          className="uppercase mb-2"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em' }}
        >
          Hamptons Median
        </div>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.75rem' }}
        >
          $2.34M
        </div>
        <div
          className="mt-1"
          style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}
        >
          All eleven hamlets &middot; trailing 12 months
        </div>
      </div>

      {/* Tier legend */}
      <div
        className="p-5 border"
        style={{ borderColor: 'rgba(27,42,74,0.15)', background: '#fff' }}
      >
        <div
          className="uppercase mb-3"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em' }}
        >
          Tier Legend
        </div>
        <div className="flex flex-col gap-2">
          {(Object.entries(TIER_COLORS) as [HamletTier, string][]).map(([tier, color]) => (
            <div key={tier} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ background: color }}
              />
              <span
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#384249', fontSize: 11, letterSpacing: '0.08em' }}
              >
                {tier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketTab() {
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

  const mergedData = useMemo(
    () => mergeHamletData(MASTER_HAMLET_DATA, matrixRows),
    [matrixRows]
  );

  const tierGroups = TIER_ORDER.map(tier => ({
    tier,
    hamlets: mergedData.filter(h => h.tier === tier),
  }));

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── Hamptons Market Signal ─────────────────────────────────────────── */}
      <section className="px-6 py-10" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>

          <div
            className="uppercase mb-2"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Hamptons Market Signal
          </div>
          <h2
            className="mb-8"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 400, fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', lineHeight: 1.25 }}
          >
            Eleven-Hamlet Volume Distribution &middot; South Fork Territory
          </h2>

          <div className="flex justify-center">
            <HamletDonut data={mergedData} />
          </div>
        </div>
      </section>

      {/* ── Hamlet Tiles by Tier ─────────────────────────────────────────── */}
      <section className="px-6 pb-14" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>

          <div className="flex items-center justify-between mb-6">
            <div
              className="uppercase"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
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
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem' }}>
                  Live &middot; Market Matrix
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {mergedData.map(hamlet => (
              <HamletTile key={hamlet.id} hamlet={hamlet} />
            ))}
          </div>
        </div>
      </section>

      {/* P1 — Request Territory Briefing CTA */}
      <section className="px-6 pb-14 pt-2" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <div
            style={{
              background: '#1B2A4A',
              border: '1px solid rgba(200,172,120,0.2)',
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              textAlign: 'center' as const,
              gap: 16,
            }}
          >
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase' as const }}>
              Private Advisory
            </div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.3 }}>
              Request a Private Territory Briefing
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.55)', fontSize: '0.875rem', maxWidth: 480, lineHeight: 1.6 }}>
              Receive a bespoke intelligence brief on any hamlet, property, or market segment &mdash; prepared by Ed Bruehl, Managing Director, Christie&apos;s East Hampton.
            </div>
            <a
              href={`https://wa.me/16467521233?text=${encodeURIComponent("Hi Ed \u2014 I'd like to request a Private Territory Briefing for the East Hampton market. Please let me know what information you need.")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: '#fff',
                background: '#25D366',
                padding: '12px 28px',
                textDecoration: 'none',
                marginTop: 4,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Request Territory Briefing &middot; 646-752-1233
            </a>
          </div>
        </div>
      </section>

      {/* Saunders section removed per Sprint 7 polish directive */}
      <section className="hidden" style={{ background: '#1B2A4A' }}>
        <div className="mx-auto py-10" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <div
            className="uppercase mb-2"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Competitive Intelligence
          </div>
          <h2
            className="mb-8"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', lineHeight: 1.25 }}
          >
            Saunders &amp; Associates &middot; 2025 Annual Market Summary
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              { label: 'Total Market Volume', value: '$6.797B', sub: 'All transactions 2025' },
              { label: 'Home Sales Volume',   value: '$5.922B', sub: 'Residential only' },
              { label: 'Median Sale Price',   value: '$2.01M',  sub: 'All property types' },
              { label: 'Sales Over $20M',     value: '29',      sub: 'Luxury tier transactions' },
              { label: 'Land Transactions',   value: '\u221236%', sub: 'Year-over-year decline' },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(250,248,244,0.05)',
                  border: '1px solid rgba(200,172,120,0.2)',
                  padding: '20px 18px',
                }}
              >
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.65)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1.75rem', fontWeight: 400, lineHeight: 1.1, marginBottom: 6 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.45)', fontSize: '0.75rem' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.35)', fontSize: '0.75rem' }}>
            Source: Saunders &amp; Associates 2025 Annual Report &middot; Data locked per canon &middot; Q1 2026
          </div>
        </div>
      </section>

    </div>
  );
}
