/**
 * MAPS TAB — Maps Intelligence Hub. Five layers, one scroll.
 * Layer 1: Paumanok SVG aerial plate (static, no zoom controls)
 * Layer 2: CIS Calculator (migrated from IDEAS — this is the canonical home)
 * Layer 3: Eleven Hamlet Matrix — CIS score cards with satellite thumbnails
 * Layer 4: Individual hamlet PDF download from each card
 * Layer 5: Calculator output printable from Maps tab
 *
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * NOTE: IDEAS tab removed from public navigation. This is the canonical home
 * for the CIS Calculator. Do not re-add IDEAS to the nav.
 */

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MapView } from '@/components/Map';
import { toast } from 'sonner';
import { MatrixCard } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA, TIER_COLORS, type HamletData } from '@/data/hamlet-master';
import { HAMLET_BOUNDARIES } from '@/data/hamlet-boundaries';
import { ED_HEADSHOT_PRIMARY, LOGO_BLACK } from '@/lib/cdn-assets';
import {
  runAnewCalculator,
  LENS_LABELS,
  getVerdict,
  type AnewLens,
  type AnewOutput,
  type AnewBuildInput,
  type BuyHoldInput,
  type BuyRenovateHoldInput,
  type BuyRentInput,
} from '@/calculators/anew-calculator';
import {
  generateAnewBuildMemo,
  generateChristieCMA,
  generateDealBrief,
  generateInvestmentMemo,
  generateMarketReport,
  generateEastHamptonVillageReport,
} from '@/lib/pdf-exports';

// ─── CDN URLs for GeoJSON ─────────────────────────────────────────────────────

const GEOJSON_URLS = {
  contours:    'https://static.manus.space/webdev/paumanok_contours.geojson',
  waterBodies: 'https://static.manus.space/webdev/paumanok_water_bodies.geojson',
  trail:       'https://static.manus.space/webdev/paumanok_trail.geojson',
};

// ─── Layer 1: Google Maps Aerial Plate ───────────────────────────────────────
// East Hampton, NY: lat 40.9635, lng -72.1851 — satellite aerial, zoom 11

function PaumanokPlate() {
  const mapRef = useRef<google.maps.Map | null>(null);

  return (
    <div className="relative w-full" style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto', borderBottom: '2px solid #C8AC78' }}>
      {/* Header overlay — gradient fades into the map */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: '16px 24px 32px',
          background: 'linear-gradient(to bottom, rgba(27,42,74,0.85) 0%, rgba(27,42,74,0) 100%)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }}>
            South Fork · East Hampton · Long Island
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.5rem' }}>
            The Territory
          </h2>
        </div>
      </div>
      <MapView
        className="w-full h-[420px]"
        initialCenter={{ lat: 40.97, lng: -72.55 }}
        initialZoom={9}
        onMapReady={(map) => {
          mapRef.current = map;
          // Satellite aerial view — full North+South Fork
          map.setMapTypeId('satellite');
          map.setTilt(0);

          // ── Hamlet boundary polygon overlays ────────────────────────────────
          // Semi-transparent navy fill, gold stroke — Christie's palette
          HAMLET_BOUNDARIES.forEach(boundary => {
            const polygon = new window.google!.maps.Polygon({
              paths: boundary.coords.map(([lat, lng]) => ({ lat, lng })),
              strokeColor: '#C8AC78',
              strokeOpacity: 0.85,
              strokeWeight: 2,
              fillColor: '#1B2A4A',
              fillOpacity: 0.18,
              map,
            });

            // Info window on click — hamlet name + CIS score
            const hamletData = MASTER_HAMLET_DATA.find(h => h.id === boundary.id);
            if (hamletData) {
              const infoWindow = new window.google!.maps.InfoWindow({
                content: [
                  '<div style="font-family:Barlow Condensed,sans-serif;background:#1B2A4A;color:#FAF8F4;padding:10px 14px;min-width:140px;">',
                  `<div style="color:#C8AC78;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px">${boundary.name}</div>`,
                  `<div style="font-family:Cormorant Garamond,serif;font-size:1.1rem;font-weight:400">${hamletData.medianPriceDisplay}</div>`,
                  `<div style="color:rgba(200,172,120,0.7);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;margin-top:2px">CIS ${hamletData.anewScore}/10</div>`,
                  '</div>',
                ].join(''),
              });
              polygon.addListener('click', (e: google.maps.MapMouseEvent) => {
                infoWindow.setPosition(e.latLng);
                infoWindow.open(map);
              });
            }
          });

          // ── Gold dot markers (on top of polygons) ───────────────────────────
          // P4 mobile fix: 44px tap target wrapper with 20px visible dot (Apple HIG minimum)
          MASTER_HAMLET_DATA.forEach(hamlet => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = [
              'width:44px', 'height:44px', 'border-radius:50%',
              'display:flex', 'align-items:center', 'justify-content:center',
              'cursor:pointer', 'background:transparent',
            ].join(';');
            const pin = document.createElement('div');
            pin.style.cssText = [
              'width:20px', 'height:20px', 'border-radius:50%',
              'background:#C8AC78', 'border:2.5px solid #FAF8F4',
              'box-shadow:0 2px 8px rgba(0,0,0,0.55)',
              'pointer-events:none',
            ].join(';');
            wrapper.appendChild(pin);
            new window.google!.maps.marker.AdvancedMarkerElement({
              map,
              position: { lat: hamlet.lat, lng: hamlet.lng },
              title: hamlet.name,
              content: wrapper,
            });
          });
        }}
      />
    </div>
  );
}

// ─── Layer 2: CIS Calculator (migrated from IDEAS) ────────────────────────────

const MODES: { lens: AnewLens; title: string; subtitle: string; icon: string }[] = [
  { lens: 'anew-build',        title: 'ANEW Build',           subtitle: 'Land + construction → exit price',           icon: '⬡' },
  { lens: 'buy-hold',          title: 'Buy & Hold',           subtitle: 'Acquisition → projected appreciation',        icon: '◈' },
  { lens: 'buy-renovate-hold', title: 'Buy, Renovate & Hold', subtitle: 'Acquisition + renovation → exit',             icon: '◇' },
  { lens: 'buy-rent',          title: 'Buy & Rent',           subtitle: 'Rental income + appreciation → total return', icon: '○' },
];

function VerdictBadge({ verdict }: { verdict: ReturnType<typeof getVerdict> }) {
  const map: Record<string, { bg: string; text: string }> = {
    'Institutional': { bg: '#1B2A4A', text: '#C8AC78' },
    'Executable':    { bg: '#C8AC78', text: '#1B2A4A' },
    'Marginal':      { bg: '#e07b39', text: '#FAF8F4' },
    'Pass':          { bg: '#c0392b', text: '#FAF8F4' },
  };
  const style = map[verdict] ?? map['Pass'];
  return (
    <span className="px-3 py-1 text-xs uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', background: style.bg, color: style.text, letterSpacing: '0.18em' }}>
      {verdict}
    </span>
  );
}

function CurrencyInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="uppercase text-[10px] tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#7a8a8e', fontFamily: '"Source Sans 3", sans-serif' }}>$</span>
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? '0'} className="w-full pl-7 pr-3 py-2.5 border text-sm outline-none transition-colors focus:border-[#C8AC78]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', background: '#fff', borderColor: 'rgba(27,42,74,0.18)' }} />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="uppercase text-[10px] tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? ''} className="w-full px-3 py-2.5 border text-sm outline-none transition-colors focus:border-[#C8AC78]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', background: '#fff', borderColor: 'rgba(27,42,74,0.18)' }} />
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder, suffix }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="uppercase text-[10px] tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>{label}</label>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? '0'} className="w-full px-3 py-2.5 border text-sm outline-none transition-colors focus:border-[#C8AC78]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', background: '#fff', borderColor: 'rgba(27,42,74,0.18)', paddingRight: suffix ? '2.5rem' : '0.75rem' }} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#7a8a8e', fontFamily: '"Source Sans 3", sans-serif' }}>{suffix}</span>}
      </div>
    </div>
  );
}

function HamletSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="uppercase text-[10px] tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Hamlet</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2.5 border text-sm outline-none focus:border-[#C8AC78]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', background: '#fff', borderColor: 'rgba(27,42,74,0.18)' }}>
        {MASTER_HAMLET_DATA.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
      </select>
    </div>
  );
}

function RunButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full py-3 text-sm uppercase tracking-widest transition-colors hover:bg-[#C8AC78] hover:text-[#1B2A4A]" style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#FAF8F4', letterSpacing: '0.2em' }}>
      Request Your Private Property Intelligence Brief
    </button>
  );
}

function ResultsPanel({ result, onExport }: { result: AnewOutput; onExport: (type: string) => void }) {
  const exportTypes = [
    { id: 'anew-memo',       label: 'ANEW Build Memo' },
    { id: 'cma',             label: 'CMA' },
    { id: 'deal-brief',      label: 'Deal Brief' },
    { id: 'investment-memo', label: 'Investment Memo' },
    { id: 'market-report',   label: 'Market Report' },
    { id: 'ehv-hamlet',      label: 'EH Village Hamlet' },
  ];
  return (
    <MatrixCard variant="navy" className="p-6">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[rgba(200,172,120,0.2)]">
        <div className="flex items-center gap-3">
          <img src={ED_HEADSHOT_PRIMARY} alt="Ed Bruehl — Managing Director" className="h-10 w-10 rounded-full object-cover object-top border border-[rgba(200,172,120,0.35)]" />
          <div>
            <div className="text-[var(--color-cream)] text-[0.8rem] font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Ed Bruehl</div>
            <div className="text-[rgba(200,172,120,0.7)] text-[0.6rem] uppercase tracking-[0.14em]" style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>Managing Director · Christie's East Hampton</div>
          </div>
        </div>
        <img src={LOGO_BLACK} alt="Christie's International Real Estate Group" className="h-5 w-auto opacity-80 brightness-0 invert" />
      </div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.18em', fontSize: 10 }}>{result.hamletName} · {LENS_LABELS[result.lens]}</div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.25rem' }}>{result.address}</div>
        </div>
        <VerdictBadge verdict={result.verdict} />
      </div>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center border-2" style={{ borderColor: '#C8AC78', background: 'rgba(200,172,120,0.08)' }}>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#C8AC78', fontWeight: 700, fontSize: '1.75rem' }}>{result.score}</span>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {[{ label: 'All-In Cost', value: result.allInDisplay }, { label: 'Exit Price', value: result.exitDisplay }, { label: 'Spread', value: result.spreadDisplay }, { label: 'Spread %', value: result.spreadPctDisplay }].map(item => (
            <div key={item.label}>
              <div className="uppercase text-[10px] mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.7)', letterSpacing: '0.14em' }}>{item.label}</div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      {result.strategicClassification && (
        <div className="mb-5 px-4 py-3 border-l-2" style={{ borderColor: '#C8AC78', background: 'rgba(200,172,120,0.08)' }}>
          <div className="uppercase text-[10px] mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em' }}>Strategic Classification</div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontSize: '0.9375rem' }}>{result.strategicClassification}</div>
        </div>
      )}
      <div className="mb-6 text-sm italic" style={{ fontFamily: '"Cormorant Garamond", serif', color: 'rgba(250,248,244,0.55)', lineHeight: 1.5 }}>"{result.mentorLine}"</div>
      <div>
        <div className="uppercase text-[10px] mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.18em' }}>Export</div>
        <div className="flex flex-wrap gap-2">
          {exportTypes.map(exp => (
            <button key={exp.id} onClick={() => onExport(exp.id)} className="px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors hover:bg-[#C8AC78] hover:text-[#1B2A4A] hover:border-[#C8AC78]" style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: 'rgba(200,172,120,0.4)', color: 'rgba(250,248,244,0.8)', letterSpacing: '0.12em' }}>
              {exp.label}
            </button>
          ))}
        </div>
      </div>
      {/* P1 — WhatsApp Conversion CTA */}
      <div className="mt-5 pt-5 border-t border-[rgba(200,172,120,0.15)]">
        <a
          href={`https://wa.me/16467521233?text=${encodeURIComponent(`Hi Ed — I just ran a Christie's Intelligence Score for ${result.address} in ${result.hamletName}. The CIS score came back ${result.score}/10 (${result.verdict}). I'd like to request a Private Property Intelligence Brief.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 text-sm uppercase tracking-widest transition-colors hover:opacity-90"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#25D366', color: '#fff', letterSpacing: '0.18em', textDecoration: 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Request Private Intelligence Brief
        </a>
      </div>
    </MatrixCard>
  );
}

function AnewBuildForm({ onResult }: { onResult: (r: AnewOutput) => void }) {
  const [hamletId, setHamletId] = useState('east-hampton-village');
  const [address, setAddress] = useState('');
  const [landValue, setLandValue] = useState('');
  const [constructionCost, setConstructionCost] = useState('');
  const [softCosts, setSoftCosts] = useState('');
  const [carry, setCarry] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const run = () => {
    const input: AnewBuildInput = { lens: 'anew-build', hamletId, address: address || '(Address not specified)', landValue: parseFloat(landValue) || 0, constructionCost: parseFloat(constructionCost) || 0, softCosts: parseFloat(softCosts) || 0, carry: parseFloat(carry) || 0, exitPrice: parseFloat(exitPrice) || 0 };
    onResult(runAnewCalculator(input));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2"><HamletSelect value={hamletId} onChange={setHamletId} /></div>
      <div className="md:col-span-2"><TextInput label="Property Address" value={address} onChange={setAddress} placeholder="140 Hands Creek Road, East Hampton" /></div>
      <CurrencyInput label="Land Value" value={landValue} onChange={setLandValue} placeholder="1500000" />
      <CurrencyInput label="Construction Cost (Hard)" value={constructionCost} onChange={setConstructionCost} placeholder="2800000" />
      <CurrencyInput label="Soft Costs" value={softCosts} onChange={setSoftCosts} placeholder="420000" />
      <CurrencyInput label="Carry (Financing / Holding)" value={carry} onChange={setCarry} placeholder="280000" />
      <div className="md:col-span-2"><CurrencyInput label="Exit Price" value={exitPrice} onChange={setExitPrice} placeholder="6500000" /></div>
      <div className="md:col-span-2"><RunButton onClick={run} /></div>
    </div>
  );
}

function BuyHoldForm({ onResult }: { onResult: (r: AnewOutput) => void }) {
  const [hamletId, setHamletId] = useState('east-hampton-village');
  const [address, setAddress] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [holdYears, setHoldYears] = useState('5');
  const [projectedExitPrice, setProjectedExitPrice] = useState('');
  const run = () => {
    const input: BuyHoldInput = { lens: 'buy-hold', hamletId, address: address || '(Address not specified)', purchasePrice: parseFloat(purchasePrice) || 0, closingCosts: parseFloat(closingCosts) || 0, holdYears: parseInt(holdYears) || 5, projectedExitPrice: parseFloat(projectedExitPrice) || 0 };
    onResult(runAnewCalculator(input));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2"><HamletSelect value={hamletId} onChange={setHamletId} /></div>
      <div className="md:col-span-2"><TextInput label="Property Address" value={address} onChange={setAddress} placeholder="239 Old Stone Highway, Springs" /></div>
      <CurrencyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} placeholder="2100000" />
      <CurrencyInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} placeholder="63000" />
      <NumberInput label="Hold Period" value={holdYears} onChange={setHoldYears} placeholder="5" suffix="yrs" />
      <CurrencyInput label="Projected Exit Price" value={projectedExitPrice} onChange={setProjectedExitPrice} placeholder="2800000" />
      <div className="md:col-span-2"><RunButton onClick={run} /></div>
    </div>
  );
}

function BuyRenovateHoldForm({ onResult }: { onResult: (r: AnewOutput) => void }) {
  const [hamletId, setHamletId] = useState('sag-harbor');
  const [address, setAddress] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [renovationCost, setRenovationCost] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [holdYears, setHoldYears] = useState('3');
  const [projectedExitPrice, setProjectedExitPrice] = useState('');
  const run = () => {
    const input: BuyRenovateHoldInput = { lens: 'buy-renovate-hold', hamletId, address: address || '(Address not specified)', purchasePrice: parseFloat(purchasePrice) || 0, renovationCost: parseFloat(renovationCost) || 0, closingCosts: parseFloat(closingCosts) || 0, holdYears: parseInt(holdYears) || 3, projectedExitPrice: parseFloat(projectedExitPrice) || 0 };
    onResult(runAnewCalculator(input));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2"><HamletSelect value={hamletId} onChange={setHamletId} /></div>
      <div className="md:col-span-2"><TextInput label="Property Address" value={address} onChange={setAddress} /></div>
      <CurrencyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
      <CurrencyInput label="Renovation Cost" value={renovationCost} onChange={setRenovationCost} />
      <CurrencyInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} />
      <NumberInput label="Hold Period" value={holdYears} onChange={setHoldYears} suffix="yrs" />
      <div className="md:col-span-2"><CurrencyInput label="Projected Exit Price" value={projectedExitPrice} onChange={setProjectedExitPrice} /></div>
      <div className="md:col-span-2"><RunButton onClick={run} /></div>
    </div>
  );
}

function BuyRentForm({ onResult }: { onResult: (r: AnewOutput) => void }) {
  const [hamletId, setHamletId] = useState('east-hampton');
  const [address, setAddress] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [closingCosts, setClosingCosts] = useState('');
  const [annualRent, setAnnualRent] = useState('');
  const [annualExpenses, setAnnualExpenses] = useState('');
  const [holdYears, setHoldYears] = useState('5');
  const [projectedExitPrice, setProjectedExitPrice] = useState('');
  const run = () => {
    const input: BuyRentInput = { lens: 'buy-rent', hamletId, address: address || '(Address not specified)', purchasePrice: parseFloat(purchasePrice) || 0, closingCosts: parseFloat(closingCosts) || 0, annualRent: parseFloat(annualRent) || 0, annualExpenses: parseFloat(annualExpenses) || 0, holdYears: parseInt(holdYears) || 5, projectedExitPrice: parseFloat(projectedExitPrice) || 0 };
    onResult(runAnewCalculator(input));
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2"><HamletSelect value={hamletId} onChange={setHamletId} /></div>
      <div className="md:col-span-2"><TextInput label="Property Address" value={address} onChange={setAddress} /></div>
      <CurrencyInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} />
      <CurrencyInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} />
      <CurrencyInput label="Annual Rental Income" value={annualRent} onChange={setAnnualRent} />
      <CurrencyInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} />
      <NumberInput label="Hold Period" value={holdYears} onChange={setHoldYears} suffix="yrs" />
      <CurrencyInput label="Projected Exit Price" value={projectedExitPrice} onChange={setProjectedExitPrice} />
      <div className="md:col-span-2"><RunButton onClick={run} /></div>
    </div>
  );
}

function CISCalculatorLayer() {
  const [activeLens, setActiveLens] = useState<AnewLens>('anew-build');
  const [result, setResult] = useState<AnewOutput | null>(null);

  const handleExport = async (type: string) => {
    if (!result) return;
    const toastId = toast.loading('Generating PDF…');
    try {
      switch (type) {
        case 'anew-memo':       await generateAnewBuildMemo(result); break;
        case 'cma':             await generateChristieCMA(result); break;
        case 'deal-brief':      await generateDealBrief(result); break;
        case 'investment-memo': await generateInvestmentMemo(result); break;
        case 'market-report':   await generateMarketReport(result.hamletId); break;
        case 'ehv-hamlet':      await generateEastHamptonVillageReport(); break;
        default: break;
      }
      toast.success('PDF downloaded', { id: toastId });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('PDF generation failed — check console', { id: toastId });
    }
  };

  return (
    <div style={{ background: '#FAF8F4', borderBottom: '1px solid rgba(27,42,74,0.12)' }}>
      {/* Section header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>Christie's Intelligence Score</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>CIS Calculator</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>Select a lens, enter your numbers, and receive an institutional-grade Christie's Intelligence Score with strategic classification.</p>
      </div>

      <div className="px-6 py-8">
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>Select Lens</div>
          <div className="flex flex-wrap gap-2 mb-8">
            {MODES.map(mode => (
              <button
                key={mode.lens}
                onClick={() => { setActiveLens(mode.lens); setResult(null); }}
                className="px-4 py-2 text-xs uppercase tracking-wider border transition-all duration-200"
                style={{
                  fontFamily: '"Barlow Condensed", sans-serif',
                  letterSpacing: '0.14em',
                  background: activeLens === mode.lens ? '#1B2A4A' : 'transparent',
                  color: activeLens === mode.lens ? '#C8AC78' : '#384249',
                  borderColor: activeLens === mode.lens ? '#C8AC78' : 'rgba(27,42,74,0.2)',
                  borderLeftWidth: activeLens === mode.lens ? 3 : 1,
                }}
              >
                {mode.icon} {mode.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>{LENS_LABELS[activeLens]}</div>
              <MatrixCard variant="default" className="p-6">
                {activeLens === 'anew-build'        && <AnewBuildForm onResult={setResult} />}
                {activeLens === 'buy-hold'          && <BuyHoldForm onResult={setResult} />}
                {activeLens === 'buy-renovate-hold' && <BuyRenovateHoldForm onResult={setResult} />}
                {activeLens === 'buy-rent'          && <BuyRentForm onResult={setResult} />}
              </MatrixCard>
            </div>
            <div>
              <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>CIS Output</div>
              {result ? (
                <ResultsPanel result={result} onExport={handleExport} />
              ) : (
                <MatrixCard variant="default" className="p-8 flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <div className="text-4xl mb-4" style={{ color: 'rgba(27,42,74,0.15)' }}>◈</div>
                    <div style={{ fontFamily: '"Cormorant Garamond", serif', color: 'rgba(27,42,74,0.4)', fontSize: '1.125rem' }}>Enter your numbers and run the score</div>
                  </div>
                </MatrixCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Layer 3 + 4: Eleven Hamlet Matrix + PDF Download ────────────────────────────

function HamletMatrixCard({ hamlet, onExpand, isExpanded, liveListings }: { hamlet: HamletData; onExpand: () => void; isExpanded: boolean; liveListings: Record<string, LiveListing[]> }) {
  const hamletListings = liveListings[hamlet.id] || [];
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    const toastId = toast.loading(`Generating ${hamlet.name} PDF…`);
    try {
      await generateMarketReport(hamlet.id);
      toast.success('PDF downloaded', { id: toastId });
    } catch (err) {
      console.error('Hamlet PDF error:', err);
      toast.error('PDF generation failed', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      onClick={onExpand}
      className="cursor-pointer transition-all duration-200"
      style={{
        background: isExpanded ? '#1B2A4A' : '#fff',
        border: `1px solid ${isExpanded ? '#C8AC78' : 'rgba(27,42,74,0.12)'}`,
        borderTop: `3px solid ${TIER_COLORS[hamlet.tier]}`,
      }}
    >
      {/* Hamlet photo thumbnail */}
      <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
        <img
          src={hamlet.imageUrl || hamlet.photo}
          alt={hamlet.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(27,42,74,0.75) 100%)' }} />
        {hamletListings.length > 0 && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: '#C8AC78', color: '#1B2A4A', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', fontWeight: 700 }}>
            {hamletListings.length} ACTIVE
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 12px' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: isExpanded ? '#FAF8F4' : '#1B2A4A', fontWeight: 600, fontSize: '1.05rem', marginBottom: 6 }}>
          {hamlet.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Median</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: isExpanded ? '#FAF8F4' : '#384249', fontWeight: 600, fontSize: '0.9rem' }}>{hamlet.medianPriceDisplay}</div>
          </div>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Vol Share</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: isExpanded ? '#FAF8F4' : '#384249', fontWeight: 600, fontSize: '0.9rem' }}>{hamlet.volumeShare}%</div>
          </div>
        </div>

        {/* Live listing preview — shows first listing address if available */}
        {hamletListings.length > 0 && (
          <div style={{ marginBottom: 8, padding: '8px 10px', background: isExpanded ? 'rgba(200,172,120,0.1)' : 'rgba(27,42,74,0.04)', borderLeft: '2px solid #C8AC78' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>Top Listing</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: isExpanded ? '#FAF8F4' : '#1B2A4A', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hamletListings[0].address}</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#C8AC78', fontSize: '0.72rem', fontWeight: 700 }}>{hamletListings[0].price}</div>
          </div>
        )}
        {/* PDF download button — Layer 4 */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-1.5 text-[10px] uppercase tracking-widest border transition-colors"
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            borderColor: '#C8AC78',
            color: isExpanded ? '#C8AC78' : '#1B2A4A',
            background: 'transparent',
            letterSpacing: '0.16em',
            opacity: downloading ? 0.6 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C8AC78'; e.currentTarget.style.color = '#1B2A4A'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isExpanded ? '#C8AC78' : '#1B2A4A'; }}
        >
          {downloading ? 'Generating…' : '↓ Hamlet PDF'}
        </button>
      </div>
    </div>
  );
}

// ─── Live Listings Type ───────────────────────────────────────────────────────

interface LiveListing {
  address: string;
  price: string;
  beds: number | null;
  baths: number | null;
  sqft: string;
  url: string;
  hamlet?: string;
}

// ─── Hamlet Detail Panel (expands below matrix) ───────────────────────────────

function HamletDetailPanel({ hamlet, onClose, liveListings }: { hamlet: HamletData; onClose: () => void; liveListings: Record<string, LiveListing[]> }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hamlet.id]);

  const tierColor = TIER_COLORS[hamlet.tier];

  return (
    <div ref={panelRef} style={{ background: '#FAF8F4', borderTop: `3px solid ${tierColor}` }}>
      <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
        <img src={hamlet.imageUrl || hamlet.photo} alt={hamlet.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(27,42,74,0.1) 0%, rgba(27,42,74,0.72) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '24px 28px' }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '2rem', lineHeight: 1.1 }}>
            {hamlet.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 14px', cursor: 'pointer', border: '1px solid rgba(250,248,244,0.6)', background: 'rgba(27,42,74,0.55)', color: '#FAF8F4', borderRadius: 2, backdropFilter: 'blur(4px)' }}
        >
          ✕ Close
        </button>
      </div>

      <div style={{ padding: '28px 28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Median Price', value: hamlet.medianPriceDisplay },
            { label: 'CIS', value: `${hamlet.anewScore.toFixed(1)} / 10` },
            { label: 'Share of Hamptons Dollar Volume', value: `${hamlet.volumeShare}%` },
            { label: 'Last Zillow Sale', value: hamlet.lastSalePrice },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '14px 16px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 9.5, textTransform: 'uppercase', marginBottom: 5 }}>{stat.label}</div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.2rem' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {hamlet.vibeText && (
          <div style={{ marginBottom: 28, padding: '18px 20px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)', borderLeft: '3px solid #C8AC78' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 8 }}>Character</div>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontSize: '1.05rem', lineHeight: 1.65, margin: 0 }}>{hamlet.vibeText}</p>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: '14px 16px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)', display: 'inline-block', minWidth: 260 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 9.5, textTransform: 'uppercase', marginBottom: 5 }}>Last Zillow Sale</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A', fontSize: '0.88rem', fontWeight: 600 }}>{hamlet.lastSale}</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.82rem', marginTop: 2 }}>{hamlet.lastSalePrice} · {hamlet.lastSaleDate}</div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>Dining</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
            {[
              { tier: 'Anchor', value: hamlet.restaurants.anchor },
              { tier: 'Mid', value: hamlet.restaurants.mid },
              { tier: 'Local', value: hamlet.restaurants.local },
            ].map(r => (
              <div key={r.tier} style={{ padding: '12px 14px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)' }}>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontSize: 9, textTransform: 'uppercase', marginBottom: 4 }}>{r.tier}</div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: r.value === 'TBD' ? '#ccc' : '#1B2A4A', fontSize: '0.85rem', fontWeight: 600, fontStyle: r.value === 'TBD' ? 'italic' : 'normal' }}>
                  {r.value === 'TBD' ? 'Coming Soon' : r.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {(() => {
          const live = liveListings[hamlet.id] || [];
          const realListings = live.length > 0 ? live : hamlet.eeleListings.filter(l => !l.placeholder);
          return (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>Active Listings</div>
              {realListings.length === 0 ? (
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.82rem', fontStyle: 'italic', padding: '10px 0' }}>No active listings at this time.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                  {realListings.map((listing, i) => (
                    <a key={i} href={listing.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px 16px', background: '#fff', border: '1px solid rgba(27,42,74,0.1)', textDecoration: 'none', transition: 'border-color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#C8AC78')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(27,42,74,0.1)')}>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>{listing.address}</div>
                      <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#C8AC78', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{listing.price}</div>
                      <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{listing.beds} BD · {listing.baths} BA · {listing.sqft} SF</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>News &amp; Coverage</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <a href={hamlet.zillowUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', border: '1px solid #1B2A4A', color: '#1B2A4A', textDecoration: 'none', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#1B2A4A'; e.currentTarget.style.color = '#FAF8F4'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1B2A4A'; }}>
              Zillow Market
            </a>
            {hamlet.newsLinks.map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', border: '1px solid rgba(27,42,74,0.3)', color: '#384249', textDecoration: 'none', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#1B2A4A'; e.currentTarget.style.color = '#FAF8F4'; e.currentTarget.style.borderColor = '#1B2A4A'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#384249'; e.currentTarget.style.borderColor = 'rgba(27,42,74,0.3)'; }}>
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
  const [liveListings, setLiveListings] = useState<Record<string, LiveListing[]>>({});

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => { if (data.byHamlet) setLiveListings(data.byHamlet); })
      .catch(err => console.warn('[MapsTab] Listings fetch failed, using placeholders:', err));
  }, []);

  return (
    <div style={{ background: '#FAF8F4', minHeight: '100vh' }}>

      {/* ── Layer 1: Paumanok Aerial Plate (static, no zoom) ─────────────────── */}
      <div className="px-6" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <PaumanokPlate />
        </div>
      </div>
      {/* ── Layer 2: CIS Calculator ───────────────────────────────────────── */}
      <CISCalculatorLayer />

      {/* ── Layer 3: Eleven Hamlet Matrix ────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(27,42,74,0.12)' }}>
        <div className="px-6 pt-8 pb-4" style={{ background: '#FAF8F4' }}>
          <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
            <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
              Eleven Hamlets · South Fork
            </div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 400, fontSize: '1.5rem' }}>
              Hamlet Intelligence Matrix
            </h2>
            <p className="mt-1 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
              Click any hamlet to expand the full intelligence panel. Download individual hamlet PDFs directly from each card.
            </p>
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {MASTER_HAMLET_DATA.map(hamlet => (
              <HamletMatrixCard
                key={hamlet.id}
                hamlet={hamlet}
                isExpanded={activeHamlet?.id === hamlet.id}
                onExpand={() => setActiveHamlet(prev => prev?.id === hamlet.id ? null : hamlet)}
                liveListings={liveListings}
              />
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* ── Layer 4 + 5: Hamlet Detail Panel + Print Output ──────────────── */}
      {activeHamlet && (
        <HamletDetailPanel
          hamlet={activeHamlet}
          onClose={() => setActiveHamlet(null)}
          liveListings={liveListings}
        />
      )}

    </div>
  );
}
