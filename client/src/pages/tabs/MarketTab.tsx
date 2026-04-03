/**
 * MARKET TAB — South Fork market intelligence dashboard.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels/badges)
 * Modules:
 *   - Hamptons Market Signal — ten-hamlet volume-share donut ring (Hamptons-native, no macro)
 *   - Rate Environment sidebar (mortgage corridor, Hamptons Median)
 *   - Ten hamlet tiles in tier order (Ultra-Trophy → Trophy → Premier → Opportunity)
 *   - Each tile: hamlet name, median price, Christie's Intelligence Score (CIS), tier badge, volume share bar
 *
 * DIRECTIVE: The core Hamptons market instrument must stay Hamptons-native.
 * Do NOT use VIX, S&P, or broad macro indicators inside this ring or its score.
 */

import { MatrixCard, StatusBadge } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA, TIER_ORDER, type HamletData, type HamletTier } from '@/data/hamlet-master';

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

// ─── Hamptons Market Signal Donut ─────────────────────────────────────────────
// Ten labeled segments, each proportional to hamlet volumeShare.
// Rendered as an SVG pie/donut — no external data dependency.

interface DonutSegment {
  hamlet: HamletData;
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

function HamletDonut() {
  const cx = 160;
  const cy = 160;
  const outerR = 130;
  const innerR = 78;
  const labelR = outerR + 22;
  const total = MASTER_HAMLET_DATA.reduce((s, h) => s + h.volumeShare, 0);

  // Build segments
  const segments: DonutSegment[] = [];
  let cursor = 0;
  for (const hamlet of MASTER_HAMLET_DATA) {
    const pct = hamlet.volumeShare / total;
    const span = pct * 360;
    const startAngle = cursor;
    const endAngle = cursor + span;
    const midAngle = cursor + span / 2;
    segments.push({ hamlet, startAngle, endAngle, midAngle, pct });
    cursor += span;
  }

  // Dominant hamlet by volume
  const dominant = [...MASTER_HAMLET_DATA].sort((a, b) => b.volumeShare - a.volumeShare)[0];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={320}
        height={320}
        viewBox="0 0 320 320"
        aria-label="Ten-hamlet volume share donut"
        style={{ overflow: 'visible' }}
      >
        {/* Segments */}
        {segments.map(seg => {
          const color = TIER_COLORS[seg.hamlet.tier];
          const gap = 1.2; // gap between segments in degrees
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

        {/* Center label */}
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

        {/* Segment labels — only for segments ≥ 6% to avoid overlap */}
        {segments.filter(s => s.pct >= 0.06).map(seg => {
          const pos = polarToXY(cx, cy, labelR, seg.midAngle);
          const anchor = pos.x < cx - 4 ? 'end' : pos.x > cx + 4 ? 'start' : 'middle';
          // Short hamlet label
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
                {seg.hamlet.volumeShare}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Dominant market note */}
      <div className="text-center" style={{ maxWidth: 260 }}>
        <span
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          Dominant corridor
        </span>
        <div
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.125rem', marginTop: 2 }}
        >
          {dominant.name} · {dominant.volumeShare}% of volume
        </div>
      </div>
    </div>
  );
}

// ─── Hamlet Tile ──────────────────────────────────────────────────────────────

function HamletTile({ hamlet }: { hamlet: HamletData }) {
  const badge = TIER_BADGE_COLORS[hamlet.tier];
  const maxVolume = Math.max(...MASTER_HAMLET_DATA.map(h => h.volumeShare));

  return (
    <MatrixCard
      variant={hamlet.tier === 'Ultra-Trophy' ? 'active' : 'default'}
      className="p-5 flex flex-col gap-3 cursor-pointer group hover:shadow-md transition-shadow"
    >
      {/* Tier badge + hamlet name */}
      <div className="flex items-start justify-between gap-2">
        <h3
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2 }}
        >
          {hamlet.name}
        </h3>
        <span
          className="shrink-0 px-2 py-0.5 text-[10px] uppercase tracking-wider"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', background: badge.bg, color: badge.text, letterSpacing: '0.12em' }}
        >
          CIS {hamlet.anewScore.toFixed(1)}
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
          {hamlet.medianPriceDisplay}
        </div>
      </div>

      {/* CIS — Christie's Intelligence Score */}
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
            {hamlet.anewScore.toFixed(1)}
            <span style={{ fontSize: '0.75rem', color: '#7a8a8e', marginLeft: 2 }}>/10</span>
          </div>
        </div>
        {/* CIS bar */}
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(27,42,74,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${hamlet.anewScore * 10}%`, background: '#C8AC78' }}
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
            Volume Share
          </span>
          <span
            style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.8125rem' }}
          >
            {hamlet.volumeShare}%
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(27,42,74,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(hamlet.volumeShare / maxVolume) * 100}%`, background: '#1B2A4A' }}
          />
        </div>
      </div>

      {/* Last notable sale */}
      <div
        className="text-xs pt-1 border-t"
        style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', borderColor: 'rgba(27,42,74,0.08)' }}
      >
        Last sale: <span style={{ color: '#384249' }}>{hamlet.lastSale} · {hamlet.lastSalePrice}</span>
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
          Freddie Mac weekly avg · March 2026
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
          All ten hamlets · trailing 12 months
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
  const tierGroups = TIER_ORDER.map(tier => ({
    tier,
    hamlets: MASTER_HAMLET_DATA.filter(h => h.tier === tier),
  }));

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── Hamptons Market Signal ─────────────────────────────────────────── */}
      <section className="px-6 py-10" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>

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
            Ten-Hamlet Volume Distribution · South Fork Territory
          </h2>

          <div className="flex justify-center">
            <HamletDonut />
          </div>
        </div>
      </section>

      {/* ── Hamlet Tiles by Tier ─────────────────────────────────────────── */}
      <section className="px-6 pb-14" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>

          <div
            className="uppercase mb-6"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Hamlet Intelligence Matrix
          </div>

          {tierGroups.map(({ tier, hamlets }) => (
            <div key={tier} className="mb-10">
              {/* Tier header */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="uppercase"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#1B2A4A', letterSpacing: '0.2em', fontSize: 12, fontWeight: 600 }}
                >
                  {tier}
                </div>
                <div style={{ flex: 1, height: 1, background: 'rgba(27,42,74,0.12)' }} />
                <StatusBadge variant={tier === 'Ultra-Trophy' ? 'active' : 'neutral'}>
                  {hamlets.length} hamlet{hamlets.length > 1 ? 's' : ''}
                </StatusBadge>
              </div>

              {/* Hamlet grid */}
              <div className={`grid gap-4 ${hamlets.length === 1 ? 'grid-cols-1 max-w-sm' : hamlets.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {hamlets.map(hamlet => (
                  <HamletTile key={hamlet.id} hamlet={hamlet} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Saunders section removed per Sprint 7 polish directive */}
      <section className="hidden" style={{ background: '#1B2A4A' }}>
        <div className="mx-auto py-10" style={{ maxWidth: 1100 }}>
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
            Saunders &amp; Associates · 2025 Annual Market Summary
          </h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              { label: 'Total Market Volume', value: '$6.797B', sub: 'All transactions 2025' },
              { label: 'Home Sales Volume',   value: '$5.922B', sub: 'Residential only' },
              { label: 'Median Sale Price',   value: '$2.01M',  sub: 'All property types' },
              { label: 'Sales Over $20M',     value: '29',      sub: 'Luxury tier transactions' },
              { label: 'Land Transactions',   value: '−36%',    sub: 'Year-over-year decline' },
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
            Source: Saunders &amp; Associates 2025 Annual Report · Data locked per canon · Q1 2026
          </div>
        </div>
      </section>

    </div>
  );
}
