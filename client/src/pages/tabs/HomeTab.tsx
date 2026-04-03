/**
 * HOME TAB — Three sections only.
 *
 * Section A · Full-bleed hero — auction room background.
 *             Left column: portrait thumbnail (top) + identity card (below).
 *             Right column: founding letter — FIRST TEXT ABOVE THE FOLD.
 *             Portrait click → navigates to /report.
 *
 * Section B · Christie's channel · story · video · gallery — calm, private-wealth.
 *
 * Section C · Footer — one line only. "Art. Beauty. Provenance. · Since 1766."
 *
 * HOME = the door.  /report = the room.
 *
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (body) · Barlow Condensed (labels)
 */

import { useLocation } from 'wouter';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY, GALLERY_IMAGES, AUCTION_LOT_LIBRARY } from '@/lib/cdn-assets';

const FOUNDING_PARAGRAPHS = [
  "Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.",
  "The South Fork is not a market. It is a territory — ten distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.",
  "This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.",
  "The Christie's Intelligence Score is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.",
  "The ten hamlets of the South Fork represent the most concentrated wealth corridor in the northeastern United States. East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton Village. Sag Harbor. Amagansett. Springs. East Hampton Town. Montauk. Each one has a story. Each one has a price. Each one has a buyer.",
  "Christie's East Hampton is not a brokerage. It is a standard. The auction house has been the authority on provenance, value, and discretion for 260 years. That authority now extends to the South Fork.",
  "The families who built this territory deserve representation that matches the weight of their decisions. Not a pitch. Not a presentation. A system. A process that has been tested, scored, and proven.",
  "Every export from this platform — every market report, every deal brief, every CMA — carries the Christie's name because it has earned the right to carry it. The standard is not aspirational. It is operational.",
  "Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.",
];

// ─── Section A · Hero ─────────────────────────────────────────────────────────
function SectionA() {
  const [, navigate] = useLocation();

  const auctionRoomSrc = GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src
    ?? GALLERY_IMAGES[0]?.src
    ?? '';

  return (
    <section style={{ background: '#1B2A4A', borderBottom: '1px solid rgba(200,172,120,0.3)' }}>
      <div className="relative" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <img
          src={auctionRoomSrc}
          alt="The Grand Saleroom, Christie's"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(27,42,74,0.97) 0%, rgba(27,42,74,0.88) 50%, rgba(27,42,74,0.55) 100%)'
        }} />

        <div
          className="relative flex flex-col md:grid"
          style={{
            gridTemplateColumns: '200px 1fr',
            gap: 0,
            minHeight: 'calc(100vh - 120px)',
            alignItems: 'start',
          }}
        >
          {/* ── LEFT COLUMN: portrait + identity card ── */}
          <div style={{ padding: '32px 20px 32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              onClick={() => navigate('/report')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              title="Tap portrait for the full Market Report"
            >
              <div style={{
                padding: 4,
                border: '2px solid #C8AC78',
                boxShadow: '0 0 0 1px rgba(200,172,120,0.3), 0 8px 32px rgba(0,0,0,0.65)',
                background: 'rgba(27,42,74,0.4)',
                display: 'inline-block',
              }}>
                <img
                  src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
                  alt="James Christie — Founder, Christie's, Est. 1766"
                  style={{
                    width: 110,
                    height: 140,
                    objectFit: 'cover',
                    objectPosition: 'center 35%',
                    display: 'block',
                  }}
                />
              </div>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#C8AC78',
                fontSize: 9,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: 9,
                textAlign: 'center',
                lineHeight: 1.5,
              }}>
                Tap for<br/>Market Report
              </div>
            </div>


          </div>

          {/* ── RIGHT COLUMN: founding letter ── */}
          <div style={{ padding: '32px 36px 32px 12px' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
              A Letter from the Desk
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#FAF8F4',
              fontWeight: 400,
              fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
              lineHeight: 1.25,
              marginBottom: 18,
              maxWidth: 560,
            }}>
              CHRISTIE'S EAST HAMPTON
            </h2>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#C8AC78',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}>
              Art. Beauty. Provenance. Since 1766.
            </div>

            <div style={{ maxWidth: 620 }}>
              {FOUNDING_PARAGRAPHS.map((para, i) => (
                <p key={i} style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  color: i === 8 ? '#C8AC78' : 'rgba(250,248,244,0.82)',
                  fontSize: '0.875rem',
                  lineHeight: 1.72,
                  marginBottom: i === 8 ? 0 : 13,
                  fontStyle: i === 8 ? 'italic' : 'normal',
                  borderLeft: i === 8 ? '2px solid rgba(200,172,120,0.4)' : 'none',
                  paddingLeft: i === 8 ? 10 : 0,
                }}>
                  {para}
                </p>
              ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(200,172,120,0.18)' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1rem', fontStyle: 'italic', marginBottom: 4 }}>
                Ed Bruehl
              </div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.65)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Managing Director · Christie's East Hampton
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section B · Christie's Channel · Story · Video · Gallery ─────────────────
// Calm, private-wealth. No grid. No tiles. No KPIs.
function SectionB() {
  const galleryImages = [
    AUCTION_LOT_LIBRARY.roomPrimary,
    AUCTION_LOT_LIBRARY.roomFallback,
    AUCTION_LOT_LIBRARY.hermesWall,
    AUCTION_LOT_LIBRARY.patekPhilippe,
    AUCTION_LOT_LIBRARY.screamingEagle,
    AUCTION_LOT_LIBRARY.hermesBirkinRed,
  ];

  return (
    <div style={{ background: '#FAF8F4' }}>

      {/* ── Christie's Story ── */}
      <div style={{ borderBottom: '1px solid rgba(27,42,74,0.08)', padding: '56px 40px', background: '#1B2A4A' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Christie's · Est. 1766
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, maxWidth: 560 }}>
            The Authority on Art, Beauty, and Provenance
          </h2>
          <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.72)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0, maxWidth: 620 }}>
            Founded in London in 1766, Christie's has conducted the sale of some of the world's greatest collections, setting hundreds of world auction records and offering a range of specialist services to its global clientele. Christie's is a name and place that speaks of extraordinary art, unparalleled service, and expertise reaching across cultures and centuries.
          </p>
        </div>
      </div>

      {/* ── Christie's Video ── */}
      <div style={{ borderBottom: '1px solid rgba(27,42,74,0.08)', padding: '56px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
            Christie's · Auction Intelligence
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, marginBottom: 24 }}>
            Bringing James Christie's Legacy to the Hamptons
          </h2>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: 760, background: '#000' }}>
            <iframe
              src="https://www.youtube.com/embed/DEVo7NabIy8"
              title="Bringing James Christie's Legacy to the Hamptons"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* ── Gallery Image Box ── */}
      <div style={{ padding: '56px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
            Christie's · Gallery
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, marginBottom: 24 }}>
            Art. Beauty. Provenance.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {galleryImages.map((src, i) => (
              <div key={i} style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#1B2A4A' }}>
                <img
                  src={src}
                  alt={`Christie's gallery ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── HomeTab ──────────────────────────────────────────────────────────────────
// SectionC (duplicate footer) removed — DashboardLayout renders the single
// "Art. Beauty. Provenance. · Since 1766." doctrine line. One footer, defined once.
export default function HomeTab() {
  return (
    <div>
      <SectionA />
      <SectionB />
    </div>
  );
}
