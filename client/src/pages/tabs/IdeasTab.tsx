/**
 * IDEAS TAB — ANEW Investment Calculator + Deal Intelligence Engine.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data/inputs) · Barlow Condensed (labels)
 *
 * Modes: ANEW Build · Buy & Hold · Buy Renovate & Hold · Buy & Rent
 * Exports: ANEW Build Memo · CMA · Deal Brief · Investment Memo (2pp) · Market Report (5pp)
 */

import { useState } from 'react';
import { MatrixCard } from '@/components/MatrixCard';
import { MASTER_HAMLET_DATA } from '@/data/hamlet-master';
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

// ─── Mode Card Definitions ────────────────────────────────────────────────────

const MODES: { lens: AnewLens; title: string; subtitle: string; icon: string }[] = [
  { lens: 'anew-build',        title: 'ANEW Build',           subtitle: 'Land + construction → exit price',          icon: '⬡' },
  { lens: 'buy-hold',          title: 'Buy & Hold',           subtitle: 'Acquisition → projected appreciation',       icon: '◈' },
  { lens: 'buy-renovate-hold', title: 'Buy, Renovate & Hold', subtitle: 'Acquisition + renovation → exit',            icon: '◇' },
  { lens: 'buy-rent',          title: 'Buy & Rent',           subtitle: 'Rental income + appreciation → total return', icon: '○' },
];

// ─── Verdict Badge ────────────────────────────────────────────────────────────

function VerdictBadge({ verdict }: { verdict: ReturnType<typeof getVerdict> }) {
  const map: Record<string, { bg: string; text: string }> = {
    'Institutional': { bg: '#1B2A4A', text: '#C8AC78' },
    'Executable':    { bg: '#C8AC78', text: '#1B2A4A' },
    'Marginal':      { bg: '#e07b39', text: '#FAF8F4' },
    'Pass':          { bg: '#c0392b', text: '#FAF8F4' },
  };
  const style = map[verdict] ?? map['Pass'];
  return (
    <span
      className="px-3 py-1 text-xs uppercase tracking-widest"
      style={{ fontFamily: '"Barlow Condensed", sans-serif', background: style.bg, color: style.text, letterSpacing: '0.18em' }}
    >
      {verdict}
    </span>
  );
}

// ─── Shared Input Components ──────────────────────────────────────────────────

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
        {MASTER_HAMLET_DATA.map(h => <option key={h.id} value={h.id}>{h.name} — {h.tier}</option>)}
      </select>
    </div>
  );
}

function RunButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full py-3 text-sm uppercase tracking-widest transition-colors hover:bg-[#C8AC78] hover:text-[#1B2A4A]" style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#FAF8F4', letterSpacing: '0.2em' }}>
      Run ANEW Score
    </button>
  );
}

// ─── Results Panel ────────────────────────────────────────────────────────────

function ResultsPanel({ result, onExport }: { result: AnewOutput; onExport: (type: string) => void }) {
  const exportTypes = [
    { id: 'anew-memo', label: 'ANEW Build Memo' },
    { id: 'cma', label: 'CMA' },
    { id: 'deal-brief', label: 'Deal Brief' },
    { id: 'investment-memo', label: 'Investment Memo' },
    { id: 'market-report', label: 'Market Report' },
  ];
  return (
    <MatrixCard variant="navy" className="p-6">
      {/* PDF Export Header — Ed Bruehl headshot + CIREG logo (mirrors printed PDF header) */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[rgba(200,172,120,0.2)]">
        <div className="flex items-center gap-3">
          <img
            src={ED_HEADSHOT_PRIMARY}
            alt="Ed Bruehl — Managing Director"
            className="h-10 w-10 rounded-full object-cover object-top border border-[rgba(200,172,120,0.35)]"
          />
          <div>
            <div className="text-[var(--color-cream)] text-[0.8rem] font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Ed Bruehl</div>
            <div className="text-[rgba(200,172,120,0.7)] text-[0.6rem] uppercase tracking-[0.14em]" style={{ fontFamily: 'var(--font-condensed)' }}>Managing Director · Christie's East Hampton</div>
          </div>
        </div>
        <img
          src={LOGO_BLACK}
          alt="Christie's International Real Estate Group"
          className="h-5 w-auto opacity-80 brightness-0 invert"
        />
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
    </MatrixCard>
  );
}

// ─── Lens Forms ───────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IdeasTab() {
  const [activeLens, setActiveLens] = useState<AnewLens>('anew-build');
  const [result, setResult] = useState<AnewOutput | null>(null);

  const handleExport = (type: string) => {
    alert(`Export: ${type} — PDF generation will be wired in the next sprint.`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>
      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>ANEW Investment Intelligence</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>IDEAS Calculator</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>Select a lens, enter your numbers, and receive an institutional-grade ANEW score with strategic classification.</p>
      </div>

      {/* Mode Cards + Calculator */}
      <div className="px-6 py-8" style={{ background: '#FAF8F4' }}>
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>Select Lens</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {MODES.map(mode => (
              <button key={mode.lens} onClick={() => { setActiveLens(mode.lens); setResult(null); }} className="p-4 text-left border transition-all duration-200" style={{ background: activeLens === mode.lens ? '#1B2A4A' : '#fff', borderColor: activeLens === mode.lens ? '#C8AC78' : 'rgba(27,42,74,0.15)', borderLeftWidth: activeLens === mode.lens ? 3 : 1, borderLeftColor: activeLens === mode.lens ? '#C8AC78' : 'rgba(27,42,74,0.15)' }}>
                <div className="text-lg mb-2" style={{ color: activeLens === mode.lens ? '#C8AC78' : '#1B2A4A' }}>{mode.icon}</div>
                <div className="font-medium text-sm mb-1" style={{ fontFamily: '"Cormorant Garamond", serif', color: activeLens === mode.lens ? '#FAF8F4' : '#1B2A4A', fontWeight: 600, fontSize: '1rem' }}>{mode.title}</div>
                <div className="text-xs leading-snug" style={{ fontFamily: '"Source Sans 3", sans-serif', color: activeLens === mode.lens ? 'rgba(250,248,244,0.6)' : '#7a8a8e' }}>{mode.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>{LENS_LABELS[activeLens]}</div>
              <MatrixCard variant="default" className="p-6">
                {activeLens === 'anew-build'        && <AnewBuildForm onResult={setResult} />}
                {activeLens === 'buy-hold'          && <BuyHoldForm onResult={setResult} />}
                {activeLens === 'buy-renovate-hold' && <BuyRenovateHoldForm onResult={setResult} />}
                {activeLens === 'buy-rent'          && <BuyRentForm onResult={setResult} />}
              </MatrixCard>
            </div>

            {/* Results */}
            <div>
              <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>ANEW Score Output</div>
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
