/**
 * IntelligenceWebTabs — Sprint 14 · April 6, 2026
 *
 * INTEL Layer 5 · Relationship Intelligence
 * Four views of the Intelligence Web Google Sheet:
 *   All Entities  — full 47-entity table with filter by type/tier/audience/last touch
 *   Jarvis_Top_Agents  — TIER 1 RECRUITs only
 *   Whale_Intelligence — WHALE entity type
 *   Auction_Referrals  — PARTNER + INSTITUTION types
 *
 * Data source: trpc.intel.webEntities (reads Intelligence Web sheet via service account)
 * Read-only display. No edit UI.
 */
import { useState, useMemo } from 'react';
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
  lastTouch?: string;
  cadence?: string;
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
type TabKey = 'all' | 'jarvis' | 'whale' | 'auction';

const TABS: { key: TabKey; label: string; sublabel: string }[] = [
  { key: 'all',     label: 'All Entities',         sublabel: 'Full Intelligence Web' },
  { key: 'jarvis',  label: 'Jarvis Top Agents',    sublabel: 'Tier 1 Recruits' },
  { key: 'whale',   label: 'Whale Intelligence',   sublabel: 'UHNW & Media' },
  { key: 'auction', label: 'Auction Referrals',    sublabel: 'Partners & Institutions' },
];

function filterByTab(entities: IntelEntity[], tab: TabKey): IntelEntity[] {
  switch (tab) {
    case 'jarvis':
      return entities.filter(e =>
        e.entityType.toUpperCase() === 'RECRUIT' &&
        e.tier.toUpperCase() === 'TIER 1'
      );
    case 'whale':
      return entities.filter(e => e.entityType.toUpperCase() === 'WHALE');
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

// ─── Entity type badge color ──────────────────────────────────────────────────
function typeBadgeStyle(type: string): React.CSSProperties {
  const t = type.toUpperCase();
  if (t === 'WHALE') return { background: 'rgba(200,172,120,0.18)', color: '#8a7040', border: '1px solid rgba(200,172,120,0.4)' };
  if (t === 'RECRUIT') return { background: 'rgba(27,42,74,0.12)', color: '#1B2A4A', border: '1px solid rgba(27,42,74,0.25)' };
  if (t === 'PARTNER') return { background: 'rgba(56,66,73,0.08)', color: '#384249', border: '1px solid rgba(56,66,73,0.2)' };
  if (t === 'INSTITUTION') return { background: 'rgba(56,66,73,0.08)', color: '#384249', border: '1px solid rgba(56,66,73,0.2)' };
  if (t === 'RELATIONSHIP_INTELLIGENCE') return { background: 'rgba(200,172,120,0.08)', color: '#8a7040', border: '1px solid rgba(200,172,120,0.2)' };
  return { background: 'rgba(27,42,74,0.06)', color: '#7a8a8e', border: '1px solid rgba(27,42,74,0.1)' };
}

// ─── Single entity card (used in Jarvis / Whale / Auction tabs) ───────────────
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

// ─── Full table row (used in All Entities tab) ────────────────────────────────
function TableRow({ entity, index }: { entity: IntelEntity; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded(x => !x)}
        className="cursor-pointer transition-colors"
        style={{
          background: index % 2 === 0 ? 'rgba(27,42,74,0.02)' : 'transparent',
          borderBottom: '1px solid rgba(27,42,74,0.06)',
        }}
      >
        {/* # */}
        <td className="py-2.5 px-3 text-[10px]" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(122,138,142,0.5)', width: 32 }}>
          {index + 1}
        </td>
        {/* Name + Firm */}
        <td className="py-2.5 px-3" style={{ minWidth: 160 }}>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>
            {entity.entityName}
          </div>
          {entity.currentFirm && (
            <div className="text-[10px] mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
              {entity.currentFirm}
            </div>
          )}
        </td>
        {/* Type */}
        <td className="py-2.5 px-3">
          {entity.entityType && (
            <span
              className="px-2 py-0.5 text-[8px] uppercase tracking-widest whitespace-nowrap"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.14em', ...typeBadgeStyle(entity.entityType) }}
            >
              {entity.entityType.replace(/_/g, ' ')}
            </span>
          )}
        </td>
        {/* Tier */}
        <td className="py-2.5 px-3 text-[10px] uppercase tracking-wider" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#8a7040', letterSpacing: '0.12em' }}>
          {entity.tier}
        </td>
        {/* Status */}
        <td className="py-2.5 px-3">
          {entity.status && (
            <span
              className="px-2 py-0.5 text-[8px] uppercase tracking-widest whitespace-nowrap"
              style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.14em', ...statusStyle(entity.status) }}
            >
              {entity.status}
            </span>
          )}
        </td>
        {/* Audience */}
        <td className="py-2.5 px-3 text-[10px]" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', maxWidth: 160 }}>
          {entity.audience?.replace(/_/g, ' ')}
        </td>
        {/* Last Touch */}
        <td className="py-2.5 px-3 text-[10px] whitespace-nowrap" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(122,138,142,0.7)', letterSpacing: '0.06em' }}>
          {entity.lastTouch || entity.lastIntelDate || '—'}
        </td>
        {/* Expand indicator */}
        <td className="py-2.5 px-3 text-[10px]" style={{ color: 'rgba(200,172,120,0.5)', width: 24 }}>
          {expanded ? '▲' : '▼'}
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: 'rgba(200,172,120,0.04)', borderBottom: '1px solid rgba(200,172,120,0.12)' }}>
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-xs">
              {entity.territory && (
                <div>
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Territory</div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{entity.territory}</div>
                </div>
              )}
              {[entity.connection1, entity.connection2, entity.connection3].filter(Boolean).length > 0 && (
                <div>
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Connections</div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>
                    {[entity.connection1, entity.connection2, entity.connection3].filter(Boolean).join(' · ')}
                  </div>
                </div>
              )}
              {entity.archetypeMatch && (
                <div>
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Archetype Match</div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{entity.archetypeMatch}</div>
                </div>
              )}
              {entity.cadence && (
                <div>
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Cadence</div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>{entity.cadence}</div>
                </div>
              )}
              {entity.notes && (
                <div className="col-span-2">
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>Notes</div>
                  <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', lineHeight: 1.6 }}>{entity.notes}</div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── All Entities table with filters ─────────────────────────────────────────
function AllEntitiesTable({ entities }: { entities: IntelEntity[] }) {
  const [typeFilter, setTypeFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [touchFilter, setTouchFilter] = useState('');

  // Derive unique values for filter dropdowns
  const types = useMemo(() => {
    const s = new Set(entities.map(e => e.entityType).filter(Boolean));
    return Array.from(s).sort();
  }, [entities]);

  const tiers = useMemo(() => {
    const s = new Set(entities.map(e => e.tier).filter(Boolean));
    return Array.from(s).sort();
  }, [entities]);

  const audiences = useMemo(() => {
    const s = new Set(
      entities.flatMap(e => (e.audience || '').split(',').map(a => a.trim())).filter(Boolean)
    );
    return Array.from(s).sort();
  }, [entities]);

  const filtered = useMemo(() => {
    return entities.filter(e => {
      if (typeFilter && e.entityType !== typeFilter) return false;
      if (tierFilter && e.tier !== tierFilter) return false;
      if (audienceFilter && !(e.audience || '').includes(audienceFilter)) return false;
      if (touchFilter) {
        const touch = e.lastTouch || e.lastIntelDate || '';
        if (!touch.toLowerCase().includes(touchFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [entities, typeFilter, tierFilter, audienceFilter, touchFilter]);

  const selectStyle: React.CSSProperties = {
    fontFamily: '"Barlow Condensed", sans-serif',
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: 'transparent',
    border: '1px solid rgba(200,172,120,0.3)',
    color: '#8a7040',
    padding: '4px 8px',
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(122,138,142,0.6)', letterSpacing: '0.16em' }}>
          Filter:
        </div>

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={selectStyle}>
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
        </select>

        <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={selectStyle}>
          <option value="">All Tiers</option>
          {tiers.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={audienceFilter} onChange={e => setAudienceFilter(e.target.value)} style={selectStyle}>
          <option value="">All Audiences</option>
          {audiences.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
        </select>

        <input
          type="text"
          placeholder="Last touch date…"
          value={touchFilter}
          onChange={e => setTouchFilter(e.target.value)}
          style={{ ...selectStyle, minWidth: 140 }}
        />

        {(typeFilter || tierFilter || audienceFilter || touchFilter) && (
          <button
            onClick={() => { setTypeFilter(''); setTierFilter(''); setAudienceFilter(''); setTouchFilter(''); }}
            className="text-[9px] uppercase tracking-widest px-3 py-1"
            style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.14em', color: '#C8AC78', border: '1px solid rgba(200,172,120,0.3)', background: 'transparent', cursor: 'pointer' }}
          >
            Clear
          </button>
        )}

        <div className="ml-auto text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(122,138,142,0.5)', letterSpacing: '0.12em' }}>
          {filtered.length} / {entities.length} entities
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(200,172,120,0.3)' }}>
              {['#', 'Name', 'Type', 'Tier', 'Status', 'Audience', 'Last Touch', ''].map(h => (
                <th key={h} className="py-2 px-3 text-left text-[9px] uppercase tracking-widest"
                  style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em', fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 px-3 text-center text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                  No entities match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((entity, i) => (
                <TableRow key={`${entity.entityName}-${i}`} entity={entity} index={i} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function IntelligenceWebTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const { data, isLoading, error } = trpc.intel.webEntities.useQuery();

  const entities: IntelEntity[] = data?.entities ?? [];
  const filtered = filterByTab(entities, activeTab);

  const sheetUrl = `https://docs.google.com/spreadsheets/d/1eELH_ZVBMB2wBa9sqQM0Bfxtzu80Am0d21UiIXJpAO0/edit`;

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
            Layer 5 · Relationship Intelligence
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem' }}>
            Intelligence Web · Full Entity Database
          </div>
        </div>
        <a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4] hover:border-[#1B2A4A]"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: 'rgba(200,172,120,0.4)', color: '#8a7040', letterSpacing: '0.16em' }}
        >
          Open Sheet ↗
        </a>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b mb-6" style={{ borderColor: 'rgba(200,172,120,0.25)', overflowX: 'auto' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-5 py-3 text-left transition-colors shrink-0"
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

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-3 py-8" style={{ color: '#7a8a8e' }}>
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C8AC78', borderTopColor: 'transparent' }} />
          <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: '0.8rem' }}>Loading Intelligence Web…</span>
        </div>
      )}

      {/* Error */}
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

      {/* Content */}
      {!isLoading && !error && !data?.error && (
        <>
          {activeTab === 'all' ? (
            <AllEntitiesTable entities={entities} />
          ) : (
            <>
              {filtered.length === 0 && (
                <div className="py-6" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.8rem' }}>
                  No entities found for this filter.
                </div>
              )}
              {filtered.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: 'rgba(122,138,142,0.6)', letterSpacing: '0.14em' }}>
                    {filtered.length} {filtered.length === 1 ? 'entity' : 'entities'}
                  </div>
                  {filtered.map((entity, i) => (
                    <EntityCard key={`${entity.entityName}-${i}`} entity={entity} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
