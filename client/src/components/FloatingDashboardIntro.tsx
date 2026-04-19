/**
 * FloatingDashboardIntro — Fixed bottom-right button bar, all pages.
 *
 * Left  · PDF       — opens /letters/flagship in a new tab (PDF-printable letter)
 * ──────────────────────────────────────────────────────────────────────────────
 * Right · WILLIAM audio bar (D34 amendment — one surface, one letter):
 *         «15  — rewind 15 seconds
 *         ▶/⏸  — play / pause toggle (shows loading spinner while buffering)
 *         15»  — skip forward 15 seconds
 *
 * Audio endpoint: /api/tts/flagship
 * Voice ID: fjnwTZkKtQOJaYzGLa6n · Model: eleven_turbo_v2
 * Audio element is created once and reused — no re-fetch on play/pause.
 *
 * Gold background #C8AC78, charcoal text #384249, Barlow Condensed small-caps.
 * Minimum 44px tap target. no-print class hides bar from all PDF/print surfaces.
 */

import { useRef, useState } from 'react';

const GOLD = '#C8AC78';
const CHARCOAL = '#384249';
const DIVIDER = 'rgba(56,66,73,0.35)';

const btnBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  minHeight: 32,
  padding: '5px 9px',
  background: GOLD,
  color: CHARCOAL,
  border: 'none',
  borderRadius: 0,
  cursor: 'pointer',
  fontFamily: '"Barlow Condensed", sans-serif',
  fontVariant: 'small-caps',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.15s',
  flexShrink: 0,
};

function Divider() {
  return <div style={{ width: 1, background: DIVIDER, flexShrink: 0, alignSelf: 'stretch' }} />;
}

export function FloatingDashboardIntro() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Lazily create the Audio element on first interaction.
   *  iOS Safari requires Audio() to be created AND .play() called
   *  synchronously within the same user gesture. We create the element
   *  with an empty src, then set src + call load() + play() together.
   */
  function getAudio(): HTMLAudioElement {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'none';
      audio.onended   = () => setPlaying(false);
      audio.onpause   = () => setPlaying(false);
      audio.onplay    = () => { setPlaying(true); setLoading(false); };
      audio.onwaiting = () => setLoading(true);
      audio.oncanplay = () => setLoading(false);
      audioRef.current = audio;
    }
    return audioRef.current;
  }

  const handleIntroClick = () => {
    window.open('/letters/flagship', '_blank', 'noopener,noreferrer');
  };

  const handlePlayPause = () => {
    const audio = getAudio();
    if (playing) {
      audio.pause();
    } else {
      setLoading(true);
      // iOS Safari fix: set src and call load() before play() within the gesture
      if (!audio.src || audio.src === window.location.href) {
        audio.src = '/api/tts/flagship-letter';
        audio.load();
      }
      audio.play().catch(err => {
        console.error('[Audio] Play failed:', err);
        setLoading(false);
      });
    }
  };

  const handleRewind = () => {
    const audio = getAudio();
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  };

  const handleForward = () => {
    const audio = getAudio();
    if (audio.duration) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
    }
  };

  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        boxShadow: '0 4px 16px rgba(27,42,74,0.30)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      {/* PDF — opens flagship letter */}
      <button onClick={handleIntroClick} aria-label="Open Introduction Letter PDF" style={btnBase}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0 }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span>PDF</span>
      </button>

      <Divider />

      {/* «15 — rewind 15 seconds */}
      <button
        onClick={handleRewind}
        aria-label="Rewind 15 seconds"
        title="Rewind 15s"
        style={{ ...btnBase, padding: '5px 8px', minWidth: 32 }}
      >
        {/* Rewind icon */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M11.5 12l8-5v10l-8-5z" />
          <path d="M3.5 12l8-5v10l-8-5z" />
        </svg>
        <span style={{ fontSize: 9 }}>15</span>
      </button>

      <Divider />

      {/* Play / Pause */}
      <button
        onClick={handlePlayPause}
        aria-label={playing ? 'Pause William' : 'Play William — flagship letter'}
        style={{ ...btnBase, padding: '5px 10px', minWidth: 44 }}
      >
        {loading ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }}>
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        ) : playing ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
        <span>{playing ? 'Pause' : 'Audio'}</span>
      </button>

      <Divider />

      {/* 15» — skip forward 15 seconds */}
      <button
        onClick={handleForward}
        aria-label="Skip forward 15 seconds"
        title="Skip 15s"
        style={{ ...btnBase, padding: '5px 8px', minWidth: 32 }}
      >
        <span style={{ fontSize: 9 }}>15</span>
        {/* Forward icon */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M12.5 12l-8-5v10l8-5z" />
          <path d="M20.5 12l-8-5v10l8-5z" />
        </svg>
      </button>
    </div>
  );
}
