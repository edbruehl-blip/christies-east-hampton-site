/**
 * /architecture-of-wealth — The Architecture of Wealth
 *
 * Visual identity: Flambeaux treatment — matches FlagshipLetterPage exactly.
 * Navy header with auction room bg, James Christie portrait, gold small-caps title, cream body.
 * Print-safe: navy header collapses to thin gold rule in @media print.
 *
 * Content: Two-part document — Part One (the architecture) + Part Two (Christie's framework).
 * PDF: window.print() — Doctrine 43. No Puppeteer dependency.
 * Route: /architecture-of-wealth (registered in App.tsx)
 *
 * Christie's International Real Estate Group · East Hampton
 */

import { JAMES_CHRISTIE_PORTRAIT_PRIMARY } from '@/lib/cdn-assets';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY  = '#1B2A4A';
const GOLD  = '#C8AC78';
const CREAM = '#FAF8F4';

// CDN assets
const CIREG_LOGO_WHITE = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';
const CIREG_LOGO_BLACK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';
const AUCTION_ROOM_BG  = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/DtTxqkdyvvLrygvu.jpg';

// ─── Compound interest table data ─────────────────────────────────────────────
const COMPOUND_TABLE = [
  { label: 'Person A', invests: 'Age 25–35 (10 years, then stops)', total: '$50,000', result: '~$602,000' },
  { label: 'Person B', invests: 'Age 35–65 (30 years)', total: '$150,000', result: '~$541,000' },
];

// ─── Christie's Ladder data ────────────────────────────────────────────────────
const LADDER_RUNGS = [
  { rung: '1', stage: 'Begin',   action: 'Income & Discipline',          lens: 'Education & Goal Setting' },
  { rung: '2', stage: 'Secure',  action: 'Reserves & Protection',        lens: 'Basic Insurance & Liquidity' },
  { rung: '3', stage: 'Buy',     action: 'First Foothold',               lens: 'Primary Residence Acquisition' },
  { rung: '4', stage: 'Add',     action: 'Second Lane',                  lens: 'Investment Property / Second Income' },
  { rung: '5', stage: 'Wrap',    action: 'Structured Capital',           lens: 'LLCs, Trusts, Advanced Insurance' },
  { rung: '6', stage: 'Govern',  action: 'Family Office',                lens: 'Cross-Asset Stewardship, Legacy' },
];

// ─── Seven-step conversation sequence ─────────────────────────────────────────
const SEVEN_STEPS = [
  { n: '1', title: 'Assess the Rung', body: 'Where is the client on the Christie\'s Ladder?' },
  { n: '2', title: 'Deploy the Parable', body: 'Use the Vanderbilt/Rockefeller story to establish the need for structure.' },
  { n: '3', title: 'Introduce Structured Capital', body: 'Explain that wealth requires architecture, not just accumulation.' },
  { n: '4', title: 'Run the CIS', body: 'Evaluate potential real estate assets using the Christie\'s Intelligence Score.' },
  { n: '5', title: 'Explain the Waterfall', body: 'Detail how trusts and insurance can fund the real estate acquisition.' },
  { n: '6', title: 'Open the Doors', body: 'Connect the client with the necessary specialists — a trusted financial architect for insurance and trusts, a financing specialist for acquisition structure.' },
  { n: '7', title: 'Establish Governance', body: 'Set the expectation for long-term stewardship and regular review.' },
];

export default function ArchitectureOfWealthPage() {
  const handlePrint = () => window.print();

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: '"Cormorant Garamond", serif' }}>

      {/* ── NAVY HEADER ─────────────────────────────────────────────────────── */}
      <header
        className="no-print letter-header"
        style={{
          position: 'relative',
          background: NAVY,
          overflow: 'hidden',
          borderBottom: `1px solid ${GOLD}`,
        }}
      >
        {/* Auction room background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${AUCTION_ROOM_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0.18,
        }} />

        {/* Top bar */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 40px',
          borderBottom: `1px solid rgba(200,172,120,0.2)`,
        }}>
          <img src={CIREG_LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 28, objectFit: 'contain' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: GOLD, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
              Architecture of Wealth
            </span>
            <button
              onClick={handlePrint}
              style={{
                background: 'transparent',
                border: `1px solid ${GOLD}`,
                color: GOLD,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '6px 16px', cursor: 'pointer',
              }}
            >
              ↓ Download PDF
            </button>
          </div>
        </div>

        {/* Hero row */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', alignItems: 'flex-end', gap: 32,
          padding: '32px 40px 36px',
          maxWidth: 800, margin: '0 auto',
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{
              padding: 4,
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 0 1px rgba(200,172,120,0.3), 0 8px 32px rgba(0,0,0,0.6)`,
              background: 'rgba(27,42,74,0.4)',
              display: 'inline-block',
            }}>
              <img
                src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
                alt="James Christie — Founder, Christie's, Est. 1766"
                style={{ width: 90, height: 115, objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
              />
            </div>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: GOLD, fontSize: 8, letterSpacing: '0.16em',
              textTransform: 'uppercase', marginTop: 6, textAlign: 'center',
            }}>
              James Christie<br/>Est. 1766
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: GOLD, fontSize: 10, letterSpacing: '0.24em',
              textTransform: 'uppercase', marginBottom: 10,
            }}>
              Christie's East Hampton · Private Advisory
            </div>
            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#FAF8F4', fontWeight: 400,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              lineHeight: 1.1, margin: '0 0 10px',
              letterSpacing: '0.04em',
            }}>
              The Architecture of Wealth
            </h1>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: 'rgba(250,248,244,0.55)', fontSize: '0.9rem',
              fontStyle: 'italic',
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      {/* ── PRINT-ONLY HEADER ────────────────────────────────────────────────── */}
      <div className="print-only-header" style={{ display: 'none' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0 12px', borderBottom: `2px solid ${GOLD}`, marginBottom: 24,
        }}>
          <img src={CIREG_LOGO_BLACK} alt="Christie's International Real Estate Group" style={{ height: 22 }} />
          <div style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            color: NAVY, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            Christie's East Hampton · Architecture of Wealth
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 28 }}>
          <img
            src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
            alt="James Christie"
            style={{ width: 60, height: 76, objectFit: 'cover', objectPosition: 'center 20%', border: `1px solid ${GOLD}` }}
          />
          <div>
            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: NAVY, fontWeight: 400, fontSize: '1.8rem',
              margin: '0 0 4px', letterSpacing: '0.04em',
            }}>
              The Architecture of Wealth
            </h1>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: GOLD, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
            }}>
              Christie's International Real Estate Group · East Hampton
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Preamble */}
        <p style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 36, borderLeft: `2px solid ${GOLD}`, paddingLeft: 16 }}>
          This document serves two purposes. Part One lays out the architecture of wealth. Part Two is the repeatable Christie's framework derived from that architecture, designed for use by the advisory team.
        </p>

        {/* ── PART ONE ── */}
        <SectionLabel>Part One: The Architecture</SectionLabel>

        <BodyParagraph>
          You are asking the right questions about how to build a life that lasts. Most people will give you advice about saving money or buying a stock index. That is fine for average outcomes. But if you have the discipline to build something significant, you need to understand the actual architecture of wealth.
        </BodyParagraph>
        <BodyParagraph>
          For twenty years on the East End of Long Island, we have sat across the glass table from some of the most successful families in the world. We see their balance sheets, their trusts, their properties, and their mistakes.
        </BodyParagraph>
        <BodyParagraph>
          What we have learned is that wealth is not just accumulated. It is curated, protected, and handed forward. The families who succeed do not just buy things; they build structure.
        </BodyParagraph>

        <SubHeading>The Vanderbilt vs. Rockefeller Parable</SubHeading>

        <BodyParagraph>
          There is a story that explains everything you need to know about how wealth survives or dies.
        </BodyParagraph>
        <BodyParagraph>
          When Cornelius Vanderbilt died in 1877, he was the richest man in America — worth the equivalent of roughly $200 billion in today's dollars. He left his fortune to his children. Within fifty years, the Vanderbilt wealth was largely gone. They built massive houses, threw incredible parties, and spent the principal. When 120 Vanderbilt descendants gathered for a family reunion in 1973, there was not a single millionaire among them.
        </BodyParagraph>
        <BodyParagraph>
          When John D. Rockefeller died, he was also the richest man in America. But he did not just leave money to his children. He left a structure. He built the 1934 Rockefeller Family Trust and the 1952 Rockefeller Brothers Fund — trusts and a family office with a system of governance. He required his heirs to learn how to manage capital before they could touch it. Today, Rockefeller Capital Management operates as the family bank. The family is in its seventh generation, with hundreds of descendants, and the wealth has compounded, not collapsed.
        </BodyParagraph>

        <Callout>The Vanderbilts bought things. The Rockefellers built structure.</Callout>

        <SubHeading>The Christie's Ladder</SubHeading>

        <BodyParagraph>
          You are not a Rockefeller yet. That is not the point. The point is that the architecture works at any scale, and you have to start building it now.
        </BodyParagraph>
        <BodyParagraph>
          Here is the ladder you are going to climb. It is the same ladder our clients climb, just at a different scale.
        </BodyParagraph>

        {/* Ladder numbered list */}
        <div style={{ margin: '20px 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { n: '1', t: 'Begin where you are.', b: 'You start with discipline and income. You save the first capital.' },
            { n: '2', t: 'Secure the base.', b: 'You build reserves so one bad month does not wipe you out.' },
            { n: '3', t: 'Buy the first foothold.', b: 'You buy the dirt underneath your work. You stop paying rent and start building equity.' },
            { n: '4', t: 'Add a second lane.', b: 'You create a second income stream or buy a second property. One engine becomes two.' },
            { n: '5', t: 'Wrap it in structure.', b: 'As value builds, you protect it. You use LLCs, trusts, and insurance. This is what we call Structured Capital.' },
            { n: '6', t: 'Think like a family office.', b: 'You govern the wealth so it lasts beyond your lifetime.' },
          ].map(item => (
            <div key={item.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 28, height: 28,
                background: NAVY, color: GOLD,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 2,
              }}>
                {item.n}
              </div>
              <div>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1rem' }}>{item.t}</span>
                {' '}
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.b}</span>
              </div>
            </div>
          ))}
        </div>

        <SubHeading>The Time Thesis</SubHeading>

        <BodyParagraph>
          You have the greatest asset in the world right now: time.
        </BodyParagraph>
        <BodyParagraph>
          Here is the counterintuitive math. Two people both invest $5,000 a year at a standard market return.
        </BodyParagraph>

        {/* Compound interest table */}
        <div style={{ margin: '20px 0 28px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: NAVY }}>
                {['Investor', 'Invests from', 'Total invested', 'Result at 65'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', color: GOLD, fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPOUND_TABLE.map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? '#F4F1EC' : CREAM, borderBottom: `1px solid rgba(27,42,74,0.08)` }}>
                  <td style={{ padding: '10px 14px', color: NAVY, fontWeight: 600 }}>{row.label}</td>
                  <td style={{ padding: '10px 14px', color: '#384249' }}>{row.invests}</td>
                  <td style={{ padding: '10px 14px', color: '#384249' }}>{row.total}</td>
                  <td style={{ padding: '10px 14px', color: NAVY, fontWeight: 600 }}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout>Person A invests one-third as much money and ends up with more. That is not a trick. That is compound interest. Time is the variable that cannot be bought back.</Callout>

        <SubHeading>The Waterfall Method</SubHeading>

        <BodyParagraph>
          This is the core of Structured Capital. It is how you protect the money from taxes, lawsuits, and your own bad decisions.
        </BodyParagraph>

        <div style={{ margin: '16px 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { n: '1', t: 'The Irrevocable Trust:', b: 'This is the vault. It holds the assets outside of your personal estate.' },
            { n: '2', t: 'Permanent Life Insurance:', b: 'This is the engine. It grows tax-free and provides liquidity when you need it.' },
            { n: '3', t: 'The Family Bank:', b: 'You borrow against the insurance policy to buy real estate or fund businesses. You pay yourself back with interest. The money does two jobs at once.' },
          ].map(item => (
            <div key={item.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 28, height: 28,
                background: GOLD, color: NAVY,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 2,
              }}>
                {item.n}
              </div>
              <div>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1rem' }}>{item.t}</span>
                {' '}
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.b}</span>
              </div>
            </div>
          ))}
        </div>

        <SubHeading>The Five-People Rule</SubHeading>

        <BodyParagraph>
          You need five people. One hand. That is the entire answer to the networking question for the next thirty years.
        </BodyParagraph>
        <BodyParagraph>
          Not a hundred contacts. Not a LinkedIn network. Five people who are ahead of you, who are honest with you, and who will pick up the phone. One mentor. One financial mind. One legal mind. One operator who has built something. One peer who is running the same race.
        </BodyParagraph>
        <Callout>Most people spend their entire career collecting acquaintances. The families who build wealth spend their career deepening five relationships at a time.</Callout>

        <SubHeading>The Three Doors</SubHeading>

        <BodyParagraph>
          To build this, you need the right people in the right seats. We are opening three doors.
        </BodyParagraph>

        <div style={{ margin: '16px 0 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Door One: The Financial Architect', body: 'We are connecting you with a trusted financial architect who understands Structured Capital. He will help you set up the Waterfall — the trust, the insurance policy, and the borrowing structure that makes the money work twice.' },
            { label: 'Door Two: The Credential', body: 'Authority in your field is not optional — it is the foundation of the table you will eventually sit at. Pursue the credential that gives you standing in your chosen domain. Know it cold. The credential is not the destination; it is the price of admission to the right rooms.' },
            { label: 'Door Three: The Name', body: 'You carry a name with integrity. Use it. When you call, tell them we sent you.' },
          ].map(door => (
            <div key={door.label} style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 16 }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1.05rem', marginBottom: 4 }}>{door.label}</div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.9rem', lineHeight: 1.7 }}>{door.body}</div>
            </div>
          ))}
        </div>

        <SubHeading>The Next 30 Days</SubHeading>

        <BodyParagraph>Here is your ground game.</BodyParagraph>

        <div style={{ margin: '16px 0 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Read this document twice.',
            'Connect with a trusted financing specialist — someone who can tell you what a purchase-plus-renovation loan looks like, what creative structures exist, and how to sequence the first acquisition. They turn a good idea into a plan with steps.',
            'Connect with a financial architect. Tell them you are ready to build the base.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 22, height: 22,
                border: `1.5px solid ${GOLD}`, color: GOLD,
                fontFamily: '"Barlow Condensed", sans-serif', fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 2,
              }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.9rem', lineHeight: 1.7 }}>{step}</div>
            </div>
          ))}
        </div>

        <Callout>Let's build it.</Callout>

        {/* ── PART TWO ── */}
        <div style={{ borderTop: `2px solid ${GOLD}`, margin: '48px 0 40px' }} />

        <SectionLabel>Part Two: The Framework</SectionLabel>

        <BodyParagraph>
          This section translates the architecture into a repeatable advisory framework for the Christie's East Hampton team.
        </BodyParagraph>

        <SubHeading>The Five Core Concepts</SubHeading>

        <div style={{ margin: '16px 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { n: '1', t: 'The Time Thesis:', b: 'Capital compounds. Time is the multiplier. Start early — the math is irreversible.' },
            { n: '2', t: 'The Vanderbilt/Rockefeller Parable:', b: 'Wealth without structure dissipates. Wealth with governance endures.' },
            { n: '3', t: 'The Christie\'s Ladder:', b: 'The six-step progression from earning to family office governance.' },
            { n: '4', t: 'Structured Capital:', b: 'The use of trusts, entities, and insurance to protect and optimize wealth.' },
            { n: '5', t: 'The Waterfall Method:', b: 'The specific mechanics of the family bank (Trust + Insurance + Borrowing).' },
          ].map(item => (
            <div key={item.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 24, height: 24,
                background: NAVY, color: GOLD,
                fontFamily: '"Barlow Condensed", sans-serif', fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 2,
              }}>
                {item.n}
              </div>
              <div>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1rem' }}>{item.t}</span>
                {' '}
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.b}</span>
              </div>
            </div>
          ))}
        </div>

        <SubHeading>The Christie's Ladder (Formalized)</SubHeading>

        <div style={{ margin: '20px 0 32px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: NAVY }}>
                {['Rung', 'Stage', 'Action', 'Christie\'s Lens'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', color: GOLD, fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LADDER_RUNGS.map((row, i) => (
                <tr key={row.rung} style={{ background: i % 2 === 0 ? '#F4F1EC' : CREAM, borderBottom: `1px solid rgba(27,42,74,0.08)` }}>
                  <td style={{ padding: '10px 14px', color: GOLD, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600, fontSize: 13 }}>{row.rung}</td>
                  <td style={{ padding: '10px 14px', color: NAVY, fontWeight: 600 }}>{row.stage}</td>
                  <td style={{ padding: '10px 14px', color: '#384249' }}>{row.action}</td>
                  <td style={{ padding: '10px 14px', color: '#384249' }}>{row.lens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SubHeading>The Diagnostic Instrument: CIS</SubHeading>

        <BodyParagraph>
          Before advising a client on real estate acquisition (Rungs 3 and 4), the advisor must use the Christie's Intelligence Score (CIS) framework to assess the territory.
        </BodyParagraph>

        <div style={{ margin: '12px 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'CIS evaluates the institutional grade of a market or specific asset across four dimensions.',
            'It moves the conversation from "how much does it cost?" to "how does this asset perform within a Structured Capital portfolio?"',
            'CIS is the territory diagnostic instrument in the Seven-Step Conversation Sequence below.',
          ].map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 6, height: 6, borderRadius: '50%', background: GOLD, marginTop: 8 }} />
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.9rem', lineHeight: 1.7 }}>{point}</div>
            </div>
          ))}
        </div>

        <SubHeading>The Seven-Step Conversation Sequence</SubHeading>

        <div style={{ margin: '16px 0 48px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SEVEN_STEPS.map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 28, height: 28,
                background: GOLD, color: NAVY,
                fontFamily: '"Barlow Condensed", sans-serif', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 2,
              }}>
                {step.n}
              </div>
              <div>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1rem' }}>{step.title}</span>
                {' '}
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.body}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid rgba(200,172,120,0.4)`,
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(27,42,74,0.45)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Art. Beauty. Provenance. · Christie's International Real Estate Group · Est. 1766
          </div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 9, letterSpacing: '0.1em' }}>
            christiesrealestategroupeh.com
          </div>
        </div>

      </main>

      {/* ── PRINT CSS ─────────────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only-header { display: block !important; }
          body { background: white !important; }
          @page { margin: 18mm 16mm; size: auto; }
        }
        @media screen {
          .print-only-header { display: none !important; }
        }
      `}</style>

    </div>
  );
}

// ─── Small helper components ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: '"Barlow Condensed", sans-serif',
      color: GOLD, fontSize: 10, letterSpacing: '0.24em',
      textTransform: 'uppercase', marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: '"Cormorant Garamond", serif',
      color: NAVY, fontWeight: 500,
      fontSize: '1.45rem', letterSpacing: '0.03em',
      margin: '32px 0 12px', lineHeight: 1.2,
    }}>
      {children}
    </h2>
  );
}

function BodyParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: '"Source Sans 3", sans-serif',
      color: '#384249', fontSize: '0.95rem',
      lineHeight: 1.8, marginBottom: 16,
    }}>
      {children}
    </p>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: '"Cormorant Garamond", serif',
      color: NAVY, fontSize: '1.15rem',
      fontStyle: 'italic', fontWeight: 500,
      lineHeight: 1.6,
      borderLeft: `3px solid ${GOLD}`,
      paddingLeft: 18,
      margin: '24px 0 28px',
    }}>
      {children}
    </div>
  );
}
