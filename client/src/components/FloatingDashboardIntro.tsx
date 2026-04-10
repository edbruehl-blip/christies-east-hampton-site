/**
 * FloatingDashboardIntro — Fixed bottom-right button, all pages.
 * Plays the Flagship Letter audio via /api/tts/flagship-letter.
 * Stops any other playing audio first. One audio at a time.
 * Gold background #C8AC78, charcoal text #384249, small caps, play icon.
 * Minimum 44px tap target. Works identically on mobile and laptop.
 */

import { useRef, useState } from 'react';

// Global audio ref shared across the module so we can stop any playing audio
let globalAudio: HTMLAudioElement | null = null;

export function FloatingDashboardIntro() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    // If already playing this button's audio, stop it
    if (status === 'playing' && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      globalAudio = null;
      setStatus('idle');
      return;
    }

    // Stop any other audio playing globally
    if (globalAudio && !globalAudio.paused) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/tts/flagship-letter', { method: 'POST' });
      if (!res.ok) throw new Error('TTS request failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audioRef.current = audio;
      globalAudio = audio;

      audio.addEventListener('ended', () => {
        setStatus('idle');
        audioRef.current = null;
        globalAudio = null;
        URL.revokeObjectURL(url);
      });

      audio.addEventListener('error', () => {
        setStatus('idle');
        audioRef.current = null;
        globalAudio = null;
        URL.revokeObjectURL(url);
      });

      await audio.play();
      setStatus('playing');
    } catch {
      setStatus('idle');
    }
  };

  const label =
    status === 'loading'
      ? 'Preparing your brief…'
      : status === 'playing'
        ? '■ Stop'
        : 'Dashboard Introduction';

  const icon =
    status === 'loading' ? (
      // Spinning loader
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
      // Stop square
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
      // Play triangle
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
