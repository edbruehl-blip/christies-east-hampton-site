/**
 * SiteFooter.tsx — Canonical site footer.
 *
 * D65 Shell Purge (Apr 23 2026):
 * hiddenInPdfMode prop and ?pdf=1 branch deleted.
 * Footer renders unconditionally on all routes.
 * One footer. One environment. No parallel paths.
 *
 * F5 Footer Rhyme (Apr 23 2026):
 * Gold-gravure marquee between logo row and letter links.
 * Compressed vertical: padding 40→24px, gap 24→16px.
 * Echo strip above copyright mirrors nav market data strip.
 *
 * Routes: HOME · MARKET · MAPS · PIPE · FUTURE · INTEL · REPORT
 */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { LOGO_WHITE } from '@/lib/cdn-assets';

const GOLD = '#947231';
const NAVY = '#1B2A4A';
const CREAM = '#FAF8F4';
const SANS: React.CSSProperties = {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
};
const CONDENSED: React.CSSProperties = {
  fontFamily: '"Barlow Condensed", "Helvetica Neue", Helvetica, Arial, sans-serif',
};

const MARQUEE_TEXT =
  'ART\u2002·\u2002BEAUTY\u2002·\u2002PROVENANCE\u2002·\u2002SINCE 1766\u2002·\u2002CHRISTIE\u2019S\u2002·\u2002EAST HAMPTON\u2002·\u2002EST. 1766\u2002·\u2002ART\u2002·\u2002BEAUTY\u2002·\u2002PROVENANCE\u2002·\u2002SINCE 1766\u2002·\u2002CHRISTIE\u2019S\u2002·\u2002EAST HAMPTON\u2002·\u2002EST. 1766';

function useWeatherFooter() {
  const [weather, setWeather] = useState<string | null>(null);
  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=40.9637&longitude=-72.1848&current_weather=true&temperature_unit=fahrenheit'
    )
      .then(r => r.json())
      .then(j => {
        const cw = j?.current_weather;
        if (cw?.temperature != null) setWeather(`${Math.round(cw.temperature)}\u00b0F`);
      })
      .catch(() => null);
  }, []);
  return weather;
}

const LETTER_LINKS = [
  { label: 'Neighborhood Welcome', href: '/cards/bike', row: 'Cards' },
  { label: 'UHNW Path', href: '/cards/uhnw-path', row: 'Cards' },
];

export function SiteFooter() {
  const [, navigate] = useLocation();
  const year    = new Date().getFullYear();
  const weather = useWeatherFooter();

  return (
    <footer
      style={{
        background: 'rgba(27, 42, 74, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderTop: `1px solid rgba(200,172,120,0.18)`,
        padding: '24px 24px 20px',
        marginTop: 0,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
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
            style={{ height: 40, width: 'auto', filter: 'brightness(0) invert(1)', flexShrink: 0 }}
          />
          {/* Contact block */}
          <div style={{ ...SANS, fontSize: '0.72rem', color: `rgba(250,248,244,0.65)`, lineHeight: 1.7, letterSpacing: '0.02em' }}>
            <div style={{ color: CREAM, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.65rem', marginBottom: 4 }}>
              Christie's East Hampton
            </div>
            <div>26 Park Place · East Hampton, NY 11937</div>
            <div>
              <a href="tel:+16467521233" style={{ color: `rgba(250,248,244,0.65)`, textDecoration: 'none' }}>
                646-752-1233
              </a>
              {' · '}
              <a href="mailto:edbruehl@christiesrealestategroup.com" style={{ color: `rgba(250,248,244,0.65)`, textDecoration: 'none' }}>
                edbruehl@christiesrealestategroup.com
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

        {/* ── Gold-gravure marquee ─────────────────────────────────────── */}
        <div
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            borderTop: '1px solid rgba(200,172,120,0.12)',
            borderBottom: '1px solid rgba(200,172,120,0.12)',
            padding: '5px 0',
          }}
        >
          <div style={{ display: 'inline-block', animation: 'christies-marquee 55s linear infinite' }}>
            <span
              style={{
                ...CONDENSED,
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: 'rgba(200,172,120,0.55)',
                textTransform: 'uppercase',
                padding: '0 48px',
              }}
            >
              {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{MARQUEE_TEXT}
            </span>
          </div>
        </div>

        {/* ── Letter + Card links ───────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(['Cards'] as const).map(row => (
            <div key={row} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ ...SANS, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(148,114,49,0.55)', minWidth: 46 }}>
                {row}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 14px' }}>
                {LETTER_LINKS.filter(l => l.row === row).map(({ label, href }) => (
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
          ))}
        </div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div style={{ height: 1, background: `rgba(200,172,120,0.12)` }} />

        {/* ── Echo strip — mirrors nav market data strip ───────────────── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '4px 14px',
            ...CONDENSED,
            fontSize: '0.62rem',
            letterSpacing: '0.06em',
            color: 'rgba(200,172,120,0.7)',
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>Christie’s East Hampton</span>
          <span style={{ color: 'rgba(200,172,120,0.25)' }}>·</span>
          <span style={{ whiteSpace: 'nowrap' }}>26 Park Place</span>
          <span style={{ color: 'rgba(200,172,120,0.25)' }}>·</span>
          <a href="tel:+16467521233" style={{ color: 'rgba(200,172,120,0.7)', textDecoration: 'none', whiteSpace: 'nowrap' }}>646-752-1233</a>
          <span style={{ color: 'rgba(200,172,120,0.25)' }}>·</span>
          <a href="mailto:edbruehl@christiesrealestategroup.com" style={{ color: GOLD, textDecoration: 'none', whiteSpace: 'nowrap' }}>edbruehl@christiesrealestategroup.com</a>
          {weather && (
            <>
              <span style={{ color: 'rgba(200,172,120,0.25)' }}>·</span>
              <span style={{ color: GOLD, fontWeight: 600, whiteSpace: 'nowrap' }}>{weather}</span>
            </>
          )}

        </div>

        {/* ── Legal line ──────────────────────────────────────────────── */}
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
