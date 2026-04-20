import { useState, useMemo } from 'react';

/**
 * Operator Control Panel — FUTURE tab
 * Five adjustable inputs drive an 11-year proforma tied to Growth Model v2.
 * Source: Growth Model v2 OUTPUTS tab · ID 1jR_sO3t7YoKjUlDQpSvZ7hbFNQVg2BD6J4Sqd14z0Ag
 * Verified: April 20, 2026
 */

const EH_VOL = [75.0, 125.9, 211.4, 354.8, 595.7, 1000.0, 1222.2, 1493.8, 1825.7, 2231.3, 2727.1];
const SH_VOL = [0, 0, 42.5, 102.0, 114.4, 117.3, 120.7, 124.9, 129.9, 135.8, 143.0];
const WH_VOL = [0, 0, 0, 0, 42.5, 102.0, 114.4, 117.3, 120.7, 124.9, 129.9];
const ED_PERSONAL_GROSS = [0.600, 1.800, 2.000, 2.200, 2.400, 2.600, 2.800, 3.000, 3.200, 3.400, 3.600];
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
    { label: 'Ed personal net (70% of gross)', data: calc.edNetPers },
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
