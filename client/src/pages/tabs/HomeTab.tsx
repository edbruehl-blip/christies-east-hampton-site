/**
 * HOME TAB — First impression of the institution.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles/doctrine) · Barlow Condensed (labels/data)
 * Modules: James Christie Portrait Hero · Founding Letter · Subscriber Capture
 *          · Auction Gallery 3×3 (9 Christie's brand-authority images)
 *          · YouTube Matrix 3×3
 *
 * All image URLs sourced from cdn-assets.ts — no inline URLs.
 * Ed headshot: PRIMARY confirmed (5A89ABA9) — wired in nav bar and PDF export header.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { MatrixCard } from '@/components/MatrixCard';
import {
  JAMES_CHRISTIE_PORTRAIT_PRIMARY,
  GALLERY_IMAGES,
} from '@/lib/cdn-assets';
import { generateMarketReport } from '@/lib/pdf-exports';

// Real YouTube IDs scraped from christiesrealestategroupeh.com + channel UCRNUlNy2hkJFvo1IFTY4otg
// Scraped March 29 2026. 9 strongest institutional/market signals selected from 30 total.
const YOUTUBE_VIDEOS = [
  { id: 'DEVo7NabIy8', title: "Bringing James Christie's Legacy to the Hamptons" },
  { id: 'FCsLbt_EgJ8', title: 'Get to Know Me — Ed Bruehl, Hamptons Real Estate' },
  { id: 'gucsKvabi_k', title: 'Uncovering Value in Hamptons Real Estate — Traveling Podcast with Nick Martin Architects' },
  { id: 'WhTXS0xz-Hs', title: 'Your Hamptons Real Estate Podcast Ep. 1 — Pierre Debbas Esq.' },
  { id: 'IueHmzSSMT4', title: 'Your Hamptons Real Estate Podcast Ep. 2 — Marit Molin, Hamptons Community Outreach' },
  { id: 'Vksowg9h2iQ', title: 'Your Hamptons Real Estate Podcast Ep. 3 — Brad Beyer, Local Home Inspector' },
  { id: '3w7p8ZnrsdU', title: 'Found Inventory in the Hamptons — Ed Bruehl' },
  { id: 'mRHfcIzsLvc', title: '3 Essentials for Every Successful Deal — Ed Bruehl' },
  { id: 'fAPHGnmI_N4', title: 'SOLD & CLOSED: 129 Seven Ponds Road, Water Mill — 33.3 Acres, Field of Dreams' },
];

function LightboxModal({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] w-auto object-contain"
        />
        {caption && (
          <div
            className="mt-3 text-center"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              color: 'rgba(200,172,120,0.85)',
              letterSpacing: '0.14em',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          >
            {caption}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-black/80 transition-colors"
          aria-label="Close lightbox"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function HomeTab() {
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleHeroClick = async () => {
    // Per spec: clicking James Christie portrait fires the full 5-page Market Report download
    const toastId = toast.loading('Generating Christie\'s Hamptons Market Report…');
    try {
      await generateMarketReport();
      toast.success('Market Report downloaded', { id: toastId });
    } catch (err) {
      console.error('[Market Report] PDF error:', err);
      toast.error('PDF generation failed — check console', { id: toastId });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">

      {/* ── James Christie Portrait Hero ─────────────────────────────────── */}
      <section className="bg-[var(--color-navy)]">
        <div
          className="relative mx-auto cursor-pointer group"
          style={{ maxWidth: 900 }}
          onClick={handleHeroClick}
          role="button"
          tabIndex={0}
          aria-label="Download market report and hear William's introduction"
          onKeyDown={(e) => e.key === 'Enter' && handleHeroClick()}
        >
          <img
            src={JAMES_CHRISTIE_PORTRAIT_PRIMARY}
            alt="James Christie — Founder, Christie's, Est. 1766"
            className="w-full object-cover transition-all duration-300 group-hover:brightness-95 border-b-[3px] border-[var(--color-gold)]"
            style={{ maxHeight: 520, objectPosition: 'center top' }}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-[var(--color-gold)]" />
        </div>
        <div className="text-center py-8 px-6">
          <div className="label-overline text-[var(--color-gold)] mb-3">
            Christie's · Est. 1766
          </div>
          <h1 className="font-serif text-[var(--color-cream)] font-normal text-[2.75rem] leading-[1.15] mb-3">
            Christie's East Hampton
          </h1>
          <div
            className="text-[var(--color-gold)] tracking-[0.06em] text-[0.95rem]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Managing Director · Ed Bruehl · Christie's International Real Estate Group
          </div>
        </div>
      </section>

      {/* ── Gold Rule ────────────────────────────────────────────────────── */}
      <div className="h-[2px] bg-[var(--color-gold)]" />

      {/* ── Founding Letter ──────────────────────────────────────────────── */}
      <section className="mx-auto px-6 py-14" style={{ maxWidth: 760 }}>
        <div className="label-overline text-[var(--color-gold)] mb-6">
          A Letter from the Desk
        </div>
        <h2 className="font-serif text-[var(--color-navy)] font-semibold text-[1.875rem] leading-[1.2] mb-8">
          To those who have built something worth protecting on the East End — and those who are coming to build it.
        </h2>
        <div
          className="space-y-5 text-[var(--color-charcoal)] text-[1.125rem] leading-[1.75]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          <p>
            James Christie founded his auction house in London in 1766 on a single conviction: that the right room, at the right moment, with the right provenance, allows the market to find true value. He did not simply sell things. He created a system of trust so disciplined that buyers and sellers could rely on it absolutely.
          </p>
          <p>
            Two hundred and sixty years later, Christie's East Hampton was established on the same conviction — applied to one of the most complex, underserved, and misread real estate markets in America.
          </p>
          <p>
            The Hamptons is not what most buyers and sellers have learned to see. The stigmatized lot on Highway 27. The legacy family parcel held across three generations, never listed. The rail-adjacent acre the luxury market ignores. These are Christie's moments. Assets the market has not priced correctly yet.
          </p>
          <p>
            This office was built with a Morgan Stanley finance discipline and twenty years of Hamptons market knowledge. It now operates with something no other brokerage on the East End has — a six-member AI council trained on one business, one standard, and one market — working every day to surface the truth before the conversation begins.
          </p>
          <p>
            What Christie's East Hampton has built is not a dashboard. It is a closed-loop intelligence system that scores every deal, tracks every pipeline, sources live market signals from nine hamlets, and delivers a briefing every morning before the market opens.
          </p>
          <p>
            Every document that leaves this office has been reviewed by multiple intelligence systems against the Christie's standard. Every deal is scored before a minute of time is committed to it.
          </p>
          <p>
            Christie's East Hampton is led by Ed Bruehl, Managing Director, alongside a growing team of dedicated East End professionals — Bonita DeWolf, Sebastian Mobo, Jarvis Slade, and Angel Theodore — each committed to the same standard this office was built on. Every client relationship begins and ends with this team.
          </p>
          <p>
            Alongside the brokerage, Ed Bruehl operates ANEW Homes — a private build platform using Morton Buildings steel-frame construction to deliver finished homes in twelve months at a buyer cost below replacement value.
          </p>
          <p>
            This is not a real estate practice. It is an institution in progress — grounded in 260 years of Christie's valuation intelligence and powered by the most capable intelligence systems currently in operation.
          </p>
          <p
            className="italic text-[var(--color-navy)] border-l-[3px] border-[var(--color-gold)] pl-5"
          >
            If you own property on the East End and you have been waiting for the right conversation — this is it. Not a pitch. A system. Not a promise. A process that has been tested, scored, and proven.
          </p>
        </div>
      </section>

      {/* ── Thin gold rule ───────────────────────────────────────────────── */}
      <div className="mx-auto px-6" style={{ maxWidth: 760 }}>
        <div className="h-px bg-[var(--color-gold)] opacity-40" />
      </div>

      {/* ── Subscriber Capture ───────────────────────────────────────────── */}
      <section className="mx-auto px-6 py-12" style={{ maxWidth: 760 }}>
        <MatrixCard variant="default" className="p-8">
          <div className="label-overline text-[var(--color-gold)] mb-4">
            Market Intelligence
          </div>
          <h3 className="font-serif text-[var(--color-navy)] font-semibold text-[1.25rem] mb-2">
            Receive the Christie's East Hampton Market Report
          </h3>
          <p
            className="text-[var(--color-charcoal)] text-[0.875rem] mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Quarterly analysis of the South Fork luxury market. Institutional data. No promotional copy.
          </p>
          {subscribed ? (
            <div
              className="py-3 px-4 border text-sm text-[var(--color-navy)] border-[var(--color-gold)]"
              style={{ fontFamily: 'var(--font-body)', background: '#FFF9EF' }}
            >
              Received. You will receive the next market report when it is published.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2.5 text-sm border outline-none transition-colors text-[var(--color-charcoal)] border-[rgba(27,42,74,0.2)] bg-[var(--color-cream)]"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button
                type="submit"
                className="px-6 py-2.5 uppercase tracking-[0.14em] text-[0.8125rem] bg-[var(--color-navy)] text-[var(--color-cream)] transition-opacity hover:opacity-90"
                style={{ fontFamily: 'var(--font-condensed)' }}
              >
                Submit
              </button>
            </form>
          )}
        </MatrixCard>
      </section>

      {/* ── Auction Gallery 3×3 ──────────────────────────────────────────── */}
      {/* Nine images: Christie's brand-authority signal. Sourced from cdn-assets.ts */}
      <section className="px-6 py-10 bg-[var(--color-navy)]">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="label-overline text-[var(--color-gold)] mb-6">
            Christie's · Est. 1766 · The Auction House Standard
          </div>
          <div className="grid grid-cols-3 gap-3">
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.id}
                className="relative overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '4/3' }}
                onClick={() =>
                  setLightbox({ src: img.src, alt: img.caption, caption: img.caption })
                }
                role="button"
                tabIndex={0}
                aria-label={`View: ${img.caption}`}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  setLightbox({ src: img.src, alt: img.caption, caption: img.caption })
                }
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Caption overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[rgba(27,42,74,0.88)] px-3 py-2">
                  <div
                    className="text-[var(--color-gold)] text-[0.65rem] uppercase tracking-[0.14em] leading-snug"
                    style={{ fontFamily: 'var(--font-condensed)' }}
                  >
                    {img.caption}
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-[var(--color-gold)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YouTube Matrix 3×3 ───────────────────────────────────────────── */}
      <section className="px-6 py-12 bg-[var(--color-cream)]">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="label-overline text-[var(--color-gold)] mb-2">
            Christie's East Hampton Podcast
          </div>
          <h2 className="font-serif text-[var(--color-navy)] font-semibold text-[1.5rem] mb-8">
            Market Intelligence on Demand
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {YOUTUBE_VIDEOS.map((video, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                onClick={() =>
                  window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')
                }
                role="button"
                tabIndex={0}
                aria-label={`Watch: ${video.title}`}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')
                }
              >
                <div
                  className="relative overflow-hidden bg-[var(--color-navy)]"
                  style={{ aspectRatio: '16/9' }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-[rgba(200,172,120,0.9)]">
                      <div
                        className="ml-1"
                        style={{
                          width: 0,
                          height: 0,
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                          borderLeft: '14px solid #1B2A4A',
                        }}
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-[var(--color-gold)]" />
                </div>
                <div
                  className="mt-2 text-sm leading-snug text-[var(--color-charcoal)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {video.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightbox && (
        <LightboxModal
          src={lightbox.src}
          alt={lightbox.alt}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
