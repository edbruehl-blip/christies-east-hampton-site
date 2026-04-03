/**
 * Local Charity Tracker — Sprint 7 Item 3
 * Two cause areas: Highway 27 Safety + East Hampton Affordable Housing
 * Displayed as an INTEL Layer 3 card with live Google Sheet embed
 * and curated static data for key initiatives.
 */

import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface CharityInitiative {
  id: string;
  cause: "highway27" | "housing";
  name: string;
  org: string;
  status: "Active" | "Monitoring" | "Opportunity";
  description: string;
  christiesAngle: string;
  contact?: string;
  link?: string;
}

const INITIATIVES: CharityInitiative[] = [
  // HIGHWAY 27 SAFETY
  {
    id: "hwy27-vision",
    cause: "highway27",
    name: "Vision Zero East Hampton",
    org: "East Hampton Town",
    status: "Active",
    description: "Town-led initiative to eliminate traffic fatalities on Montauk Highway (Route 27). Pedestrian crossings, speed enforcement, and median improvements from Southampton to Montauk.",
    christiesAngle: "Route 27 corridor directly affects property values in Bridgehampton, Wainscott, and East Hampton Village. Safety improvements support year-round residency and UHNW buyer confidence.",
    link: "https://www.easthamptontown.org",
  },
  {
    id: "hwy27-bike",
    cause: "highway27",
    name: "South Fork Bikeway Coalition",
    org: "South Fork Bikeway Coalition",
    status: "Active",
    description: "Advocates for protected bike lanes and pedestrian paths parallel to Route 27. Key project: Bridgehampton to East Hampton Village separated path.",
    christiesAngle: "Bikeable corridors increase walkability scores and support the wellness-oriented buyer profile that dominates the $5M+ market.",
    link: "https://www.southforkbikeway.org",
  },
  {
    id: "hwy27-lights",
    cause: "highway27",
    name: "Montauk Highway Lighting Project",
    org: "Suffolk County / East Hampton Town",
    status: "Monitoring",
    description: "Multi-year project to install pedestrian-scale lighting on unlit stretches of Route 27 between Bridgehampton and Amagansett. Reduces nighttime pedestrian fatalities.",
    christiesAngle: "Dark stretches between hamlets are a safety liability. Lighting improvements support the year-round market and workforce housing corridors.",
  },
  // EAST HAMPTON AFFORDABLE HOUSING
  {
    id: "housing-community",
    cause: "housing",
    name: "East Hampton Community Housing Fund",
    org: "East Hampton Town",
    status: "Active",
    description: "Voter-approved 0.5% real estate transfer tax dedicated to affordable housing. Funds acquisition of land and construction of workforce units. Active since 2022.",
    christiesAngle: "Christie's supports workforce housing as a market stabilizer. Teacher, firefighter, and service worker housing directly enables the luxury market to function year-round.",
    link: "https://www.easthamptontown.org/community-housing",
  },
  {
    id: "housing-peconic",
    cause: "housing",
    name: "Peconic Land Trust — Workforce Housing",
    org: "Peconic Land Trust",
    status: "Active",
    description: "Acquires and preserves land for affordable housing in addition to conservation. Partners with East Hampton Town on workforce unit development near hamlet centers.",
    christiesAngle: "Land trust model aligns with Christie's conservation easement expertise. Potential co-sponsorship opportunity for CIREG.",
    link: "https://www.peconiclandtrust.org",
  },
  {
    id: "housing-habitat",
    cause: "housing",
    name: "Habitat for Humanity — East End",
    org: "Habitat for Humanity of Suffolk",
    status: "Opportunity",
    description: "Builds affordable homes for qualifying families on the East End. Active projects in Riverhead and Southampton; exploring East Hampton expansion.",
    christiesAngle: "Sponsorship opportunity. Christie's brand association with Habitat reinforces community roots and differentiates from transactional brokerages.",
    contact: "info@habitatsuffolk.org",
    link: "https://www.habitatsuffolk.org",
  },
  {
    id: "housing-lisc",
    cause: "housing",
    name: "LISC Long Island — Affordable Housing",
    org: "Local Initiatives Support Corporation",
    status: "Monitoring",
    description: "Provides financing and technical assistance for affordable housing developers on Long Island. Active in East Hampton and Southampton Town corridors.",
    christiesAngle: "LISC relationships open doors to workforce housing developers who need luxury market expertise for mixed-income projects.",
    link: "https://www.lisc.org/long-island",
  },
];

const CAUSE_LABELS = {
  highway27: { label: "Highway 27 Safety", color: "#C8AC78", icon: "⟶" },
  housing: { label: "Affordable Housing", color: "#1B2A4A", icon: "⌂" },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Active: { bg: "rgba(200,172,120,0.12)", color: "#C8AC78" },
  Monitoring: { bg: "rgba(27,42,74,0.08)", color: "#1B2A4A" },
  Opportunity: { bg: "rgba(34,139,34,0.08)", color: "#228B22" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function LocalCharityTracker() {
  const [activeCause, setActiveCause] = useState<"all" | "highway27" | "housing">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visible = activeCause === "all"
    ? INITIATIVES
    : INITIATIVES.filter(i => i.cause === activeCause);

  const highway27Count = INITIATIVES.filter(i => i.cause === "highway27").length;
  const housingCount = INITIATIVES.filter(i => i.cause === "housing").length;
  const activeCount = INITIATIVES.filter(i => i.status === "Active").length;
  const opportunityCount = INITIATIVES.filter(i => i.status === "Opportunity").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <div className="uppercase mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78', letterSpacing: '0.22em', fontSize: 10 }}>
          Community Intelligence
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>
          Local Charity Tracker · East Hampton
        </div>
        <div style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e', fontSize: '0.78rem' }}>
          Highway 27 safety initiatives and East Hampton affordable housing programs. Christie's community presence.
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Initiatives", value: INITIATIVES.length },
          { label: "Active", value: activeCount },
          { label: "Opportunities", value: opportunityCount },
          { label: "Cause Areas", value: 2 },
        ].map(stat => (
          <div key={stat.label} className="text-center p-3 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.08)' }}>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 700, fontSize: '1.4rem' }}>
              {stat.value}
            </div>
            <div className="text-[9px] uppercase tracking-widest" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#7a8a8e' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: "all" as const, label: `All (${INITIATIVES.length})` },
          { key: "highway27" as const, label: `Highway 27 (${highway27Count})` },
          { key: "housing" as const, label: `Housing (${housingCount})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveCause(tab.key)}
            className="px-3 py-1 text-[9px] uppercase tracking-widest border transition-all"
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              letterSpacing: '0.16em',
              background: activeCause === tab.key ? '#1B2A4A' : 'transparent',
              color: activeCause === tab.key ? '#C8AC78' : '#384249',
              borderColor: activeCause === tab.key ? '#C8AC78' : '#D3D1C7',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Initiative cards */}
      <div className="flex flex-col gap-2">
        {visible.map(initiative => {
          const causeInfo = CAUSE_LABELS[initiative.cause];
          const statusStyle = STATUS_STYLES[initiative.status];
          const isExpanded = expandedId === initiative.id;

          return (
            <div
              key={initiative.id}
              className="rounded-sm cursor-pointer transition-all"
              style={{
                background: isExpanded ? 'rgba(200,172,120,0.04)' : 'rgba(27,42,74,0.02)',
                border: `1px solid ${isExpanded ? 'rgba(200,172,120,0.3)' : 'rgba(27,42,74,0.1)'}`,
                padding: '12px 16px',
              }}
              onClick={() => setExpandedId(isExpanded ? null : initiative.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', background: statusStyle.bg, color: statusStyle.color, letterSpacing: '0.14em' }}
                    >
                      {initiative.status}
                    </span>
                    <span
                      className="inline-block px-2 py-0.5 text-[8px] uppercase tracking-widest"
                      style={{ fontFamily: '"Barlow Condensed", sans-serif', background: 'rgba(27,42,74,0.06)', color: causeInfo.color, letterSpacing: '0.14em' }}
                    >
                      {causeInfo.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1B2A4A', fontWeight: 600, fontSize: '0.92rem' }}>
                    {initiative.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#7a8a8e' }}>
                    {initiative.org}
                  </div>
                </div>
                <div className="shrink-0 text-xs" style={{ color: '#C8AC78', fontFamily: '"Barlow Condensed", sans-serif' }}>
                  {isExpanded ? '▲' : '▼'}
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(200,172,120,0.15)' }}>
                  <div className="mb-3">
                    <div className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78' }}>
                      Initiative
                    </div>
                    <div className="text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
                      {initiative.description}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-[10px] uppercase tracking-widest mb-1" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78' }}>
                      Christie's Angle
                    </div>
                    <div className="text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
                      {initiative.christiesAngle}
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {initiative.link && (
                      <a
                        href={initiative.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="px-3 py-1.5 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#1B2A4A] hover:text-[#FAF8F4]"
                        style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#C8AC78', color: '#1B2A4A', letterSpacing: '0.14em', textDecoration: 'none' }}
                      >
                        Visit Website ↗
                      </a>
                    )}
                    {initiative.contact && (
                      <a
                        href={`mailto:${initiative.contact}`}
                        onClick={e => e.stopPropagation()}
                        className="px-3 py-1.5 text-[9px] uppercase tracking-widest border transition-colors hover:bg-[#C8AC78] hover:text-[#1B2A4A]"
                        style={{ fontFamily: '"Barlow Condensed", sans-serif', borderColor: '#1B2A4A', color: '#1B2A4A', letterSpacing: '0.14em', textDecoration: 'none' }}
                      >
                        Contact ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strategic note */}
      <div className="mt-5 p-4 rounded-sm" style={{ background: 'rgba(27,42,74,0.03)', border: '1px solid rgba(27,42,74,0.1)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: '"Barlow Condensed", sans-serif', color: '#C8AC78' }}>
          Christie's Community Position
        </div>
        <div className="text-xs leading-relaxed" style={{ fontFamily: '"Source Sans 3", sans-serif', color: '#1B2A4A' }}>
          Christie's East Hampton is not a seasonal brokerage. Community investment in Highway 27 safety and workforce housing is a market-making position — it signals year-round commitment and differentiates CIREG from transactional competitors. These causes align directly with the UHNW buyer profile: safety, sustainability, and community permanence.
        </div>
      </div>
    </div>
  );
}
