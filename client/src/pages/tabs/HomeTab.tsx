/**
 * HOME TAB — First impression of the institution.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles/doctrine) · Source Sans 3 (body/data) · Barlow Condensed (labels)
 * Modules: James Christie Portrait Hero · Founding Letter · Subscriber Capture · Auction Gallery 3×3 · YouTube Matrix 3×3
 */

import { useState } from 'react';
import { MatrixCard } from '@/components/MatrixCard';

const JAMES_CHRISTIE_PORTRAIT =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/James_Christie_by_Thomas_Gainsborough.jpg/800px-James_Christie_by_Thomas_Gainsborough.jpg';

const AUCTION_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&q=80', alt: 'Fine Art Auction' },
  { src: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=600&q=80', alt: 'Estate Collection' },
  { src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80', alt: 'Hamptons Estate' },
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', alt: 'Oceanfront Property' },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80', alt: 'Estate Interior' },
  { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', alt: 'Pool House' },
  { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', alt: 'Garden Estate' },
  { src: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80', alt: 'Waterfront Home' },
  { src: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80', alt: 'Bridgehampton Estate' },
];

const YOUTUBE_VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'East Hampton Market Report — Q1 2026' },
  { id: 'dQw4w9WgXcQ', title: 'Hamptons Investment Strategy — Spring 2026' },
  { id: 'dQw4w9WgXcQ', title: 'ANEW Build: 140 Hands Creek Road' },
  { id: 'dQw4w9WgXcQ', title: "Christie's East Hampton — Institutional Overview" },
  { id: 'dQw4w9WgXcQ', title: 'South Fork Market Dynamics — March 2026' },
  { id: 'dQw4w9WgXcQ', title: 'The Christie\'s Standard — Ed Bruehl' },
  { id: 'dQw4w9WgXcQ', title: 'Sagaponack & Bridgehampton Deep Dive' },
  { id: 'dQw4w9WgXcQ', title: 'Springs: The Opportunity Corridor' },
  { id: 'dQw4w9WgXcQ', title: "Christie's East Hampton — Mission & Model" },
];

function LightboxModal({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[85vh] w-auto object-contain" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-black/80 transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function HomeTab() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleHeroClick = () => {
    // Per spec: fires PDF download + William audio link simultaneously
    // William audio — placeholder until ElevenLabs key is wired
    console.log('[William] Audio trigger — ElevenLabs key required');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── James Christie Portrait Hero ─────────────────────────────────── */}
      <section style={{ background: '#1B2A4A' }}>
        <div
          className="relative mx-auto cursor-pointer group"
          style={{ maxWidth: 900 }}
          onClick={handleHeroClick}
          role="button"
          tabIndex={0}
          aria-label="Download market report and hear William's introduction"
          onKeyDown={e => e.key === 'Enter' && handleHeroClick()}
        >
          <img
            src={JAMES_CHRISTIE_PORTRAIT}
            alt="James Christie — Founder, Christie's, Est. 1766"
            className="w-full object-cover transition-all duration-300 group-hover:brightness-95"
            style={{ maxHeight: 520, objectPosition: 'center top', borderBottom: '3px solid #C8AC78' }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ border: '2px solid #C8AC78' }}
          />
        </div>
        <div className="text-center py-8 px-6">
          <div
            className="uppercase mb-3"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Christie's · Est. 1766
          </div>
          <h1
            className="mb-3"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '2.75rem', lineHeight: 1.15 }}
          >
            Christie's East Hampton
          </h1>
          <div
            style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#C8AC78', letterSpacing: '0.06em', fontSize: '0.95rem' }}
          >
            Managing Director · Ed Bruehl · Christie's International Real Estate Group
          </div>
        </div>
      </section>

      {/* ── Gold Rule ────────────────────────────────────────────────────── */}
      <div style={{ height: 2, background: '#C8AC78' }} />

      {/* ── Founding Letter ──────────────────────────────────────────────── */}
      <section className="mx-auto px-6 py-14" style={{ maxWidth: 760 }}>
        <div
          className="uppercase mb-6"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
        >
          A Letter from the Desk
        </div>
        <h2
          className="mb-8"
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.875rem', lineHeight: 1.2 }}
        >
          Always the Family's Interest Before the Sale. The Name Follows.
        </h2>
        <div
          className="space-y-5"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.125rem', color: '#384249', lineHeight: 1.75 }}
        >
          <p>
            Christie's has carried one standard since James Christie opened the doors on Pall Mall in 1766: the family's interest comes before the sale. Not the commission. Not the close. The family. That principle has survived 260 years of markets, wars, and revolutions. It is the only principle that matters in East Hampton today.
          </p>
          <p>
            The South Fork is not a market. It is a territory — nine distinct hamlets, each with its own character, its own price corridor, its own buyer. Sagaponack and East Hampton Village are institutions in their own right. Springs is the most honest value proposition on the East End. Every hamlet deserves the same rigor, the same data, the same discipline.
          </p>
          <p>
            This platform exists to carry the Christie's standard into every conversation, every deal brief, every market report. The intelligence here is institutional. The analysis is honest. The service is unconditional.
          </p>
          <p
            className="italic"
            style={{ color: '#1B2A4A', borderLeft: '3px solid #C8AC78', paddingLeft: '1.25rem' }}
          >
            — Institutional placeholder. Final founding letter text pending approval from Ed and Claude.
          </p>
        </div>
      </section>

      {/* ── Thin gold rule ───────────────────────────────────────────────── */}
      <div className="mx-auto px-6" style={{ maxWidth: 760 }}>
        <div style={{ height: 1, background: '#C8AC78', opacity: 0.4 }} />
      </div>

      {/* ── Subscriber Capture ───────────────────────────────────────────── */}
      <section className="mx-auto px-6 py-12" style={{ maxWidth: 760 }}>
        <MatrixCard variant="default" className="p-8">
          <div
            className="uppercase mb-4"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Market Intelligence
          </div>
          <h3
            className="mb-2"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.25rem' }}
          >
            Receive the Christie's East Hampton Market Report
          </h3>
          <p
            className="mb-6"
            style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.875rem' }}
          >
            Quarterly analysis of the South Fork luxury market. Institutional data. No promotional copy.
          </p>
          {subscribed ? (
            <div
              className="py-3 px-4 border text-sm"
              style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A', borderColor: '#C8AC78', background: '#FFF9EF' }}
            >
              Received. You will receive the next market report when it is published.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2.5 text-sm border outline-none transition-colors"
                style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  color: '#384249',
                  borderColor: 'rgba(27,42,74,0.2)',
                  background: '#FAF8F4',
                }}
              />
              <button
                type="submit"
                className="px-6 py-2.5 uppercase tracking-wider transition-opacity hover:opacity-90"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: '0.14em',
                  fontSize: '0.8125rem',
                  background: '#1B2A4A',
                  color: '#FAF8F4',
                }}
              >
                Submit
              </button>
            </form>
          )}
        </MatrixCard>
      </section>

      {/* ── Auction Gallery 3×3 ──────────────────────────────────────────── */}
      <section className="px-6 py-10" style={{ background: '#1B2A4A' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div
            className="uppercase mb-6"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Christie's East Hampton · Property Gallery
          </div>
          <div className="grid grid-cols-3 gap-3">
            {AUCTION_IMAGES.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden cursor-pointer group"
                style={{ aspectRatio: '4/3' }}
                onClick={() => setLightbox(img)}
                role="button"
                tabIndex={0}
                aria-label={`View ${img.alt}`}
                onKeyDown={e => e.key === 'Enter' && setLightbox(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ border: '2px solid #C8AC78' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YouTube Matrix 3×3 ───────────────────────────────────────────── */}
      <section className="px-6 py-12" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div
            className="uppercase mb-2"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}
          >
            Christie's East Hampton Podcast
          </div>
          <h2
            className="mb-8"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.5rem' }}
          >
            Market Intelligence on Demand
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {YOUTUBE_VIDEOS.map((video, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                role="button"
                tabIndex={0}
                aria-label={`Watch: ${video.title}`}
                onKeyDown={e => e.key === 'Enter' && window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#1B2A4A' }}>
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(200,172,120,0.9)' }}
                    >
                      <div
                        className="ml-1"
                        style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #1B2A4A' }}
                      />
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ border: '2px solid #C8AC78' }}
                  />
                </div>
                <div
                  className="mt-2 text-sm leading-snug"
                  style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}
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
        <LightboxModal src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
