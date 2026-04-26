/**
 * MAPS TAB — Maps Intelligence Hub. Five layers, one scroll.
 * Layer 1: Paumanok SVG aerial plate (static, no zoom controls)
 * Layer 2: ANEW Deal Engine (canonical home)
 * Layer 3: Ten Hamlet Matrix — hamlet intelligence cards with satellite thumbnails
 * Layer 4: Individual hamlet PDF download from each card
 * Layer 5: Calculator output printable from Maps tab
 *
 * Design: navy #1B2A4A · gold #947231 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (titles) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * NOTE: IDEAS tab removed from public navigation. This is the canonical home
 * for the ANEW Deal Engine. Do not re-add IDEAS to the nav.
 */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
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
import { captureToPdf } from '@/lib/capture-pdf';
import hamletHighlightsData from '@/data/hamlet-highlights.json';
import { ANEWDealEngine } from '@/components/ANEWDealEngine';
import { GoldBlackFrame, FloatingCard } from '@/components/FramePrimitives';

// ─── CDN URLs for GeoJSON ─────────────────────────────────────────────────────

const GEOJSON_URLS = {
  contours:    'https://static.manus.space/webdev/paumanok_contours.geojson',
  waterBodies: 'https://static.manus.space/webdev/paumanok_water_bodies.geojson',
  trail:       'https://static.manus.space/webdev/paumanok_trail.geojson',
};

// ─── Layer 1: Google Maps Aerial Plate ───────────────────────────────────────
// Clean satellite view: full South Fork + tip of North Fork visible
// No markers, no polygons, no UI controls — pure aerial geography

function PaumanokPlate() {
  const mapRef = useRef<google.maps.Map | null>(null);

  return (
    <div style={{ background: 'transparent', paddingBottom: 32 }}>
      {/* Framed map */}
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto', padding: '0 24px' }}>
        <GoldBlackFrame style={{ overflow: 'hidden' }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, rgba(200,172,120,0.7) 0%, rgba(200,172,120,0.08) 100%)' }} />
          <MapView
            className="w-full h-[420px]"
            initialCenter={{ lat: 40.93, lng: -72.35 }}
            initialZoom={10}
            onMapReady={(map) => {
              mapRef.current = map;
              map.setMapTypeId('satellite');
              map.setTilt(0);
              map.setOptions({
                disableDefaultUI: true,
                gestureHandling: 'cooperative',
                keyboardShortcuts: false,
              });
            }}
            />
        </GoldBlackFrame>
      </div>
    </div>
  );
}
// ─── Layer 2: ANEW Deal Engine──────────────────────────────────────────────────

const DEFAULT_ADDRESS = '140 Hands Creek Road, East Hampton';
const LS_ADDRESS_KEY = 'anew_last_address';

const MODES: { lens: AnewLens; title: string; subtitle: string; icon: string }[] = [
  { lens: 'anew-build',        title: 'ANEW Build',           subtitle: 'Land + construction → exit price',           icon: '⬡' },
  { lens: 'buy-hold',          title: 'Buy & Hold',           subtitle: 'Acquisition → projected appreciation',        icon: '◈' },
  { lens: 'buy-renovate-hold', title: 'Buy, Renovate & Hold', subtitle: 'Acquisition + renovation → exit',             icon: '◇' },
  { lens: 'buy-rent',          title: 'Buy & Rent',           subtitle: 'Rental income + appreciation → total return', icon: '○' },
];

function VerdictBadge({ verdict }: { verdict: ReturnType<typeof getVerdict> }) {
  const map: Record<string, { bg: string; text: string }> = {
    'Institutional': { bg: '#1B2A4A', text: '#947231' },
    'Executable':    { bg: '#947231', text: '#1B2A4A' },
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
      <label className="uppercase tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.16em', fontSize: 12, fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#7a8a8e', fontFamily: '"Source Sans 3", sans-serif' }}>$</span>
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? '0'} className="w-full pl-7 pr-3 py-2.5 border text-sm outline-none transition-colors focus:border-[#947231]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)', borderColor: 'rgba(200,172,120,0.2)' }} />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="uppercase tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.16em', fontSize: 12, fontWeight: 600 }}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? ''} className="w-full px-3 py-2.5 border text-sm outline-none transition-colors focus:border-[#947231]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)', borderColor: 'rgba(200,172,120,0.2)' }} />
    </div>
  );
}

function NumberInput({ label, value, onChange, placeholder, suffix }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; suffix?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="uppercase tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.16em', fontSize: 12, fontWeight: 600 }}>{label}</label>
      <div className="relative">
        <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? '0'} className="w-full px-3 py-2.5 border text-sm outline-none transition-colors focus:border-[#947231]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)', borderColor: 'rgba(200,172,120,0.2)', paddingRight: suffix ? '2.5rem' : '0.75rem' }} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: '#7a8a8e', fontFamily: '"Source Sans 3", sans-serif' }}>{suffix}</span>}
      </div>
    </div>
  );
}

function HamletSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="uppercase tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.16em', fontSize: 12, fontWeight: 600 }}>Hamlet</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2.5 border text-sm outline-none focus:border-[#947231]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)', borderColor: 'rgba(200,172,120,0.2)' }}>
        {MASTER_HAMLET_DATA.filter(h => h.id !== 'east-hampton-north').map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
      </select>
    </div>
  );
}

function RunButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full py-3 text-sm uppercase tracking-widest transition-colors hover:bg-[#947231] hover:text-[#1B2A4A]" style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#FAF8F4', letterSpacing: '0.2em' }}>
      Run Analysis
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
          <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.18em', fontSize: 10 }}>{result.hamletName} · {LENS_LABELS[result.lens]}</div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.25rem' }}>{result.address}</div>
        </div>
        <VerdictBadge verdict={result.verdict} />
      </div>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center border-2" style={{ borderColor: '#947231', background: 'rgba(200,172,120,0.08)' }}>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#947231', fontWeight: 700, fontSize: '1.75rem' }}>{result.score}</span>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          {[{ label: 'All-In Cost', value: result.allInDisplay }, { label: 'Exit Price', value: result.exitDisplay }, { label: 'Spread', value: result.spreadDisplay }, { label: 'Spread %', value: result.spreadPctDisplay }].map(item => (
            <div key={item.label}>
              <div className="uppercase mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.14em', fontSize: 11, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontWeight: 700, fontSize: '1.0625rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      {result.strategicClassification && (
        <div className="mb-5 px-4 py-3 border-l-2" style={{ borderColor: '#947231', background: 'rgba(200,172,120,0.08)' }}>
          <div className="uppercase text-[10px] mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.14em' }}>Strategic Classification</div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontSize: '0.9375rem' }}>{result.strategicClassification}</div>
        </div>
      )}
      {result.address.toLowerCase().includes('140 hands creek') && (
        <div className="mb-4 px-4 py-2 border-l-2" style={{ borderColor: '#947231', background: 'rgba(200,172,120,0.06)' }}>
          <div className="uppercase text-[9px] mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.18em' }}>Christie's Active Listing · Stewardship Analysis</div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.75)', fontSize: '0.8125rem', lineHeight: 1.5 }}>140 Hands Creek Road is a live Christie's East Hampton listing at $3,500,000. This analysis reflects current market stewardship intelligence for an active pipeline asset.</div>
        </div>
      )}
      <div className="mb-6 text-sm italic" style={{ fontFamily: '"Cormorant Garamond", serif', color: 'rgba(250,248,244,0.55)', lineHeight: 1.5 }}>"{ result.mentorLine}"</div>
      <div>
        <div className="uppercase text-[10px] mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.18em' }}>Export</div>
        <div className="flex flex-wrap gap-2">
          {exportTypes.map(exp => (
            <button key={exp.id} onClick={() => onExport(exp.id)} className="px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors hover:bg-[#947231] hover:text-[#1B2A4A] hover:border-[#947231]" style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: 'rgba(200,172,120,0.4)', color: 'rgba(250,248,244,0.8)', letterSpacing: '0.12em' }}>
              {exp.label}
            </button>
          ))}
        </div>
      </div>
      {/* WhatsApp CTA removed per Apr 22 directive */}
    </MatrixCard>
  );
}

function AnewBuildForm({ onResult }: { onResult: (r: AnewOutput) => void }) {
  const [hamletId, setHamletId] = useState('east-hampton-village');
  const [address, setAddress] = useState<string>(() => {
    try { return localStorage.getItem(LS_ADDRESS_KEY) || DEFAULT_ADDRESS; } catch { return DEFAULT_ADDRESS; }
  });
  const handleAddressChange = (v: string) => {
    setAddress(v);
    try { localStorage.setItem(LS_ADDRESS_KEY, v); } catch { /* ignore */ }
  };
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
      <div className="md:col-span-2"><TextInput label="Property Address" value={address} onChange={handleAddressChange} placeholder="140 Hands Creek Road, East Hampton" /></div>
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
  const [hamletId, setHamletId] = useState('east-hampton-village');
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


// ─── Layer 3 + 4: Eleven Hamlet Matrix + PDF Download ────────────────────────────

// ─── Hamlet Highlights: Selected-hamlet local intelligence module ────────────
// Spec: Apr 17 2026 dispatch — one card, updates on hamlet selection
// Data: Ponder-curated static JSON (hamlet-highlights.json)
// Placement: below ANEW Deal Engine

interface HamletHighlight {
  name: string;
  id: string;
  anchor: string;
  top_restaurant?: string;
  local_spot: string;
  secret: string;
  practical_note: string;
  market_signal?: string;
}

// D2 Apr 24 2026: east-hampton-north excluded from public hamlet highlights — ten canonical hamlets only
const HAMLET_HIGHLIGHTS: HamletHighlight[] = (hamletHighlightsData as { hamlets: HamletHighlight[] }).hamlets.filter(h => h.id !== 'east-hampton-north');

function HamletHighlightCard({ highlight }: { highlight: HamletHighlight }) {
  const hamletData = MASTER_HAMLET_DATA.find(h => h.id === highlight.id);
  const photo = hamletData?.imageUrl || hamletData?.photo || '';

  return (
    <FloatingCard style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Photo */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0 }}>
        {photo ? (
          <img src={photo} alt={highlight.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1B2A4A' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 35%, rgba(13,21,32,0.88) 100%)' }} />
        
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.2 }}>{highlight.name}</div>
        </div>
      </div>
      {/* Card body */}
      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ borderLeft: '2px solid #947231', paddingLeft: 10 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.18em', fontSize: 8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Anchor</div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontSize: '0.78rem', lineHeight: 1.55 }}>{highlight.anchor}</div>
        </div>
        {highlight.top_restaurant && (
          <div style={{ borderLeft: '2px solid rgba(200,172,120,0.55)', paddingLeft: 10 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.18em', fontSize: 8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Restaurant</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.82)', fontSize: '0.78rem', lineHeight: 1.55 }}>{highlight.top_restaurant}</div>
          </div>
        )}
        <div style={{ borderLeft: '2px solid rgba(200,172,120,0.4)', paddingLeft: 10 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.18em', fontSize: 8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Local Spot</div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.82)', fontSize: '0.78rem', lineHeight: 1.55 }}>{highlight.local_spot}</div>
        </div>
        <div style={{ borderLeft: '2px solid rgba(200,172,120,0.2)', paddingLeft: 10 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.18em', fontSize: 8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Secret</div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.88)', fontSize: '0.78rem', lineHeight: 1.55, fontStyle: 'italic' }}>{highlight.secret}</div>
        </div>
        <div style={{ background: 'rgba(250,248,244,0.04)', padding: '8px 10px', borderTop: '1px solid rgba(200,172,120,0.12)', marginTop: 'auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.6)', letterSpacing: '0.16em', fontSize: 8, textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Practical Note</div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.82)', fontSize: '0.74rem', lineHeight: 1.55 }}>{highlight.practical_note}</div>
        </div>
      </div>
    </FloatingCard>
  );
}
function HamletHighlightsModule() {
  return (
    <div style={{ background: 'transparent', padding: '0 24px 32px' }}>
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        {/* Section header */}
        <div className="px-0 py-6 border-b" style={{ borderColor: 'rgba(200,172,120,0.2)' }}>
          <div className="uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>Local Intelligence</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.5rem', margin: 0 }}>Hamlet Highlights</h2>
          <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: '0.78rem', marginTop: 6, marginBottom: 0 }}>Ten canonical hamlets · Anchor · Restaurant · Local Spot · Secret · Practical Note</p>
        </div>
        {/* 10-card grid */}
        <div className="py-8">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {HAMLET_HIGHLIGHTS.map(h => (
              <HamletHighlightCard key={h.id} highlight={h} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HamletMatrixCard({ hamlet, onExpand, isExpanded, liveListings }: { hamlet: HamletData; onExpand: () => void; isExpanded: boolean; liveListings: Record<string, LiveListing[]> }) {
  const hamletListings = liveListings[hamlet.id] || [];
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    const toastId = toast.loading(`Generating ${hamlet.name} PDF…`);
    try {
      // Lane 6: captureToPdf replaces bespoke generateMarketReport
      const el = document.getElementById(`hamlet-card-${hamlet.id}`);
      if (el) await captureToPdf(el, `christies-${hamlet.id}-report.pdf`);
      else toast.info('Capture element not found — scroll to hamlet and try again.');
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
        background: isExpanded ? 'rgba(27,42,74,0.9)' : 'rgba(13,27,42,0.65)',
        border: `1px solid ${isExpanded ? '#947231' : 'rgba(200,172,120,0.15)'}`,
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
          <div style={{ position: 'absolute', top: 8, right: 8, background: '#947231', color: '#1B2A4A', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', fontWeight: 700 }}>
            {hamletListings.length} ACTIVE
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 12px' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.05rem', marginBottom: 6 }}>
          {hamlet.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Median</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontWeight: 600, fontSize: '0.9rem' }}>{hamlet.medianPriceDisplay}</div>
          </div>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>Vol Share</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontWeight: 600, fontSize: '0.9rem' }}>{hamlet.volumeShare}%</div>
          </div>
        </div>

        {/* Live listing preview — shows first listing address if available */}
        {hamletListings.length > 0 && (
          <div style={{ marginBottom: 8, padding: '8px 10px', background: isExpanded ? 'rgba(200,172,120,0.1)' : 'rgba(27,42,74,0.04)', borderLeft: '2px solid #947231' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>Top Listing</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hamletListings[0].address}</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#947231', fontSize: '0.72rem', fontWeight: 700 }}>{hamletListings[0].price}</div>
          </div>
        )}
        
        {/* PDF download button — Layer 4 */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-1.5 text-[10px] uppercase tracking-widest border transition-colors"
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            borderColor: '#947231',
            color: '#947231',
            background: 'transparent',
            letterSpacing: '0.16em',
            opacity: downloading ? 0.6 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#947231'; e.currentTarget.style.color = '#1B2A4A'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isExpanded ? '#947231' : '#1B2A4A'; }}
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
    <div ref={panelRef} style={{ background: 'rgba(13,27,42,0.92)', borderTop: `3px solid ${tierColor}` }}>
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
            { label: 'Share of Hamptons Dollar Volume', value: `${hamlet.volumeShare}%` },
            { label: 'Last Zillow Sale', value: hamlet.lastSalePrice },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '14px 16px', background: 'rgba(13,27,42,0.7)', border: '1px solid rgba(200,172,120,0.15)' }}>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.14em', fontSize: 9.5, textTransform: 'uppercase', marginBottom: 5 }}>{stat.label}</div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.2rem' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {hamlet.vibeText && (
          <div style={{ marginBottom: 28, padding: '18px 20px', background: 'rgba(13,27,42,0.7)', border: '1px solid rgba(200,172,120,0.15)', borderLeft: '3px solid #947231' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 8 }}>Character</div>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1.05rem', lineHeight: 1.65, margin: 0 }}>{hamlet.vibeText}</p>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <div style={{ padding: '14px 16px', background: 'rgba(13,27,42,0.7)', border: '1px solid rgba(200,172,120,0.15)', display: 'inline-block', minWidth: 260 }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.14em', fontSize: 9.5, textTransform: 'uppercase', marginBottom: 5 }}>Last Zillow Sale</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', fontSize: '0.88rem', fontWeight: 600 }}>{hamlet.lastSale}</div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)', fontSize: '0.82rem', marginTop: 2 }}>{hamlet.lastSalePrice} · {hamlet.lastSaleDate}</div>
          </div>
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>Dining</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
            {[
              { tier: 'Anchor', value: hamlet.restaurants.anchor },
              { tier: 'Mid', value: hamlet.restaurants.mid },
              { tier: 'Local', value: hamlet.restaurants.local },
            ].map(r => (
              <div key={r.tier} style={{ padding: '12px 14px', background: 'rgba(13,27,42,0.7)', border: '1px solid rgba(200,172,120,0.15)' }}>
                <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.14em', fontSize: 9, textTransform: 'uppercase', marginBottom: 4 }}>{r.tier}</div>
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: r.value === 'TBD' ? 'rgba(250,248,244,0.4)' : '#FAF8F4', fontSize: '0.85rem', fontWeight: 600, fontStyle: r.value === 'TBD' ? 'italic' : 'normal' }}>
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
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>Active Listings</div>
              {realListings.length === 0 ? (
                <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.82rem', fontStyle: 'italic', padding: '10px 0' }}>No active listings at this time.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                  {realListings.map((listing, i) => (
                    <a key={i} href={listing.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px 16px', background: 'rgba(13,27,42,0.7)', border: '1px solid rgba(200,172,120,0.15)', textDecoration: 'none', transition: 'border-color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#947231')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(200,172,120,0.15)')}>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '0.95rem', marginBottom: 4 }}>{listing.address}</div>
                      <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#947231', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{listing.price}</div>
                      <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{listing.beds} BD · {listing.baths} BA · {listing.sqft} SF</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 12 }}>News &amp; Coverage</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <a href={hamlet.zillowUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', border: '1px solid rgba(200,172,120,0.4)', color: '#947231', textDecoration: 'none', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,172,120,0.1)'; e.currentTarget.style.color = '#FAF8F4'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#947231'; }}>
              Zillow Market
            </a>
            {hamlet.newsLinks.map(link => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px', border: '1px solid rgba(200,172,120,0.3)', color: 'rgba(250,248,244,0.7)', textDecoration: 'none', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,172,120,0.1)'; e.currentTarget.style.color = '#FAF8F4'; e.currentTarget.style.borderColor = '#947231'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(250,248,244,0.7)'; e.currentTarget.style.borderColor = 'rgba(200,172,120,0.3)'; }}>
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

// --- Task 8 : Neighborhood Card Link (orphan surfacing) ---
function NeighborhoodCardLink() {
  const [, navigate] = useLocation();
  return (
    <div style={{
      maxWidth: 'var(--frame-max-w)',
      margin: '0 auto',
      padding: '0 24px 32px',
    }}>
      <div style={{
        padding: '16px 20px',
        border: '1px solid rgba(148,114,49,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: 'rgba(27,42,74,0.4)',
      }}>
        <div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#947231', marginBottom: 4 }}>
            Client Resource
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#ebe6db', fontWeight: 400, fontSize: '0.95rem' }}>
            Neighborhood Card
          </div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(235,230,219,0.7)', fontSize: '0.78rem', marginTop: 3 }}>
            East Hampton hamlet guide — bike routes, landmarks, and local intelligence.
          </div>
        </div>
        <button
          onClick={() => navigate('/cards/bike')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(148,114,49,0.5)',
            color: '#947231',
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '7px 16px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Open Card
        </button>
      </div>
    </div>
  );
}

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
    <div style={{ background: 'transparent', minHeight: '100vh' }}>

      {/* ── Layer 1: Paumanok Aerial Plate (static, no zoom) ─────────────────── */}
      <div className="px-6" style={{ background: 'transparent' }}>
        <div className="mx-auto" style={{ maxWidth: 'var(--frame-max-w)' }}>
          <PaumanokPlate />
        </div>
      </div>
      

      {/* ── ANEW Deal Engine — reordered Apr 22 2026: Map → Deal Engine → Hamlet Highlights ─── */}
      <div style={{ padding: '0 24px', maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
        <GoldBlackFrame style={{ marginBottom: 0 }}>
          <ANEWDealEngine />
        </GoldBlackFrame>
      </div>

      {/* ── Hamlet Highlights: Local intelligence module (Apr 17 2026 dispatch) ─── */}
      <HamletHighlightsModule />
      {/* Layer 3: Hamlet Intelligence Matrix grid removed per Perp dispatch Apr 17 2026 */}
      {/* Map + Deal Engine + PDF download buttons in HamletDetailPanel are preserved */}

      {/* Task 8 · Orphan asset link — Neighborhood Card */}
      <NeighborhoodCardLink />

      {/* ── Layer 4 + 5: Hamlet Detail Panel + Print Output ────────────────── */}
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
