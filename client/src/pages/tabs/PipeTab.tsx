/**
 * PIPE TAB — Sprint 2 · March 31, 2026
 *
 * Primary surface: real Office Pipeline Google Sheet embedded full-width, tall
 * Secondary surface: database-backed quick-add UI above the sheet (custom rows survive refresh)
 *
 * Sheet ID (locked): 1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M
 * Rule: Sheet is primary. Custom UI sits above. Sheet is never replaced by fake UI.
 */

import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';

// ─── Sheet config ─────────────────────────────────────────────────────────────

const OFFICE_PIPELINE_SHEET_ID = '1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M';

function sheetEmbedUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit?usp=sharing&rm=minimal&widget=true&headers=false`;
}

function sheetOpenUrl(id: string) {
  return `https://docs.google.com/spreadsheets/d/${id}/edit`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PipeType = 'Deal' | 'Listing' | 'Buyer' | 'Seller' | 'Attorney' | 'Developer' | 'Referral' | 'Press' | 'Other';
type PipeStatus = 'Active' | 'Watch' | 'Critical' | 'Stalled' | 'Closed' | 'Dead';

interface PipeRow {
  id: number;
  address: string;
  hamlet: string;
  type: string;
  status: string;
  askPrice: string;
  dom: number;
  notes: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string }> = {
  'Active':   { bg: 'rgba(200,172,120,0.12)', color: '#8a6f3e', dot: '#C8AC78' },
  'Watch':    { bg: 'rgba(224,123,57,0.12)',  color: '#9a5a20', dot: '#e07b39' },
  'Critical': { bg: 'rgba(192,57,43,0.12)',   color: '#8b2515', dot: '#c0392b' },
  'Stalled':  { bg: 'rgba(120,138,142,0.12)', color: '#4a5a5e', dot: '#7a8a8e' },
  'Closed':   { bg: 'rgba(27,42,74,0.08)',    color: '#1B2A4A', dot: '#1B2A4A' },
  'Dead':     { bg: 'rgba(180,180,180,0.1)',  color: '#aaa',    dot: '#ccc' },
};

const TYPE_OPTIONS: PipeType[] = ['Deal', 'Listing', 'Buyer', 'Seller', 'Attorney', 'Developer', 'Referral', 'Press', 'Other'];
const STATUS_OPTIONS: PipeStatus[] = ['Active', 'Watch', 'Critical', 'Stalled', 'Closed', 'Dead'];
const HAMLET_OPTIONS = ['East Hampton Village', 'Sagaponack', 'Bridgehampton', 'Water Mill', 'Southampton Village', 'Sag Harbor', 'Amagansett', 'Springs', 'East Hampton Town', 'Montauk'];

// ─── Quick-add form ───────────────────────────────────────────────────────────

const BLANK_FORM = { address: '', hamlet: 'East Hampton Village', type: 'Deal' as PipeType, status: 'Active' as PipeStatus, askPrice: '', dom: 0, notes: '' };

function QuickAddRow({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState(BLANK_FORM);
  const [open, setOpen] = useState(false);

  const upsert = trpc.pipe.upsert.useMutation({
    onSuccess: () => { setForm(BLANK_FORM); setOpen(false); onAdded(); },
  });

  const f = (k: keyof typeof form, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  if (!open) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.16em' }}
        >
          + Add to Custom Tracker
        </button>
        <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.72rem', color: '#7a8a8e', fontStyle: 'italic' }}>
          Local Draft — not synced to Pipeline Sheet
        </span>
      </div>
    );
  }

  return (
    <div className="border p-4 mb-4" style={{ borderColor: 'rgba(200,172,120,0.4)', background: '#fff' }}>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          placeholder="Address"
          value={form.address}
          onChange={e => f('address', e.target.value)}
          className="border px-3 py-2 text-sm"
          style={{ borderColor: '#D3D1C7', fontFamily: '"Source Sans 3", sans-serif' }}
        />
        <select value={form.hamlet} onChange={e => f('hamlet', e.target.value)}
          className="border px-3 py-2 text-sm" style={{ borderColor: '#D3D1C7', fontFamily: '"Source Sans 3", sans-serif' }}>
          {HAMLET_OPTIONS.map(h => <option key={h}>{h}</option>)}
        </select>
        <select value={form.type} onChange={e => f('type', e.target.value as PipeType)}
          className="border px-3 py-2 text-sm" style={{ borderColor: '#D3D1C7', fontFamily: '"Source Sans 3", sans-serif' }}>
          {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={form.status} onChange={e => f('status', e.target.value as PipeStatus)}
          className="border px-3 py-2 text-sm" style={{ borderColor: '#D3D1C7', fontFamily: '"Source Sans 3", sans-serif' }}>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <input
          placeholder="Ask Price"
          value={form.askPrice}
          onChange={e => f('askPrice', e.target.value)}
          className="border px-3 py-2 text-sm"
          style={{ borderColor: '#D3D1C7', fontFamily: '"Source Sans 3", sans-serif' }}
        />
        <input
          placeholder="DOM"
          type="number"
          value={form.dom}
          onChange={e => f('dom', parseInt(e.target.value) || 0)}
          className="border px-3 py-2 text-sm"
          style={{ borderColor: '#D3D1C7', fontFamily: '"Source Sans 3", sans-serif' }}
        />
      </div>
      <input
        placeholder="Notes"
        value={form.notes}
        onChange={e => f('notes', e.target.value)}
        className="w-full border px-3 py-2 text-sm mb-3"
        style={{ borderColor: '#D3D1C7', fontFamily: '"Source Sans 3", sans-serif' }}
      />
      <div className="flex gap-2">
        <button
          onClick={() => upsert.mutate({ ...form, sortOrder: 999 })}
          disabled={!form.address || upsert.isPending}
          className="px-5 py-2 text-[10px] uppercase tracking-widest"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', background: '#1B2A4A', color: '#C8AC78', letterSpacing: '0.16em', opacity: !form.address ? 0.5 : 1 }}
        >
          {upsert.isPending ? 'Saving…' : '✓ Save'}
        </button>
        <button
          onClick={() => { setOpen(false); setForm(BLANK_FORM); }}
          className="px-4 py-2 text-[10px] uppercase tracking-widest border"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#D3D1C7', color: '#7a8a8e', letterSpacing: '0.16em' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Custom tracker table (database rows) ─────────────────────────────────────

function CustomTrackerTable() {
  const { data: rows = [], refetch } = trpc.pipe.list.useQuery();
  const deleteMutation = trpc.pipe.delete.useMutation({ onSuccess: () => refetch() });

  if (rows.length === 0) return (
    <div className="py-6 text-center text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
      No custom entries yet. Add one above.
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: '#1B2A4A' }}>
            {['Address', 'Hamlet', 'Type', 'Status', 'Ask Price', 'DOM', 'Notes', ''].map(h => (
              <th key={h} className="px-3 py-2 text-left text-[9px] uppercase tracking-widest"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.14em', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(rows as PipeRow[]).map((row, i) => {
            const sc = STATUS_CONFIG[row.status] ?? STATUS_CONFIG['Active'];
            return (
              <tr key={row.id} style={{ background: i % 2 === 0 ? '#fff' : '#FAF8F4', borderBottom: '1px solid rgba(27,42,74,0.06)' }}>
                <td className="px-3 py-2" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.9rem' }}>
                  {row.address}
                </td>
                <td className="px-3 py-2" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249', fontSize: '0.8rem' }}>
                  {row.hamlet}
                </td>
                <td className="px-3 py-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#384249', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                  {row.type}
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif', background: sc.bg, color: sc.color, letterSpacing: '0.12em' }}>
                    <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: sc.dot, marginRight: 4, verticalAlign: 'middle' }} />
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.82rem' }}>
                  {row.askPrice}
                </td>
                <td className="px-3 py-2 text-center" style={{ fontFamily: 'monospace', color: '#7a8a8e', fontSize: '0.78rem' }}>
                  {row.dom}
                </td>
                <td className="px-3 py-2 max-w-[200px]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.notes}
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteMutation.mutate({ id: row.id })}
                    className="text-[9px] uppercase tracking-widest hover:text-red-600 transition-colors"
                    style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#bbb', letterSpacing: '0.1em' }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
            Primary operating surface · Live · Editable · Source of truth
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

      {/* Full-width tall iframe — 75vh so it fills the laptop screen */}
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
          Live Sheet · Primary
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PipeTab() {
  const { refetch } = trpc.pipe.list.useQuery();

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Daily Driver · Pipeline · Active Deals · Buyers · Sellers
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>Pipeline</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          Office Pipeline sheet is the primary surface. Custom tracker above for quick-add entries.
        </p>
      </div>

      <div className="px-6 py-8">

        {/* Custom Tracker — quick-add UI above the sheet */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
                Custom Tracker · Database-backed · Survives refresh
              </div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem' }}>
                Quick-Add Entries
              </div>
            </div>
          </div>
          <QuickAddRow onAdded={refetch} />
          <CustomTrackerTable />
        </div>

        {/* Divider */}
        <div className="mb-8 border-t" style={{ borderColor: 'rgba(200,172,120,0.3)' }} />

        {/* Primary: Office Pipeline Sheet */}
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
