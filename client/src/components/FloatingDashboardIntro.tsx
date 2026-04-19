/**
 * FloatingDashboardIntro — Fixed bottom-right double button, all pages.
 *
 * Left button  · INTRO — opens /letters/flagship in a new tab (PDF-printable letter)
 * Right button · WILLIAM — plays the founding letter via ElevenLabs TTS audio
 *               Voice ID: fjnwTZkKtQOJaYzGLa6n · endpoint: /api/tts/founding-letter
 *               Play/pause toggle. Audio object is reused across clicks (no re-fetch).
 *               D34 amendment: one audio surface, one letter. No other tabs get audio.
 *
 * Gold background #C8AC78, charcoal text #384249, small caps, Barlow Condensed.
 * Minimum 44px tap target. Works identically on mobile and laptop.
 * Divider line between the two buttons.
 */

import { useRef, useState } from 'react';

export function FloatingDashboardIntro() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleIntroClick = () => {
    window.open('/letters/flagship', '_blank', 'noopener,noreferrer');
  };

  const handleWilliamClick = () => {
    // Initialise audio element once
    if (!audioRef.current) {
      const audio = new Audio('/api/tts/founding-letter');
      audio.preload = 'none';
      audio.onended = () => setPlaying(false);
      audio.onpause = () => setPlaying(false);
      audio.onplay  = () => { setPlaying(true); setLoading(false); };
      audio.onwaiting = () => setLoading(true);
      audio.oncanplay = () => setLoading(false);
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (playing) {
      audio.pause();
    } else {
      setLoading(true);
      audio.play().catch(err => {
        console.error('[William] Audio play failed:', err);
        setLoading(false);
      });
    }
  };

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    minHeight: 32,
    padding: '5px 10px',
    background: '#C8AC78',
    color: '#384249',
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
    transition: 'opacity 0.2s',
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
        boxShadow: '0 4px 16px rgba(27,42,74,0.30)',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      {/* Left — INTRO: opens flagship letter */}
      <button
        onClick={handleIntroClick}
        aria-label="Open Dashboard Introduction Letter"
        style={btnBase}
      >
        {/* Open-in-new-tab icon */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0 }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span>Intro</span>
      </button>

      {/* Divider */}
      <div style={{ width: 1, background: 'rgba(56,66,73,0.35)', flexShrink: 0 }} />

      {/* Right — WILLIAM: play/pause founding letter audio */}
      <button
        onClick={handleWilliamClick}
        aria-label={playing ? 'Pause William' : 'Play William — founding letter'}
        style={{ ...btnBase, minWidth: 44 }}
      >
        {loading ? (
          /* Spinner */
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }}>
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        ) : playing ? (
          /* Pause icon */
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"
            style={{ flexShrink: 0 }}>
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          /* Play icon */
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"
            style={{ flexShrink: 0 }}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
        <span>{playing ? 'Pause' : 'William'}</span>
      </button>
    </div>
  );
}
