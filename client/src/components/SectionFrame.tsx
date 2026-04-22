/**
 * SectionFrame — Christie's East Hampton Flagship
 * Shared section wrapper that applies the HOME tab editorial frame treatment:
 *   · Dark navy (#1B2A4A) or deep navy (#0D1B2A) background
 *   · Gold top-border rule (rgba(200,172,120,0.25))
 *   · Barlow Condensed gold eyebrow label
 *   · Cormorant Garamond serif section title
 *   · Source Sans 3 muted subtitle
 *   · Optional action link (top-right)
 *   · Consistent max-width container + padding
 *
 * Usage:
 *   <SectionFrame eyebrow="Layer 1 · Mind Map" title="Institutional Mind Map" subtitle="Live Miro board · Version 3 architecture">
 *     <YourContent />
 *   </SectionFrame>
 */

import React from 'react';

interface SectionFrameProps {
  /** Short uppercase label above the title (e.g. "Layer 1 · Mind Map") */
  eyebrow: string;
  /** Main Cormorant serif title */
  title: string;
  /** Optional muted subtitle */
  subtitle?: string;
  /** Optional action link shown top-right */
  actionLabel?: string;
  actionHref?: string;
  /** Background variant: 'navy' (#1B2A4A) | 'deep' (#0D1B2A) | 'dark' (#0D1520) */
  bg?: 'navy' | 'deep' | 'dark';
  /** Whether to show the gold top-border rule */
  borderTop?: boolean;
  /** Children rendered below the header */
  children: React.ReactNode;
  /** Optional id for scroll anchoring */
  id?: string;
  /** Extra padding below header before children */
  headerPad?: number;
}

const BG_MAP = {
  navy: '#1B2A4A',
  deep: '#0D1B2A',
  dark: '#0D1520',
};

export function SectionFrame({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  actionHref,
  bg = 'navy',
  borderTop = true,
  children,
  id,
  headerPad = 16,
}: SectionFrameProps) {
  const background = BG_MAP[bg];

  return (
    <div
      id={id}
      style={{
        background,
        borderTop: borderTop ? '1px solid rgba(200,172,120,0.25)' : undefined,
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: headerPad,
        }}>
          <div>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#947231',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 6,
              opacity: 0.9,
            }}>
              {eyebrow}
            </div>
            <h3 style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#FAF8F4',
              fontWeight: 400,
              fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {title}
            </h3>
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

          {actionLabel && actionHref && (
            <a
              href={actionHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
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

      {/* Content */}
      {children}
    </div>
  );
}

export default SectionFrame;
