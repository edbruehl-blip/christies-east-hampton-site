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

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { EmbedFrame } from '@/components/EmbedFrame';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY, GALLERY_IMAGES, AUCTION_LOT_LIBRARY } from '@/lib/cdn-assets';
import { AuctionHouseServices } from '@/components/AuctionHouseServices';
// WilliamAudioPlayer removed — HOME now uses the same inline fetch-blob player as /report
import { EstateAdvisoryCard } from '@/components/EstateAdvisoryCard';
import { generateChristiesLetter, generateFlagshipLetter, generateMarketReport, generateUHNWPathCard } from '@/lib/pdf-exports';
import { trpc } from '@/lib/trpc';

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
  "The door is always open whenever you are ready to walk through it.",
];

// ─── Section A · Hero ─────────────────────────────────────────────────────────
type HomeAudioChannel = 'christies' | 'market';

function SectionA() {
  const [, navigate] = useLocation();

  const auctionRoomSrc = GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src
    ?? GALLERY_IMAGES[0]?.src
    ?? '';

  // ── Inline audio state machine (fetch-blob pattern — same as /report Section1) ──
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [audioChannel, setAudioChannel] = useState<HomeAudioChannel>('christies');
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function fmtTime(s: number) {
    if (!isFinite(s) || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  function stopAudio() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setAudioState('idle'); setAudioProgress(0); setCurrentTime(0); setAudioDuration(0);
  }

  function togglePause() {
    const a = audioRef.current;
    if (!a) return;
    if (audioState === 'playing') { a.pause(); setAudioState('paused'); }
    else if (audioState === 'paused') { a.play(); setAudioState('playing'); }
  }

  function handleRewind() {
    const a = audioRef.current;
    if (a) a.currentTime = Math.max(0, a.currentTime - 15);
  }

  function handleForward() {
    const a = audioRef.current;
    if (a) a.currentTime = Math.min(a.duration || 0, a.currentTime + 15);
  }

  function handleShare() {
    const ep = audioChannel === 'christies' ? '/api/tts/christies-letter'
      : '/api/tts/market-report';
    navigator.clipboard.writeText(window.location.origin + ep)
      .then(() => { setShareState('copied'); setTimeout(() => setShareState('idle'), 2500); })
      .catch(() => toast.error('Could not copy link.'));
  }

  function handleScrub(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
  }

  async function handleListen(channel: HomeAudioChannel) {
    if (audioState === 'playing' && audioChannel === channel) { stopAudio(); return; }
    if (audioState === 'playing' || audioState === 'loading') stopAudio();
    setAudioChannel(channel);
    setAudioState('loading');
    setAudioProgress(0);
    const endpoint = channel === 'christies' ? '/api/tts/christies-letter'
      : '/api/tts/market-report';
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`TTS error ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onloadedmetadata = () => setAudioDuration(audio.duration);
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setAudioProgress(Math.round((audio.currentTime / audio.duration) * 100));
          setCurrentTime(audio.currentTime);
        }
      };
      audio.onended = () => { setAudioState('idle'); setAudioProgress(0); setCurrentTime(0); setAudioDuration(0); URL.revokeObjectURL(url); };
      audio.onerror = () => { setAudioState('error'); toast.error('Audio playback failed.'); setTimeout(() => setAudioState('idle'), 3000); };
      await audio.play();
      setAudioState('playing');
    } catch (e) {
      console.error(e);
      setAudioState('error');
      toast.error('Audio generation failed. Please try again.');
      setTimeout(() => setAudioState('idle'), 3000);
    }
  }

  const channelLabel = audioChannel === 'christies' ? "Christie's Letter"
    : 'Market Brief';

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
          {/* Sprint 11 Item 11: portrait centered + responsive on iPhone */}
          <div style={{ padding: '28px 20px 20px 28px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
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

            {/* ── William Audio Player — inline fetch-blob pattern (same as /report) ── */}
            <div style={{ marginTop: 28, maxWidth: 520 }}>
              {/* Two trigger buttons — idle or error state (Flagship Letter moved to floating button) */}
              {(audioState === 'idle' || audioState === 'error') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {(['christies', 'market'] as const).map((ch) => {
                    const labels: Record<HomeAudioChannel, string> = {
                      christies: "Christie's Letter",
                      market: 'Market Brief',
                    };
                    return (
                      <button
                        key={ch}
                        onClick={() => handleListen(ch)}
                        style={{
                          background: 'none',
                          border: '1px solid rgba(200,172,120,0.28)',
                          color: 'rgba(200,172,120,0.75)',
                          fontFamily: '"Barlow Condensed", sans-serif',
                          fontSize: 9,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          padding: '9px 10px',
                          cursor: 'pointer',
                          lineHeight: 1.3,
                          transition: 'all 0.2s',
                        }}
                      >
                        {audioState === 'error' && audioChannel === ch ? '⚠ Retry' : `▶ ${labels[ch]}`}
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Expanded player — loading / playing / paused */}
              {(audioState === 'loading' || audioState === 'playing' || audioState === 'paused') && (
                <div style={{ border: '1px solid rgba(200,172,120,0.45)', background: 'rgba(200,172,120,0.06)', padding: '12px 16px' }}>
                  {/* Status row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {audioState === 'loading' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8AC78" strokeWidth="2.5" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 14 }}>
                          {[0.6, 1, 0.75, 1, 0.5].map((h, i) => (
                            <span key={i} style={{ display: 'block', width: 3, borderRadius: 2, background: '#C8AC78', height: `${h * 100}%`, animation: `wave-bar 0.8s ease-in-out ${i * 0.12}s infinite alternate` }} />
                          ))}
                        </div>
                      )}
                      <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        {audioState === 'loading' ? 'Synthesizing…' : channelLabel}
                      </span>
                    </div>
                    {/* Controls — only when playing or paused */}
                    {(audioState === 'playing' || audioState === 'paused') && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <button onClick={handleRewind} style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', cursor: 'pointer' }}>↺ −15</button>
                        <button onClick={togglePause} style={{ background: 'rgba(200,172,120,0.15)', border: '1px solid rgba(200,172,120,0.4)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 9px', cursor: 'pointer' }}>{audioState === 'paused' ? '▶ Resume' : '⏸ Pause'}</button>
                        <button onClick={handleForward} style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', cursor: 'pointer' }}>+15 ↻</button>
                        <button onClick={stopAudio} style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 9px', cursor: 'pointer' }}>◼ Stop</button>
                        <button onClick={handleShare} style={{ background: shareState === 'copied' ? 'rgba(5,150,105,0.15)' : 'rgba(200,172,120,0.1)', border: `1px solid ${shareState === 'copied' ? 'rgba(5,150,105,0.6)' : 'rgba(200,172,120,0.3)'}`, color: shareState === 'copied' ? '#6ee7b7' : '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', cursor: 'pointer', transition: 'all 0.2s' }}>{shareState === 'copied' ? '✓ Copied' : '↗ Share'}</button>
                      </div>
                    )}
                  </div>
                  {/* Scrub bar + time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div onClick={handleScrub} style={{ flex: 1, height: 5, background: 'rgba(200,172,120,0.15)', borderRadius: 3, overflow: 'hidden', cursor: (audioState === 'playing' || audioState === 'paused') ? 'pointer' : 'default', position: 'relative' }}>
                      <div style={{ height: '100%', background: '#C8AC78', borderRadius: 3, width: `${audioProgress}%`, transition: 'width 0.4s linear' }} />
                    </div>
                    {(audioState === 'playing' || audioState === 'paused') && audioDuration > 0 && (
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(200,172,120,0.6)', whiteSpace: 'nowrap', minWidth: 64, textAlign: 'right' }}>{fmtTime(currentTime)} / {fmtTime(audioDuration)}</span>
                    )}
                  </div>
                  {audioState === 'loading' && (
                    <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(200,172,120,0.5)', fontSize: 10, marginTop: 6, textAlign: 'center' }}>Downloading audio…</div>
                  )}
                </div>
              )}
              {/* CSS keyframes for wave-bar and spin */}
              <style>{`
                @keyframes wave-bar { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              `}</style>
            </div>
            <button
              onClick={() => generateChristiesLetter()}
              style={{
                marginTop: 16,
                marginBottom: 32,
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

      {/* ── Gallery Image Box ── */}
      <div style={{ padding: '56px 40px', borderBottom: '1px solid rgba(200,172,120,0.15)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
            Christie's · Gallery
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, marginBottom: 24 }}>
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

// ─── William Voice Note Player ─────────────────────────────────────────────────────────────────────────────
function SectionWilliam() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  // The founding letter TTS endpoint returns a fresh audio URL on each call
  const audioUrl = window.location.origin + '/api/tts/founding-letter';

  return (
    <section style={{ background: '#FAF8F4', borderTop: '1px solid rgba(27,42,74,0.08)', padding: '48px 40px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
          William · Christie’s East Hampton
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 400, fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)', lineHeight: 1.3, marginBottom: 6 }}>
          Intelligence Brief
        </h2>
        <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: 13, lineHeight: 1.6, marginBottom: 20, opacity: 0.75 }}>
          {today}
        </p>
        <WilliamAudioPlayer
          audioUrl={audioUrl}
          label="Founding Letter · Christie’s East Hampton"
        />
        <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: 11, lineHeight: 1.5, marginTop: 12, opacity: 0.5 }}>
          Tap play to hear William deliver the Christie’s East Hampton founding letter. Audio synthesised via ElevenLabs. Share button copies the MP3 URL to clipboard.
        </p>
        {/* P3 — Sprint 12: Christie’s Letter PDF export */}
        <button
          onClick={() => generateChristiesLetter()}
          style={{
            marginTop: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 20px',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#1B2A4A',
            background: 'rgba(200,172,120,0.08)',
            border: '1px solid #C8AC78',
            cursor: 'pointer',
          }}
        >
          ↓ Download Christie’s Letter · PDF
        </button>
      </div>
    </section>
  );
}

// ─── HomeTab ─────────────────────────────────────────────────────────────────────────────
// SectionC (duplicate footer) removed — DashboardLayout renders the single
// "Art. Beauty. Provenance. · Since 1766." doctrine line. One footer, defined once.
export default function HomeTab() {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [flagshipLoading, setFlagshipLoading] = useState(false);
  const { data: matrixResponse } = trpc.market.hamletMatrix.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleFlagshipLetterPdf = async () => {
    setFlagshipLoading(true);
    try {
      await generateFlagshipLetter();
    } finally {
      setFlagshipLoading(false);
    }
  };

  const handleMarketReportPdf = async () => {
    setPdfLoading(true);
    try {
      const liveRows = matrixResponse?.hamlets ?? [];
      await generateMarketReport({ liveRows: liveRows.length > 0 ? liveRows : undefined });
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div>
      <SectionA />
      <SectionB />
      {/* SectionWilliam removed — audio player now lives in SectionA below founding letter */}
      <AuctionHouseServices />

      {/* ── THE PLATFORM Section ── */}
      <div style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.2)', padding: 'clamp(80px, 10vw, 120px) 40px' }}>
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>

          {/* Title */}
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
            Christie's East Hampton
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: 'clamp(1.6rem, 3vw, 2rem)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400, marginBottom: 0 }}>
            The Platform
          </div>
          <div style={{ height: 1, background: '#C8AC78', maxWidth: 480, margin: '14px 0 40px', opacity: 0.7 }} />

          {/* Main headline */}
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', lineHeight: 1.2, fontWeight: 400, marginBottom: 48, maxWidth: 760 }}>
            This is not a real estate website. It is a live operating system.
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', marginBottom: 64 }}>

            {/* Left — intro paragraph */}
            <div>
              <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.82)', fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', lineHeight: 1.8, margin: 0 }}>
                Market intelligence. Pipeline. Relationships. Team rhythm. Content. Growth. Everything speaks to everything else in one place. If it matters, it lives here. If it is not here, it does not exist.
              </p>
            </div>

            {/* Right — six system blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

              {/* HOME */}
              <div>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Home
                </div>
                <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.7, margin: 0 }}>
                  The opening move. The letter. The market signal. William — delivering a daily brief.
                </p>
              </div>

              {/* MARKET */}
              <div>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Market
                </div>
                <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.7, margin: 0 }}>
                  All eleven hamlets scored through the Christie's Intelligence Score. Verified data. No opinion.
                </p>
              </div>

              {/* PIPE */}
              <div>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Pipe
                </div>
                <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.7, margin: 0 }}>
                  The live deal engine. Every opportunity, every status, every next step.
                </p>
              </div>

              {/* MAPS */}
              <div>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Maps
                </div>
                <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.7, margin: 0 }}>
                  Geography as usable intelligence. Hamlet data on a live map with a deal calculator.
                </p>
              </div>

              {/* INTEL */}
              <div>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Intel
                </div>
                <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.7, margin: 0 }}>
                  The spiderweb. Every relationship and institutional connection mapped for use.
                </p>
              </div>

              {/* FUTURE */}
              <div>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  Future
                </div>
                <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.65)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.7, margin: 0 }}>
                  The Ascension Arc. Sales volume by year, built agent by agent. Conservative. Structured. Real.
                </p>
              </div>

            </div>
          </div>

          {/* Bottom tagline */}
          <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(200,172,120,0.15)' }}>
            <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.45)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, letterSpacing: '0.04em' }}>
              This is not brokerage. This is an intelligence-driven estate advisory platform under the Christie's standard.
            </p>
          </div>

        </div>
      </div>

      {/* ── Collateral Cards — UHNW Wealth Card + Bike Card ── */}
      <div style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.15)', padding: '56px 40px' }}>
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
            Christie's Collateral · Print-Ready
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, marginBottom: 8 }}>
            Shareable Intelligence Cards
          </h2>
          <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: 32, maxWidth: 560 }}>
            Print-ready cards for estate conversations. Open the link, print to card stock, and share. Each card carries the Christie's standard.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

            {/* UHNW Wealth Card */}
            <div style={{ background: 'rgba(250,248,244,0.04)', border: '1px solid rgba(200,172,120,0.2)', borderTop: '3px solid #C8AC78', padding: '24px 28px' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                UHNW Wealth Card · 8.5×11 Landscape
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2, marginBottom: 8 }}>
                What James Christie Knew
              </div>
              <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 20 }}>
                The eight rungs of structured ownership — from tenant to trust. Structured capital, art-secured lending, and the Christie's standard for legacy. Print to card stock.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href="https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies_card_final_v2_f0243b24.html"
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
                    textDecoration: 'none',
                  }}
                >
                  Open &amp; Print ↗
                </a>
                <button
                  onClick={() => generateUHNWPathCard()}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '9px 20px',
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#FAF8F4',
                    background: 'rgba(200,172,120,0.08)',
                    border: '1px solid rgba(200,172,120,0.5)',
                    cursor: 'pointer',
                  }}
                >
                  ↓ Download PDF
                </button>
              </div>
            </div>

            {/* Bike Card */}
            <div style={{ background: 'rgba(250,248,244,0.04)', border: '1px solid rgba(200,172,120,0.2)', borderTop: '3px solid #C8AC78', padding: '24px 28px' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Neighborhood Card · 2 per 8.5×11 Sheet
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2, marginBottom: 8 }}>
                Christie's Neighborhood Card
              </div>
              <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 20 }}>
                East End map on the front. Ed's voice and Christie's services on the back. Hamptons Median · $2.34M · Record High. Cut horizontally — two cards per sheet.
              </p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies_neighborhood_bike_card_v2_9887d2db.html"
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
                  textDecoration: 'none',
                }}
              >
                Open &amp; Print ↗
              </a>
            </div>

            {/* Christie's Letter */}
            <div style={{ background: 'rgba(250,248,244,0.04)', border: '1px solid rgba(200,172,120,0.2)', borderTop: '3px solid #C8AC78', padding: '24px 28px' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Christie's Letter · 8.5×11 Portrait
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2, marginBottom: 8 }}>
                To the Families of the East End
              </div>
              <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 16 }}>
                Ed's founding letter on the Christie's standard — nine paragraphs, one page. Print to letterhead and hand-deliver, or text the link directly.
              </p>
              <a
                href="https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies_letter_export_v2_e2501976.html"
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
                  textDecoration: 'none',
                }}
              >
                Open &amp; Print ↗
              </a>
            </div>

            {/* Flagship Letter PDF */}
            <div style={{ background: 'rgba(250,248,244,0.04)', border: '1px solid rgba(200,172,120,0.2)', borderTop: '3px solid #C8AC78', padding: '24px 28px' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Flagship Letter · Council Document
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2, marginBottom: 8 }}>
                Christie's Flagship Letter
              </div>
              <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 16 }}>
                Origin story — platform, team, and model.
              </p>
              <button
                onClick={handleFlagshipLetterPdf}
                disabled={flagshipLoading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 20px',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#FAF8F4',
                  background: flagshipLoading ? 'rgba(200,172,120,0.04)' : 'rgba(200,172,120,0.08)',
                  border: '1px solid rgba(200,172,120,0.5)',
                  cursor: flagshipLoading ? 'wait' : 'pointer',
                  opacity: flagshipLoading ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {flagshipLoading ? 'Generating…' : '↓ Download PDF'}
              </button>
            </div>

            {/* Market Report PDF — Item 5, council-approved Apr 7 2026 */}
            <div style={{ background: 'rgba(250,248,244,0.04)', border: '1px solid rgba(200,172,120,0.2)', borderTop: '3px solid #C8AC78', padding: '24px 28px' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Market Report · 5-Page PDF
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2, marginBottom: 8 }}>
                Christie's Hamptons Market Report
              </div>
              <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: 16 }}>
                Founding letter · eleven-hamlet atlas with live CIS scores and medians · Ed's contact block. Generated from live Market Matrix data at time of download.
              </p>
              <button
                onClick={handleMarketReportPdf}
                disabled={pdfLoading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '9px 20px',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#FAF8F4',
                  background: pdfLoading ? 'rgba(200,172,120,0.04)' : 'rgba(200,172,120,0.08)',
                  border: '1px solid rgba(200,172,120,0.5)',
                  cursor: pdfLoading ? 'wait' : 'pointer',
                  opacity: pdfLoading ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {pdfLoading ? 'Generating…' : '↓ Download PDF'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Estate Advisory Card — one locked copy source, three surfaces */}
      {/* framed=true adds Christie's gold border for HOME tab usage */}
      <div style={{ background: '#FAF8F4', borderTop: '1px solid rgba(27,42,74,0.08)', padding: '48px 40px 64px' }}>
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20 }}>
            Estate Advisory
          </div>
          <EstateAdvisoryCard framed />
        </div>
      </div>
    </div>
  );
}