/**
 * PIPE TAB — Section 6 · April 30, 2026
 *
 * Architecture: Google Sheet is the SINGLE SOURCE OF TRUTH.
 * Section 6 layout: Two-column split driven by row-49 marker in Sheet1.
 *   Column 1 = SUPPLY  (Listings · Land · Commercial/Coop · Quiet · Rentals)
 *   Column 2 = DEMAND  (Leads · Buyers · Renters · Gets · Ideas · Buy-Side)
 *
 * Desktop: side-by-side columns. Mobile (<768px): stacked.
 * Three altitudes: TOTALS strip always visible · gist rows always visible · economics on click.
 *
 * Sheet ID (locked): 1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M
 */

import { useState, useCallback, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

// ─── Property Report Modal ───────────────────────────────────────────────────

function PropertyReportModal({ address, onClose }: { address: string; onClose: () => void }) {
  const [reportDate, setReportDate] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updateReport = trpc.pipe.updatePropertyReport.useMutation({
    onSuccess: () => { toast.success('Property report logged.'); onClose(); },
    onError: (err) => { setError(err.message || 'Failed to save report.'); },
  });

  const inputStyle: React.CSSProperties = {
    fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.82rem', color: '#FAF8F4',
    border: '1px solid rgba(200,172,120,0.2)', padding: '7px 10px', width: '100%',
    background: 'rgba(13,27,42,0.7)', outline: 'none',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'rgba(13,27,42,0.95)', border: '1px solid rgba(200,172,120,0.4)', padding: '28px 32px', minWidth: 360, maxWidth: 440, width: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#947231', marginBottom: 4 }}>Property Report</div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem', fontWeight: 400, color: '#FAF8F4', lineHeight: 1.3 }}>{address}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a8e', fontSize: '1.1rem', lineHeight: 1, padding: '2px 4px' }}>✕</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a8a8e', marginBottom: 5 }}>Report Date</label>
          <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a8a8e', marginBottom: 5 }}>Report Link (URL)</label>
          <input type="url" value={reportLink} onChange={e => setReportLink(e.target.value)} placeholder="https://..." style={inputStyle} />
        </div>
        {error && <div style={{ marginBottom: 12, fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.78rem', color: '#c0392b', borderLeft: '2px solid #c0392b', paddingLeft: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '8px 16px', border: '1px solid rgba(27,42,74,0.2)', background: 'transparent', color: '#7a8a8e', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { setError(null); if (!reportDate) { setError('Report date required.'); return; } if (!reportLink) { setError('Report link required.'); return; } updateReport.mutate({ address, reportDate, reportLink }); }} disabled={updateReport.isPending} style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '8px 18px', border: '1px solid #1B2A4A', background: updateReport.isPending ? 'rgba(27,42,74,0.5)' : '#1B2A4A', color: '#FAF8F4', cursor: updateReport.isPending ? 'not-allowed' : 'pointer' }}>{updateReport.isPending ? 'Saving…' : 'Log Report'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sheet config ─────────────────────────────────────────────────────────────

const OFFICE_PIPELINE_SHEET_ID = '1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M';
function sheetOpenUrl(id: string) { return `https://docs.google.com/spreadsheets/d/${id}/edit`; }

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string; border: string }> = {
  'In Contract': { bg: 'rgba(200,172,120,0.18)', color: '#7a5c28', dot: '#947231', border: '#947231' },
  'Active':      { bg: 'rgba(34,139,34,0.1)',    color: '#1a6b1a', dot: '#228B22', border: '#228B22' },
  'Closed':      { bg: 'rgba(27,42,74,0.1)',      color: '#1B2A4A', dot: '#1B2A4A', border: '#1B2A4A' },
  'Watch':       { bg: 'rgba(224,123,57,0.12)',   color: '#9a5a20', dot: '#e07b39', border: '#e07b39' },
  'Critical':    { bg: 'rgba(192,57,43,0.12)',    color: '#8b2515', dot: '#c0392b', border: '#c0392b' },
  'Stalled':     { bg: 'rgba(120,138,142,0.12)',  color: '#4a5a5e', dot: '#7a8a8e', border: '#7a8a8e' },
  'Dead':        { bg: 'rgba(180,180,180,0.1)',   color: '#aaa',    dot: '#ccc',    border: '#ccc'    },
  'Pending':     { bg: 'rgba(224,123,57,0.12)',   color: '#9a5a20', dot: '#e07b39', border: '#e07b39' },
  'Prospect':    { bg: 'rgba(200,172,120,0.06)',  color: '#7a8a8e', dot: '#ccc',    border: '#ccc'    },
};
function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? { bg: 'rgba(200,172,120,0.06)', color: '#7a8a8e', dot: '#ccc', border: '#ccc' };
}
const STATUS_OPTIONS = ['In Contract', 'Active', 'Closed', 'Watch', 'Critical', 'Stalled', 'Dead', 'Pending', 'Prospect'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDollar(n: number): string {
  if (n >= 1_000_000) { const v = (n / 1_000_000).toFixed(1); return `$${v.endsWith('.0') ? v.slice(0, -2) : v}M`; }
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  if (n > 0) return `$${n}`;
  return '—';
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const sc = getStatusConfig(status);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, whiteSpace: 'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
      {status || '—'}
    </span>
  );
}

// ─── Inline Status Editor ─────────────────────────────────────────────────────

function InlineStatusEditor({ address, currentStatus, currentDate, onSave, onCancel, isSaving }: {
  address: string; currentStatus: string; currentDate: string;
  onSave: (status: string, date?: string) => void;
  onCancel: () => void; isSaving: boolean;
}) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [closeDate, setCloseDate] = useState(currentDate || '');
  return (
    <div className="flex items-center gap-2 flex-wrap py-1">
      <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="border px-2 py-1 text-xs" style={{ borderColor: '#947231', fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)' }}>
        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
      </select>
      {newStatus === 'Closed' && (
        <input type="text" placeholder="Close date (e.g. April 2, 2026)" value={closeDate} onChange={e => setCloseDate(e.target.value)} className="border px-2 py-1 text-xs" style={{ borderColor: '#947231', fontFamily: '"Source Sans 3", sans-serif', minWidth: 160 }} />
      )}
      <button onClick={() => onSave(newStatus, newStatus === 'Closed' ? closeDate : undefined)} disabled={isSaving} className="px-3 py-1 text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#947231', opacity: isSaving ? 0.6 : 1 }}>{isSaving ? 'Saving…' : '✓ Save'}</button>
      <button onClick={onCancel} className="px-3 py-1 text-[9px] uppercase tracking-widest border" style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#D3D1C7', color: '#7a8a8e' }}>Cancel</button>
    </div>
  );
}

// ─── Column Totals Strip ──────────────────────────────────────────────────────

interface ColumnTotals {
  totalBook: number;
  active: number;
  quiet?: number;
  inContract: number;
  closed: number;
  dealCount: number;
}

function TotalsStrip({ totals, label, accent }: { totals: ColumnTotals; label: string; accent: string }) {
  const tiles = [
    { key: 'Total Book', val: totals.totalBook, dot: accent },
    { key: 'Active', val: totals.active, dot: '#228B22' },
    ...(totals.quiet !== undefined ? [{ key: 'Quiet', val: totals.quiet, dot: '#7a8a8e' }] : []),
    { key: 'In Contract', val: totals.inContract, dot: '#947231' },
    { key: 'Closed', val: totals.closed, dot: '#1B2A4A' },
  ];
  return (
    <div style={{ background: 'rgba(27,42,74,0.85)', border: '1px solid rgba(200,172,120,0.25)', borderRadius: 6, padding: '14px 16px', marginBottom: 14 }}>
      <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{label} · {totals.dealCount} deal{totals.dealCount !== 1 ? 's' : ''}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tiles.map(t => (
          <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(13,27,42,0.5)', border: '1px solid rgba(200,172,120,0.1)', padding: '6px 10px', minWidth: 80 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a8a8e', marginBottom: 1 }}>{t.key}</div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '0.95rem', lineHeight: 1 }}>{fmtDollar(t.val)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Deal Row ─────────────────────────────────────────────────────────────────

interface DealRow {
  rowNumber: number;
  address: string;
  town: string;
  type: string;
  price: string;
  status: string;
  agent: string;
  side: string;
  ersSigned: string;
  eeliLink: string;
  signs: string;
  photos: string;
  zillowShowcase: string;
  dateClosed: string;
  propertyReportDate: string;
  propertyReportLink: string;
  isSectionHeader: boolean;
  category: string;
}

function DealRowItem({
  row, isAuthenticated, editingAddress, setEditingAddress, setReportingAddress,
  updateStatus,
}: {
  row: DealRow;
  isAuthenticated: boolean;
  editingAddress: string | null;
  setEditingAddress: (a: string | null) => void;
  setReportingAddress: (a: string | null) => void;
  updateStatus: ReturnType<typeof trpc.pipe.updateSheetStatus.useMutation>;
}) {
  const isEditing = editingAddress === row.address;

  if (row.isSectionHeader) {
    return (
      <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '7px 10px 5px', fontWeight: 700, borderTop: '1px solid rgba(200,172,120,0.3)', borderBottom: '1px solid rgba(200,172,120,0.12)', background: 'rgba(27,42,74,0.7)', marginTop: 4 }}>
        {row.address}
      </div>
    );
  }

  return (
    <div
      style={{ padding: '9px 10px', borderBottom: '1px solid rgba(200,172,120,0.06)', background: isEditing ? 'rgba(200,172,120,0.06)' : 'transparent', transition: 'background 0.1s' }}
      onMouseEnter={e => { if (!isEditing) (e.currentTarget as HTMLElement).style.background = 'rgba(200,172,120,0.03)'; }}
      onMouseLeave={e => { if (!isEditing) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {/* Address + town line */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: isEditing ? 6 : 4 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '0.9rem', lineHeight: 1.3, marginBottom: 2 }}>{row.address}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {row.town && <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.5)', fontSize: '0.72rem' }}>{row.town}</span>}
            {row.type && <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{row.type}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
          {row.price && <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{row.price}</span>}
          {!isEditing && <StatusBadge status={row.status} />}
        </div>
      </div>

      {/* Edit mode */}
      {isEditing && (
        <InlineStatusEditor
          address={row.address}
          currentStatus={row.status}
          currentDate={row.dateClosed}
          onSave={(status, date) => { updateStatus.mutate({ address: row.address, status, date }); setEditingAddress(null); }}
          onCancel={() => setEditingAddress(null)}
          isSaving={updateStatus.isPending}
        />
      )}

      {/* Action links */}
      {!isEditing && (
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={() => setEditingAddress(row.address)} style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a8a8e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit Status</button>
          {isAuthenticated && (
            <button onClick={() => setReportingAddress(row.address)} style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#947231', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>+ Report</button>
          )}
          {row.eeliLink && (
            <a href={row.eeliLink} target="_blank" rel="noopener noreferrer" style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#947231', textDecoration: 'none' }}>EELI ↗</a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Column Panel ─────────────────────────────────────────────────────────────

function ColumnPanel({
  title, subtitle, accent, deals, totals, searchTerm, filterStatus, isAuthenticated,
  editingAddress, setEditingAddress, setReportingAddress, updateStatus,
}: {
  title: string;
  subtitle: string;
  accent: string;
  deals: DealRow[];
  totals: ColumnTotals;
  searchTerm: string;
  filterStatus: string;
  isAuthenticated: boolean;
  editingAddress: string | null;
  setEditingAddress: (a: string | null) => void;
  setReportingAddress: (a: string | null) => void;
  updateStatus: ReturnType<typeof trpc.pipe.updateSheetStatus.useMutation>;
}) {
  const filtered = deals.filter(d => {
    if (d.isSectionHeader) return true;
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return d.address.toLowerCase().includes(q) || d.town.toLowerCase().includes(q) || d.agent.toLowerCase().includes(q) || d.price.toLowerCase().includes(q);
    }
    return true;
  });

  // De-dup section headers
  const seenHeaders = new Set<string>();
  const rows = filtered.filter(d => {
    if (!d.isSectionHeader) return true;
    const label = d.address.toUpperCase().trim();
    if (seenHeaders.has(label)) return false;
    seenHeaders.add(label);
    return true;
  });

  const dealCount = deals.filter(d => !d.isSectionHeader).length;

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Column header */}
      <div style={{ background: '#1B2A4A', borderBottom: '2px solid rgba(200,172,120,0.4)', padding: '10px 14px', marginBottom: 10 }}>
        <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: accent, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>{title}</div>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.45)', fontSize: '0.7rem', marginTop: 2 }}>{subtitle} · {dealCount} deal{dealCount !== 1 ? 's' : ''}</div>
      </div>

      {/* Totals strip */}
      <TotalsStrip totals={totals} label={title} accent={accent} />

      {/* Deal rows */}
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid rgba(200,172,120,0.2)', borderRadius: 4, background: 'rgba(13,27,42,0.6)' }}>
        {rows.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.8rem', fontStyle: 'italic' }}>No deals match the current filter.</div>
        ) : (
          rows.map((row, idx) => (
            <DealRowItem
              key={`${row.address}-${idx}`}
              row={row}
              isAuthenticated={isAuthenticated}
              editingAddress={editingAddress}
              setEditingAddress={setEditingAddress}
              setReportingAddress={setReportingAddress}
              updateStatus={updateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Two-Column Pipeline View ─────────────────────────────────────────────────

function TwoColumnPipeline() {
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [reportingAddress, setReportingAddress] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error, refetch, dataUpdatedAt } = trpc.pipe.sheetSplit.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: false,
  });

  useEffect(() => {
    if (dataUpdatedAt && dataUpdatedAt > 0) setLastSyncedAt(new Date(dataUpdatedAt));
  }, [dataUpdatedAt]);

  useEffect(() => {
    if (!lastSyncedAt) return;
    const tick = () => setSecondsAgo(Math.floor((Date.now() - lastSyncedAt.getTime()) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastSyncedAt]);

  const updateStatus = trpc.pipe.updateSheetStatus.useMutation({
    onSuccess: () => setTimeout(() => refetch(), 1500),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-12 justify-center" style={{ color: '#7a8a8e', fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.8rem' }}>
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#947231', borderTopColor: 'transparent' }} />
        Loading Office Pipeline from Sheet…
      </div>
    );
  }

  if (error || data?.error) {
    return (
      <div className="py-4 px-4 border-l-2" style={{ borderColor: '#c0392b', background: 'rgba(192,57,43,0.05)', fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.8rem', color: '#8b2515' }}>
        Unable to load Sheet data: {data?.error ?? error?.message}
      </div>
    );
  }

  const supply = (data?.supply ?? []) as DealRow[];
  const demand = (data?.demand ?? []) as DealRow[];
  const supplyTotals = data?.supplyTotals ?? { totalBook: 0, active: 0, quiet: 0, inContract: 0, closed: 0, dealCount: 0 };
  const demandTotals = data?.demandTotals ?? { totalBook: 0, active: 0, inContract: 0, closed: 0, dealCount: 0 };

  const totalBook = supplyTotals.totalBook + demandTotals.totalBook;
  const totalDeals = supplyTotals.dealCount + demandTotals.dealCount;

  return (
    <div>
      {/* Master KPI strip — always visible */}
      <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 8, padding: '16px 20px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.7rem', lineHeight: 1 }}>{fmtDollar(totalBook)}</span>
          <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Total Book · {totalDeals} deals</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#947231', display: 'inline-block' }} />
            <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a8a8e' }}>Supply</span>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1rem' }}>{fmtDollar(supplyTotals.totalBook)}</span>
          </div>
          <span style={{ color: 'rgba(200,172,120,0.3)', fontSize: '0.8rem' }}>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1B2A4A', display: 'inline-block', border: '1px solid rgba(200,172,120,0.4)' }} />
            <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a8a8e' }}>Demand</span>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontSize: '1rem' }}>{fmtDollar(demandTotals.totalBook)}</span>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search address, town, agent…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-2 text-sm flex-1"
          style={{ borderColor: 'rgba(200,172,120,0.2)', fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)', minWidth: 200, maxWidth: 320 }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border px-3 py-2 text-sm"
          style={{ borderColor: 'rgba(200,172,120,0.2)', fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)' }}
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: 'rgba(200,172,120,0.4)', color: '#947231', letterSpacing: '0.14em' }}
        >
          ↻ Refresh
        </button>
        <a
          href={sheetOpenUrl(OFFICE_PIPELINE_SHEET_ID)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#947231] hover:text-[#1B2A4A]"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#947231', letterSpacing: '0.14em', textDecoration: 'none' }}
        >
          Open Full Sheet ↗
        </a>
        {lastSyncedAt && (
          <span className="ml-auto text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
            ↻ Last synced {secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`}
          </span>
        )}
      </div>

      {/* Two-column grid — desktop side-by-side, mobile stacked */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 16, alignItems: 'start' }}>
        <ColumnPanel
          title="Supply"
          subtitle="Listings · Land · Commercial/Coop · Quiet · Rentals"
          accent="#947231"
          deals={supply}
          totals={supplyTotals}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          isAuthenticated={isAuthenticated}
          editingAddress={editingAddress}
          setEditingAddress={setEditingAddress}
          setReportingAddress={setReportingAddress}
          updateStatus={updateStatus}
        />
        <ColumnPanel
          title="Demand"
          subtitle="Leads · Buyers · Renters · Gets · Ideas · Buy-Side"
          accent="#5a8a9f"
          deals={demand}
          totals={demandTotals}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          isAuthenticated={isAuthenticated}
          editingAddress={editingAddress}
          setEditingAddress={setEditingAddress}
          setReportingAddress={setReportingAddress}
          updateStatus={updateStatus}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 px-1">
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, color: '#947231', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          LIVE · SERVER-PROXIED · SINGLE SOURCE OF TRUTH · ROW-49 SPLIT
        </span>
        <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.7rem', color: '#7a8a8e', fontStyle: 'italic' }}>
          {totalDeals} deal{totalDeals !== 1 ? 's' : ''} · refreshes every 60s
        </span>
      </div>

      {/* Property Report Modal */}
      {reportingAddress && (
        <PropertyReportModal address={reportingAddress} onClose={() => setReportingAddress(null)} />
      )}
    </div>
  );
}

// ─── Add Deal Form ───────────────────────────────────────────────────────────

const TOWNS = ['East Hampton', 'Southampton', 'Bridgehampton', 'Sagaponack', 'Water Mill', 'Sag Harbor', 'Montauk', 'Amagansett', 'Springs', 'Wainscott', 'Hampton Bays', 'Other'];
const TYPES = ['Residential', 'Land', 'Commercial', 'Condo', 'Co-op', 'Rental'];
const STATUSES = ['Active', 'In Contract', 'Closed', 'Watch', 'Dead', 'Pending', 'Prospect'];
const SIDES = ['Buyer', 'Seller', 'Dual', 'Landlord', 'Tenant'];

function AddDealForm({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    address: '', town: 'East Hampton', type: 'Residential',
    price: '', status: 'Active', agent: 'Ed Bruehl',
    side: 'Seller', ersSigned: '', eeliLink: '', signs: '', photos: '', zillowShowcase: '', dateClosed: '',
  });
  const [error, setError] = useState<string | null>(null);

  const append = trpc.pipe.appendSheet.useMutation({
    onSuccess: () => {
      setOpen(false);
      setForm({ address: '', town: 'East Hampton', type: 'Residential', price: '', status: 'Active', agent: 'Ed Bruehl', side: 'Seller', ersSigned: '', eeliLink: '', signs: '', photos: '', zillowShowcase: '', dateClosed: '' });
      setError(null);
      onSuccess();
    },
    onError: (e) => setError(e.message),
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.82rem', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)', border: '1px solid rgba(200,172,120,0.2)', borderRadius: 4, padding: '6px 10px', width: '100%', outline: 'none' };
  const labelStyle = { fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#7a8a8e', display: 'block', marginBottom: 3 };

  return (
    <div className="mb-6">
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#947231', background: '#1B2A4A', border: '1px solid #947231', borderRadius: 4, padding: '7px 18px', cursor: 'pointer' }}>
          + Add Deal
        </button>
      ) : (
        <div style={{ background: 'rgba(13,27,42,0.85)', border: '1px solid rgba(200,172,120,0.3)', borderRadius: 6, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
          <div className="flex items-center justify-between mb-4">
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.05rem' }}>Add New Deal</div>
            <button onClick={() => setOpen(false)} style={{ color: '#7a8a8e', background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>
          <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Address *</label>
              <input style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} placeholder="12 Further Lane, East Hampton" />
            </div>
            <div><label style={labelStyle}>Town</label><select style={inputStyle} value={form.town} onChange={e => set('town', e.target.value)}>{TOWNS.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label style={labelStyle}>Type</label><select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label style={labelStyle}>Price</label><input style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} placeholder="$2,500,000" /></div>
            <div><label style={labelStyle}>Status</label><select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label style={labelStyle}>Agent</label><input style={inputStyle} value={form.agent} onChange={e => set('agent', e.target.value)} placeholder="Ed Bruehl" /></div>
            <div><label style={labelStyle}>Side</label><select style={inputStyle} value={form.side} onChange={e => set('side', e.target.value)}>{SIDES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label style={labelStyle}>ERS Signed</label><input style={inputStyle} value={form.ersSigned} onChange={e => set('ersSigned', e.target.value)} placeholder="✓ or date" /></div>
            <div><label style={labelStyle}>EELI Link</label><input style={inputStyle} value={form.eeliLink} onChange={e => set('eeliLink', e.target.value)} placeholder="https://..." /></div>
            <div><label style={labelStyle}>Date Closed</label><input style={inputStyle} type="date" value={form.dateClosed} onChange={e => set('dateClosed', e.target.value)} /></div>
          </div>
          {error && <div style={{ marginTop: 12, fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.78rem', color: '#c0392b', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 4, padding: '6px 10px' }}>{error}</div>}
          <div className="flex gap-3 mt-5">
            <button onClick={() => append.mutate(form)} disabled={!form.address.trim() || append.isPending} style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FAF8F4', background: append.isPending ? '#7a8a8e' : '#1B2A4A', border: '1px solid #1B2A4A', borderRadius: 4, padding: '7px 20px', cursor: !form.address.trim() || append.isPending ? 'not-allowed' : 'pointer', opacity: !form.address.trim() ? 0.5 : 1 }}>{append.isPending ? 'Adding…' : 'Add to Sheet'}</button>
            <button onClick={() => setOpen(false)} style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a8a8e', background: 'transparent', border: '1px solid #D3D1C7', borderRadius: 4, padding: '7px 16px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Import from Profile Button ─────────────────────────────────────────────

function ImportFromProfileButton({ onSuccess }: { onSuccess: () => void }) {
  const [result, setResult] = useState<{ imported: number; skipped: number; listings: string[] } | null>(null);
  const importMutation = trpc.pipe.importFromProfile.useMutation({
    onSuccess: (data) => {
      setResult(data);
      onSuccess();
      toast.success(
        data.imported > 0
          ? `${data.imported} listing${data.imported > 1 ? 's' : ''} imported to Sheet`
          : `All ${data.skipped} listing${data.skipped > 1 ? 's' : ''} already in Sheet — no duplicates added`,
        { duration: 6000 }
      );
    },
    onError: (err) => { toast.error(`Import failed: ${err.message}`); },
  });
  return (
    <div className="mb-4">
      <button
        onClick={() => { setResult(null); importMutation.mutate(); }}
        disabled={importMutation.isPending}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded border transition-colors"
        style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.12em', fontSize: 10, textTransform: 'uppercase', background: 'transparent', borderColor: '#947231', color: '#947231', opacity: importMutation.isPending ? 0.7 : 1, cursor: importMutation.isPending ? 'not-allowed' : 'pointer' }}
      >
        {importMutation.isPending ? (
          <><span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />Importing…</>
        ) : (
          <>↓ Import from Profile</>
        )}
      </button>
      {result && (
        <div className="mt-2 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          {result.imported > 0 ? (
            <span style={{ color: '#1a6b1a' }}>✓ {result.imported} new row{result.imported > 1 ? 's' : ''} added: {result.listings.join(', ')}</span>
          ) : (
            <span style={{ color: '#7a8a8e' }}>All {result.skipped} listing{result.skipped > 1 ? 's' : ''} already in Sheet.</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function PipeTab() {
  const utils = trpc.useUtils();
  const handleDealAdded = useCallback(() => {
    utils.pipe.sheetSplit.invalidate();
    utils.pipe.sheetDeals.invalidate();
  }, [utils]);

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <div className="px-6 py-8" style={{ background: 'rgba(13,27,42,0.5)' }}>
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
          {/* Action buttons row */}
          <div className="flex items-center gap-3 mb-4">
            <AddDealForm onSuccess={handleDealAdded} />
            <ImportFromProfileButton onSuccess={handleDealAdded} />
          </div>
          {/* Framed pipeline */}
          <div style={{ border: '1px solid rgba(200,172,120,0.3)', borderRadius: 2, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(27,42,74,0.5), 0 4px 24px rgba(0,0,0,0.12)', background: '#0D1520' }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg, rgba(200,172,120,0.7) 0%, rgba(200,172,120,0.08) 100%)' }} />
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(27,42,74,0.85)', borderBottom: '1px solid rgba(200,172,120,0.12)' }}>
              <div className="uppercase" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 9, fontWeight: 600 }}>
                Office Pipeline · Master Sheet · Live
              </div>
              <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.4)', fontSize: 9 }}>
                Edits write directly to Google Sheets
              </div>
            </div>
            <div className="p-4">
              <TwoColumnPipeline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
