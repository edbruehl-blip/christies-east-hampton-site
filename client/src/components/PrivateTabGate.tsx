/**
 * PrivateTabGate — Sprint 9 P0
 *
 * Wraps PIPE and INTEL tabs. If the user is not authenticated via Manus OAuth,
 * shows a Christie's-branded auth prompt instead of the tab content.
 * Authenticated users see the full tab without interruption.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { LOGO_WHITE } from "@/lib/cdn-assets";
import type { ReactNode } from "react";

interface PrivateTabGateProps {
  children: ReactNode;
  tabLabel: string; // e.g. "PIPE" or "INTEL"
}

export function PrivateTabGate({ children, tabLabel }: PrivateTabGateProps) {
  const { isAuthenticated, loading } = useAuth();

  // While auth state is resolving, show nothing (avoids flash of gate)
  if (loading) {
    return (
      <div
        style={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF8F4",
        }}
      >
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(27,42,74,0.4)",
          }}
        >
          Verifying access…
        </div>
      </div>
    );
  }

  // Authenticated — render the tab normally
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated — show the gate
  return (
    <div
      style={{
        minHeight: 480,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF8F4",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "#1B2A4A",
          border: "1px solid rgba(200,172,120,0.25)",
          padding: "40px 36px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <img
          src={LOGO_WHITE}
          alt="Christie's International Real Estate Group"
          style={{ height: 28, width: "auto", margin: "0 auto 28px", display: "block", opacity: 0.9 }}
        />

        {/* Lock icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1.5px solid rgba(200,172,120,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8AC78" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        {/* Heading */}
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#C8AC78",
            marginBottom: 10,
          }}
        >
          Restricted Access
        </div>
        <div
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "1.35rem",
            fontWeight: 400,
            color: "#FAF8F4",
            lineHeight: 1.3,
            marginBottom: 12,
          }}
        >
          {tabLabel} is a private intelligence surface
        </div>
        <div
          style={{
            fontFamily: '"Source Sans 3", sans-serif',
            fontSize: "0.875rem",
            color: "rgba(250,248,244,0.55)",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          This section contains operational data, relationship intelligence, and pipeline records accessible only to the Christie's East Hampton advisory team.
        </div>

        {/* Login CTA */}
        <a
          href={getLoginUrl()}
          style={{
            display: "inline-block",
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#1B2A4A",
            background: "#C8AC78",
            padding: "12px 32px",
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
        >
          Sign In to Continue
        </a>

        {/* Footer note */}
        <div
          style={{
            marginTop: 20,
            fontFamily: '"Source Sans 3", sans-serif',
            fontSize: "0.7rem",
            color: "rgba(250,248,244,0.3)",
          }}
        >
          Manus OAuth · Christie's East Hampton · Est. 1766
        </div>
      </div>
    </div>
  );
}
