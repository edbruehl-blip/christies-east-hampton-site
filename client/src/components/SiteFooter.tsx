/**
 * SiteFooter.tsx — Canonical site footer.
 *
 * D65 Shell Purge (Apr 23 2026):
 * hiddenInPdfMode prop and ?pdf=1 branch deleted.
 * Footer renders unconditionally on all routes.
 * One footer. One environment. No parallel paths.
 *
 * Routes: HOME · MARKET · MAPS · PIPE · FUTURE · INTEL · REPORT
 */
import React from 'react';
import { useLocation } from 'wouter';
import { LOGO_WHITE } from '@/lib/cdn-assets';

const GOLD = '#947231';
const NAVY = '#1B2A4A';
const CREAM = '#FAF8F4';
const SANS: React.CSSProperties = {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
};

const LETTER_LINKS = [
  { label: 'Letter from the Flagship', href: '/letters/flagship' },
  { label: "A Letter from Christie's", href: '/letters/christies' },
  { label: 'Letter to Angel', href: '/letters/angel' },
  { label: 'Neighborhood Welcome Letter', href: '/letters/welcome' },
];

export function SiteFooter() {
  const [, navigate] = useLocation();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: NAVY,
        borderTop: `1px solid rgba(200,172,120,0.18)`,
        padding: '40px 24px 28px',
        marginTop: 0,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Top row: logo + contact + founding line */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          {/* Logo */}
          <img
            src={LOGO_WHITE}
            alt="Christie's International Real Estate Group"
            style={{ height: 44, width: 'auto', filter: 'brightness(0) invert(1)', flexShrink: 0 }}
          />
          {/* Contact block */}
          <div style={{ ...SANS, fontSize: '0.72rem', color: `rgba(250,248,244,0.65)`, lineHeight: 1.7, letterSpacing: '0.02em' }}>
            <div style={{ color: CREAM, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.65rem', marginBottom: 4 }}>
              Christie's East Hampton
            </div>
            <div>2 Main Street · East Hampton, NY 11937</div>
            <div>
              <a href="tel:+16313246400" style={{ color: `rgba(250,248,244,0.65)`, textDecoration: 'none' }}>
                631.324.6400
              </a>
              {' · '}
              <a href="mailto:ed.bruehl@christies.com" style={{ color: `rgba(250,248,244,0.65)`, textDecoration: 'none' }}>
                ed.bruehl@christies.com
              </a>
            </div>
          </div>
          {/* Founding line */}
          <div
            style={{
              ...SANS,
              fontSize: '0.65rem',
              color: GOLD,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              alignSelf: 'center',
              flexShrink: 0,
            }}
          >
            Art · Beauty · Provenance · Since 1766
          </div>
        </div>

        {/* Letter links */}
        <div>
          <div style={{ ...SANS, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(148,114,49,0.55)', marginBottom: 8 }}>
            Institutional Letters
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
            {LETTER_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => { e.preventDefault(); navigate(href); }}
                style={{
                  ...SANS,
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(250,248,244,0.5)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,248,244,0.5)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `rgba(200,172,120,0.12)` }} />

        {/* Legal line */}
        <div
          style={{
            ...SANS,
            fontSize: '0.6rem',
            color: `rgba(250,248,244,0.3)`,
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}
        >
          © {year} Christie's International Real Estate Group. All rights reserved. Christie's International Real Estate Group fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Each franchise is independently owned and operated.
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
