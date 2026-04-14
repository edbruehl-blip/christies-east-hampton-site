/**
 * FloatingDashboardIntro — Fixed bottom-right button, all pages.
 * Plays the Flagship Letter audio via /api/tts/flagship-letter.
 * Stops any other playing audio first. One audio at a time.
 * Gold background #C8AC78, charcoal text #384249, small caps, play icon.
 * Minimum 44px tap target. Works identically on mobile and laptop.
 *
 * Fix (SD-9): Uses direct Audio src streaming instead of fetch-blob pattern.
 * The letter is ~9MB — fetching the full blob caused a 20+ second spin before
 * playback started. Streaming src lets the browser start playing as soon as
 * the first chunk arrives (~2s), eliminating the wait.
 */

import { useRef, useState, useEffect } from 'react';

// Global event name — HOME and REPORT audio players listen for this
const STOP_ALL_EVENT = 'stop-all-audio';

export function FloatingDashboardIntro() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const stopSelf = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setStatus('idle');
  };

  const handleClick = () => {
    // If already playing or loading, stop
    if (status === 'playing' || status === 'loading') {
      stopSelf();
      return;
    }

    // Dispatch stop event so HOME/REPORT audio players pause themselves
    window.dispatchEvent(new CustomEvent(STOP_ALL_EVENT));

    setStatus('loading');

    const audio = new Audio('/api/tts/flagship-letter');
    audioRef.current = audio;

    // canplaythrough fires when enough data is buffered to play without interruption
    audio.addEventListener('canplaythrough', () => {
      // Already started playing via autoplay below — just update state
    }, { once: true });

    // Start playing as soon as the browser has enough data
    audio.addEventListener('playing', () => {
      setStatus('playing');
    }, { once: true });

    audio.addEventListener('ended', () => {
      setStatus('idle');
      audioRef.current = null;
    }, { once: true });

    audio.addEventListener('error', (e) => {
      console.error('[FloatingDashboardIntro] Audio error:', e);
      setStatus('idle');
      audioRef.current = null;
    }, { once: true });

    // play() returns a promise — browser starts buffering and plays as soon as ready
    audio.play().catch((err) => {
      console.error('[FloatingDashboardIntro] Play failed:', err);
      setStatus('idle');
      audioRef.current = null;
    });
  };

  // Listen for stop-all-audio events dispatched by other players
  useEffect(() => {
    const handleStopAll = () => {
      if (status === 'playing' || status === 'loading') {
        stopSelf();
      }
    };
    window.addEventListener(STOP_ALL_EVENT, handleStopAll);
    return () => window.removeEventListener(STOP_ALL_EVENT, handleStopAll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const label =
    status === 'loading'
      ? 'Preparing your brief…'
      : status === 'playing'
        ? '■ Stop'
        : 'Dashboard Introduction';

  const icon =
    status === 'loading' ? (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    ) : status === 'playing' ? (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ flexShrink: 0 }}
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </svg>
    ) : (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ flexShrink: 0 }}
      >
        <polygon points="5,3 19,12 5,21" />
      </svg>
    );

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        aria-label="Dashboard Introduction"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 44,
          minWidth: 44,
          padding: '10px 18px',
          background: '#C8AC78',
          color: '#384249',
          border: 'none',
          borderRadius: 0,
          cursor: status === 'loading' ? 'wait' : 'pointer',
          fontFamily: '"Barlow Condensed", sans-serif',
          fontVariant: 'small-caps',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 20px rgba(27,42,74,0.25)',
          opacity: status === 'loading' ? 0.85 : 1,
          transition: 'opacity 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          if (status !== 'loading') {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(27,42,74,0.4)';
          }
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(27,42,74,0.25)';
        }}
      >
        {icon}
        <span>{label}</span>
      </button>
    </>
  );
}
