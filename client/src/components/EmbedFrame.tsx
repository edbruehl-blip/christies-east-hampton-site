/**
 * EmbedFrame — reusable Christie's-branded frame for iframes and embedded content.
 * Sprint 29 · Items 7 & 8
 *
 * Usage:
 *   <EmbedFrame label="Layer 2 · Master Calendar">
 *     <iframe src="..." />
 *   </EmbedFrame>
 *
 *   <EmbedFrame label="Christie's · Auction Intelligence" aspectRatio="56.25%">
 *     <iframe src="https://www.youtube.com/embed/..." />
 *   </EmbedFrame>
 */

import React from 'react';

const LABEL_FONT = {
  fontFamily: '"Barlow Condensed", sans-serif',
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
};

interface EmbedFrameProps {
  /** Optional label shown above the frame in Christie's gold */
  label?: string;
  /** Aspect ratio for responsive video/map embeds, e.g. "56.25%" for 16:9. If omitted, height must be set on children. */
  aspectRatio?: string;
  /** Fixed height in px — use instead of aspectRatio for calendar/sheet embeds */
  height?: number;
  children: React.ReactNode;
  /** Extra style overrides for the outer wrapper */
  style?: React.CSSProperties;
}

export function EmbedFrame({ label, aspectRatio, height, children, style }: EmbedFrameProps) {
  return (
    <div style={style}>
      {label && (
        <div style={{
          ...LABEL_FONT,
          color: '#C8AC78',
          fontSize: 9,
          marginBottom: 8,
        }}>
          {label}
        </div>
      )}
      {/* Outer hairline border frame */}
      <div style={{
        border: '1px solid rgba(200,172,120,0.35)',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(27,42,74,0.6), 0 4px 24px rgba(0,0,0,0.25)',
        background: '#0D1520',
      }}>
        {/* Top accent bar */}
        <div style={{
          height: 2,
          background: 'linear-gradient(90deg, rgba(200,172,120,0.6) 0%, rgba(200,172,120,0.1) 100%)',
        }} />
        {/* Content area */}
        {aspectRatio ? (
          <div style={{ position: 'relative', paddingBottom: aspectRatio, height: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              {children}
            </div>
          </div>
        ) : height ? (
          <div style={{ height, overflow: 'hidden' }}>
            {children}
          </div>
        ) : (
          <div style={{ overflow: 'hidden' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
