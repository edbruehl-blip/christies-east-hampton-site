/**
 * PublicPage — Christie's East Hampton · Public-Facing Surface
 *
 * This is the ONLY surface visible to external visitors without authentication.
 * Accessible at /public — linked from the PUBLIC button in the nav.
 *
 * Approved content:
 *   - Christie's founding letter (James Christie portrait + full letter)
 *   - Market data strip (financial feeds — public macro data only)
 *   - Auction House Services section
 *   - MARKET hamlet cards (median prices, CIS scores, volume share)
 *   - Request Territory Briefing CTA (WhatsApp)
 *
 * NEVER include:
 *   - PIPE data (deal records, pipeline, recruiting targets)
 *   - INTEL data (whale registry, attorney database, family offices, relationship intelligence)
 *   - Internal calendar, podcast pipeline, event ops
 *   - Any agent recruiting or competitive intelligence
 *
 * Sprint 9 P0 — April 4, 2026
 */

import { useLocation } from 'wouter';
import { JAMES_CHRISTIE_PORTRAIT_PRIMARY, LOGO_WHITE, GALLERY_IMAGES, AUCTION_LOT_LIBRARY } from '@/lib/cdn-assets';
import { AuctionHouseServices } from '@/components/AuctionHouseServices';
import { MatrixCard } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA, TIER_ORDER, TIER_COLORS, type HamletData, type HamletTier } from '@/data/hamlet-master';

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY = '#1B2A4A';
const GOLD = '#C8AC78';
const CREAM = '#FAF8F4';
const CHARCOAL = '#384249';

const TIER_BADGE_COLORS: Record<HamletTier, { bg: string; text: string }> = {
  'Ultra-Trophy': { bg: GOLD,     text: NAVY    },
  'Trophy':       { bg: NAVY,     text: CREAM   },
  'Premier':      { bg: CHARCOAL, text: CREAM   },
  'Opportunity':  { bg: '#e8e4dc', text: CHARCOAL },
};

const FOUNDING_PARAGRAPHS = [
  "Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.",
  "The South Fork is not a market. It is a territory — eleven distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.",
  "This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.",
  "The Christie's Intelligence Score is not a sales tool. It is a discipline. Every property is evaluated on four lenses: Acquisition cost, New construction value, Exit pricing, and Wealth transfer potential. A property either passes or it does not. There is no gray area in institutional real estate.",
  "The eleven hamlets of the South Fork represent the most concentrated wealth corridor in the northeastern United States. East Hampton Village. Sagaponack. Bridgehampton. Water Mill. Southampton Village. Sag Harbor. Amagansett. Springs. East Hampton North. Wainscott. Montauk. Each one has a story. Each one has a price. Each one has a buyer.",
  "Christie's East Hampton is not a brokerage. It is a standard. The auction house has been the authority on provenance, value, and discretion for 260 years. That authority now extends to the South Fork.",
  "Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.",
];

// ─── Public Header ────────────────────────────────────────────────────────────
function PublicHeader() {
  const [, navigate] = useLocation();

  return (
    <header style={{ background: NAVY, borderBottom: `1px solid rgba(200,172,120,0.18)`, position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        {/* Logo */}
        <img
          src={LOGO_WHITE}
          alt="Christie's International Real Estate Group"
          style={{ height: 32, objectFit: 'contain', filter: 'brightness(1)' }}
        />

        {/* Right: EAST HAMPTON label + back link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            East Hampton
          </span>
          <button
            onClick={() => navigate('/')}
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              cursor: 'pointer',
              borderRadius: 2,
              border: `1px solid rgba(200,172,120,0.35)`,
              background: 'transparent',
              color: 'rgba(250,248,244,0.6)',
            }}
          >
            ← Internal Dashboard
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Institutional Ticker ─────────────────────────────────────────────────────
function PublicTicker() {
  const TICKER_TEXT = "Stewarding Hamptons legacies\u2002·\u2002Enjoy it\u2002·\u2002Improve it\u2002·\u2002Pass it on\u2002·\u2002Art\u2002·\u2002Beauty\u2002·\u2002Provenance\u2002·\u2002Since 1766\u2002·\u2002Christie\u2019s East Hampton\u2002·\u2002Exceptional Service";
  const repeated = Array(6).fill(TICKER_TEXT).join('\u2003\u2003·\u2003\u2003');

  return (
    <div style={{ background: NAVY, overflow: 'hidden', borderBottom: `1px solid rgba(200,172,120,0.12)` }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 55s linear infinite' }}>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '7px 0', display: 'inline-block' }}>
          {repeated}
        </span>
      </div>
    </div>
  );
}

// ─── Founding Letter Hero ─────────────────────────────────────────────────────
function FoundingLetterSection() {
  const [, navigate] = useLocation();

  const auctionRoomSrc = GALLERY_IMAGES.find(g => g.id === 'room-primary')?.src ?? GALLERY_IMAGES[0]?.src ?? '';

  return (
    <section style={{ background: NAVY, borderBottom: `1px solid rgba(200,172,120,0.3)` }}>
      <div className="relative" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <img
          src={auctionRoomSrc}
          alt="The Grand Saleroom, Christie's"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(27,42,74,0.97) 0%, rgba(27,42,74,0.88) 50%, rgba(27,42,74,0.55) 100%)'
        }} />

        <div
          className="relative flex flex-col md:grid"
          style={{
            gridTemplateColumns: '200px 1fr',
            gap: 0,
            minHeight: 'calc(100vh - 120px)',
            alignItems: 'start',
          }}
        >
          {/* Portrait column */}
          <div style={{ padding: '32px 20px 32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              onClick={() => navigate('/report')}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              title="Tap portrait for the full Market Report"
            >
              <div style={{
                padding: 4,
                border: `2px solid ${GOLD}`,
                boxShadow: '0 0 0 1px rgba(200,172,120,0.3), 0 8px 32px rgba(0,0,0,0.65)',
                background: 'rgba(27,42,74,0.4)',
                display: 'inline-block',
              }}>
                <img
                  src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
                  alt="James Christie — Founder, Christie's, Est. 1766"
                  style={{ width: 110, height: 140, objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }}
                />
              </div>
              <div style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: GOLD,
                fontSize: 9,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: 9,
                textAlign: 'center',
                lineHeight: 1.5,
              }}>
                Tap for<br/>Market Report
              </div>
            </div>
          </div>

          {/* Founding letter column */}
          <div style={{ padding: '32px 36px 32px 12px' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
              A Letter from the Desk
            </div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#FAF8F4',
              fontWeight: 400,
              fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
              lineHeight: 1.25,
              marginBottom: 18,
              maxWidth: 560,
            }}>
              CHRISTIE'S EAST HAMPTON
            </h2>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: GOLD,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 18,
            }}>
              Art. Beauty. Provenance. Since 1766.
            </div>

            <div style={{ maxWidth: 620 }}>
              {FOUNDING_PARAGRAPHS.map((para, i) => (
                <p key={i} style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  color: i === FOUNDING_PARAGRAPHS.length - 1 ? GOLD : 'rgba(250,248,244,0.82)',
                  fontSize: '0.875rem',
                  lineHeight: 1.72,
                  marginBottom: i === FOUNDING_PARAGRAPHS.length - 1 ? 0 : 13,
                  fontStyle: i === FOUNDING_PARAGRAPHS.length - 1 ? 'italic' : 'normal',
                  borderLeft: i === FOUNDING_PARAGRAPHS.length - 1 ? '2px solid rgba(200,172,120,0.4)' : 'none',
                  paddingLeft: i === FOUNDING_PARAGRAPHS.length - 1 ? 10 : 0,
                }}>
                  {para}
                </p>
              ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(200,172,120,0.18)' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1rem', fontStyle: 'italic', marginBottom: 4 }}>
                Ed Bruehl
              </div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.65)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Managing Director · Christie's East Hampton
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Hamlet Tile (public-safe version) ───────────────────────────────────────
function PublicHamletTile({ hamlet }: { hamlet: HamletData }) {
  const badge = TIER_BADGE_COLORS[hamlet.tier];
  const maxVolume = Math.max(...MASTER_HAMLET_DATA.map(h => h.volumeShare));

  return (
    <MatrixCard
      variant={hamlet.tier === 'Ultra-Trophy' ? 'active' : 'default'}
      className="p-5 flex flex-col gap-3"
    >
      {/* Tier badge + hamlet name */}
      <div className="flex items-start justify-between gap-2">
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.2 }}>
          {hamlet.name}
        </h3>
        <span
          className="shrink-0 px-2 py-0.5 text-[10px] uppercase tracking-wider"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', background: badge.bg, color: badge.text, letterSpacing: '0.12em' }}
        >
          CIS {hamlet.anewScore.toFixed(1)}
        </span>
      </div>

      {/* Median price */}
      <div>
        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, letterSpacing: '0.14em' }}>
          Median Price
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 600, fontSize: '1.375rem' }}>
          {hamlet.medianPriceDisplay}
        </div>
      </div>

      {/* CIS bar */}
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, letterSpacing: '0.14em' }}>
            CIS
          </div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: CHARCOAL, fontWeight: 600, fontSize: '1.125rem' }}>
            {hamlet.anewScore.toFixed(1)}
            <span style={{ fontSize: '0.75rem', color: '#7a8a8e', marginLeft: 2 }}>/10</span>
          </div>
        </div>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(27,42,74,0.1)' }}>
          <div className="h-full rounded-full" style={{ width: `${hamlet.anewScore * 10}%`, background: GOLD }} />
        </div>
      </div>

      {/* Share of Hamptons Dollar Volume */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', letterSpacing: '0.12em' }}>
            Share of Hamptons Dollar Volume
          </span>
          <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: CHARCOAL, fontSize: '0.8125rem' }}>
            {hamlet.volumeShare}%
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(27,42,74,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: `${(hamlet.volumeShare / maxVolume) * 100}%`, background: NAVY }} />
        </div>
      </div>

      {/* Last notable sale — only if data available */}
      {hamlet.lastSale && (
        <div className="text-xs pt-1 border-t" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', borderColor: 'rgba(27,42,74,0.08)' }}>
          Last sale: <span style={{ color: CHARCOAL }}>{hamlet.lastSale} · {hamlet.lastSalePrice}</span>
        </div>
      )}
    </MatrixCard>
  );
}

// ─── Hamlet Market Section ────────────────────────────────────────────────────
function HamletMarketSection() {
  return (
    <section style={{ background: CREAM, padding: '56px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, letterSpacing: '0.22em', fontSize: 11 }}>
          Hamptons Market Intelligence
        </div>
        <h2 className="mb-2" style={{ fontFamily: '"Cormorant Garamond", serif', color: NAVY, fontWeight: 400, fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', lineHeight: 1.25 }}>
          Eleven-Hamlet Territory · South Fork
        </h2>
        <p className="mb-10" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.8rem', maxWidth: 620, lineHeight: 1.6 }}>
          Based on 2025 recorded brokerage transactions per Saunders and Associates annual report cross-referenced William Raveis YE 2025. Total Hamptons dollar volume $5.922B.
        </p>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {MASTER_HAMLET_DATA.map(hamlet => (
            <PublicHamletTile key={hamlet.id} hamlet={hamlet} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Request Territory Briefing CTA ──────────────────────────────────────────
function TerritoryBriefingCTA() {
  return (
    <section style={{ background: CREAM, padding: '0 24px 56px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          background: NAVY,
          border: '1px solid rgba(200,172,120,0.2)',
          padding: '32px 36px',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          textAlign: 'center' as const,
          gap: 16,
        }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: GOLD, letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase' as const }}>
            Private Advisory
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.3 }}>
            Request a Private Territory Briefing
          </div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.55)', fontSize: '0.875rem', maxWidth: 480, lineHeight: 1.6 }}>
            Receive a bespoke intelligence brief on any hamlet, property, or market segment — prepared by Ed Bruehl, Managing Director, Christie&apos;s East Hampton.
          </div>
          <a
            href={`https://wa.me/16467521233?text=${encodeURIComponent("Hi Ed \u2014 I'd like to request a Private Territory Briefing for the East Hampton market. Please let me know what information you need.")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: '#fff',
              background: '#25D366',
              padding: '12px 28px',
              textDecoration: 'none',
              marginTop: 4,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Request Territory Briefing · 646-752-1233
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Public Footer ────────────────────────────────────────────────────────────
function PublicFooter() {
  return (
    <footer style={{ background: NAVY, padding: '16px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD }}>
          Art. Beauty. Provenance. · Since 1766.
        </span>
        <div style={{ marginTop: 6, fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.55rem', letterSpacing: '0.12em', color: 'rgba(200,172,120,0.4)', textTransform: 'uppercase' }}>
          26 Park Place, East Hampton · 646-752-1233 · edbruehl@christiesrealestategroup.com
        </div>
      </div>
    </footer>
  );
}

// ─── PublicPage ───────────────────────────────────────────────────────────────
export default function PublicPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: CREAM }}>
      <PublicHeader />
      <PublicTicker />

      <main className="flex-1">
        {/* 1. Founding letter hero */}
        <FoundingLetterSection />

        {/* 2. Auction House Services */}
        <AuctionHouseServices />

        {/* 3. Hamlet market cards */}
        <HamletMarketSection />

        {/* 4. Request Territory Briefing CTA */}
        <TerritoryBriefingCTA />
      </main>

      <PublicFooter />
    </div>
  );
}
