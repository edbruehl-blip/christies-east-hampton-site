/**
 * /letters/christies — Christie's Letter to the Families · Print-Quality Renderer
 *
 * Visual identity: cream paper (#f5efe0), Cormorant Garamond body,
 * Christie's black logo lockup, Flambeaux-style correspondence quality.
 * Matches FlagshipLetterPage visual treatment exactly.
 *
 * PDF download: GET /api/pdf?url=/letters/christies
 * Route registered in App.tsx as /letters/christies
 * Content source: CHRISTIES_LETTER_TEXT from server/letter-content.ts
 *                 served via tRPC flagship.getChristiesLetter endpoint.
 *
 * Doctrine 43 — PDF Light Mode Export Standard
 * ?pdf=1 → Puppeteer print mode (no header bar, no download button).
 */
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const CREAM      = '#f5efe0';
const CHARCOAL   = '#2c2c2c';
const GOLD       = '#c8ac78';
const MUTED      = 'rgba(44,44,44,0.50)';
const RULE_COLOR = 'rgba(200,172,120,0.35)';

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
function isSectionHeading(para: string): boolean {
  return para.length < 80 && !para.endsWith('.') && !para.endsWith(',') && !para.endsWith(':');
}

// ─── Extract Lead Summary and body text ───────────────────────────────────────
function parseContent(text: string): { leadSummary: string | null; bodyText: string } {
  const leadMatch = text.match(/^LEAD SUMMARY:\s*([\s\S]*?)\n\n/);
  const leadSummary = leadMatch ? leadMatch[1].trim() : null;
  const bodyText = text.replace(/^LEAD SUMMARY:[\s\S]*?\n\n/, '').trim();
  return { leadSummary, bodyText };
}

export default function ChristiesLetterPage() {
  const [downloading, setDownloading] = useState(false);
  const isPdfMode = useIsPdfMode();
  const { data, isLoading, error } = trpc.flagship.getChristiesLetter.useQuery();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/pdf?url=/letters/christies');
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date()
        .toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        .replace(/\//g, '-');
      a.href = url;
      a.download = `Christies_EH_Letter_to_Families_${today}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[ChristiesLetter] PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const rawText = data?.text ?? '';
  const { leadSummary, bodyText } = parseContent(rawText);
  const paragraphs = bodyText ? splitParagraphs(bodyText) : [];

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
          padding: isPdfMode ? '0' : '60px 48px 80px',
        }}
      >
        {/* Christie's logo lockup — centered at top */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img
            src={CIREG_LOGO_BLACK}
            alt="Christie's International Real Estate Group"
            style={{ height: 36, objectFit: 'contain' }}
          />
        </div>

        {/* Subtitle */}
        <div style={{
          textAlign: 'center',
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontVariant: 'small-caps',
          color: GOLD,
          marginBottom: 10,
        }}>
          East Hampton · Letter to the Families
        </div>

        {/* Title */}
        <h1 style={{
          textAlign: 'center',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 400,
          fontSize: '1.85rem',
          color: CHARCOAL,
          letterSpacing: '0.06em',
          margin: '0 0 10px',
        }}>
          A Letter to the Families of the East End
        </h1>

        {/* Tagline */}
        <div style={{
          textAlign: 'center',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          color: MUTED,
          marginBottom: 28,
        }}>
          Art. Beauty. Provenance. Since 1766.
        </div>

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

        {/* Lead Summary — italic pull-quote with left gold rule */}
        {leadSummary && !isLoading && (
          <div style={{
            borderLeft: `3px solid ${GOLD}`,
            paddingLeft: 20,
            marginBottom: 40,
            opacity: 0.85,
          }}>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontVariant: 'small-caps',
              color: GOLD,
              marginBottom: 8,
            }}>
              Lead Summary
            </div>
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: CHARCOAL,
              margin: 0,
            }}>
              {leadSummary}
            </p>
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
