import React from 'react';
import { LOGO_WHITE } from '@/lib/cdn-assets';

// Sprint 9 Council Brief — Sprints 16–19 summary
// Covers: Pro Forma live URL, /api/pdf Puppeteer architecture, Doctrines 27–39
// Standard document surface route — NOT a gate document
// Puppeteer photograph target for /api/pdf?url=/council-brief

const COUNCIL_BRIEF_DATE = 'April 12, 2026';
const SPRINT_RANGE = 'Sprints 16–19';

export default function CouncilBriefPage() {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/api/pdf?url=/council-brief';
    a.download = `Christies_EH_Council_Brief_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: '#FAF8F4',
        fontFamily: '"Cormorant Garamond", "Georgia", serif',
        padding: '60px 40px',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(200,172,120,0.3)',
          paddingBottom: 32,
          marginBottom: 48,
        }}
      >
        <div>
          <img
            src={LOGO_WHITE}
            alt="Christie's"
            style={{ height: 28, opacity: 0.9, filter: 'brightness(1.1)' }}
          />
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(200,172,120,0.6)',
              marginTop: 6,
            }}
          >
            East Hampton · Flagship Operations
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(200,172,120,0.6)',
            }}
          >
            Council Brief
          </div>
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'rgba(250,248,244,0.4)',
              marginTop: 4,
            }}
          >
            {COUNCIL_BRIEF_DATE}
          </div>
        </div>
      </div>

      {/* Title Block */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#C8AC78',
            marginBottom: 12,
          }}
        >
          {SPRINT_RANGE} · Flagship AI Dashboard
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: '0.02em',
            lineHeight: 1.15,
            color: '#FAF8F4',
            margin: 0,
          }}
        >
          Council Brief
        </h1>
        <div
          style={{
            width: 48,
            height: 1,
            background: 'rgba(200,172,120,0.5)',
            marginTop: 20,
          }}
        />
      </div>

      {/* Lead Summary Paragraph (Doctrine 37) */}
      <div
        style={{
          background: 'rgba(200,172,120,0.06)',
          border: '1px solid rgba(200,172,120,0.2)',
          borderLeft: '3px solid rgba(200,172,120,0.6)',
          padding: '20px 24px',
          marginBottom: 48,
          borderRadius: 2,
        }}
      >
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: 'rgba(250,248,244,0.85)',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          This brief documents the architectural decisions, doctrine locks, and live infrastructure
          delivered across {SPRINT_RANGE} of the Christie's East Hampton Flagship AI Dashboard. It
          serves as the institutional record for the Council and as the operator sign-off surface
          for the Pro Forma presentation per Doctrine 33.
        </p>
      </div>

      {/* Section: What Was Built */}
      <Section title="I. What Was Built">
        <p>
          The Flagship AI Dashboard now operates as a three-layer institutional intelligence
          platform: Google Drive as content source of truth, Trello as structural index, and the
          Dashboard as the live performance and presentation layer. Every document surface has a
          permanent URL. PDFs are Puppeteer photographs of those live URLs — no jsPDF, no
          html2canvas.
        </p>
        <p style={{ marginTop: 16 }}>
          Live document surfaces delivered this sprint cycle:
        </p>
        <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
          <li><code style={codeStyle}>/pro-forma</code> — 4-page institutional Pro Forma, live tRPC data, Ilija-ready</li>
          <li><code style={codeStyle}>/future</code> — FUTURE tab Puppeteer photograph target</li>
          <li><code style={codeStyle}>/letters/flagship</code> — Flagship AI-Letter with Lead Summary Paragraph</li>
          <li><code style={codeStyle}>/letters/christies</code> — James Christie letter to families</li>
          <li><code style={codeStyle}>/council-brief</code> — This document</li>
          <li><code style={codeStyle}>GET /api/pdf?url=</code> — Generic Puppeteer endpoint photographing any live route</li>
        </ul>
      </Section>

      {/* Section: Audio Architecture */}
      <Section title="II. Audio Architecture (Doctrine 34)">
        <p>
          Two-channel architecture is locked. The Dashboard is a visual and PDF-only surface.
          William (WhatsApp) is the exclusive voice channel. Four keywords are live:{' '}
          <strong>NEWS</strong>, <strong>BRIEF</strong>, <strong>LETTER</strong>, and{' '}
          <strong>FLAGSHIP</strong>. Zero audio buttons appear on any live URL document surface.
          ElevenLabs model is locked to <code style={codeStyle}>eleven_turbo_v2</code> (Doctrine 9).
        </p>
      </Section>

      {/* Section: Single Source of Truth */}
      <Section title="III. Letter Architecture (Single Source of Truth)">
        <p>
          <code style={codeStyle}>letter-content.ts</code> is the single source of truth for both
          letter texts. One edit propagates simultaneously to the WhatsApp TTS audio channel and
          the live URL renderer. The tRPC procedures{' '}
          <code style={codeStyle}>flagship.getLetter</code> and{' '}
          <code style={codeStyle}>flagship.getChristiesLetter</code> both import from this file.
        </p>
      </Section>

      {/* Section: Doctrine Locks */}
      <Section title="IV. Doctrine Locks This Cycle (27–39)">
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr>
              <th style={thStyle}>Doctrine</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {DOCTRINE_TABLE.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(200,172,120,0.1)' }}>
                <td style={tdStyle}>{row.num}</td>
                <td style={tdStyle}>{row.name}</td>
                <td style={{ ...tdStyle, color: '#C8AC78' }}>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Section: Competitor Name Audit */}
      <Section title="V. Competitor Name Audit — Clean">
        <p>
          Full audit completed. Zero competitor names remain on any public-facing surface or in
          any internal comment. Five violations across four files were identified and removed.
          All market attribution now reads: <em>"Verified market intelligence · Christie's East
          Hampton internal analysis · MLS-backed public records."</em>
        </p>
      </Section>

      {/* Section: Next Steps */}
      <Section title="VI. Open Items — Sprint 10">
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>Mission Model standalone route (<code style={codeStyle}>/mission-model</code>)</li>
          <li>Bike Card standalone route (<code style={codeStyle}>/bike-card</code>)</li>
          <li>UHNW Wealth Path Card standalone route (<code style={codeStyle}>/uhnw-wealth-path</code>)</li>
          <li>INTEL tab Trello iframe embed (Board A public URL required from Ed)</li>
          <li>GitHub backup push (Settings → GitHub panel)</li>
          <li>Legacy audio button removal from HOME tab and <code style={codeStyle}>/report</code></li>
        </ul>
      </Section>

      {/* Download Button */}
      <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(200,172,120,0.2)' }}>
        <button
          onClick={handleDownload}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 20px',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#FAF8F4',
            background: 'rgba(200,172,120,0.08)',
            border: '1px solid rgba(200,172,120,0.5)',
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          ↓ Download Council Brief · PDF
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(200,172,120,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(200,172,120,0.4)',
          }}
        >
          Christie's East Hampton · Flagship AI Dashboard · Confidential
        </span>
        <span
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.14em',
            color: 'rgba(250,248,244,0.25)',
          }}
        >
          {COUNCIL_BRIEF_DATE}
        </span>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 44 }}>
      <h2
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#C8AC78',
          marginBottom: 16,
          fontWeight: 400,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: 'rgba(250,248,244,0.8)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const codeStyle: React.CSSProperties = {
  fontFamily: '"Courier New", monospace',
  fontSize: 12,
  background: 'rgba(200,172,120,0.1)',
  padding: '1px 5px',
  borderRadius: 2,
  color: '#C8AC78',
};

const thStyle: React.CSSProperties = {
  fontFamily: '"Barlow Condensed", sans-serif',
  fontSize: 9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(200,172,120,0.6)',
  textAlign: 'left',
  padding: '8px 12px',
  borderBottom: '1px solid rgba(200,172,120,0.25)',
  fontWeight: 400,
};

const tdStyle: React.CSSProperties = {
  fontSize: 13,
  padding: '10px 12px',
  color: 'rgba(250,248,244,0.75)',
  verticalAlign: 'top',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const DOCTRINE_TABLE = [
  { num: '27', name: 'Live URL Architecture', status: 'Locked' },
  { num: '28', name: 'PDF as Puppeteer Photograph', status: 'Locked' },
  { num: '29', name: 'No jsPDF on Document Surfaces', status: 'Locked' },
  { num: '30', name: 'Pro Forma as Institutional Gate Document', status: 'Locked' },
  { num: '31', name: 'Three-Layer Architecture', status: 'Locked' },
  { num: '31.4', name: 'Notion Retired', status: 'RETIRED' },
  { num: '31.5', name: 'Trello as Structural Layer', status: 'Locked' },
  { num: '31.6', name: 'Tool Selection by Team Adoption', status: 'Locked' },
  { num: '32', name: 'EOD Brief Template', status: 'Locked' },
  { num: '33', name: 'Operator Sign-Off Before Gate-Ready', status: 'Locked' },
  { num: '34', name: 'Two-Channel Audio Architecture', status: 'Locked' },
  { num: '35', name: 'Full Data Audit Before New Builds', status: 'Locked' },
  { num: '36', name: 'Seven-Minute Lock-to-Live Standard', status: 'Locked' },
  { num: '37', name: 'Lead Summary Paragraph on Every Letter', status: 'Locked' },
];
