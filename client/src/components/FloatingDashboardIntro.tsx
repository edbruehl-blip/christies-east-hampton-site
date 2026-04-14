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
 *
 * SD-9b: Added −15s / +15s skip buttons and progress bar when playing.
 */

import { useRef, useState, useEffect } from 'react';

// Global event name — HOME and REPORT audio players listen for this
const STOP_ALL_EVENT = 'stop-all-audio';

export function FloatingDashboardIntro() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function fmtTime(s: number) {
    if (!isFinite(s) || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  function handleRewind() {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
  }

  function handleForward() {
    if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 15);
  }

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
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
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

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        setProgress(Math.round((audio.currentTime / audio.duration) * 100));
        setCurrentTime(audio.currentTime);
      }
    });

    // Start playing as soon as the browser has enough data
    audio.addEventListener('playing', () => {
      setStatus('playing');
    }, { once: true });

    audio.addEventListener('ended', () => {
      setStatus('idle');
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      audioRef.current = null;
    }, { once: true });

    audio.addEventListener('error', (e) => {
      console.error('[FloatingDashboardIntro] Audio error:', e);
      setStatus('idle');
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      audioRef.current = null;
    }, { once: true });

    // play() returns a promise — browser starts buffering and plays as soon as ready
    audio.play().catch((err) => {
      console.error('[FloatingDashboardIntro] Play failed:', err);
      setStatus('idle');
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
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
      ? 'Loading…'
      : status === 'playing'
        ? '■ Stop'
        : 'Intro';

  const icon =
    status === 'loading' ? (
      <svg
        width="12"
        height="12"
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
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          boxShadow: '0 4px 16px rgba(27,42,74,0.30)',
          minWidth: 0,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        {/* Main play/stop button */}
        <button
          onClick={handleClick}
          disabled={status === 'loading'}
          aria-label="Dashboard Introduction"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            minHeight: 32,
            padding: '5px 10px',
            background: '#C8AC78',
            color: '#384249',
            border: 'none',
            borderRadius: 0,
            cursor: status === 'loading' ? 'wait' : 'pointer',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontVariant: 'small-caps',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            opacity: status === 'loading' ? 0.85 : 1,
            transition: 'opacity 0.2s',
            width: '100%',
          }}
        >
          {icon}
          <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
        </button>

        {/* Progress bar + skip controls — only when playing */}
        {status === 'playing' && (
          <div style={{
            background: 'rgba(27,42,74,0.97)',
            border: '1px solid rgba(200,172,120,0.35)',
            borderTop: 'none',
            padding: '8px 12px',
          }}>
            {/* Scrub bar */}
            <div style={{ height: 4, background: 'rgba(200,172,120,0.2)', borderRadius: 2, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#C8AC78', borderRadius: 2, width: `${progress}%`, transition: 'width 0.4s linear' }} />
            </div>
            {/* Controls row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <button
                onClick={handleRewind}
                style={{
                  background: 'rgba(200,172,120,0.12)',
                  border: '1px solid rgba(200,172,120,0.3)',
                  color: '#C8AC78',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  borderRadius: 0,
                }}
              >↺ −15s</button>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(200,172,120,0.6)', whiteSpace: 'nowrap' }}>
                {fmtTime(currentTime)} / {fmtTime(duration)}
              </span>
              <button
                onClick={handleForward}
                style={{
                  background: 'rgba(200,172,120,0.12)',
                  border: '1px solid rgba(200,172,120,0.3)',
                  color: '#C8AC78',
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  borderRadius: 0,
                }}
              >+15s ↻</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
