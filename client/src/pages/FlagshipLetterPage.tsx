/**
 * /letters/flagship — Flagship AI-Letter · Print-Quality Renderer
 *
 * Visual identity: cream paper (#f5efe0), Cormorant Garamond body,
 * Christie's black logo lockup, Flambeaux-style correspondence quality.
 *
 * PDF download: GET /api/pdf?url=/letters/flagship
 * Route registered in App.tsx as /letters/flagship
 * Content source: FLAGSHIP_LETTER_TEXT from server/letter-content.ts
 *                 served via tRPC flagship.getLetter endpoint.
 *
 * Doctrine 43 — PDF Light Mode Export Standard
 * ?pdf=1 → Puppeteer print mode (no header bar, no download button).
 */

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const CREAM       = '#f5efe0';
const CHARCOAL    = '#2c2c2c';
const GOLD        = '#c8ac78';
const MUTED       = 'rgba(44,44,44,0.50)';
const RULE_COLOR  = 'rgba(200,172,120,0.35)';

// ─── Asset URLs ────────────────────────────────────────────────────────────────
const CIREG_LOGO_BLACK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';
const ED_HEADSHOT      = 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/ed-headshot-primary_0f6df1af.jpg';

// ─── PDF mode detection ────────────────────────────────────────────────────────
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
// Short lines that don't end in punctuation are treated as section headings
function isSectionHeading(para: string): boolean {
  return para.length < 80 && !para.endsWith('.') && !para.endsWith(',') && !para.endsWith(':');
}

// ─── Strip "LEAD SUMMARY: …" prefix if present ────────────────────────────────
function stripLeadSummary(text: string): string {
  return text.replace(/^LEAD SUMMARY:.*?\n\n/s, '').trim();
}

// ─── Replace William/audio references with dashboard URL ──────────────────────
function sanitizeContent(text: string): string {
  // Replace the William paragraph with a clean dashboard invitation
  return text
    .replace(
      /William is the voice of this system[\s\S]*?he always tells the truth\./,
      'The dashboard is available at christiesrealestategroupeh.com — walk each tab to understand the full territory, the pipeline, and the growth model. Every number is live. Every relationship is mapped. The system does the thinking before you walk in the door.'
    )
    .replace(
      /Here is what we are asking\. Open the INTEL tab\. Add a contact\. Update a deal\. Connect a node\. Text William and tell us what he gets right and what he misses\. The more data you put in, the more intelligence comes back out\./,
      'Here is what we are asking. Open the INTEL tab. Add a contact. Update a deal. Connect a node. The more data you put in, the more intelligence comes back out.'
    );
}

export default function FlagshipLetterPage() {
  const [downloading, setDownloading] = useState(false);
  const isPdfMode = useIsPdfMode();

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

  const rawText = data?.text ? stripLeadSummary(data.text) : '';
  const cleanText = rawText ? sanitizeContent(rawText) : '';
  const paragraphs = cleanText ? splitParagraphs(cleanText) : [];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: '"Cormorant Garamond", Georgia, serif', color: CHARCOAL }}>

      {/* ── Screen header bar (hidden in PDF mode) ──────────────────────────── */}
      {!isPdfMode && (
        <header
          className="no-print"
          style={{
            background: CREAM,
            borderBottom: `1px solid ${RULE_COLOR}`,
            padding: '14px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <img
            src={CIREG_LOGO_BLACK}
            alt="Christie's International Real Estate Group"
            style={{ height: 28, objectFit: 'contain' }}
          />
          <button
            onClick={handleDownload}
            disabled={downloading || isLoading}
            style={{
              background: 'transparent',
              border: 'none',
              color: GOLD,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontVariant: 'small-caps',
              cursor: downloading ? 'not-allowed' : 'pointer',
              opacity: downloading ? 0.5 : 1,
              padding: '4px 0',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              transition: 'opacity 0.2s',
            }}
          >
            {downloading ? 'Generating…' : '↓ Download PDF'}
          </button>
        </header>
      )}

      {/* ── Letter body ─────────────────────────────────────────────────────── */}
      <main
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: isPdfMode
            ? '90px 72px 90px 72px'   /* 1.25in top/bottom, 1in sides at 72dpi */
            : '64px 48px 100px',
        }}
      >

        {/* Letterhead — logo centered */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img
            src={CIREG_LOGO_BLACK}
            alt="Christie's International Real Estate Group"
            style={{ height: 36, objectFit: 'contain' }}
          />
        </div>

        {/* Gold rule */}
        <div style={{ borderTop: `1px solid ${GOLD}`, opacity: 0.45, marginBottom: 32 }} />

        {/* Eyebrow */}
        <div style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          color: GOLD,
          fontSize: 10,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          fontVariant: 'small-caps',
          textAlign: 'center',
          marginBottom: 10,
        }}>
          Christie's East Hampton · Flagship Letter
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          color: CHARCOAL,
          fontWeight: 400,
          fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
          lineHeight: 1.2,
          textAlign: 'center',
          marginBottom: 8,
          letterSpacing: '0.01em',
        }}>
          A Letter from the Council
        </h1>

        {/* Date */}
        <div style={{
          color: MUTED,
          fontSize: '0.88rem',
          textAlign: 'center',
          marginBottom: 36,
          fontStyle: 'italic',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
        }}>
          {today}
        </div>

        {/* Gold rule */}
        <div style={{ borderTop: `1px solid ${GOLD}`, opacity: 0.35, marginBottom: 40 }} />

        {/* Loading / error states */}
        {isLoading && (
          <div style={{ color: MUTED, fontSize: '1rem', textAlign: 'center', padding: '60px 0', fontStyle: 'italic' }}>
            Loading…
          </div>
        )}
        {error && (
          <div style={{ color: '#b94a48', fontSize: '0.9rem', textAlign: 'center', padding: '60px 0' }}>
            Unable to load letter. Please refresh.
          </div>
        )}

        {/* Body paragraphs */}
        {paragraphs.map((para, i) => {
          if (isSectionHeading(para)) {
            return (
              <div key={i} style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: GOLD,
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontVariant: 'small-caps',
                marginTop: 40,
                marginBottom: 14,
              }}>
                {para}
              </div>
            );
          }
          return (
            <p key={i} style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              color: CHARCOAL,
              fontSize: '1.05rem',
              lineHeight: 1.75,
              marginBottom: 22,
              fontWeight: 400,
            }}>
              {para}
            </p>
          );
        })}

        {/* Signature block */}
        {paragraphs.length > 0 && (
          <>
            {/* Closing rule */}
            <div style={{ borderTop: `1px solid ${GOLD}`, opacity: 0.35, marginTop: 44, marginBottom: 36 }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
              {/* Headshot */}
              <img
                src={ED_HEADSHOT}
                alt="Ed Bruehl"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                  border: `1px solid ${RULE_COLOR}`,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: CHARCOAL,
                  marginBottom: 3,
                }}>
                  Ed Bruehl
                </div>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontVariant: 'small-caps',
                  color: GOLD,
                  marginBottom: 3,
                }}>
                  Managing Director · Christie's East Hampton
                </div>
                <div style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  fontSize: 9,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontVariant: 'small-caps',
                  color: MUTED,
                }}>
                  christiesrealestategroupeh.com
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 52,
              textAlign: 'center',
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontVariant: 'small-caps',
              color: GOLD,
              opacity: 0.7,
            }}>
              Christie's International Real Estate Group · Est. 1766
            </div>
          </>
        )}
      </main>

      {/* ── Print & font styles ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Barlow+Condensed:wght@400;500;600&display=swap');

        @media print {
          .no-print { display: none !important; }
          body { background: #f5efe0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: letter; margin: 1.25in 1in; }
        }
      `}</style>
    </div>
  );
}
