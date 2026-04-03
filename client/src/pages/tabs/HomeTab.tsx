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
import { useLocation } from 'wouter';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY, GALLERY_IMAGES, AUCTION_LOT_LIBRARY } from '@/lib/cdn-assets';
import { toast } from 'sonner';

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
                  {(audioState === 'playing' || audioState === 'paused') && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      <button onClick={handleRewind} title="Back 15 seconds" style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px', cursor: 'pointer' }}>↺ −15s</button>
                      <button onClick={togglePause} style={{ background: 'rgba(200,172,120,0.15)', border: '1px solid rgba(200,172,120,0.4)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', cursor: 'pointer' }}>
                        {audioState === 'paused' ? '▶ Resume' : '⏸ Pause'}
                      </button>
                      <button onClick={handleForward} title="Forward 15 seconds" style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px', cursor: 'pointer' }}>+15s ↻</button>
                      <button onClick={stopAudio} style={{ background: 'rgba(200,172,120,0.1)', border: '1px solid rgba(200,172,120,0.3)', color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', cursor: 'pointer' }}>◼ Stop</button>
                      <button
                        onClick={handleShare}
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

      {/* ── Christie's YouTube Channel ── */}
      <div style={{ borderBottom: '1px solid rgba(27,42,74,0.08)', padding: '56px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
            Christie's · YouTube Channel
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, marginBottom: 16 }}>
            Your Hamptons Real Estate Podcast
          </h2>
          <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(27,42,74,0.65)', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: 640, marginBottom: 24 }}>
            Every episode is a conversation with the people who shape the South Fork — architects, attorneys, collectors, farmers, and the families who have held this land for generations. Subscribe to follow the series.
          </p>
          <a
            href="https://www.youtube.com/channel/UCRNUlNy2hkJFvo1IFTY4otg"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#1B2A4A',
              color: '#C8AC78',
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '10px 20px',
              textDecoration: 'none',
              border: '1px solid rgba(200,172,120,0.3)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Subscribe to the Channel
          </a>
        </div>
      </div>

      {/* ── Christie's Story ── */}
      <div style={{ borderBottom: '1px solid rgba(27,42,74,0.08)', padding: '56px 40px', background: '#1B2A4A' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Christie's · Est. 1766
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.25, maxWidth: 560 }}>
            The Authority on Art, Beauty, and Provenance
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.72)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
              Founded in London in 1766, Christie's has conducted the sale of some of the world's greatest collections, setting hundreds of world auction records and offering a range of specialist services to its global clientele. Christie's is a name and place that speaks of extraordinary art, unparalleled service, and expertise reaching across cultures and centuries.
            </p>
            <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.72)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
              Christie's International Real Estate Group brings that same standard to the world's most distinguished residential properties. In the Hamptons, that means applying 260 years of institutional discipline to every conversation, every valuation, and every family decision about the land they have built their lives around.
            </p>
          </div>
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

// ─── Section C · Footer — one line only ───────────────────────────────────────
function SectionC() {
  return (
    <footer style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.2)', padding: '18px 28px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8AC78' }}>
          Art. Beauty. Provenance. · Since 1766.
        </span>
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
