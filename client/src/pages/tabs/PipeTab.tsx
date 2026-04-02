/**
 * PIPE TAB — Sprint 6 · April 2, 2026
 *
 * Architecture: Google Sheet is the SINGLE SOURCE OF TRUTH.
 * - Top panel: live deal cards read from Sheet via tRPC (pipe.sheetDeals)
 * - Status update panel: writes directly to Sheet via pipe.updateSheetStatus
 * - Bottom: full-width Sheet embed for direct editing
 *
 * Sheet ID (locked): 1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';

// ─── Sheet config ─────────────────────────────────────────────────────────────

const OFFICE_PIPELINE_SHEET_ID = '1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M';

function sheetEmbedUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing&rm=minimal&widget=true&headers=false`;
}

function sheetOpenUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  'In Contract': { bg: 'rgba(200,172,120,0.15)', color: '#8a6f3e', dot: '#C8AC78', label: 'In Contract' },
  'Active':      { bg: 'rgba(200,172,120,0.12)', color: '#8a6f3e', dot: '#C8AC78', label: 'Active' },
  'Closed':      { bg: 'rgba(27,42,74,0.08)',    color: '#1B2A4A', dot: '#1B2A4A', label: 'Closed' },
  'Watch':       { bg: 'rgba(224,123,57,0.12)',  color: '#9a5a20', dot: '#e07b39', label: 'Watch' },
  'Critical':    { bg: 'rgba(192,57,43,0.12)',   color: '#8b2515', dot: '#c0392b', label: 'Critical' },
  'Stalled':     { bg: 'rgba(120,138,142,0.12)', color: '#4a5a5e', dot: '#7a8a8e', label: 'Stalled' },
  'Dead':        { bg: 'rgba(180,180,180,0.1)',  color: '#aaa',    dot: '#ccc',    label: 'Dead' },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? { bg: 'rgba(200,172,120,0.08)', color: '#7a8a8e', dot: '#ccc', label: status };
}

const STATUS_OPTIONS = ['In Contract', 'Active', 'Closed', 'Watch', 'Critical', 'Stalled', 'Dead'];

// ─── Deal Card ────────────────────────────────────────────────────────────────

interface DealCardProps {
  address: string;
  town: string;
  type: string;
  price: string;
  status: string;
  agent: string;
  side: string;
  dateClosed: string;
  onStatusUpdate: (address: string, status: string, date?: string) => void;
  isUpdating: boolean;
}

function DealCard({ address, town, type, price, status, agent, side, dateClosed, onStatusUpdate, isUpdating }: DealCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState(status);
  const [closeDate, setCloseDate] = useState(dateClosed || '');
  const sc = getStatusConfig(status);

  const handleSave = () => {
    onStatusUpdate(address, newStatus, newStatus === 'Closed' ? closeDate : undefined);
    setEditMode(false);
  };

  return (
    <div
      className="p-4 border"
      style={{
        borderColor: 'rgba(200,172,120,0.3)',
        background: '#fff',
        borderLeft: `3px solid ${sc.dot}`,
      }}
    >
      {/* Address + side badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem', lineHeight: 1.2 }}>
            {address}
          </div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.72rem', marginTop: 2 }}>
            {town} · {type}
          </div>
        </div>
        <span
          className="px-2 py-0.5 text-[8px] uppercase tracking-widest shrink-0"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', background: side === 'Buyer' ? 'rgba(27,42,74,0.08)' : 'rgba(200,172,120,0.15)', color: side === 'Buyer' ? '#1B2A4A' : '#8a6f3e', letterSpacing: '0.14em' }}
        >
          {side}
        </span>
      </div>

      {/* Price + agent */}
      <div className="flex items-center gap-4 mb-3">
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#1B2A4A', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
          {price}
        </span>
        <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.72rem' }}>
          {agent}
        </span>
        {dateClosed && (
          <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#C8AC78', fontSize: '0.7rem', fontStyle: 'italic' }}>
            Closed {dateClosed}
          </span>
        )}
      </div>

      {/* Status row */}
      {!editMode ? (
        <div className="flex items-center justify-between">
          <span
            className="px-2 py-0.5 text-[9px] uppercase tracking-widest"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', background: sc.bg, color: sc.color, letterSpacing: '0.12em' }}
          >
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: sc.dot, marginRight: 4, verticalAlign: 'middle' }} />
            {status}
          </span>
          <button
            onClick={() => { setNewStatus(status); setEditMode(true); }}
            className="text-[8px] uppercase tracking-widest hover:text-[#C8AC78] transition-colors"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#bbb', letterSpacing: '0.12em' }}
          >
            Update Status
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            className="border px-2 py-1 text-xs"
            style={{ borderColor: '#C8AC78', fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
          {newStatus === 'Closed' && (
            <input
              type="text"
              placeholder="Close date (e.g. April 2, 2026)"
              value={closeDate}
              onChange={e => setCloseDate(e.target.value)}
              className="border px-2 py-1 text-xs flex-1"
              style={{ borderColor: '#C8AC78', fontFamily: '"Source Sans 3", sans-serif', minWidth: 160 }}
            />
          )}
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-3 py-1 text-[9px] uppercase tracking-widest"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#C8AC78', letterSpacing: '0.14em', opacity: isUpdating ? 0.6 : 1 }}
          >
            {isUpdating ? 'Saving…' : '✓ Save'}
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="px-3 py-1 text-[9px] uppercase tracking-widest border"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#D3D1C7', color: '#7a8a8e', letterSpacing: '0.14em' }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Live Deal Cards (reads from Google Sheet) ────────────────────────────────

function LiveDealCards() {
  const { data, isLoading, error, refetch } = trpc.pipe.sheetDeals.useQuery(undefined, {
    refetchInterval: 60_000, // refresh every 60s
    staleTime: 30_000,
  });

  const updateStatus = trpc.pipe.updateSheetStatus.useMutation({
    onSuccess: () => {
      setTimeout(() => refetch(), 1500); // small delay to let Sheet propagate
    },
  });

  const [updatingAddress, setUpdatingAddress] = useState<string | null>(null);

  const handleStatusUpdate = (address: string, status: string, date?: string) => {
    setUpdatingAddress(address);
    updateStatus.mutate(
      { address, status, date },
      {
        onSettled: () => setUpdatingAddress(null),
        onError: (err) => {
          console.error('Status update failed:', err);
          alert(`Update failed: ${err.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-8" style={{ color: '#7a8a8e', fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.8rem' }}>
        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C8AC78', borderTopColor: 'transparent' }} />
        Loading live deals from Sheet…
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

  const deals = (data?.deals ?? []).filter(d => !d.isSectionHeader && d.address);

  if (deals.length === 0) {
    return (
      <div className="py-6 text-center text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
        No active deals found in the Sheet.
      </div>
    );
  }

  // Group by section (buy-side vs listing-side)
  const buySide = deals.filter(d => d.side === 'Buyer' || d.side === 'Buy');
  const listingSide = deals.filter(d => d.side === 'Seller' || d.side === 'List' || d.side === 'Listing');
  const other = deals.filter(d => !buySide.includes(d) && !listingSide.includes(d));

  const renderGroup = (title: string, group: typeof deals) => {
    if (group.length === 0) return null;
    return (
      <div className="mb-6">
        <div className="mb-3 uppercase" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 9 }}>
          {title}
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {group.map(deal => (
            <DealCard
              key={deal.rowNumber}
              address={deal.address}
              town={deal.town}
              type={deal.type}
              price={deal.price}
              status={deal.status}
              agent={deal.agent}
              side={deal.side}
              dateClosed={deal.dateClosed}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={updatingAddress === deal.address}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {updateStatus.isSuccess && (
        <div className="mb-4 px-4 py-2 text-xs" style={{ background: 'rgba(27,42,74,0.06)', color: '#1B2A4A', fontFamily: '"Source Sans 3", sans-serif', borderLeft: '2px solid #C8AC78' }}>
          ✓ Sheet updated — refreshing in a moment…
        </div>
      )}
      {renderGroup('Buy-Side Deals', buySide)}
      {renderGroup('Listing-Side Deals', listingSide)}
      {renderGroup('Other', other)}
    </div>
  );
}

// ─── Office Pipeline Sheet Embed ──────────────────────────────────────────────

function OfficePipelineSheet() {
  return (
    <div style={{ border: '0.5px solid rgba(200,172,120,0.4)', borderRadius: 4, overflow: 'hidden' }}>
      {/* Sheet header bar */}
      <div className="flex items-center justify-between px-5 py-3" style={{ background: '#1B2A4A' }}>
        <div>
          <div style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>
            Office Pipeline · Master Sheet
          </div>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.45)', fontSize: 9, marginTop: 1 }}>
            Primary operating surface · Live · Editable · Single source of truth
          </div>
        </div>
        <a
          href={sheetOpenUrl(OFFICE_PIPELINE_SHEET_ID)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#C8AC78] hover:text-[#1B2A4A]"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#C8AC78', letterSpacing: '0.14em' }}
        >
          Open Full Sheet ↗
        </a>
      </div>

      {/* Full-width tall iframe */}
      <iframe
        src={sheetEmbedUrl(OFFICE_PIPELINE_SHEET_ID)}
        title="Office Pipeline"
        width="100%"
        style={{ display: 'block', height: '75vh', minHeight: 520, border: 'none' }}
        allowFullScreen
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#FAF8F4', borderTop: '0.5px solid #f0f0f0' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#ccc' }}>{OFFICE_PIPELINE_SHEET_ID}</span>
        <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 8, color: '#C8AC78', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Live Sheet · Primary · Single Source of Truth
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PipeTab() {
  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Daily Driver · Pipeline · Active Deals · Buyers · Sellers
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>Pipeline</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          Google Sheet is the single source of truth. Update deal status here — writes directly to the Sheet.
        </p>
      </div>

      <div className="px-6 py-8">

        {/* Live Deal Cards — reads from Google Sheet */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
                Live Deals · Google Sheet · Real-Time
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem' }}>
                Active Pipeline
              </div>
            </div>
            <div style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.7rem', color: '#7a8a8e', fontStyle: 'italic' }}>
              Click "Update Status" on any card to write directly to the Sheet
            </div>
          </div>
          <LiveDealCards />
        </div>

        {/* Divider */}
        <div className="mb-8 border-t" style={{ borderColor: 'rgba(200,172,120,0.3)' }} />

        {/* Primary: Office Pipeline Sheet Embed */}
        <div className="mb-2 uppercase" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Primary Surface · Office Pipeline · Master Sheet
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem', marginBottom: 16 }}>
          Office Pipeline
        </div>
        <OfficePipelineSheet />

      </div>
    </div>
  );
}
