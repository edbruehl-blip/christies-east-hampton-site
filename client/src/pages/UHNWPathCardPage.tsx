/**
 * /cards/uhnw-path — UHNW Wealth Path Card · HTML Renderer
 *
 * Standalone route — no nav chrome, landscape print-ready.
 * "What James Christie Knew" — 8-rung wealth path from Tenant to UHNW Estate.
 *
 * PDF download: GET /api/pdf?url=/cards/uhnw-path
 * Route registered in App.tsx as /cards/uhnw-path
 * Filename map entry in pdf-route.ts: Christies_EH_UHNW_Path_Card
 *
 * Doctrine 43 — PDF Light Mode Export Standard (Sprint 11 · April 14, 2026)
 * ?pdf=1 → download bar hidden, clean cream background for Puppeteer.
 */

import { useState, useEffect } from 'react';

// ─── Doctrine 43 — PDF Light Mode Export Standard ─────────────────────────────
function useIsPdfMode(): boolean {
  const [isPdf, setIsPdf] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPdf(params.get('pdf') === '1');
  }, []);
  return isPdf;
}

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY   = '#384249';
const GOLD   = '#C8AC78';
const CREAM  = '#F9F5EF';
const BLUE   = '#2C5D8F';
const ORANGE = '#C47A3A';
const PURPLE = '#6B4C8A';
const MUTED  = '#999';
const DARK   = '#444';
const CIREG_LOGO = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';

// ─── Rung data ─────────────────────────────────────────────────────────────────
const RUNGS = [
  {
    num: '0', tag: 'The Starting Line', name: 'The Tenant',
    body: 'You are renting. That is a perfectly valid starting point — every dynasty began somewhere. Build a relationship with your landlord, care for the property, and position yourself for ownership.',
    hook: '"Let me review your lease and show you how to position yourself as the ideal buyer when the landlord is ready to sell."',
    hunt: 'High-income renters in Tier 1 Hamptons corridors; young professionals relocating to the East End.',
    anchor: 'The local who rented a cottage, treated it like gold, and bought it off-market from the retiring landlord five years later.',
  },
  {
    num: '1', tag: 'The First Move', name: 'Lease with Option to Buy',
    body: 'Lock in today\'s price, keep renting while you save, and buy the home you already live in. Turn your rent into a runway for equity. One agreement. Two possible outcomes.',
    hook: '"I will negotiate the option-to-buy clause into your next lease. I know how to structure it so the landlord wins too."',
    hunt: 'Landlords with aging portfolios who want passive income now but a guaranteed exit in 3–5 years.',
    anchor: 'The Griff Model — a first home purchased for modest value, renovated over two years of sweat equity, kept in the portfolio. The rent covered the mortgage. The appreciation funded the next acquisition.',
  },
  {
    num: '2', tag: 'The Foundation', name: 'Earn & Protect',
    body: 'Treat your family like a business. Establish a Family LLC. Put your kids on payroll. Fund Roth IRAs as a foundation tool — it grows with you. Protect what you earn from day one.',
    hook: '"I\'ve set up my own Family LLC and put my daughters on payroll. Let me introduce you to the CPA who built my foundation."',
    hunt: 'Local business owners, new entrepreneurs, and independent contractors in the Hamptons market.',
    anchor: 'The tradesman who shifted income into an LLC, hired his teenagers, and funded their Roth IRAs — multi-million dollar tax-free retirement by 50.',
  },
  {
    num: '3', tag: 'The Equity Engine', name: 'Primary Residence',
    body: 'Own the home you live in. Build equity. Refinance strategically. Use the HELOC as a capital tool, not a credit card. Your primary residence is the foundation of every wealth strategy that follows.',
    hook: '"I can show you how to use your home equity as a down payment on your next investment property without selling."',
    hunt: 'Move-up buyers in the $1M–$3M range; families outgrowing their first home.',
    anchor: 'The Springs family who bought at $850K, refinanced at peak equity, used the HELOC to buy a Montauk rental, and now holds $4M in real estate on a $90K salary.',
  },
  {
    num: '4', tag: 'The Income Layer', name: 'Investment Property',
    body: 'Buy a second property that pays for itself. Seasonal rentals in the Hamptons generate $80K–$200K annually. Your tenant funds your mortgage. Your equity compounds. Your tax bill shrinks.',
    hook: '"I know which hamlets have the highest seasonal rental yields. Let me show you the numbers before you decide."',
    hunt: 'Current homeowners with $200K+ in equity and a desire for passive income.',
    anchor: 'The Amagansett couple who bought a 3BR cottage for $1.1M, rented it seasonally for $140K/year, paid off the mortgage in 8 years, and now own it free and clear.',
  },
  {
    num: '5', tag: 'The Portfolio', name: 'Multi-Asset Holder',
    body: 'You own multiple properties. Now you need a strategy. 1031 exchanges. Cost segregation studies. Depreciation. A real estate attorney and a CPA who speak the same language. This is where Christie\'s adds institutional value.',
    hook: '"Christie\'s has relationships with the top 1031 exchange intermediaries in New York. Let me make an introduction."',
    hunt: 'Investors with 2+ properties looking to optimize tax position or consolidate into higher-value assets.',
    anchor: 'The investor who exchanged three modest rentals into a single $4M Bridgehampton estate — one transaction, zero capital gains, and a 40% increase in net rental income.',
  },
  {
    num: '6', tag: 'The Institutional Layer', name: 'Art-Secured Lending',
    body: 'Your art collection is a balance sheet asset. Christie\'s Financial Services provides non-recourse loans against fine art, jewelry, and collectibles. Liquidity without liquidation. Capital without a sale.',
    hook: '"Christie\'s can appraise your collection and structure a loan against it. You keep the art. You get the capital."',
    hunt: 'Collectors with $500K+ in fine art, jewelry, or wine who need liquidity for real estate acquisitions.',
    anchor: 'The collector who borrowed $2M against a single Basquiat, used it as a down payment on a $10M Southampton estate, and repaid the loan from the first year\'s rental income.',
  },
  {
    num: '7', tag: 'The Legacy', name: 'UHNW Estate',
    body: 'You are building a dynasty. Irrevocable trusts. Family Limited Partnerships. Charitable remainder trusts. A Christie\'s estate advisor and a generational wealth attorney. This is not a transaction. This is a legacy.',
    hook: '"I work with the families who have been here for three generations. Let me introduce you to the advisors who protect what they built."',
    hunt: 'Ultra-high-net-worth families with $20M+ in real estate assets and multi-generational estate planning needs.',
    anchor: 'The Hamptons family who structured a Qualified Personal Residence Trust in 2005, transferred a $3M estate to their children at a $900K gift tax value, and watched it appreciate to $12M — tax-free.',
  },
];

export default function UHNWPathCardPage() {
  const isPdfMode = useIsPdfMode();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/pdf?url=/cards/uhnw-path');
      if (!res.ok) {
        // Build 3 · Doctrine 43 fallback: Puppeteer failed → open page and trigger browser print dialog
        console.warn('[UHNWPathCard] PDF endpoint returned', res.status, '— falling back to window.print()');
        const printWin = window.open('/cards/uhnw-path', '_blank');
        if (printWin) {
          printWin.addEventListener('load', () => {
            setTimeout(() => printWin.print(), 500);
          });
        } else {
          // Pop-up blocked — print current page as last resort
          window.print();
        }
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
      a.href = url;
      a.download = `Christies_EH_UHNW_Path_Card_${today}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Network error — fall back to window.print()
      console.error('[UHNWPathCard] PDF download failed, falling back to print:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      id="uhnw-path-card-root"
      style={{
        background: CREAM,
        minHeight: '100vh',
        fontFamily: '"Source Sans 3", "Helvetica Neue", sans-serif',
        color: DARK,
      }}
    >
      {/* ── Download bar (screen only, hidden in print and PDF mode) ─────────── */}
      {!isPdfMode && (
        <div
          className="no-print"
          style={{
            background: NAVY,
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={CIREG_LOGO} alt="Christie's" style={{ height: 22 }} />
            <span style={{ color: CREAM, fontSize: 13, letterSpacing: '0.06em' }}>
              UHNW Wealth Path Card
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => window.print()}
              style={{
                background: 'transparent',
                border: `1px solid ${GOLD}`,
                color: GOLD,
                padding: '5px 16px',
                fontSize: 11,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                borderRadius: 2,
              }}
            >
              OPEN &amp; PRINT
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                background: GOLD,
                border: 'none',
                color: NAVY,
                padding: '5px 16px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: downloading ? 'not-allowed' : 'pointer',
                borderRadius: 2,
                opacity: downloading ? 0.7 : 1,
              }}
            >
              {downloading ? 'GENERATING…' : 'DOWNLOAD PDF'}
            </button>
          </div>
        </div>
      )}

      {/* ── Card body — landscape proportions ──────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 0 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: NAVY,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <img src={CIREG_LOGO} alt="Christie's" style={{ height: 22 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: CREAM, fontSize: 15, fontWeight: 700, letterSpacing: '0.04em' }}>
              What James Christie Knew
            </div>
            <div style={{ color: GOLD, fontSize: 10, letterSpacing: '0.12em', marginTop: 2 }}>
              Ed Bruehl · Managing Director · Christie's East Hampton
            </div>
          </div>
          <div style={{ color: CREAM, fontSize: 10, fontStyle: 'italic', maxWidth: 220, textAlign: 'right' }}>
            "Wherever you are on this ladder, I am here to help. Let's talk."
          </div>
        </div>

        {/* Gold strip */}
        <div
          style={{
            background: GOLD,
            padding: '5px 20px',
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.14em',
          }}
        >
          The Christie's Standard · Through the Lens of James Christie, 1766
        </div>

        {/* Subtitle */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 10,
            color: MUTED,
            padding: '6px 20px 4px',
            letterSpacing: '0.06em',
          }}
        >
          The Christie's Standard for Ownership, Structure, and Legacy
        </div>

        {/* Eight rung columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 6,
            padding: '0 10px',
          }}
        >
          {RUNGS.map((rung) => (
            <div
              key={rung.num}
              style={{
                background: '#fff',
                borderRadius: 4,
                padding: '10px 8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {/* Rung number */}
              <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                {rung.num}
              </div>
              {/* Tag */}
              <div style={{ fontSize: 8, color: MUTED, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2, marginBottom: 4 }}>
                {rung.tag}
              </div>
              {/* Name */}
              <div style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 6, lineHeight: 1.2 }}>
                {rung.name}
              </div>
              {/* Body */}
              <div style={{ fontSize: 8.5, color: DARK, lineHeight: 1.45, marginBottom: 8 }}>
                {rung.body}
              </div>

              {/* Ed's Hook */}
              <div style={{ borderLeft: `2px solid ${BLUE}`, paddingLeft: 6, marginBottom: 8 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: BLUE, letterSpacing: '0.08em', marginBottom: 2 }}>
                  ED'S HOOK
                </div>
                <div style={{ fontSize: 8, fontStyle: 'italic', color: DARK, lineHeight: 1.4 }}>
                  {rung.hook}
                </div>
              </div>

              {/* Perplexity Hunt */}
              <div style={{ borderLeft: `2px solid ${ORANGE}`, paddingLeft: 6, marginBottom: 8 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: ORANGE, letterSpacing: '0.08em', marginBottom: 2 }}>
                  PERPLEXITY HUNT
                </div>
                <div style={{ fontSize: 8, color: '#666', lineHeight: 1.4 }}>
                  {rung.hunt}
                </div>
              </div>

              {/* Wealth Anchor */}
              <div style={{ borderLeft: `2px solid ${PURPLE}`, paddingLeft: 6 }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: PURPLE, letterSpacing: '0.08em', marginBottom: 2 }}>
                  WEALTH ANCHOR
                </div>
                <div style={{ fontSize: 8, fontStyle: 'italic', color: '#555', lineHeight: 1.4 }}>
                  {rung.anchor}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            background: NAVY,
            margin: '8px 10px 0',
            borderRadius: 2,
            padding: '10px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: CREAM, fontSize: 11, fontStyle: 'italic', marginBottom: 4 }}>
            "The Christie's Standard is not a price point. It is a commitment to the relationship between art, beauty, and provenance."
          </div>
          <div style={{ color: GOLD, fontSize: 9, letterSpacing: '0.06em' }}>
            Ed Bruehl, Managing Director · M: 646.752.1233 · O: 631.771.7004 · edbruehl@christiesrealestategroup.com · 26 Park Place, East Hampton NY 11937
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: #F9F5EF !important; }
          #uhnw-path-card-root { padding: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        @page { size: landscape; margin: 0.25in; }
      `}</style>
    </div>
  );
}
