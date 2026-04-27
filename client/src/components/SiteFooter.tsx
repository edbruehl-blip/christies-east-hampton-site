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

// Neighborhood Cards removed from footer per D41D — strip clean, no stub

export function SiteFooter() {
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
        </div>

        {/* Neighborhood Card links removed D41D */}

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
