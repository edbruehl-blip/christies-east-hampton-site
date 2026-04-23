/**
 * FramePrimitives.tsx — Christie's East Hampton · MAPS framing primitives
 *
 * F3 · Apr 23 2026 · Council Final
 *
 * GoldBlackFrame:
 *   3px solid gold #947231 outer border
 *   1px black #0D1B2A inner inset
 *   4px bottom-right shadow
 *   shell-matched radius (2px)
 *
 * FloatingCard (extends GoldBlackFrame):
 *   All of GoldBlackFrame +
 *   box-shadow: 0 12px 32px rgba(0,0,0,0.6), 0 2px 4px rgba(200,172,120,0.15)
 *   backdrop-filter: blur(1px)
 *   Navy content substrate preserved
 */

import React from 'react';

interface FrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GoldBlackFrame — canonical framing primitive for map containers and panels.
 * Outer: 3px solid #947231 (gold)
 * Inner: 1px solid #0D1B2A (black) via outline
 * Shadow: 4px 4px 0 rgba(0,0,0,0.55) (bottom-right)
 * Radius: 2px
 */
export function GoldBlackFrame({ children, className = '', style = {} }: FrameProps) {
  return (
    <div
      className={className}
      style={{
        border: '3px solid #947231',
        outline: '1px solid #0D1B2A',
        outlineOffset: '-4px',
        borderRadius: 2,
        boxShadow: '4px 4px 0 rgba(0,0,0,0.55)',
        overflow: 'hidden',
        background: '#0D1B2A',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * FloatingCard — elevated variant of GoldBlackFrame for hamlet cards and panels.
 * Adds deep drop shadow + subtle gold glow + backdrop blur.
 */
export function FloatingCard({ children, className = '', style = {} }: FrameProps) {
  return (
    <div
      className={className}
      style={{
        border: '3px solid #947231',
        outline: '1px solid #0D1B2A',
        outlineOffset: '-4px',
        borderRadius: 2,
        boxShadow:
          '4px 4px 0 rgba(0,0,0,0.55), ' +
          '0 12px 32px rgba(0,0,0,0.6), ' +
          '0 2px 4px rgba(200,172,120,0.15)',
        backdropFilter: 'blur(1px)',
        WebkitBackdropFilter: 'blur(1px)',
        overflow: 'hidden',
        background: '#0D1B2A',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
