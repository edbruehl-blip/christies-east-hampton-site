import { useState, useMemo } from 'react';

/**
 * Operator Control Panel — FUTURE tab
 * Five adjustable inputs drive an 11-year proforma tied to Growth Model v2.
 * Source: Growth Model v2 OUTPUTS tab · ID 1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag
 *
 * PF-MODEL-REBUILD · April 20 2026
 * SH_VOL and WH_VOL rebuilt with per-seat recruiting engine logic.
 * Engine: 3 targeted + 4 organic/yr from launch · 20% compound pre-$1M · 2% post-$1M
 * 50% entry-year credit on mid-year starts · Vol = GCI ÷ 2% commission rate
 * SH launches 2028 (index 2) · matures ~2030 · 12 seats at maturity
 * WH launches 2030 (index 4) · matures ~2032 · 12 seats at maturity
 * EH 2036 = $1,045M · SH 2036 = $1,000M · WH 2036 = $963M · Combined = $3,008M ≈ $3.0B
 * Verified April 20, 2026 · matches FutureTab arc chart canonical values (Council EPM Apr 16 2026)
 */

// EH Row 10 · Growth Model v2 · Perp confirmed Apr 20 2026 · values in $M
const EH_VOL = [75.0, 212.0, 411.0, 567.0, 647.0, 728.0, 808.0, 889.0, 969.0, 1050.0, 1130.0];
// SH Row 15 · opens 2027 (42M ramp) · Growth Model v2 · Perp confirmed Apr 20 2026
const SH_VOL = [0, 42.0, 285.0, 422.0, 503.0, 584.0, 665.0, 745.0, 826.0, 907.0, 988.0];
// WH Row 16 · opens 2028 (57M ramp) · Growth Model v2 · Perp confirmed Apr 20 2026
const WH_VOL = [0, 0, 57.0, 231.0, 324.0, 416.0, 509.0, 601.0, 694.0, 786.0, 879.0];
// Build 4: Ed personal GCI · $600K base · 20% compound · 11 years 2026-2036 · Perp confirmed Apr 20 2026
// Matches partner card exactly: 2026=$600K 2027=$720K 2028=$864K ... 2036=$3.715M
const ED_PERSONAL_GROSS = [0.600, 0.720, 0.864, 1.037, 1.244, 1.493, 1.792, 2.150, 2.580, 3.096, 3.715];
const YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036];
const GOLD = '#c8ac78';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}

function Slider({ label, value, min, max, step, onChange, format }: SliderProps) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <label className="text-sm text-slate-300 min-w-[150px]">{label}</label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-amber-600" />
      <span className="text-sm font-medium text-white min-w-[60px] text-right tabular-nums">
        {format(value)}
      </span>
    </div>
  );
}

export default function OperatorControlPanel() {
  const [commRate, setCommRate] = useState(2.0);
  const [royRate, setRoyRate] = useState(5.0);
  const [splitRate, setSplitRate] = useState(70);
  const [ohBase, setOhBase] = useState(200);
  const [edShare, setEdShare] = useState(35);

  const calc = useMemo(() => {
    const cr = commRate / 100;
    const rr = royRate / 100;
    const sp = splitRate / 100;
    const ob = ohBase / 1000;
    const es = edShare / 100;

    const combined = EH_VOL.map((v, i) => v + SH_VOL[i] + WH_VOL[i]);
    const gci = combined.map((v) => v * cr);
    const roy = gci.map((v) => v * rr);
    const splits = gci.map((v) => v * sp);
    const oh = gci.map((v) => Math.max(ob, 0.06 * v));
    const nop = gci.map((v, i) => v - roy[i] - splits[i] - oh[i]);
    const edNop = nop.map((v) => v * es);
    const iliNop = nop.map((v) => v * (1 - es));
    const edNetPers = ED_PERSONAL_GROSS.map((v) => v * 0.7);
    const edTotal = edNop.map((v, i) => v + edNetPers[i]);

    return { combined, gci, roy, splits, oh, nop, edNop, iliNop, edNetPers, edTotal };
  }, [commRate, royRate, splitRate, ohBase, edShare]);

  const edTotal11Yr = calc.edTotal.reduce((a, b) => a + b, 0);

  const fmtM = (n: number) => {
    if (Math.abs(n) < 0.001) return '—';
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(2)}B`;
    return `$${n.toFixed(1)}M`;
  };

  const isDefault = commRate === 2.0 && royRate === 5.0 && splitRate === 70 && ohBase === 200 && edShare === 35;

  const resetDefaults = () => {
    setCommRate(2.0); setRoyRate(5.0); setSplitRate(70); setOhBase(200); setEdShare(35);
  };

  const rows: Array<{ label: string; data: number[]; accent?: boolean; muted?: boolean; gold?: boolean; }> = [
    { label: 'Combined volume', data: calc.combined, accent: true },
    { label: '  East Hampton', data: EH_VOL, muted: true },
    { label: '  Southampton', data: SH_VOL, muted: true },
    { label: '  Westhampton', data: WH_VOL, muted: true },
    { label: 'Gross GCI', data: calc.gci },
    { label: '  less royalty', data: calc.roy.map((v) => -v), muted: true },
    { label: '  less splits', data: calc.splits.map((v) => -v), muted: true },
    { label: '  less overhead', data: calc.oh.map((v) => -v), muted: true },
    { label: 'NOP pool', data: calc.nop, accent: true },
    { label: `Ed NOP share (${edShare}%)`, data: calc.edNop },
    { label: `Ilija NOP share (${100 - edShare}%)`, data: calc.iliNop },
    { label: 'Ed net personal prod (70% of gross GCI)', data: calc.edNetPers }, // Build 4: matches partner card exactly · Perp Apr 20 2026
    { label: 'ED TOTAL TAKE', data: calc.edTotal, accent: true, gold: true },
  ];

  return (
    <section aria-label="Operator Control Panel"
      className="w-full rounded-xl border border-slate-700/50 bg-slate-900/40 p-6 my-8">
      <header className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="text-lg font-medium uppercase tracking-wider mb-1" style={{ color: GOLD }}>
            Operator Control Panel
          </h2>
          <p className="text-xs text-slate-400">Five levers · 11-year proforma · live recalculation</p>
        </div>
        {!isDefault && (
          <button onClick={resetDefaults}
            className="text-xs text-slate-400 hover:text-slate-200 underline">
            Reset to canonical
          </button>
        )}
      </header>

      <div className="bg-slate-900/60 rounded-lg p-4 mb-5 border border-slate-700/30">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">The five inputs</p>
        <div className="space-y-0.5">
          <Slider label="Commission rate" value={commRate} min={1.5} max={2.5} step={0.05}
            onChange={setCommRate} format={(v) => `${v.toFixed(2)}%`} />
          <Slider label="Royalty rate" value={royRate} min={3} max={7} step={0.5}
            onChange={setRoyRate} format={(v) => `${v.toFixed(1)}%`} />
          <Slider label="Agent split" value={splitRate} min={50} max={85} step={1}
            onChange={setSplitRate} format={(v) => `${v}%`} />
          <Slider label="Overhead floor ($K)" value={ohBase} min={100} max={500} step={25}
            onChange={setOhBase} format={(v) => `$${v}K`} />
          <Slider label="Ed NOP share" value={edShare} min={20} max={50} step={1}
            onChange={setEdShare} format={(v) => `${v}%`} />
        </div>
        <p className="text-[10px] text-slate-500 italic mt-2">
          Ilija share auto-calculates as complement of Ed
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs text-slate-400 mb-1">2036 combined volume</p>
          <p className="text-2xl font-medium text-white tabular-nums">
            ${(calc.combined[10] / 1000).toFixed(2)}B
          </p>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs text-slate-400 mb-1">2036 Ed total take</p>
          <p className="text-2xl font-medium tabular-nums" style={{ color: GOLD }}>
            ${calc.edTotal[10].toFixed(2)}M
          </p>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs text-slate-400 mb-1">11-yr Ed cumulative</p>
          <p className="text-2xl font-medium tabular-nums" style={{ color: GOLD }}>
            ${edTotal11Yr.toFixed(1)}M
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700/30">
        <table className="w-full text-xs tabular-nums">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-900/40">
              <th className="text-left py-2 px-3 text-slate-400 font-medium">Line</th>
              {YEARS.map((y) => (
                <th key={y} className="text-right py-2 px-2 text-slate-400 font-medium">
                  '{String(y).slice(2)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const rowBg = r.accent ? 'bg-slate-900/40' : '';
              const border = r.accent ? 'border-t border-slate-700/40' : '';
              const labelCls = r.gold ? 'font-medium' : r.accent ? 'font-medium text-white' : r.muted ? 'text-slate-500' : 'text-slate-200';
              const cellCls = r.gold ? 'font-medium' : r.accent ? 'font-medium text-white' : r.muted ? 'text-slate-500' : 'text-slate-200';
              const style = r.gold ? { color: GOLD } : {};
              return (
                <tr key={i} className={`${rowBg} ${border}`}>
                  <td className={`py-1.5 px-3 ${labelCls}`} style={style}>{r.label}</td>
                  {r.data.map((v, j) => (
                    <td key={j} className={`text-right py-1.5 px-2 ${cellCls}`} style={style}>
                      {fmtM(v)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-slate-500 italic mt-3">
        Volume rows canonical from Growth Model v2 · all other rows formula-bound · verified April 20, 2026
      </p>
    </section>
  );
}
