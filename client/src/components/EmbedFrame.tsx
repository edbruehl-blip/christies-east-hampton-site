/**
 * EmbedFrame — Christie's East Hampton Flagship
 * Reusable branded section frame for iframes, maps, calculators, and embedded content.
 *
 * Applies the HOME tab editorial treatment:
 *   · Dark navy wrapper (#1B2A4A or #0D1B2A)
 *   · Gold top-border rule
 *   · Barlow Condensed gold eyebrow label
 *   · Cormorant Garamond serif title
 *   · Source Sans 3 muted subtitle
 *   · Optional action link (top-right)
 *   · Gold accent bar on the iframe/content frame
 *
 * Usage:
 *   <EmbedFrame eyebrow="Layer 1 · Mind Map" title="Christie's Flagship Mind Map"
 *               subtitle="Live Miro board" actionLabel="Open in Miro" actionHref="...">
 *     <iframe src="..." />
 *   </EmbedFrame>
 *
 *   // Legacy usage (label only) still works:
 *   <EmbedFrame label="Layer 2 · Calendar" height={600}>
 *     <iframe src="..." />
 *   </EmbedFrame>
 */

import React from 'react';

const BARLOW: React.CSSProperties = {
  fontFamily: '"Barlow Condensed", sans-serif',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
};

interface EmbedFrameProps {
  // ── Full editorial header (preferred) ──────────────────────────────────────
  /** Gold Barlow Condensed eyebrow label (e.g. "Layer 1 · Mind Map") */
  eyebrow?: string;
  /** Cormorant serif section title */
  title?: string;
  /** Muted Source Sans 3 subtitle */
  subtitle?: string;
  /** Action link label shown top-right */
  actionLabel?: string;
  actionHref?: string;

  // ── Legacy simple label ─────────────────────────────────────────────────────
  /** @deprecated Use eyebrow + title instead */
  label?: string;

  // ── Frame options ───────────────────────────────────────────────────────────
  /** Aspect ratio for responsive video/map embeds, e.g. "56.25%" for 16:9 */
  aspectRatio?: string;
  /** Fixed height in px — use for calendar/sheet embeds */
  height?: number;
  /** Background variant for the outer section wrapper */
  bg?: 'navy' | 'deep' | 'dark' | 'none';
  /** Whether to show the gold top-border rule on the section wrapper */
  borderTop?: boolean;
  /** Extra style overrides for the outer wrapper */
  style?: React.CSSProperties;
  /** Optional id for scroll anchoring */
  id?: string;
  children: React.ReactNode;
}

const BG_MAP: Record<string, string> = {
  navy: '#1B2A4A',
  deep: '#0D1B2A',
  dark: '#0D1520',
  none: 'transparent',
};

export function EmbedFrame({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  actionHref,
  label,
  aspectRatio,
  height,
  bg = 'navy',
  borderTop = true,
  style,
  id,
  children,
}: EmbedFrameProps) {
  const hasHeader = eyebrow || title || subtitle || label;
  const background = BG_MAP[bg] ?? BG_MAP.navy;

  return (
    <div
      id={id}
      style={{
        background: bg === 'none' ? undefined : background,
        borderTop: borderTop && bg !== 'none' ? '1px solid rgba(200,172,120,0.25)' : undefined,
        ...style,
      }}
    >
      {/* ── Section header ─────────────────────────────────────────────────── */}
      {hasHeader && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div>
              {/* Eyebrow or legacy label */}
              {(eyebrow || label) && (
                <div style={{
                  ...BARLOW,
                  color: '#947231',
                  fontSize: 10,
                  fontWeight: 600,
                  marginBottom: title ? 6 : 0,
                  opacity: 0.9,
                }}>
                  {eyebrow ?? label}
                </div>
              )}
              {/* Title */}
              {title && (
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  color: '#FAF8F4',
                  fontWeight: 400,
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  lineHeight: 1.2,
                  margin: 0,
                }}>
                  {title}
                </h3>
              )}
              {/* Subtitle */}
              {subtitle && (
                <p style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  color: 'rgba(250,248,244,0.5)',
                  fontSize: '0.78rem',
                  marginTop: 5,
                  lineHeight: 1.5,
                }}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Action link */}
            {actionLabel && actionHref && (
              <a
                href={actionHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...BARLOW,
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  color: '#947231',
                  border: '1px solid rgba(200,172,120,0.4)',
                  borderRadius: 3,
                  padding: '6px 14px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  alignSelf: 'flex-start',
                  marginTop: 2,
                }}
              >
                {actionLabel} ↗
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Content frame ──────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: bg === 'none' ? undefined : 1200,
        margin: bg === 'none' ? undefined : '0 auto',
        padding: bg === 'none' ? undefined : '0 24px 32px',
      }}>
        <div style={{
          border: '1px solid rgba(200,172,120,0.3)',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(27,42,74,0.5), 0 4px 24px rgba(0,0,0,0.22)',
          background: '#0D1520',
        }}>
          {/* Gold accent bar */}
          <div style={{
            height: 2,
            background: 'linear-gradient(90deg, rgba(200,172,120,0.7) 0%, rgba(200,172,120,0.08) 100%)',
          }} />
          {/* Content */}
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
    </div>
  );
}

export default EmbedFrame;
