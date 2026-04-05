/**
 * IntelligenceWebTabs — Sprint 8 · April 3, 2026
 *
 * Three filtered views of the Intelligence Web Google Sheet:
 *   Jarvis_Top_Agents  — TIER 1 RECRUITs only
 *   Whale_Intelligence — WHALE entity type
 *   Auction_Referrals  — PARTNER + INSTITUTION types
 *
 * Data source: trpc.intel.webEntities (reads Intelligence Web sheet via service account)
 * Read-only display. No edit UI.
 */
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { MatrixCard } from '@/components/MatrixCard';

// ─── Types ────────────────────────────────────────────────────────────────────
interface IntelEntity {
  entityName: string;
  entityType: string;
  tier: string;
  currentFirm: string;
  territory: string;
  connection1: string;
  connection2: string;
  connection3: string;
  connectionType: string;
  status: string;
  lastIntelDate: string;
  notes: string;
  owner: string;
  archetypeMatch: string;
  audience: string;
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
type TabKey = 'jarvis' | 'whale' | 'auction';

const TABS: { key: TabKey; label: string; sublabel: string }[] = [
  { key: 'jarvis',  label: 'Jarvis Top Agents',   sublabel: 'Tier 1 Recruits' },
  { key: 'whale',   label: 'Whale Intelligence',   sublabel: 'UHNW & Media' },
  { key: 'auction', label: 'Auction Referrals',    sublabel: 'Partners & Institutions' },
];

function filterEntities(entities: IntelEntity[], tab: TabKey): IntelEntity[] {
  switch (tab) {
    case 'jarvis':
      return entities.filter(e =>
        e.entityType.toUpperCase() === 'RECRUIT' &&
        e.tier.toUpperCase() === 'TIER 1'
      );
    case 'whale':
      return entities.filter(e =>
        e.entityType.toUpperCase() === 'WHALE'
      );
    case 'auction':
      return entities.filter(e => {
        const t = e.entityType.toUpperCase();
        return t === 'PARTNER' || t === 'INSTITUTION';
      });
    default:
      return entities;
  }
}

// ─── Status badge colors ──────────────────────────────────────────────────────
function statusStyle(status: string): React.CSSProperties {
  const s = status.toUpperCase();
  if (s.includes('ACTIVE') || s.includes('WARM'))
    return { background: '#1B2A4A', color: '#C8AC78' };
  if (s.includes('COLD'))
    return { background: 'rgba(27,42,74,0.06)', color: '#7a8a8e' };
  if (s.includes('TRACKING'))
    return { background: 'rgba(200,172,120,0.12)', color: '#8a7040' };
  return { background: 'rgba(27,42,74,0.06)', color: '#7a8a8e' };
}

// ─── Single entity card ───────────────────────────────────────────────────────
function EntityCard({ entity }: { entity: IntelEntity }) {
  const connections = [entity.connection1, entity.connection2, entity.connection3]
    .filter(Boolean)
    .join(', ');

  return (
    <MatrixCard variant="default" className="p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem', lineHeight: 1.35 }}>
            {entity.entityName}
          </div>
          {entity.currentFirm && (
            <div className="text-xs mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
              {entity.currentFirm}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {entity.status && (
            <span
              className="px-3 py-1 text-[9px] uppercase tracking-widest"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.18em', ...statusStyle(entity.status) }}
            >
              {entity.status}
            </span>
          )}
          {entity.tier && (
            <span
              className="px-2 py-0.5 text-[8px] uppercase tracking-widest"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.14em', border: '1px solid rgba(200,172,120,0.3)', color: '#8a7040' }}
            >
              {entity.tier}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {entity.territory && (
          <div>
            <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>
              Territory
            </div>
            <div className="text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>
              {entity.territory}
            </div>
          </div>
        )}
        {connections && (
          <div>
            <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>
              Connection Type
            </div>
            <div className="text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>
              {connections}
            </div>
          </div>
        )}
        {entity.archetypeMatch && (
          <div className="col-span-2">
            <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>
              Archetype Match
            </div>
            <div className="text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>
              {entity.archetypeMatch}
            </div>
          </div>
        )}
      </div>

      {entity.notes && (
        <div className="mt-3 pt-3 border-t text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', borderColor: 'rgba(27,42,74,0.08)' }}>
          {entity.notes}
        </div>
      )}
    </MatrixCard>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function IntelligenceWebTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('jarvis');
  const { data, isLoading, error } = trpc.intel.webEntities.useQuery();

  const entities: IntelEntity[] = data?.entities ?? [];
  const filtered = filterEntities(entities, activeTab);

  const sheetUrl = `https://docs.google.com/spreadsheets/d/1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0/edit`;

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
            Intelligence Web
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem' }}>
            Relationship Intelligence Database
          </div>
        </div>
        <a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: 'rgba(200,172,120,0.4)', color: '#8a7040', letterSpacing: '0.16em' }}
        >
          Open Sheet
        </a>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'rgba(200,172,120,0.25)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-5 py-3 text-left transition-colors"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              borderBottom: activeTab === tab.key ? '2px solid #C8AC78' : '2px solid transparent',
              color: activeTab === tab.key ? '#1B2A4A' : '#7a8a8e',
              background: 'transparent',
              cursor: 'pointer',
              marginBottom: -1,
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: 9, color: activeTab === tab.key ? '#C8AC78' : 'rgba(122,138,142,0.6)', letterSpacing: '0.12em', marginTop: 1 }}>
              {tab.sublabel}
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex items-center gap-3 py-8" style={{ color: '#7a8a8e' }}>
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C8AC78', borderTopColor: 'transparent' }} />
          <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.8rem' }}>Loading Intelligence Web…</span>
        </div>
      )}

      {!isLoading && (error || data?.error) && (
        <div className="py-6 px-4 border-l-2" style={{ borderColor: 'rgba(200,172,120,0.4)', background: 'rgba(200,172,120,0.04)' }}>
          <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.8rem' }}>
            Intelligence Web sheet not yet shared with service account. Share{' '}
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C8AC78', textDecoration: 'underline' }}>
              this sheet
            </a>{' '}
            with <strong>christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com</strong> (Viewer access) to activate live data.
          </div>
        </div>
      )}

      {!isLoading && !error && !data?.error && filtered.length === 0 && (
        <div className="py-6" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.8rem' }}>
          No entities found for this filter.
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(122,138,142,0.6)', letterSpacing: '0.14em' }}>
            {filtered.length} {filtered.length === 1 ? 'entity' : 'entities'}
          </div>
          {filtered.map((entity, i) => (
            <EntityCard key={`${entity.entityName}-${i}`} entity={entity} />
          ))}
        </div>
      )}
    </div>
  );
}
