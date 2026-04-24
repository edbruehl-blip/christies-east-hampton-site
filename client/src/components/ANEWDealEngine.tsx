/**
 * ANEW Deal Engine v1
 * Christie's East Hampton · MAPS Tab · Section below hamlet cards
 *
 * Six inputs. Two grades. One indication. One doctrine line.
 * F6.5h: “verdict” → “indication” throughout (trust language).
 * Live-wired to trpc.dealEngine.score — server runs all formulas.
 * Client is pure presentation (currency + percent formatters only).
 *
 * Soli Deo Gloria.
 */

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { captureToPdf } from '@/lib/capture-pdf';
import { trpc } from '@/lib/trpc';
import { MASTER_HAMLET_DATA } from '@/data/hamlet-master';

// ─── Typography constants (Christie's standard) ───────────────────────────────
const SERIF   = '"Cormorant Garamond", serif';
const SANS    = '"Source Sans 3", sans-serif';
const LABEL   = '"Barlow Condensed", sans-serif';
const GOLD    = '#947231';
const CREAM   = 'rgba(250,248,244,0.92)';
const MUTED   = 'rgba(250,248,244,0.45)';
const CARD_BG = 'rgba(13,27,42,0.72)';
const BORDER  = `1px solid rgba(148,114,49,0.28)`;

// ─── Hamlet list ──────────────────────────────────────────────────────────────
// Derive hamlet list from master data — single source of truth
const HAMLET_DATA_MAP = Object.fromEntries(
  MASTER_HAMLET_DATA.map(h => [h.name, h])
);
const HAMLETS = MASTER_HAMLET_DATA.map(h => h.name);

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmt$ = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US');

const fmtPct = (n: number | null) =>
  (n === null || !Number.isFinite(n)) ? '—' : (n * 100).toFixed(1) + '%';

// ─── Input field ─────────────────────────────────────────────────────────────
function InputField({
  label, value, onChange, prefix = '$', placeholder = '0',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  placeholder?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontFamily: LABEL, color: GOLD, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          fontFamily: SANS, color: MUTED, fontSize: '0.82rem', pointerEvents: 'none',
        }}>
          {prefix}
        </span>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            background: 'rgba(13,27,42,0.55)',
            border: '1px solid rgba(148,114,49,0.35)',
            borderRadius: 3,
            color: CREAM,
            fontFamily: SANS,
            fontSize: '0.88rem',
            padding: prefix === '$' ? '7px 10px 7px 22px' : '7px 10px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}

// ─── Output row ───────────────────────────────────────────────────────────────
function OutputRow({ label, value, accent, tooltip }: { label: string; value: string; accent?: boolean; tooltip?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '5px 0', borderBottom: '1px solid rgba(148,114,49,0.10)',
    }}>
      <span
        style={{ fontFamily: LABEL, color: MUTED, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: tooltip ? 'help' : 'default' }}
        title={tooltip}
      >
        {label}{tooltip && <span style={{ marginLeft: 3, opacity: 0.5, fontSize: 9 }}>ⓘ</span>}
      </span>
      <span style={{
        fontFamily: SANS, color: accent ? GOLD : CREAM,
        fontSize: '0.9rem', fontWeight: accent ? 600 : 400,
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ANEWDealEngine() {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  const [purchase,  setPurchase]  = useState('');
  const [addlCap,   setAddlCap]   = useState('');
  const [baseValue, setBaseValue] = useState('');
  const [rent,      setRent]      = useState('');
  const [holdYears, setHoldYears] = useState('10');
  const [holdYearsError, setHoldYearsError] = useState('');
  const dealRef = useRef<HTMLDivElement>(null);
  const [cocPct,    setCocPct]    = useState('0');
  const [hamlet,    setHamlet]    = useState('');
  const [dealName,  setDealName]  = useState('');

  // ── Pro Mode ─────────────────────────────────────────────────────────────────
  const [proOpen,       setProOpen]       = useState(false);
  const [appreciation,  setAppreciation]  = useState('5');
  const [expenseRatio,  setExpenseRatio]  = useState('35');

  // Pre-fill Pro Mode anchors from hamlet master data on hamlet select
  const handleHamletChange = useCallback((name: string) => {
    setHamlet(name);
    if (name && HAMLET_DATA_MAP[name]) {
      const hd = HAMLET_DATA_MAP[name];
      setAppreciation(String(Math.round(hd.appreciation * 100)));
      setExpenseRatio(String(Math.round(hd.expenseRatio * 100)));
    } else {
      // Reset to defaults when hamlet cleared
      setAppreciation('5');
      setExpenseRatio('35');
    }
  }, []);

  // ── Parse inputs ─────────────────────────────────────────────────────────────
  const p  = parseFloat(purchase)  || 0;
  const ac = parseFloat(addlCap)   || 0;
  const bv = parseFloat(baseValue) || 0;
  const r  = parseFloat(rent)      || 0;
  const _hy = parseFloat(holdYears);
  const hy = Number.isFinite(_hy) && _hy >= 1 ? _hy : 10;
  const cc = parseFloat(cocPct)    || 0;
  const _ap = parseFloat(appreciation);
  const ap = Number.isFinite(_ap) ? _ap / 100 : 0.05;
  const _er = parseFloat(expenseRatio);
  const er = Number.isFinite(_er) ? _er / 100 : 0.35;

  const ready = p > 0 && bv > 0;

  // ── tRPC query ────────────────────────────────────────────────────────────────
  const { data, isFetching } = trpc.dealEngine.score.useQuery(
    {
      purchase:     p,
      addlCap:      ac,
      baseValue:    bv,
      rent:         r,
      holdYears:    hy,
      cocPct:       cc,
      hamlet:       hamlet || undefined,
      appreciation: ap,
      expenseRatio: er,
    },
    { enabled: ready }
  );

  // ── PDF export ────────────────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (!dealRef.current || !data) return;
    const date = new Date().toISOString().slice(0, 10);
    const rawSlug = (dealName || 'deal').toLowerCase();
    const slug = rawSlug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const filename = `christies-anew-deal-memo-${slug}-${date}.pdf`;
    const outputPanel = dealRef.current.querySelector('[data-deal-output]') as HTMLElement | null;
    const target = outputPanel ?? dealRef.current;
    try {
      await captureToPdf(target, filename);
    } catch {
      toast.error('Export failed — please try again.');
    }
  }, [data, dealName]);

  // ── Reset handler ────────────────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setPurchase('');
    setAddlCap('');
    setBaseValue('');
    setRent('');
    setHoldYears('10');
    setCocPct('0');
    setHamlet('');
    setDealName('');
    setAppreciation('5');
    setExpenseRatio('35');
    setProOpen(false);
    toast.success('New property — all fields cleared.');
  }, []);

  // ── Stewardship color ─────────────────────────────────────────────────────────
  const stewardshipColor = (s?: string) => {
    if (s === 'Strong Hold') return '#947231';
    if (s === 'Hold')        return '#947231';
    if (s === 'Watch')       return 'rgba(250,248,244,0.6)';
    if (s === 'Pass')        return 'rgba(200,80,60,0.85)';
    return CREAM;
  };

  return (
    <div style={{
      background: 'transparent',
      borderTop: `1px solid rgba(148,114,49,0.25)`,
      paddingBottom: 48,
    }}>
      {/* ── Section header ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto', padding: '32px 24px 20px' }}>
        <div style={{ fontFamily: LABEL, color: GOLD, letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
          ANEW Deal Engine
        </div>
        <h3 style={{ fontFamily: SERIF, color: CREAM, fontWeight: 400, fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', margin: 0 }}>
          ANEW Deal Engine
        </h3>
        <p style={{ fontFamily: SANS, color: MUTED, fontSize: '0.78rem', marginTop: 5, marginBottom: 0 }}>
          Six inputs. Two grades. One indication.
        </p>
      </div>

      {/* ── Main card ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: CARD_BG, border: BORDER, borderRadius: 6, padding: '24px 28px' }}>

          {/* Deal name + hamlet row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: LABEL, color: GOLD, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Deal Address / Name
              </div>
              <input
                type="text"
                value={dealName}
                onChange={e => setDealName(e.target.value)}
                placeholder="17 Lenape Road"
                style={{
                  background: 'rgba(13,27,42,0.55)',
                  border: '1px solid rgba(148,114,49,0.35)',
                  borderRadius: 3,
                  color: CREAM,
                  fontFamily: SANS,
                  fontSize: '0.88rem',
                  padding: '7px 10px',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: LABEL, color: GOLD, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Hamlet / Area (optional)
              </div>
              <select
                value={hamlet}
                onChange={e => handleHamletChange(e.target.value)}
                style={{
                  background: 'rgba(13,27,42,0.55)',
                  border: '1px solid rgba(148,114,49,0.35)',
                  borderRadius: 3,
                  color: hamlet ? CREAM : MUTED,
                  fontFamily: SANS,
                  fontSize: '0.88rem',
                  padding: '7px 10px',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="">— Select hamlet —</option>
                {HAMLETS.map(h => (
                  <option key={h} value={h} style={{ background: '#0D1B2A', color: CREAM }}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Six inputs grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            <InputField label="1. Purchase Price ($)" value={purchase} onChange={setPurchase} />
            <InputField label="2. Additional Capital ($)" value={addlCap} onChange={setAddlCap} />
            <InputField label="3. Base Value — Your Estimate ($)" value={baseValue} onChange={setBaseValue} />
            <InputField label="4. Annual Rent Gross ($)" value={rent} onChange={setRent} />
            <InputField label="5. Hold Period (years)" value={holdYears} onChange={setHoldYears} prefix="" placeholder="10" />
            <InputField label="6. Blended Cost of Capital (%)" value={cocPct} onChange={setCocPct} prefix="%" placeholder="0" />
          </div>

          {/* Pro Mode toggle */}
          <div style={{ marginBottom: proOpen ? 16 : 0 }}>
            <button
              onClick={() => setProOpen(o => !o)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(148,114,49,0.3)',
                borderRadius: 3,
                color: GOLD,
                fontFamily: LABEL,
                fontSize: 9,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                cursor: 'pointer',
              }}
            >
              {proOpen ? '▲ Close Pro Mode' : '▼ Pro Mode — Edit Anchors'}
            </button>
          </div>

          {/* Pro Mode drawer */}
          {proOpen && (
            <div style={{
              background: 'rgba(13,27,42,0.45)',
              border: '1px solid rgba(148,114,49,0.18)',
              borderRadius: 4,
              padding: '16px 20px',
              marginBottom: 20,
            }}>
              <div style={{ fontFamily: LABEL, color: GOLD, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
                Hardcoded Anchors — Editable Here
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                <InputField label="Appreciation (%/year)" value={appreciation} onChange={setAppreciation} prefix="%" placeholder="5" />
                <InputField label="Expense Ratio (%)" value={expenseRatio} onChange={setExpenseRatio} prefix="%" placeholder="35" />
              </div>
              <div style={{ marginTop: 10, fontFamily: SANS, color: MUTED, fontSize: '0.72rem', lineHeight: 1.5 }}>
                Locked defaults: Short-term tax 46% · Long-term tax 35% · Sell costs 8% · Floor ×0.90 · Stretch ×1.10
              </div>
            </div>
          )}

          {/* Output panel */}
          {ready && (
            <div style={{
              marginTop: 24,
              borderTop: `1px solid rgba(148,114,49,0.25)`,
              paddingTop: 20,
            }}>
              {/* Output header */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: SERIF, color: CREAM, fontSize: '1.05rem', fontWeight: 400 }}>
                  {dealName || 'Deal Analysis'}
                  {hamlet && (
                    <span style={{ fontFamily: SANS, color: GOLD, fontSize: '0.8rem', marginLeft: 10 }}>
                      · {hamlet}
                    </span>
                  )}
                </div>
              </div>

              {isFetching ? (
                <div style={{ fontFamily: SANS, color: MUTED, fontSize: '0.82rem', padding: '12px 0' }}>
                  Computing…
                </div>
              ) : data ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  {/* Left column */}
                  <div>
                    <OutputRow label="All-In Basis"    value={fmt$(data.basis)} />
                    <OutputRow label="Equity Day One"  value={`${fmt$(data.equity)}   (${fmtPct(data.equityPct)})`} />
                    <div style={{ height: 8 }} />
                    <OutputRow label="NOI"             value={fmt$(data.noi)} />
                    <OutputRow label="Cap Rate"        value={fmtPct(data.capRate)} />
                    <div style={{ height: 8 }} />
                    <OutputRow label="Income Grade"    value={data.incomeGrade} accent />
                    <OutputRow label="Basis Grade"     value={data.basisGrade}  accent />
                    <div style={{ height: 8 }} />
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      padding: '6px 0', borderBottom: '1px solid rgba(148,114,49,0.10)',
                    }}>
                      <span style={{ fontFamily: LABEL, color: MUTED, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        Stewardship
                      </span>
                      <span style={{ fontFamily: SANS, color: stewardshipColor(data.stewardship), fontSize: '0.95rem', fontWeight: 700 }}>
                        {data.stewardship}
                      </span>
                    </div>
                    {/* Deal type — renders blank slot if 5-5.9% cap (non-breaking space) */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      padding: '5px 0', borderBottom: '1px solid rgba(148,114,49,0.10)',
                    }}>
                      <span style={{ fontFamily: LABEL, color: MUTED, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        Deal Type
                      </span>
                      <span style={{ fontFamily: SANS, color: CREAM, fontSize: '0.9rem' }}>
                        {data.dealType || '\u00A0'}
                      </span>
                    </div>
                    <div style={{ height: 8 }} />
                    <OutputRow
                      label="Cash-on-Cash Return"
                      value={fmtPct(data.coc)}
                      tooltip="Annual cash flow divided by total equity invested. Institutional standard per JPMorgan/Bloomberg methodology. Displays — when equity is negative or zero."
                    />
                  </div>

                  {/* Right column */}
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontFamily: LABEL, color: MUTED, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
                        10-Yr Value
                      </div>
                      <div style={{ fontFamily: SANS, color: CREAM, fontSize: '0.9rem' }}>
                        {fmt$(data.tenYrValue.base)} <span style={{ color: MUTED, fontSize: '0.78rem' }}>(Base)</span>
                      </div>
                      <div style={{ fontFamily: SANS, color: MUTED, fontSize: '0.78rem', marginTop: 3 }}>
                        Floor {fmt$(data.tenYrValue.floor)} · Stretch {fmt$(data.tenYrValue.stretch)}
                      </div>
                    </div>
                    <div style={{ height: 12 }} />
                    <div style={{ fontFamily: LABEL, color: MUTED, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>
                      After-Tax Outcome
                    </div>
                    <OutputRow label="Sell Now"        value={fmt$(data.sellNowAfterTax)} />
                    <OutputRow label="Hold 10 Years"   value={fmt$(data.hold10yrAfterTax)} accent />
                    <div style={{ height: 12 }} />
                    <div style={{ fontFamily: SANS, color: MUTED, fontSize: '0.72rem', lineHeight: 1.55 }}>
                      Tax assumption: {(data.taxShortTerm * 100).toFixed(0)}% short-term · {(data.taxLongTerm * 100).toFixed(0)}% long-term
                    </div>
                    <div style={{ height: 8 }} />
                    <div style={{
                      borderTop: `1px solid rgba(148,114,49,0.2)`,
                      paddingTop: 10,
                      fontFamily: SANS,
                      color: GOLD,
                      fontSize: '0.78rem',
                      fontStyle: 'italic',
                    }}>
                      Default: Hold. Sell only if redeployment beats compounding.
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Export button */}
              {data && (
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleExport}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${GOLD}`,
                      borderRadius: 3,
                      color: GOLD,
                      fontFamily: LABEL,
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      padding: '8px 20px',
                      cursor: 'pointer',
                    }}
                  >
                    Export ANEW Deal Memo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
