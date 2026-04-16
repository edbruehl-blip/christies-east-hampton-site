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
 *
 * Doctrine 43 — PDF Light Mode Export Standard (Sprint 11 · April 14, 2026)
 * ?pdf=1 → white background, navy text, institutional print quality.
 */

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY   = '#1B2A4A';
const GOLD   = '#C8AC78';
const CREAM  = '#FAF8F4';
const MUTED  = 'rgba(250,248,244,0.55)';
const BORDER = 'rgba(200,172,120,0.25)';

// PDF light-mode tokens
const PDF_BG     = '#FFFFFF';
const PDF_TEXT   = '#1B2A4A';
const PDF_MUTED  = 'rgba(27,42,74,0.55)';
const PDF_BORDER = 'rgba(200,172,120,0.4)';

const CIREG_LOGO_WHITE = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';
const CIREG_LOGO_BLACK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';

// ─── Doctrine 43 — PDF Mode Detection ────────────────────────────────────────
// When Puppeteer navigates with ?pdf=1, switch to light-mode styles.
// Screen stays dark navy. PDF export inverts to institutional print quality.
function useIsPdfMode(): boolean {
  const [isPdf, setIsPdf] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPdf(params.get('pdf') === '1');
  }, []);
  return isPdf;
}

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
  const isPdfMode = useIsPdfMode();

  // Dynamic tokens — screen uses dark navy, PDF uses light paper
  const BG        = isPdfMode ? PDF_BG    : NAVY;
  const TEXT_COL  = isPdfMode ? PDF_TEXT  : CREAM;
  const MUTED_COL = isPdfMode ? PDF_MUTED : MUTED;
  const LOGO      = isPdfMode ? CIREG_LOGO_BLACK : CIREG_LOGO_WHITE;

  // Fetch the flagship letter text from the server
  const { data, isLoading, error } = trpc.flagship.getLetter.useQuery();

  const handleDownload = () => {
    // Doctrine 43: client-side window.print() — no Puppeteer dependency.
    window.print();
  };

  const paragraphs = data?.text ? splitParagraphs(data.text) : [];

  return (
    <div
      style={{
        background: BG,
        minHeight: '100vh',
        fontFamily: '"Source Sans 3", sans-serif',
        color: TEXT_COL,
      }}
    >
      {/* ── Header bar (screen only — hidden in PDF mode) ───────────────────── */}
      {!isPdfMode && (
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
              style={{
                background: 'transparent',
                border: `1px solid ${GOLD}`,
                color: GOLD,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '7px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ↓ Download PDF
            </button>
          </div>
        </header>
      )}

      {/* ── PDF header (PDF mode only — Christie's logo + confidential line) ── */}
      {isPdfMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px 16px',
          borderBottom: `1px solid ${PDF_BORDER}`,
          marginBottom: 8,
        }}>
          <img src={LOGO} alt="Christie's International Real Estate Group" style={{ height: 24, objectFit: 'contain' }} />
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(27,42,74,0.4)',
          }}>
            INTERNAL · CONFIDENTIAL · NOT FOR DISTRIBUTION
          </div>
        </div>
      )}

      {/* ── Document body ──────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: isPdfMode ? '32px 32px 60px' : '60px 32px 100px' }}>

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
            color: TEXT_COL,
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          A Letter from the Council
        </h1>

        {/* Date line */}
        <div style={{ color: MUTED_COL, fontSize: '0.85rem', marginBottom: 40, fontStyle: 'italic' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        {/* Gold rule */}
        <div style={{ borderTop: `1px solid ${GOLD}`, marginBottom: 40, opacity: 0.4 }} />

        {/* Content */}
        {isLoading && (
          <div style={{ color: MUTED_COL, fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
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
                color: TEXT_COL,
                fontSize: '1.15rem',
                lineHeight: 1.8,
                marginBottom: 28,
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
                color: MUTED_COL,
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
          body { background: #FFFFFF !important; color: #1B2A4A !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}
