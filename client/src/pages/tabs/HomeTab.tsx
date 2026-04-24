/*
 * HOME TAB — Comprehensive redesign Apr 22 2026
 *
 * Section A  ·  Full-bleed hero — auction room background.
 *             Portrait floats LEFT with text wrapping around it (CSS float).
 *             Header: "CEHF" large Cormorant + gold sub-label.
 *             Font size: +10% across all body text.
 *
 * Section B  ·  Auction Image Matrix — 9-image 3×3 grid (first thing after letter)
 *
 * Section C  ·  Christie's Story — "The Authority on Art, Beauty, and Provenance"
 *
 * Section D  ·  Video Reel — Tash Perrin · Christie's 250th · Life Less Ordinary · Rabbit Hole
 *             (V1 and V2 swapped per Apr 22 dispatch)
 *
 * Section E  ·  Home Footer — Ed Bruehl signature + CTA
 *
 * Design: navy #1B2A4A · gold #947231 · cream #FAF8F4
 * Gold doctrine: ALL gold = #947231 (no rgba variants for labels — use opacity on the element)
 *
 * Poster attributes removed Apr 24 2026 (Option A: Netflix/Apple TV/CNBC standard — black frame + play button).
 * Grand Saleroom is already the hero background; do not duplicate as video poster.
 */

import { useLocation } from 'wouter';
import { GALLERY_IMAGES, JAMES_CHRISTIE_PORTRAIT_PRIMARY } from '@/lib/cdn-assets';
import { FoundingLetter } from '@/components/FoundingLetter';

// ─── TodaysBrief removed — canon-kill Apr 24 2026 (Ed ruled 10:34 PM EDT: Bloomberg or JPMorgan)
// function TodaysBrief() {
// ─── Section A  ·  Hero letter with floating portrait ──────────────────────────
function SectionA() {
  const [, navigate] = useLocation();

  const auctionRoomSrc = GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src
    ?? GALLERY_IMAGES[0]?.src
    ?? '';

  return (
    <section style={{ background: 'transparent', borderBottom: '1px solid rgba(200,172,120,0.25)' }}>
      <div className="relative">
        {/* Background image */}
        <img
          src={auctionRoomSrc}
          alt="The Grand Saleroom, Christie's"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(27,42,74,0.78)' }} />

        {/* Content wrapper — centered, max 900px */}
        <div className="relative" style={{ display: 'flex', justifyContent: 'center', padding: '28px 24px 56px' }}>
          <div style={{ width: '100%', maxWidth: 900 }}>

            {/* ── HEADER ── */}
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                fontWeight: 700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                Christie's East Hampton Flagship
              </div>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: '#947231',
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: 0.75,
              }}>
                East Hampton · New York · 11937
              </div>
            </div>

            {/* ── LETTER BODY with floating portrait ── */}
            <div style={{ maxWidth: 860, margin: '0 auto' }}>

              {/* Portrait floats left — text wraps around it */}
              <div
                style={{
                  float: 'left',
                  marginRight: 28,
                  marginBottom: 16,
                  marginTop: 4,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{ border: '1px solid #947231', padding: 3, background: 'rgba(13,27,42,0.6)', cursor: 'pointer' }}
                  onClick={() => navigate('/report')}
                  title="Continue to Market Report"
                >
                  <img
                    src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
                    alt="James Christie, founder of Christie's, London 1766"
                    style={{ display: 'block', width: 140, height: 140, objectFit: 'cover', objectPosition: 'top center' }}
                  />
                </div>
                {/* Caption line 1 — unified with letter routes: Barlow Condensed · 8px · gold · 0.16em · uppercase */}
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 8,
                  color: '#947231',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: 6,
                  lineHeight: 1.5,
                  maxWidth: 146,
                }}>
                  James Christie · London · 1766
                </div>
                {/* Caption line 2 — click to market report */}
                <div
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontSize: 8,
                    color: '#947231',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginTop: 4,
                    opacity: 0.65,
                    cursor: 'pointer',
                    maxWidth: 146,
                  }}
                  onClick={() => navigate('/report')}
                >
                  Click → Market Report
                </div>
              </div>

              {/* Letter paragraphs — flow around the float */}
              <FoundingLetter />

              {/* Clear float */}
              <div style={{ clear: 'both' }} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section B  ·  Auction Image Matrix ──────────────────────────────────────
// 9-image 3×3 grid — first thing after "The flagship is awakening."
function AuctionImageMatrix() {
  return (
    <div style={{ background: '#0D1B2A', borderTop: '1px solid rgba(200,172,120,0.12)', padding: '48px 24px 40px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: '#947231',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: 20,
          textAlign: 'center',
          opacity: 0.7,
        }}>
          Christie's · Art · Luxury · Fine Wine · Since 1766
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', /* 1 col <640px, 2 col 640-900px, 3 col >=900px */
          gap: 6,
        }}>
          {GALLERY_IMAGES.map((img) => (
            <div key={img.id} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img
                src={img.src}
                alt={img.caption}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(0.85) saturate(0.88)',
                  transition: 'filter 0.25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'brightness(1) saturate(1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'brightness(0.85) saturate(0.88)'; }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 10px 8px',
                background: 'linear-gradient(transparent, rgba(13,27,42,0.85))',
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 8,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#947231',
              }}>
                {img.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section C  ·  Christie's Story ──────────────────────────────────────────
function SectionChristiesStory() {
  return (
    <div style={{ background: 'rgba(13,27,42,0.75)', borderTop: '1px solid rgba(200,172,120,0.15)', padding: '56px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: '#947231',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: 0.75,
        }}>
          Christie's · Est. 1766
        </div>
        <h2 style={{
          fontFamily: '"Cormorant Garamond", serif',
          color: '#FAF8F4',
          fontWeight: 400,
          fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
          lineHeight: 1.25,
          maxWidth: 560,
          margin: 0,
        }}>
          The Authority on Art, Beauty, and Provenance
        </h2>
        <p style={{
          fontFamily: '"Source Sans 3", sans-serif',
          color: 'rgba(250,248,244,0.72)',
          fontSize: '0.963rem',
          lineHeight: 1.78,
          margin: 0,
          maxWidth: 640,
        }}>
          Founded in London in 1766, Christie's has conducted the sale of some of the world's greatest collections, setting hundreds of world auction records and offering a range of specialist services to its global clientele. Christie's is a name and place that speaks of extraordinary art, unparalleled service, and expertise reaching across cultures and centuries.
        </p>
      </div>
    </div>
  );
}

// ─── Section D  ·  Video Reel ─────────────────────────────────────────────────
// ORDER (Apr 22 2026 Session 3 — titles corrected per Ed's dispatch):
// 1. 250 Years of History · 2. A Life Less Ordinary · 3. Christie's Estate Services · 4. Rabbit Hole
// Poster attributes removed Apr 24 2026 (Option A): black frame + play button standard.
const VIDEO_REEL = [
  {
    key: 'v3',
    src: '/manus-storage/v3_nov3_2025_2b01a2eb.mov',
    title: '250 Years of History',
    label: "Christie's International Real Estate Group",
  },
  {
    key: 'v1',
    src: '/manus-storage/v1_april3_2026_7d954a08.mov',
    title: 'A Life Less Ordinary',
    label: "Christie's East Hampton — Life Less Ordinary",
  },
  {
    key: 'v2',
    src: '/manus-storage/v2_jan22_2026_3820cf1c.mov',
    title: "Christie's Estate Services",
    label: "Christie's — Estate & Collection Services",
  },
  {
    key: 'v0',
    src: '/manus-storage/JamesChristie-RabbitHole_79659439.mov',
    title: 'The James Christie Rabbit Hole',
    label: "Christie's East Hampton · The Standard",
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
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#947231',
              opacity: 0.8,
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
// ORDER: Letter → Image Matrix → Video Reel → Authority Block
// NOTE: SiteFooter is rendered by DashboardLayout — do NOT add it here (H1 · Shell Purge P2)
export default function HomeTab() {
  return (
    <div>
      <SectionA />
      <AuctionImageMatrix />
      <SectionVideoReel />
      <SectionChristiesStory />
    </div>
  );
}
