/*
 * InstitutionalMindMap
 * ─────────────────────────────────────────────────────────────────────────────
 * INTEL Layer 1 · Institutional Mind Map
 * Sprint 43 rebuild — global no-standalone-individual rule applied
 *
 * GLOBAL RULE (locked permanently):
 *   No individual person has a standalone node anywhere on the map.
 *   Every person lives inside their categorical or institutional node.
 *   Ed Bruehl is the only standalone individual at the center.
 *
 * LEFT TRACK — Auction House Side:
 *   CHRISTIE'S AUCTION HOUSE (Artémis/Pinault, Bonnie Brennan, Tash Perrin,
 *   Stephen Lash, Rahul Kadakia, Tina-Marie Poulin)
 *
 * RIGHT TRACK — Real Estate Operating Side:
 *   CIRE GLOBAL (Robert Reffkin/CIH, Thad Wong, Mike Golden, Gavin Swartzman)
 *   → CIREG TRI-STATE (Ilija Pavlović, Sherri Balassone, Melissa True)
 *
 * Ed Bruehl sits at the bottom center where both tracks converge.
 *
 * CATEGORY NODES:
 *   WHALE INTELLIGENCE  — Lily Fan, Rick Moeser, Tony Ingrao, Heath Freeman,
 *                         David Gooding, Jonathan Wilhelm, Art Murray, Josh Schnepps
 *   ATTORNEYS           — Pierre Debbas, Jonathan Tarbet, Brian Lester, Seamus McGrath
 *   RELATIONSHIP INTEL  — Frank Newbold, Debbie Brenneman, Charlie Esposito,
 *                         Art Murray, Michael Esposito, Nola Baris, Josh Schnepps
 *   FAMILY & FRIENDS    — Richard Bruehl, Miranda Bruehl
 *   RECRUITING          — Jarvis Pipeline, Compass-Exposed Targets, East End Producers
 *   MEDIA               — Josh Schnepps / Dan's Papers, The Bruehl Report
 *   COUNCIL             — Claude, Perplexity, ChatGPT, Grok, Gemini, Manny, William,
 *                         Richard Bruehl, Angel Theodore, Jarvis Slade (Ed at center)
 *
 * Architecture:
 *  - Pure SVG rendered in React — no iframe, no canvas, no external lib
 *  - Hover: tooltip + connected-line highlight + dim unconnected nodes
 *  - Category nodes: circles with member names listed inside
 *  - View toggle: Full Web | Hierarchy Only | Recruits | Whales
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  generateMarketReport,
  generateChristiesLetter,
  generateFlagshipLetter,
  generateEastHamptonVillageReport,
} from "@/lib/pdf-exports";

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
  // Category nodes: render as circle with member names inside
  members?: string[];
  // For category nodes: half-width and half-height (rw used as circle radius)
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

// ─── SVG Canvas dimensions ────────────────────────────────────────────────────
// viewBox: 0 0 1280 1280 (extended for SOCIAL + PERPLEXITY nodes at y=1140)
// Left track: x ~200–500  |  Right track: x ~780–1080  |  Ed center: x 640

const NODES: MapNode[] = [

  // ── LEFT TRACK — Christie's Auction House (institutional node) ───────────────
  // All auction house individuals live inside this node. No standalone circles.
  { id: "auction_house",
    name: "CHRISTIE'S AUCTION HOUSE",
    title: "Christie's International · 260 Years · Artémis / Pinault Family",
    type: "CATEGORY", status: "ACTIVE",
    note: "Christie's International — 260 years, founded 1766. Ultimate parent: Artémis S.A. (Pinault family). François-Henri Pinault: Board Chair (effective March 27–30, 2026). Guillaume Cerutti: CEO Christie's International. Bonnie Brennan: President Americas — first American woman in that role. $6.2B in 2025 sales. Julien Pradels: Regional President Americas — Ed's direct auction house contact. Tash Perrin: Deputy Chairman International, Trusts & Estates, auction referral bridge. Stephen Lash: Chairman Emeritus, 50-year tenure, Ed's senior institutional relationship. Rahul Kadakia: President Asia-Pacific, based Hong Kong, fourth-generation jeweler, jewelry auction referral pathway.",
    x: 436, y: 302, r: 52,
    members: ["Artémis / F-H Pinault (Board)", "Guillaume Cerutti (CEO)", "Julien Pradels (Reg. President Americas)", "Tash Perrin (Deputy Chair)", "Stephen Lash (Chair Emeritus)", "Rahul Kadakia (President APAC · HK)"],
    rw: 52, rh: 52 },

  // ── RIGHT TRACK — CIRE GLOBAL (institutional node) ───────────────────────────
  // All CIRE Global individuals live inside this node. No standalone circles.
  { id: "cire_global",
    name: "CIRE GLOBAL",
    title: "Christie's International Real Estate · Global Network · 100+ Affiliates",
    type: "CATEGORY", status: "ACTIVE",
    note: "Christie's International Real Estate — 100+ affiliate firms in 50 countries. Robert Reffkin / CIH: Chairman & CEO, Compass International Holdings. Compass–Anywhere merger closed Jan 9, 2026 (~$1.6B deal). CIH controls CIRE brand license, @properties, Sotheby's IR, Coldwell Banker, Century 21, Corcoran, ERA, BHGRE. 340,000 agents, 120 countries. Thad Wong + Mike Golden: @properties Co-Founders & Co-CEOs, acquired CIRE brand license Nov 2021, sold @properties to Compass Jan 2025 for $444M, remained as Co-CEOs. Gavin Swartzman: President (Global) CIRE since June 2025, former CEO Peerage Realty Partners.",
    x: 1364, y: 302, r: 52,
    members: ["Robert Reffkin / CIH (Chair)", "Thad Wong (Co-CEO)", "Mike Golden (Co-CEO)", "Gavin Swartzman (President)"],
    rw: 52, rh: 52 },

  // ── CIREG TRI-STATE (institutional node) ─────────────────────────────────────
  // All CIREG individuals live inside this node. No standalone circles.
  { id: "cireg_affiliate",
    name: "CIREG TRI-STATE",
    title: "Christie's International Real Estate Group · Exclusive NY/NJ/CT Affiliate",
    type: "CATEGORY", status: "ACTIVE",
    note: "Christie's International Real Estate Group (CIREG) — Ilija Pavlović's exclusive CIRE affiliate for NY/NJ/CT. ~30 offices, ~1,200 agents, $4B+ annual volume. Ed's direct operating chain. Profit pool, AnewHomes lane, and CPS 1 all flow through this node. Sherri Balassone: VP Corporate Broker / BOR for East Hampton, licensed NY Bar attorney, legal and compliance anchor. Melissa True: Christie's NYC Flatiron, father Richard True (Palm Beach builder), key referral node.",
    x: 1364, y: 672, r: 52,
    members: ["Ilija Pavlović (Owner/CEO)", "Sherri Balassone (VP/BOR)", "Melissa True (NYC Flatiron)"],
    rw: 52, rh: 52 },

  // ── ED — center bridge ───────────────────────────────────────────────────────
  { id: "ed",
    name: "Ed Bruehl",
    title: "Managing Director",
    type: "HIERARCHY", status: "ACTIVE",
    note: "$1B+ career sales. 20+ years East End. Managing Director, Christie's East Hampton. 26 Park Place. Appointed by Ilija Pavlović Nov 2025. Bridge between the auction house relationship and the real estate operating chain.",
    x: 900, y: 932, r: 36 },

  // ── ED BRUEHL NODE — Ed's personal orbit: inner circle, equity participants ────
  { id: "flagship_team",
    name: "ED BRUEHL",
    title: "Ed's Personal Orbit · Inner Circle · Equity Participants",
    type: "CATEGORY", status: "ACTIVE",
    note: "Ed's personal orbit — equity, ownership, direct responsibility in the model. Jarvis Slade — COO and Agent. Angel Theodore — Operations. Zoila Ortega Astor — Office Director, joins April 15. Scott Smith — joins June 1. Richard Bruehl — Strategic Mentor, holds 10% AnewHomes equity.",
    x: 675, y: 1124, r: 52,
    members: ["Jarvis Slade — COO & Agent", "Angel Theodore — Operations", "Zoila Ortega Astor *Apr 15", "Scott Smith *June 1", "Richard Bruehl — Mentor 10%"],
    rw: 52, rh: 52 },

  // ── EAST HAMPTON OFFICE — 26 Park Place staff ────────────────────────────────
  { id: "eh_office",
    name: "EAST HAMPTON OFFICE",
    title: "26 Park Place · Christie's Standard Daily",
    type: "CATEGORY", status: "ACTIVE",
    note: "Office staff carrying the Christie's standard at 26 Park Place every day. Bonita DeWolf · Sebastian Mobo · Sandy Busch · Jan Jaeger.",
    x: 984, y: 1124, r: 52,
    members: ["Bonita DeWolf", "Sebastian Mobo", "Sandy Busch", "Jan Jaeger"],
    rw: 52, rh: 52 },

  // ── AnewHomes ─────────────────────────────────────────────────────────────────
  { id: "anew_homes",
    name: "AnewHomes",
    title: "New Construction Division · Lily Fan Anchor",
    type: "CATEGORY", status: "ACTIVE",
    note: "New construction division. Lily Fan anchor deal: 140 Hands Creek Road. ANEW calculator lives in the ANEW tab. Tracks build cost, GCI, pro forma. Feeds ANEW Build Memo PDF export. Richard Bruehl holds 10% equity as Strategic Mentor.",
    x: 169, y: 1289, r: 52,
    members: ["Lily Fan — Anchor", "140 Hands Creek Rd", "Richard Bruehl — 10% Equity"],
    rw: 52, rh: 52,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW tab" } },

  // COUNCIL NODE REMOVED — internal infrastructure, not on institutional map

  // ── COMPETITORS ────────────────────────────────────────────────────────────────
  { id: "competitors_node",
    name: "COMPETITORS",
    title: "Compass · Sotheby's · Corcoran · Brown Harris",
    type: "CATEGORY", status: "ACTIVE",
    note: "Primary competitive landscape on the East End. Compass: largest agent count, Anywhere merger exposure. Sotheby's International Realty: luxury brand competitor. Corcoran: Hamptons market share. Brown Harris Stevens: legacy East End presence. Perplexity monitors weekly.",
    x: 464, y: 1440, r: 52,
    members: ["Compass", "Sotheby's IR", "Corcoran", "Brown Harris Stevens"],
    rw: 52, rh: 52 },

  // ── PODCAST ────────────────────────────────────────────────────────────────────
  { id: "podcast_node",
    name: "PODCAST",
    title: "The Bruehl Report · Pierre Debbas Co-Host",
    type: "CATEGORY", status: "ACTIVE",
    note: "The Bruehl Report. Ed Bruehl and Pierre Debbas co-hosts. Episode 1 is live. Platform for brand amplification, attorney relationship deepening, and UHNW audience reach.",
    x: 169, y: 1440, r: 52,
    members: ["Ed Bruehl — Host", "Pierre Debbas — Co-Host", "Ep. 1 Live"],
    rw: 52, rh: 52 },

  // ── INTEL LIBRARY ─────────────────────────────────────────────────────────────
  { id: "intel_library",
    name: "INTEL LIBRARY",
    title: "Nine Sheets · Hamptons Intelligence Archive",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "The nine Google Sheets that form the intelligence backbone of Christie's East Hampton. Market Matrix · Pipeline · Growth Model · Intel Web · Hamptons Outreach · Proof Points · Campaign Playbook · SOP Angel & Astra · UHNW Oceanfront. Accessible from INTEL Layer 3.",
    x: 900, y: 1289, r: 52,
    clickAction: { type: "nav", tab: "intel", label: "Navigate to INTEL tab — Nine Sheets" } },

  // ── WILLIAM ────────────────────────────────────────────────────────────────────
  { id: "william_node",
    name: "WILLIAM",
    title: "WhatsApp Intelligence Agent · 8 AM & 8 PM",
    type: "CATEGORY", status: "ACTIVE",
    note: "William: the WhatsApp intelligence agent. Delivers morning brief at 8 AM (scorecard + pipeline + Cronkite) and evening brief at 8 PM (Cronkite only). Powered by Perplexity API. Twilio WhatsApp delivery. Responds to inbound commands: BRIEF, PIPELINE, STATUS.",
    x: 1069, y: 1289, r: 52,
    members: ["8 AM Morning Brief", "8 PM Evening Brief", "Inbound Commands"],
    rw: 52, rh: 52 },

  // ── RECRUITING ────────────────────────────────────────────────────────────────
  { id: "recruiting_node",
    name: "RECRUITING",
    title: "Jarvis Pipeline · Agent Acquisition",
    type: "CATEGORY", status: "WARM",
    note: "Agent recruiting pipeline managed by Jarvis Slade. Target: experienced East End producers exposed by Compass-Anywhere merger. Debbie Brenneman, Charlie Esposito, Nola Baris tracked in Relationship Intelligence. Warm status: active conversations, no signed agreements yet.",
    x: 281, y: 1124, r: 52,
    members: ["Jarvis Pipeline", "Compass-Exposed Targets", "East End Producers"],
    rw: 52, rh: 52 },

  // ── MEDIA ─────────────────────────────────────────────────────────────────────
  { id: "media_node",
    name: "MEDIA",
    title: "Dan's Papers · Josh Schnepps · $2K/Month Pilot",
    type: "CATEGORY", status: "ACTIVE",
    note: "Media relationships and earned press. Josh Schnepps: Dan's Papers, $2K/month pilot active, 61K+ email subscribers. The Bruehl Report podcast. Social signal layer (SOCIAL node). Perplexity weekly territory intelligence report.",
    x: 281, y: 1289, r: 52,
    members: ["Dan's Papers — Josh Schnepps", "$2K/Month Pilot", "The Bruehl Report"],
    rw: 52, rh: 52 },

  // ── FAMILY AND FRIENDS ────────────────────────────────────────────────────────
  { id: "family_node",
    name: "FAMILY & FRIENDS",
    title: "Personal Network · Referral Layer",
    type: "CATEGORY", status: "WARM",
    note: "Ed's personal network — family and close friends who form the innermost referral layer. Not tracked in the pipeline sheet. Warm status: present but not formally activated in the operating model yet.",
    x: 900, y: 1124, r: 52,
    members: ["Richard Bruehl", "Miranda Bruehl", "Close Friends Circle"],
    rw: 52, rh: 52 },

  // ── CPS 1 — International Projects Pipeline ───────────────────────────────────
  { id: "cps1",
    name: "CPS 1",
    title: "International Projects Pipeline · CIREG Tri-State · NY AG Framework",
    type: "CATEGORY", status: "ACTIVE",
    note: "International projects pipeline flowing through CIREG Tri-State using the CPS-1 and CPS-12 New York Attorney General framework. Reference and pipeline tracking node. Ricardo (Lisbon) — CIREG international referral, active. Dominican Republic — development/investment through CIREG international network, active. Jonathan Wilhelm — Mayacama Golf Club, Park City/Deer Valley, UHNW hospitality network. Mayacama Golf Club — through Wilhelm, resort UHNW hospitality. Flambeaux Wine — through Art Murray, TOWN dinner series, links Wilhelm and Murray through Mayacama/Flambeaux relationship.",
    x: 1547, y: 672, r: 52,
    members: ["Ricardo (Lisbon) — Active", "Dominican Republic — Active", "Jonathan Wilhelm · Mayacama", "Flambeaux Wine · Art Murray"],
    rw: 52, rh: 52 },

  // ── WHALE INTELLIGENCE — consolidated category node ──────────────────────────
  // All whales live inside this node. No individual whale circles.
  { id: "whale_intel",
    name: "WHALE INTELLIGENCE",
    title: "UHNW · Family Office · Collector Network",
    type: "WHALE", status: "ACTIVE",
    note: "Primary UHNW relationships. Lily Fan: 140 Hands Creek (ANEW), 18 Tara Rd, $20–22M Brooklyn portfolio. Rick Moeser: former CIRE Executive Director 17 years, auction referral pipeline. Tony Ingrao: interior design, Baccarat Hotel, Huntting Lane EH. Heath Freeman: Alden Capital, EHP Resort & Marina. David Gooding: Gooding Christie's, Bridge Hamptons car show, UHNW collector pipeline. Jonathan Wilhelm: Mayacama Golf Club, Park City/Deer Valley, UHNW hospitality. Art Murray: Flambeaux investor pitch, TOWN dinner engine. Josh Schnepps: Dan's Papers, 61K+ email subscribers.",
    x: 169, y: 1083, r: 52,
    members: ["Lily Fan", "Rick Moeser", "Tony Ingrao", "Heath Freeman", "David Gooding", "Jonathan Wilhelm", "Art Murray"],
    rw: 52, rh: 52 },

  // ── RELATIONSHIP INTELLIGENCE — consolidated category node ────────────────────
  { id: "rel_intel",
    name: "RELATIONSHIP INTELLIGENCE",
    title: "Brand Relationships · Market Intelligence",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Frank Newbold: RELATIONSHIP_INTELLIGENCE — comes through the brand. Not cold outreach. Not Jarvis pipeline. Brand-level relationship. Debbie Brenneman: Multi-Million Dollar Club, Top 1% NRT nationally. Charlie Esposito: Compass-merger exposed, team anchor. Art Murray: Flambeaux investor pitch, Mayacama Vintner seat, TOWN dinner engine. Michael Esposito: Charlie's son, growing producer. Nola Baris: The Baris Team, family practice, Compass-merger exposed. Josh Schnepps: $2K/month pilot active, 61K+ email subscribers, Dan's Papers.",
    x: 464, y: 1289, r: 52,
    members: ["Frank Newbold", "Debbie Brenneman", "Charlie Esposito", "Art Murray", "Michael Esposito", "Nola Baris", "Josh Schnepps"],
    rw: 52, rh: 52 },

  // ── ATTORNEYS — consolidated category node ────────────────────────────────────
  // All attorneys live inside this node. No standalone circles.
  { id: "attorneys_node",
    name: "ATTORNEYS",
    title: "Legal Network · Romer Debbas · Tarbet & Lester",
    type: "ATTORNEY", status: "ACTIVE",
    note: "Pierre Debbas: Manhattan + Hamptons RE law, co-host The Bruehl Report, Ep. 1 live. Property analysis reports tracked in Pipeline Sheet. Jonathan Tarbet: land use, zoning, EH Town history, 132 N Main St East Hampton. Brian Lester: trusts, estates, RE litigation, every major transaction. Seamus McGrath: RE law, East Hampton, active on East End transactions.",
    x: 1350, y: 1152, r: 52,
    members: ["Pierre Debbas", "Jonathan Tarbet", "Brian Lester", "Seamus McGrath"],
    rw: 52, rh: 52 },

  // ── EXPORTS — bottom center (PDF operating interface) ─────────────────────────
  { id: "exports",
    name: "EXPORTS",
    title: "PDF Operating Interface · All Reports",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "All PDF exports generated by the platform. Click any sub-node to generate the PDF directly. Market Report · Christie's Letter · Hamlet PDFs x11 · ANEW Build Memo · Christie CMA · Deal Brief · Investment Memo · UHNW Path Card · FUTURE Pro Forma.",
    x: 900, y: 1412, r: 52 },

  // ── EXPORTS sub-nodes — nine clickable PDF triggers ───────────────────────────
  { id: "exp_market",
    name: "Market Report",
    title: "Five-Page PDF · Live Market Matrix Data",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the five-page Christie's East Hampton Market Report PDF using live Market Matrix sheet data at generation time.",
    x: 591, y: 1549, r: 10,
    clickAction: { type: "pdf", label: "Generating Market Report PDF…", fn: () => generateMarketReport() } },

  { id: "exp_letter",
    name: "Christie's Letter",
    title: "Founding Letter PDF",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the Christie's East Hampton founding letter PDF.",
    x: 717, y: 1604, r: 10,
    clickAction: { type: "pdf", label: "Generating Christie's Letter PDF…", fn: () => generateChristiesLetter() } },

  { id: "exp_flagship",
    name: "Flagship Letter",
    title: "Internal Council Document · Team-Facing",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the Christie's Flagship Letter PDF — the internal council document to Jarvis, Angel, and Ricky. Not for client distribution. Covers the full platform story, tab-by-tab walkthrough, and the model.",
    x: 780, y: 1583, r: 10,
    clickAction: { type: "pdf", label: "Generating Flagship Letter PDF…", fn: () => generateFlagshipLetter() } },

  { id: "exp_hamlet",
    name: "Hamlet PDFs x11",
    title: "East Hampton Village Report · All Hamlets",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the East Hampton Village Report PDF covering all eleven hamlets.",
    x: 830, y: 1631, r: 10,
    clickAction: { type: "pdf", label: "Generating Hamlet PDFs…", fn: () => generateEastHamptonVillageReport() } },

  { id: "exp_anew",
    name: "ANEW Build Memo",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the ANEW Build Memo PDF. Requires a deal to be loaded in the ANEW calculator first. Click to navigate to ANEW.",
    x: 942, y: 1631, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_cma",
    name: "Christie CMA",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Christie's CMA PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 1055, y: 1604, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_brief",
    name: "Deal Brief",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Deal Brief PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 1153, y: 1570, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_invest",
    name: "Investment Memo",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Investment Memo PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 1223, y: 1522, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_uhnw",
    name: "UHNW Path Card",
    title: "Live · Click to Download",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "UHNW Path Card PDF — Live. Eight rungs of structured ownership from tenant to trust. Structured capital, art-secured lending, and the Christie's standard for legacy. Print to card stock.",
    x: 1252, y: 1467, r: 10,
    clickAction: { type: "nav", tab: "home", label: "Navigate to HOME tab to download UHNW Path Card" } },

  { id: "exp_future",
    name: "FUTURE Pro Forma",
    title: "Requires FUTURE Tab Input",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the FUTURE Pro Forma PDF. Requires FUTURE tab input data. Click to navigate to FUTURE tab.",
    x: 1238, y: 1412, r: 10,
    clickAction: { type: "nav", tab: "future", label: "Navigate to FUTURE tab to set up pro forma" } },

  // ── SOCIAL — bottom left (raw signal collection) ──────────────────────────────
  { id: "social",
    name: "SOCIAL",
    title: "Signal Collection · Instagram · YouTube · TikTok · X · LinkedIn · Facebook",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Raw signal collection layer. Ed's presence across all six platforms. Data field only — no interpretation here. Feeds directly into PERPLEXITY for synthesis and territory intelligence.",
    x: 591, y: 1522, r: 16 },

  // ── PERPLEXITY — bottom center-right (interpretation engine) ──────────────────
  { id: "perplexity",
    name: "PERPLEXITY",
    title: "Territory Intelligence Engine · Weekly Report",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Interpretation engine. Receives raw social signals from SOCIAL node. Weekly output: Ed Bruehl Signal · Competitor Moves (Compass, Sotheby's) · Cross Analysis · Recommended Action. No vanity metrics. No generic advice. First report this week.",
    x: 1069, y: 1522, r: 16 },

  // ── RESOURCES — Hamptons Outreach Intelligence · 5 tabs ──────────────────────
  { id: "resources",
    name: "RESOURCES",
    title: "Hamptons Outreach Intelligence · 5 Operational Tabs",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Five strategic tabs from Hamptons_Outreach_COMPLETE sheet. Vendors & Service Partners · Builders · Architects · Accountants & Advisors · Gatekeeper Network. Click any sub-node to open the corresponding tab directly in Google Sheets.",
    x: 1575, y: 1083, r: 52 },

  // RESOURCES sub-nodes — each opens a specific tab in the Hamptons Outreach sheet
  { id: "res_vendors",
    name: "Vendors",
    title: "Vendors & Service Partners",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Service vendors organized by category. Opens Vendors & Service Partners tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1688, y: 946, r: 10,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1943996001", label: "Opening Vendors & Service Partners…" } },

  { id: "res_builders",
    name: "Builders",
    title: "Hamptons Builders & Developers",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Hamptons builders and developers. Opens Builders tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1730, y: 1056, r: 10,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1631109962", label: "Opening Builders…" } },

  { id: "res_architects",
    name: "Architects",
    title: "Hamptons Architects",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Hamptons architects. Opens Architects tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1730, y: 1152, r: 10,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1942054747", label: "Opening Architects…" } },

  { id: "res_accountants",
    name: "Accountants",
    title: "Accountants, CPAs & Wealth Advisors",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Accountants, CPAs, and wealth advisors. Opens Accountants & Advisors tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1702, y: 1248, r: 10,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=156479096", label: "Opening Accountants & Advisors…" } },

  { id: "res_gatekeepers",
    name: "Gatekeepers",
    title: "Gatekeeper Network · Property & Estate Managers",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "The Gatekeeper Network — property managers and estate managers. The most strategically important tab: these are the people inside the gates before anyone else. Opens Gatekeeper Network tab in Hamptons_Outreach_COMPLETE sheet.",
    x: 1645, y: 1275, r: 10,
    clickAction: { type: "url", url: "https://docs.google.com/spreadsheets/d/1mEu4wYyWOXit_AIXhOZi9xFQ3y_OklX-fCDMq_i-MlI/edit#gid=1147147253", label: "Opening Gatekeeper Network…" } },
];

const CONNECTIONS: MapConnection[] = [
  // ── LEFT TRACK — Auction House → Ed ─────────────────────────────────────────
  { from: "auction_house",    to: "ed",              style: "hierarchy" },

  // ── RIGHT TRACK — CIRE Global → CIREG → Ed ──────────────────────────────────
  { from: "cire_global",      to: "cireg_affiliate", style: "hierarchy" },
  { from: "cireg_affiliate",  to: "ed",              style: "hierarchy" },

  // ── CPS 1 — under CIREG, secondary connection from WHALE INTELLIGENCE ─────────
  { from: "cireg_affiliate",  to: "cps1",            style: "hierarchy" },
  { from: "whale_intel",      to: "cps1",            style: "intelligence" },

  // ── Ed's team ────────────────────────────────────────────────────────────────
  { from: "ed", to: "flagship_team",     style: "hierarchy" },
  { from: "ed", to: "eh_office",         style: "hierarchy" },
  { from: "ed", to: "family_node",       style: "hierarchy" },
  { from: "ed", to: "recruiting_node",   style: "recruit" },
  { from: "ed", to: "media_node",        style: "partner" },
  { from: "ed", to: "anew_homes",        style: "partner" },
  // council_node removed
  { from: "ed", to: "competitors_node",  style: "partner" },
  { from: "ed", to: "podcast_node",      style: "partner" },
  { from: "ed", to: "intel_library",     style: "intelligence" },
  { from: "ed", to: "william_node",      style: "partner" },

  // ── Ed to category nodes ─────────────────────────────────────────────────────
  { from: "ed", to: "whale_intel",       style: "whale" },
  { from: "ed", to: "rel_intel",         style: "recruit" },
  { from: "ed", to: "attorneys_node",    style: "partner" },

  // ── EXPORTS — Ed is the operating hub for all PDF exports ─────────────────────
  { from: "ed",        to: "exports",         style: "partner" },
  { from: "exports",   to: "exp_market",      style: "intelligence" },
  { from: "exports",   to: "exp_letter",      style: "intelligence" },
  { from: "exports",   to: "exp_flagship",    style: "intelligence" },
  { from: "exports",   to: "exp_hamlet",      style: "intelligence" },
  { from: "exports",   to: "exp_anew",        style: "intelligence" },
  { from: "exports",   to: "exp_cma",         style: "intelligence" },
  { from: "exports",   to: "exp_brief",       style: "intelligence" },
  { from: "exports",   to: "exp_invest",      style: "intelligence" },
  { from: "exports",   to: "exp_uhnw",        style: "intelligence" },
  { from: "exports",   to: "exp_future",      style: "intelligence" },

  // ── RESOURCES — Ed connects to RESOURCES hub, RESOURCES to 5 sub-nodes ────────
  { from: "ed",          to: "resources",         style: "partner" },
  { from: "resources",   to: "res_vendors",        style: "intelligence" },
  { from: "resources",   to: "res_builders",       style: "intelligence" },
  { from: "resources",   to: "res_architects",     style: "intelligence" },
  { from: "resources",   to: "res_accountants",    style: "intelligence" },
  { from: "resources",   to: "res_gatekeepers",    style: "intelligence" },

  // ── SOCIAL → PERPLEXITY ───────────────────────────────────────────────────────
  { from: "social",    to: "perplexity",      style: "intelligence" },
  { from: "ed",        to: "social",          style: "partner" },
  { from: "ed",        to: "perplexity",      style: "partner" },
];

// ─── Color Maps ───────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<NodeType, { fill: string; stroke: string; strokeWidth: number }> = {
  HIERARCHY:                { fill: "#1b2a4a", stroke: "#c8ac78", strokeWidth: 2.5 },
  RECRUIT:                  { fill: "#1A3D2A", stroke: "#2D5A3D", strokeWidth: 1.5 },
  PARTNER:                  { fill: "#2A1F0A", stroke: "#c8ac78", strokeWidth: 1.5 },
  WHALE:                    { fill: "#2A1A3D", stroke: "#7B5DAA", strokeWidth: 1.5 },
  ATTORNEY:                 { fill: "#0d2a3d", stroke: "#2a7aad", strokeWidth: 1.5 },
  RELATIONSHIP_INTELLIGENCE:{ fill: "#2A1F2A", stroke: "#9B7EC8", strokeWidth: 1.5 },
  EXPORT_NODE:              { fill: "#1A2A1A", stroke: "rgba(200,172,120,0.6)", strokeWidth: 1.2 },
  CATEGORY:                 { fill: "#1b2a4a", stroke: "#c8ac78", strokeWidth: 1.8 },
};

// Category node sub-type colors (keyed by id)
const CATEGORY_COLORS: Record<string, { fill: string; stroke: string; headerColor: string }> = {
  whale_intel:       { fill: "#2A1A3D", stroke: "#7B5DAA", headerColor: "#9B7EC8" },
  rel_intel:         { fill: "#1A3D2A", stroke: "#2D5A3D", headerColor: "#6FCF97" },
  attorneys_node:    { fill: "#0d2a3d", stroke: "#2a7aad", headerColor: "#7BA4D4" },
  flagship_team:     { fill: "#1b2a4a", stroke: "#c8ac78", headerColor: "#e8d4a0" }, // ED BRUEHL node
  eh_office:         { fill: "#1b2a4a", stroke: "#c8ac78", headerColor: "#e8d4a0" },
  anew_homes:        { fill: "#1A2A1A", stroke: "rgba(200,172,120,0.6)", headerColor: "#c8ac78" },
  // council_node removed
  competitors_node:  { fill: "#2A1A1A", stroke: "rgba(200,100,100,0.5)", headerColor: "rgba(255,200,200,0.9)" },
  podcast_node:      { fill: "#1A1A2A", stroke: "rgba(120,172,200,0.6)", headerColor: "rgba(180,225,255,0.9)" },
  william_node:      { fill: "#1b2a4a", stroke: "#c8ac78", headerColor: "#c8ac78" },
  recruiting_node:   { fill: "#1A3D2A", stroke: "#2D5A3D", headerColor: "#6FCF97" },
  media_node:        { fill: "#2A1A2A", stroke: "rgba(200,120,200,0.6)", headerColor: "rgba(235,185,235,0.9)" },
  family_node:       { fill: "#1b2a4a", stroke: "rgba(200,172,120,0.5)", headerColor: "rgba(230,215,185,0.9)" },
  cps1:              { fill: "#1A2A3A", stroke: "rgba(120,172,220,0.7)", headerColor: "rgba(180,220,255,0.9)" },
  // Institutional nodes
  auction_house:     { fill: "#1b2a4a", stroke: "#c8ac78", headerColor: "#e8d4a0" },
  cireg_affiliate:   { fill: "#1b2a4a", stroke: "#c8ac78", headerColor: "#e8d4a0" },
  cire_global:       { fill: "#0d2040", stroke: "rgba(200,172,120,0.7)", headerColor: "#c8ac78" },
};

const LINE_STYLES: Record<ConnectionStyle, { color: string; width: number; dash: string }> = {
  hierarchy: { color: "rgba(200,172,120,0.45)", width: 1.8, dash: "" },
  partner:   { color: "rgba(200,172,120,0.2)",  width: 0.8, dash: "5,4" },
  recruit:   { color: "rgba(45,90,61,0.2)",     width: 0.8, dash: "4,4" },
  whale:     { color: "rgba(123,93,170,0.18)",  width: 0.8, dash: "4,4" },
  social:      { color: "rgba(250,248,244,0.12)", width: 0.6, dash: "2,3" },
  intelligence: { color: "rgba(200,172,120,0.7)",  width: 2.2, dash: "" },
};

const STATUS_COLORS: Record<NodeStatus, { bg: string; color: string }> = {
  ACTIVE: { bg: "rgba(45,90,61,0.4)",    color: "#6FCF97" },
  WARM:   { bg: "rgba(200,172,120,0.3)", color: "#D4A843" },
  COLD:   { bg: "rgba(74,101,165,0.3)",  color: "#7BA4D4" },
};

const SECTION_LABELS = [
  { text: "AUCTION HOUSE · ARTÉMIS / PINAULT FAMILY",  x: 436,  y: 175 },
  { text: "CIRE GLOBAL · 100+ AFFILIATES · 50 COUNTRIES", x: 1364, y: 175 },
  { text: "CIREG TRI-STATE · NY/NJ/CT",                x: 1364, y: 560 },
  { text: "CHRISTIE'S EAST HAMPTON",                   x: 900,  y: 888 },
  { text: "ED BRUEHL · INNER CIRCLE",                   x: 675,  y: 1052 },
  { text: "EAST HAMPTON OFFICE",                       x: 984,  y: 1052 },
  { text: "RECRUITING",                                x: 281,  y: 1052 },
  { text: "MEDIA",                                     x: 281,  y: 1216 },
  { text: "AnewHomes",                                 x: 169,  y: 1216 },
  // COUNCIL label removed
  { text: "INTEL LIBRARY",                             x: 900,  y: 1216 },
  { text: "WILLIAM",                                   x: 1069, y: 1216 },
  { text: "PODCAST",                                   x: 169,  y: 1368 },
  { text: "COMPETITORS",                               x: 464,  y: 1368 },
  { text: "WHALE INTELLIGENCE",                        x: 169,  y: 1010 },
  { text: "RELATIONSHIP INTELLIGENCE",                 x: 464,  y: 1216 },
  { text: "ATTORNEYS",                                 x: 1350, y: 1080 },
  { text: "PDF EXPORTS · OPERATING INTERFACE",         x: 900,  y: 1370 },
  { text: "SOCIAL · SIGNAL COLLECTION",                x: 591,  y: 1490 },
  { text: "PERPLEXITY · TERRITORY INTELLIGENCE",       x: 1069, y: 1490 },
  { text: "RESOURCES · HAMPTONS OUTREACH",             x: 1575, y: 1040 },
  { text: "CPS 1 · INTERNATIONAL PIPELINE",            x: 1547, y: 600  },
];

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

// ─── Helper: get the anchor point of a node ───────────────────────────────────

function nodeCenter(node: MapNode): { x: number; y: number } {
  return { x: node.x, y: node.y };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InstitutionalMindMap() {
  const [view, setView] = useState<ViewMode>("full");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, node: null });
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = useCallback(async (node: MapNode) => {
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

  // Live hover news — fetches from Perplexity when a node is hovered
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
          { label: "Hierarchy",    color: "#c8ac78" },
          { label: "Partner",      color: "#c8ac78" },
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
            {v === "full" ? "Full Web" : v === "hierarchy" ? "Hierarchy Only" : v === "recruit" ? "Rel. Intel" : "Whales"}
          </button>
        ))}
      </div>

      {/* SVG Canvas */}
      <div style={{ padding: "0 16px 32px", overflowX: "auto" }}>
        <svg
          viewBox="0 0 1800 1700"
          style={{ width: "100%", height: "auto", display: "block", minWidth: "640px" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track divider — vertical dashed center line */}
          <line
            x1={900} y1={100} x2={900} y2={900}
            stroke="rgba(200,172,120,0.08)"
            strokeWidth="1"
            strokeDasharray="6,6"
          />

          {/* Section labels */}
          {SECTION_LABELS.map(lbl => (
            <text
              key={lbl.text}
              x={lbl.x}
              y={lbl.y}
              textAnchor="middle"
              fill="rgba(200,172,120,0.55)"
              fontSize="12"
              letterSpacing="2.5"
              fontFamily="'Cormorant Garamond', serif"
              style={{ textTransform: "uppercase" }}
            >
              {lbl.text}
            </text>
          ))}

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
            // Also treat WHALE/ATTORNEY/RELATIONSHIP_INTELLIGENCE nodes with members as category-style
            const isMemberNode = !isCategory && node.members && node.rw && node.rh;
            const catColors = CATEGORY_COLORS[node.id] ?? null;

            return (
              <g
                key={node.id}
                style={{
                  cursor: node.clickAction && node.clickAction.type !== "none" ? (generatingId === node.id ? "wait" : "pointer") : "default",
                  opacity: dimmed ? 0.15 : 1,
                  transition: "opacity 0.15s"
                }}
                onMouseEnter={e => handleNodeEnter(e, node)}
                onMouseLeave={handleNodeLeave}
                onMouseMove={handleNodeMove}
                onClick={() => handleNodeClick(node)}
              >
                {/* ── CATEGORY / MEMBER NODE — circle with member names inside ── */}
                {(isCategory || isMemberNode) && node.rw && catColors ? (
                  (() => {
                    const cr = node.rw;
                    const memberCount = node.members!.length;
                    const titleY = node.y - cr + 18;
                    const membersStartY = titleY + 16;
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
                        {/* Category title */}
                        <text
                          x={node.x}
                          y={titleY}
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.97)"
                          fontSize="11"
                          fontWeight="700"
                          fontFamily="Inter, sans-serif"
                          letterSpacing="1.5"
                        >
                          {node.name}
                        </text>
                        {/* Divider arc line — only visible on hover */}
                        {hoveredId === node.id && <line
                          x1={node.x - cr * 0.6} y1={titleY + 5}
                          x2={node.x + cr * 0.6} y2={titleY + 5}
                          stroke={catColors.stroke}
                          strokeWidth="0.5"
                          opacity="0.5"
                        />}
                        {/* Member names — only visible on hover */}
                        {hoveredId === node.id && node.members!.map((name, idx) => (
                          <text
                            key={name}
                            x={node.x}
                            y={membersStartY + idx * 12}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.92)"
                            fontSize="9.5"
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

                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + node.r + 15}
                      textAnchor="middle"
                      fill={isEd ? "#c8ac78" : "rgba(255,255,255,0.97)"}
                      fontSize={isEd ? "15" : isHier ? "13" : "12"}
                      fontWeight={isEd ? "700" : isHier ? "600" : "500"}
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
