/**
 * /cards/bike — Christie's Neighborhood Card · HTML Renderer
 *
 * Two-sided print card: front (map + hamlet strip) + back (creed + services + contact)
 * Print CSS: landscape, two cards per 8.5×11 sheet, cut horizontally.
 *
 * PDF download: GET /api/pdf?url=/cards/bike
 * Route registered in App.tsx as /cards/bike
 * Filename map entry in pdf-route.ts: Christies_EH_Neighborhood_Card
 *
 * Doctrine 43 — PDF Light Mode Export Standard
 * ?pdf=1 → download bar hidden, clean rendering for Puppeteer.
 */
import { useState } from 'react';
import { SiteFooter } from '@/components/SiteFooter';

// D65 Strict (Apr 23 2026): useIsPdfMode deleted. Single dark-navy render path.

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY    = '#0a1628';
const GOLD    = '#947231';
const CREAM   = '#F9F5EF';
const RED     = '#8B1C1C';
const MUTED   = '#888';

// ─── Christie's logos ──────────────────────────────────────────────────────────
const LOGO_WHITE = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';
const LOGO_BLACK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';

// ─── QR code (links to /market) ───────────────────────────────────────────────
const QR_MARKET = 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/qr-linktree_61501da5.png';

// ─── Top 4 hamlets by median (dispatch spec) ──────────────────────────────────
const TOP_HAMLETS = [
  { name: 'Sagaponack',         median: '$8.04M', cis: 9.4 },
  { name: 'EH Village',         median: '$5.25M', cis: 9.2 },
  { name: 'Bridgehampton',      median: '$4.47M', cis: 9.1 },
  { name: 'Southampton Village',median: '$4.39M', cis: 8.8 },
];

// ─── Hamlet map positions (approximate % x/y on the East End map placeholder) ─
const HAMLET_POSITIONS = [
  { name: 'Sagaponack',          cis: 9.4, x: 62, y: 55 },
  { name: 'EH Village',          cis: 9.2, x: 72, y: 48 },
  { name: 'Bridgehampton',       cis: 9.1, x: 55, y: 52 },
  { name: 'Southampton Village', x: 35, y: 50 },
  { name: 'Sag Harbor',          cis: 8.5, x: 68, y: 38 },
  { name: 'Amagansett',          cis: 8.3, x: 80, y: 50 },
  { name: 'Wainscott',           cis: 8.1, x: 66, y: 60 },
  { name: 'Water Mill',          cis: 7.9, x: 46, y: 55 },
  { name: 'Springs',             cis: 7.7, x: 78, y: 38 },
  { name: 'Montauk',             cis: 7.2, x: 90, y: 52 },
  { name: 'Hampton Bays',        cis: 6.8, x: 22, y: 55 },
];

// ─── Services grid ────────────────────────────────────────────────────────────
const SERVICES = [
  { title: 'Estate Advisory',      desc: 'Generational planning, off-market access, and fiduciary-grade counsel for significant holdings.' },
  { title: 'Art-Secured Lending',  desc: 'Liquidity solutions backed by fine art and collectibles — without requiring a sale.' },
  { title: 'Global Network',       desc: '1,500 offices in 46 countries. Every Christie\'s buyer and seller is a potential Hamptons connection.' },
];

// ─── Print stylesheet ─────────────────────────────────────────────────────────
const PRINT_STYLE = `
@media print {
  @page {
    size: landscape;
    margin: 0.25in;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  .no-print { display: none !important; }
  .card-sheet {
    display: flex !important;
    flex-direction: column !important;
    gap: 0 !important;
  }
  .card-row {
    display: flex !important;
    width: 100% !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  .card-row + .card-row {
    border-top: 0.5pt dashed rgba(200,172,120,0.3);
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
  a[href]::after { content: none !important; }
  html, body, #root { background: ${NAVY} !important; margin: 0 !important; padding: 0 !important; }
}
@media screen {
  .card-sheet { max-width: 1100px; margin: 0 auto; padding: 24px; }
}
`;

export default function NeighborhoodCardPage() {
  const [downloading, setDownloading] = useState(false);


  return (
    <div
      id="neighborhood-card-root"
      style={{ background: NAVY, minHeight: '100vh', fontFamily: '"Barlow Condensed", sans-serif' }}
    >
      <style>{PRINT_STYLE}</style>

      {/* ── Download bar (screen only) ─────────────────────────────────────── */}
      {true && (
        <div
          style={{
            background: '#0d1f3c',
            borderBottom: `1px solid rgba(200,172,120,0.3)`,
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={LOGO_WHITE} alt="Christie's" style={{ height: 20 }} />
            <span style={{ color: CREAM, fontSize: 13, letterSpacing: '0.06em' }}>
              Neighborhood Card
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                background: 'transparent',
                border: `1px solid ${GOLD}`,
                color: GOLD,
                padding: '5px 16px',
                fontSize: 11,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                fontFamily: '"Barlow Condensed", sans-serif',
                textTransform: 'uppercase',
              }}
            >
              ↑ Open &amp; Print
            </button>
            <button
              onClick={() => window.print()}
              disabled={downloading}
              style={{
                background: GOLD,
                border: 'none',
                color: NAVY,
                padding: '5px 16px',
                fontSize: 11,
                letterSpacing: '0.1em',
                cursor: downloading ? 'wait' : 'pointer',
                fontFamily: '"Barlow Condensed", sans-serif',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              {downloading ? 'Generating…' : '↓ Download PDF'}
            </button>
          </div>
        </div>
      )}

      {/* ── Card sheet: front + back stacked vertically ───────────────────── */}
      <div className="card-sheet">

        {/* ══ FRONT OF CARD ══════════════════════════════════════════════════ */}
        <div
          className="card-row"
          style={{
            background: NAVY,
            display: 'flex',
            height: 280,
            overflow: 'hidden',
            borderBottom: `1px solid rgba(200,172,120,0.15)`,
          }}
        >
          {/* Left: Map zone with hamlet strip */}
          <div
            style={{
              flex: '1 1 55%',
              position: 'relative',
              background: `linear-gradient(135deg, #0a1628 0%, #112040 40%, #0d2a4a 70%, #0a1628 100%)`,
              overflow: 'hidden',
              borderRight: `1px solid rgba(200,172,120,0.2)`,
            }}
          >
            {/* Subtle grid overlay to suggest map */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `
                linear-gradient(rgba(200,172,120,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200,172,120,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }} />
            {/* "EAST END" watermark */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 48, fontWeight: 700, letterSpacing: '0.3em',
              color: 'rgba(200,172,120,0.04)',
              whiteSpace: 'nowrap', pointerEvents: 'none',
              fontFamily: '"Barlow Condensed", sans-serif',
              textTransform: 'uppercase',
            }}>EAST END</div>
            {/* Map placeholder label */}
            <div style={{
              position: 'absolute', bottom: 8, left: 10,
              fontSize: 7, color: 'rgba(200,172,120,0.35)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: '"Barlow Condensed", sans-serif',
            }}>
              East End · Hamptons · Since 1766
            </div>
            {/* Hamlet tier badges positioned on map */}
            {HAMLET_POSITIONS.map((h) => (
              <div
                key={h.name}
                style={{
                  position: 'absolute',
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <div style={{
                  fontSize: 5.5,
                  color: GOLD,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  textShadow: `0 0 4px ${NAVY}`,
                }}>
                  {h.name}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Header + hamlet strip + market line */}
          <div
            style={{
              flex: '1 1 45%',
              display: 'flex',
              flexDirection: 'column',
              background: NAVY,
            }}
          >
            {/* Christie's wordmark top bar */}
            <div style={{
              background: '#0d1f3c',
              borderBottom: `1px solid rgba(200,172,120,0.3)`,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <img src={LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 18 }} />
              <div style={{
                fontSize: 7,
                color: GOLD,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontFamily: '"Barlow Condensed", sans-serif',
              }}>
                Est. 1766
              </div>
            </div>

            {/* Market headline */}
            <div style={{ padding: '10px 14px 6px' }}>
              <div style={{
                fontSize: 8,
                color: GOLD,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: '"Barlow Condensed", sans-serif',
                marginBottom: 4,
              }}>
                Hamptons Median · East End · At Record Levels
              </div>
              <div style={{
                fontSize: 11,
                color: CREAM,
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                lineHeight: 1.3,
              }}>
                Top Four Hamlets by Median Price
              </div>
            </div>

            {/* Hamlet strip — top 4 */}
            <div style={{ flex: 1, padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
              {TOP_HAMLETS.map((h) => (
                <div
                  key={h.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderBottom: `0.5px solid rgba(200,172,120,0.15)`,
                    paddingBottom: 5,
                  }}
                >

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 10,
                      color: CREAM,
                      fontFamily: '"Barlow Condensed", sans-serif',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      {h.name}
                    </div>
                    <div style={{
                      fontSize: 8,
                      color: GOLD,
                      fontFamily: '"Barlow Condensed", sans-serif',
                      letterSpacing: '0.04em',
                    }}>
                      Median {h.median}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom: Ed Bruehl + QR */}
            <div style={{
              borderTop: `1px solid rgba(200,172,120,0.2)`,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 9, color: CREAM, fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.06em' }}>
                  Ed Bruehl · Managing Director
                </div>
                <div style={{ fontSize: 7.5, color: MUTED, fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.04em' }}>
                  Christie's International Real Estate Group · Est. 1766
                </div>
              </div>
              <img
                src={QR_MARKET}
                alt="QR → christiesrealestategroupeh.com/market"
                style={{ width: 40, height: 40, flexShrink: 0 }}
              />
            </div>
          </div>
        </div>

        {/* ── Cut line label (screen only) ──────────────────────────────────── */}
        <div
          className="no-print"
          style={{
            textAlign: 'center',
            padding: '6px 0',
            fontSize: 9,
            color: 'rgba(200,172,120,0.35)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: '"Barlow Condensed", sans-serif',
            borderTop: `1px dashed rgba(200,172,120,0.2)`,
            borderBottom: `1px dashed rgba(200,172,120,0.2)`,
          }}
        >
          ✂ Cut here · Fold in half for double-sided card
        </div>

        {/* ══ BACK OF CARD ══════════════════════════════════════════════════ */}
        <div
          className="card-row"
          style={{
            background: CREAM,
            display: 'flex',
            height: 280,
            overflow: 'hidden',
          }}
        >
          {/* Left: Christie's wordmark + creed quote */}
          <div
            style={{
              flex: '1 1 50%',
              background: NAVY,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '20px 24px',
              borderRight: `1px solid rgba(200,172,120,0.2)`,
            }}
          >
            {/* Christie's wordmark */}
            <img
              src={LOGO_WHITE}
              alt="Christie's International Real Estate Group"
              style={{ height: 20, width: 'auto', marginBottom: 16, objectFit: 'contain', objectPosition: 'left' }}
            />

            {/* Creed quote */}
            <div style={{
              borderLeft: `2px solid ${GOLD}`,
              paddingLeft: 12,
              marginBottom: 14,
            }}>
              <div style={{
                fontSize: 11,
                color: CREAM,
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                lineHeight: 1.55,
                marginBottom: 8,
              }}>
                "The standard we carry is the same standard James Christie built in 1766: tell the truth, know the territory, and sit on the same side of the table as the family. Christie's brings a depth of service that begins where the closing table ends."
              </div>
              <div style={{
                fontSize: 8,
                color: GOLD,
                fontFamily: '"Barlow Condensed", sans-serif',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                Ed Bruehl · Managing Director · Christie's East Hampton
              </div>
            </div>

            {/* Christie's East Hampton header */}
            <div style={{
              fontSize: 7,
              color: 'rgba(200,172,120,0.5)',
              fontFamily: '"Barlow Condensed", sans-serif',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              Christie's East Hampton
            </div>
          </div>

          {/* Right: Services grid + contact */}
          <div
            style={{
              flex: '1 1 50%',
              background: CREAM,
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 20px',
            }}
          >
            {/* Services header */}
            <div style={{
              fontSize: 7.5,
              color: RED,
              fontFamily: '"Barlow Condensed", sans-serif',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 10,
              borderBottom: `0.5px solid rgba(139,28,28,0.2)`,
              paddingBottom: 6,
            }}>
              Advisory Services
            </div>

            {/* Three-column services grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10,
              flex: 1,
              marginBottom: 12,
            }}>
              {SERVICES.map((s) => (
                <div key={s.title}>
                  <div style={{
                    fontSize: 8.5,
                    color: NAVY,
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                    borderBottom: `1px solid ${GOLD}`,
                    paddingBottom: 3,
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontSize: 8,
                    color: '#555',
                    fontFamily: '"Barlow Condensed", sans-serif',
                    lineHeight: 1.4,
                  }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact block */}
            <div style={{
              borderTop: `0.5px solid rgba(139,28,28,0.2)`,
              paddingTop: 8,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}>
                <div>
                  <div style={{
                    fontSize: 9,
                    color: NAVY,
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    marginBottom: 3,
                  }}>
                    Ed Bruehl · Managing Director
                  </div>
                  <div style={{
                    fontSize: 7.5,
                    color: '#666',
                    fontFamily: '"Barlow Condensed", sans-serif',
                    lineHeight: 1.5,
                  }}>
                    26 Park Place · East Hampton, NY 11937<br />
                    646.752.1233 · edbruehl@christiesrealestategroup.com
                  </div>
                  <div style={{
                    fontSize: 7,
                    color: RED,
                    fontFamily: '"Barlow Condensed", sans-serif',
                    letterSpacing: '0.08em',
                    marginTop: 3,
                  }}>
                    christiesrealestategroupeh.com
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                  <img
                    src={QR_MARKET}
                    alt="QR → christiesrealestategroupeh.com/market"
                    style={{ width: 44, height: 44 }}
                  />
                  <div style={{
                    fontSize: 6,
                    color: MUTED,
                    fontFamily: '"Barlow Condensed", sans-serif',
                    letterSpacing: '0.06em',
                    textAlign: 'center',
                  }}>
                    Market Report
                  </div>
                </div>
              </div>
            </div>

            {/* Christie's logo bottom-right */}
            <div style={{
              marginTop: 8,
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <img src={LOGO_BLACK} alt="Christie's" style={{ height: 14, opacity: 0.4 }} />
            </div>
          </div>
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
