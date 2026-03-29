/**
 * MAPS TAB — Paumanok identity plate + Google Map + hamlet intelligence drawers.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * Layout:
 *   Top: Paumanok SVG plate (D3 — topographic contours + Paumanok Path trail)
 *   Bottom-left: Google Map (full South Fork, hamlet pins)
 *   Bottom-right: Hamlet button grid → click opens inline intelligence drawer
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MapView } from '@/components/Map';
import { MatrixCard, StatusBadge } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA, TIER_COLORS, type HamletData } from '@/data/hamlet-master';

// CDN URLs for the GeoJSON files (uploaded via manus-upload-file --webdev)
const GEOJSON_URLS = {
  contours:     'https://static.manus.space/webdev/paumanok_contours.geojson',
  waterBodies:  'https://static.manus.space/webdev/paumanok_water_bodies.geojson',
  trail:        'https://static.manus.space/webdev/paumanok_trail.geojson',
  usgsTrails:   'https://static.manus.space/webdev/paumanok_usgs_trails.geojson',
};

// ─── Paumanok SVG Plate ───────────────────────────────────────────────────────

function PaumanokPlate() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 900;
    const height = 340;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // South Fork bounding box: Hampton Bays → Montauk
    const projection = d3.geoMercator()
      .center([-72.35, 40.96])
      .scale(width * 38)
      .translate([width / 2, height / 2]);

    const pathGen = d3.geoPath().projection(projection);

    // Background
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', '#1B2A4A');

    const g = svg.append('g');

    Promise.all([
      fetch(GEOJSON_URLS.contours).then(r => r.json()).catch(() => null),
      fetch(GEOJSON_URLS.waterBodies).then(r => r.json()).catch(() => null),
      fetch(GEOJSON_URLS.trail).then(r => r.json()).catch(() => null),
    ]).then(([contours, water, trail]) => {
      // Draw contour lines
      if (contours?.features) {
        g.selectAll('.contour')
          .data(contours.features)
          .enter()
          .append('path')
          .attr('class', 'contour')
          .attr('d', pathGen as any)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(200,172,120,0.18)')
          .attr('stroke-width', 0.5);
      }

      // Draw water bodies
      if (water?.features) {
        g.selectAll('.water')
          .data(water.features)
          .enter()
          .append('path')
          .attr('class', 'water')
          .attr('d', pathGen as any)
          .attr('fill', 'rgba(100,149,200,0.35)')
          .attr('stroke', 'rgba(100,149,200,0.5)')
          .attr('stroke-width', 0.5);
      }

      // Draw Paumanok Path trail
      if (trail?.features) {
        g.selectAll('.trail')
          .data(trail.features)
          .enter()
          .append('path')
          .attr('class', 'trail')
          .attr('d', pathGen as any)
          .attr('fill', 'none')
          .attr('stroke', '#C8AC78')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '4 3')
          .attr('opacity', 0.85);
      }

      // Hamlet pins
      MASTER_HAMLET_DATA.forEach(hamlet => {
        const [px, py] = projection([hamlet.lng, hamlet.lat]) ?? [0, 0];
        if (px === 0 && py === 0) return;

        // Pin dot
        g.append('circle')
          .attr('cx', px)
          .attr('cy', py)
          .attr('r', hamlet.tier === 'Ultra-Trophy' ? 5 : 3.5)
          .attr('fill', TIER_COLORS[hamlet.tier])
          .attr('stroke', '#FAF8F4')
          .attr('stroke-width', 1);

        // Label
        g.append('text')
          .attr('x', px + 7)
          .attr('y', py + 4)
          .attr('fill', '#FAF8F4')
          .attr('font-family', '"Barlow Condensed", sans-serif')
          .attr('font-size', 9)
          .attr('letter-spacing', '0.08em')
          .text(hamlet.name.toUpperCase());
      });

      // Trail legend
      const legend = svg.append('g').attr('transform', `translate(${width - 160}, ${height - 40})`);
      legend.append('line').attr('x1', 0).attr('y1', 8).attr('x2', 24).attr('y2', 8)
        .attr('stroke', '#C8AC78').attr('stroke-width', 1.5).attr('stroke-dasharray', '4 3');
      legend.append('text').attr('x', 30).attr('y', 12)
        .attr('fill', 'rgba(250,248,244,0.55)').attr('font-family', '"Barlow Condensed", sans-serif')
        .attr('font-size', 9).attr('letter-spacing', '0.1em').text('PAUMANOK PATH');

      // Attribution
      svg.append('text')
        .attr('x', 8).attr('y', height - 6)
        .attr('fill', 'rgba(250,248,244,0.25)')
        .attr('font-family', '"Source Sans 3", sans-serif')
        .attr('font-size', 8)
        .text('© OpenStreetMap contributors · USGS National Map');

      setLoaded(true);
    }).catch(() => setError(true));
  }, []);

  return (
    <div className="relative w-full" style={{ background: '#1B2A4A', borderBottom: '2px solid #C8AC78' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex items-end justify-between">
        <div>
          <div
            className="uppercase mb-1"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}
          >
            Paumanok · South Fork · Long Island
          </div>
          <h2
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.5rem' }}
          >
            The Territory
          </h2>
        </div>
        {!loaded && !error && (
          <div
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.6)', fontSize: 10, letterSpacing: '0.12em' }}
          >
            Loading map data…
          </div>
        )}
      </div>

      {/* SVG plate */}
      <svg
        ref={svgRef}
        className="w-full"
        style={{ height: 340, display: 'block' }}
        aria-label="Paumanok South Fork topographic map"
      />
    </div>
  );
}

// ─── Hamlet Drawer ────────────────────────────────────────────────────────────

function HamletDrawer({ hamlet, onClose }: { hamlet: HamletData; onClose: () => void }) {
  return (
    <div
      className="border-t"
      style={{ background: '#FAF8F4', borderColor: '#C8AC78' }}
    >
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div
              className="uppercase mb-1"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.18em', fontSize: 10 }}
            >
              {hamlet.tier}
            </div>
            <h3
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.5rem' }}
            >
              {hamlet.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.1em' }}
          >
            CLOSE
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Median Price', value: hamlet.medianPriceDisplay },
            { label: 'ANEW Score', value: `${hamlet.anewScore.toFixed(1)} / 10` },
            { label: 'Volume Share', value: `${hamlet.volumeShare}%` },
            { label: 'Last Sale', value: hamlet.lastSalePrice },
          ].map(stat => (
            <div key={stat.label} className="p-4 border" style={{ borderColor: 'rgba(27,42,74,0.12)', background: '#fff' }}>
              <div
                className="uppercase mb-1"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 10 }}
              >
                {stat.label}
              </div>
              <div
                style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.25rem' }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Last notable sale */}
        <div
          className="text-sm mb-4"
          style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}
        >
          Last notable sale: <strong>{hamlet.lastSale}</strong> at <strong>{hamlet.lastSalePrice}</strong>
        </div>

        {/* Best restaurant */}
        <div
          className="text-sm mb-5"
          style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}
        >
          Best table: <strong>{hamlet.bestRestaurant}</strong>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          <a
            href={hamlet.zillowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs uppercase tracking-wider border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.12em' }}
          >
            Zillow
          </a>
          {hamlet.newsLinks.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs uppercase tracking-wider border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: 'rgba(27,42,74,0.3)', color: '#384249', letterSpacing: '0.12em' }}
            >
              {link.label}
            </a>
          ))}
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

    // Add hamlet pins to the Google Map
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
        setActiveHamlet(hamlet);
      });
    });
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* ── Paumanok Plate ───────────────────────────────────────────────── */}
      <PaumanokPlate />

      {/* ── Bottom section: Google Map + Hamlet Grid ─────────────────────── */}
      <div className="flex flex-col lg:flex-row" style={{ minHeight: 520 }}>

        {/* Google Map */}
        <div className="flex-1 relative" style={{ minHeight: 400 }}>
          <MapView
            onMapReady={handleMapReady}
            initialCenter={{ lat: 40.96, lng: -72.35 }}
            initialZoom={10}
          />
          {!mapReady && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: '#1B2A4A' }}
            >
              <span
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 11 }}
              >
                Loading map…
              </span>
            </div>
          )}
        </div>

        {/* Hamlet button grid */}
        <div
          className="w-full lg:w-80 shrink-0 p-5 border-t lg:border-t-0 lg:border-l overflow-y-auto"
          style={{ borderColor: 'rgba(27,42,74,0.12)', background: '#FAF8F4', maxHeight: 520 }}
        >
          <div
            className="uppercase mb-4"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}
          >
            Nine Hamlets
          </div>
          <div className="flex flex-col gap-2">
            {MASTER_HAMLET_DATA.map(hamlet => (
              <button
                key={hamlet.id}
                onClick={() => setActiveHamlet(activeHamlet?.id === hamlet.id ? null : hamlet)}
                className="w-full text-left px-4 py-3 border transition-all duration-200 flex items-center justify-between group"
                style={{
                  fontFamily: '"Source Sans 3", sans-serif',
                  borderColor: activeHamlet?.id === hamlet.id ? '#C8AC78' : 'rgba(27,42,74,0.15)',
                  background: activeHamlet?.id === hamlet.id ? '#1B2A4A' : '#fff',
                  color: activeHamlet?.id === hamlet.id ? '#FAF8F4' : '#384249',
                }}
              >
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, fontSize: '1rem' }}>
                  {hamlet.name}
                </span>
                <span
                  className="text-[10px] uppercase px-2 py-0.5"
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    letterSpacing: '0.1em',
                    background: activeHamlet?.id === hamlet.id ? 'rgba(200,172,120,0.2)' : 'rgba(27,42,74,0.06)',
                    color: activeHamlet?.id === hamlet.id ? '#C8AC78' : '#7a8a8e',
                  }}
                >
                  {hamlet.medianPriceDisplay}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hamlet Drawer ────────────────────────────────────────────────── */}
      {activeHamlet && (
        <HamletDrawer hamlet={activeHamlet} onClose={() => setActiveHamlet(null)} />
      )}

    </div>
  );
}
