/**
 * HOME TAB — Three sections only.
 *
 * Section A · Full-bleed hero — auction room background, James Christie portrait
 *             floating left, founding letter beside it, quiet gold "Market Report" prompt.
 *             Portrait click → navigates to /report (the full six-section live report).
 *
 * Section B · Christie's · Auction Intelligence — 3×3 YouTube matrix.
 *
 * Section C · Footer — doctrine lines, QR, contact.
 *
 * HOME = the door.  /report = the room.
 *
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (body) · Barlow Condensed (labels)
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY, GALLERY_IMAGES } from '@/lib/cdn-assets';

// ─── YouTube Matrix data ──────────────────────────────────────────────────────
const YOUTUBE_VIDEOS = [
  { id: 'DEVo7NabIy8', title: "Bringing James Christie's Legacy to the Hamptons" },
  { id: 'FCsLbt_EgJ8', title: 'Get to Know Me — Ed Bruehl, Hamptons Real Estate' },
  { id: 'gucsKvabi_k', title: 'Uncovering Value in Hamptons Real Estate — Traveling Podcast' },
  { id: 'WhTXS0xz-Hs', title: 'Your Hamptons Real Estate Podcast Ep. 1 — Pierre Debbas Esq.' },
  { id: 'IueHmzSSMT4', title: 'Your Hamptons Real Estate Podcast Ep. 2 — Marit Molin' },
  { id: 'Vksowg9h2iQ', title: 'Your Hamptons Real Estate Podcast Ep. 3 — Brad Beyer' },
  { id: '3w7p8ZnrsdU', title: 'Found Inventory in the Hamptons — Ed Bruehl' },
  { id: 'mRHfcIzsLvc', title: '3 Essentials for Every Successful Deal — Ed Bruehl' },
  { id: 'fAPHGnmI_N4', title: 'SOLD & CLOSED: 129 Seven Ponds Road, Water Mill — 33.3 Acres' },
];

// ─── Section A · Hero ─────────────────────────────────────────────────────────
function SectionA() {
  const [, navigate] = useLocation();

  // Background: Christie's grand saleroom (room-primary gallery image)
  const auctionRoomSrc = GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src
    ?? GALLERY_IMAGES[0]?.src
    ?? '';

  return (
    <section style={{ background: '#1B2A4A', borderBottom: '1px solid rgba(200,172,120,0.3)' }}>
      <div className="relative" style={{ minHeight: 600 }}>
        {/* Background: grand auction room */}
        <img
          src={auctionRoomSrc}
          alt="The Grand Saleroom, Christie's"
          className="w-full object-cover object-center"
          style={{ minHeight: 600, maxHeight: 700, display: 'block' }}
        />
        {/* Overlay — heavy left, fades right */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(27,42,74,0.95) 0%, rgba(27,42,74,0.78) 42%, rgba(27,42,74,0.18) 100%)'
        }} />

        {/* Floating left panel */}
        <div
          className="absolute top-0 left-0 bottom-0 flex flex-col justify-start px-8 py-10 overflow-y-auto"
          style={{ maxWidth: 520, width: '100%' }}
        >
          {/* ── Portrait — standalone, above everything, unobstructed ── */}
          <div
            onClick={() => navigate('/report')}
            style={{ cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28, alignSelf: 'flex-start' }}
            title="Tap portrait for the full Market Report"
          >
            {/* Gold outer frame */}
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
                  objectPosition: 'center 15%',
                  display: 'block',
                }}
              />
            </div>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#C8AC78',
              fontSize: 9,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginTop: 9,
              textAlign: 'center',
            }}>
              Market Report
            </div>
          </div>

          {/* Identity card — CFS-matched typography */}
          <div style={{
            background: 'rgba(250,248,244,0.06)',
            border: '1px solid rgba(200,172,120,0.22)',
            padding: '32px 36px',
            backdropFilter: 'blur(6px)',
            marginBottom: 20,
          }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>
              Christie's · Est. 1766
            </div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', lineHeight: 1.2, margin: '0 0 20px' }}>
              Christie's East Hampton
            </h1>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.7)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
              Managing Director
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontWeight: 600, fontSize: '0.9375rem', marginBottom: 16 }}>
              Ed Bruehl
            </div>
            <div style={{ height: 1, background: 'rgba(200,172,120,0.18)', marginBottom: 16 }} />
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.45)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
              Christie's International Real Estate Group
            </div>
          </div>

          {/* Founding letter — below identity card, still over hero */}
          <div style={{ marginTop: 20, paddingRight: 8 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
              A Letter from the Desk
            </div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.3, marginBottom: 16 }}>
              Always the Family's Interest Before the Sale. The Name Follows.
            </h2>
            {[
              "Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.",
              "The South Fork is not a market. It is a territory — nine distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.",
              "This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.",
              "The ANEW framework is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.",
              "The nine hamlets of the South Fork represent the most concentrated wealth corridor in the northeastern United States. East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton. Sag Harbor. Amagansett. Springs. Montauk. Each one has a story. Each one has a price. Each one has a buyer.",
              "Christie's East Hampton is not a brokerage. It is a standard. The auction house has been the authority on provenance, value, and discretion for 260 years. That authority now extends to the South Fork.",
              "The families who built this territory deserve representation that matches the weight of their decisions. Not a pitch. Not a presentation. A system. A process that has been tested, scored, and proven.",
              "Every export from this platform — every market report, every deal brief, every CMA — carries the Christie's name because it has earned the right to carry it. The standard is not aspirational. It is operational.",
              "Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.",
            ].map((para, i) => (
              <p key={i} style={{
                fontFamily: '"Source Sans 3", sans-serif',
                color: i === 8 ? '#C8AC78' : 'rgba(250,248,244,0.78)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                marginBottom: i === 8 ? 0 : 14,
                fontStyle: i === 8 ? 'italic' : 'normal',
                borderLeft: i === 8 ? '2px solid rgba(200,172,120,0.4)' : 'none',
                paddingLeft: i === 8 ? 10 : 0,
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section B · Auction Intelligence 3×3 ────────────────────────────────────
function SectionB() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section style={{ background: '#FAF8F4', borderBottom: '1px solid rgba(27,42,74,0.1)' }}>
      <div className="px-6 py-10" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 6 }}>
          Christie's · Auction Intelligence
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 400, fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', lineHeight: 1.3, marginBottom: 24 }}>
          Christie's East Hampton · Video Intelligence
        </h2>

        {/* 3×3 grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {YOUTUBE_VIDEOS.map(v => (
            <div key={v.id} style={{ background: '#000', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
              {playing === v.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}?autoplay=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <button
                  onClick={() => setPlaying(v.id)}
                  className="w-full h-full block"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', position: 'relative' }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(27,42,74,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(200,172,120,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="#1B2A4A"><polygon points="5,3 13,8 5,13"/></svg>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(27,42,74,0.85))', padding: '20px 10px 8px', fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(250,248,244,0.85)', fontSize: 10, letterSpacing: '0.06em', lineHeight: 1.3 }}>
                    {v.title}
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section C · Footer ───────────────────────────────────────────────────────
function SectionC() {
  return (
    <footer style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.2)' }}>
      <div className="px-6 py-10" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Doctrine lines */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.05rem', lineHeight: 1.5, marginBottom: 6 }}>
            Always the Family's Interest Before the Sale. The Name Follows.
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: 'rgba(250,248,244,0.55)', fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.5 }}>
            The standard is not aspirational. It is operational.
          </div>
        </div>

        {/* Gold rule */}
        <div style={{ height: 1, background: 'rgba(200,172,120,0.25)', marginBottom: 24 }} />

        {/* Contact + QR */}
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
              Christie's East Hampton Office
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              26 Park Place, East Hampton, NY 11937<br />
              646-752-1233<br />
              <a href="https://christiesrealestategroupeh.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C8AC78', textDecoration: 'none' }}>
                christiesrealestategroupeh.com
              </a>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/115914870/VlFbBxmLFqDOBmRb.png"
              alt="QR — linktr.ee/edbruehlrealestate"
              style={{ width: 72, height: 72, display: 'block', marginBottom: 6 }}
            />
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.6)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Linktree
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ marginTop: 24, fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(250,248,244,0.25)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          © 2026 Christie's International Real Estate Group · East Hampton Flagship
        </div>
      </div>
    </footer>
  );
}

// ─── HomeTab export ───────────────────────────────────────────────────────────
export default function HomeTab() {
  return (
    <div>
      <SectionA />
      <SectionB />
      <SectionC />
    </div>
  );
}
