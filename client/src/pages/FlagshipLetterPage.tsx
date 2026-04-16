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
 *
 * Person-specific variants (Council Brief April 17, 2026):
 * ?person=angel  → Angel Theodore Welcome Letter
 * ?person=jarvis → Jarvis Slade Executive Briefing
 * (no param)     → Standard Invitation Letter (default)
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

// ─── Person-specific letter content ───────────────────────────────────────────
type PersonKey = 'default' | 'angel' | 'jarvis';

interface PersonLetter {
  eyebrow: string;
  title: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
}

const PERSON_LETTERS: Record<PersonKey, PersonLetter> = {
  default: {
    eyebrow: "Christie's East Hampton · Flagship Letter",
    title: 'A Letter from the Council',
    salutation: 'Welcome.',
    paragraphs: [
      'You are looking at something that has been in the making for a long time — not just the last few months, but the last several years of thinking about what a real estate practice could look like if it was built with the same care as the institutions it serves.',
      'This is Christie\'s East Hampton. The dashboard you are looking at is the operating layer — market data, pipeline, team trajectory, and institutional intelligence, all in one place. It is not finished. It is not supposed to be. It is alive, and it gets better every time someone with a good eye looks at it and tells us what they see.',
      'If you are here in the next 10 days, you are here because Ed trusts your eye. Take a look around. Tell him what you think. That is the only ask.',
      'The FUTURE tab is where the model lives. The PIPE tab is where the deals live. The INTEL tab is where the relationships live. The MARKET tab is where the macro context lives.',
      'Start anywhere. Ask anything. That is what this is for.',
    ],
    closing: '— Christie\'s East Hampton · Est. 1766 · Flagship Team 2026',
  },
  angel: {
    eyebrow: "Christie's East Hampton · Welcome",
    title: 'Angel — Welcome.',
    salutation: 'Angel — welcome.',
    paragraphs: [
      'You are the first person outside the founding circle to walk through this door, and that is not an accident.',
      'What you are looking at is the operating system for the Christie\'s East Hampton flagship team. It tracks deals, models the team\'s financial trajectory through 2036, monitors the Hamptons market in real time, and maps the relationships that move this market. It is built to remove friction so that the people on this team can focus on what they are actually good at.',
      'Your card is in the FUTURE tab. It shows your income streams, your trajectory, and your role in the model. Look at it. Ask questions about every line. Nothing on that card is aspirational — it is formula-bound to the same spreadsheet that drives the arc chart above it.',
      'The next 10 days matter. April 29 is the Flagship Relaunch. Between now and then, we are asking everyone with eyes on this to tell us what they see — what is working, what is missing, what could be clearer. You are one of those people. Your perspective is not just welcome, it is needed.',
      'Your Trello board is in the INTEL tab. Open it. Your card is already there in the FLAGSHIP TEAM list. That is where your role, your targets, and your first actions live.',
      'Mondays are pipeline with Ed and Jarvis. Wednesdays are The Circuit — full office, macro data, institutional trajectory. You are part of both.',
      'Tell Ed what you think. That is the only ask for today.',
    ],
    closing: '— Christie\'s East Hampton · Flagship Team 2026',
  },
  jarvis: {
    eyebrow: "Christie's East Hampton · Executive Briefing",
    title: 'Jarvis — here is the engine.',
    salutation: 'Jarvis — here is the engine.',
    paragraphs: [
      'You are looking at the performance layer of the Christie\'s East Hampton flagship team. The FUTURE tab is the pro forma. The arc chart is the institutional trajectory — $20M in 2025 to $3.0B combined volume by 2036, three offices, 36 elite producers. The headcount table below it is the base engine math — the mechanics that produce that arc.',
      'Every number on this page traces to a single source: Growth Model v2. The OUTPUTS sheet is the canonical feed. If a number on any card does not match what you expect, that sheet is where you go first.',
      'The 100-day blocks are the accountability structure. First 100 Days: Foundation — done. Second 100 Days: Flagship Team Activation — doing. Third 100 Days: Market Presence — incoming May 4. Each block has three rows: Shareholder, Client, Team. Every item in every row is either closed, in contract, or on the board.',
      'Your card is in the FUTURE tab. It shows your production trajectory, your AnewHomes equity stake, and your ICA Override. Look at it. If anything does not trace, tell Ed. That is exactly the kind of feedback that makes this better.',
      'The next 10 days are the refinement window. April 29 is the Flagship Relaunch. Between now and then, we are asking everyone with a sharp eye to look at this and tell us what they see. You have the sharpest operational eye on this team. Use it.',
      'Open Growth Model v2 at the bottom of the FUTURE tab. Review the OUTPUTS sheet. Flag anything that does not hold. That is the ask.',
    ],
    closing: '— Christie\'s East Hampton · Flagship Team 2026',
  },
};

// ─── Favicon injection (Rule: every standalone page route MUST have the Christie's favicon) ──
function useFavicon(person: PersonKey) {
  useEffect(() => {
    const FAVICON_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/favicon_656f6f8c.ico';
    let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = FAVICON_URL;
    const titles: Record<PersonKey, string> = {
      default: "Christie's East Hampton — Flagship Letter",
      angel: "Christie's East Hampton — Welcome, Angel",
      jarvis: "Christie's East Hampton — Executive Briefing",
    };
    document.title = titles[person];
  }, [person]);
}

// ─── PDF mode + person detection ──────────────────────────────────────────────
// Read synchronously on first render so the correct letter variant is shown
// immediately without a flash of the default letter.
function parseUrlParams(): { isPdf: boolean; person: PersonKey } {
  const p = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const isPdf = p.get('pdf') === '1';
  const raw = p.get('person')?.toLowerCase();
  const person: PersonKey = raw === 'angel' ? 'angel' : raw === 'jarvis' ? 'jarvis' : 'default';
  return { isPdf, person };
}

function useUrlParams(): { isPdf: boolean; person: PersonKey } {
  const [params] = useState<{ isPdf: boolean; person: PersonKey }>(parseUrlParams);
  return params;
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

// ─── Strip "LEAD SUMMARY: …" prefix if present ────────────────────────────────
function stripLeadSummary(text: string): string {
  return text.replace(/^LEAD SUMMARY:.*?\n\n/s, '').trim();
}

// ─── Replace William/audio references with dashboard URL ──────────────────────
function sanitizeContent(text: string): string {
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
  const { isPdf: isPdfMode, person } = useUrlParams();
  useFavicon(person);

  // Only fetch from tRPC for the default letter (the AI-generated flagship letter)
  const { data, isLoading, error } = trpc.flagship.getLetter.useQuery(undefined, {
    enabled: person === 'default',
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const suffix = person !== 'default' ? `?person=${person}` : '';
      const res = await fetch(`/api/pdf?url=/letters/flagship${suffix}`);
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      const nameMap: Record<PersonKey, string> = {
        default: 'Flagship_Letter',
        angel: 'Angel_Welcome',
        jarvis: 'Jarvis_Executive_Briefing',
      };
      a.href = url;
      a.download = `Christies_EH_${nameMap[person]}_${today}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[FlagshipLetter] PDF download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // ─── Determine content to render ────────────────────────────────────────────
  const isPersonLetter = person !== 'default';
  const personContent = PERSON_LETTERS[person];

  // For default: use tRPC data (AI flagship letter)
  const rawText = data?.text ? stripLeadSummary(data.text) : '';
  const cleanText = rawText ? sanitizeContent(rawText) : '';
  const defaultParagraphs = cleanText ? splitParagraphs(cleanText) : [];

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
            disabled={downloading || (!isPersonLetter && isLoading)}
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
            ? '90px 72px 90px 72px'
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
          {personContent.eyebrow}
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
          {personContent.title}
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

        {/* ── Person-specific letter (angel / jarvis) ── */}
        {isPersonLetter && (
          <>
            {personContent.paragraphs.map((para, i) => (
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
            ))}

            {/* Closing line */}
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              color: MUTED,
              fontSize: '0.95rem',
              lineHeight: 1.75,
              marginBottom: 22,
              fontStyle: 'italic',
            }}>
              {personContent.closing}
            </p>
          </>
        )}

        {/* ── Default AI flagship letter ── */}
        {!isPersonLetter && (
          <>
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

            {defaultParagraphs.map((para, i) => {
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
          </>
        )}

        {/* Signature block (shown when content is available) */}
        {(isPersonLetter || defaultParagraphs.length > 0) && (
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
