/**
 * /letters/flagship — Flagship AI-Letter Live URL Renderer
 *
 * Standalone route — no nav chrome, document-only, print-ready.
 * Content source: FLAGSHIP_LETTER_TEXT_EXPORT from server/tts-route.ts
 * served via tRPC flagship.getLetter endpoint.
 *
 * PDF download: GET /api/pdf?url=/letters/flagship
 * Route registered in App.tsx as /letters/flagship
 * Filename map entry in pdf-route.ts: Christies_EH_Flagship_Letter
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY   = '#1B2A4A';
const GOLD   = '#C8AC78';
const CREAM  = '#FAF8F4';
const MUTED  = 'rgba(250,248,244,0.55)';
const BORDER = 'rgba(200,172,120,0.25)';

const CIREG_LOGO_WHITE = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';

// ─── Paragraph splitter ────────────────────────────────────────────────────────
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);
}

// ─── Section heading detector ─────────────────────────────────────────────────
// Lines that are short and end without a period are treated as section headings
function isSectionHeading(para: string): boolean {
  return para.length < 80 && !para.endsWith('.') && !para.endsWith(',');
}

export default function FlagshipLetterPage() {
  const [downloading, setDownloading] = useState(false);

  // Fetch the flagship letter text from the server
  const { data, isLoading, error } = trpc.flagship.getLetter.useQuery();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/pdf?url=/letters/flagship');
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      a.href = url;
      a.download = `Christies_EH_Flagship_Letter_${today}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[FlagshipLetter] PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const paragraphs = data?.text ? splitParagraphs(data.text) : [];

  return (
    <div
      style={{
        background: NAVY,
        minHeight: '100vh',
        fontFamily: '"Source Sans 3", sans-serif',
        color: CREAM,
      }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <header
        style={{
          background: NAVY,
          borderBottom: `1px solid ${BORDER}`,
          padding: '18px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
        className="no-print"
      >
        <img src={CIREG_LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 32, objectFit: 'contain' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Flagship AI-Letter
          </span>
          <button
            onClick={handleDownload}
            disabled={downloading || isLoading}
            style={{
              background: 'transparent',
              border: `1px solid ${GOLD}`,
              color: GOLD,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '7px 18px',
              cursor: downloading ? 'not-allowed' : 'pointer',
              opacity: downloading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {downloading ? 'Generating…' : '↓ Download PDF'}
          </button>
        </div>
      </header>

      {/* ── Document body ──────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '60px 40px 100px' }}>

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: GOLD,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Christie's East Hampton · Flagship AI-Letter
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            color: CREAM,
            fontWeight: 400,
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          A Letter from the Council
        </h1>

        {/* Date line */}
        <div style={{ color: MUTED, fontSize: '0.85rem', marginBottom: 40, fontStyle: 'italic' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        {/* Gold rule */}
        <div style={{ borderTop: `1px solid ${GOLD}`, marginBottom: 40, opacity: 0.4 }} />

        {/* Content */}
        {isLoading && (
          <div style={{ color: MUTED, fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
            Loading…
          </div>
        )}

        {error && (
          <div style={{ color: '#e57373', fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
            Unable to load letter. Please refresh.
          </div>
        )}

        {paragraphs.map((para, i) => {
          if (isSectionHeading(para)) {
            return (
              <div
                key={i}
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: GOLD,
                  fontSize: 11,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginTop: 40,
                  marginBottom: 12,
                }}
              >
                {para}
              </div>
            );
          }
          return (
            <p
              key={i}
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: CREAM,
                fontSize: '1.1rem',
                lineHeight: 1.75,
                marginBottom: 24,
                fontWeight: 400,
              }}
            >
              {para}
            </p>
          );
        })}

        {/* Closing rule */}
        {paragraphs.length > 0 && (
          <>
            <div style={{ borderTop: `1px solid ${GOLD}`, marginTop: 48, marginBottom: 32, opacity: 0.4 }} />
            <div
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: MUTED,
                fontSize: '0.9rem',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              Christie's International Real Estate Group · East Hampton · Since 1766
            </div>
          </>
        )}
      </main>

      {/* ── Print styles ───────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Barlow+Condensed:wght@400;500;600&family=Source+Sans+3:wght@300;400;600&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { background: #1B2A4A !important; }
        }
      `}</style>
    </div>
  );
}
