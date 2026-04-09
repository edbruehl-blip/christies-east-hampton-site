/**
 * AttorneyDatabase — Sprint 8 · April 3, 2026
 *
 * Structured card module for INTEL Layer 3.
 * Four fields per attorney: Firm Name, Contact, Specialty, Relationship Tier.
 * Seed data: Pierre Debbas, Brian Lester, Jonathan Tarbet, Seamus McGrath.
 * Internal use only.
 */

import { MatrixCard } from '@/components/MatrixCard';

interface Attorney {
  id: string;
  contact: string;
  firm: string;
  specialty: string;
  tier: string;
  tierLabel: string;
  phone?: string;
  notes?: string;
}

const ATTORNEYS: Attorney[] = [
  {
    id: 'pierre-debbas',
    contact: 'Pierre Debbas',
    firm: 'Romer Debbas LLP',
    specialty: 'Real Estate Transactions · Luxury Residential · Commercial',
    tier: 'TIER 1',
    tierLabel: 'Inner Circle',
    notes: 'Active podcast collaborator. Credibility anchor for institutional buyer conversations. ACTIVE PARTNER status in Intelligence Web.',
  },
  {
    id: 'brian-lester',
    contact: 'Brian Lester',
    firm: 'Tarbet and Lester',
    specialty: 'Real Estate Transactions · Estate Planning · East End',
    tier: 'TIER 1',
    tierLabel: 'Active',
    notes: 'East End specialist. Attorney network connection. Active referral relationship.',
  },
  {
    id: 'jonathan-tarbet',
    contact: 'Jonathan Tarbet',
    firm: 'Tarbet and Lester',
    specialty: 'Real Estate Transactions · Estate Planning · East End',
    tier: 'TIER 1',
    tierLabel: 'Active',
    notes: 'Founding partner. East End institutional knowledge. Attorney network connection.',
  },
  {
    id: 'seamus-mcgrath',
    contact: 'Seamus McGrath',
    firm: 'Tarbet and Lester',
    specialty: 'Real Estate Transactions · East End',
    tier: 'TIER 1',
    tierLabel: 'Active',
    notes: 'Attorney network connection. Active referral relationship.',
  },
];

function tierStyle(tier: string): React.CSSProperties {
  if (tier === 'TIER 1')
    return { background: '#1B2A4A', color: '#C8AC78' };
  if (tier === 'TIER 2')
    return { background: 'rgba(27,42,74,0.08)', color: '#7a8a8e' };
  return { background: 'rgba(200,172,120,0.1)', color: '#8a7040' };
}

export function AttorneyDatabase() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 11 }}>
            Attorney Database
          </div>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem' }}>
            Real Estate Counsel · East End
          </div>
        </div>
        <span
          className="text-[9px] uppercase tracking-widest px-3 py-1.5"
          style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.16em', background: 'rgba(27,42,74,0.06)', color: '#7a8a8e' }}
        >
          Internal Only
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {ATTORNEYS.map(attorney => (
          <MatrixCard key={attorney.id} variant="default" className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1rem', lineHeight: 1.35 }}>
                  {attorney.contact}
                </div>
                <div className="text-xs mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                  {attorney.firm}
                </div>
              </div>
              <span
                className="shrink-0 px-3 py-1 text-[9px] uppercase tracking-widest"
                style={{ fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.18em', ...tierStyle(attorney.tier) }}
              >
                {attorney.tier} · {attorney.tierLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-y-2 mb-3">
              <div>
                <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.16em' }}>
                  Specialty
                </div>
                <div className="text-xs" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#384249' }}>
                  {attorney.specialty}
                </div>
              </div>
            </div>

            {attorney.notes && (
              <div className="pt-3 border-t text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', borderColor: 'rgba(27,42,74,0.08)' }}>
                {attorney.notes}
              </div>
            )}
          </MatrixCard>
        ))}
      </div>
    </div>
  );
}
