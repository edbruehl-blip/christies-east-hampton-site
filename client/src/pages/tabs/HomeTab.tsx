/**
 * HOME TAB — Three sections only.
 *
 * Section A · Full-bleed hero — auction room background.
 *             Left column: portrait thumbnail (top) + identity card (below).
 *             Right column: founding letter — FIRST TEXT ABOVE THE FOLD.
 *             Portrait click → navigates to /report.
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

import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY, GALLERY_IMAGES } from '@/lib/cdn-assets';
import { toast } from 'sonner';

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

const FOUNDING_PARAGRAPHS = [
  "Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.",
  "The South Fork is not a market. It is a territory — ten distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.",
  "This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.",
  "The Christie’s Intelligence Score is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.",
  "The ten hamlets of the South Fork represent the most concentrated wealth corridor in the northeastern United States. East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton Village. Sag Harbor. Amagansett. Springs. East Hampton Town. Montauk. Each one has a story. Each one has a price. Each one has a buyer.",
  "Christie's East Hampton is not a brokerage. It is a standard. The auction house has been the authority on provenance, value, and discretion for 260 years. That authority now extends to the South Fork.",
  "The families who built this territory deserve representation that matches the weight of their decisions. Not a pitch. Not a presentation. A system. A process that has been tested, scored, and proven.",
  "Every export from this platform — every market report, every deal brief, every CMA — carries the Christie's name because it has earned the right to carry it. The standard is not aspirational. It is operational.",
  "Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.",
];

// ─── Section A · Hero ─────────────────────────────────────────────────────────
function SectionA() {
  const [, navigate] = useLocation();
  // ── Audio player state ──
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'error'>('idle');
  const [audioChannel, setAudioChannel] = useState<'letter' | 'report'>('letter');
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function fmtTime(s: number) {
    if (!isFinite(s) || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState('idle');
    setAudioProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }

  function togglePause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioState === 'playing') {
      audio.pause();
      setAudioState('paused');
    } else if (audioState === 'paused') {
      audio.play();
      setAudioState('playing');
    }
  }

  function handleRewind() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  }

  function handleForward() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
  }

  function handleShare() {
    const endpoint = audioChannel === 'letter' ? '/api/tts/founding-letter' : '/api/tts/market-report';
    const fullUrl = window.location.origin + endpoint;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2500);
    }).catch(() => {
      toast.error('Could not copy link.');
    });
  }

  function handleScrub(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  }

  async function handleListen(channel: 'letter' | 'report') {
    if (audioState === 'playing' && audioChannel === channel) {
      stopAudio();
      return;
    }
    if (audioState === 'playing' || audioState === 'loading') {
      stopAudio();
    }
    setAudioChannel(channel);
    setAudioState('loading');
    setAudioProgress(0);
    const endpoint = channel === 'letter' ? '/api/tts/founding-letter' : '/api/tts/market-report';
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`TTS error ${response.status}: ${errText}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setAudioProgress(Math.round((audio.currentTime / audio.duration) * 100));
          setCurrentTime(audio.currentTime);
        }
      };
      audio.onended = () => {
        setAudioState('idle');
        setAudioProgress(0);
        setCurrentTime(0);
        setDuration(0);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setAudioState('error');
        toast.error('Audio playback failed.');
        setTimeout(() => setAudioState('idle'), 3000);
      };
      await audio.play();
      setAudioState('playing');
    } catch (e) {
      console.error(e);
      setAudioState('error');
      toast.error('Audio generation failed. Please try again.');
      setTimeout(() => setAudioState('idle'), 3000);
    }
  }

  const auctionRoomSrc = GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src
    ?? GALLERY_IMAGES[0]?.src
    ?? '';

  return (
    <section style={{ background: '#1B2A4A', borderBottom: '1px solid rgba(200,172,120,0.3)' }}>
      {/* Full-bleed background */}
      <div className="relative" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <img
          src={auctionRoomSrc}
          alt="The Grand Saleroom, Christie's"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ display: 'block' }}
        />
        {/* Dark overlay — heavier on left, lighter on right */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(27,42,74,0.97) 0%, rgba(27,42,74,0.88) 50%, rgba(27,42,74,0.55) 100%)'
        }} />

        {/* Two-column layout over hero — stacks vertically on mobile */}
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
            {/* Portrait thumbnail */}
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

            {/* Identity card */}
            <div style={{
              background: 'rgba(250,248,244,0.06)',
              border: '1px solid rgba(200,172,120,0.22)',
              padding: '18px 16px',
              backdropFilter: 'blur(6px)',
            }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
                Christie's · Est. 1766
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.2, marginBottom: 12 }}>
                Christie's East Hampton
              </div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.7)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
                Managing Director
              </div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontWeight: 600, fontSize: '0.875rem', marginBottom: 10 }}>
                Ed Bruehl
              </div>
              <div style={{ height: 1, background: 'rgba(200,172,120,0.18)', marginBottom: 10 }} />
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.45)', fontSize: '0.75rem', lineHeight: 1.5 }}>
                Christie's International Real Estate Group
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: founding letter — FIRST TEXT ABOVE THE FOLD ── */}
          <div style={{ padding: '32px 36px 32px 12px' }}>
            {/* Letter header */}
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
              CHRISTIE’S EAST HAMPTON
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

            {/* All nine paragraphs — visible immediately, no scroll required */}
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

            {/* Signature */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(200,172,120,0.18)' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1rem', fontStyle: 'italic', marginBottom: 4 }}>
                Ed Bruehl
              </div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.65)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Managing Director · Christie's East Hampton
              </div>
            </div>

            {/* ── Audio Player ── */}
            <div style={{ marginTop: 20, maxWidth: 520 }}>
              {audioState === 'idle' || audioState === 'error' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    onClick={() => handleListen('letter')}
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
                    }}
                  >
                    {audioState === 'error' && audioChannel === 'letter' ? '⚠ Retry' : '▶ Listen · Founding Letter'}
                  </button>
                  <button
                    onClick={() => handleListen('report')}
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
                    }}
                  >
                    {audioState === 'error' && audioChannel === 'report' ? '⚠ Retry' : '▶ Listen · Market Report'}
                  </button>
                </div>
              ) : (
                <div style={{
                  border: '1px solid rgba(200,172,120,0.45)',
                  background: 'rgba(200,172,120,0.06)',
                  padding: '12px 16px',
                }}>
                  {/* Status + controls row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {audioState === 'loading' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8AC78" strokeWidth="2.5" style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 16 }}>
                          {[0.6, 1, 0.75, 1, 0.5].map((h, i) => (
                            <span key={i} style={{
                              display: 'block', width: 3, borderRadius: 2,
                              background: '#C8AC78',
                              height: `${h * 100}%`,
                              animation: `wave-bar 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                            }} />
                          ))}
                        </div>
                      )}
                      <span style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        color: '#C8AC78',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                      }}>
                        {audioState === 'loading'
                          ? 'Synthesizing Audio… Please Wait'
                          : audioChannel === 'letter' ? 'Playing Founding Letter' : 'Playing Market Report'}
                      </span>
                    </div>
                  </div>
                  {/* Controls */}
                  {(audioState === 'playing' || audioState === 'paused') && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      <button onClick={handleRewind} title="Back 15 seconds" style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px', cursor: 'pointer' }}>
                        ↺ −15s
                      </button>
                      <button onClick={togglePause} style={{ background: 'rgba(200,172,120,0.15)', border: '1px solid rgba(200,172,120,0.4)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', cursor: 'pointer' }}>
                        {audioState === 'paused' ? '▶ Resume' : '⏸ Pause'}
                      </button>
                      <button onClick={handleForward} title="Forward 15 seconds" style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px', cursor: 'pointer' }}>
                        +15s ↻
                      </button>
                      <button onClick={stopAudio} style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', cursor: 'pointer' }}>
                        ◼ Stop
                      </button>
                      <button
                        onClick={handleShare}
                        title="Copy audio link to clipboard"
                        style={{
                          background: shareState === 'copied' ? 'rgba(5,150,105,0.15)' : 'rgba(200,172,120,0.1)',
                          border: `1px solid ${shareState === 'copied' ? 'rgba(5,150,105,0.6)' : 'rgba(200,172,120,0.3)'}`,
                          color: shareState === 'copied' ? '#6ee7b7' : '#C8AC78',
                          fontFamily: '"Barlow Condensed", sans-serif',
                          fontSize: 9,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {shareState === 'copied' ? '✓ Copied' : '↗ Share'}
                      </button>
                    </div>
                  )}
                  {/* Scrub bar + time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      onClick={handleScrub}
                      style={{
                        flex: 1,
                        height: 5,
                        background: 'rgba(200,172,120,0.15)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        cursor: (audioState === 'playing' || audioState === 'paused') ? 'pointer' : 'default',
                      }}
                    >
                      <div style={{
                        height: '100%',
                        background: '#C8AC78',
                        borderRadius: 3,
                        width: audioState === 'loading' ? '0%' : `${audioProgress}%`,
                        transition: 'width 0.4s linear',
                      }} />
                    </div>
                    {(audioState === 'playing' || audioState === 'paused') && duration > 0 && (
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(200,172,120,0.6)', whiteSpace: 'nowrap', minWidth: 72, textAlign: 'right' }}>
                        {fmtTime(currentTime)} / {fmtTime(duration)}
                      </span>
                    )}
                  </div>
                  {audioState === 'loading' && (
                    <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(200,172,120,0.5)', fontSize: 10, marginTop: 6, textAlign: 'center' }}>
                      Downloading full audio before playback…
                    </div>
                  )}
                </div>
              )}
            </div>
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
    <footer style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.2)', padding: '40px 28px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Doctrine lines */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Art. Beauty. Provenance. · 26 Park Place, East Hampton, NY 11937 · 646-752-1233
          </div>
        </div>

        {/* Contact row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.55)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
              Office
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.7)', fontSize: '0.8125rem' }}>
              26 Park Place · East Hampton NY 11937
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.55)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
              Direct
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.7)', fontSize: '0.8125rem' }}>
              646-752-1233
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.55)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
              Email
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.7)', fontSize: '0.8125rem' }}>
              ebruehl@christiesrealestate.com
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── HomeTab ──────────────────────────────────────────────────────────────────
export default function HomeTab() {
  return (
    <div>
      <SectionA />
      <SectionB />
      <SectionC />
    </div>
  );
}
