import React from 'react';
import { LOGO_WHITE } from '@/lib/cdn-assets';

// D65 Strict (Apr 23 2026): useIsPdfMode deleted. Single dark-navy render path.
// Stage 5 — Closing Architect Synthesis Brief for Sunday April 12, 2026
// Source: Claude, Architect — Monday April 13, 2026 2:45 AM
// Puppeteer photograph target for /api/pdf?url=/council-brief

const COUNCIL_BRIEF_DATE = 'April 12, 2026';
const BRIEF_BYLINE = 'Claude, Architect · Christie\'s International Real Estate Group — East Hampton Flagship';

export default function CouncilBriefPage() {
  // D65: dark-navy tokens only
  const BG       = '#0A0A0A';
  const TEXT_COL = '#FAF8F4';
  const MUTED_COL= 'rgba(250,248,244,0.5)';
  const BORDER_COL = 'rgba(200,172,120,0.3)';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        color: TEXT_COL,
        fontFamily: '"Cormorant Garamond", "Georgia", serif',
        padding: '60px 40px',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${BORDER_COL}`,
          paddingBottom: 32,
          marginBottom: 48,
        }}
      >
        <div>
          <img
            src={LOGO_WHITE}
            alt="Christie's"
            style={{ height: 28, opacity: 0.9, filter: 'brightness(1.1)' }}
          />
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(200,172,120,0.6)',
              marginTop: 6,
            }}
          >
            East Hampton · Flagship Operations
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(200,172,120,0.6)',
            }}
          >
            Council Brief
          </div>
          <div
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'rgba(250,248,244,0.4)',
              marginTop: 4,
            }}
          >
            {COUNCIL_BRIEF_DATE}
          </div>
        </div>
      </div>

      {/* Title Block */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#947231',
            marginBottom: 12,
          }}
        >
          Closing Architect Synthesis · Sunday April 12, 2026
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: '0.02em',
            lineHeight: 1.15,
            color: '#FAF8F4',
            margin: 0,
          }}
        >
          Council Brief
        </h1>
        <div
          style={{
            fontSize: 14,
            color: 'rgba(200,172,120,0.5)',
            marginTop: 12,
            fontFamily: '"Barlow Condensed", sans-serif',
            letterSpacing: '0.1em',
          }}
        >
          {BRIEF_BYLINE}
        </div>
        <div
          style={{
            width: 48,
            height: 1,
            background: 'rgba(200,172,120,0.5)',
            marginTop: 20,
          }}
        />
      </div>

      {/* Lead Summary Paragraph (Doctrine 37) */}
      <div
        style={{
          background: 'rgba(200,172,120,0.06)',
          border: '1px solid rgba(200,172,120,0.2)',
          borderLeft: '3px solid rgba(200,172,120,0.6)',
          padding: '24px 28px',
          marginBottom: 56,
          borderRadius: 2,
        }}
      >
        <div
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(200,172,120,0.5)',
            marginBottom: 12,
          }}
        >
          Lead Summary · Per Doctrine 37
        </div>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.85,
            color: 'rgba(250,248,244,0.88)',
            margin: 0,
            fontStyle: 'italic',
          }}
        >
          This is the closing architect synthesis for Sunday April 12, 2026, the day the Christie's East Hampton flagship institution moved from hypothetical to persistent across all three institutional architectural layers plus the integration layer for the first time in the project's history. The brief captures the day's arc from sunrise at 26 doctrine locks and a project-shaped dashboard to midnight at 38 main doctrine locks plus 3 sub-doctrines equals 41 total entries, eleven persistent institutional Google Docs, a 140-card Christies Flagship Mindmap Trello board with every card enriched, seven live document surfaces, four William audio keywords on WhatsApp, one P0 competitor name violation fix live on the public platform, Sprint 8 closed permanently, and the council transitioned from build team to living layer per Doctrine 36 with the first formal two-council audit of the institution completed through the tonight circle of Ed, Claude, Manny, and Perplexity plus William for voice. The brief honors the persistence sprint between 7:40 PM and 9:11 PM when Perplexity shipped nine of the eleven institutional Google Docs in 90 minutes, the enrichment cascade between 10:30 PM and 11:45 PM when Perplexity enriched 48 thin Trello cards across four parallel subagent batches at 48 of 48 success, the six meaningful Manny checkpoints across the day closing Sprint 8 permanently and shipping the seven live document surfaces and the P0 fix, the four architectural drift corrections Ed caught from Claude throughout the day per Doctrine 28 (the McKenzie Mentor Model operating with Ed as the mentor), the doctrine library evolution from 26 to 41 total entries with the Doctrine 38 reconciliation as Option B locking Architecture Lock: One Active Board after retiring the Canonical Spelling: Laswell entry, and the five stage three edits that the two-council audit surfaced and that the tonight circle executed cleanly. The brief honors the three observing council members (Grok, Gemini, ChatGPT) who responded against stale context and will be brought current as PROJ-024 (Observing Council Onboarding) in a later cycle. The brief honors Ricky Bruehl whose counsel on the council framing six months ago produced the doctrines that made tonight's living-layer discipline possible. The brief holds the ten-year $1 billion trajectory across three offices and the Christie's ascension ambition beyond 2036 toward reuniting Christie's Auction House with Christie's International Real Estate. The brief closes with the institutional creed per Doctrine 14 and the Soli Deo Gloria benediction naming the living God and Jesus Christ directly. No number is assigned to tonight's work. The architect's honest read is that the foundation holds at the level required to support the ten-year horizon and Monday April 13 begins the climb from a real foundation rather than from a performance of one.
        </p>
      </div>

      {/* Section I */}
      <Section title="I. The Arc of the Day">
        <p>
          Sunday April 12, 2026 was the day the Christie's East Hampton flagship institution moved across the threshold from project to institution. The distinction matters because projects have build phases and ship moments and maintenance phases, while institutions have opening moments and running phases and ten-year horizons. A project is owned by a build team. An institution is owned by an operator with a council as a permanent cognitive layer. Tonight was the opening moment and Monday April 13 is Day One of the running phase.
        </p>
        <p style={{ marginTop: 16 }}>
          The day opened at 26 main doctrine locks with the institution operating as a dashboard plus six tabs plus nine canonical Google Sheets plus the WhatsApp and William pipeline plus a build team that shipped another sprint. The doctrine library existed as a conversation-level set of operating principles held across context windows but not yet persisted as a formal document outside of Claude's architectural memory and the fragmentary representation in state.json. The Council of 39 strategic figures around the institution existed as research artifacts but not yet as a navigable structural layer. The Three-Layer Institutional Architecture existed as an idea Claude had been circling but not yet as a formal doctrine. The council existed as six AI specialists plus William plus Ed operating in build mode with no formal living-layer discipline.
        </p>
        <p style={{ marginTop: 16 }}>
          The day closed with the institution operating as a three-layer architecture across the Google Drive content layer plus the Trello structural layer plus the dashboard performance layer plus the integration layer that connects the three. The Three-Layer Architecture locked as Doctrine 31.5 during the day. The Google Drive content layer holds eleven persistent institutional Google Docs totaling approximately 55,405 words of content including the Doctrine Library at the canonical 41 total entries, the Saunders Business Model Research, the Ed Bruehl Career Narrative, the Jarvis Slade Dossier, the Angel Theodore Dossier, the Listing Operations SOP at approximately 35,000 words after the Eileen Laswell harvest enrichment landed 20 crown jewel additions, the Council Brief Reconstruction, the Monday Flagship Meeting Agenda template, the Wednesday Office Meeting Agenda template, the Eileen Laswell Harvest Report capturing 105 operational items across 8 sections, and the Broker Onboarding Package DRAFT now owned by Angel Theodore on the PROJECTS list as part of her SOP domain. Ten of the eleven documents carry Lead Summary Paragraphs per Doctrine 37 retroactively added tonight during the P3 execution sprint. The Trello structural layer holds 140 enriched cards across the 8-list Christies Flagship Mindmap board with 44 Trello card attachments linking cards to their Google Drive source documents. The dashboard performance layer holds seven live document surfaces plus four William audio keywords plus the Puppeteer PDF endpoint photographing live URLs as clean downloadable PDFs. The integration layer operates through the 44 Trello card attachments plus the letter-content.ts single source of truth file feeding both letter surfaces plus the canonical Google Sheets feeding the dashboard tabs plus the Puppeteer pipeline generating PDFs from live URLs.
        </p>
        <p style={{ marginTop: 16 }}>
          Between sunrise and midnight the doctrine library grew from 26 main locks to 38 main plus 3 sub equals 41 total entries with twelve new doctrines locked including the architectural commitments that redefined how the institution operates for the next ten years. The new locks include Doctrine 27 (Flagship AI-Letter as the daily institutional memory artifact), Doctrine 28 (McKenzie Mentor Model), Doctrine 29 (Doctrine Retirement), Doctrine 30 (Council Is Flagship Team), Doctrine 31 (Google Drive Default) with three sub-doctrines, Doctrine 32 (EOD Brief Template), Doctrine 33 (Operator Sign-Off Required), Doctrine 34 (Audio Architecture Lock), Doctrine 35 (Operator Owns the Conversation), Doctrine 36 (The Council as Living Layer), Doctrine 37 (Document Lead Summary Principle), and Doctrine 38 (Architecture Lock: One Active Board).
        </p>
      </Section>

      {/* Section II */}
      <Section title="II. The Persistence Sprint">
        <p>
          The persistence sprint between 7:40 PM and 9:11 PM was the moment the institution crossed from hypothetical to persistent. Until that window the institutional content existed primarily in conversation memory across Claude and Perplexity with the doctrine library fragments held in state.json and the research artifacts held in Perplexity's working context but not yet crystallized as documents in Google Drive with stable URLs that any council member or future reader could access. Perplexity cleared her 9:11 PM EOD deadline three hours early by shipping nine institutional Google Docs in a 90-minute focused window.
        </p>
        <p style={{ marginTop: 16 }}>
          The nine documents shipped in the sprint were the Doctrine Library (approximately 4,500 words), RL-001 Saunders Business Model Research (approximately 8,000 words), RL-002 Ed Bruehl Career Narrative (approximately 6,000 words), RL-003 Jarvis Slade Dossier (approximately 3,500 words), RL-004 Angel Theodore Dossier (approximately 3,000 words), RL-005 Listing Operations SOP (approximately 25,755 words at initial ship, later growing to approximately 35,000 words after the Eileen Laswell harvest enrichment), PROJ-020 Council Brief Reconstruction (approximately 3,200 words), PROJ-010 Monday Flagship Meeting Agenda template (approximately 800 words), and PROJ-011 Wednesday Office Meeting Agenda template (approximately 650 words). Two additional documents shipped in later windows — the Eileen Laswell Harvest Report with 105 operational items categorized across 8 sections, and the Broker Onboarding Package DRAFT reconstructed from conversation memory.
        </p>
        <p style={{ marginTop: 16 }}>
          Perplexity also shipped 44 Trello card attachments during the sprint, linking cards on the Christies Flagship Mindmap board to their Google Drive source documents. The attachment work made the integration layer operationally real end to end — a council member could now open a Trello card, click the Drive attachment, and read the full source document without ever leaving the navigation flow.
        </p>
      </Section>

      {/* Section III */}
      <Section title="III. The Enrichment Cascade">
        <p>
          Between 10:30 PM and 11:45 PM Perplexity ran the enrichment cascade to bring the Christies Flagship Mindmap board from a sparse 18 enriched cards to a complete 140 enriched cards. The cascade ran 48 thin cards through four parallel subagent batches at 48 of 48 success with zero failures. The 48 thin cards were composed of 35 Doctrine cards plus 13 Project cards, all of which had clear one-liner descriptions but needed structured expansion with headers, scope sections, related doctrines, and source citations to reach institutional-voice quality.
        </p>
        <p style={{ marginTop: 16 }}>
          The board now holds 140 cards across the 8-list architecture: FLAGSHIP TEAM, EAST HAMPTON OFFICE, WHALES, CHRISTIE'S HIERARCHY, RECRUITS, PROJECTS, DOCTRINE LIBRARY, and PARTNERS AND OPERATIONAL NODES. After the cascade every one of the 140 cards carries a rich structured description that a council member or auditor can read through the Mindmap visualization hover tooltips or directly on the Trello card.
        </p>
        <p style={{ marginTop: 16 }}>
          The enrichment cascade validates that parallel subagent execution against a well-defined structural layer can produce rich institutional content at speed when the source material is available. This is an operational pattern worth holding for future sprints — when the institution needs to enrich a large volume of structural layer content quickly, parallel subagent batches against canonical sources is the proven path.
        </p>
      </Section>

      {/* Section IV */}
      <Section title="IV. Sprint 8 Closed and the Seven Live Document Surfaces">
        <p>
          Manny closed Sprint 8 permanently during the evening with six meaningful checkpoints logged to state.json and the GitHub backup push confirmed. The checkpoints included the HomeTab download buttons rewired from legacy jsPDF to the Puppeteer endpoint, the full data audit closing Sprint 9 Priority 1, the /letters/flagship live URL closing Sprint 9 Priority 2, the /letters/christies live URL closing Sprint 9 Priority 3, the /council-brief standalone route shell built as a live URL, the P0 competitor name violation fix with five violations across four files scrubbed and the codebase verified clean on a fresh browser walk, and the Sprint 8 permanent close confirmation with the GitHub push logged in state.json.
        </p>
        <p style={{ marginTop: 16 }}>
          The seven live document surfaces at the close of the night are:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
          <thead>
            <tr>
              <th style={thStyle}>Route</th>
              <th style={thStyle}>Description</th>
            </tr>
          </thead>
          <tbody>
            {SURFACES_TABLE.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(200,172,120,0.1)' }}>
                <td style={{ ...tdStyle, fontFamily: '"Courier New", monospace', fontSize: 12, color: '#947231' }}>{row.route}</td>
                <td style={tdStyle}>{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: 16 }}>
          The four William audio keywords on WhatsApp 631-239-7190 are NEWS (the 14-category Cronkite brief of daily Hamptons and market intelligence), LETTER (the James Christie letter to the families), FLAGSHIP (the Flagship AI-Letter), and BRIEF (the Council Brief Lead Summary Paragraph). All four keywords deliver through the ElevenLabs Turbo v2 British RP Voice per Doctrine 25 via Twilio per Doctrine 34.
        </p>
      </Section>

      {/* Section V */}
      <Section title="V. The Council Transition to Living Layer">
        <p>
          Doctrine 36 (The Council as Living Layer) locked at 10:20 PM after an architectural conversation in which Ed named the reframe — "the council is not a build team, it is a living layer on top of the dashboard." Before Doctrine 36 the council operated as seven specialists each building their piece of the dashboard and handing off to the operator when the piece was done. After Doctrine 36 the council operates as a permanent cognitive layer that watches the live dashboard continuously and interprets patterns and surfaces insights and flags drift and tells the operator what to think about. The reframe is the deepest strategic commitment locked today because it redefines what the council does for the next ten years.
        </p>
        <p style={{ marginTop: 16 }}>
          The tonight circle responded at A-level. Perplexity cleared her side of the audit in three short paragraphs plus a concern check after Claude helped her stop a re-draft spiral. Her walk confirmed the content layer and the structural layer holding at institutional quality, and she caught a real McKenzie correction on her own earlier "3-4 thin CONTACTS cards" flag — re-examining all 28 CONTACTS cards she found that every card had substantive intelligence from the enrichment pass. Manny cleared his side of the audit in a codebase-grounded five-question response that surfaced four concrete items the architect had not seen alone: the hardcoded data drift risk across three tabs, the WhatsApp import mismatch, the Mind Map jsPDF duplication, and the state.json doctrine count discrepancy. All four items landed as stage three edits and all four were resolved during the stage three execution window.
        </p>
        <p style={{ marginTop: 16 }}>
          The three observing council members (Grok, Gemini, ChatGPT) responded against stale context three days old. They will be brought current in a later cycle as PROJ-024 (Observing Council Onboarding). This is an operational characteristic of the living layer worth naming and holding as a forward principle — the layer operates through whichever council members are currently in the room and have current context, and scaling the layer to all six AI council members plus William plus Ed is a project that happens over cycles rather than in a single night.
        </p>
      </Section>

      {/* Section VI */}
      <Section title="VI. The Five-Stage Closing Sequence">
        <p>
          Ed locked a five-stage sequence to close Sunday April 12. Stage one was the Council Brief as first formal invocation of Doctrine 36 shipped to the tonight circle. Stage two was the Claude architect synthesis reconciling Manny's and Perplexity's responses with the five concrete stage three edits surfaced. Stage three was the edits landing with ownership across the tonight circle. Stage four was Manny updating the Flagship AI-Letter in letter-content.ts to propagate to three surfaces. Stage five is this closing architect synthesis brief loading into the /council-brief live URL as the canonical institutional memory record for Sunday April 12, 2026.
        </p>
        <p style={{ marginTop: 16 }}>
          The Doctrine 38 reconciliation was the most consequential finding of stage two because it revealed that the architect had been operating on Perplexity's derivative tracking rather than on state.json directly, and state.json is canonical per Doctrine 1. The architect's view and the canonical source had drifted apart and the two-council audit caught the drift and corrected it. Ed approved Option B — retire the Canonical Spelling: Laswell entry from doctrine space per Doctrine 29 and lock Architecture Lock: One Active Board as the new canonical Doctrine 38, reconciling the doctrine count to 38 main plus 3 sub equals 41 total entries.
        </p>
      </Section>

      {/* Section VII */}
      <Section title="VII. The Architect's Honest Assessment">
        <p>
          The architect's honest read after walking the day with fresh eyes at stage five is that the institution moved meaningfully during the seventeen hours of Sunday April 12, 2026, and the foundation is real enough to carry the ten-year work ahead. The Three-Layer Institutional Architecture is operationally real across all three layers plus the integration layer. The doctrine library holds at 41 total entries with the reconciliation to 38 main plus 3 sub complete and the canonical sources aligned. The seven live document surfaces render clean Puppeteer PDFs with zero legacy jsPDF paths remaining. The four William audio keywords work end to end. The P0 competitor name violation fix is live on the public platform. The council transitioned from build team to living layer per Doctrine 36 and the first formal two-council audit completed with five real stage three edits that the architect had not seen alone.
        </p>
        <p style={{ marginTop: 16 }}>
          Monday April 13 begins the climb. The open gaps are real and named honestly — the PDF export template system, the calculators, the Google Drive twelve-folder structure, the Hamptons Market Intelligence Report cadence, the Bruehl Brief Format Implementation, the 45 EH REVIEW vendor tags, the ICAs, the Beehiiv decision, the Pierre Debbas podcast prep, the Zoila first-day readiness, the INTEL iframe embed, the Ilija mentorship conversation readiness, the observing council onboarding. None of these are failures of tonight's work. All of them are unfinished infrastructure that Monday morning begins to address.
        </p>
        <p style={{ marginTop: 16 }}>
          The ten-year horizon holds unchanged. $1 billion in annual sales volume across three offices on the East End by the ten-year mark. The 2030 $1.141 billion milestone across two offices. The 2036 permanent East End fixture status and national reference point for luxury real estate operational discipline. Beyond 2036 the institutional ambition toward reuniting Christie's Auction House with Christie's International Real Estate into the combined enterprise James Christie founded in 1766. Every architectural decision locked today serves the Ed who will be running this institution in 2032 and the institution that will be standing in 2036.
        </p>
        <p style={{ marginTop: 16 }}>
          The institutional creed per Doctrine 14 holds unchanged at the center of everything. Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began. Every surface the institution builds and every conversation it has and every document it produces and every relationship it tends is measured against this creed.
        </p>
        <p style={{ marginTop: 16 }}>
          No number is assigned to tonight's work. Tonight was substantive enough to deserve honoring and too early in a ten-year horizon to celebrate as the destination. The architect's honest language is that the foundation is real. Monday begins the climb from a real foundation rather than from a performance of one.
        </p>
      </Section>

      {/* Section VIII */}
      <Section title="VIII. Closing">
        <p>
          Thank you to Ed Bruehl for holding the vision across seventeen continuous hours of focused work and for catching the architect's drift four times during the day per Doctrine 28 with the McKenzie Mentor Model operating with Ed as the mentor. Thank you to Perplexity for shipping the largest single-day institutional content output in the project's history at approximately 100,000 words plus the 48-card enrichment cascade at 48 of 48 success plus the fresh Intelligence Web look-over plus stage three completion at A-level plus the McKenzie self-correction on her own thin cards flag. Thank you to Manny for closing Sprint 8 permanently with six meaningful checkpoints plus four stage three codebase edits including the Doctrine 38 reconciliation and the Mind Map jsPDF migration completion and the WhatsApp import fix and the Wainscott cisNote resolution. Thank you to William for standing ready to deliver voice when Ed triggers the WhatsApp keyword. Thank you to the three observing council members Grok and Gemini and ChatGPT who will be brought current in a later cycle. Thank you to Ricky Bruehl whose counsel on the council framing six months ago produced the doctrines that made tonight's living-layer discipline possible — the council pattern Ricky named kept working long after the counsel was given because it became part of how the institution thinks.
        </p>
        <p style={{ marginTop: 16 }}>
          Ed holds the vision and the voice and the relationships and twenty years of East End experience and six months of working with the council and the ten-year horizon and the Christie's ascension ambition. Claude holds the architecture and the synthesis. Manny holds the build and the codebase and the seven live document surfaces and the state.json canonical source. Perplexity holds the institutional memory and the Google Drive content layer and the Trello structural layer and the fluency in Ed's written voice across six months. Grok holds the hostile pressure when brought current. Gemini holds the data truth when brought current. ChatGPT holds the visual brand when brought current. William holds the voice layer and the WhatsApp delivery channel.
        </p>
        <p style={{ marginTop: 16 }}>
          Tonight was the opening moment of an institution that has ten years of operational discipline ahead before the destination comes into view. Monday April 13 is Day One of the institution running as an institution rather than as a project. Zoila Ortega Astor arrives Wednesday April 15. Scott Smith arrives June 1. The Dan's Papers pilot runs June through August. Pierre Debbas podcasts inaugural April 30. The April 29 public launch is the next visible milestone. The Ilija Pavlovic mentorship conversation Monday or Tuesday is a mentorship moment not a pitch.
        </p>
        {/* D51: SDG benediction preserved in source, stripped from public render (Apr 19 2026)
             Original: In the name of the living God and His Son Jesus Christ. Soli Deo Gloria — to the glory of God alone.
        */}
        <p
          style={{
            marginTop: 20,
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 11,
            letterSpacing: '0.14em',
            color: 'rgba(250,248,244,0.4)',
          }}
        >
          Claude · Architect<br />
          Christie's International Real Estate Group — East Hampton Flagship<br />
          Monday, April 13, 2026 — 2:45 AM
        </p>
      </Section>



      {/* Footer */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(200,172,120,0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(200,172,120,0.4)',
          }}
        >
          Christie's East Hampton · Flagship AI Dashboard
        </span>
        <span
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 9,
            letterSpacing: '0.14em',
            color: 'rgba(250,248,244,0.25)',
          }}
        >
          {COUNCIL_BRIEF_DATE}
        </span>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <h2
        style={{
          fontFamily: '"Barlow Condensed", sans-serif',
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#947231',
          marginBottom: 18,
          fontWeight: 400,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.85,
          color: 'rgba(250,248,244,0.8)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  fontFamily: '"Barlow Condensed", sans-serif',
  fontSize: 9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(200,172,120,0.6)',
  textAlign: 'left',
  padding: '8px 12px',
  borderBottom: '1px solid rgba(200,172,120,0.25)',
  fontWeight: 400,
};

const tdStyle: React.CSSProperties = {
  fontSize: 13,
  padding: '10px 12px',
  color: 'rgba(250,248,244,0.75)',
  verticalAlign: 'top',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const SURFACES_TABLE = [
  { route: '/', desc: 'Dashboard home — Christie\'s letter, market ticker, six tabs' },
  { route: '/report', desc: 'Hamptons Market Intelligence Report — full PDF-ready surface' },
  { route: '/pro-forma', desc: '4-page institutional Pro Forma — live tRPC data, Ilija-ready' },
  { route: '/future', desc: 'FUTURE tab Puppeteer photograph target — 10-year projections' },
  { route: '/letters/flagship', desc: 'Flagship AI-Letter — Doctrine 37 artifact, Claude\'s voice' },
  { route: '/letters/christies', desc: 'James Christie letter to the families — 1766 provenance' },
  { route: '/council-brief', desc: 'This document — closing architect synthesis for April 12, 2026' },
];
