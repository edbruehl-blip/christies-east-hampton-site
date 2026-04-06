/**
 * InstitutionalMindMap
 * ─────────────────────────────────────────────────────────────────────────────
 * INTEL Layer 1 · Institutional Mind Map
 * Faithful React/SVG port of Christies_Intelligence_Web_Locked(3).html
 *
 * Node data is seeded from the canonical HTML spec (org reports April 6, 2026).
 * The component also accepts live `intelRows` from the Intelligence Web sheet
 * (readIntelWebRows) to overlay status badges and notes from the live sheet.
 *
 * Architecture:
 *  - Pure SVG rendered in React — no iframe, no canvas, no external lib
 *  - Hover: tooltip + connected-line highlight + dim unconnected nodes
 *  - View toggle: Full Web | Hierarchy Only | Recruits | Whales
 *  - Org reports data (Artémis → Christie's → CIH → CIREG) in INSTITUTIONAL_SPINE
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = "HIERARCHY" | "RECRUIT" | "PARTNER" | "WHALE" | "ATTORNEY" | "RELATIONSHIP_INTELLIGENCE";
type NodeStatus = "ACTIVE" | "WARM" | "COLD";
type ConnectionStyle = "hierarchy" | "partner" | "recruit" | "whale" | "social";
type ViewMode = "full" | "hierarchy" | "recruit" | "whale";

interface MapNode {
  id: string;
  name: string;
  title: string;
  type: NodeType;
  status: NodeStatus;
  note: string;
  x: number;
  y: number;
  r: number;
}

interface MapConnection {
  from: string;
  to: string;
  style: ConnectionStyle;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  node: MapNode | null;
}

// ─── Canonical Node Data (from Intelligence Web Locked v3 + April 6 org reports) ──

const NODES: MapNode[] = [
  // ── INSTITUTIONAL SPINE — Artémis → Christie's → CIH → CIREG ───────────────

  // Artémis / Pinault crown
  { id: "artemis",  name: "Artémis S.A.",          title: "Pinault Family Holding Company · Paris",         type: "HIERARCHY", status: "ACTIVE", note: "Ultimate parent of Christie's global brand. François Pinault (père) + François-Henri Pinault (fils). Wholly family-owned.", x: 600, y: 55, r: 22 },
  { id: "pinault",  name: "François-Henri Pinault", title: "Chair, Christie's Board · Artémis",              type: "HIERARCHY", status: "ACTIVE", note: "Ultimate owner. Stepped back from Kering CEO Sept 2025. Director of CIH.", x: 600, y: 130, r: 20 },

  // Christie's Auction House spine (left track)
  { id: "lash",     name: "Stephen Lash",           title: "Chairman Emeritus, Christie's New York",         type: "HIERARCHY", status: "ACTIVE", note: "At Christie's since 1976. Founder of Christie's North America. Ed's senior relationship.", x: 330, y: 220, r: 16 },
  { id: "brennan",  name: "Bonnie Brennan",          title: "CEO, Christie's Auction House",                  type: "HIERARCHY", status: "ACTIVE", note: "Appointed CEO Feb 2025. Former Regional President Americas. Succeeded Guillaume Cerutti.", x: 420, y: 310, r: 18 },
  { id: "tash",     name: "Tash Perrin",             title: "Deputy Chairman, Christie's International",      type: "HIERARCHY", status: "ACTIVE", note: "Trusts, Estates & Appraisals. At Christie's since 1998. Bridge to estate advisory.", x: 390, y: 420, r: 17 },

  // CIH / CIRE spine (right track)
  { id: "cih",      name: "Christie's Intl Plc",    title: "Christie's International Holdings (CIH)",        type: "HIERARCHY", status: "ACTIVE", note: "Intermediate holding entity. Manages brand license for real estate activities. Wholly owned by Artémis.", x: 780, y: 220, r: 18 },
  { id: "reffkin",  name: "Robert Reffkin",          title: "CEO, Compass / CIH · CIRE Brand License",       type: "HIERARCHY", status: "ACTIVE", note: "Controls CIRE + Sotheby's IR brand licenses under CIH.", x: 820, y: 310, r: 16 },
  { id: "ilija",    name: "Ilija Pavlović",          title: "Owner & CEO, CIREG Tri-State",                   type: "HIERARCHY", status: "ACTIVE", note: "30+ offices, ~1,200 agents, $4B+ annual volume. Appointed Ed Bruehl Nov 2025.", x: 760, y: 420, r: 20 },
  { id: "melissa",  name: "Melissa True",            title: "Team Leader · Christie's NYC Flatiron",          type: "HIERARCHY", status: "ACTIVE", note: "CIREG colleague. Father: Richard True, Palm Beach builder. Key referral node.", x: 700, y: 530, r: 15 },
  { id: "sherri",   name: "Sherri Balassone",        title: "VP Corporate Broker · BOR East Hampton",        type: "HIERARCHY", status: "ACTIVE", note: "Licensed NY Bar attorney. BOR for East Hampton.", x: 700, y: 630, r: 15 },

  // ED — center anchor
  { id: "ed",       name: "Ed Bruehl",               title: "Managing Director · Christie's East Hampton",   type: "HIERARCHY", status: "ACTIVE", note: "$1B+ career sales. 20+ years East End. Est. 1766 standard. 26 Park Place.", x: 600, y: 750, r: 30 },

  // Christie's East Hampton Team
  { id: "jarvis",   name: "Jarvis Slade Jr.",        title: "COO · Operations",                              type: "HIERARCHY", status: "ACTIVE", note: "Former COO, CIRE global. Former President, A&K. 50/50 origination partner.", x: 480, y: 860, r: 15 },
  { id: "zoila",    name: "Zoila Ortega Astor",      title: "Office Manager",                                type: "HIERARCHY", status: "ACTIVE", note: "Office operations, client relations, culture.", x: 600, y: 880, r: 13 },
  { id: "angel",    name: "Angel Theodore",          title: "Junior Partner",                                type: "HIERARCHY", status: "ACTIVE", note: "Intelligence and operations. Full-time.", x: 720, y: 860, r: 13 },
  { id: "sebastian",name: "Sebastian Mobo",          title: "Broker",                                        type: "HIERARCHY", status: "ACTIVE", note: "Christie's East Hampton broker.", x: 600, y: 980, r: 11 },

  // Auction House Partner Bridge
  { id: "gooding",  name: "David Gooding",           title: "President, Gooding Christie's",                 type: "PARTNER",   status: "ACTIVE", note: "Automotive auction division acquired by Christie's 2025. The Bridge Hamptons car show. UHNW collector pipeline.", x: 220, y: 480, r: 14 },

  // ── WHALES — left cluster ───────────────────────────────────────────────────
  { id: "lily",     name: "Lily Fan",                title: "Family Office · Private",                       type: "WHALE",     status: "ACTIVE", note: "Whale #1. 140 Hands Creek (ANEW), 18 Tara Rd, $20-22M Brooklyn portfolio.", x: 100, y: 600, r: 17 },
  { id: "moeser",   name: "Rick Moeser",             title: "Premier Estate Properties · UHNW",              type: "WHALE",     status: "ACTIVE", note: "Former CIRE Exec Director 17 years. UHNW intelligence source.", x: 100, y: 700, r: 14 },
  { id: "ingrao",   name: "Tony Ingrao",             title: "Principal, Ingrao Inc.",                        type: "WHALE",     status: "ACTIVE", note: "Interior design. Baccarat Hotel. Huntting Lane EH. UHNW buyer network.", x: 130, y: 790, r: 13 },
  { id: "schnepps", name: "Josh Schnepps",           title: "CEO, Schneps Media · Dan's Papers",             type: "WHALE",     status: "ACTIVE", note: "$2K/month pilot active. Heath Freeman connection. 61K+ email subscribers.", x: 180, y: 880, r: 14 },
  { id: "freeman",  name: "Heath Freeman",           title: "Alden Capital · EHP Resort",                    type: "WHALE",     status: "ACTIVE", note: "Owns EHP Resort & Marina, Harbor Bistro. Josh Schnepps' closest friend.", x: 130, y: 970, r: 14 },
  { id: "murray",   name: "Art Murray",              title: "Flambeaux Wine · TOWN Dinners",                 type: "WHALE",     status: "ACTIVE", note: "Flambeaux investor pitch. Mayacama Vintner seat. TOWN dinner engine.", x: 260, y: 940, r: 13 },

  // ── RECRUITS — bottom left ──────────────────────────────────────────────────
  { id: "clark",       name: "Marilyn Clark",        title: "Sotheby's Bridgehampton · Archetype",           type: "RECRUIT",   status: "WARM",   note: "WARM. East Hampton native. 26+ year producer.", x: 310, y: 760, r: 13 },
  { id: "brenneman",   name: "Debbie Brenneman",     title: "Corcoran East Hampton · Tier 1",                type: "RECRUIT",   status: "COLD",   note: "Multi-Million Dollar Club. Top 1% NRT nationally. Neighbor at 51 Main St.", x: 310, y: 860, r: 13 },
  { id: "c_esposito",  name: "Charlie Esposito",     title: "Corcoran East Hampton · Tier 1",                type: "RECRUIT",   status: "COLD",   note: "Compass-merger exposed. Team anchor. Negotiating specialist.", x: 250, y: 880, r: 12 },
  { id: "m_esposito",  name: "Michael Esposito",     title: "Corcoran East Hampton · Tier 2",                type: "RECRUIT",   status: "COLD",   note: "Charlie's son. Growing producer. Avg sale $3.42M.", x: 340, y: 920, r: 11 },
  { id: "baris",       name: "Nola Baris",           title: "Sotheby's East Hampton · Archetype",            type: "RECRUIT",   status: "COLD",   note: "The Baris Team. Family practice. Educator-turned-broker. Compass-merger exposed.", x: 280, y: 960, r: 11 },

  // Frank Newbold — RELATIONSHIP_INTELLIGENCE (not a recruit, not cold outreach)
  { id: "newbold",     name: "Frank Newbold",        title: "Christie's International RE · Brand",           type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE", note: "Comes through the brand. RELATIONSHIP_INTELLIGENCE — not cold outreach, not Jarvis pipeline.", x: 420, y: 760, r: 13 },

  // ── ATTORNEYS — bottom right ────────────────────────────────────────────────
  { id: "debbas",   name: "Pierre Debbas",           title: "Romer Debbas LLP · Podcast Co-Host",            type: "ATTORNEY",  status: "ACTIVE", note: "Manhattan + Hamptons RE law. Co-host The Bruehl Report. Ep. 1 live.", x: 900, y: 820, r: 15 },
  { id: "lester",   name: "Brian Lester",            title: "Tarbet & Lester PLLC · Partner",                type: "ATTORNEY",  status: "ACTIVE", note: "Trusts, estates, RE litigation. East Hampton. Every major transaction.", x: 960, y: 900, r: 13 },
  { id: "tarbet",   name: "Jonathan Tarbet",         title: "Tarbet & Lester PLLC · Founding Partner",       type: "ATTORNEY",  status: "ACTIVE", note: "Land use, zoning, EH Town history. 132 N Main St East Hampton.", x: 1040, y: 850, r: 13 },
  { id: "mcgrath",  name: "Seamus McGrath",          title: "Tarbet & Lester PLLC · Associate",              type: "ATTORNEY",  status: "ACTIVE", note: "RE law. East Hampton. Active on East End transactions.", x: 1000, y: 940, r: 11 },
];

const CONNECTIONS: MapConnection[] = [
  // Artémis crown
  { from: "artemis",  to: "pinault",    style: "hierarchy" },
  { from: "artemis",  to: "cih",        style: "hierarchy" },
  { from: "pinault",  to: "lash",       style: "hierarchy" },
  { from: "pinault",  to: "brennan",    style: "hierarchy" },

  // Auction House spine
  { from: "lash",     to: "tash",       style: "hierarchy" },
  { from: "brennan",  to: "tash",       style: "hierarchy" },
  { from: "tash",     to: "gooding",    style: "partner" },
  { from: "tash",     to: "ed",         style: "partner" },

  // CIH / CIRE spine
  { from: "cih",      to: "reffkin",    style: "hierarchy" },
  { from: "reffkin",  to: "ilija",      style: "hierarchy" },
  { from: "ilija",    to: "melissa",    style: "hierarchy" },
  { from: "melissa",  to: "sherri",     style: "hierarchy" },
  { from: "sherri",   to: "ed",         style: "hierarchy" },
  { from: "ilija",    to: "ed",         style: "hierarchy" },

  // Ed's team
  { from: "ed", to: "jarvis",           style: "hierarchy" },
  { from: "ed", to: "zoila",            style: "hierarchy" },
  { from: "ed", to: "angel",            style: "hierarchy" },
  { from: "ed", to: "sebastian",        style: "hierarchy" },

  // Ed to whales
  { from: "ed", to: "lily",             style: "whale" },
  { from: "ed", to: "moeser",           style: "whale" },
  { from: "ed", to: "ingrao",           style: "whale" },
  { from: "ed", to: "schnepps",         style: "whale" },
  { from: "ed", to: "freeman",          style: "whale" },
  { from: "ed", to: "murray",           style: "whale" },

  // Ed to recruits
  { from: "ed", to: "clark",            style: "recruit" },
  { from: "ed", to: "brenneman",        style: "recruit" },
  { from: "ed", to: "c_esposito",       style: "recruit" },
  { from: "ed", to: "m_esposito",       style: "recruit" },
  { from: "ed", to: "baris",            style: "recruit" },

  // Frank Newbold — relationship intelligence bridge
  { from: "ed", to: "newbold",          style: "partner" },

  // Ed to attorneys
  { from: "ed", to: "debbas",           style: "partner" },
  { from: "ed", to: "lester",           style: "partner" },
  { from: "ed", to: "tarbet",           style: "partner" },
  { from: "ed", to: "mcgrath",          style: "partner" },

  // Attorney cluster internal
  { from: "debbas",   to: "lester",     style: "social" },
  { from: "lester",   to: "tarbet",     style: "social" },
  { from: "lester",   to: "mcgrath",    style: "social" },
  { from: "tarbet",   to: "mcgrath",    style: "social" },

  // Whale cross-connections — TOWN dinner chain
  { from: "murray",   to: "schnepps",   style: "social" },
  { from: "schnepps", to: "freeman",    style: "social" },

  // Recruit cluster — same firm
  { from: "brenneman",  to: "c_esposito", style: "social" },
  { from: "c_esposito", to: "m_esposito", style: "social" },
];

// ─── Color Maps ───────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<NodeType, { fill: string; stroke: string; strokeWidth: number }> = {
  HIERARCHY:                { fill: "#1b2a4a", stroke: "#c8ac78", strokeWidth: 2.5 },
  RECRUIT:                  { fill: "#1A3D2A", stroke: "#2D5A3D", strokeWidth: 1.5 },
  PARTNER:                  { fill: "#2A1F0A", stroke: "#c8ac78", strokeWidth: 1.5 },
  WHALE:                    { fill: "#2A1A3D", stroke: "#7B5DAA", strokeWidth: 1.5 },
  ATTORNEY:                 { fill: "#0d2a3d", stroke: "#2a7aad", strokeWidth: 1.5 },
  RELATIONSHIP_INTELLIGENCE:{ fill: "#2A1F2A", stroke: "#9B7EC8", strokeWidth: 1.5 },
};

const LINE_STYLES: Record<ConnectionStyle, { color: string; width: number; dash: string }> = {
  hierarchy: { color: "rgba(200,172,120,0.45)", width: 1.8, dash: "" },
  partner:   { color: "rgba(200,172,120,0.2)",  width: 0.8, dash: "5,4" },
  recruit:   { color: "rgba(45,90,61,0.2)",     width: 0.8, dash: "4,4" },
  whale:     { color: "rgba(123,93,170,0.18)",  width: 0.8, dash: "4,4" },
  social:    { color: "rgba(250,248,244,0.12)", width: 0.6, dash: "2,3" },
};

const STATUS_COLORS: Record<NodeStatus, { bg: string; color: string }> = {
  ACTIVE: { bg: "rgba(45,90,61,0.4)",    color: "#6FCF97" },
  WARM:   { bg: "rgba(200,172,120,0.3)", color: "#D4A843" },
  COLD:   { bg: "rgba(74,101,165,0.3)",  color: "#7BA4D4" },
};

const SECTION_LABELS = [
  { text: "ARTÉMIS · PINAULT FAMILY",        x: 600,  y: 25  },
  { text: "AUCTION HOUSE",                    x: 340,  y: 185 },
  { text: "CHRISTIE'S INTL HOLDINGS (CIH)",  x: 860,  y: 185 },
  { text: "CIREG TRI-STATE",                  x: 760,  y: 385 },
  { text: "CHRISTIE'S EAST HAMPTON",          x: 600,  y: 715 },
  { text: "WHALES",                           x: 110,  y: 565 },
  { text: "RECRUITS",                         x: 280,  y: 730 },
  { text: "ATTORNEYS",                        x: 990,  y: 785 },
];

// ─── View filter logic ────────────────────────────────────────────────────────

function isNodeVisible(node: MapNode, view: ViewMode): boolean {
  if (view === "full") return true;
  if (view === "hierarchy") return node.type === "HIERARCHY";
  if (view === "recruit")   return node.type === "HIERARCHY" || node.type === "RECRUIT" || node.type === "RELATIONSHIP_INTELLIGENCE";
  if (view === "whale")     return node.type === "HIERARCHY" || node.type === "WHALE";
  return true;
}

function isConnectionVisible(conn: MapConnection, view: ViewMode): boolean {
  const from = NODES.find(n => n.id === conn.from);
  const to   = NODES.find(n => n.id === conn.to);
  if (!from || !to) return false;
  return isNodeVisible(from, view) && isNodeVisible(to, view);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InstitutionalMindMap() {
  const [view, setView] = useState<ViewMode>("full");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, node: null });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute connected node IDs for hover highlight
  const connectedIds = useCallback((nodeId: string): Set<string> => {
    const ids = new Set<string>([nodeId]);
    CONNECTIONS.forEach(c => {
      if (c.from === nodeId) ids.add(c.to);
      if (c.to   === nodeId) ids.add(c.from);
    });
    return ids;
  }, []);

  const handleNodeEnter = useCallback((e: React.MouseEvent, node: MapNode) => {
    setHoveredId(node.id);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    let x = e.clientX - rect.left + 16;
    let y = e.clientY - rect.top  - 10;
    if (x + 300 > rect.width)  x = e.clientX - rect.left - 316;
    if (y + 160 > rect.height) y = e.clientY - rect.top  - 160;
    setTooltip({ visible: true, x, y, node });
  }, []);

  const handleNodeMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !tooltip.node) return;
    let x = e.clientX - rect.left + 16;
    let y = e.clientY - rect.top  - 10;
    if (x + 300 > rect.width)  x = e.clientX - rect.left - 316;
    if (y + 160 > rect.height) y = e.clientY - rect.top  - 160;
    setTooltip(t => ({ ...t, x, y }));
  }, [tooltip.node]);

  const handleNodeLeave = useCallback(() => {
    setHoveredId(null);
    setTooltip({ visible: false, x: 0, y: 0, node: null });
  }, []);

  const connected = hoveredId ? connectedIds(hoveredId) : null;

  return (
    <div
      ref={containerRef}
      style={{
        background: "#1b2a4a",
        borderRadius: "8px",
        border: "1px solid rgba(200,172,120,0.2)",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{
        textAlign: "center",
        padding: "20px 24px 8px",
        borderBottom: "1px solid rgba(200,172,120,0.2)",
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          fontSize: "20px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          color: "#c8ac78",
          marginBottom: "4px",
        }}>
          Christie's Intelligence Web
        </h2>
        <p style={{
          fontSize: "10px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(250,248,244,0.4)",
        }}>
          Connecting Dots in the UHNW Marketplace · April 2026
        </p>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        padding: "8px 24px 6px",
        flexWrap: "wrap",
        borderBottom: "1px solid rgba(200,172,120,0.1)",
      }}>
        {[
          { label: "Hierarchy",    color: "#c8ac78" },
          { label: "Recruit",      color: "#2D5A3D" },
          { label: "Partner",      color: "#c8ac78" },
          { label: "Whale",        color: "#7B5DAA" },
          { label: "Attorney",     color: "#2a7aad" },
          { label: "Relationship", color: "#9B7EC8" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9px", letterSpacing: "1.2px", textTransform: "uppercase", color: "rgba(250,248,244,0.4)" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Toggle bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2px", padding: "10px 24px 14px" }}>
        {(["full", "hierarchy", "recruit", "whale"] as ViewMode[]).map((v, i, arr) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              background: view === v ? "rgba(200,172,120,0.2)" : "rgba(200,172,120,0.08)",
              border: `1px solid ${view === v ? "#c8ac78" : "rgba(200,172,120,0.2)"}`,
              color: view === v ? "#c8ac78" : "rgba(250,248,244,0.5)",
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              padding: "7px 18px",
              cursor: "pointer",
              borderRadius: i === 0 ? "4px 0 0 4px" : i === arr.length - 1 ? "0 4px 4px 0" : "0",
              transition: "all 0.2s",
            }}
          >
            {v === "full" ? "Full Web" : v === "hierarchy" ? "Hierarchy Only" : v === "recruit" ? "Recruits" : "Whales"}
          </button>
        ))}
      </div>

      {/* SVG Canvas */}
      <div style={{ padding: "0 16px 32px", overflowX: "auto" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 1200 1060"
          style={{ width: "100%", height: "auto", display: "block", minWidth: "600px" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Section labels */}
          {SECTION_LABELS.map(lbl => (
            <text
              key={lbl.text}
              x={lbl.x}
              y={lbl.y}
              textAnchor="middle"
              fill="rgba(200,172,120,0.35)"
              fontSize="11"
              letterSpacing="2.5"
              fontFamily="'Cormorant Garamond', serif"
              style={{ textTransform: "uppercase" }}
            >
              {lbl.text}
            </text>
          ))}

          {/* Connections */}
          <g className="connections">
            {CONNECTIONS.filter(c => isConnectionVisible(c, view)).map((conn, i) => {
              const from = NODES.find(n => n.id === conn.from)!;
              const to   = NODES.find(n => n.id === conn.to)!;
              const ls   = LINE_STYLES[conn.style];
              const isHighlighted = connected
                ? (connected.has(conn.from) && connected.has(conn.to))
                : true;
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  stroke={ls.color}
                  strokeWidth={isHighlighted ? ls.width + (hoveredId ? 0.8 : 0) : ls.width}
                  strokeDasharray={ls.dash || undefined}
                  opacity={connected ? (isHighlighted ? 1 : 0.05) : 1}
                  style={{ transition: "opacity 0.15s" }}
                  data-from={conn.from}
                  data-to={conn.to}
                />
              );
            })}
          </g>

          {/* Nodes */}
          {NODES.filter(n => isNodeVisible(n, view)).map(node => {
            const colors  = TYPE_COLORS[node.type];
            const isEd    = node.id === "ed";
            const isHier  = node.type === "HIERARCHY";
            const dimmed  = connected ? !connected.has(node.id) : false;

            return (
              <g
                key={node.id}
                data-id={node.id}
                style={{ cursor: "pointer", opacity: dimmed ? 0.15 : 1, transition: "opacity 0.15s" }}
                onMouseEnter={e => handleNodeEnter(e, node)}
                onMouseLeave={handleNodeLeave}
                onMouseMove={handleNodeMove}
              >
                {/* Ed glow ring */}
                {isEd && (
                  <circle
                    cx={node.x} cy={node.y}
                    r={node.r + 8}
                    fill="none"
                    stroke="rgba(200,172,120,0.15)"
                    strokeWidth="4"
                  />
                )}

                {/* Main circle */}
                <circle
                  cx={node.x} cy={node.y}
                  r={node.r}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={colors.strokeWidth}
                  style={{ filter: hoveredId === node.id ? "brightness(1.4)" : undefined }}
                />

                {/* Pinault crown ▲ */}
                {node.id === "pinault" && (
                  <text x={node.x} y={node.y - node.r - 6} textAnchor="middle" fill="#c8ac78" fontSize="13">▲</text>
                )}

                {/* Artémis crown ◆ */}
                {node.id === "artemis" && (
                  <text x={node.x} y={node.y - node.r - 6} textAnchor="middle" fill="#c8ac78" fontSize="11">◆</text>
                )}

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + node.r + 15}
                  textAnchor="middle"
                  fill={isEd ? "#c8ac78" : isHier ? "rgba(250,248,244,0.85)" : "rgba(250,248,244,0.7)"}
                  fontSize={isEd ? "13" : isHier ? "11" : "10"}
                  fontWeight={isEd ? "600" : isHier ? "500" : "400"}
                  fontFamily="Inter, sans-serif"
                  letterSpacing="0.5"
                  style={{ filter: hoveredId === node.id ? "brightness(1.3)" : undefined }}
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.node && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            background: "#253a5e",
            border: "1px solid rgba(200,172,120,0.4)",
            borderRadius: "6px",
            padding: "14px 18px",
            minWidth: "240px",
            maxWidth: "300px",
            pointerEvents: "none",
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#c8ac78", marginBottom: "2px" }}>
            {tooltip.node.name}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(250,248,244,0.7)", marginBottom: "6px", lineHeight: 1.4 }}>
            {tooltip.node.title}
          </div>
          <div style={{
            display: "inline-block",
            fontSize: "9px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            padding: "2px 8px",
            borderRadius: "3px",
            fontWeight: 600,
            background: STATUS_COLORS[tooltip.node.status].bg,
            color: STATUS_COLORS[tooltip.node.status].color,
          }}>
            {tooltip.node.status}
          </div>
          {tooltip.node.note && (
            <div style={{ fontSize: "12px", color: "rgba(250,248,244,0.5)", marginTop: "6px", lineHeight: 1.4, fontStyle: "italic" }}>
              {tooltip.node.note}
            </div>
          )}
        </div>
      )}

      {/* Entity count footer */}
      <div style={{
        textAlign: "center",
        padding: "8px 24px 16px",
        borderTop: "1px solid rgba(200,172,120,0.1)",
        fontSize: "9px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "rgba(250,248,244,0.25)",
      }}>
        {NODES.length} entities · Intelligence Web Master · April 2026
      </div>
    </div>
  );
}
