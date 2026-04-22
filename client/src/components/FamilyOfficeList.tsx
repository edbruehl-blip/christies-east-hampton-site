import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Data ─────────────────────────────────────────────────────────────────────

export interface FamilyOfficePrincipal {
  id: string;
  tier: 1 | 2 | 3 | 4 | 5;
  tierLabel: string;
  name: string;
  familyOffice: string;
  property: string;
  netWorth: string;
  christiesAngle: string;
  approach: string;
}

const PRINCIPALS: FamilyOfficePrincipal[] = [
  // TIER 1 — FURTHER LANE
  {
    id: "rosenstein",
    tier: 1,
    tierLabel: "Further Lane",
    name: "Marc Rosenstein",
    familyOffice: "Rosenstein Family Office",
    property: "Further Lane, East Hampton — $147M (2014, all-time Hamptons record)",
    netWorth: "$2B+",
    christiesAngle: "Adjacent parcels suggest appetite for land assembly. Long-term Further Lane presence.",
    approach: "Activist investor, long-term Hamptons presence",
  },
  {
    id: "cohen",
    tier: 1,
    tierLabel: "Further Lane",
    name: "Steve Cohen",
    familyOffice: "Cohen Private Ventures (Point72)",
    property: "52 Further Lane — $60M (2013), demolished and rebuilt 2016",
    netWorth: "$21B+",
    christiesAngle: "One of the world's largest private art collections. Direct Christie's auction house relationship.",
    approach: "Art collector, NY Mets owner, sports and culture",
  },
  {
    id: "blavatnik",
    tier: 1,
    tierLabel: "Further Lane",
    name: "Len Blavatnik",
    familyOffice: "Access Industries",
    property: "408 Further Lane — $115M (2025), single-parcel Hamptons record",
    netWorth: "$35B+",
    christiesAngle: "Highest recent transaction on the East End. Warner Music / culture overlap.",
    approach: "Multi-sector: Warner Music, film, energy, tech",
  },
  {
    id: "gagosian",
    tier: 1,
    tierLabel: "Further Lane",
    name: "Larry Gagosian",
    familyOffice: "Gagosian Gallery (private)",
    property: "Further Lane estate, adjacent to Blavatnik",
    netWorth: "$600M+",
    christiesAngle: "19 galleries globally. Direct art world overlap with Christie's auction house.",
    approach: "World's most powerful art dealer",
  },
  // TIER 2 — SAGAPONACK / BRIDGEHAMPTON
  {
    id: "tepper",
    tier: 2,
    tierLabel: "Sagaponack / Bridgehampton",
    name: "David Tepper",
    familyOffice: "Appaloosa Management (converting to family office)",
    property: "Sagaponack estate — built after demolishing $40M Corzine home",
    netWorth: "$21B+",
    christiesAngle: "Sagaponack — highest median price zip code in US. New construction buyer profile.",
    approach: "NFL owner (Carolina Panthers), macro hedge fund",
  },
  {
    id: "schwarzman",
    tier: 2,
    tierLabel: "Sagaponack / Bridgehampton",
    name: "Stephen Schwarzman",
    familyOffice: "Schwarzman Family (Blackstone)",
    property: "Former Further Lane estate (sold to Semel, then Blavatnik)",
    netWorth: "$45B+",
    christiesAngle: "Known Christie's auction house patron. Blackstone co-founder.",
    approach: "PE titan, philanthropist, arts patron",
  },
  // TIER 3 — GEORGICA POND / EH VILLAGE
  {
    id: "perelman",
    tier: 3,
    tierLabel: "Georgica Pond",
    name: "Ron Perelman",
    familyOffice: "MacAndrews & Forbes",
    property: "Georgica Pond estate",
    netWorth: "$3B+",
    christiesAngle: "Major art collector. Christie's auction buyer. Revlon / LBO pioneer.",
    approach: "Leveraged buyout pioneer, art collector",
  },
  {
    id: "macklowe",
    tier: 3,
    tierLabel: "Georgica Pond",
    name: "Harry Macklowe",
    familyOffice: "Macklowe Properties",
    property: "Georgica Pond estate — listed $35M, January 2026",
    netWorth: "$1B+",
    christiesAngle: "Active seller — potential listing opportunity. NYC real estate developer.",
    approach: "NYC real estate developer, active seller",
  },
  // TIER 4 — EUROPEAN FAMILY OFFICES
  {
    id: "geneva-fo",
    tier: 4,
    tierLabel: "European Family Offices",
    name: "Geneva-Based Family Office",
    familyOffice: "Unnamed — Swiss wealth",
    property: "Georgica Pond estate — $47M off-market (August 2023)",
    netWorth: "Undisclosed",
    christiesAngle: "Off-market buyer. Christie's private client network is the correct channel. Geopolitical hedging into USD assets.",
    approach: "Discretion-first. No broker opens, no listing photos.",
  },
  {
    id: "european-pattern",
    tier: 4,
    tierLabel: "European Family Offices",
    name: "Swiss / German / UK Pattern",
    familyOffice: "Multiple unnamed offices",
    property: "Increasing off-market acquisitions across the East End",
    netWorth: "Undisclosed",
    christiesAngle: "Christie's 1766 provenance is the warm introduction. Private client network only.",
    approach: "Motivated by geopolitical uncertainty, USD diversification",
  },
  // TIER 5 — BROADER SOUTH FORK
  {
    id: "druckenmiller",
    tier: 5,
    tierLabel: "Broader East End",
    name: "Stan Druckenmiller",
    familyOffice: "Duquesne Family Office (~$4.49B AUM)",
    property: "Southampton area presence",
    netWorth: "$6B+",
    christiesAngle: "Long-term Hamptons resident. Philanthropist. Macro legend (Soros CIO).",
    approach: "Converted from hedge fund 2010, macro investor",
  },
  {
    id: "griffin",
    tier: 5,
    tierLabel: "Broader East End",
    name: "Ken Griffin",
    familyOffice: "Griffin Family Office (Citadel)",
    property: "Meadow Lane, Southampton — $84M Calvin Klein compound (2020)",
    netWorth: "$45B+",
    christiesAngle: "Meadow Lane — adjacent to East Hampton market. Largest US political donor.",
    approach: "Citadel founder, expanding Hamptons footprint",
  },
];

const TIER_COLORS: Record<number, { bg: string; border: string; label: string }> = {
  1: { bg: "rgba(200,172,120,0.08)", border: "#947231", label: "I" },
  2: { bg: "rgba(27,42,74,0.06)", border: "#1B2A4A", label: "II" },
  3: { bg: "rgba(27,42,74,0.04)", border: "rgba(27,42,74,0.3)", label: "III" },
  4: { bg: "rgba(27,42,74,0.03)", border: "rgba(27,42,74,0.2)", label: "IV" },
  5: { bg: "rgba(27,42,74,0.02)", border: "rgba(27,42,74,0.15)", label: "V" },
};

// ─── Letter Template ───────────────────────────────────────────────────────────

function buildLetter(principal: FamilyOfficePrincipal): string {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${today}

${principal.name}
${principal.familyOffice}

Dear ${principal.name.split(" ")[0]},

James Christie opened the doors at Pall Mall in 1766 with a single conviction: the family's interest comes before the sale. Not the commission. Not the close. The family.

That principle has guided every transaction Christie's has conducted for 260 years — and it is the standard we carry into the East Hampton market today.

The East End is not a market. It is a territory — eleven distinct hamlets, each with its own character, its own price corridor, its own buyer. Your presence at ${principal.property.split("—")[0].trim()} places you at the center of the most concentrated wealth corridor in the northeastern United States.

Christie's International Real Estate Group represents the institutional standard in this market. We evaluate every property on five lenses: price trajectory, land scarcity, school district quality, transaction velocity, and Christie's institutional adjacency. There is no gray area in institutional real estate.

I would welcome the opportunity to introduce you to the Christie's standard — and to share what the data says about your position in this market.

Respectfully,

Ed Bruehl
Managing Director
Christie's East Hampton
26 Park Place, East Hampton, NY 11937
646-752-1233
edbruehl@christiesrealestategroup.com

Art. Beauty. Provenance. · Since 1766.`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FamilyOfficeList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [letterVisible, setLetterVisible] = useState<string | null>(null);
  const [addingToPipe, setAddingToPipe] = useState<string | null>(null);
  const appendSheet = trpc.pipe.appendSheet.useMutation();

  const selectedPrincipal = PRINCIPALS.find(p => p.id === selectedId) ?? null;
  const letterPrincipal = PRINCIPALS.find(p => p.id === letterVisible) ?? null;

  const handleAddToPipe = async (principal: FamilyOfficePrincipal) => {
    setAddingToPipe(principal.id);
    try {
      await appendSheet.mutateAsync({
        address: `${principal.name} — ${principal.familyOffice}`,
        town: principal.tierLabel,
        type: "Buyer",
        status: "Prospect",
        agent: "Ed Bruehl",
        notes: principal.christiesAngle,
      } as any);
      toast.success(`${principal.name} added to the Office Pipeline Sheet.`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to add to pipeline.");
    } finally {
      setAddingToPipe(null);
    }
  };

  // Group by tier
  const tiers = [1, 2, 3, 4, 5] as const;
  const byTier = (t: number) => PRINCIPALS.filter(p => p.tier === t);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231', letterSpacing: '0.22em', fontSize: 10 }}>
          Family Office Intelligence
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>
          UHNW Principal Registry · East End
        </div>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem' }}>
          12 principals across 5 tiers. Select any principal to view the Christie's letter template or add to the Office Pipeline.
        </div>
      </div>

      {/* Tier groups */}
      {tiers.map(tier => {
        const principals = byTier(tier);
        if (principals.length === 0) return null;
        const colors = TIER_COLORS[tier];
        return (
          <div key={tier} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex items-center justify-center text-[10px] font-bold"
                style={{
                  width: 22, height: 22, borderRadius: 2,
                  background: colors.bg, border: `1px solid ${colors.border}`,
                  fontFamily: '"Barlow Condensed", sans-serif',
                  color: colors.border, letterSpacing: '0.1em',
                }}
              >
                {colors.label}
              </div>
              <div className="uppercase text-[10px] tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e' }}>
                Tier {tier} · {principals[0].tierLabel}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {principals.map(p => (
                <div
                  key={p.id}
                  className="rounded-sm cursor-pointer transition-all"
                  style={{
                    background: selectedId === p.id ? colors.bg : 'rgba(27,42,74,0.02)',
                    border: `1px solid ${selectedId === p.id ? colors.border : 'rgba(27,42,74,0.1)'}`,
                    padding: '14px 16px',
                  }}
                  onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.95rem' }}>
                          {p.name}
                        </span>
                        <span style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.72rem' }}>
                          {p.familyOffice}
                        </span>
                        <span
                          className="inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest"
                          style={{ fontFamily: '"Barlow Condensed", sans-serif', background: 'rgba(200,172,120,0.12)', color: '#947231', letterSpacing: '0.14em' }}
                        >
                          {p.netWorth}
                        </span>
                      </div>
                      <div className="mt-1 text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                        {p.property}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs" style={{ color: '#947231', fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: '0.1em' }}>
                      {selectedId === p.id ? '▲' : '▼'}
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {selectedId === p.id && (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(200,172,120,0.2)' }}>
                      <div className="mb-3">
                        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
                          Christie's Angle
                        </div>
                        <div className="text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
                          {p.christiesAngle}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
                          Approach
                        </div>
                        <div className="text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
                          {p.approach}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={(e) => { e.stopPropagation(); setLetterVisible(letterVisible === p.id ? null : p.id); }}
                          className="px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
                          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#1B2A4A', letterSpacing: '0.16em' }}
                        >
                          {letterVisible === p.id ? 'Close Letter' : 'View Letter'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddToPipe(p); }}
                          disabled={addingToPipe === p.id}
                          className="px-4 py-2 text-[10px] uppercase tracking-widest border transition-colors hover:bg-[#947231] hover:text-[#1B2A4A] disabled:opacity-50"
                          style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.16em' }}
                        >
                          {addingToPipe === p.id ? 'Adding…' : 'Add to Pipeline'}
                        </button>
                      </div>

                      {/* Letter template */}
                      {letterVisible === p.id && (
                        <div
                          className="mt-4 p-4 rounded-sm"
                          style={{ background: '#FAF8F4', border: '1px solid rgba(200,172,120,0.3)' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
                              Ed Bruehl · James Christie Letter Template
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(buildLetter(p));
                                toast.success("Letter copied to clipboard.");
                              }}
                              className="px-3 py-1 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
                              style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#947231', color: '#1B2A4A', letterSpacing: '0.14em' }}
                            >
                              Copy
                            </button>
                          </div>
                          <pre
                            className="text-xs leading-relaxed whitespace-pre-wrap"
                            style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}
                          >
                            {buildLetter(p)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Key Insights */}
      <div className="mt-6 p-4 rounded-sm" style={{ background: 'rgba(200,172,120,0.06)', border: '1px solid rgba(200,172,120,0.25)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-3" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#947231' }}>
          Strategic Intelligence
        </div>
        <div className="flex flex-col gap-2">
          {[
            "Further Lane is the primary target corridor — Rosenstein, Cohen, Blavatnik, Gagosian all present. Any listing at $20M+ on Further Lane is a Christie's-first opportunity.",
            "European family offices are the stealth buyers — off-market, no publicity, motivated by geopolitical hedging. Christie's 1766 provenance is the correct introduction.",
            "Art world overlap — Cohen, Gagosian, Schwarzman, Blavatnik all have direct Christie's auction house relationships. This is a warm introduction network.",
            "Sagaponack / Bridgehampton new construction — Tepper profile. Modern architecture, not historic renovation. Different pitch than Further Lane.",
          ].map((insight, i) => (
            <div key={i} className="flex gap-3">
              <div className="shrink-0 mt-0.5" style={{ color: '#947231', fontSize: '0.6rem' }}>◆</div>
              <div className="text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
                {insight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
