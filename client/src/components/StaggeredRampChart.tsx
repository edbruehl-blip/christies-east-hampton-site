/**
 * StaggeredRampChart — FUTURE Tab · Staggered Office Ramp · Per-Seat GCI by Cohort
 *
 * Council dispatch: April 16, 2026 · D48 · Paste-not-reference
 * Placement: between Headcount Scaling table and base engine footnote
 *
 * Data: zero new files — same seat-fill logic as headcount table
 * Y-axis: Producer Seats (0–12)
 * X-axis: 2026–2036 (11 year-groups, up to 3 bars each: EH / SH / WH)
 * Each bar segmented by cohort: Y1 (dim) / Y2 (mid) / Y3+ (full saturation)
 * Bar-top label: weighted avg GCI per seat
 */

import React, { useMemo } from 'react';

// ── Color tokens (dark-mode palette, no light-mode leakage) ──────────────────
const EH_Y3  = '#c8ac78'; // gold full
const EH_Y2  = '#92805c'; // gold mid
const EH_Y1  = '#5c5240'; // gold dim
const SH_Y3  = '#6b92b8'; // steel blue full
const SH_Y2  = '#537090'; // steel blue mid
const SH_Y1  = '#3a4f68'; // steel blue dim
const WH_Y3  = '#7aaa7a'; // sage green full
const WH_Y2  = '#5a825a'; // sage green mid
const WH_Y1  = '#3a5a3a'; // sage green dim

const BG      = '#0a1628';
const GRID    = '#1e2d4a';
const AXIS    = '#8a8a8a';
const LABEL   = '#e8e4dc';
const GOLD    = '#c8ac78';

// ── Seat-fill logic (mirrors headcount table) ────────────────────────────────
// Returns { y1, y2, y3plus } seat counts for an office in a given year
function getSeatCohorts(openYear: number, calcYear: number, rampSeats: number, maxSeats: number) {
  if (calcYear < openYear) return { y1: 0, y2: 0, y3plus: 0, total: 0 };
  const offset = calcYear - openYear; // 0 = Y1, 1 = Y2, etc.

  if (offset === 0) {
    return { y1: rampSeats, y2: 0, y3plus: 0, total: rampSeats };
  }
  if (offset === 1) {
    // Original cohort now Y2, new seats at Y1
    return { y1: maxSeats - rampSeats, y2: rampSeats, y3plus: 0, total: maxSeats };
  }
  // offset >= 2: all seats filled, original cohort Y3+, new cohort Y3+ (both mature)
  // All seats are Y3+ from offset 2 onward
  return { y1: 0, y2: 0, y3plus: maxSeats, total: maxSeats };
}

// ── Weighted avg GCI per seat ────────────────────────────────────────────────
function avgGci(y1: number, y2: number, y3plus: number, yearOffset: number): number {
  const total = y1 + y2 + y3plus;
  if (total === 0) return 0;
  // Y3+ GCI = $1M × 1.02^(yearOffset-2) for yearOffset >= 2
  const y3gci = yearOffset >= 2 ? 1_000_000 * Math.pow(1.02, Math.max(0, yearOffset - 2)) : 1_000_000;
  return (y1 * 500_000 + y2 * 750_000 + y3plus * y3gci) / total;
}

function fmtGci(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v >= 1_050_000 ? 2 : 0)}M`;
  return `$${Math.round(v / 1000)}K`;
}

// ── Chart constants ───────────────────────────────────────────────────────────
const YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036];
const MAX_SEATS = 12;
const BAR_W = 14;       // px per bar
const GROUP_GAP = 8;    // px between year-groups
const BAR_GAP = 2;      // px between bars within a group
const CHART_H = 140;    // px chart area height
const AXIS_H = 20;      // px for x-axis labels
const LABEL_H = 16;     // px above bars for GCI labels
const LEFT_W = 28;      // px for y-axis labels
const GRID_LINES = [0, 3, 6, 9, 12];

// ── Office definitions ────────────────────────────────────────────────────────
const OFFICES = [
  { key: 'eh', label: 'EH', open: 2026, ramp: 9,  max: 12, y3: EH_Y3, y2: EH_Y2, y1: EH_Y1 },
  { key: 'sh', label: 'SH', open: 2028, ramp: 6,  max: 12, y3: SH_Y3, y2: SH_Y2, y1: SH_Y1 },
  { key: 'wh', label: 'WH', open: 2030, ramp: 6,  max: 12, y3: WH_Y3, y2: WH_Y2, y1: WH_Y1 },
] as const;

export function StaggeredRampChart() {
  const data = useMemo(() => {
    return YEARS.map(yr => ({
      year: yr,
      offices: OFFICES.map(o => {
        const offset = yr - o.open;
        const cohorts = getSeatCohorts(o.open, yr, o.ramp, o.max);
        const avg = avgGci(cohorts.y1, cohorts.y2, cohorts.y3plus, offset);
        return { ...o, ...cohorts, avgGci: avg, offset, y2color: o.y2, y1color: o.y1 };
      }),
    }));
  }, []);

  // Compute SVG width
  const barsPerGroup = OFFICES.length; // max 3
  const groupW = barsPerGroup * BAR_W + (barsPerGroup - 1) * BAR_GAP;
  const totalW = LEFT_W + YEARS.length * (groupW + GROUP_GAP) - GROUP_GAP + 4;
  const totalH = LABEL_H + CHART_H + AXIS_H;

  const pxPerSeat = CHART_H / MAX_SEATS;

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Section header */}
      <div style={{
        fontFamily: "'Source Sans 3', 'Barlow Condensed', sans-serif",
        fontSize: 7,
        color: LABEL,
        letterSpacing: 1.5,
        textTransform: 'uppercase' as const,
        fontWeight: 600,
        marginBottom: 6,
      }}>
        Staggered Office Ramp &middot; Per-Seat GCI by Cohort
      </div>

      {/* SVG chart */}
      <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <svg
          width={totalW}
          height={totalH}
          style={{ display: 'block', background: BG }}
        >
          {/* Grid lines */}
          {GRID_LINES.map(seats => {
            const y = LABEL_H + CHART_H - seats * pxPerSeat;
            return (
              <g key={seats}>
                <line
                  x1={LEFT_W} y1={y} x2={totalW} y2={y}
                  stroke={GRID} strokeWidth={0.5}
                />
                <text
                  x={LEFT_W - 3} y={y + 3}
                  fill={AXIS} fontSize={5.5} textAnchor="end"
                  fontFamily="'Source Sans 3', sans-serif"
                >
                  {seats}
                </text>
              </g>
            );
          })}

          {/* Y-axis label */}
          <text
            x={6} y={LABEL_H + CHART_H / 2}
            fill={AXIS} fontSize={5.5} textAnchor="middle"
            fontFamily="'Source Sans 3', sans-serif"
            transform={`rotate(-90, 6, ${LABEL_H + CHART_H / 2})`}
          >
            SEATS
          </text>

          {/* Bars */}
          {data.map((row, gi) => {
            const groupX = LEFT_W + gi * (groupW + GROUP_GAP);
            const activeOffices = row.offices.filter(o => o.total > 0);

            return (
              <g key={row.year}>
                {/* X-axis year label */}
                <text
                  x={groupX + groupW / 2}
                  y={LABEL_H + CHART_H + AXIS_H - 4}
                  fill={AXIS} fontSize={5.5} textAnchor="middle"
                  fontFamily="'Source Sans 3', sans-serif"
                >
                  {row.year}
                </text>

                {/* Bars for each office */}
                {row.offices.map((o, oi) => {
                  const barX = groupX + oi * (BAR_W + BAR_GAP);
                  if (o.total === 0) return null;

                  const y3h = o.y3plus * pxPerSeat;
                  const y2h = o.y2 * pxPerSeat;
                  const y1h = o.y1 * pxPerSeat;
                  const totalH_bar = o.total * pxPerSeat;
                  const barTop = LABEL_H + CHART_H - totalH_bar;

                  return (
                    <g key={o.key}>
                      {/* Y3+ segment (bottom of stack = most mature) */}
                      {o.y3plus > 0 && (
                        <rect
                          x={barX} y={LABEL_H + CHART_H - y3h}
                          width={BAR_W} height={y3h}
                          fill={o.y3} rx={0}
                        />
                      )}
                      {/* Y2 segment */}
                      {o.y2 > 0 && (
                        <rect
                          x={barX} y={LABEL_H + CHART_H - y3h - y2h}
                          width={BAR_W} height={y2h}
                          fill={o.y2color} rx={0}
                        />
                      )}
                      {/* Y1 segment (top = newest) */}
                      {o.y1 > 0 && (
                        <rect
                          x={barX} y={LABEL_H + CHART_H - y3h - y2h - y1h}
                          width={BAR_W} height={y1h}
                          fill={o.y1color} rx={0}
                        />
                      )}
                      {/* Bar-top GCI label */}
                      <text
                        x={barX + BAR_W / 2}
                        y={barTop - 2}
                        fill={LABEL} fontSize={5} textAnchor="middle"
                        fontFamily="'Source Sans 3', sans-serif"
                        fontWeight={500}
                      >
                        {fmtGci(o.avgGci)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend row 1: office identity */}
      <div style={{
        display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' as const,
        fontFamily: "'Source Sans 3', sans-serif", fontSize: 6.5, color: AXIS,
      }}>
        {[
          { color: EH_Y3, label: 'East Hampton · opens 2026' },
          { color: SH_Y3, label: 'Southampton · opens 2028' },
          { color: WH_Y3, label: 'Westhampton · opens 2030' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: color }} />
            {label}
          </span>
        ))}
      </div>

      {/* Legend row 2: cohort shading */}
      <div style={{
        display: 'flex', gap: 16, marginTop: 4, flexWrap: 'wrap' as const,
        fontFamily: "'Source Sans 3', sans-serif", fontSize: 6.5, color: AXIS,
      }}>
        {[
          { color: EH_Y1, label: 'Y1 · $500K/seat' },
          { color: EH_Y2, label: 'Y2 · $750K/seat' },
          { color: EH_Y3, label: 'Y3+ · $1M+/seat' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
