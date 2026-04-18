/**
 * CISBadge — Christie's Intelligence Score Medallion
 *
 * Circular wax-seal aesthetic badge for CIS scores.
 * Replaces the flat gold-on-cream "CIS 9.4" rectangle across all surfaces.
 *
 * Usage:
 *   <CISBadge score={9.4} />                    // default ~60px
 *   <CISBadge score={9.4} size="sm" />          // ~40px (map pins, compact cards)
 *   <CISBadge score={9.4} size="lg" />          // ~80px (hero/featured)
 *   <CISBadge score={9.4} variant="dark" />     // dark bg (for light surfaces)
 *
 * Design tokens:
 *   Christie's Red outer ring: #8B1C1C
 *   Gold accent ring:          #C8AC78
 *   Navy fill:                 #1B2A4A
 *   Cream text:                #FAF8F4
 */

import React from 'react';

interface CISBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
}

const SIZES = {
  sm: { outer: 40, inner: 32, label: 6, score: 11, ring: 2 },
  md: { outer: 60, inner: 48, label: 7.5, score: 16, ring: 2.5 },
  lg: { outer: 80, inner: 64, label: 9, score: 21, ring: 3 },
};

const VARIANTS = {
  default: {
    outerRing: '#8B1C1C',   // Christie's Red
    innerRing: '#C8AC78',   // Gold
    fill: '#1B2A4A',        // Navy
    label: '#C8AC78',       // Gold
    score: '#FAF8F4',       // Cream
  },
  dark: {
    outerRing: '#C8AC78',   // Gold outer
    innerRing: '#8B1C1C',   // Red inner
    fill: '#1B2A4A',        // Navy
    label: '#C8AC78',       // Gold
    score: '#FAF8F4',       // Cream
  },
  light: {
    outerRing: '#8B1C1C',   // Christie's Red
    innerRing: '#C8AC78',   // Gold
    fill: '#FAF8F4',        // Cream fill
    label: '#8B1C1C',       // Red label
    score: '#1B2A4A',       // Navy score
  },
};

export function CISBadge({
  score,
  size = 'md',
  variant = 'default',
  className,
  style,
}: CISBadgeProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  const cx = s.outer / 2;
  const cy = s.outer / 2;
  const outerR = s.outer / 2 - s.ring / 2;
  const innerR = s.inner / 2;

  return (
    <svg
      width={s.outer}
      height={s.outer}
      viewBox={`0 0 ${s.outer} ${s.outer}`}
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      aria-label={`CIS ${score.toFixed(1)}`}
    >
      {/* Outer ring — Christie's Red */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke={v.outerRing}
        strokeWidth={s.ring}
      />
      {/* Inner ring — Gold accent */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR + s.ring * 0.6}
        fill="none"
        stroke={v.innerRing}
        strokeWidth={s.ring * 0.6}
        opacity={0.7}
      />
      {/* Fill circle */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill={v.fill}
      />
      {/* "CIS" label — small caps above score */}
      <text
        x={cx}
        y={cy - s.score * 0.28}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={v.label}
        fontSize={s.label}
        fontFamily='"Barlow Condensed", sans-serif'
        fontWeight={700}
        letterSpacing={s.label * 0.18}
      >
        CIS
      </text>
      {/* Score number */}
      <text
        x={cx}
        y={cy + s.score * 0.42}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={v.score}
        fontSize={s.score}
        fontFamily='"Cormorant Garamond", serif'
        fontWeight={600}
      >
        {score.toFixed(1)}
      </text>
    </svg>
  );
}

export default CISBadge;
