/**
 * MAPS TAB — Paumanok identity plate + Google Map + full inline hamlet intelligence panels.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * Layout:
 *   Top: Paumanok SVG plate (D3 — topographic contours + Paumanok Path trail)
 *   Middle: Google Map (full South Fork, hamlet pins) + hamlet button grid (right sidebar)
 *   Bottom: Inline hamlet panel (opens below map on hamlet click, replaces on re-click)
 *
 * Hamlet panel spec (per council brief Mar 29 2026):
 *   - Hero photo
 *   - Market data (from hamlet-master.ts)
 *   - Three EELE listings
 *   - Last Zillow sale
 *   - One best restaurant (hardcoded)
 *   - Three news links (most recent first)
 *   - No modal · No new page · No navigation change
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MapView } from '@/components/Map';
import { MASTER_HAMLET_DATA, TIER_COLORS, type HamletData } from '@/data/hamlet-master';

// CDN URLs for the GeoJSON files
const GEOJSON_URLS = {
  contours:     'https://static.manus.space/webdev/paumanok_contours.geojson',
  waterBodies:  'https://static.manus.space/webdev/paumanok_water_bodies.geojson',
  trail:        'https://static.manus.space/webdev/paumanok_trail.geojson',
};

// ─── Paumanok SVG Plate ───────────────────────────────────────────────────────

function PaumanokPlate() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 900;
    const height = 340;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const projection = d3.geoMercator()
      .center([-72.35, 40.96])
      .scale(width * 38)
      .translate([width / 2, height / 2]);
    const pathGen = d3.geoPath().projection(projection);

    svg.append('rect').attr('width', width).attr('height', height).attr('fill', '#1B2A4A');
    const g = svg.append('g');

    Promise.all([
      fetch(GEOJSON_URLS.contours).then(r => r.json()).catch(() => null),
      fetch(GEOJSON_URLS.waterBodies).then(r => r.json()).catch(() => null),
      fetch(GEOJSON_URLS.trail).then(r => r.json()).catch(() => null),
    ]).then(([contours, water, trail]) => {
      if (contours?.features) {
        g.selectAll('.contour').data(contours.features).enter().append('path')
          .attr('d', pathGen as any).attr('fill', 'none')
          .attr('stroke', 'rgba(200,172,120,0.18)').attr('stroke-width', 0.5);
      }
      if (water?.features) {
        g.selectAll('.water').data(water.features).enter().append('path')
          .attr('d', pathGen as any).attr('fill', 'rgba(100,149,200,0.35)')
          .attr('stroke', 'rgba(100,149,200,0.5)').attr('stroke-width', 0.5);
      }
      if (trail?.features) {
        g.selectAll('.trail').data(trail.features).enter().append('path')
          .attr('d', pathGen as any).attr('fill', 'none')
          .attr('stroke', '#C8AC78').attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '4 3').attr('opacity', 0.85);
      }

      MASTER_HAMLET_DATA.forEach(hamlet => {
        const [px, py] = projection([hamlet.lng, hamlet.lat]) ?? [0, 0];
        if (px === 0 && py === 0) return;
        g.append('circle').attr('cx', px).attr('cy', py)
          .attr('r', hamlet.tier === 'Ultra-Trophy' ? 5 : 3.5)
          .attr('fill', TIER_COLORS[hamlet.tier])
          .attr('stroke', '#FAF8F4').attr('stroke-width', 1);
        g.append('text').attr('x', px + 7).attr('y', py + 4)
          .attr('fill', '#FAF8F4').attr('font-family', '"Barlow Condensed", sans-serif')
          .attr('font-size', 9).attr('letter-spacing', '0.08em')
          .text(hamlet.name.toUpperCase());
      });

      const legend = svg.append('g').attr('transform', `translate(${width - 160}, ${height - 40})`);
      legend.append('line').attr('x1', 0).attr('y1', 8).attr('x2', 24).attr('y2', 8)
        .attr('stroke', '#C8AC78').attr('stroke-width', 1.5).attr('stroke-dasharray', '4 3');
      legend.append('text').attr('x', 30).attr('y', 12)
        .attr('fill', 'rgba(250,248,244,0.55)').attr('font-family', '"Barlow Condensed", sans-serif')
        .attr('font-size', 9).attr('letter-spacing', '0.1em').text('PAUMANOK PATH');

      svg.append('text').attr('x', 8).attr('y', height - 6)
        .attr('fill', 'rgba(250,248,244,0.25)')
        .attr('font-family', '"Source Sans 3", sans-serif').attr('font-size', 8)
        .text('© OpenStreetMap contributors · USGS National Map');

      setLoaded(true);
    });
  }, []);

  return (
    <div className="relative w-full" style={{ background: '#1B2A4A', borderBottom: '2px solid #C8AC78' }}>
      <div className="px-6 pt-6 pb-3 flex items-end justify-between">
        <div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>
            Paumanok · South Fork · Long Island
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.5rem' }}>
            The Territory
          </h2>
        </div>
        {!loaded && (
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.6)', fontSize: 10, letterSpacing: '0.12em' }}>
            Loading map data…
          </div>
        )}
      </div>
      <svg ref={svgRef} className="w-full" style={{ height: 340, display: 'block' }} aria-label="Paumanok South Fork topographic map" />
    </div>
  );
}

// ─── Inline Hamlet Panel ──────────────────────────────────────────────────────

function HamletPanel({ hamlet, onClose }: { hamlet: HamletData; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll panel into view on open
  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hamlet.id]);

  const tierColor = TIER_COLORS[hamlet.tier];

  return (
    <div
      ref={panelRef}
      style={{ background: '#FAF8F4', borderTop: `3px solid ${tierColor}` }}
    >
      {/* ── Hero Photo ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
        <img
          src={hamlet.photo}
          alt={hamlet.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(27,42,74,0.1) 0%, rgba(27,42,74,0.72) 100%)',
        }} />
        {/* Hamlet name over photo */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '24px 28px' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>
            {hamlet.tier} · ANEW {hamlet.anewScore.toFixed(1)} / 10
          </div>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '2rem', lineHeight: 1.1 }}>
            {hamlet.name}
          </h3>
        </div>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.65rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', padding: '5px 14px', cursor: 'pointer',
            border: '1px solid rgba(250,248,244,0.6)', background: 'rgba(27,42,74,0.55)',
            color: '#FAF8F4', borderRadius: 2, backdropFilter: 'blur(4px)',
          }}
        >
          ✕ Close
        </button>
      </div>

      <div style={{ padding: '28px 28px 36px' }}>

        {/* ── Market Data Grid ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Median Price', value: hamlet.medianPriceDisplay },
            { label: 'ANEW Score', value: `${hamlet.anewScore.toFixed(1)} / 10` },
            { label: 'Volume Share', value: `${hamlet.volumeShare}%` },
            { label: 'Last Zillow Sale', value: hamlet.lastSalePrice },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '14px 16px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 9.5, textTransform: 'uppercase', marginBottom: 5 }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Last Zillow Sale ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: '14px 16px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)', display: 'inline-block', minWidth: 260 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 9.5, textTransform: 'uppercase', marginBottom: 5 }}>
              Last Zillow Sale
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A', fontSize: '0.88rem', fontWeight: 600 }}>
              {hamlet.lastSale}
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.82rem', marginTop: 2 }}>
              {hamlet.lastSalePrice} · {hamlet.lastSaleDate}
            </div>
          </div>
        </div>

        {/* ── Restaurants (3-tier) ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>
            Dining
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
            {[
              { tier: 'Anchor', value: hamlet.restaurants.anchor },
              { tier: 'Mid', value: hamlet.restaurants.mid },
              { tier: 'Local', value: hamlet.restaurants.local },
            ].map(r => (
              <div key={r.tier} style={{ padding: '12px 14px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)' }}>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 9, textTransform: 'uppercase', marginBottom: 4 }}>
                  {r.tier}
                </div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: r.value === 'TBD' ? '#ccc' : '#1B2A4A', fontSize: '0.85rem', fontWeight: 600, fontStyle: r.value === 'TBD' ? 'italic' : 'normal' }}>
                  {r.value === 'TBD' ? 'TBD — next pass' : r.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EELE Active Listings ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>
            EELE Active Listings
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {hamlet.eeleListings.map((listing, i) => (
              listing.placeholder ? (
                <div
                  key={i}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(27,42,74,0.02)',
                    border: '1px dashed rgba(27,42,74,0.18)',
                  }}
                >
                  <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 9, textTransform: 'uppercase', marginBottom: 6 }}>
                    Listing {i + 1} — Placeholder
                  </div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#ccc', fontSize: '0.82rem', fontStyle: 'italic' }}>
                    Address TBD
                  </div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#ccc', fontSize: '0.78rem', marginTop: 4, fontStyle: 'italic' }}>
                    Price TBD · Active
                  </div>
                </div>
              ) : (
                <a
                  key={i}
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', padding: '14px 16px',
                    background: '#fff', border: '1px solid rgba(27,42,74,0.1)',
                    textDecoration: 'none', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#C8AC78')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(27,42,74,0.1)')}
                >
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>
                    {listing.address}
                  </div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#C8AC78', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
                    {listing.price}
                  </div>
                  <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {listing.beds} BD · {listing.baths} BA · {listing.sqft} SF
                  </div>
                </a>
              )
            ))}
          </div>
        </div>

        {/* ── News Links ───────────────────────────────────────────────────── */}
        <div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>
            News &amp; Coverage
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <a
              href={hamlet.zillowUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '6px 14px', border: '1px solid #1B2A4A',
                color: '#1B2A4A', textDecoration: 'none', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1B2A4A'; e.currentTarget.style.color = '#FAF8F4'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1B2A4A'; }}
            >
              Zillow Market
            </a>
            {hamlet.newsLinks.map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '6px 14px', border: '1px solid rgba(27,42,74,0.3)',
                  color: '#384249', textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1B2A4A'; e.currentTarget.style.color = '#FAF8F4'; e.currentTarget.style.borderColor = '#1B2A4A'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#384249'; e.currentTarget.style.borderColor = 'rgba(27,42,74,0.3)'; }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MapsTab() {
  const [activeHamlet, setActiveHamlet] = useState<HamletData | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);

    MASTER_HAMLET_DATA.forEach(hamlet => {
      const marker = new google.maps.Marker({
        position: { lat: hamlet.lat, lng: hamlet.lng },
        map,
        title: hamlet.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: hamlet.tier === 'Ultra-Trophy' ? 8 : 6,
          fillColor: TIER_COLORS[hamlet.tier],
          fillOpacity: 1,
          strokeColor: '#FAF8F4',
          strokeWeight: 1.5,
        },
      });
      marker.addListener('click', () => {
        setActiveHamlet(prev => prev?.id === hamlet.id ? null : hamlet);
      });
    });
  };

  const handleHamletButton = (hamlet: HamletData) => {
    setActiveHamlet(prev => prev?.id === hamlet.id ? null : hamlet);
  };

  return (
    <div style={{ background: '#FAF8F4', minHeight: '100vh' }}>

      {/* ── Paumanok Plate ───────────────────────────────────────────────── */}
      <PaumanokPlate />

      {/* ── Map + Hamlet Button Grid ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'row', minHeight: 520 }}>

        {/* Google Map */}
        <div style={{ flex: 1, position: 'relative', minHeight: 400 }}>
          <MapView
            onMapReady={handleMapReady}
            initialCenter={{ lat: 40.96, lng: -72.35 }}
            initialZoom={10}
          />
          {!mapReady && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1B2A4A' }}>
              <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 11 }}>
                Loading map…
              </span>
            </div>
          )}
        </div>

        {/* Hamlet button grid — right sidebar */}
        <div style={{
          width: 300, flexShrink: 0, padding: 20,
          borderLeft: '1px solid rgba(27,42,74,0.12)',
          background: '#FAF8F4', overflowY: 'auto', maxHeight: 520,
        }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 14 }}>
            Nine Hamlets
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MASTER_HAMLET_DATA.map(hamlet => {
              const isActive = activeHamlet?.id === hamlet.id;
              return (
                <button
                  key={hamlet.id}
                  onClick={() => handleHamletButton(hamlet)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 14px',
                    border: `1px solid ${isActive ? '#C8AC78' : 'rgba(27,42,74,0.15)'}`,
                    background: isActive ? '#1B2A4A' : '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, fontSize: '0.95rem', color: isActive ? '#FAF8F4' : '#384249' }}>
                    {hamlet.name}
                  </span>
                  <span style={{
                    fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.65rem', letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '2px 7px',
                    background: isActive ? 'rgba(200,172,120,0.2)' : 'rgba(27,42,74,0.06)',
                    color: isActive ? '#C8AC78' : '#7a8a8e',
                  }}>
                    {hamlet.medianPriceDisplay}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Inline Hamlet Panel — opens below map, replaces on re-click ──── */}
      {activeHamlet && (
        <HamletPanel
          hamlet={activeHamlet}
          onClose={() => setActiveHamlet(null)}
        />
      )}

    </div>
  );
}
