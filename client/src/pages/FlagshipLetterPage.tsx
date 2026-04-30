/**
 * /letters/flagship — Flagship AI-Letter Live URL Renderer
 *
 * Visual identity: matches HOME tab — navy header with auction room bg,
 * James Christie portrait float-left, gold small-caps title, cream body.
 *
 * D65 Strict (Apr 23 2026): isPdfMode deleted. Single cream render path.
 * PDF = html2canvas screenshot of live page. No parallel paths.
 *
 * Content source: FLAGSHIP_LETTER_TEXT via tRPC flagship.getLetter
 * Route: /letters/flagship (registered in App.tsx)
 */
import { trpc } from '@/lib/trpc';
import { SiteFooter } from '@/components/SiteFooter';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY } from '@/lib/cdn-assets';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY    = '#1B2A4A';
const GOLD    = '#947231';
const CREAM   = '#FAF8F4';
const MUTED   = 'rgba(27,42,74,0.6)';

// CDN assets
const CIREG_LOGO_WHITE = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';
const CIREG_LOGO_BLACK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';
const AUCTION_ROOM_BG  = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/DtTxqkdyvvLrygvu.jpg';
const ED_HEADSHOT      = 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/ed-headshot-primary_0f6df1af.jpg';

// ─── Paragraph splitter ────────────────────────────────────────────────────────
function splitParagraphs(text: string): string[] {
  return text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
}

// ─── Section heading detector ─────────────────────────────────────────────────
function isSectionHeading(para: string): boolean {
  return para.length < 80 && !para.endsWith('.') && !para.endsWith(',');
}

export default function FlagshipLetterPage() {
  const { data, isLoading, error } = trpc.flagship.getLetter.useQuery();
  const paragraphs = data?.text ? splitParagraphs(data.text) : [];

  // Hotfix 41: Date stamp removed from header per canon lock (sign-offs carry no date).

  const handlePrint = () => window.print();

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: '"Cormorant Garamond", serif' }}>

      {/* ── NAVY HEADER — always shown (D65: PDF mode header deleted) ──────── */}
      <header
          className="letter-header"
          style={{
            position: 'relative',
            background: NAVY,
            overflow: 'hidden',
            borderBottom: `1px solid ${GOLD}`,
          }}
        >
          {/* Auction room background — hidden in print via .hero-bg */}
          <div className="hero-bg" style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${AUCTION_ROOM_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.18,
          }} />
          {/* Top bar: logo + print button */}
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 40px',
            borderBottom: `1px solid rgba(200,172,120,0.2)`,
          }}>
            {/* Screen: white logo on navy. Print: black logo on cream. */}
            <img
              src={CIREG_LOGO_WHITE}
              alt="Christie's International Real Estate Group"
              className="logo-white"
              style={{ height: 28, objectFit: 'contain' }}
            />
            <img
              src={CIREG_LOGO_BLACK}
              alt="Christie's International Real Estate Group"
              className="logo-black"
              style={{ height: 28, objectFit: 'contain', display: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: GOLD, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                Flagship Letter
              </span>
              <button
                onClick={handlePrint}
                style={{
                  background: 'transparent',
                  border: `1px solid ${GOLD}`,
                  color: GOLD,
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  padding: '6px 16px', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                ↓ Download PDF
              </button>
            </div>
          </div>

          {/* Hero area: James Christie portrait + letter title */}
          <div
            className="flagship-hero-row"
            style={{
              position: 'relative', zIndex: 2,
              display: 'flex', alignItems: 'flex-end', gap: 32,
              padding: '32px 40px 36px',
              maxWidth: 800, margin: '0 auto',
            }}
          >
            {/* James Christie portrait */}
            <div className="flagship-hero-portrait" style={{ flexShrink: 0 }}>
              <div style={{
                padding: 4,
                border: `2px solid ${GOLD}`,
                boxShadow: `0 0 0 1px rgba(200,172,120,0.3), 0 8px 32px rgba(0,0,0,0.6)`,
                background: 'rgba(27,42,74,0.4)',
                display: 'inline-block',
              }}>
                <img
                  src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
                  alt="James Christie — Founder, Christie's, Est. 1766"
                  style={{
                    width: 90, height: 115,
                    objectFit: 'cover', objectPosition: 'center 20%',
                    display: 'block',
                  }}
                />
              </div>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: GOLD, fontSize: 8, letterSpacing: '0.16em',
                textTransform: 'uppercase', marginTop: 6, textAlign: 'center',
              }}>
                James Christie · London · 1766
              </div>
            </div>

            {/* Title block */}
            <div>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: GOLD, fontSize: 10, letterSpacing: '0.24em',
                textTransform: 'uppercase', marginBottom: 10,
              }}>
                Christie's East Hampton · Flagship Letter
              </div>
              <h1 style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#FAF8F4', fontWeight: 400,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                lineHeight: 1.1, margin: '0 0 10px',
                letterSpacing: '0.04em',
              }}>
                The Flagship Letter
              </h1>

            </div>
          </div>
         </header>
      {/* ── DOCUMENT BODY ─────────────────────────────────────────────────── */}
      <main style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '52px 32px 100px',
      }}>

        {/* Gold rule separator */}
        <div style={{ borderTop: `1px solid ${GOLD}`, marginBottom: 40, opacity: 0.35 }} />

        {/* Loading / error states */}
        {isLoading && (
          <div style={{ color: MUTED, fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
            Loading…
          </div>
        )}
        {error && (
          <div style={{ color: '#e57373', fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
            Unable to load letter. Please refresh.
          </div>
        )}

        {/* Letter body — no inline portrait (portrait lives in hero header only — D42 fix) */}
        {paragraphs.length > 0 && (
          <>
            {paragraphs.map((para, i) => {
              if (isSectionHeading(para)) {
                return (
                  <div
                    key={i}
                    style={{
                      fontFamily: '"Barlow Condensed", sans-serif',
                      color: GOLD, fontSize: 10, letterSpacing: '0.22em',
                      textTransform: 'uppercase', marginTop: 40, marginBottom: 12,
                      clear: 'both',
                    }}
                  >
                    {para}
                  </div>
                );
              }
              return (
                <p
                  key={i}
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    color: NAVY,
                    fontSize: '1.15rem',
                    lineHeight: 1.85,
                    marginBottom: 28,
                    fontWeight: 400,
                  }}
                >
                  {para}
                </p>
              );
            })}

            {/* Clear float */}
            <div style={{ clear: 'both' }} />

            {/* Gold rule */}
            <div style={{ borderTop: `1px solid ${GOLD}`, marginTop: 48, marginBottom: 36, opacity: 0.4 }} />

            {/* Ed signature block — circle headshot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
              <img
                src={ED_HEADSHOT}
                alt="Ed Bruehl"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                  flexShrink: 0,
                  border: `2px solid ${GOLD}`,
                }}
              />
              <div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  color: NAVY, fontWeight: 600, fontSize: '1rem', marginBottom: 2,
                }}>
                  Ed Bruehl
                </div>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: MUTED, fontSize: 10, letterSpacing: '0.16em',
                  textTransform: 'uppercase', marginBottom: 3,
                }}>
                  Managing Director · Christie's East Hampton
                </div>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: GOLD, fontSize: 10, letterSpacing: '0.12em',
                }}>
                  christiesrealestategroupeh.com
                </div>
              </div>
            </div>

            {/* SDG removed from public surface per Canon Fix CF-1 Apr 29 2026 */}

            {/* P3: Standard site footer added per Dispatch 40 */}
            <footer style={{
              borderTop: `1px solid rgba(148,114,49,0.35)`,
              marginTop: 48,
              paddingTop: 20,
              paddingBottom: 24,
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 13, letterSpacing: 5, color: GOLD, textTransform: 'uppercase' as const }}>
                Christie&rsquo;s International Real Estate Group
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 11, letterSpacing: 3, color: '#a0a8b0', marginTop: 6, fontStyle: 'italic' }}>
                Art &middot; Beauty &middot; Provenance &middot; Since 1766
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 10, letterSpacing: 2, color: '#a0a8b0', marginTop: 8 }}>
                26 Park Place &middot; East Hampton, NY 11937
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 9, letterSpacing: 2, color: 'rgba(160,168,176,0.6)', marginTop: 6 }}>
                &copy; 2026 Christie&rsquo;s International Real Estate Group &middot; East Hampton Flagship
              </div>
            </footer>
          </>
        )}
      </main>

      {/* ── Styles: fonts + print ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Barlow+Condensed:wght@400;500;600&display=swap');

        @media (max-width: 639px) {
          .flagship-hero-portrait { display: none !important; }
          .flagship-hero-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          /* flagship-body-portrait removed D42 — inline portrait deleted from DOM */
        }

        @media print {
          /* P0-1 Fix 1: Keep header — remove only the auction-room background image */
          .no-print { display: none !important; }
          .hero-bg { display: none !important; }
          /* P0-1 Fix 2: Logo swap — black on cream for print */
          .logo-white { display: none !important; }
          .logo-black { display: block !important; }
          /* P0-1 Fix 3: Wider margins and max-width */
          @page { size: Letter; margin: 0.9in 1in; }
          body { background: #FAF8F4 !important; }
          main { max-width: 6.5in !important; margin: 0 auto !important; padding: 0 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          /* P0-1 Fix 4: Bigger body copy — Cormorant Garamond 13pt / 1.75 */
          p { color: #1B2A4A !important; font-size: 13pt !important; line-height: 1.75 !important; font-family: 'Cormorant Garamond', serif !important; }
          img { max-width: 100% !important; }
          /* D42: hero portrait suppressed on print — inline body portrait removed, hero is the only portrait */
          .flagship-hero-portrait { display: none !important; }
          /* Wave 6 p6 Fix 2: Headline — override clamp() for print, 28pt canonical */
          h1 { font-size: 28pt !important; line-height: 1.15 !important; color: #1B2A4A !important; }
          /* Wave 6 p6 Fix 3: Hero row collapses to title-only on print, no portrait gap */
          .flagship-hero-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; padding: 16px 0 20px !important; background: transparent !important; }
          header { background: transparent !important; border-bottom: 1px solid #947231 !important; }
        }
      `}</style>
      <SiteFooter />
    </div>
  );
}
