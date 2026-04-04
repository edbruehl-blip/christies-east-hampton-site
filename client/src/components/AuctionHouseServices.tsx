/**
 * AuctionHouseServices — Sprint 8 · April 3, 2026
 *
 * Christie's Auction House Services section for the HOME tab lower portion.
 * Two parts:
 *   1. Christie's-branded video player — constrained to --frame-max-w
 *   2. Six service tiles in Christie's navy/gold palette — each links to Christie's.com
 *
 * Video: Christie's Valuations, Appraisals and Professional Advisor Services (1:07)
 * CDN: https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies-valuations-appraisals_87b12f78.mov
 */

const VIDEO_CDN_URL =
  'https://d2xsxph8kpxj0f.cloudfront.net/115914870/Acqj9Wc4PB2323zvtzuKaz/christies-valuations-appraisals_87b12f78.mov';

interface ServiceTile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  icon: string;
}

const SERVICE_TILES: ServiceTile[] = [
  {
    id: 'appraisals',
    title: 'Appraisals & Valuations',
    subtitle: 'Since 1766',
    description:
      'Bespoke appraisals for auction, insurance, estate planning, and loan collateral — meeting the highest standard of accuracy and compliance.',
    url: 'https://www.christies.com/en/services/valuations-appraisals-and-professional-advisor-services/overview',
    icon: '⚖',
  },
  {
    id: 'collection-management',
    title: 'Collection Management',
    subtitle: 'Trusted Stewardship',
    description:
      'Seamless guidance across all collecting categories — consignment advice, cataloguing, and long-term collection strategy.',
    url: 'https://www.christies.com/en/services/valuations-appraisals-and-professional-advisor-services/overview',
    icon: '🏛',
  },
  {
    id: 'art-finance',
    title: 'Art Finance',
    subtitle: 'Bespoke Lending',
    description:
      `Christie's dedicated Art Finance team crafts bespoke lending solutions around your collection and your needs.`,
    url: 'https://www.christies.com/en/services/art-finance',
    icon: '◈',
  },
  {
    id: 'heritage-taxation',
    title: 'Heritage & Taxation',
    subtitle: 'Strategic Planning',
    description:
      'Expert advice for executors, solicitors, and fiduciary advisors on estate tax, conditional exemption, and the Acceptance in Lieu scheme.',
    url: 'https://www.christies.com/en/services/heritage-and-taxation',
    icon: '⌘',
  },
  {
    id: 'consignment',
    title: 'Consignment',
    subtitle: 'Global Reach',
    description:
      `Access Christie's global auction network and private sales channel — 260 years of market expertise in service of your collection.`,
    url: 'https://www.christies.com/en/sell/request-an-estimate',
    icon: '◉',
  },
  {
    id: 'private-sales',
    title: 'Private Sales',
    subtitle: 'Discreet Transactions',
    description:
      `Christie's Private Sales team connects exceptional works with the world's most discerning collectors — with full discretion.`,
    url: 'https://www.christies.com/en/private-sales',
    icon: '◇',
  },
];

export function AuctionHouseServices() {
  return (
    <div className="px-6 py-12 border-t" style={{ borderColor: 'rgba(200,172,120,0.2)', background: '#FAF8F4' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>

        {/* Section header */}
        <div className="mb-8">
          <div
            className="uppercase mb-2"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: '#C8AC78',
              letterSpacing: '0.22em',
              fontSize: 10,
            }}
          >
            Christie's Auction House · Since 1766
          </div>
          <div
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#1B2A4A',
              fontWeight: 600,
              fontSize: '1.5rem',
              lineHeight: 1.2,
            }}
          >
            Valuations, Appraisals &amp; Professional Services
          </div>
          <div
            className="mt-2 text-sm max-w-xl"
            style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', lineHeight: 1.6 }}
          >
            Christie's has provided valuations and professional advisor services for collections of all sizes and
            categories since 1766. Our team is available to guide you — whatever the circumstances.
          </div>
        </div>

        {/* ── Video Player ──────────────────────────────────────────────────── */}
        <div
          className="mb-10"
          style={{
            border: '1px solid #1B2A4A',
            borderRadius: 2,
            overflow: 'hidden',
            background: '#000',
          }}
        >
          {/* Video header bar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ background: '#1B2A4A' }}
          >
            <div>
              <div
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: '#C8AC78',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Christie's · Valuations &amp; Appraisals
              </div>
              <div
                style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  color: 'rgba(250,248,244,0.45)',
                  fontSize: 9,
                  marginTop: 2,
                }}
              >
                Some collections are built over a lifetime, others are inherited in an instant.
              </div>
            </div>
            <a
              href="https://www.christies.com/en/services/valuations-appraisals-and-professional-advisor-services/overview"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(200,172,120,0.6)',
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Christie's.com ↗
            </a>
          </div>

          {/* Video element */}
          <video
            controls
            playsInline
            preload="metadata"
            style={{ display: 'block', width: '100%', maxHeight: 480, background: '#000' }}
          >
            <source src={VIDEO_CDN_URL} type="video/quicktime" />
            <source src={VIDEO_CDN_URL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video footer */}
          <div
            className="flex items-center justify-between px-5 py-2"
            style={{ background: '#1B2A4A', borderTop: '1px solid rgba(200,172,120,0.15)' }}
          >
            <span
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(200,172,120,0.45)',
                fontSize: 8,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Christie's International · Valuations &amp; Professional Advisor Services
            </span>
            <span
              style={{
                fontFamily: '"Barlow Condensed", sans-serif',
                color: 'rgba(200,172,120,0.35)',
                fontSize: 8,
                letterSpacing: '0.12em',
              }}
            >
              1:07
            </span>
          </div>
        </div>

        {/* ── Six Service Tiles ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICE_TILES.map((tile) => (
            <a
              key={tile.id}
              href={tile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="h-full p-6 border transition-all duration-200"
                style={{
                  background: '#fff',
                  borderColor: 'rgba(27,42,74,0.12)',
                  borderLeft: '3px solid #C8AC78',
                }}
              >
                {/* Icon + title row */}
                <div className="flex items-start gap-3 mb-3">
                  <span
                    style={{
                      fontFamily: 'serif',
                      fontSize: '1.25rem',
                      color: '#C8AC78',
                      lineHeight: 1,
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {tile.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        color: '#1B2A4A',
                        fontWeight: 600,
                        fontSize: '1rem',
                        lineHeight: 1.25,
                      }}
                    >
                      {tile.title}
                    </div>
                    <div
                      className="mt-0.5 text-[9px] uppercase tracking-widest"
                      style={{
                        fontFamily: '"Barlow Condensed", sans-serif',
                        color: '#C8AC78',
                        letterSpacing: '0.18em',
                      }}
                    >
                      {tile.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div
                  className="text-xs leading-relaxed mb-4"
                  style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}
                >
                  {tile.description}
                </div>

                {/* CTA */}
                <div
                  className="text-[9px] uppercase tracking-widest transition-colors group-hover:text-[#1B2A4A]"
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    color: '#C8AC78',
                    letterSpacing: '0.18em',
                  }}
                >
                  Learn More ↗
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-8 text-center">
          <a
            href="https://www.christies.com/en/services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              borderColor: '#C8AC78',
              color: '#1B2A4A',
              letterSpacing: '0.2em',
            }}
          >
            All Christie's Services ↗
          </a>
        </div>

      </div>
    </div>
  );
}
