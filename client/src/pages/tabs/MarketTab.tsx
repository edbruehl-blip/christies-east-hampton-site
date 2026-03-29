/**
 * MARKET TAB — South Fork market intelligence dashboard.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels/badges)
 * Modules:
 *   - Market ticker bar (S&P, DJIA, VIX, 10Y Treasury)
 *   - Capital Flow Signal (CFS) donut ring with score and label
 *   - Nine hamlet tiles in tier order (Ultra-Trophy → Trophy → Premier → Opportunity)
 *   - Each tile: hamlet name, median price, ANEW score, tier badge, volume share bar
 */

import { useEffect, useState } from 'react';
import { MatrixCard, StatusBadge } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA, TIER_ORDER, type HamletData, type HamletTier } from '@/data/hamlet-master';

// ─── Ticker Types ─────────────────────────────────────────────────────────────

interface TickerData {
  sp500: number;
  sp500Change: number;
  djia: number;
  djiaChange: number;
  vix: number;
  treasury10y: number;
  loaded: boolean;
}

// ─── Capital Flow Signal ──────────────────────────────────────────────────────

interface CFSResult {
  score: number;
  label: string;
  color: string;
  description: string;
}

function calcCFS(ticker: TickerData): CFSResult {
  if (!ticker.loaded) return { score: 0, label: 'Loading', color: '#C8AC78', description: '' };

  // Equity signal: S&P change drives 0–40 pts
  const equitySignal = Math.max(0, Math.min(40, 20 + ticker.sp500Change * 10));

  // VIX signal: VIX < 20 = 30 pts, 20–30 = 15 pts, > 30 = 0 pts
  const vixSignal = ticker.vix < 20 ? 30 : ticker.vix < 30 ? 15 : 0;

  // Rate signal: 10Y < 4.5% = 30 pts, 4.5–5% = 15 pts, > 5% = 0 pts
  const rateSignal = ticker.treasury10y < 4.5 ? 30 : ticker.treasury10y < 5.0 ? 15 : 0;

  const score = Math.round(equitySignal + vixSignal + rateSignal);

  if (score >= 75) return { score, label: 'Strong Inflow', color: '#2d6a4f', description: 'Equity markets stable, volatility contained, rates favorable. Buyer confidence elevated.' };
  if (score >= 55) return { score, label: 'Moderate Inflow', color: '#C8AC78', description: 'Mixed signals. Selective buyers active. Institutional quality assets moving.' };
  if (score >= 35) return { score, label: 'Cautious', color: '#e07b39', description: 'Volatility elevated. Buyers requiring price concessions. DOM extending.' };
  return { score, label: 'Defensive', color: '#c0392b', description: 'Market stress. Luxury segment insulated but sentiment weak. Hold positions.' };
}

// ─── Donut Ring SVG ───────────────────────────────────────────────────────────

function DonutRing({ score, color }: { score: number; color: string }) {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

  return (
    <svg width={140} height={140} viewBox="0 0 140 140" aria-hidden="true">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(27,42,74,0.12)" strokeWidth={10} />
      {/* Progress */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      {/* Score label */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill="#1B2A4A"
        style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 600 }}
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fill="#384249"
        style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.1em' }}
      >
        / 100
      </text>
    </svg>
  );
}

// ─── Hamlet Tile ──────────────────────────────────────────────────────────────

const TIER_BADGE_COLORS: Record<HamletTier, { bg: string; text: string }> = {
  'Ultra-Trophy': { bg: '#C8AC78', text: '#1B2A4A' },
  'Trophy':       { bg: '#1B2A4A', text: '#FAF8F4' },
  'Premier':      { bg: '#384249', text: '#FAF8F4' },
  'Opportunity':  { bg: '#e8e4dc', text: '#384249' },
};

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
          {hamlet.tier}
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

      {/* ANEW score */}
      <div className="flex items-center gap-3">
        <div>
          <div
            className="text-[10px] uppercase tracking-wider mb-0.5"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em' }}
          >
            ANEW Score
          </div>
          <div
            style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontWeight: 600, fontSize: '1.125rem' }}
          >
            {hamlet.anewScore.toFixed(1)}
            <span style={{ fontSize: '0.75rem', color: '#7a8a8e', marginLeft: 2 }}>/10</span>
          </div>
        </div>
        {/* ANEW score bar */}
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketTab() {
  const [ticker, setTicker] = useState<TickerData>({
    sp500: 6368.85,
    sp500Change: -1.67,
    djia: 45166.64,
    djiaChange: -1.73,
    vix: 31.05,
    treasury10y: 4.44,
    loaded: true,
  });

  const cfs = calcCFS(ticker);

  // Attempt live fetch — falls back to hardcoded March 27 close if unavailable
  useEffect(() => {
    // Live market data fetch would go here via a backend proxy
    // For now, hardcoded to March 27, 2026 close (last known values)
  }, []);

  const tierGroups = TIER_ORDER.map(tier => ({
    tier,
    hamlets: MASTER_HAMLET_DATA.filter(h => h.tier === tier),
  }));

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── Market Ticker Bar ─────────────────────────────────────────────── */}
      <div
        className="w-full px-6 py-3 flex flex-wrap items-center gap-6 overflow-x-auto"
        style={{ background: '#1B2A4A', borderBottom: '2px solid #C8AC78' }}
      >
        {[
          { label: 'S&P 500', value: ticker.sp500.toLocaleString('en-US', { minimumFractionDigits: 2 }), change: ticker.sp500Change },
          { label: 'DJIA', value: ticker.djia.toLocaleString('en-US', { minimumFractionDigits: 2 }), change: ticker.djiaChange },
          { label: 'VIX', value: ticker.vix.toFixed(2), change: null },
          { label: '10Y Treasury', value: `${ticker.treasury10y.toFixed(2)}%`, change: null },
        ].map(item => (
          <div key={item.label} className="flex items-baseline gap-2 shrink-0">
            <span
              className="uppercase"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.16em' }}
            >
              {item.label}
            </span>
            <span
              style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontWeight: 600, fontSize: '0.9375rem' }}
            >
              {item.value}
            </span>
            {item.change !== null && (
              <span
                style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  fontSize: '0.8125rem',
                  color: item.change >= 0 ? '#4ade80' : '#f87171',
                }}
              >
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            )}
          </div>
        ))}
        <div
          className="ml-auto shrink-0 text-[10px] uppercase"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(250,248,244,0.4)', letterSpacing: '0.12em' }}
        >
          As of March 27, 2026 close
        </div>
      </div>

      {/* ── Capital Flow Signal ───────────────────────────────────────────── */}
      <section className="px-6 py-10" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div
            className="uppercase mb-6"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Capital Flow Signal
          </div>

          <MatrixCard variant="navy" className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Donut */}
              <div className="shrink-0">
                <DonutRing score={cfs.score} color={cfs.color} />
              </div>

              {/* Signal text */}
              <div className="flex-1">
                <div
                  className="mb-2"
                  style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.2 }}
                >
                  {cfs.label}
                </div>
                <div
                  className="mb-6 leading-relaxed"
                  style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.75)', fontSize: '0.9375rem' }}
                >
                  {cfs.description}
                </div>

                {/* Signal components */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Equity Signal', value: `S&P ${ticker.sp500Change >= 0 ? '+' : ''}${ticker.sp500Change.toFixed(2)}%`, ok: ticker.sp500Change >= 0 },
                    { label: 'Volatility', value: `VIX ${ticker.vix.toFixed(2)}`, ok: ticker.vix < 25 },
                    { label: 'Rate Environment', value: `10Y ${ticker.treasury10y.toFixed(2)}%`, ok: ticker.treasury10y < 4.75 },
                  ].map(sig => (
                    <div key={sig.label} className="flex flex-col gap-1">
                      <span
                        className="uppercase"
                        style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.7)', fontSize: 10, letterSpacing: '0.14em' }}
                      >
                        {sig.label}
                      </span>
                      <span
                        style={{ fontFamily: '"Source Sans 3", sans-serif', color: sig.ok ? '#4ade80' : '#f87171', fontWeight: 600, fontSize: '0.9375rem' }}
                      >
                        {sig.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mortgage corridor */}
              <div
                className="shrink-0 text-center p-5 border"
                style={{ borderColor: 'rgba(200,172,120,0.3)', minWidth: 160 }}
              >
                <div
                  className="uppercase mb-2"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.16em' }}
                >
                  Mortgage Corridor
                </div>
                <div
                  style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.5rem' }}
                >
                  6.5 – 7.0%
                </div>
                <div
                  className="mt-1"
                  style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: '0.75rem' }}
                >
                  30-yr fixed estimate
                </div>
              </div>
            </div>
          </MatrixCard>
        </div>
      </section>

      {/* ── Hamlet Tiles by Tier ─────────────────────────────────────────── */}
      <section className="px-6 pb-14" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
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

    </div>
  );
}
