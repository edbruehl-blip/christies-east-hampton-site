/**
 * HOME TAB — Three sections only.
 *
 * Section A  ·  Full-bleed hero — auction room background.
 *             Left column: portrait thumbnail (top) + identity card (below).
 *             Right column: founding letter — FIRST TEXT ABOVE THE FOLD.
 *             Portrait click → navigates to /report.
 *
 * Section B  ·  Christie's channel  ·  story  ·  video  ·  gallery — calm, private-wealth.
 *
 * Section C  ·  Footer — one line only. "Art. Beauty. Provenance.  ·  Since 1766."
 *
 * HOME = the door.  /report = the room.
 *
 * Design: navy #1B2A4A  ·  gold #C8AC78  ·  charcoal #384249  ·  cream #FAF8F4
 * Typography: Cormorant Garamond (titles)  ·  Source Sans 3 (body)  ·  Barlow Condensed (labels)
 *
 * William audio RETIRED permanently Apr 18 2026 — C5 dispatch ruling.
 * All TTS/ElevenLabs code paths removed. INTRO button keeps printable letter behavior.
 */

import { useLocation } from 'wouter';
import { GALLERY_IMAGES, JAMES_CHRISTIE_PORTRAIT_PRIMARY } from '@/lib/cdn-assets';
// AuctionHouseServices import removed B2 Apr 18 2026 — component moved to /report
// WilliamAudioPlayer removed C5 Apr 18 2026 — audio permanently retired
// EstateAdvisoryCard removed — no longer used in HomeTab after B2/C5 cleanup
// pdf-exports jsPDF functions removed in SD-8 — all PDF exports now use Puppeteer /api/pdf

// Neighborhood Letter v15 — council-locked April 21 2026 (Addendum 5 dispatch)
// James Christie portrait restored Apr 21 2026 — Addendum dispatch (portrait left, letter right)
// CTA hover state upgraded Apr 21 2026 — gold fill on hover, navy text
// Em-dashes in P2, P9, P10 are intentional — do not strip.
// "Standard" capitalization is intentional voice architecture — P5 lowercase → P7/P9 capital.
const FOUNDING_PARAGRAPHS = [
  "Many of you have known me for years. Some remember when I left Morgan Stanley after 9/11 and moved to the East End to raise a family. We came for the land, the water, and the pace. We stayed because this place became home.",
  "For twenty years, I've been helping families buy and sell — but mostly steward — property here. The lesson, over and over, is simple. The families who love this place most are the ones who protect it first. Real estate on the East End is not inventory. For our families, it is legacy. The asset your grandchildren will thank you for.",
  "My favorite piece of advice, after all these years: never sell Hamptons real estate. Hold it. Improve it. Structure it. Pass it down. Let it compound across generations. If the timing is truly right to sell, we prepare it properly, market it professionally, and price it to win or continue holding.",
  "I underwrite property the way I once analyzed portfolios on Wall Street. Replacement cost, comparable performance, exit scenarios. Most agents price on emotion. We help families understand value first, and sell only when it is the best long-term strategy.",
  "That instinct led me to Christie's. James Christie, in 1766, held his first sale in London on one idea — and it became the standard that has carried his name forward ever since. Help people understand the true value of what they own before deciding what to do with it. He did not build an auction house. He built a way of handling objects, and families, and homes that has carried over 250 years.",
  "I am grateful to be chosen as Managing Director of Christie's International Real Estate Group, East Hampton Flagship, at 26 Park Place. From here, three worlds converge. Christie's London heritage. Our Rockefeller Center NYC auction house. And the Hamptons, one of the most significant luxury markets on earth. Across 1,000 offices in 52 countries, the rule is simple. Service first. Your interests first. Always.",
  "What the Standard brings begins where most real estate conversations end. Art appraisals. Art-secured lending. Estate continuity across generations. Specialists in fine art, jewelry, watches, wine, and automobiles join your team. When you sell, your property reaches collectors. When you buy, our global network brings new product home. But mostly, the work is stewardship.",
  "Christie's auction house events are more accessible than most people realize. NYC auctions, private sales, and collector evenings come right to your inbox when you join our list. And right here in East Hampton, we host our own. Each week we record the Hamptons Real Estate Podcast, featuring the people shaping this community. Each month we gather to spotlight local artists and mentors whose work deserves a larger stage.",
  "I am honored to carry the Christie's Standard forward here, with energy and care — intelligent, compassionate, patient counsel for the families of the East End who prefer to be understood before they're advised.",
  "We look forward to seeing you soon. Swing by 26 Park Place — next to John Papas — for coffee or a Yerba Madre. Bring a friend, a mentor, or someone you'd like us to meet, or put on the podcast.",
  "The flagship is awakening.",
];

// ─── Section A  ·  Hero ─────────────────────────────────────────────────────────
// William audio RETIRED permanently Apr 18 2026 — C5 dispatch ruling
function SectionA() {
  const [, navigate] = useLocation();

  const auctionRoomSrc = GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src
    ?? GALLERY_IMAGES[0]?.src
    ?? '';

  return (
    <section style={{ background: '#1B2A4A', borderBottom: '1px solid rgba(200,172,120,0.3)' }}>
      <div className="relative">
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
        <div className="relative" style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px 48px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 920,
          }}
        >
          {/* ── TWO-COLUMN: portrait left · letter right ── */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>

            {/* ── LEFT: James Christie portrait — provenance marker ── */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
              <div style={{ border: '1px solid #947231', padding: 3, background: 'rgba(27,42,74,0.6)' }}>
                <img
                  src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
                  alt="James Christie, founder of Christie's, London 1766"
                  style={{ display: 'block', width: 128, height: 128, objectFit: 'cover', objectPosition: 'top center' }}
                />
              </div>
              <div style={{
                fontFamily: '"Georgia", serif',
                fontStyle: 'italic',
                fontSize: 9,
                color: '#947231',
                letterSpacing: '1px',
                textAlign: 'center',
                marginTop: 6,
                lineHeight: 1.5,
              }}>
                James Christie · London · 1766
              </div>
            </div>

            {/* ── RIGHT: letter ── */}
          <div className="home-letter-col" style={{ flex: 1, minWidth: 0, padding: '4px 0 32px 0' }}>
            {/* Option 1 header — single line, personal, full stop */}
            <div style={{ marginBottom: 22 }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#FAF8F4',
                fontWeight: 400,
                fontSize: 'clamp(1.1rem, 2vw, 1.45rem)',
                lineHeight: 1.2,
                marginBottom: 4,
              }}>
                A Letter from the Christie's East Hampton Flagship
              </div>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(200,172,120,0.75)',
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>
                East Hampton · New York
              </div>
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

            {/* ── Signature ── */}
            <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid rgba(200,172,120,0.18)' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1rem', fontStyle: 'italic', marginBottom: 4 }}>
                Ed Bruehl
              </div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.65)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }}>
                Managing Director  ·  Christie's East Hampton
              </div>
              {/* Provenance close — lives at the end, after the work is done */}
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.45)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20 }}>
                Art. Beauty. Provenance. Since 1766.
              </div>
            </div>

            {/* ── CONTINUE TO MARKET REPORT button ── */}
            <div style={{ marginBottom: 32 }}>
              <button
                onClick={() => navigate('/report')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 24px',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C8AC78',
                  background: 'transparent',
                  border: '1px solid rgba(200,172,120,0.5)',
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#C8AC78';
                  (e.currentTarget as HTMLButtonElement).style.color = '#1B2A4A';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#C8AC78';
                }}
              >
                CONTINUE TO MARKET REPORT →
              </button>
            </div>
          </div>
          {/* /home-letter-col */}
          </div>
          {/* /two-col wrapper */}
        </div>
        {/* /centered-wrapper */}
        </div>
        {/* /relative minHeight */}
      </div>
    </section>
  );
}
// ─── Section BB  ·  Christie's Channel  ·  Story  ·  Video  ·  Gallery ─────────────────
// Calm, private-wealth. No grid. No tiles. No KPIs.
function SectionB() {
  return (
    <div style={{ background: '#1B2A4A' }}>

      {/* ── Christie's Story ── */}
      <div style={{ borderBottom: '1px solid rgba(200,172,120,0.15)', padding: '56px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Christie's  ·  Est. 1766
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, maxWidth: 560 }}>
            The Authority on Art, Beauty, and Provenance
          </h2>
          <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.72)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0, maxWidth: 620 }}>
            Founded in London in 1766, Christie's has conducted the sale of some of the world's greatest collections, setting hundreds of world auction records and offering a range of specialist services to its global clientele. Christie's is a name and place that speaks of extraordinary art, unparalleled service, and expertise reaching across cultures and centuries.
          </p>
        </div>
      </div>

      {/* ── Christie's Video — YouTube embed removed Apr 21 2026; video moved to SectionVideoReel as V0 ── */}

      {/* Gallery section removed B2 Apr 18 2026 — assets moved to /report */}

    </div>
  );
}

// SectionWilliam removed — dead code, audio player retired C5 Apr 18 2026
// ─── HomeTab ─────────────────────────────────────────────────────────────────────────────
// SectionC (duplicate footer) removed — DashboardLayout renders the single
// "Art. Beauty. Provenance.  ·  Since 1766." doctrine line. One footer, defined once.

// ─── Bike Card section (A1) ──────────────────────────────────────────────────
function BikeCardSection() {
  return (
    <div style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.15)', padding: '56px 40px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
          Christie's East Hampton  ·  Neighborhood Intelligence
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

// ─── Section V  ·  Video Reel  ·  V0/V1/V2/V3  ·  Full-bleed self-hosted ─────────────
// ORDER (Apr 21 2026 reorder): V3 first (longest) → V1 → V2 → V0 (Rabbit Hole) second-to-last
// V3 = Tash Perrin (Nov 3 2025) — FIRST
// V1 = Life Less Ordinary brand reel (Apr 3 2026) — SECOND
// V2 = Christie's 250th Heritage (Jan 22 2026) — THIRD
// V0 = Ed Bruehl — James Christie Rabbit Hole (Apr 21 2026) — SECOND-TO-LAST
const VIDEO_REEL = [
  {
    key: 'v3',
    src: '/manus-storage/v3_nov3_2025_2b01a2eb.mov',
    title: 'Tash Perrin',
    label: "Christie's International Real Estate Group",
  },
  {
    key: 'v1',
    src: '/manus-storage/v1_april3_2026_7d954a08.mov',
    title: 'Life Less Ordinary',
    label: "Christie's East Hampton - Brand Reel",
  },
  {
    key: 'v2',
    src: '/manus-storage/v2_jan22_2026_3820cf1c.mov',
    title: "Christie's 250th Heritage",
    label: "Christie's - Est. 1766 - 250 Years",
  },
  {
    key: 'v0',
    src: '/manus-storage/JamesChristie-RabbitHole_79659439.mov',
    title: 'The James Christie Rabbit Hole',
    label: "Ed Bruehl  ·  Christie's East Hampton",
  },
];

function SectionVideoReel() {
  return (
    <div style={{ background: '#0D1B2A' }}>
      {VIDEO_REEL.map((v) => (
        <div
          key={v.key}
          style={{
            width: '100%',
            borderBottom: '1px solid rgba(200,172,120,0.12)',
            position: 'relative',
          }}
        >
          {/* Label overlay */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: 24,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 9,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(200,172,120,0.75)',
            }}>{v.label}</div>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1rem, 2vw, 1.4rem)',
              fontWeight: 400,
              color: '#FAF8F4',
              lineHeight: 1.2,
            }}>{v.title}</div>
          </div>
          <video
            src={v.src}
            controls
            playsInline
            preload="metadata"
            style={{
              display: 'block',
              width: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              background: '#000',
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── HomeTab default export ───────────────────────────────────────────────────
export default function HomeTab() {
  return (
    <div>
      <SectionA />
      <SectionB />
      <SectionVideoReel />
      {/* BikeCardSection hidden V6 Apr 18 2026 — Ponder delivers Neighborhood Card PDF mockup Sunday Apr 19; unhide when asset is ready */}
      {/* <BikeCardSection /> */}
    </div>
  );
}
