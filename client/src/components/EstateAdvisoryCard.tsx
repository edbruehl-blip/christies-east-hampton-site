/**
 * EstateAdvisoryCard — Shared component
 * Renders across three surfaces from one locked copy source:
 *   1. Bottom of HOME tab (HomeTab.tsx)
 *   2. Closing section of /report page (ReportPage.tsx)
 *   3. INTEL Layer 3 as CDN-hosted PDF link (link only, not this component)
 *
 * LOCKED COPY — Do not change without Ed's explicit approval.
 * Art-secured lending. Never art finance. Exact language.
 *
 * Design: dark theme — navy overlay · gold #947231 · cream text #FAF8F4
 */

import { ED_HEADSHOT_PRIMARY, LOGO_WHITE } from '@/lib/cdn-assets';

const LABEL_FONT: React.CSSProperties = { fontFamily: '"Barlow Condensed", sans-serif' };
const SERIF: React.CSSProperties = { fontFamily: '"Cormorant Garamond", serif' };
const SANS: React.CSSProperties = { fontFamily: '"Source Sans 3", sans-serif' };

interface EstateAdvisoryCardProps {
  /** When true, wraps the card in a Christie's gold border frame (HOME tab usage) */
  framed?: boolean;
  /** Optional section label number override (default: none) */
  sectionLabel?: string;
}

export function EstateAdvisoryCard({ framed = false, sectionLabel }: EstateAdvisoryCardProps) {
  const inner = (
    <section style={{ background: 'rgba(13,27,42,0.75)', borderTop: framed ? 'none' : '1px solid rgba(200,172,120,0.15)' }}>
      <div className="px-6 py-12" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {sectionLabel && (
          <div className="flex items-center gap-3 mb-8">
            <div style={{
              ...LABEL_FONT,
              background: 'rgba(200,172,120,0.15)', color: '#947231',
              fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
              padding: '3px 8px',
              border: '1px solid rgba(200,172,120,0.3)',
            }}>
              {sectionLabel}
            </div>
            <div style={{ ...LABEL_FONT, color: '#947231', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              Estate Advisory
            </div>
          </div>
        )}
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          {/* Left: Ed headshot + identity + doctrine quote */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-5">
              <img
                src={ED_HEADSHOT_PRIMARY}
                alt="Ed Bruehl"
                style={{
                  width: 80, height: 80,
                  objectFit: 'cover', objectPosition: 'center top',
                  borderRadius: 2,
                  border: '1px solid rgba(200,172,120,0.2)',
                }}
              />
              <div>
                <div style={{ ...SERIF, color: '#FAF8F4', fontSize: '1.25rem', fontWeight: 400, marginBottom: 2 }}>
                  Ed Bruehl
                </div>
                <div style={{ ...LABEL_FONT, color: 'rgba(200,172,120,0.7)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Christie's International Real Estate Group · East Hampton
                </div>
                <div style={{ ...SANS, color: 'rgba(250,248,244,0.55)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  26 Park Place · East Hampton, NY 11937
                </div>
              </div>
            </div>
            <div style={{ ...SERIF, color: 'rgba(250,248,244,0.85)', fontSize: '1.05rem', lineHeight: 1.65, fontStyle: 'italic' }}>
              "The family's interest comes before the sale. Not the commission.
              Not the close. The family. That principle has survived over 250 years
              of markets, wars, and revolutions."
            </div>
            <div style={{ ...LABEL_FONT, color: 'rgba(200,172,120,0.5)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              — James Christie, Pall Mall, 1766
            </div>
          </div>

          {/* Right: Services + CTA */}
          <div className="flex flex-col gap-5">
            <div style={{ ...LABEL_FONT, color: '#947231', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
              Private Territory Briefing
            </div>
            <div style={{ ...SANS, color: 'rgba(250,248,244,0.65)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: 8 }}>
              A private, no-obligation briefing covering your target hamlet's
              current inventory, institutional-grade opportunities, and Christie's
              institutional access to off-market transactions. Delivered in
              person at 26 Park Place or via secure video.
            </div>
            {[
              'Hamlet-specific market analysis',
              "Off-market access via Christie's network",
              'Estate liquidation advisory',
              'New construction acquisition strategy',
              'Art-secured lending advisory',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2"
                style={{ ...SANS, color: 'rgba(250,248,244,0.6)', fontSize: '0.8125rem', lineHeight: 1.5 }}
              >
                <span style={{ color: '#947231', marginTop: 2, flexShrink: 0 }}>—</span>
                <span>{item}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <a
                href="tel:6467521233"
                style={{
                  display: 'inline-block',
                  background: '#947231', color: '#1B2A4A',
                  ...LABEL_FONT, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  textDecoration: 'none', padding: '10px 20px',
                  fontWeight: 600,
                }}
              >
                646-752-1233
              </a>
              <a
                href="mailto:edbruehl@christiesrealestategroup.com"
                style={{
                  display: 'inline-block',
                  background: 'transparent', color: '#FAF8F4',
                  border: '1px solid rgba(200,172,120,0.4)',
                  ...LABEL_FONT, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  textDecoration: 'none', padding: '10px 20px',
                }}
              >
                Email Ed →
              </a>
            </div>
          </div>
        </div>

        {/* Footer: Christie's logo + doctrine */}
        <div style={{
          marginTop: 48, paddingTop: 20,
          borderTop: '1px solid rgba(200,172,120,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <img src={LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 24, opacity: 0.85 }} />
          <div style={{
            ...LABEL_FONT, color: 'rgba(200,172,120,0.4)', fontSize: 8,
            letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'right',
          }}>
            Christie's East Hampton · christiesrealestategroupeh.com
          </div>
        </div>
      </div>
    </section>
  );

  if (!framed) return inner;

  // Framed version for HOME tab — Christie's gold border on dark background
  return (
    <div style={{
      border: '1px solid rgba(200,172,120,0.4)',
      margin: '0 auto',
      maxWidth: 1100,
      background: 'rgba(13,27,42,0.75)',
    }}>
      {/* Gold accent bar at top */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #947231 0%, rgba(200,172,120,0.3) 100%)' }} />
      {inner}
    </div>
  );
}
