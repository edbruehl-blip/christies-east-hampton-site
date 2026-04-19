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
 *
 * William audio RETIRED permanently Apr 18 2026 — C5 dispatch ruling.
 * All TTS/ElevenLabs code paths removed. INTRO button keeps printable letter behavior.
 */

import { useLocation } from 'wouter';
import { EmbedFrame } from '@/components/EmbedFrame';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY, GALLERY_IMAGES } from '@/lib/cdn-assets';
// AuctionHouseServices import removed B2 Apr 18 2026 — component moved to /report
// WilliamAudioPlayer removed C5 Apr 18 2026 — audio permanently retired
// EstateAdvisoryCard removed — no longer used in HomeTab after B2/C5 cleanup
// pdf-exports jsPDF functions removed in SD-8 — all PDF exports now use Puppeteer /api/pdf

// Twelve paragraphs — council-approved final version (Sprint 32, April 8, 2026)
const FOUNDING_PARAGRAPHS = [
  "For twenty years on the East End — raising a family, working alongside some of the sharpest minds on earth — this place taught me one clear lesson — the families who love it most are the ones who protect and preserve it.",
  "That devotion to stewardship is what made me most curious. Over time, working across the East End, I found myself wondering whether there was a better way to serve the people who trust us with what they own.",
  "The deeper I looked, the clearer the answer became. In 1766, James Christie built a 260-year institution not by moving assets, but by helping people understand the true value of what they own before deciding what to do with it.",
  "After a year of studying the institution — and understanding what it stood for — I was honored to be invited in and named Managing Director, serving the families of this community.",
  "Most people are taught to transact. The families who build lasting wealth learn to hold, structure, and borrow against it instead. They hold. They rent for income. They structure inside an LLC and improve it over time. They pass it forward. Real estate here is not inventory — it is legacy.",
  "Christie's expands what we can do together — art appraisals, collection management, art-secured lending, and estate continuity across generations. A depth of service that begins where most real estate conversations end.",
  "Christie's events — auctions, private sales, collector evenings — are more accessible than most people realize. We can make the introduction — Christie's network spans specialists, advisors, and relationships in over fifty countries.",
  "When a transaction is the right decision, the role remains the same — uncover every layer of value before the market sees it, then represent it at the highest level.",
  "Everything I found along the way — the people, the relationships, and the institutional access Christie's carries — is something I now get to share with this community.",
  "This is not a high-volume brokerage. It is a practice built for the families of the East End who want to be understood before they are advised.",
  "Behind every conversation we have, there is a system verifying every number and every relationship in real time — so when we sit down together, nothing is guessed.",
  "The door is always open — we look forward to meeting you.",
];

// ─── Section A · Hero ─────────────────────────────────────────────────────────
// William audio RETIRED permanently Apr 18 2026 — C5 dispatch ruling
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
          background: 'rgba(27,42,74,0.90)'
        }} />

        {/* Centered wrapper — max 920px, horizontally centered */}
        <div className="relative" style={{ display: 'flex', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '0 16px' }}>
        <div
          className="flex flex-col md:grid"
          style={{
            gridTemplateColumns: '200px 1fr',
            gap: 0,
            width: '100%',
            maxWidth: 920,
            alignItems: 'start',
          }}
        >
          {/* ── LEFT COLUMN: portrait + identity card ── */}
          {/* Doctrine 43 / Sprint 11: portrait top-aligned with letter text */}
          <div style={{ padding: '20px 20px 20px 28px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
            <div
              onClick={() => navigate('/report')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
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
                  className="block"
                  style={{
                    width: 'clamp(90px, 14vw, 130px)',
                    height: 'clamp(115px, 18vw, 165px)',
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
          <div className="home-letter-col" style={{ padding: '20px 36px 32px 12px' }}>
            {/* Mobile-only: float portrait left so letter text wraps around it */}
            <div className="md:hidden" style={{ float: 'left', marginRight: 14, marginBottom: 8, marginTop: 2 }}>
              <div style={{ padding: 3, border: '2px solid #C8AC78', boxShadow: '0 0 0 1px rgba(200,172,120,0.3)', background: 'rgba(27,42,74,0.4)', display: 'inline-block' }}>
                <img
                  src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
                  alt="James Christie — Founder, Christie's, Est. 1766"
                  style={{ width: 72, height: 92, objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }}
                />
              </div>
            </div>
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
                  color: i === 11 ? '#C8AC78' : 'rgba(250,248,244,0.82)',
                  fontSize: '0.875rem',
                  lineHeight: 1.72,
                  marginBottom: i === 11 ? 0 : 13,
                  fontStyle: i === 11 ? 'italic' : 'normal',
                  borderLeft: i === 11 ? '2px solid rgba(200,172,120,0.4)' : 'none',
                  paddingLeft: i === 11 ? 10 : 0,
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

            {/* ── INTRO BUTTONS — PDF download + printable letter (William audio RETIRED C5) ── */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, marginBottom: 32 }}>
              <button
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = '/api/pdf?url=/letters/christies';
                  a.download = 'Christies_EH_Letter_' + new Date().toISOString().slice(0,10) + '.pdf';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 20px',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#FAF8F4',
                  background: 'rgba(200,172,120,0.08)',
                  border: '1px solid rgba(200,172,120,0.5)',
                  cursor: 'pointer',
                }}
              >
                ↓ Download Christie's Letter · PDF
              </button>
              <a
                href="/letters/christies"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 20px',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#C8AC78',
                  background: 'transparent',
                  border: '1px solid rgba(200,172,120,0.35)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                ↗ Open &amp; Print
              </a>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ─── Section BB · Christie's Channel · Story · Video · Gallery ─────────────────
// Calm, private-wealth. No grid. No tiles. No KPIs.
function SectionB() {
  return (
    <div style={{ background: '#1B2A4A' }}>

      {/* ── Christie's Story ── */}
      <div style={{ borderBottom: '1px solid rgba(200,172,120,0.15)', padding: '56px 40px' }}>
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
      <div style={{ borderBottom: '1px solid rgba(200,172,120,0.15)', padding: '56px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
            Christie's · Auction Intelligence
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, marginBottom: 24 }}>
            Bringing James Christie's Legacy to the Hamptons
          </h2>
          <EmbedFrame aspectRatio="56.25%" style={{ maxWidth: 760 }}>
            <iframe
              src="https://www.youtube.com/embed/DEVo7NabIy8"
              title="Bringing James Christie's Legacy to the Hamptons"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          </EmbedFrame>
        </div>
      </div>

      {/* Gallery section removed B2 Apr 18 2026 — assets moved to /report */}

    </div>
  );
}

// SectionWilliam removed — dead code, audio player retired C5 Apr 18 2026
// ─── HomeTab ─────────────────────────────────────────────────────────────────────────────
// SectionC (duplicate footer) removed — DashboardLayout renders the single
// "Art. Beauty. Provenance. · Since 1766." doctrine line. One footer, defined once.

// ─── Bike Card section (A1) ──────────────────────────────────────────────────
function BikeCardSection() {
  return (
    <div style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.15)', padding: '56px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
          Christie's East Hampton · Neighborhood Intelligence
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, marginBottom: 12, maxWidth: 560 }}>
          The Neighborhood Card
        </h2>
        <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 20, maxWidth: 560 }}>
          Eleven hamlets. One standard. CIS-ranked intelligence for every neighborhood on the East End — formatted for print, leave-behind, and client conversation.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="/cards/bike"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 20px',
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#FAF8F4',
              background: 'rgba(200,172,120,0.08)',
              border: '1px solid rgba(200,172,120,0.5)',
              cursor: 'pointer', textDecoration: 'none',
            }}
          >
            ↗ View Neighborhood Card
          </a>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = '/api/pdf?url=/cards/bike';
              a.download = 'Christies_EH_Neighborhood_Card_' + new Date().toISOString().slice(0,10) + '.pdf';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 20px',
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#C8AC78',
              background: 'transparent',
              border: '1px solid rgba(200,172,120,0.35)',
              cursor: 'pointer',
            }}
          >
            ↓ Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HomeTab default export ───────────────────────────────────────────────────
export default function HomeTab() {
  return (
    <div>
      <SectionA />
      <SectionB />
      {/* BikeCardSection hidden V6 Apr 18 2026 — Ponder delivers Neighborhood Card PDF mockup Sunday Apr 19; unhide when asset is ready */}
      {/* <BikeCardSection /> */}
    </div>
  );
}
