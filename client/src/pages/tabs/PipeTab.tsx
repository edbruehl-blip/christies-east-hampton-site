/**
 * PIPE TAB — Active Pipeline, Stalled Deals, and Deal Log.
 * Design: navy #1B2A4A · gold #C8AC78 · charcoal #384249 · cream #FAF8F4
 * Typography: Cormorant Garamond (headlines) · Source Sans 3 (data) · Barlow Condensed (labels)
 * Data source: Office Pipeline Google Sheet (manual sync — sheet ID locked in usePdfAssets)
 */

import { MatrixCard, StatusBadge } from '@/components/MatrixCard';

// ─── Hardcoded pipeline data (synced from Office Pipeline sheet) ──────────────

interface Listing {
  address: string;
  hamlet: string;
  price: string;
  dom: number;
  status: 'active' | 'stalled' | 'critical';
  type: string;
  notes: string;
}

const ACTIVE_LISTINGS: Listing[] = [
  { address: '11 Meadowlark Lane', hamlet: 'East Hampton', price: '$4,250,000', dom: 137, status: 'critical', type: 'ANEW Build', notes: 'Call before 10 AM Saturday — repositioning required' },
  { address: '795 N. Sea Mecox Road', hamlet: 'Water Mill', price: '$6,800,000', dom: 137, status: 'critical', type: 'Buyer Representation', notes: 'Paired with Meadowlark — simultaneous strategy review' },
  { address: '140 Hands Creek Road', hamlet: 'East Hampton', price: '$3,575,000', dom: 99, status: 'critical', type: 'ANEW Build', notes: '5–8% repositioning — first call priority' },
  { address: '18 Tara Road', hamlet: 'East Hampton', price: '$2,995,000', dom: 82, status: 'stalled', type: 'Listing', notes: 'WATCH tier — brief before Monday' },
  { address: '25 Horse Meadow Lane', hamlet: 'Bridgehampton', price: '$5,100,000', dom: 68, status: 'stalled', type: 'Listing', notes: 'WATCH tier' },
  { address: '3 Sycamore Way', hamlet: 'Southampton Village', price: '$3,200,000', dom: 52, status: 'stalled', type: 'Listing', notes: 'Monitor — approaching WATCH threshold' },
];

const DOM_THRESHOLDS = { critical: 90, stalled: 45 };

function domStatus(dom: number): 'critical' | 'stalled' | 'active' {
  if (dom >= DOM_THRESHOLDS.critical) return 'critical';
  if (dom >= DOM_THRESHOLDS.stalled) return 'stalled';
  return 'active';
}

function DomBar({ dom }: { dom: number }) {
  const pct = Math.min((dom / 150) * 100, 100);
  const color = dom >= 90 ? '#c0392b' : dom >= 45 ? '#e07b39' : '#C8AC78';
  return (
    <div className="w-full h-1.5 rounded-full mt-1" style={{ background: 'rgba(27,42,74,0.1)' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function PipeTab() {
  const criticalCount = ACTIVE_LISTINGS.filter(l => l.dom >= 90).length;
  const stalledCount  = ACTIVE_LISTINGS.filter(l => l.dom >= 45 && l.dom < 90).length;
  const activeCount   = ACTIVE_LISTINGS.filter(l => l.dom < 45).length;

  return (
    <div className="min-h-screen" style={{ background: '#FAF8F4' }}>

      {/* Header */}
      <div className="px-6 py-8 border-b" style={{ background: '#1B2A4A', borderColor: '#C8AC78' }}>
        <div className="uppercase mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>Office Pipeline</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#FAF8F4', fontWeight: 400, fontSize: '1.75rem' }}>Active Pipeline</h2>
        <p className="mt-2 text-sm" style={{ fontFamily: '"Source Sans 3", sans-serif', color: 'rgba(250,248,244,0.6)' }}>
          Synced from Office Pipeline Google Sheet · Last updated March 27, 2026
        </p>
      </div>

      <div className="px-6 py-8" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Critical DOM 90+', value: criticalCount, color: '#c0392b' },
            { label: 'Stalled DOM 45–89', value: stalledCount, color: '#e07b39' },
            { label: 'Active DOM < 45', value: activeCount, color: '#C8AC78' },
          ].map(item => (
            <MatrixCard key={item.label} variant="default" className="p-5 text-center">
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: '"Cormorant Garamond", serif', color: item.color }}>{item.value}</div>
              <div className="uppercase text-[10px]" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#384249', letterSpacing: '0.16em' }}>{item.label}</div>
            </MatrixCard>
          ))}
        </div>

        {/* Listings */}
        <div className="uppercase mb-5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
          Active Listings — DOM Tracker
        </div>
        <div className="flex flex-col gap-3 mb-10">
          {ACTIVE_LISTINGS.map(listing => {
            const status = domStatus(listing.dom);
            const badgeVariant = status === 'critical' ? 'critical' : status === 'stalled' ? 'alert' : 'active';
            return (
              <MatrixCard key={listing.address} variant={status === 'critical' ? 'alert' : 'default'} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.0625rem' }}>
                        {listing.address}
                      </span>
                      <StatusBadge variant={badgeVariant}>{listing.hamlet}</StatusBadge>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-semibold" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{listing.price}</span>
                      <span className="uppercase text-[10px]" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', letterSpacing: '0.12em' }}>{listing.type}</span>
                    </div>
                    <DomBar dom={listing.dom} />
                    {listing.notes && (
                      <div className="mt-2 text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>{listing.notes}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold" style={{ fontFamily: '"Cormorant Garamond", serif', color: listing.dom >= 90 ? '#c0392b' : listing.dom >= 45 ? '#e07b39' : '#C8AC78' }}>
                      {listing.dom}
                    </div>
                    <div className="uppercase text-[9px]" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e', letterSpacing: '0.14em' }}>DOM</div>
                  </div>
                </div>
              </MatrixCard>
            );
          })}
        </div>

        {/* Google Sheet link */}
        <div className="text-center">
          <a
            href="https://docs.google.com/spreadsheets/d/1VPjIYPaHXoXQ3rvCn_Wx3nVAUWzM0hBuHhZV92mFz7M/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 text-xs uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.18em' }}
          >
            Open Office Pipeline Sheet
          </a>
        </div>

      </div>
    </div>
  );
}
