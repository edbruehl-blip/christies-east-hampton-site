/**
 * InstitutionalMindMap
 * ─────────────────────────────────────────────────────────────────────────────
 * INTEL Layer 1 · Institutional Mind Map
 * Sprint 14 rebuild — two parallel tracks, Cerutti removed, corrected org structure
 *
 * LEFT TRACK — Auction House / Family Side:
 *   Artémis S.A. → FHP (Board Chair) → Bonnie Brennan (CEO)
 *   → Relationship layer: Tash Perrin, Stephen Lash, Julien Pradels, Rahul Kadakia
 *
 * RIGHT TRACK — Real Estate Operating Side:
 *   CIH / Robert Reffkin → @properties / Thad Wong & Mike Golden
 *   → CIRE / Gavin Swartzman → CIREG / Ilija Pavlović → Sherri Balassone
 *
 * Ed Bruehl sits at the bottom center where both tracks converge.
 *
 * Architecture:
 *  - Pure SVG rendered in React — no iframe, no canvas, no external lib
 *  - Hover: tooltip + connected-line highlight + dim unconnected nodes
 *  - View toggle: Full Web | Hierarchy Only | Recruits | Whales
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  generateMarketReport,
  generateChristiesLetter,
  generateEastHamptonVillageReport,
} from "@/lib/pdf-exports";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = "HIERARCHY" | "RECRUIT" | "PARTNER" | "WHALE" | "ATTORNEY" | "RELATIONSHIP_INTELLIGENCE" | "EXPORT_NODE";
type NodeStatus = "ACTIVE" | "WARM" | "COLD";
type ConnectionStyle = "hierarchy" | "partner" | "recruit" | "whale" | "social" | "intelligence";
type ViewMode = "full" | "hierarchy" | "recruit" | "whale";

type ClickAction =
  | { type: "pdf"; label: string; fn: () => Promise<void> }
  | { type: "nav"; tab: string; label: string }
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

  // ── CROWN — Artémis S.A. ────────────────────────────────────────────────────
  { id: "artemis",
    name: "Artémis S.A.",
    title: "Pinault Family Holding Company · Paris",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Ultimate parent of Christie's global brand. François Pinault (père, founder) + François-Henri Pinault (fils, Managing Partner). Acquired Christie's 1998. Wholly family-owned. ~€28B asset base.",
    x: 640, y: 60, r: 24 },

  // ── LEFT TRACK — Auction House / Family Side ─────────────────────────────

  // Governance tier
  { id: "pinault",
    name: "François-Henri Pinault",
    title: "Board Chair, Christie's · Artémis",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Board Chair, Christie's (effective March 27–30, 2026, replacing Cerutti). Managing Partner, Artémis. Former Kering CEO (stepped down Sept 2025). Tightest family control of Christie's in a decade.",
    x: 310, y: 160, r: 22 },

  // Operations tier
  { id: "brennan",
    name: "Bonnie Brennan",
    title: "CEO, Christie's",
    type: "HIERARCHY", status: "ACTIVE",
    note: "CEO since Feb 1, 2025. First American woman to lead Christie's in 259 years. Former President, Americas (48% of global sales). $6.2B in 2025 sales (+6% YoY). Overseeing Rockefeller Center HQ renovation.",
    x: 310, y: 270, r: 20 },

  // Relationship layer
  { id: "tash",
    name: "Tash Perrin",
    title: "Deputy Chairman, International",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Deputy Chairman, Christie's International (since June 2020). At Christie's since 1998. Trusts, Estates & Appraisals. Conducted Rockefeller Collection sale ($106.9M). Bridge to estate advisory.",
    x: 110, y: 390, r: 17 },

  { id: "lash",
    name: "Stephen Lash",
    title: "Chairman Emeritus",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Chairman Emeritus, Christie's New York. At Christie's since 1976 (~50 years). Founded Christie's North American operations. Orchestrated Bloch-Bauer/Klimt sale ($300M). Ed's senior institutional relationship.",
    x: 220, y: 390, r: 16 },

  { id: "pradels",
    name: "Julien Pradels",
    title: "Regional President, Americas",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Regional President, Americas (Spring 2025). Succeeded Bonnie Brennan in this role. At Christie's since 2011. Launched Christie's first Shanghai auction (2013). Overseeing Rockefeller Center HQ renovation.",
    x: 340, y: 390, r: 16 },

  { id: "kadakia",
    name: "Rahul Kadakia",
    title: "President, APAC + Global Luxury",
    type: "HIERARCHY", status: "ACTIVE",
    note: "President, Christie's Asia Pacific + Global Luxury (Jan 2026). At Christie's since 1996 (~30 years). Fourth-generation jeweler from Mumbai. Relocated to Hong Kong Jan 2026. One of the world's most recognized auctioneers.",
    x: 460, y: 390, r: 16 },

  // Gooding — auction house partner bridge
  { id: "gooding",
    name: "David Gooding",
    title: "President, Gooding Christie's",
    type: "PARTNER", status: "ACTIVE",
    note: "Automotive auction division acquired by Christie's 2025. The Bridge Hamptons car show. UHNW collector pipeline. Gooding & Company rebranded as Gooding Christie's.",
    x: 110, y: 510, r: 14 },

  // ── RIGHT TRACK — Real Estate Operating Side ─────────────────────────────

  // CIH / Reffkin
  { id: "cih",
    name: "CIH / Robert Reffkin",
    title: "CIH Chairman & CEO",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Chairman & CEO, Compass International Holdings (CIH). Compass–Anywhere merger closed Jan 9, 2026 (~$1.6B deal). CIH controls CIRE brand license, @properties, Sotheby's IR, Coldwell Banker, Century 21, Corcoran, ERA, BHGRE. 340,000 agents, 120 countries.",
    x: 970, y: 160, r: 22 },

  // @properties / Wong & Golden
  { id: "atprops",
    name: "Thad Wong / Mike Golden",
    title: "@properties Co-CEOs",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Co-Founders & Co-CEOs, @properties Christie's International Real Estate. Acquired CIRE brand license Nov 2021 for long-term global license. Sold @properties to Compass Jan 2025 for $444M. Remained as Co-CEOs. 25-year partnership built on total trust.",
    x: 970, y: 270, r: 20 },

  // CIRE / Swartzman
  { id: "swartzman",
    name: "Gavin Swartzman",
    title: "CIRE President",
    type: "HIERARCHY", status: "ACTIVE",
    note: "President (Global), Christie's International Real Estate (June 2025). Former CEO, Peerage Realty Partners (11 years). Reports to Wong & Golden. Oversees 100+ affiliate firms in 50 countries. Swanepoel Power 200.",
    x: 970, y: 380, r: 18 },

  // CIREG / Ilija
  { id: "ilija",
    name: "Ilija Pavlović",
    title: "CIREG Owner & CEO",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Owner, President & CEO, CIREG Tri-State. Exclusive CIRE affiliate for NY/NJ/CT. ~30 offices, ~1,200 agents, $4B+ annual volume. Appointed Ed Bruehl Nov 2025. Built CIREG from 3 offices (2017) to regional powerhouse.",
    x: 970, y: 490, r: 20 },

  // Melissa True — CIREG colleague
  { id: "melissa",
    name: "Melissa True",
    title: "Team Leader · CIREG NYC Flatiron",
    type: "HIERARCHY", status: "ACTIVE",
    note: "CIREG colleague. Christie's NYC Flatiron office. Father: Richard True, Palm Beach builder. Key referral node between CIREG and Ed's East Hampton operation.",
    x: 1080, y: 590, r: 14 },

  // Sherri Balassone
  { id: "sherri",
    name: "Sherri Balassone",
    title: "VP & BOR",
    type: "HIERARCHY", status: "ACTIVE",
    note: "VP Corporate Broker / BOR for East Hampton. Licensed NY Bar attorney. Sherri is the legal and compliance anchor for Christie's East Hampton.",
    x: 970, y: 600, r: 16 },

  // ── ED — center bridge ───────────────────────────────────────────────────
  { id: "ed",
    name: "Ed Bruehl",
    title: "Managing Director",
    type: "HIERARCHY", status: "ACTIVE",
    note: "$1B+ career sales. 20+ years East End. Managing Director, Christie's East Hampton. 26 Park Place. Appointed by Ilija Pavlović Nov 2025. Bridge between the auction house relationship and the real estate operating chain.",
    x: 640, y: 730, r: 32 },

  // ── CHRISTIE'S EAST HAMPTON TEAM ─────────────────────────────────────────
  { id: "jarvis",
    name: "Jarvis Slade Jr.",
    title: "COO · Operations",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Former COO, CIRE global. Former President, A&K. 50/50 origination partner. Operations anchor.",
    x: 480, y: 840, r: 15 },

  { id: "zoila",
    name: "Zoila Ortega Astor",
    title: "Office Manager",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Office operations, client relations, culture.",
    x: 590, y: 860, r: 13 },

  { id: "angel",
    name: "Angel Theodore",
    title: "Junior Partner",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Intelligence and operations. Full-time.",
    x: 700, y: 860, r: 13 },

  { id: "sebastian",
    name: "Sebastian Mobo",
    title: "Broker",
    type: "HIERARCHY", status: "ACTIVE",
    note: "Christie's East Hampton broker.",
    x: 590, y: 960, r: 11 },

  // ── WHALES — left cluster ────────────────────────────────────────────────
  { id: "lily",
    name: "Lily Fan",
    title: "Family Office · Private",
    type: "WHALE", status: "ACTIVE",
    note: "Whale #1. 140 Hands Creek (ANEW), 18 Tara Rd, $20–22M Brooklyn portfolio. Family office principal.",
    x: 100, y: 650, r: 17 },

  { id: "moeser",
    name: "Rick Moeser",
    title: "Premier Estate Properties · UHNW",
    type: "WHALE", status: "ACTIVE",
    note: "Former CIRE Executive Director 17 years. UHNW intelligence source. Auction referral pipeline.",
    x: 100, y: 750, r: 14 },

  { id: "ingrao",
    name: "Tony Ingrao",
    title: "Principal, Ingrao Inc.",
    type: "WHALE", status: "ACTIVE",
    note: "Interior design. Baccarat Hotel. Huntting Lane EH. UHNW buyer network.",
    x: 130, y: 840, r: 13 },

  { id: "schnepps",
    name: "Josh Schnepps",
    title: "CEO, Schnepps Media · Dan's Papers",
    type: "WHALE", status: "ACTIVE",
    note: "$2K/month pilot active. Heath Freeman connection. 61K+ email subscribers. Dan's Papers.",
    x: 185, y: 930, r: 14 },

  { id: "freeman",
    name: "Heath Freeman",
    title: "Alden Capital · EHP Resort",
    type: "WHALE", status: "ACTIVE",
    note: "Owns EHP Resort & Marina, Harbor Bistro. Josh Schnepps' closest friend. Alden Capital.",
    x: 130, y: 1010, r: 14 },

  { id: "murray",
    name: "Art Murray",
    title: "Flambeaux Wine · TOWN Dinners",
    type: "WHALE", status: "ACTIVE",
    note: "Flambeaux investor pitch. Mayacama Vintner seat. TOWN dinner engine.",
    x: 270, y: 990, r: 13 },

  // ── RECRUITS — bottom center-left ───────────────────────────────────────
  { id: "brenneman",
    name: "Debbie Brenneman",
    title: "Corcoran East Hampton · Tier 1",
    type: "RECRUIT", status: "COLD",
    note: "Multi-Million Dollar Club. Top 1% NRT nationally. Neighbor at 51 Main St.",
    x: 340, y: 890, r: 13 },

  { id: "c_esposito",
    name: "Charlie Esposito",
    title: "Corcoran East Hampton · Tier 1",
    type: "RECRUIT", status: "COLD",
    note: "Compass-merger exposed. Team anchor. Negotiating specialist.",
    x: 280, y: 960, r: 12 },

  { id: "m_esposito",
    name: "Michael Esposito",
    title: "Corcoran East Hampton · Tier 2",
    type: "RECRUIT", status: "COLD",
    note: "Charlie's son. Growing producer. Avg sale $3.42M.",
    x: 370, y: 1000, r: 11 },

  { id: "baris",
    name: "Nola Baris",
    title: "Sotheby's East Hampton · Archetype",
    type: "RECRUIT", status: "COLD",
    note: "The Baris Team. Family practice. Educator-turned-broker. Compass-merger exposed.",
    x: 310, y: 1050, r: 11 },

  // Frank Newbold — RELATIONSHIP_INTELLIGENCE (not a recruit, comes through the brand)
  { id: "newbold",
    name: "Frank Newbold",
    title: "Christie's International RE · Brand",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "RELATIONSHIP_INTELLIGENCE — comes through the brand. Not cold outreach. Not Jarvis pipeline. Brand-level relationship.",
    x: 450, y: 790, r: 13 },

  // ── EXPORTS — bottom center (PDF operating interface) ──────────────────────
  { id: "exports",
    name: "EXPORTS",
    title: "PDF Operating Interface · All Reports",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "All PDF exports generated by the platform. Click any sub-node to generate the PDF directly. Market Report · Christie's Letter · Hamlet PDFs x11 · ANEW Build Memo · Christie CMA · Deal Brief · Investment Memo · UHNW Path Card · FUTURE Pro Forma.",
    x: 640, y: 1060, r: 18 },

  // ── EXPORTS sub-nodes — nine clickable PDF triggers ───────────────────────
  { id: "exp_market",
    name: "Market Report",
    title: "Five-Page PDF · Live Market Matrix Data",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the five-page Christie's East Hampton Market Report PDF using live Market Matrix sheet data at generation time.",
    x: 420, y: 1160, r: 10,
    clickAction: { type: "pdf", label: "Generating Market Report PDF…", fn: () => generateMarketReport() } },

  { id: "exp_letter",
    name: "Christie's Letter",
    title: "Founding Letter PDF",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the Christie's East Hampton founding letter PDF.",
    x: 510, y: 1200, r: 10,
    clickAction: { type: "pdf", label: "Generating Christie's Letter PDF…", fn: () => generateChristiesLetter() } },

  { id: "exp_hamlet",
    name: "Hamlet PDFs x11",
    title: "East Hampton Village Report · All Hamlets",
    type: "EXPORT_NODE", status: "ACTIVE",
    note: "Generates the East Hampton Village Report PDF covering all eleven hamlets.",
    x: 590, y: 1220, r: 10,
    clickAction: { type: "pdf", label: "Generating Hamlet PDFs…", fn: () => generateEastHamptonVillageReport() } },

  { id: "exp_anew",
    name: "ANEW Build Memo",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the ANEW Build Memo PDF. Requires a deal to be loaded in the ANEW calculator first. Click to navigate to ANEW.",
    x: 670, y: 1220, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_cma",
    name: "Christie CMA",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Christie's CMA PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 750, y: 1200, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_brief",
    name: "Deal Brief",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Deal Brief PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 820, y: 1175, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_invest",
    name: "Investment Memo",
    title: "Requires Deal Loaded in ANEW Calculator",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the Investment Memo PDF. Requires a deal to be loaded in the ANEW calculator first.",
    x: 870, y: 1140, r: 10,
    clickAction: { type: "nav", tab: "anew", label: "Navigate to ANEW to load a deal first" } },

  { id: "exp_uhnw",
    name: "UHNW Path Card",
    title: "Coming Sprint 22",
    type: "EXPORT_NODE", status: "COLD",
    note: "UHNW Path Card PDF export. Coming Sprint 22.",
    x: 890, y: 1100, r: 10,
    clickAction: { type: "toast", message: "UHNW Path Card PDF — Coming Sprint 22" } },

  { id: "exp_future",
    name: "FUTURE Pro Forma",
    title: "Requires FUTURE Tab Input",
    type: "EXPORT_NODE", status: "WARM",
    note: "Generates the FUTURE Pro Forma PDF. Requires FUTURE tab input data. Click to navigate to FUTURE tab.",
    x: 880, y: 1060, r: 10,
    clickAction: { type: "nav", tab: "future", label: "Navigate to FUTURE tab to set up pro forma" } },

  // ── PIERRE PROPERTY REPORTS — connected to Pierre Debbas ─────────────────
  { id: "pierre_reports",
    name: "Pierre · Property Reports",
    title: "Romer Debbas LLP · Property Analysis",
    type: "ATTORNEY", status: "ACTIVE",
    note: "Property analysis reports Pierre Debbas runs for Ed. Tracked in Office Pipeline Sheet: 'Property Report Date' + 'Property Report Link' columns (pending listings section). Angel manages entries.",
    x: 760, y: 930, r: 12 },

  // ── SOCIAL — bottom left (raw signal collection) ──────────────────────────
  { id: "social",
    name: "SOCIAL",
    title: "Signal Collection · Instagram · YouTube · TikTok · X · LinkedIn · Facebook",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Raw signal collection layer. Ed's presence across all six platforms. Data field only — no interpretation here. Feeds directly into PERPLEXITY for synthesis and territory intelligence.",
    x: 420, y: 1140, r: 16 },

  // ── PERPLEXITY — bottom center-right (interpretation engine) ─────────────
  { id: "perplexity",
    name: "PERPLEXITY",
    title: "Territory Intelligence Engine · Weekly Report",
    type: "RELATIONSHIP_INTELLIGENCE", status: "ACTIVE",
    note: "Interpretation engine. Receives raw social signals from SOCIAL node. Weekly output: Ed Bruehl Signal · Competitor Moves (Compass, Sotheby's) · Cross Analysis · Recommended Action. No vanity metrics. No generic advice. First report this week.",
    x: 760, y: 1140, r: 16 },

  // ── ATTORNEYS — bottom right ─────────────────────────────────────────────
  { id: "debbas",
    name: "Pierre Debbas",
    title: "Romer Debbas LLP · Podcast Co-Host",
    type: "ATTORNEY", status: "ACTIVE",
    note: "Manhattan + Hamptons RE law. Co-host The Bruehl Report. Ep. 1 live.",
    x: 870, y: 840, r: 15 },

  { id: "lester",
    name: "Brian Lester",
    title: "Tarbet & Lester PLLC · Partner",
    type: "ATTORNEY", status: "ACTIVE",
    note: "Trusts, estates, RE litigation. East Hampton. Every major transaction.",
    x: 940, y: 930, r: 13 },

  { id: "tarbet",
    name: "Jonathan Tarbet",
    title: "Tarbet & Lester PLLC · Founding Partner",
    type: "ATTORNEY", status: "ACTIVE",
    note: "Land use, zoning, EH Town history. 132 N Main St East Hampton.",
    x: 1040, y: 880, r: 13 },

  { id: "mcgrath",
    name: "Seamus McGrath",
    title: "Tarbet & Lester PLLC · Associate",
    type: "ATTORNEY", status: "ACTIVE",
    note: "RE law. East Hampton. Active on East End transactions.",
    x: 1000, y: 970, r: 11 },
];

const CONNECTIONS: MapConnection[] = [
  // ── Crown → both tracks ──────────────────────────────────────────────────
  { from: "artemis",   to: "pinault",    style: "hierarchy" },
  { from: "artemis",   to: "cih",        style: "hierarchy" },

  // ── LEFT TRACK — Auction House / Family ─────────────────────────────────
  { from: "pinault",   to: "brennan",    style: "hierarchy" },
  { from: "brennan",   to: "tash",       style: "hierarchy" },
  { from: "brennan",   to: "lash",       style: "hierarchy" },
  { from: "brennan",   to: "pradels",    style: "hierarchy" },
  { from: "brennan",   to: "kadakia",    style: "hierarchy" },
  { from: "tash",      to: "gooding",    style: "partner" },
  { from: "tash",      to: "ed",         style: "partner" },
  { from: "lash",      to: "ed",         style: "partner" },

  // ── RIGHT TRACK — Real Estate Operating ─────────────────────────────────
  { from: "cih",       to: "atprops",    style: "hierarchy" },
  { from: "atprops",   to: "swartzman",  style: "hierarchy" },
  { from: "swartzman", to: "ilija",      style: "hierarchy" },
  { from: "ilija",     to: "melissa",    style: "hierarchy" },
  { from: "ilija",     to: "sherri",     style: "hierarchy" },
  { from: "sherri",    to: "ed",         style: "hierarchy" },
  { from: "ilija",     to: "ed",         style: "hierarchy" },

  // ── Ed's team ────────────────────────────────────────────────────────────
  { from: "ed", to: "jarvis",            style: "hierarchy" },
  { from: "ed", to: "zoila",             style: "hierarchy" },
  { from: "ed", to: "angel",             style: "hierarchy" },
  { from: "ed", to: "sebastian",         style: "hierarchy" },

  // ── Ed to whales ─────────────────────────────────────────────────────────
  { from: "ed", to: "lily",              style: "whale" },
  { from: "ed", to: "moeser",            style: "whale" },
  { from: "ed", to: "ingrao",            style: "whale" },
  { from: "ed", to: "schnepps",          style: "whale" },
  { from: "ed", to: "freeman",           style: "whale" },
  { from: "ed", to: "murray",            style: "whale" },

  // ── Ed to recruits ───────────────────────────────────────────────────────
  { from: "ed", to: "brenneman",         style: "recruit" },
  { from: "ed", to: "c_esposito",        style: "recruit" },
  { from: "ed", to: "m_esposito",        style: "recruit" },
  { from: "ed", to: "baris",             style: "recruit" },

  // Frank Newbold — brand relationship bridge
  { from: "ed", to: "newbold",           style: "partner" },

  // ── Ed to attorneys ──────────────────────────────────────────────────────
  { from: "ed", to: "debbas",            style: "partner" },
  { from: "ed", to: "lester",            style: "partner" },
  { from: "ed", to: "tarbet",            style: "partner" },
  { from: "ed", to: "mcgrath",           style: "partner" },

  // Attorney cluster internal
  { from: "debbas",    to: "lester",     style: "social" },
  { from: "lester",    to: "tarbet",     style: "social" },
  { from: "lester",    to: "mcgrath",    style: "social" },
  { from: "tarbet",    to: "mcgrath",    style: "social" },

  // Whale cross-connections
  { from: "murray",    to: "schnepps",   style: "social" },
  { from: "schnepps",  to: "freeman",    style: "social" },

  // Recruit cluster — same firm
  { from: "brenneman", to: "c_esposito", style: "social" },
  { from: "c_esposito",to: "m_esposito", style: "social" },
  // ── EXPORTS — Ed is the operating hub for all PDF exports ──────────────────────
  { from: "ed",        to: "exports",         style: "partner" },
  // EXPORTS sub-node connections
  { from: "exports",   to: "exp_market",      style: "intelligence" },
  { from: "exports",   to: "exp_letter",      style: "intelligence" },
  { from: "exports",   to: "exp_hamlet",      style: "intelligence" },
  { from: "exports",   to: "exp_anew",        style: "intelligence" },
  { from: "exports",   to: "exp_cma",         style: "intelligence" },
  { from: "exports",   to: "exp_brief",       style: "intelligence" },
  { from: "exports",   to: "exp_invest",      style: "intelligence" },
  { from: "exports",   to: "exp_uhnw",        style: "intelligence" },
  { from: "exports",   to: "exp_future",      style: "intelligence" },
  // ── PIERRE PROPERTY REPORTS — connected to Pierre Debbas ──────────────────────
  { from: "debbas",    to: "pierre_reports",  style: "partner" },
  { from: "ed",        to: "pierre_reports",  style: "partner" },

  // ── SOCIAL → PERPLEXITY — EXPLICIT DRAWN CONNECTION (not implied, not soft) ────────
  // SOCIAL = data field (raw signal collection). PERPLEXITY = interpretation engine.
  // This connection is the mandate: territory intelligence, weekly, no exceptions.
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
};

const LINE_STYLES: Record<ConnectionStyle, { color: string; width: number; dash: string }> = {
  hierarchy: { color: "rgba(200,172,120,0.45)", width: 1.8, dash: "" },
  partner:   { color: "rgba(200,172,120,0.2)",  width: 0.8, dash: "5,4" },
  recruit:   { color: "rgba(45,90,61,0.2)",     width: 0.8, dash: "4,4" },
  whale:     { color: "rgba(123,93,170,0.18)",  width: 0.8, dash: "4,4" },
  social:      { color: "rgba(250,248,244,0.12)", width: 0.6, dash: "2,3" },
  intelligence: { color: "rgba(200,172,120,0.7)",  width: 2.2, dash: "" },  // explicit drawn connection — SOCIAL → PERPLEXITY
};

const STATUS_COLORS: Record<NodeStatus, { bg: string; color: string }> = {
  ACTIVE: { bg: "rgba(45,90,61,0.4)",    color: "#6FCF97" },
  WARM:   { bg: "rgba(200,172,120,0.3)", color: "#D4A843" },
  COLD:   { bg: "rgba(74,101,165,0.3)",  color: "#7BA4D4" },
};

const SECTION_LABELS = [
  { text: "ARTÉMIS · PINAULT FAMILY",               x: 640,  y: 28  },
  { text: "AUCTION HOUSE · FAMILY SIDE",             x: 290,  y: 128 },
  { text: "REAL ESTATE OPERATING SIDE",              x: 990,  y: 128 },
  { text: "GOVERNANCE",                              x: 290,  y: 210 },
  { text: "OPERATIONS",                              x: 290,  y: 318 },
  { text: "RELATIONSHIP LAYER",                      x: 290,  y: 358 },
  { text: "CIH · COMPASS INTL HOLDINGS",             x: 990,  y: 210 },
  { text: "@PROPERTIES · CIRE BRAND",                x: 990,  y: 318 },
  { text: "CIREG TRI-STATE",                         x: 990,  y: 448 },
  { text: "CHRISTIE\'S EAST HAMPTON",                x: 640,  y: 698 },
  { text: "WHALES",                                  x: 115,  y: 618 },
  { text: "RECRUITS",                                x: 330,  y: 768 },
   { text: "ATTORNEYS",                              x: 980,  y: 808 },
  { text: "PDF EXPORTS · OPERATING INTERFACE",         x: 640,  y: 1040 },
  { text: "PROPERTY REPORTS",                        x: 760,  y: 912  },
  { text: "SOCIAL · SIGNAL COLLECTION",               x: 420,  y: 1118 },
  { text: "PERPLEXITY · TERRITORY INTELLIGENCE",      x: 760,  y: 1118 },
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
      // Navigate to the tab by dispatching a custom event the parent can listen to
      window.dispatchEvent(new CustomEvent("navigate-tab", { detail: { tab: action.tab } }));
      return;
    }
    if (action.type === "pdf") {
      if (generatingId) return; // prevent double-click
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
          viewBox="0 0 1280 1280"
          style={{ width: "100%", height: "auto", display: "block", minWidth: "640px" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Track divider — vertical dashed center line */}
          <line
            x1={640} y1={80} x2={640} y2={700}
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
              fill="rgba(200,172,120,0.3)"
              fontSize="10"
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

                {/* Artémis outer ring */}
                {node.id === "artemis" && (
                  <circle
                    cx={node.x} cy={node.y}
                    r={node.r + 6}
                    fill="none"
                    stroke="rgba(200,172,120,0.2)"
                    strokeWidth="1"
                    strokeDasharray="4,3"
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

                {/* Artémis crown ◆ */}
                {node.id === "artemis" && (
                  <text x={node.x} y={node.y - node.r - 7} textAnchor="middle" fill="#c8ac78" fontSize="12">◆</text>
                )}

                {/* FHP crown ▲ */}
                {node.id === "pinault" && (
                  <text x={node.x} y={node.y - node.r - 6} textAnchor="middle" fill="#c8ac78" fontSize="12">▲</text>
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
              30-Day Intelligence
            </div>
            {newsFetching ? (
              <div style={{ fontSize: "11px", color: "rgba(250,248,244,0.3)", fontStyle: "italic" }}>Fetching…</div>
            ) : newsData?.news ? (
              <div style={{ fontSize: "11px", color: "rgba(250,248,244,0.65)", lineHeight: 1.6 }}>{newsData.news}</div>
            ) : (
              <div style={{ fontSize: "11px", color: "rgba(250,248,244,0.25)", fontStyle: "italic" }}>No recent news.</div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: "center",
        padding: "8px 24px 16px",
        borderTop: "1px solid rgba(200,172,120,0.1)",
        fontSize: "9px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "rgba(250,248,244,0.25)",
      }}>
        {NODES.length} nodes · Two Parallel Tracks · Intelligence Web Master · April 2026
      </div>
    </div>
  );
}
