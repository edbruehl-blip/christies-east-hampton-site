/**
 * PIPE TAB — Sprint 7 · April 3, 2026
 *
 * Architecture: Google Sheet is the SINGLE SOURCE OF TRUTH.
 * - Top: KPI summary strip (deal count, total volume, by status)
 * - Middle: Full-width styled table — all rows from Sheet, server-proxied via Service Account
 * - Bottom: Status update panel — writes directly to Sheet
 *
 * Sheet ID (locked): 1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M
 * Note: Sheet is private — rendered via server-side proxy (no iframe, no public sharing required)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

// ─── Property Report Modal ───────────────────────────────────────────────────

function PropertyReportModal({ address, onClose }: { address: string; onClose: () => void }) {
  const [reportDate, setReportDate] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [error, setError] = useState<string | null>(null);

  const updateReport = trpc.pipe.updatePropertyReport.useMutation({
    onSuccess: () => {
      toast.success('Property report logged.');
      onClose();
    },
    onError: (err) => {
      setError(err.message || 'Failed to save report.');
    },
  });

  const handleSubmit = () => {
    setError(null);
    if (!reportDate) { setError('Report date is required.'); return; }
    if (!reportLink) { setError('Report link is required.'); return; }
    updateReport.mutate({ address, reportDate, reportLink });
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: '"Source Sans 3", sans-serif',
    fontSize: '0.82rem',
    color: '#FAF8F4',
    border: '1px solid rgba(200,172,120,0.2)',
    padding: '7px 10px',
    width: '100%',
    background: 'rgba(13,27,42,0.7)',
    outline: 'none',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'rgba(13,27,42,0.95)',
        border: '1px solid rgba(200,172,120,0.4)',
        padding: '28px 32px',
        minWidth: 360,
        maxWidth: 440,
        width: '90vw',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#947231', marginBottom: 4 }}>Property Report</div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem', fontWeight: 400, color: '#FAF8F4', lineHeight: 1.3 }}>{address}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a8a8e', fontSize: '1.1rem', lineHeight: 1, padding: '2px 4px' }}>✕</button>
        </div>
        {/* Date field */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a8a8e', marginBottom: 5 }}>Report Date</label>
          <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} style={inputStyle} />
        </div>
        {/* URL field */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a8a8e', marginBottom: 5 }}>Report Link (URL)</label>
          <input type="url" value={reportLink} onChange={e => setReportLink(e.target.value)} placeholder="https://..." style={inputStyle} />
        </div>
        {/* Error */}
        {error && (
          <div style={{ marginBottom: 12, fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.78rem', color: '#c0392b', borderLeft: '2px solid #c0392b', paddingLeft: 8 }}>{error}</div>
        )}
        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '8px 16px', border: '1px solid rgba(27,42,74,0.2)', background: 'transparent', color: '#7a8a8e', cursor: 'pointer' }}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={updateReport.isPending}
            style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '8px 18px', border: '1px solid #1B2A4A', background: updateReport.isPending ? 'rgba(27,42,74,0.5)' : '#1B2A4A', color: '#FAF8F4', cursor: updateReport.isPending ? 'not-allowed' : 'pointer' }}
          >{updateReport.isPending ? 'Saving…' : 'Log Report'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sheet config ─────────────────────────────────────────────────────────────

const OFFICE_PIPELINE_SHEET_ID = '1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M';

function sheetOpenUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string; border: string }> = {
  'In Contract': { bg: 'rgba(200,172,120,0.18)', color: '#7a5c28', dot: '#947231', border: '#947231' },
  'Active':      { bg: 'rgba(34,139,34,0.1)',    color: '#1a6b1a', dot: '#228B22', border: '#228B22' },
  'Closed':      { bg: 'rgba(27,42,74,0.1)',      color: '#1B2A4A', dot: '#1B2A4A', border: '#1B2A4A' },
  'Watch':       { bg: 'rgba(224,123,57,0.12)',   color: '#9a5a20', dot: '#e07b39', border: '#e07b39' },
  'Critical':    { bg: 'rgba(192,57,43,0.12)',    color: '#8b2515', dot: '#c0392b', border: '#c0392b' },
  'Stalled':     { bg: 'rgba(120,138,142,0.12)',  color: '#4a5a5e', dot: '#7a8a8e', border: '#7a8a8e' },
  'Dead':        { bg: 'rgba(180,180,180,0.1)',   color: '#aaa',    dot: '#ccc',    border: '#ccc'    },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? { bg: 'rgba(200,172,120,0.06)', color: '#7a8a8e', dot: '#ccc', border: '#ccc' };
}

const STATUS_OPTIONS = ['In Contract', 'Active', 'Closed', 'Watch', 'Critical', 'Stalled', 'Dead'];

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS = [
  { key: 'address',       label: 'Address',        width: 220, primary: true  },
  { key: 'town',          label: 'Town',            width: 120, primary: false },
  { key: 'type',          label: 'Type',            width: 100, primary: false },
  { key: 'price',         label: 'Price',           width: 120, primary: true  },
  { key: 'status',        label: 'Status',          width: 110, primary: true  },
  { key: 'side',          label: 'Side',            width: 80,  primary: false },
  { key: 'agent',         label: 'Agent',           width: 110, primary: false },
  { key: 'ersSigned',     label: 'ERS/EBB',         width: 70,  primary: false },
  { key: 'signs',         label: 'Signs',           width: 60,  primary: false },
  { key: 'photos',        label: 'Photos',          width: 60,  primary: false },
  { key: 'zillowShowcase',label: 'Zillow',          width: 60,  primary: false },
  { key: 'dateClosed',    label: 'Date Closed',     width: 120, primary: false },
] as const;

type DealKey = typeof COLUMNS[number]['key'];

// ─── KPI Strip ────────────────────────────────────────────────────────────────
// Seven-category breakout per Ed Bruehl directive April 6, 2026.
// Total Book = sum of all categories. Must never read as "Active Pipeline" alone.

function KpiStrip({ deals }: { deals: Array<Record<string, string>> }) {
  const parsePrice = (p: string) => {
    const n = parseFloat(p.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  };
  const volByCategory = (keywords: string[]) =>
    deals
      .filter(d => !d.isSectionHeader && d.price && keywords.some(k => ((d as any).status ?? '').toUpperCase().includes(k.toUpperCase())))
      .reduce((sum, d) => sum + parsePrice(d.price), 0);
  const totalBook = deals
    .filter(d => !d.isSectionHeader && d.price)
    .reduce((sum, d) => sum + parsePrice(d.price), 0);
  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `$${(n / 1_000).toFixed(0)}K`
    : n > 0        ? `$${n}`
    : '—';
  const categories = [
    { label: 'Active Listings',      vol: volByCategory(['ACTIVE', 'EXCLUSIVE']),             dot: '#228B22' },
    { label: 'Quiet Listings',       vol: volByCategory(['QUIET']),                           dot: '#7a8a8e' },
    { label: 'Offers / Buy-Side',    vol: volByCategory(['OFFER', 'BUY-SIDE', 'BUY SIDE']),  dot: '#947231' },
    { label: 'Pending Listings',     vol: volByCategory(['PENDING']),                         dot: '#e07b39' },
    { label: 'In Contract / Closed', vol: volByCategory(['IN CONTRACT', 'CLOSED']),           dot: '#1B2A4A' },
    { label: 'Rentals',              vol: volByCategory(['RENTAL']),                          dot: '#384249' },
    { label: 'Inactive',             vol: volByCategory(['INACTIVE', 'DEAD', 'STALLED']),    dot: '#ccc'    },
  ];
  return (
    <div className="mb-6">
      {/* Total Book headline */}
      <div className="flex items-baseline gap-3 mb-3">
        <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.6rem', lineHeight: 1 }}>{fmt(totalBook)}</span>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Total Book</span>
      </div>
      {/* Seven-category strip */}
      <div className="flex flex-wrap gap-2">
        {categories.map(k => (
          <div key={k.label} className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(13,27,42,0.7)', border: '1px solid rgba(200,172,120,0.15)', minWidth: 110 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: k.dot, display: 'inline-block', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 1 }}>{k.label}</div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1rem', lineHeight: 1 }}>{fmt(k.vol)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const sc = getStatusConfig(status);
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px',
        fontFamily: '"Barlow Condensed", sans-serif',
        fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
        background: sc.bg, color: sc.color,
        border: `1px solid ${sc.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
      {status || '—'}
    </span>
  );
}

// ─── Inline Status Editor ─────────────────────────────────────────────────────

function InlineStatusEditor({
  address, currentStatus, currentDate, onSave, onCancel, isSaving,
}: {
  address: string; currentStatus: string; currentDate: string;
  onSave: (status: string, date?: string) => void;
  onCancel: () => void; isSaving: boolean;
}) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [closeDate, setCloseDate] = useState(currentDate || '');
  return (
    <div className="flex items-center gap-2 flex-wrap py-1">
      <select
        value={newStatus}
        onChange={e => setNewStatus(e.target.value)}
        className="border px-2 py-1 text-xs"
        style={{ borderColor: '#947231', fontFamily: '"Source Sans 3", sans-serif', color: '#FAF8F4', background: 'rgba(13,27,42,0.7)' }}
      >
        {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
      </select>
      {newStatus === 'Closed' && (
        <input
          type="text"
          placeholder="Close date (e.g. April 2, 2026)"
          value={closeDate}
          onChange={e => setCloseDate(e.target.value)}
          className="border px-2 py-1 text-xs"
          style={{ borderColor: '#947231', fontFamily: '"Source Sans 3", sans-serif', minWidth: 160 }}
        />
      )}
      <button
        onClick={() => onSave(newStatus, newStatus === 'Closed' ? closeDate : undefined)}
        disabled={isSaving}
        className="px-3 py-1 text-[9px] uppercase tracking-widest"
        style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#947231', opacity: isSaving ? 0.6 : 1 }}
      >
        {isSaving ? 'Saving…' : '✓ Save'}
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-1 text-[9px] uppercase tracking-widest border"
        style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#D3D1C7', color: '#7a8a8e' }}
      >
        Cancel
      </button>
    </div>
  );
}

// ─── Full Pipeline Table ──────────────────────────────────────────────────────

function PipelineTable() {
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  const { data, isLoading, error, refetch, dataUpdatedAt } = trpc.pipe.sheetDeals.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: false, // Fail fast on Sheets API errors — show error state immediately
  });

  // Track when data was last successfully fetched
  useEffect(() => {
    if (dataUpdatedAt && dataUpdatedAt > 0) {
      setLastSyncedAt(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

  // Tick every second to update "Xs ago" display
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
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [reportingAddress, setReportingAddress] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

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

  const allRows = data?.deals ?? [];
  // Section headers become visual dividers in the table
  const filtered = allRows.filter(d => {
    if (!d.address) return false;
    if (d.isSectionHeader) return true; // always show section headers
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        d.address.toLowerCase().includes(q) ||
        d.town.toLowerCase().includes(q) ||
        d.agent.toLowerCase().includes(q) ||
        d.price.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const dealRows = allRows.filter(d => !d.isSectionHeader && d.address);

  return (
    <div>
      {/* KPI strip — mounted object */}
      <div style={{ background: 'rgba(27,42,74,0.88)', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', marginBottom: 24, padding: '24px 28px' }}>
        <KpiStrip deals={dealRows as unknown as Array<Record<string, string>>} />
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
        {/* Sync indicator */}
        {lastSyncedAt && (
          <span
            className="ml-auto text-[9px] uppercase tracking-widest"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}
          >
            ↻ Last synced {secondsAgo < 60 ? `${secondsAgo}s ago` : `${Math.floor(secondsAgo / 60)}m ago`}
          </span>
        )}
      </div>
      {/* Success notification */}
      {updateStatus.isSuccess && (
        <div className="mb-4 px-4 py-2 text-xs" style={{ background: 'rgba(200,172,120,0.06)', color: 'rgba(250,248,244,0.7)', fontFamily: '"Source Sans 3", sans-serif', borderLeft: '2px solid #947231' }}>
          ✓ Sheet updated — refreshing in a moment…
        </div>
      )}

      {/* Table — mounted object */}
      <div style={{ overflowX: 'auto', border: '1px solid rgba(200,172,120,0.35)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', background: 'rgba(27,42,74,0.88)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          {/* Header */}
          <thead>
            <tr style={{ background: '#1B2A4A' }}>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  style={{
                    fontFamily: '"Barlow Condensed", sans-serif',
                    color: '#947231',
                    fontSize: 9,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    minWidth: col.width,
                    borderRight: '1px solid rgba(200,172,120,0.12)',
                  }}
                >
                  {col.label}
                </th>
              ))}
              <th style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 12px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap', minWidth: 90 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} style={{ padding: '24px', textAlign: 'center', fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.82rem', fontStyle: 'italic' }}>
                  No deals match the current filter.
                </td>
              </tr>
            ) : (
              dedupedFiltered.map((row, idx) => {
                if (row.isSectionHeader) {
                  return (
                    <tr key={`section-${idx}`} style={{ background: '#1B2A4A' }}>
                      <td
                        colSpan={COLUMNS.length + 1}
                        style={{
                          fontFamily: '"Barlow Condensed", sans-serif',
                          color: '#947231',
                          fontSize: 10,
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          padding: '8px 12px',
                          fontWeight: 700,
                          borderTop: '2px solid rgba(200,172,120,0.4)',
                          borderBottom: '1px solid rgba(200,172,120,0.2)',
                        }}
                      >
                        {row.address}
                      </td>
                    </tr>
                  );
                }

                const isEditing = editingAddress === row.address;
                const isEvenRow = idx % 2 === 0;

                return (
                  <tr
                    key={`${row.address}-${row.rowNumber}`}
                    style={{
                      background: isEditing ? 'rgba(200,172,120,0.08)' : isEvenRow ? 'rgba(13,27,42,0.55)' : 'rgba(13,27,42,0.4)',
                      borderBottom: '1px solid rgba(200,172,120,0.08)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isEditing) (e.currentTarget as HTMLElement).style.background = 'rgba(200,172,120,0.04)'; }}
                    onMouseLeave={e => { if (!isEditing) (e.currentTarget as HTMLElement).style.background = isEvenRow ? 'rgba(13,27,42,0.55)' : 'rgba(13,27,42,0.4)'; }}
                  >
                    {COLUMNS.map(col => {
                      const val = row[col.key as DealKey] ?? '';

                      // Status column — render badge or editor
                      if (col.key === 'status') {
                        return (
                          <td key={col.key} style={{ padding: '10px 12px', verticalAlign: 'middle', borderRight: '1px solid rgba(27,42,74,0.05)' }}>
                            {isEditing ? (
                              <InlineStatusEditor
                                address={row.address}
                                currentStatus={row.status}
                                currentDate={row.dateClosed}
                                onSave={(status, date) => {
                                  updateStatus.mutate({ address: row.address, status, date });
                                  setEditingAddress(null);
                                }}
                                onCancel={() => setEditingAddress(null)}
                                isSaving={updateStatus.isPending}
                              />
                            ) : (
                              <StatusBadge status={val} />
                            )}
                          </td>
                        );
                      }

                      // Address column — primary, serif
                      if (col.key === 'address') {
                        return (
                          <td key={col.key} style={{ padding: '10px 12px', verticalAlign: 'middle', borderRight: '1px solid rgba(27,42,74,0.05)' }}>
                            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '0.92rem', lineHeight: 1.3 }}>{val}</div>
                          </td>
                        );
                      }

                      // Price column — bold
                      if (col.key === 'price') {
                        return (
                          <td key={col.key} style={{ padding: '10px 12px', verticalAlign: 'middle', borderRight: '1px solid rgba(27,42,74,0.05)' }}>
                            <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#FAF8F4', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em' }}>{val || '—'}</span>
                          </td>
                        );
                      }

                      // Checkmark columns (ersSigned, signs, photos, zillowShowcase)
                      if (['ersSigned', 'signs', 'photos', 'zillowShowcase'].includes(col.key)) {
                        const isChecked = val === '✓' || val === 'Yes' || val === 'TRUE' || val === '1';
                        return (
                          <td key={col.key} style={{ padding: '10px 12px', verticalAlign: 'middle', textAlign: 'center', borderRight: '1px solid rgba(27,42,74,0.05)' }}>
                            {val ? (
                              <span style={{ color: isChecked ? '#228B22' : '#7a8a8e', fontSize: '0.8rem', fontFamily: '"Source Sans 3", sans-serif' }}>
                                {isChecked ? '✓' : val}
                              </span>
                            ) : (
                              <span style={{ color: '#ddd', fontSize: '0.7rem' }}>—</span>
                            )}
                          </td>
                        );
                      }

                      // Default text cell
                      return (
                        <td key={col.key} style={{ padding: '10px 12px', verticalAlign: 'middle', borderRight: '1px solid rgba(27,42,74,0.05)' }}>
                          <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: val ? 'rgba(250,248,244,0.75)' : 'rgba(250,248,244,0.3)', fontSize: '0.8rem' }}>
                            {val || '—'}
                          </span>
                        </td>
                      );
                    })}

                    {/* Actions column */}
                    <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {!isEditing && (
                          <button
                            onClick={() => setEditingAddress(row.address)}
                            className="text-[8px] uppercase tracking-widest hover:text-[#947231] transition-colors"
                            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#bbb', letterSpacing: '0.12em', whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                          >
                            Edit Status
                          </button>
                        )}
                        {isAuthenticated && !isEditing && (
                          <button
                            onClick={() => setReportingAddress(row.address)}
                            className="text-[8px] uppercase tracking-widest hover:text-[#1B2A4A] transition-colors"
                            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.12em', whiteSpace: 'nowrap', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                          >
                            + Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, color: '#947231', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          LIVE · SERVER-PROXIED · SINGLE SOURCE OF TRUTH
        </span>
        <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.7rem', color: '#7a8a8e', fontStyle: 'italic' }}>
          {dealRows.length} deal{dealRows.length !== 1 ? 's' : ''} · refreshes every 60s
        </span>
      </div>

      {/* Property Report Modal */}
      {reportingAddress && (
        <PropertyReportModal
          address={reportingAddress}
          onClose={() => setReportingAddress(null)}
        />
      )}
    </div>
  );
}

// ─── Add Deal Form ───────────────────────────────────────────────────────────

const TOWNS = ['East Hampton', 'Southampton', 'Bridgehampton', 'Sagaponack', 'Water Mill', 'Sag Harbor', 'Montauk', 'Amagansett', 'Springs', 'Wainscott', 'Hampton Bays', 'Other'];
const TYPES = ['Residential', 'Land', 'Commercial', 'Condo', 'Co-op', 'Rental'];
const STATUSES = ['Active', 'In Contract', 'Closed', 'Watch', 'Dead'];
const SIDES = ['Buyer', 'Seller', 'Dual'];

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
        <button
          onClick={() => setOpen(true)}
          style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#947231', background: '#1B2A4A', border: '1px solid #947231', borderRadius: 4, padding: '7px 18px', cursor: 'pointer' }}
        >
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
            <div>
              <label style={labelStyle}>Town</label>
              <select style={inputStyle} value={form.town} onChange={e => set('town', e.target.value)}>
                {TOWNS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price</label>
              <input style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} placeholder="$2,500,000" />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Agent</label>
              <input style={inputStyle} value={form.agent} onChange={e => set('agent', e.target.value)} placeholder="Ed Bruehl" />
            </div>
            <div>
              <label style={labelStyle}>Side</label>
              <select style={inputStyle} value={form.side} onChange={e => set('side', e.target.value)}>
                {SIDES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>ERS Signed</label>
              <input style={inputStyle} value={form.ersSigned} onChange={e => set('ersSigned', e.target.value)} placeholder="✓ or date" />
            </div>
            <div>
              <label style={labelStyle}>EELI Link</label>
              <input style={inputStyle} value={form.eeliLink} onChange={e => set('eeliLink', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label style={labelStyle}>Date Closed</label>
              <input style={inputStyle} type="date" value={form.dateClosed} onChange={e => set('dateClosed', e.target.value)} />
            </div>
          </div>
          {error && (
            <div style={{ marginTop: 12, fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.78rem', color: '#c0392b', background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 4, padding: '6px 10px' }}>
              {error}
            </div>
          )}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => append.mutate(form)}
              disabled={!form.address.trim() || append.isPending}
              style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FAF8F4', background: append.isPending ? '#7a8a8e' : '#1B2A4A', border: '1px solid #1B2A4A', borderRadius: 4, padding: '7px 20px', cursor: !form.address.trim() || append.isPending ? 'not-allowed' : 'pointer', opacity: !form.address.trim() ? 0.5 : 1 }}
            >
              {append.isPending ? 'Adding…' : 'Add to Sheet'}
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7a8a8e', background: 'transparent', border: '1px solid #D3D1C7', borderRadius: 4, padding: '7px 16px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// // ─── Import from Profile Button ─────────────────────────────────────────────

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
    onError: (err) => {
      toast.error(`Import failed: ${err.message}`);
    },
  });
  return (
    <div className="mb-4">
      <button
        onClick={() => { setResult(null); importMutation.mutate(); }}
        disabled={importMutation.isPending}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded border transition-colors"
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          letterSpacing: '0.12em',
          fontSize: 10,
          textTransform: 'uppercase',
          background: 'transparent',
          borderColor: '#947231',
          color: '#947231',
          opacity: importMutation.isPending ? 0.7 : 1,
          cursor: importMutation.isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {importMutation.isPending ? (
          <><span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" style={{ borderTopColor: 'transparent' }} /> Syncing Profile…</>
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

// ─── Main Component ─────────────────────────────────────────────

export default function PipeTab() {
  const utils = trpc.useUtils();
  const handleDealAdded = useCallback(() => {
    utils.pipe.sheetDeals.invalidate();
  }, [utils]);

  // R-QUIET-AND-PENDING: suppress duplicate section header labels at render time
  const _seenSectionLabels = new Set<string>();
  const dedupedFiltered = filtered.filter(row => {
    if (!row.isSectionHeader) return true;
    const label = (row.address ?? '').toUpperCase().trim();
    if (_seenSectionLabels.has(label)) return false;
    _seenSectionLabels.add(label);
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>

      {/* Full pipeline table */}
      <div className="px-6 py-8" style={{ background: 'rgba(13,27,42,0.5)' }}>
        <div style={{ maxWidth: 'var(--frame-max-w)', margin: '0 auto' }}>
          {/* Action buttons row */}
          <div className="flex items-center gap-3 mb-4">
            <AddDealForm onSuccess={handleDealAdded} />
            <ImportFromProfileButton onSuccess={handleDealAdded} />
          </div>
          {/* Framed pipeline table */}
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
            <PipelineTable />
          </div>
        </div>{/* /frame-max-w */}
      </div>
    </div>
  );
}
