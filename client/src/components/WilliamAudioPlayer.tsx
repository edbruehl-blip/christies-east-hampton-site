/**
 * WilliamAudioPlayer
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable audio player for William voice notes (ElevenLabs MP3 URLs).
 *
 * Features:
 *   - Play / Pause toggle
 *   - 15-second fast-forward button
 *   - Scrubable progress bar (click to seek)
 *   - Share button — copies MP3 URL to clipboard
 *   - Loading state with spinner
 *   - Error state with retry
 *   - Elapsed / total time display
 *
 * Usage:
 *   <WilliamAudioPlayer
 *     audioUrl="https://cdn.example.com/brief.mp3"
 *     label="Morning Brief · Apr 4, 2026"
 *   />
 *
 * Design: Christie's Navy + Gold palette, condensed typeface, compact height.
 * Tested target: iPhone Safari (real device) — touch targets ≥ 44px.
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface WilliamAudioPlayerProps {
  /** Direct public URL to the MP3 file */
  audioUrl: string;
  /** Short label shown above the controls, e.g. "Morning Brief · Apr 4, 2026" */
  label?: string;
  /** If true, auto-play as soon as the component mounts */
  autoPlay?: boolean;
}

type PlayerState = "idle" | "loading" | "playing" | "paused" | "error";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WilliamAudioPlayer({ audioUrl, label, autoPlay = false }: WilliamAudioPlayerProps) {
  const [state, setState] = useState<PlayerState>("idle");
  const [progress, setProgress] = useState(0);       // 0–100
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [duration, setDuration] = useState(0);       // seconds
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // ── Auto-play ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoPlay) {
      void handlePlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, audioUrl]);

  // ── Core play logic ───────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (state === "loading") return;

    // Resume if paused
    if (state === "paused" && audioRef.current) {
      await audioRef.current.play();
      setState("playing");
      return;
    }

    // Fresh load
    setState("loading");

    try {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(audio.currentTime);
        }
      };

      audio.onended = () => {
        setState("idle");
        setProgress(0);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        setState("error");
      };

      await audio.play();
      setState("playing");
    } catch {
      setState("error");
    }
  }, [audioUrl, state]);

  // ── Pause ─────────────────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    if (audioRef.current && state === "playing") {
      audioRef.current.pause();
      setState("paused");
    }
  }, [state]);

  // ── Toggle play/pause ─────────────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    if (state === "playing") {
      handlePause();
    } else {
      void handlePlay();
    }
  }, [state, handlePlay, handlePause]);

  // ── 15s fast-forward ─────────────────────────────────────────────────────
  const handleForward15 = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(
      audioRef.current.duration || 0,
      audioRef.current.currentTime + 15
    );
  }, []);

  // ── Scrub ─────────────────────────────────────────────────────────────────
  const handleScrub = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!audioRef.current || !audioRef.current.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      audioRef.current.currentTime = pct * audioRef.current.duration;
    },
    []
  );

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(audioUrl).then(() => {
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    });
  }, [audioUrl]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const isActive = state === "playing" || state === "paused";
  const isLoading = state === "loading";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "rgba(27,42,74,0.96)",
        border: "1px solid rgba(200,172,120,0.22)",
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "var(--font-condensed, 'Source Sans 3', sans-serif)",
        userSelect: "none",
      }}
    >
      {/* Label */}
      {label && (
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(200,172,120,0.7)",
          }}
        >
          {label}
        </div>
      )}

      {/* Controls row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Play / Pause button — 44×44 touch target */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          aria-label={state === "playing" ? "Pause" : "Play"}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: isLoading
              ? "rgba(200,172,120,0.15)"
              : "rgba(200,172,120,0.18)",
            border: "1.5px solid rgba(200,172,120,0.4)",
            color: "#C8AC78",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isLoading ? "not-allowed" : "pointer",
            flexShrink: 0,
            transition: "background 0.15s",
          }}
        >
          {isLoading ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C8AC78"
              strokeWidth="2.5"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : state === "playing" ? (
            /* Pause icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#C8AC78">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#C8AC78">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* +15s fast-forward — 44×44 touch target */}
        <button
          onClick={handleForward15}
          disabled={!isActive}
          aria-label="Skip forward 15 seconds"
          title="+15s"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "transparent",
            border: "1.5px solid rgba(200,172,120,0.25)",
            color: isActive ? "#C8AC78" : "rgba(200,172,120,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isActive ? "pointer" : "not-allowed",
            flexShrink: 0,
            fontSize: 10,
            letterSpacing: "0.04em",
            fontWeight: 700,
            transition: "color 0.15s, border-color 0.15s",
          }}
        >
          +15
        </button>

        {/* Time display */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "rgba(200,172,120,0.7)",
            whiteSpace: "nowrap",
            minWidth: 72,
          }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Share button — 44×44 touch target */}
        <button
          onClick={handleShare}
          aria-label="Copy MP3 URL to clipboard"
          title="Share"
          style={{
            marginLeft: "auto",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background:
              shareState === "copied"
                ? "rgba(5,150,105,0.15)"
                : "transparent",
            border: `1.5px solid ${shareState === "copied" ? "rgba(5,150,105,0.5)" : "rgba(200,172,120,0.25)"}`,
            color: shareState === "copied" ? "#10b981" : "rgba(200,172,120,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {shareState === "copied" ? (
            /* Checkmark */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            /* Share / link icon */
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress bar — scrubable, 8px tall for easy touch */}
      <div
        onClick={handleScrub}
        onTouchStart={handleScrub}
        role="slider"
        aria-label="Seek"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: 8,
          background: "rgba(200,172,120,0.12)",
          borderRadius: 4,
          cursor: isActive ? "pointer" : "default",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #C8AC78, #e8d4a8)",
            borderRadius: 4,
            transition: "width 0.25s linear",
          }}
        />
      </div>

      {/* Error state */}
      {state === "error" && (
        <div
          style={{
            fontSize: 10,
            color: "#f87171",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}
        >
          Audio playback failed.{" "}
          <button
            onClick={() => { setState("idle"); void handlePlay(); }}
            style={{ color: "#C8AC78", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 10 }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default WilliamAudioPlayer;
