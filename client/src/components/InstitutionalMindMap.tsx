/*
 * InstitutionalMindMap
 * ─────────────────────────────────────────────────────────────────────────────
 * INTEL Layer 1 · Institutional Mind Map
 * Master Directive rebuild — April 9, 2026
 * Sprint 8 update: Center node renamed to FLAGSHIP TEAM (click-through hierarchy)
 *
 * GOVERNING VISUAL RULE (locked permanently):
 *   Every node is identical size (r:52). Every font is identical size, weight,
 *   and white color. Hierarchy is communicated by position and connection lines
 *   only. FLAGSHIP TEAM sits at center — its only distinction is the glow ring.
 *   Full canvas. Nothing overlaps. Nothing crowds. Every node has breathing room.
 *
 * GLOBAL RULE (locked permanently):
 *   No individual person has a standalone node anywhere on the map.
 *   Every person lives inside their categorical or institutional node.
 *   FLAGSHIP TEAM is the center node — click to reveal full team hierarchy.
 *
 * TWO TRACKS ABOVE ED — COMPLETELY SEPARATE. NO CROSSOVER LINE.
 *   LEFT TRACK (Auction House):
 *     Artémis S.A. → François-Henri Pinault → Guillaume Cerutti
 *     → Christie's Auction House (Bonnie Brennan, Alex Rotter, Julien Pradels,
 *       Tash Perrin, Stephen Lash, Rahul Kadakia)
 *     → Auction Referrals sub-node (Biviano, McWhinnie)
 *
 *   RIGHT TRACK (Real Estate):
 *     CIH / Robert Reffkin → Thad Wong + Mike Golden → Gavin Swartzman
 *     → CIREG TRI-STATE (Ilija Pavlovic)
 *     → International Pipeline sub-node (Ricardo Lisbon, Dominican Republic,
 *       Jonathan Wilhelm, Flambeaux Wine)
 *
 * LEFT OF ED:  PIPE (with SOCIAL as second-ring)
 * RIGHT OF ED: COMPETITORS
 *
 * BELOW ED (in order):
 *   FLAGSHIP TEAM · EAST HAMPTON OFFICE · FAMILY & FRIENDS
 *   WHALE INTELLIGENCE · ATTORNEYS · RECRUITING · AnewHomes
 *   MEDIA (with PODCAST as second-ring) · RELATIONSHIP INTELLIGENCE
 *   INTEL LIBRARY · EXPORTS · PERPLEXITY · RESOURCES
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = "HIERARCHY" | "RECRUIT" | "PARTNER" | "WHALE" | "ATTORNEY" | "RELATIONSHIP_INTELLIGENCE" | "EXPORT_NODE" | "CATEGORY";
type NodeStatus = "ACTIVE" | "WARM" | "COLD";
type ConnectionStyle = "hierarchy" | "partner" | "recruit" | "whale" | "social" | "intelligence";
type ViewMode = "full" | "hierarchy" | "recruit" | "whale";

type ClickAction =
  | { type: "pdf"; label: string; fn: () => Promise<void> }
  | { type: "nav"; tab: string; label: string }
  | { type: "url"; url: string; label: string }
  | { type: "toast"; message: string }
  | { type: "none" };

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
  members?: string[];
  rw?: number;
  rh?: number;
  clickAction?: ClickAction;
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

// ─── Layout constants ─────────────────────────────────────────────────────────
// viewBox: 0 0 1800 2000
// Ed center: x:900, y:900
// Left track: x ~300–500   |  Right track: x ~1300–1500
// Left of Ed: PIPE x:560   |  Right of Ed: COMPETITORS x:1240
// Below Ed: rows at y:1080, 1280, 1480, 1680

const R = 52; // Universal node radius — every node is this size

const NODES: MapNode[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // LEFT TRACK — Christie's Auction House chain
  // Crown → Pinault → Cerutti → Christie's Auction House → Auction Referrals
  // ══════════════════════════════════════════════════════════════════════════

  { id: "artemis",
    name: "ARTÉMIS S.A.",
    title: "Ultimate Parent · Pinault Family · Crown of Left Track",
    type: "CATEGORY", status: "ACTIVE",
    note: "Artémis S.A. — the Pinault family holding company. Ultimate parent of Christie's International. François-Henri Pinault: Board Chair effective March 27–30, 2026. The crown of the auction house track.",
    x: 300, y: 120, r: R,
    members: ["François-Henri Pinault (Chair)"],
    rw: R, rh: R },

  { id: "cerutti",
    name: "GUILLAUME CERUTTI",
    title: "CEO · Christie's International",
    type: "CATEGORY", status: "ACTIVE",
    note: "Guillaume Cerutti — CEO of Christie's International. Reports to the Pinault family board. Oversees global auction and private sales operations.",
    x: 300, y: 320, r: R,
    members: ["CEO · Christie's International"],
    rw: R, rh: R },

  { id: "auction_house",
    name: "CHRISTIE'S AUCTION HOUSE",
    title: "260 Years · $6.2B in 2025 Sales · Americas Leadership",
    type: "CATEGORY", status: "ACTIVE",
    note: "Christie's International — 260 years, founded 1766. $6.2B in 2025 sales. Bonnie Brennan: President Americas — first American woman in that role. Alex Rotter: Global President. Julien Pradels: Regional President Americas — Ed's direct auction house contact. Tash Perrin: Deputy Chairman International, Trusts & Estates, auction referral bridge. Stephen Lash: Chairman Emeritus, 50-year tenure, Ed's senior institutional relationship. Rahul Kadakia: President Asia-Pacific, based Hong Kong, jewelry auction referral pathway.",
    x: 300, y: 540, r: R,
    members: ["Bonnie Brennan (President Americas)", "Alex Rotter (Global President)", "Julien Pradels (Reg. President Americas)", "Tash Perrin (Deputy Chair)", "Stephen Lash (Chair Emeritus)", "Rahul Kadakia (President APAC)"],
    rw: R, rh: R },

  { id: "auction_referrals",
    name: "AUCTION REFERRALS",
    title: "Active Referral Pipeline · Christie's Auction House",
    type: "CATEGORY", status: "ACTIVE",
    note: "Active auction referral pipeline flowing through Christie's Auction House. Doug Biviano: Russian princess brooch — IN ESCROW. Chuck McWhinnie: MacWhinnie estate — UNDER REVIEW.",
    x: 300, y: 760, r: R,
    members: ["Doug Biviano — IN ESCROW", "Chuck McWhinnie — UNDER REVIEW"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // RIGHT TRACK — Christie's International Real Estate chain
  // CIH/Reffkin → Thad+Mike → Swartzman → CIREG → International Pipeline
  // ══════════════════════════════════════════════════════════════════════════

  { id: "cih_reffkin",
    name: "CIH / ROBERT REFFKIN",
    title: "Chairman & CEO · Compass International Holdings",
    type: "CATEGORY", status: "ACTIVE",
    note: "Robert Reffkin / CIH: Chairman & CEO, Compass International Holdings. Compass–Anywhere merger closed Jan 9, 2026 (~$1.6B deal). CIH controls CIRE brand license, @properties, Sotheby's IR, Coldwell Banker, Century 21, Corcoran, ERA, BHGRE. 340,000 agents, 120 countries. Crown of the real estate operating track.",
    x: 1500, y: 120, r: R,
    members: ["Robert Reffkin (Chair & CEO)", "CIH — 340K Agents · 120 Countries"],
    rw: R, rh: R },

  { id: "cire_global",
    name: "CIRE GLOBAL",
    title: "Thad Wong · Mike Golden · Gavin Swartzman",
    type: "CATEGORY", status: "ACTIVE",
    note: "Christie's International Real Estate — 100+ affiliate firms in 50 countries. Thad Wong + Mike Golden: @properties Co-Founders & Co-CEOs, acquired CIRE brand license Nov 2021, sold @properties to Compass Jan 2025 for $444M, remained as Co-CEOs. Gavin Swartzman: President (Global) CIRE since June 2025, former CEO Peerage Realty Partners.",
    x: 1500, y: 320, r: R,
    members: ["Thad Wong (Co-CEO)", "Mike Golden (Co-CEO)", "Gavin Swartzman (President)"],
    rw: R, rh: R },

  { id: "cireg_affiliate",
    name: "CIREG TRI-STATE",
    title: "Ilija Pavlovic · Exclusive NY/NJ/CT Affiliate",
    type: "CATEGORY", status: "ACTIVE",
    note: "Christie's International Real Estate Group (CIREG) — Ilija Pavlovic's exclusive CIRE affiliate for NY/NJ/CT. ~30 offices, ~1,200 agents, $4B+ annual volume. Ed's direct operating chain. Sherri Balassone: VP Corporate Broker / BOR for East Hampton, licensed NY Bar attorney, legal and compliance anchor. Melissa True: Christie's NYC Flatiron, father Richard True (Palm Beach builder), key referral node.",
    x: 1500, y: 540, r: R,
    members: ["Ilija Pavlovic (Owner/CEO)", "Sherri Balassone (VP/BOR)", "Melissa True (NYC Flatiron)"],
    rw: R, rh: R },

  { id: "intl_pipeline",
    name: "INTERNATIONAL PIPELINE",
    title: "CIREG International Referrals · CPS-1 Framework",
    type: "CATEGORY", status: "ACTIVE",
    note: "International projects pipeline flowing through CIREG Tri-State using the CPS-1 and CPS-12 New York Attorney General framework. Ricardo (Lisbon) — CIREG international referral, active. Dominican Republic — development/investment through CIREG international network, active. Jonathan Wilhelm — Mayacama Golf Club, Park City/Deer Valley, UHNW hospitality. Flambeaux Wine — through Art Murray, TOWN dinner series.",
    x: 1500, y: 760, r: R,
    members: ["Ricardo (Lisbon) — Active", "Dominican Republic — Active", "Jonathan Wilhelm · Mayacama", "Flambeaux Wine · Art Murray"],
    rw: R, rh: R },

  // ── CPS-1 — Christie's Private Sales · second ring off INTERNATIONAL PIPELINE ──
  // Added Apr 16 2026 per Ed ruling · Trello card #178 · trello.com/c/QHnzc5gZ
  // Award-gated per Doctrine 38 — does not load into PIPE until award confirmed
  { id: "cps1",
    name: "CPS-1 · PRIVATE SALES",
    title: "Christie's Private Sales · Dominique Silvera-Chittell · Caribbean",
    type: "PARTNER", status: "WARM",
    note: "CPS-1 — Christie's Private Sales referral node. Dominique Silvera-Chittell: Christie's Private Sales specialist, Caribbean corridor. Mill Reef context. Jarvis Slade connection map. Stephen Lash intro node. Award-gated per Doctrine 38 — does not enter PIPE until working relationship confirmed post-call. Trello card #178 live in CHRISTIE'S NETWORK list. Drive assets: RL-003, RL-005, RL-012, EH Market Report. Alert sent to Jarvis and Angel on activation Apr 16 2026.",
    x: 1720, y: 960, r: R,
    members: ["Dominique Silvera-Chittell (CPS Specialist)", "Mill Reef · Caribbean corridor", "Jarvis Slade — connection map", "Stephen Lash — intro node"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // FLAGSHIP TEAM — center bridge (Sprint 8: renamed from Ed Bruehl)
  // ══════════════════════════════════════════════════════════════════════════

  { id: "ed",
    name: "FLAGSHIP TEAM",
    title: "Christie's East Hampton · 26 Park Place · Click for team hierarchy",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Ed Bruehl — Managing Director. $1B+ career sales. 20+ years East End. Appointed by Ilija Pavlovic Nov 2025. Bridge between the auction house relationship and the real estate operating chain. Click to view full team hierarchy.",
    x: 900, y: 900, r: R,
    clickAction: { type: "toast", message: "Opening Flagship Team hierarchy…" } },

  // ══════════════════════════════════════════════════════════════════════════
  // LEFT OF ED — PIPE (with SOCIAL as second ring)
  // ══════════════════════════════════════════════════════════════════════════

  { id: "pipe_node",
    name: "PIPE",
    title: "Live Deal Engine · Office Pipeline Sheet",
    type: "CATEGORY", status: "ACTIVE",
    note: "Live deal engine. Three closest-to-close deals: 25 Horseshoe Road $5.75M IN CONTRACT · 191 Bull Path $3.6M ACTIVE LISTING · 140 Hands Creek $3.3M NEGOTIATING. Pulls from Office Pipeline sheet live.",
    x: 560, y: 900, r: R,
    members: ["25 Horseshoe Rd $5.75M — IN CONTRACT", "191 Bull Path $3.6M — ACTIVE LISTING", "140 Hands Creek $3.3M — NEGOTIATING"],
    rw: R, rh: R,
    clickAction: { type: "nav", tab: "pipe", label: "Navigate to PIPE tab" } },

  { id: "social",
    name: "SOCIAL",
    title: "Signal Collection · Six Platforms",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Raw signal collection layer. Ed's presence across all six platforms: Instagram · LinkedIn · TikTok · YouTube · Facebook · X. Data field only — no interpretation here. Feeds directly into PERPLEXITY for synthesis and territory intelligence.",
    x: 380, y: 1060, r: R,
    members: ["Instagram", "LinkedIn", "TikTok", "YouTube", "Facebook", "X"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // RIGHT OF ED — COMPETITORS (internal only)
  // ══════════════════════════════════════════════════════════════════════════

  { id: "competitors_node",
    name: "MARKET INTELLIGENCE",
    title: "East End Competitive Landscape · Internal Only",
    type: "CATEGORY", status: "ACTIVE",
    note: "Internal market intelligence node. Tracks the East End competitive landscape for strategic positioning. Perplexity monitors weekly for broker intelligence, market share shifts, and recruiting signals. Internal use only — no competitor names on public surfaces.",
    x: 1240, y: 900, r: R,
    members: ["East End Competitive Landscape", "Broker Intelligence — Perplexity Weekly", "Market Share Tracking", "Recruiting Signals"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // BELOW ED — Row 1 (y:1080)
  // FLAGSHIP TEAM · EAST HAMPTON OFFICE · FAMILY & FRIENDS
  // ══════════════════════════════════════════════════════════════════════════

  { id: "flagship_team",
    name: "FLAGSHIP TEAM",
    title: "Ed's Inner Circle · Equity Participants · Direct Responsibility",
    type: "CATEGORY", status: "ACTIVE",
    note: "Ed's personal orbit — equity, ownership, direct responsibility in the model. Jarvis Slade — COO and Agent. Angel Theodore — Mktg Coord + Sales, producer transition Q1 2027. Zoila Ortega Astor — Office Director, start May 4 2026, producer transition Q1 2027. Scott Smith — joins June 1. Richard Bruehl — Strategic Mentor, holds 10% AnewHomes equity.",
    x: 620, y: 1080, r: R,
    members: ["Jarvis Slade — COO & Agent", "Angel Theodore — Mktg Coord + Sales · Q1 2027 producer", "Zoila Ortega Astor — Office Director · start May 4 · Q1 2027 producer", "Scott Smith *June 1", "Richard Bruehl — Mentor 10%"],
    rw: R, rh: R },

  { id: "eh_office",
    name: "EAST HAMPTON OFFICE",
    title: "26 Park Place · Christie's Standard Daily",
    type: "CATEGORY", status: "ACTIVE",
    note: "Office staff carrying the Christie's standard at 26 Park Place every day. Bonita DeWolf · Sebastian Mobo · Sandy Busch · Jan Jaeger.",
    x: 900, y: 1080, r: R,
    members: ["Bonita DeWolf", "Sebastian Mobo", "Sandy Busch", "Jan Jaeger"],
    rw: R, rh: R },

  { id: "family_node",
    name: "FAMILY & FRIENDS",
    title: "Personal Network · Innermost Referral Layer",
    type: "CATEGORY", status: "WARM",
    note: "Ed's personal network — family and close friends who form the innermost referral layer. Not tracked in the pipeline sheet.",
    x: 1180, y: 1080, r: R,
    members: ["Miranda Bruehl — Wife", "Richard Bruehl — Brother", "Eugene Wayne Bruehl — Father", "Gina Bruehl — Stepmother", "Mary Alice Crockett Bruehl — Mother †", "Marilyn Rose Bruehl — Daughter", "Ella Sage Bruehl — Daughter", "Mariah Lynn Douglas — Former Wife", "Richard & Colette Bruehl — Miranda's Parents", "Griffith Bruehl — Miranda's Brother"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // BELOW ED — Row 2 (y:1280)
  // WHALE INTELLIGENCE · RECRUITING · ATTORNEYS
  // ══════════════════════════════════════════════════════════════════════════

  { id: "whale_intel",
    name: "WHALE INTELLIGENCE",
    title: "UHNW · Family Office · Collector Network",
    type: "WHALE", status: "ACTIVE",
    note: "Primary UHNW relationships. Lily Fan: 140 Hands Creek (ANEW anchor), 18 Tara Rd, $20–22M Brooklyn portfolio. Rick Moeser: former CIRE Executive Director 17 years, auction referral pipeline. Art Murray: Flambeaux investor pitch, TOWN dinner engine. Jonathan Wilhelm: Mayacama Golf Club, Park City/Deer Valley, UHNW hospitality. Josh Schnepps: Dan's Papers, 61K+ email subscribers. Heath Freeman: Alden Capital, EHP Resort & Marina. Chuck McWhinnie: MacWhinnie estate auction referral.",
    x: 480, y: 1280, r: R,
    members: ["Lily Fan — First Always", "Rick Moeser", "Art Murray", "Jonathan Wilhelm", "Josh Schnepps", "Heath Freeman", "Chuck McWhinnie"],
    rw: R, rh: R },

  { id: "recruiting_node",
    name: "RECRUITING",
    title: "Jarvis Pipeline · Agent Acquisition · Future Agents Sheet",
    type: "CATEGORY", status: "WARM",
    note: "Agent recruiting pipeline managed by Jarvis Slade. Target: experienced East End producers exposed by Compass-Anywhere merger. Pulls from Future Agents Recruiting sheet. Frank Newbold lives in RELATIONSHIP INTELLIGENCE — never recruit, never cold outreach, comes through the brand only.",
    x: 900, y: 1280, r: R,
    members: ["Jarvis Pipeline", "Compass-Exposed Targets", "East End Producers"],
    rw: R, rh: R },

  { id: "attorneys_node",
    name: "ATTORNEYS",
    title: "Jacqueline Aleman · Tarbet · Lester · McGrath",
    type: "ATTORNEY", status: "ACTIVE",
    note: "Jacqueline Aleman, Esq.: Manhattan + Hamptons RE law, co-host The Bruehl Report, Ep. 1 live. Property analysis reports tracked in Pipeline Sheet. FOIL properties list maintained. Jonathan Tarbet: land use, zoning, EH Town history, 132 N Main St East Hampton. Brian Lester: trusts, estates, RE litigation, every major transaction. Seamus McGrath: RE law, East Hampton, active on East End transactions.",
    x: 1320, y: 1280, r: R,
    members: ["Jacqueline Aleman — First", "Jonathan Tarbet", "Brian Lester", "Seamus McGrath"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // BELOW ED — Row 3 (y:1480)
  // AnewHomes · MEDIA (with PODCAST second-ring) · RELATIONSHIP INTELLIGENCE
  // ══════════════════════════════════════════════════════════════════════════

  { id: "anew_homes",
    name: "AnewHomes",
    title: "New Construction Division · Three Active Deals",
    type: "CATEGORY", status: "ACTIVE",
    note: "New construction division. Three active deals: 140 Hands Creek Road $3.3M land / $9.9M exit — Lily Fan anchor. 9 Daniels Hole proof of concept $2.47M CLOSED. 2 Old Hollow $2.1M CLOSED. Deal Engine inside — tapping opens MAPS Deal Engine directly. Richard Bruehl holds 10% equity as Strategic Mentor.",
    x: 480, y: 1480, r: R,
    members: ["140 Hands Creek $3.3M→$9.9M", "9 Daniels Hole $2.47M CLOSED", "2 Old Hollow $2.1M CLOSED", "Richard Bruehl — 10% Equity"],
    rw: R, rh: R,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW tab" } },

  { id: "media_node",
    name: "MEDIA",
    title: "Dan's Papers · NYT · Behind the Hedges · The Real Deal",
    type: "CATEGORY", status: "ACTIVE",
    note: "Media relationships and earned press. Josh Schnepps: Dan's Papers, $2K/month pilot active, 61K+ email subscribers. Jason Forsythe: New York Times. Behind the Hedges: East End real estate coverage. The Real Deal: industry trade. Podcast sub-node below.",
    x: 900, y: 1480, r: R,
    members: ["Josh Schnepps — Dan's Papers", "Jason Forsythe — New York Times", "Behind the Hedges", "The Real Deal"],
    rw: R, rh: R },

  { id: "rel_intel",
    name: "RELATIONSHIP INTELLIGENCE",
    title: "Frank Newbold Anchor · Brand Relationships",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Frank Newbold: anchor — comes through the brand. Not cold outreach. Not Jarvis pipeline. Brand-level relationship. Other trusted relationships that come through the Christie's brand. Not recruits. Not whales.",
    x: 1320, y: 1480, r: R,
    members: ["Frank Newbold — Anchor", "Brand Relationships", "Trusted Network"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // BELOW ED — Row 3 second-ring nodes
  // PODCAST (under MEDIA) · SOCIAL already placed above
  // ══════════════════════════════════════════════════════════════════════════

  { id: "podcast_node",
    name: "PODCAST",
    title: "The Bruehl Report · Jacqueline Aleman Co-Host · Ep 1 Live Apr 30",
    type: "CATEGORY", status: "ACTIVE",
    note: "The Bruehl Report. Ed Bruehl and Jacqueline Aleman co-hosts. Episode 1 Live April 30. Platform for brand amplification, attorney relationship deepening, and UHNW audience reach. Pending guests populate as confirmed. Pulls from Podcast Calendar sheet.",
    x: 720, y: 1660, r: R,
    members: ["Ed Bruehl — Host", "Jacqueline Aleman — Co-Host", "Ep. 1 Live Apr 30"],
    rw: R, rh: R },

  // ════════════════════════════════════════════════════════════════════════════
  // BELOW ED — Row 4 (y:1680)
  // INTEL LIBRARY · PERPLEXITY · WILLIAM (D25+D34 resurrected · D49 amended)
  // ════════════════════════════════════════════════════════════════════════════

  // D25 + D34 resurrected Apr 19 2026 · D49 amended: Bounded-surface form Apr 20 2026
  // William = one floating audio button on HOME for the institutional intro letter.
  // WhatsApp keywords NEWS, LETTER, FLAGSHIP, BRIEF retired April 20 2026.
  // WhatsApp-layer code and routes retired. One surface. One letter. One voice.
  { id: "william_node",
    name: "WILLIAM",
    title: "Voice of the Flagship Letter · HOME Floating Audio Active",
    type: "CATEGORY", status: "ACTIVE",
    note: "William is the voice of the flagship letter — one floating audio button on HOME for the institutional intro letter. D34 amended to bounded-surface form Apr 20 2026. D49 amended: HOME Floating Audio Active. WhatsApp keywords NEWS, LETTER, FLAGSHIP, BRIEF retired April 20 2026. WhatsApp-layer code and routes retired. PDF export active. Source: letter-content.ts. One surface. One letter. One voice.",
    x: 1080, y: 1680, r: R,
    members: ["HOME floating audio button — institutional intro letter", "PDF button — HOME tab", "Source: letter-content.ts", "WhatsApp keywords retired Apr 20 2026", "D34 bounded-surface form · D49 amended"],
    clickAction: { type: "toast", message: "William: HOME Floating Audio Active · WhatsApp keywords retired Apr 20 2026 · D49 amended" } },

  { id: "intel_library", name: "INTEL LIBRARY",
    title: "Thirteen Sheets · Hamptons Intelligence Archive",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "All thirteen Google Sheets that form the intelligence backbone of Christie's East Hampton. One tap per sheet. Accessible from INTEL Layer 3.",
    x: 900, y: 1680, r: R,
    clickAction: { type: "nav", tab: "intel", label: "Navigate to INTEL tab — Thirteen Sheets" } },

  // ── D5: PIPE TAB · INTEL TAB · MASTER INDEX nodes — Apr 16 2026 ───────────────
  { id: "pipe_tab",
    name: "PIPE TAB",
    title: "Live Deal Engine · Dashboard Navigation",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Dashboard PIPE tab — live deal engine. Three closest-to-close deals tracked in real time. Pulls from Office Pipeline sheet. One-tap navigation from MindMap.",
    x: 560, y: 1680, r: R,
    clickAction: { type: "nav", tab: "pipe", label: "Navigate to PIPE tab" } },

  { id: "intel_tab",
    name: "INTEL TAB",
    title: "Intelligence Layer · Miro + Trello + Sheets",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Dashboard INTEL tab — five layers: MindMap (Miro embed), Trello board, Calendar, Sheets, Relationship Intelligence Web. One-tap navigation from MindMap.",
    x: 720, y: 1680, r: R,
    clickAction: { type: "nav", tab: "intel", label: "Navigate to INTEL tab" } },

  { id: "master_index",
    name: "MASTER INDEX",
    title: "Doctrine Library · Trello DOCTRINE LIBRARY Lane",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Master Index card in DOCTRINE LIBRARY Trello lane. Single source of truth for all canonical rulings, dispatch history, and session logs. Created Apr 16 2026. Links to Google Drive Growth Model v2 and all Council dispatches.",
    x: 1060, y: 1680, r: R,
    clickAction: { type: "url", url: "https://trello.com/b/H2mvEgRi", label: "Open Trello DOCTRINE LIBRARY" } },

  { id: "perplexity",
    name: "PERPLEXITY",
    title: "Territory Intelligence Engine · Three Standing Assignments",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Interpretation engine. Three standing assignments: Weekly Territory Intelligence · Friday Broker Intelligence Scan · Quarterly Relationship Map update. Receives raw social signals from SOCIAL node. Weekly output: Ed Bruehl Signal · Competitor Moves · Cross Analysis · Recommended Action.",
    x: 1420, y: 1680, r: R,
    members: ["Weekly Territory Intelligence", "Friday Broker Intelligence Scan", "Quarterly Relationship Map Update"],
    rw: R, rh: R },

  // ══════════════════════════════════════════════════════════════════════════
  // BELOW ED — Row 5 (y:1880)
  // EXPORTS · RESOURCES
  // ══════════════════════════════════════════════════════════════════════════

  { id: "exports",
    name: "EXPORTS",
    title: "PDF Operating Interface · All Reports One Tap",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "All PDF exports generated by the platform. One tap per document. Christie's Letter · Flagship Letter · Market Report · Hamlet PDFs x11 · AnewHomes Build Memo · Christie CMA · UHNW Path Card · Investment Memo · Deal Brief · FUTURE Pro Forma.",
    x: 580, y: 1880, r: R },

  { id: "resources",
    name: "RESOURCES",
    title: "Hamptons Outreach Intelligence · Four Tabs",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Four strategic tabs from Hamptons_Outreach_COMPLETE sheet. Vendors & Service Partners · Builders · Architects · Accountants & Advisors · Gatekeeper Network. Click any sub-node to open the corresponding tab directly in Google Sheets.",
    x: 1220, y: 1880, r: R },

  // ── EXPORTS sub-nodes — clickable PDF triggers ────────────────────────────
  { id: "exp_letter",
    name: "Christie's Letter",
    title: "Founding Letter PDF",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the Christie's East Hampton founding letter PDF.",
    x: 160, y: 1800, r: 18,
    clickAction: { type: "pdf", label: "Downloading Christie's Letter PDF…", fn: async () => { const a = document.createElement('a'); a.href = '/api/pdf?url=/letters/christies'; a.download = 'christies-letter.pdf'; document.body.appendChild(a); a.click(); document.body.removeChild(a); } } },

  { id: "exp_flagship",
    name: "Flagship Letter",
    title: "Internal Council Document",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the Christie's Flagship Letter PDF — the internal council document.",
    x: 240, y: 1860, r: 18,
    clickAction: { type: "pdf", label: "Downloading Flagship Letter PDF…", fn: async () => { const a = document.createElement('a'); a.href = '/api/pdf?url=/letters/flagship'; a.download = 'flagship-letter.pdf'; document.body.appendChild(a); a.click(); document.body.removeChild(a); } } },

  { id: "exp_market",
    name: "Market Report",
    title: "Five-Page PDF · Live Market Matrix Data",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the five-page Christie's East Hampton Market Report PDF using live Market Matrix sheet data at generation time.",
    x: 340, y: 1920, r: 18,
    clickAction: { type: "pdf", label: "Generating Market Report PDF…", fn: async () => { const res = await fetch('/api/pdf?url=/market'); if (!res.ok) throw new Error('PDF failed'); const blob = await res.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'Christies_EH_Market_Report.pdf'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); } } },

  { id: "exp_hamlet",
    name: "Hamlet PDFs x11",
    title: "All Eleven Hamlets",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the East Hampton Village Report PDF covering all eleven hamlets.",
    x: 460, y: 1960, r: 18,
    clickAction: { type: "pdf", label: "Use Download PDF on MAPS tab", fn: () => toast.info("Use the Download PDF button on the MAPS tab to export hamlet reports.") } },

  { id: "exp_anew",
    name: "ANEW Build Memo",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the ANEW Build Memo PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 700, y: 1960, r: 18,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_cma",
    name: "Christie CMA",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Christie's CMA PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 800, y: 1920, r: 18,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_uhnw",
    name: "UHNW Path Card",
    title: "Live · Click to Download",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "UHNW Path Card PDF — Live. Eight rungs of structured ownership from tenant to trust.",
    x: 880, y: 1870, r: 18,
    clickAction: { type: "nav", tab: "home", label: "Navigate to HOME tab to download UHNW Path Card" } },

  { id: "exp_invest",
    name: "Investment Memo",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Investment Memo PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 940, y: 1830, r: 18,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_brief",
    name: "Deal Brief",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Deal Brief PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 980, y: 1790, r: 18,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_future",
    name: "FUTURE Pro Forma",
    title: "Requires FUTURE Tab Input",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the FUTURE Pro Forma PDF. Requires FUTURE tab input data.",
    x: 1000, y: 1750, r: 18,
    clickAction: { type: "nav", tab: "future", label: "Navigate to FUTURE tab to set up pro forma" } },

  // ── RESOURCES sub-nodes ───────────────────────────────────────────────────
  { id: "res_vendors",
    name: "Vendors",
    title: "Vendors & Service Partners",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Service vendors organized by category. Opens Vendors & Service Partners tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1100, y: 1780, r: 18,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1943996001", label: "Opening Vendors & Service Partners…" } },

  { id: "res_builders",
    name: "Builders",
    title: "Hamptons Builders & Developers",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Hamptons builders and developers. Opens Builders tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1200, y: 1830, r: 18,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1631109962", label: "Opening Builders…" } },

  { id: "res_architects",
    name: "Architects",
    title: "Hamptons Architects",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Hamptons architects. Opens Architects tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1360, y: 1830, r: 18,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1942054747", label: "Opening Architects…" } },

  { id: "res_accountants",
    name: "Accountants",
    title: "Accountants, CPAs & Wealth Advisors",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Accountants, CPAs, and wealth advisors. Opens Accountants & Advisors tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1480, y: 1800, r: 18,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=156479096", label: "Opening Accountants & Advisors…" } },

  { id: "res_gatekeepers",
    name: "Gatekeepers",
    title: "Gatekeeper Network · Property & Estate Managers",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "The Gatekeeper Network — property managers and estate managers. The most strategically important tab: these are the people inside the gates before anyone else.",
    x: 1560, y: 1760, r: 18,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1147147253", label: "Opening Gatekeeper Network…" } },
];

// ─── Connections ──────────────────────────────────────────────────────────────

const CONNECTIONS: MapConnection[] = [
  // ── LEFT TRACK — Artémis → Cerutti → Auction House → Auction Referrals → Ed ─
  { from: "artemis",          to: "cerutti",          style: "hierarchy" },
  { from: "cerutti",          to: "auction_house",    style: "hierarchy" },
  { from: "auction_house",    to: "auction_referrals",style: "hierarchy" },
  { from: "auction_referrals",to: "ed",               style: "hierarchy" },

  // ── RIGHT TRACK — CIH → CIRE Global → CIREG → Intl Pipeline → Ed ────────────
  { from: "cih_reffkin",      to: "cire_global",      style: "hierarchy" },
  { from: "cire_global",      to: "cireg_affiliate",  style: "hierarchy" },
  { from: "cireg_affiliate",  to: "intl_pipeline",    style: "hierarchy" },
  { from: "intl_pipeline",    to: "ed",               style: "hierarchy" },
  { from: "intl_pipeline",    to: "cps1",             style: "partner" },   // CPS-1 second ring · Apr 16 2026

  // ── PIPE — left of Ed, SOCIAL as second ring ──────────────────────────────────
  { from: "ed",               to: "pipe_node",        style: "partner" },
  { from: "pipe_node",        to: "social",           style: "social" },

  // ── COMPETITORS — right of Ed ─────────────────────────────────────────────────
  { from: "ed",               to: "competitors_node", style: "partner" },

  // ── Row 1 below Ed ───────────────────────────────────────────────────────────
  { from: "ed",               to: "flagship_team",    style: "hierarchy" },
  { from: "ed",               to: "eh_office",        style: "hierarchy" },
  { from: "ed",               to: "family_node",      style: "hierarchy" },

  // ── Row 2 below Ed ───────────────────────────────────────────────────────────
  { from: "ed",               to: "whale_intel",      style: "whale" },
  { from: "ed",               to: "recruiting_node",  style: "recruit" },
  { from: "ed",               to: "attorneys_node",   style: "partner" },

  // ── Row 3 below Ed ───────────────────────────────────────────────────────────
  { from: "ed",               to: "anew_homes",       style: "partner" },
  { from: "ed",               to: "media_node",       style: "partner" },
  { from: "ed",               to: "rel_intel",        style: "recruit" },
  { from: "media_node",       to: "podcast_node",     style: "social" },

  // ── Row 4 below Ed ──────────────────────────────────────────────────────────────────────────────────────
  // D25 + D34 resurrected (Apr 19 2026) · D49 amended: Audio + PDF Active
  { from: "ed",               to: "william_node",     style: "partner" },   // D25 resurrected · William = voice of flagship letter
  { from: "ed",               to: "intel_library",    style: "intelligence" },
  { from: "ed",               to: "perplexity",       style: "partner" },
  { from: "ed",               to: "pipe_tab",         style: "intelligence" },   // D5: PIPE TAB node · Apr 16 2026
  { from: "ed",               to: "intel_tab",        style: "intelligence" },   // D5: INTEL TAB node · Apr 16 2026
  { from: "ed",               to: "master_index",     style: "intelligence" },   // D5: MASTER INDEX node · Apr 16 2026

  // ── SOCIAL → PERPLEXITY (signal feed) ────────────────────────────────────────
  { from: "social",           to: "perplexity",       style: "intelligence" },

  // ── Row 5 below Ed ───────────────────────────────────────────────────────────
  { from: "ed",               to: "exports",          style: "partner" },
  { from: "ed",               to: "resources",        style: "partner" },

  // ── EXPORTS sub-nodes ─────────────────────────────────────────────────────────
  { from: "exports",          to: "exp_letter",       style: "intelligence" },
  { from: "exports",          to: "exp_flagship",     style: "intelligence" },
  { from: "exports",          to: "exp_market",       style: "intelligence" },
  { from: "exports",          to: "exp_hamlet",       style: "intelligence" },
  { from: "exports",          to: "exp_anew",         style: "intelligence" },
  { from: "exports",          to: "exp_cma",          style: "intelligence" },
  { from: "exports",          to: "exp_uhnw",         style: "intelligence" },
  { from: "exports",          to: "exp_invest",       style: "intelligence" },
  { from: "exports",          to: "exp_brief",        style: "intelligence" },
  { from: "exports",          to: "exp_future",       style: "intelligence" },

  // ── RESOURCES sub-nodes ───────────────────────────────────────────────────────
  { from: "resources",        to: "res_vendors",      style: "intelligence" },
  { from: "resources",        to: "res_builders",     style: "intelligence" },
  { from: "resources",        to: "res_architects",   style: "intelligence" },
  { from: "resources",        to: "res_accountants",  style: "intelligence" },
  { from: "resources",        to: "res_gatekeepers",  style: "intelligence" },
];

// ─── Color Maps ───────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<NodeType, { fill: string; stroke: string; strokeWidth: number }> = {
  HIERARCHY:                { fill: "#1b2a4a", stroke: "#947231", strokeWidth: 2.5 },
  RECRUIT:                  { fill: "#1A3D2A", stroke: "#2D5A3D", strokeWidth: 2.0 },
  PARTNER:                  { fill: "#2A1F0A", stroke: "#947231", strokeWidth: 2.0 },
  WHALE:                    { fill: "#2A1A3D", stroke: "#7B5DAA", strokeWidth: 2.0 },
  ATTORNEY:                 { fill: "#0d2a3d", stroke: "#2a7aad", strokeWidth: 2.0 },
  RELATIONSHIP_INTELLIGENCE:{ fill: "#2A1F2A", stroke: "#9B7EC8", strokeWidth: 2.0 },
  EXPORT_NODE:              { fill: "#1A2A1A", stroke: "rgba(200,172,120,0.6)", strokeWidth: 1.8 },
  CATEGORY:                 { fill: "#1b2a4a", stroke: "#947231", strokeWidth: 2.5 },
};

const CATEGORY_COLORS: Record<string, { fill: string; stroke: string; headerColor: string }> = {
  // Left track
  artemis:           { fill: "#0d2040", stroke: "#947231",               headerColor: "#e8d4a0" },
  cerutti:           { fill: "#0d2040", stroke: "#947231",               headerColor: "#e8d4a0" },
  auction_house:     { fill: "#1b2a4a", stroke: "#947231",               headerColor: "#e8d4a0" },
  auction_referrals: { fill: "#1b2a4a", stroke: "rgba(200,172,120,0.7)", headerColor: "#947231" },
  // Right track
  cih_reffkin:       { fill: "#0d2040", stroke: "rgba(200,172,120,0.7)", headerColor: "#947231" },
  cire_global:       { fill: "#0d2040", stroke: "rgba(200,172,120,0.7)", headerColor: "#947231" },
  cireg_affiliate:   { fill: "#1b2a4a", stroke: "#947231",               headerColor: "#e8d4a0" },
  intl_pipeline:     { fill: "#1A2A3A", stroke: "rgba(120,172,220,0.7)", headerColor: "rgba(180,220,255,0.9)" },
  // Left/right of Ed
  pipe_node:         { fill: "#1b2a4a", stroke: "#947231",               headerColor: "#947231" },
  competitors_node:  { fill: "#2A1A1A", stroke: "rgba(200,100,100,0.5)", headerColor: "rgba(255,200,200,0.9)" },
  // Row 1 below Ed
  flagship_team:     { fill: "#1b2a4a", stroke: "#947231",               headerColor: "#e8d4a0" },
  eh_office:         { fill: "#1b2a4a", stroke: "#947231",               headerColor: "#e8d4a0" },
  family_node:       { fill: "#1b2a4a", stroke: "rgba(200,172,120,0.5)", headerColor: "rgba(230,215,185,0.9)" },
  // Row 2 below Ed
  whale_intel:       { fill: "#2A1A3D", stroke: "#7B5DAA",               headerColor: "#9B7EC8" },
  recruiting_node:   { fill: "#1A3D2A", stroke: "#2D5A3D",               headerColor: "#6FCF97" },
  attorneys_node:    { fill: "#0d2a3d", stroke: "#2a7aad",               headerColor: "#7BA4D4" },
  // Row 3 below Ed
  anew_homes:        { fill: "#1A2A1A", stroke: "rgba(200,172,120,0.6)", headerColor: "#947231" },
  media_node:        { fill: "#2A1A2A", stroke: "rgba(200,120,200,0.6)", headerColor: "rgba(235,185,235,0.9)" },
  rel_intel:         { fill: "#1A3D2A", stroke: "#2D5A3D",               headerColor: "#6FCF97" },
  podcast_node:      { fill: "#1A1A2A", stroke: "rgba(120,172,200,0.6)", headerColor: "rgba(180,225,255,0.9)" },
  // Row 4 below Ed
  william_node:     { fill: "#1b2a4a", stroke: "rgba(200,172,120,0.5)", headerColor: "rgba(230,215,185,0.9)" }, // D25 resurrected Apr 19 2026
  perplexity:        { fill: "#2A1F2A", stroke: "#9B7EC8",               headerColor: "#9B7EC8" },
  // Social
  social:            { fill: "#2A1F2A", stroke: "#9B7EC8",               headerColor: "#9B7EC8" },
};

const LINE_STYLES: Record<ConnectionStyle, { color: string; width: number; dash: string }> = {
  hierarchy:   { color: "rgba(200,172,120,0.55)", width: 2.5, dash: "" },
  partner:     { color: "rgba(200,172,120,0.35)",  width: 1.4, dash: "5,4" },
  recruit:     { color: "rgba(45,90,61,0.35)",     width: 1.4, dash: "4,4" },
  whale:       { color: "rgba(123,93,170,0.30)",  width: 1.4, dash: "4,4" },
  social:      { color: "rgba(250,248,244,0.22)", width: 1.0, dash: "2,3" },
  intelligence:{ color: "rgba(200,172,120,0.8)",  width: 3.0, dash: "" },
};

const STATUS_COLORS: Record<NodeStatus, { bg: string; color: string }> = {
  ACTIVE: { bg: "rgba(45,90,61,0.4)",    color: "#6FCF97" },
  WARM:   { bg: "rgba(200,172,120,0.3)", color: "#D4A843" },
  COLD:   { bg: "rgba(74,101,165,0.3)",  color: "#7BA4D4" },
};

// ─── View filter logic ────────────────────────────────────────────────────────

function isNodeVisible(node: MapNode, view: ViewMode): boolean {
  if (view === "full") return true;
  if (view === "hierarchy") return node.type === "HIERARCHY" || node.type === "CATEGORY";
  if (view === "recruit")   return node.type === "HIERARCHY" || node.type === "RECRUIT" || node.type === "RELATIONSHIP_INTELLIGENCE" || node.type === "CATEGORY";
  if (view === "whale")     return node.type === "HIERARCHY" || node.type === "WHALE" || (node.type === "CATEGORY" && node.id === "whale_intel");
  return true;
}

function isConnectionVisible(conn: MapConnection, view: ViewMode): boolean {
  const from = NODES.find(n => n.id === conn.from);
  const to   = NODES.find(n => n.id === conn.to);
  if (!from || !to) return false;
  return isNodeVisible(from, view) && isNodeVisible(to, view);
}

function nodeCenter(node: MapNode): { x: number; y: number } {
  return { x: node.x, y: node.y };
}

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Flagship Team Hierarchy Data ────────────────────────────────────────────
const FLAGSHIP_HIERARCHY = [
  { role: "Managing Director",   name: "Ed Bruehl",           note: "$1B+ career sales · 20+ years East End · Appointed Nov 2025",        status: "ACTIVE" },
  { role: "COO & Agent",         name: "Jarvis Slade",         note: "Chief Operating Officer · Equity participant · Direct responsibility", status: "ACTIVE" },
  { role: "Mktg Coord + Sales",   name: "Angel Theodore",       note: "Nest salary $70K/yr (Ilija payroll) · Producer transition Q1 2027 · AnewHomes 5% vested · $150K floor 2027",  status: "ACTIVE" },
  { role: "Office Director",     name: "Zoila Ortega Astor",   note: "Start May 4, 2026 · Nest salary $70K/yr (Ilija payroll) · Producer transition Q1 2027 · AnewHomes 5% vesting cliff Nov 4 2026 · $150K floor 2027", status: "ACTIVE" },
  { role: "Agent",               name: "Scott Smith",          note: "Joins June 1, 2026",                                                  status: "WARM"   },
  { role: "Strategic Mentor",    name: "Richard Bruehl",       note: "Holds 10% AnewHomes equity · Senior strategic counsel",              status: "ACTIVE" },
];

export function InstitutionalMindMap() {
  const [view, setView] = useState<ViewMode>("full");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, node: null });
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = useCallback(async (node: MapNode) => {
    // Special case: center FLAGSHIP TEAM node opens team hierarchy modal
    if (node.id === "ed") {
      setShowTeamModal(true);
      return;
    }
    if (!node.clickAction || node.clickAction.type === "none") return;
    const action = node.clickAction;
    if (action.type === "toast") {
      toast(action.message);
      return;
    }
    if (action.type === "nav") {
      toast(action.label);
      window.dispatchEvent(new CustomEvent("navigate-tab", { detail: { tab: action.tab } }));
      return;
    }
    if (action.type === "url") {
      toast(action.label);
      window.open(action.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.type === "pdf") {
      if (generatingId) return;
      setGeneratingId(node.id);
      toast(action.label);
      try {
        await action.fn();
        toast.success("PDF downloaded.");
      } catch (err) {
        toast.error("PDF generation failed. Check console.");
        console.error(err);
      } finally {
        setGeneratingId(null);
      }
    }
  }, [generatingId]);

  const hoveredNodeName = tooltip.visible && tooltip.node ? tooltip.node.name : "";
  const { data: newsData, isFetching: newsFetching } = trpc.intel.entityNews.useQuery(
    { entityName: hoveredNodeName },
    { enabled: !!hoveredNodeName, staleTime: 5 * 60 * 1000 }
  );

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
    if (x + 320 > rect.width)  x = e.clientX - rect.left - 336;
    if (y + 180 > rect.height) y = e.clientY - rect.top  - 180;
    setTooltip({ visible: true, x, y, node });
  }, []);

  const handleNodeMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !tooltip.node) return;
    let x = e.clientX - rect.left + 16;
    let y = e.clientY - rect.top  - 10;
    if (x + 320 > rect.width)  x = e.clientX - rect.left - 336;
    if (y + 180 > rect.height) y = e.clientY - rect.top  - 180;
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
          color: "#947231",
          marginBottom: "4px",
        }}>
          Christie's East Hampton · Institutional Network
        </h2>
        <p style={{
          fontSize: "10px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "rgba(250,248,244,0.4)",
        }}>
          Institutional Mind Map · Two Parallel Tracks · April 2026
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
          { label: "Hierarchy",    color: "#947231" },
          { label: "Partner",      color: "#947231" },
          { label: "Whale Intel",  color: "#7B5DAA" },
          { label: "Attorneys",    color: "#2a7aad" },
          { label: "Rel. Intel",   color: "#6FCF97" },
          { label: "Exports",      color: "rgba(200,172,120,0.6)" },
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
              border: `1px solid ${view === v ? "#947231" : "rgba(200,172,120,0.2)"}`,
              color: view === v ? "#947231" : "rgba(250,248,244,0.5)",
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
            {v === "full" ? "Full Web" : v === "hierarchy" ? "Hierarchy Only" : v === "recruit" ? "Rel. Intel" : "Whales"}
          </button>
        ))}
      </div>

      {/* SVG Canvas — fills full width, no horizontal scroll */}
      <div style={{ padding: "0 0 32px", overflowX: "auto" }}>
        <svg
          viewBox="0 0 1800 2060"
          style={{ width: "100%", height: "auto", display: "block", minWidth: "320px" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track divider — vertical dashed center line between the two tracks */}
          <line
            x1={900} y1={60} x2={900} y2={870}
            stroke="rgba(200,172,120,0.06)"
            strokeWidth="1"
            strokeDasharray="6,6"
          />

          {/* Track labels */}
          <text x={300} y={60} textAnchor="middle" fill="rgba(200,172,120,0.4)" fontSize="14" letterSpacing="2" fontFamily="Inter, sans-serif" style={{ textTransform: "uppercase" }}>
            AUCTION HOUSE TRACK
          </text>
          <text x={1500} y={60} textAnchor="middle" fill="rgba(200,172,120,0.4)" fontSize="14" letterSpacing="2" fontFamily="Inter, sans-serif" style={{ textTransform: "uppercase" }}>
            REAL ESTATE TRACK
          </text>

          {/* Connections */}
          <g>
            {CONNECTIONS.filter(c => isConnectionVisible(c, view)).map((conn, i) => {
              const fromNode = NODES.find(n => n.id === conn.from)!;
              const toNode   = NODES.find(n => n.id === conn.to)!;
              const fc = nodeCenter(fromNode);
              const tc = nodeCenter(toNode);
              const ls   = LINE_STYLES[conn.style];
              const isHighlighted = connected
                ? (connected.has(conn.from) && connected.has(conn.to))
                : true;
              return (
                <line
                  key={i}
                  x1={fc.x} y1={fc.y}
                  x2={tc.x} y2={tc.y}
                  stroke={ls.color}
                  strokeWidth={isHighlighted ? ls.width + (hoveredId ? 0.8 : 0) : ls.width}
                  strokeDasharray={ls.dash || undefined}
                  opacity={connected ? (isHighlighted ? 1 : 0.05) : 1}
                  style={{ transition: "opacity 0.15s" }}
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
            const isCategory = node.type === "CATEGORY" && node.members && node.rw && node.rh;
            const isMemberNode = !isCategory && node.members && node.rw && node.rh;
            const catColors = CATEGORY_COLORS[node.id] ?? null;

            return (
              <g
                key={node.id}
                style={{
                  cursor: (node.id === "ed" || (node.clickAction && node.clickAction.type !== "none")) ? (generatingId === node.id ? "wait" : "pointer") : "default",
                  opacity: dimmed ? 0.15 : 1,
                  transition: "opacity 0.15s"
                }}
                onMouseEnter={e => handleNodeEnter(e, node)}
                onMouseLeave={handleNodeLeave}
                onMouseMove={handleNodeMove}
                onClick={() => handleNodeClick(node)}
              >
                {/* ── CATEGORY / MEMBER NODE — circle with member names inside on hover ── */}
                {(isCategory || isMemberNode) && node.rw && catColors ? (
                  (() => {
                    const cr = node.rw;
                    const titleY = node.y - cr + 18;
                    const membersStartY = titleY + 18;
                    return (
                      <>
                        {/* Outer glow ring */}
                        <circle
                          cx={node.x} cy={node.y}
                          r={cr + 4}
                          fill="none"
                          stroke={catColors.stroke}
                          strokeWidth="0.5"
                          opacity="0.3"
                        />
                        {/* Main circle */}
                        <circle
                          cx={node.x} cy={node.y}
                          r={cr}
                          fill={catColors.fill}
                          stroke={catColors.stroke}
                          strokeWidth="1.8"
                          style={{ filter: hoveredId === node.id ? "brightness(1.4)" : undefined }}
                        />
                        {/* Node title — always visible, white, centered */}
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="rgba(255,255,255,1.0)"
                          fontSize="17"
                          fontWeight="600"
                          fontFamily="Inter, sans-serif"
                          letterSpacing="0.8"
                        >
                          {node.name}
                        </text>
                        {/* Divider line — only on hover */}
                        {hoveredId === node.id && <line
                          x1={node.x - cr * 0.6} y1={titleY + 5}
                          x2={node.x + cr * 0.6} y2={titleY + 5}
                          stroke={catColors.stroke}
                          strokeWidth="0.5"
                          opacity="0.5"
                        />}
                        {/* Member names — only on hover */}
                        {hoveredId === node.id && node.members!.map((name, idx) => (
                          <text
                            key={name}
                            x={node.x}
                            y={membersStartY + idx * 14}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.97)"
                            fontSize="14"
                            fontFamily="Inter, sans-serif"
                            letterSpacing="0.3"
                          >
                            {name}
                          </text>
                        ))}
                      </>
                    );
                  })()
                ) : (
                  <>
                    {/* Ed glow ring */}
                    {isEd && (
                      <circle
                        cx={node.x} cy={node.y}
                        r={node.r + 10}
                        fill="none"
                        stroke="rgba(200,172,120,0.12)"
                        strokeWidth="5"
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

                    {/* Node label — inside circle, centered, white */}
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isEd ? "#947231" : "rgba(255,255,255,1.0)"}
                      fontSize={isEd ? "18" : node.r < 20 ? "13" : "17"}
                      fontWeight={isEd ? "700" : "600"}
                      fontFamily="Inter, sans-serif"
                      letterSpacing="0.5"
                      style={{ filter: hoveredId === node.id ? "brightness(1.3)" : undefined }}
                    >
                      {node.name}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Flagship Team Hierarchy Modal */}
      {showTeamModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10,18,35,0.82)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setShowTeamModal(false)}
        >
          <div
            style={{
              background: "#1b2a4a",
              border: "1px solid rgba(200,172,120,0.5)",
              borderRadius: "10px",
              padding: "32px 36px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#947231", marginBottom: 6 }}>
                  Christie's East Hampton · 26 Park Place
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 600, color: "#FAF8F4", letterSpacing: "0.04em" }}>
                  Flagship Team
                </div>
                <div style={{ fontSize: 12, color: "rgba(250,248,244,0.45)", marginTop: 4 }}>
                  Internal hierarchy · Equity participants · Direct responsibility
                </div>
              </div>
              <button
                onClick={() => setShowTeamModal(false)}
                style={{ background: "none", border: "1px solid rgba(200,172,120,0.3)", color: "rgba(200,172,120,0.7)", borderRadius: 4, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                ×
              </button>
            </div>

            {/* Team rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FLAGSHIP_HIERARCHY.map((member, i) => (
                <div
                  key={member.name}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "12px 16px",
                    background: i === 0 ? "rgba(200,172,120,0.08)" : "rgba(250,248,244,0.03)",
                    border: i === 0 ? "1px solid rgba(200,172,120,0.3)" : "1px solid rgba(250,248,244,0.06)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ minWidth: 6, height: 6, borderRadius: "50%", background: member.status === "ACTIVE" ? "#6FCF97" : "#D4A843", marginTop: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", fontWeight: 600, color: i === 0 ? "#947231" : "#FAF8F4" }}>
                        {member.name}
                      </span>
                      <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,172,120,0.6)", fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {member.role}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(250,248,244,0.45)", marginTop: 3, lineHeight: 1.5 }}>
                      {member.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(200,172,120,0.15)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(250,248,244,0.25)", textAlign: "center" }}>
              Click anywhere outside to close
            </div>
          </div>
        </div>
      )}

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
            minWidth: "260px",
            maxWidth: "320px",
            pointerEvents: "none",
            zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, color: "#947231", marginBottom: "2px" }}>
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
            <div style={{ fontSize: "12px", color: "rgba(250,248,244,0.5)", marginTop: "8px", lineHeight: 1.5, fontStyle: "italic" }}>
              {tooltip.node.note}
            </div>
          )}
          {/* Live news panel */}
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(200,172,120,0.15)" }}>
            <div style={{ fontSize: "8px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(200,172,120,0.5)", marginBottom: "5px" }}>
              Live Intelligence
            </div>
            {newsFetching ? (
              <div style={{ fontSize: "11px", color: "rgba(250,248,244,0.3)", fontStyle: "italic" }}>Fetching…</div>
            ) : newsData?.news ? (
              <div style={{ fontSize: "11px", color: "rgba(250,248,244,0.6)", lineHeight: 1.5 }}>{newsData.news}</div>
            ) : (
              <div style={{ fontSize: "11px", color: "rgba(250,248,244,0.25)", fontStyle: "italic" }}>No recent intelligence</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
