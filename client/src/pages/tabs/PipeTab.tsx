/**
 * PIPE TAB — Daily driver pipeline. Editable rows, add/filter, status indicators.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 *
 * Council brief Mar 29 2026:
 *   - Table or row-based layout
 *   - Editable rows
 *   - Columns: Name/Address · Type · Status · Notes · Value
 *   - Add Row button · Search/filter bar · Status indicators
 *   - MatrixCard styling
 *   - DO NOT connect to Google Sheets yet — UI only
 *   - Build it like something that will actually be used every morning
 */

import { useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

// Locked type list — Mar 29 2026
type PipeType = 'Deal' | 'Listing' | 'Buyer' | 'Seller' | 'Attorney' | 'Developer' | 'Referral' | 'Press' | 'Other';
type PipeStatus = 'Active' | 'Watch' | 'Critical' | 'Stalled' | 'Closed' | 'Dead';

interface PipeRow {
  id: string;
  address: string;
  hamlet: string;
  type: PipeType;
  status: PipeStatus;
  value: string;
  dom: number | null;
  notes: string;
  updatedAt: string;
}

// ─── Seed data — real pipeline entries from production ───────────────────────

const SEED_ROWS: PipeRow[] = [
  { id: '1', address: '11 Meadowlark Lane', hamlet: 'East Hampton', type: 'Deal', status: 'Critical', value: '$4,250,000', dom: 137, notes: 'Call before 10 AM Saturday — repositioning required', updatedAt: 'Mar 27' },
  { id: '2', address: '795 N. Sea Mecox Road', hamlet: 'Water Mill', type: 'Buyer', status: 'Critical', value: '$6,800,000', dom: 137, notes: 'Paired with Meadowlark — simultaneous strategy review', updatedAt: 'Mar 27' },
  { id: '3', address: '140 Hands Creek Road', hamlet: 'East Hampton', type: 'Deal', status: 'Critical', value: '$3,575,000', dom: 99, notes: '5–8% repositioning — first call priority', updatedAt: 'Mar 27' },
  { id: '4', address: '18 Tara Road', hamlet: 'East Hampton', type: 'Listing', status: 'Watch', value: '$2,995,000', dom: 82, notes: 'Brief before Monday', updatedAt: 'Mar 26' },
  { id: '5', address: '25 Horse Meadow Lane', hamlet: 'Bridgehampton', type: 'Listing', status: 'Watch', value: '$5,100,000', dom: 68, notes: 'WATCH tier', updatedAt: 'Mar 25' },
  { id: '6', address: '3 Sycamore Way', hamlet: 'Southampton Village', type: 'Listing', status: 'Active', value: '$3,200,000', dom: 52, notes: 'Monitor — approaching WATCH threshold', updatedAt: 'Mar 24' },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PipeStatus, { bg: string; color: string; dot: string }> = {
  'Active':   { bg: 'rgba(200,172,120,0.12)', color: '#8a6f3e', dot: '#C8AC78' },
  'Watch':    { bg: 'rgba(224,123,57,0.12)',  color: '#9a5a20', dot: '#e07b39' },
  'Critical': { bg: 'rgba(192,57,43,0.12)',   color: '#8b2515', dot: '#c0392b' },
  'Stalled':  { bg: 'rgba(120,138,142,0.12)', color: '#4a5a5e', dot: '#7a8a8e' },
  'Closed':   { bg: 'rgba(27,42,74,0.08)',    color: '#1B2A4A', dot: '#1B2A4A' },
  'Dead':     { bg: 'rgba(180,180,180,0.1)',  color: '#aaa',    dot: '#ccc' },
};

const TYPE_OPTIONS: PipeType[] = ['Deal', 'Listing', 'Buyer', 'Seller', 'Attorney', 'Developer', 'Referral', 'Press', 'Other'];
const STATUS_OPTIONS: PipeStatus[] = ['Active', 'Watch', 'Critical', 'Stalled', 'Closed', 'Dead'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function today() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StatusPill({ status }: { status: PipeStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 9px', fontSize: '0.68rem',
      fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.1em',
      textTransform: 'uppercase', fontWeight: 700,
      background: cfg.bg, color: cfg.color, borderRadius: 2,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function DomBar({ dom }: { dom: number }) {
  const pct = Math.min((dom / 150) * 100, 100);
  const color = dom >= 90 ? '#c0392b' : dom >= 45 ? '#e07b39' : '#C8AC78';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(27,42,74,0.1)', borderRadius: 2 }}>
        <div style={{ height: '100%', borderRadius: 2, width: `${pct}%`, background: color, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', color, fontWeight: 700, minWidth: 28, textAlign: 'right' }}>
        {dom}d
      </span>
    </div>
  );
}

// ─── Inline editable cell ─────────────────────────────────────────────────────

function EditCell({
  value, onChange, placeholder, style,
}: { value: string; onChange: (v: string) => void; placeholder?: string; style?: React.CSSProperties }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: 'transparent', border: 'none', outline: 'none',
        fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.85rem', color: '#384249',
        padding: '2px 0', ...style,
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PipeTab() {
  const [rows, setRows] = useState<PipeRow[]>(SEED_ROWS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<PipeStatus | 'All'>('All');
  const [filterType, setFilterType] = useState<PipeType | 'All'>('All');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Summary counts
  const critical = rows.filter(r => r.status === 'Critical').length;
  const watch     = rows.filter(r => r.status === 'Watch').length;
  const active    = rows.filter(r => r.status === 'Active').length;
  const closed    = rows.filter(r => r.status === 'Closed').length;

  // Filtered rows
  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchSearch = search === '' ||
        r.address.toLowerCase().includes(search.toLowerCase()) ||
        r.hamlet.toLowerCase().includes(search.toLowerCase()) ||
        r.notes.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || r.status === filterStatus;
      const matchType   = filterType === 'All' || r.type === filterType;
      return matchSearch && matchStatus && matchType;
    });
  }, [rows, search, filterStatus, filterType]);

  // Update a single field on a row
  const updateRow = (id: string, field: keyof PipeRow, value: string | number | null) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value, updatedAt: today() } : r));
  };

  // Add new empty row
  const addRow = () => {
    const newRow: PipeRow = {
      id: uid(),
      address: '',
      hamlet: '',
      type: 'Deal',
      status: 'Active',
      value: '',
      dom: null,
      notes: '',
      updatedAt: today(),
    };
    setRows(prev => [newRow, ...prev]);
    setEditingId(newRow.id);
  };

  // Delete row
  const deleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ background: '#FAF8F4', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: '#1B2A4A', padding: '28px 28px 24px', borderBottom: '2px solid #C8AC78' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10, textTransform: 'uppercase', marginBottom: 6 }}>
            Office Pipeline
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem', marginBottom: 4 }}>
            Active Pipeline
          </h2>
          <p style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.55)', fontSize: '0.82rem' }}>
            Active Pipeline · {rows.length} entries · Local Session
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 28px 48px' }}>

        {/* ── Summary KPIs ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Critical DOM 90+', value: critical, color: '#c0392b' },
            { label: 'Watch DOM 45–89',  value: watch,    color: '#e07b39' },
            { label: 'Active DOM < 45',  value: active,   color: '#C8AC78' },
            { label: 'Closed',           value: closed,   color: '#1B2A4A' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#fff', border: '1px solid rgba(27,42,74,0.1)', padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: kpi.color, fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}>
                {kpi.value}
              </div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6 }}>
                {kpi.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar: Search + Filters + Add Row ──────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 14, pointerEvents: 'none' }}>⌕</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search address, hamlet, notes…"
              style={{
                width: '100%', padding: '8px 10px 8px 30px',
                border: '1px solid rgba(27,42,74,0.15)', background: '#fff',
                fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.82rem', color: '#384249',
                outline: 'none',
              }}
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as PipeStatus | 'All')}
            style={{
              padding: '8px 12px', border: '1px solid rgba(27,42,74,0.15)', background: '#fff',
              fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#384249', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as PipeType | 'All')}
            style={{
              padding: '8px 12px', border: '1px solid rgba(27,42,74,0.15)', background: '#fff',
              fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#384249', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="All">All Types</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Add Row */}
          <button
            onClick={addRow}
            style={{
              padding: '8px 20px', background: '#1B2A4A', color: '#FAF8F4',
              border: 'none', cursor: 'pointer',
              fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.72rem',
              letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700,
              transition: 'background 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#C8AC78')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1B2A4A')}
          >
            + Add Row
          </button>
        </div>

        {/* ── Column Headers ────────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 2fr 80px',
          gap: 0, padding: '8px 14px',
          background: '#1B2A4A', marginBottom: 2,
        }}>
          {['Address / Hamlet', 'Type', 'Status', 'Value', 'DOM', 'Notes', ''].map(col => (
            <div key={col} style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(200,172,120,0.8)', fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              {col}
            </div>
          ))}
        </div>

        {/* ── Rows ──────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.length === 0 && (
            <div style={{ padding: '32px 14px', textAlign: 'center', background: '#fff', border: '1px solid rgba(27,42,74,0.08)' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#7a8a8e', fontSize: '1.1rem' }}>No entries match the current filter.</div>
            </div>
          )}
          {filtered.map(row => {
            const isEditing = editingId === row.id;
            const statusCfg = STATUS_CONFIG[row.status];
            return (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 2fr 80px',
                  gap: 0, padding: '12px 14px',
                  background: row.status === 'Critical' ? 'rgba(192,57,43,0.04)' : '#fff',
                  border: `1px solid ${row.status === 'Critical' ? 'rgba(192,57,43,0.2)' : 'rgba(27,42,74,0.08)'}`,
                  borderLeft: `3px solid ${statusCfg.dot}`,
                  alignItems: 'center', transition: 'background 0.1s',
                }}
                onClick={() => setEditingId(isEditing ? null : row.id)}
              >
                {/* Address / Hamlet */}
                <div>
                  {isEditing ? (
                    <div onClick={e => e.stopPropagation()}>
                      <EditCell
                        value={row.address}
                        onChange={v => updateRow(row.id, 'address', v)}
                        placeholder="Address"
                        style={{ fontWeight: 600, color: '#1B2A4A', fontSize: '0.88rem', marginBottom: 2 }}
                      />
                      <EditCell
                        value={row.hamlet}
                        onChange={v => updateRow(row.id, 'hamlet', v)}
                        placeholder="Hamlet"
                        style={{ fontSize: '0.75rem', color: '#7a8a8e' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.92rem' }}>{row.address || <span style={{ color: '#ccc' }}>—</span>}</div>
                      <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{row.hamlet}</div>
                    </div>
                  )}
                </div>

                {/* Type */}
                <div onClick={e => e.stopPropagation()}>
                  {isEditing ? (
                    <select
                      value={row.type}
                      onChange={e => updateRow(row.id, 'type', e.target.value)}
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(27,42,74,0.2)', padding: '3px 6px', background: '#fff', color: '#384249', cursor: 'pointer', outline: 'none', width: '100%' }}
                    >
                      {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#384249', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{row.type}</span>
                  )}
                </div>

                {/* Status */}
                <div onClick={e => e.stopPropagation()}>
                  {isEditing ? (
                    <select
                      value={row.status}
                      onChange={e => updateRow(row.id, 'status', e.target.value)}
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(27,42,74,0.2)', padding: '3px 6px', background: '#fff', color: '#384249', cursor: 'pointer', outline: 'none', width: '100%' }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <StatusPill status={row.status} />
                  )}
                </div>

                {/* Value */}
                <div onClick={e => e.stopPropagation()}>
                  {isEditing ? (
                    <EditCell value={row.value} onChange={v => updateRow(row.id, 'value', v)} placeholder="$0,000,000" style={{ fontWeight: 600, color: '#1B2A4A' }} />
                  ) : (
                    <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.85rem' }}>{row.value || '—'}</span>
                  )}
                </div>

                {/* DOM */}
                <div>
                  {row.dom !== null ? (
                    <DomBar dom={row.dom} />
                  ) : (
                    <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#ccc', fontSize: '0.68rem' }}>—</span>
                  )}
                </div>

                {/* Notes */}
                <div onClick={e => e.stopPropagation()}>
                  {isEditing ? (
                    <EditCell value={row.notes} onChange={v => updateRow(row.id, 'notes', v)} placeholder="Notes…" style={{ fontSize: '0.8rem', color: '#7a8a8e' }} />
                  ) : (
                    <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.8rem' }}>{row.notes || '—'}</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setEditingId(isEditing ? null : row.id)}
                    title={isEditing ? 'Done' : 'Edit'}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isEditing ? '#C8AC78' : '#aaa', fontSize: 14, padding: '2px 4px' }}
                  >
                    {isEditing ? '✓' : '✎'}
                  </button>
                  <button
                    onClick={() => deleteRow(row.id)}
                    title="Delete"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: 14, padding: '2px 4px' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ddd')}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer note ───────────────────────────────────────────────────── */}
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#aaa', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {filtered.length} of {rows.length} entries · Click any row to edit · Click ✓ to save
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M/edit"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif', fontSize: '0.68rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', padding: '6px 16px', border: '1px solid rgba(27,42,74,0.25)',
              color: '#384249', textDecoration: 'none', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1B2A4A'; e.currentTarget.style.color = '#FAF8F4'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#384249'; }}
          >
            Open Pipeline Sheet ↗
          </a>
        </div>

      </div>
    </div>
  );
}
