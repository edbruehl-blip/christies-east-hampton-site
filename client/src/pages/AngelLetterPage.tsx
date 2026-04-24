/**
 * AngelLetterPage — /letters/angel
 *
 * Angel Day One Orientation Letter — April 29, 2026.
 * Flambeaux treatment: navy header, James Christie portrait, cream body.
 * Printable physical artifact for Angel's first day.
 *
 * Route: /letters/angel (registered in App.tsx)
 */
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY } from '@/lib/cdn-assets';

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY    = '#1B2A4A';
const GOLD    = '#947231';
const CREAM   = '#FAF8F4';
const MUTED   = 'rgba(27,42,74,0.6)';

// CDN assets
const CIREG_LOGO_WHITE = 'https://d3w216np43fnr4.cloudfront.net/10580/348947/1.png';
const CIREG_LOGO_BLACK = 'https://d3w216np43fnr4.cloudfront.net/10580/348547/1.png';
const AUCTION_ROOM_BG  = 'https://files.manuscdn.com/user_upload_by_module/session_file/115914870/DtTxqkdyvvLrygvu.jpg';
const ED_HEADSHOT      = 'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/ed-headshot-primary_0f6df1af.jpg';

const ANGEL_LETTER_PARAGRAPHS = [
  `Welcome to Christie's East Hampton. Today is Day One — and you are not walking into a brokerage. You are walking into an institution that has served collectors, landowners, and legacy families for two hundred and sixty years. That context is not decoration. It is the foundation of every conversation you will have on the East End.`,

  `Your role is Marketing Coordinator + Sales. That means you are the connective tissue of this office — the person who ensures that every family who walks through the door at 26 Park Place, or who receives a letter, or who hears Ed's name in a conversation, experiences the same level of care and precision that Christie's has always stood for. You are not support staff. You are an institutional representative.`,

  `Here is what you need to know about how we operate. The dashboard at christiesrealestategroupeh.com is the operating system for this office. It has six layers: HOME, MARKET, MAPS, PIPE, FUTURE, and INTEL. You will learn each one. The Christie's logo in the top left is the only way to return to HOME — that is intentional. Every letter surface, every report, every brief flows through this system.`,

  `The team you are joining: Ed Bruehl, Managing Director. Jarvis, COO · Licensed Real Estate Salesperson. You, Angel. Zoila joins alongside you. Scott Smith joins June 1. Richard Bruehl serves as Strategic Advisor and founding partner of AnewHomes. This is a small, high-trust team. Everyone here is expected to operate at an institutional level — not because it is required, but because the families we serve deserve nothing less.`,

  `Your AnewHomes equity is 5%, fully vested with no cliff, effective Day One. This is a structural share in the AnewHomes entity, not a bonus.`,

  `The doctrines that govern this office are not rules imposed from above — they are the distilled wisdom of everything this institution has learned about how to serve families well. Fifty canonical doctrines. The most important ones for Day One: we never name a competitor. We never put GCI on a public surface. We never say "South Fork" — it is always "the East End." And every letter, every conversation, every closing ends the same way: "The door is always open — we look forward to meeting you."`,

  `You have access to the Miro board, the Trello board, the Growth Model, and the dashboard. Everything is open. Nothing is locked from you. The only thing we ask is that you bring the same care to every interaction that this institution has brought to its clients for two and a half centuries.`,

  `We are glad you are here. The door is always open — we look forward to building this with you.`,
];

export default function AngelLetterPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: CREAM, minHeight: '100vh', fontFamily: '"Cormorant Garamond", serif' }}>

      {/* NAVY HEADER — Flambeaux treatment */}
      <header className="no-print letter-header" style={{ position: 'relative', background: NAVY, overflow: 'hidden', borderBottom: `1px solid ${GOLD}` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${AUCTION_ROOM_BG})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', opacity: 0.18 }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: `1px solid rgba(200,172,120,0.2)` }}>
          <img src={CIREG_LOGO_WHITE} alt="Christie's International Real Estate Group" style={{ height: 28, objectFit: 'contain' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Day One · Angel</span>
            <button onClick={handlePrint} style={{ background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '6px 16px', cursor: 'pointer' }}>↓ Download PDF</button>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', gap: 32, padding: '32px 40px 36px', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ padding: 4, border: `2px solid ${GOLD}`, boxShadow: `0 0 0 1px rgba(200,172,120,0.3), 0 8px 32px rgba(0,0,0,0.6)`, background: 'rgba(27,42,74,0.4)', display: 'inline-block' }}>
              <img src={JAMES_CHRISTIE_PORTRAIT_PRIMARY} alt="James Christie — Founder, Christie's, Est. 1766" style={{ width: 90, height: 115, objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
            </div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 6, textAlign: 'center' }}>James Christie · London · 1766</div>
          </div>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 10 }}>Christie's East Hampton · Day One Orientation</div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', lineHeight: 1.1, margin: '0 0 10px', letterSpacing: '0.04em' }}>A Letter to Angel</h1>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: 'rgba(250,248,244,0.55)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              April 2026
            </div>
          </div>
        </div>
      </header>

      {/* PRINT-ONLY header */}
      <div className="print-only-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 12px', borderBottom: `2px solid ${GOLD}`, marginBottom: 24 }}>
          <img src={CIREG_LOGO_BLACK} alt="Christie's International Real Estate Group" style={{ height: 22 }} />
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: NAVY, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Christie's East Hampton · Day One · Angel</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 28 }}>
          <img src={JAMES_CHRISTIE_PORTRAIT_PRIMARY} alt="James Christie" style={{ width: 60, height: 76, objectFit: 'cover', objectPosition: 'center 20%', border: `1px solid ${GOLD}` }} />
          <div>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 400, fontSize: '1.8rem', margin: '0 0 4px', letterSpacing: '0.04em' }}>A Letter to Angel</h1>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: MUTED, fontSize: '0.85rem', fontStyle: 'italic' }}>
              April 2026
            </div>
          </div>
        </div>
      </div>

      {/* LETTER BODY */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '56px 32px 80px' }}>

        {/* Confidential banner */}
        <div style={{ background: NAVY, borderLeft: `3px solid ${GOLD}`, padding: '14px 20px', marginBottom: 40, borderRadius: 2 }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', lineHeight: 1.6, color: '#FAF8F4', margin: 0, fontStyle: 'italic' }}>
            This letter is your Day One orientation artifact. It contains your role, your equity terms, the team structure, and the doctrines that govern how we operate. Keep it. Reference it. It is yours.
          </p>
        </div>

        {/* Portrait float */}
        <div className="no-print" style={{ float: 'left', marginRight: 28, marginBottom: 12, marginTop: 4 }}>
          <div style={{ padding: 3, border: `2px solid ${GOLD}`, boxShadow: `0 0 0 1px rgba(200,172,120,0.25), 0 6px 20px rgba(27,42,74,0.15)`, background: CREAM }}>
            <img src={JAMES_CHRISTIE_PORTRAIT_PRIMARY} alt="James Christie — Founder, Christie's, Est. 1766" style={{ width: 80, height: 102, objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
          </div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 5, textAlign: 'center' }}>James Christie · London · 1766</div>
        </div>

        {ANGEL_LETTER_PARAGRAPHS.map((para, i) => (
          <p key={i} style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontSize: '1.15rem', lineHeight: 1.85, marginBottom: 28, fontWeight: 400 }}>{para}</p>
        ))}

        <div style={{ clear: 'both' }} />
        <div style={{ borderTop: `1px solid ${GOLD}`, marginTop: 48, marginBottom: 36, opacity: 0.4 }} />

        {/* Ed signature block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div style={{ padding: 3, border: `2px solid ${GOLD}`, boxShadow: `0 0 0 1px rgba(200,172,120,0.2)`, flexShrink: 0 }}>
            <img src={ED_HEADSHOT} alt="Ed Bruehl" style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
          </div>
          <div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1rem', marginBottom: 2 }}>Ed Bruehl</div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: MUTED, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 3 }}>Managing Director · Christie's East Hampton</div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 10, letterSpacing: '0.12em' }}>christiesrealestategroupeh.com · 646-752-1233</div>
          </div>
        </div>

        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: MUTED, fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
          Christie's International Real Estate Group · East Hampton · Since 1766
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Barlow+Condensed:wght@400;500;600&display=swap');
        @media print {
          .no-print { display: none !important; }
          .letter-header { display: none !important; }
          .print-only-header { display: block !important; }
          body { background: #FFFFFF !important; }
          main { padding: 0 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          p { color: #1B2A4A !important; font-size: 14pt !important; line-height: 1.8 !important; }
          img { max-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
