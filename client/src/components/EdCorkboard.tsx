/**
 * Ed's Corkboard v3 — Canonical Six-Quadrant Operational Layout
 * Per Ed's ruling February 2026. Rebuilt April 22 2026.
 * Six quadrants: THE PULSE · THE PIPELINE · THE NETWORK ·
 *                THE CALENDAR · THE FOCUS · THE NORTH STAR
 * Text fixes applied: "Angel Day One · April 25" · "Ilija Pavlovic" · "Key Relationships"
 *
 * D69 One-Environment Strict (Apr 23 2026):
 * Cream/ivory substrate replaced with navy dark glass.
 * Card interiors: navy surface, ivory/gold text on dark — same hierarchy as Command Board tiles.
 * NORTH STAR card: deep red stays, but on darker navy context (not cream).
 * All content verbatim — only substrate changed.
 */
import React from 'react';

const C = {
  gold: '#c8ac78',
  goldDark: '#a88f5f',
  // D69: charcoal replaced by navy dark surface
  charcoal: '#384249',
  // D69: cream/paper replaced by ivory text on dark
  cream: '#FAF8F4',
  paper: '#FAF8F4',
  deepRed: '#8b2635',
  // D69: stone (warm beige) replaced by muted gold-tinted ivory
  stone: 'rgba(250,248,244,0.55)',
  line: 'rgba(200,172,120,0.25)',
  navy: '#1B2A4A',
  // New dark surface tokens
  darkSurface: 'rgba(27,42,74,0.55)',
  darkBorder: 'rgba(200,172,120,0.18)',
  darkBg: '#0D1B2A',
};

const s = {
  panel: {
    background: C.darkSurface,
    border: `1px solid ${C.darkBorder}`,
    padding: '12px 14px',
    height: '100%',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  panelH3: {
    fontSize: 10,
    letterSpacing: '0.28em',
    color: C.gold,
    borderBottom: `1px solid rgba(200,172,120,0.3)`,
    paddingBottom: 5,
    marginBottom: 9,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    fontFamily: 'Georgia, serif',
    margin: '0 0 9px 0',
  } as React.CSSProperties,
  item: {
    padding: '3px 0',
    fontSize: 9.5,
    color: 'rgba(250,248,244,0.85)',
    fontFamily: 'Georgia, serif',
    lineHeight: 1.45,
    display: 'flex',
    gap: 6,
    alignItems: 'flex-start',
  } as React.CSSProperties,
  bullet: {
    color: C.gold,
    fontSize: 7,
    marginTop: 3,
    flexShrink: 0,
  } as React.CSSProperties,
  subLabel: {
    fontSize: 8,
    letterSpacing: '0.22em',
    color: C.goldDark,
    margin: '8px 0 4px 0',
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    borderTop: `1px dotted rgba(200,172,120,0.3)`,
    paddingTop: 5,
    fontFamily: 'Georgia, serif',
  } as React.CSSProperties,
};

function Bullet({ text, sub }: { text: string; sub?: string }) {
  return (
    <div style={s.item}>
      <span style={s.bullet}>◆</span>
      <span>
        <span style={{ color: 'rgba(250,248,244,0.9)' }}>{text}</span>
        {sub && <span style={{ color: C.goldDark, fontSize: 8.5, display: 'block' }}>{sub}</span>}
      </span>
    </div>
  );
}

export function EdCorkboard() {
  return (
    <div style={{
      background: C.darkBg,
      color: C.cream,
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: 11,
      lineHeight: 1.4,
      padding: '0.35in',
      maxWidth: '14in',
      margin: '0 auto',
    }}>

      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${C.gold}`, paddingBottom: 8, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(250,248,244,0.7)', lineHeight: 1.6 }}>
          <strong style={{ color: C.gold }}>CHRISTIE'S</strong><br />
          INTERNATIONAL REAL ESTATE GROUP<br />
          EAST HAMPTON · 26 PARK PLACE
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, fontWeight: 400, letterSpacing: '0.25em', color: C.gold, fontFamily: 'Georgia, serif', margin: 0 }}>CHRISTIE&rsquo;S FLAGSHIP CORKBOARD</h1>
          <div style={{ fontSize: 10, color: C.goldDark, letterSpacing: '0.3em', marginTop: 4, fontStyle: 'italic' }}>
            Nouns, not numbers · One page · Internal only
          </div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(250,248,244,0.7)', textAlign: 'right', lineHeight: 1.6 }}>
          Updated April 2026<br />
          Six-quadrant operational layout<br />
          T-7 days to public launch
        </div>
      </header>

      {/* PRINCIPLES BAND */}
      <section style={{
        background: 'rgba(200,172,120,0.07)',
        padding: '7px 14px',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: 10.5,
        letterSpacing: '0.1em',
        borderTop: `1px solid rgba(200,172,120,0.25)`,
        borderBottom: `1px solid rgba(200,172,120,0.25)`,
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <span><strong style={{ color: C.gold, fontStyle: 'italic' }}>JESUS FIRST</strong></span>
        <span style={{ color: 'rgba(250,248,244,0.8)' }}><strong style={{ color: C.gold, fontStyle: 'italic' }}>The Christie's Standard</strong> · Since 1766</span>
        <span style={{ color: 'rgba(250,248,244,0.8)' }}><strong style={{ color: C.gold, fontStyle: 'italic' }}>The Richard Rule</strong> · Operate from what is real</span>
        <span style={{ color: 'rgba(250,248,244,0.8)' }}><strong style={{ color: C.gold, fontStyle: 'italic' }}>The Hagler Standard</strong> · Train in the dark</span>
      </section>

      {/* SIX QUADRANTS — 3×2 grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 0 }}>

        {/* Q1 — START HERE (public visitor orientation) */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}`, background: 'rgba(139,38,53,0.18)' }}>
          <h3 style={{ ...s.panelH3, color: C.cream }}>⓪ START HERE</h3>
          <div style={{ fontSize: 9, color: 'rgba(250,248,244,0.7)', lineHeight: 1.55, marginBottom: 6, fontStyle: 'italic' }}>— How to read this board —</div>
          <Bullet text="The Mind Map lives in Trello" sub="Layer 1 — the cause-and-effect shape" />
          <Bullet text="The 13 Sheets live in Drive" sub="Layer 3 — the operational surface" />
          <Bullet text="The Corkboard lives here" sub="The one-page daily snapshot" />
          <Bullet text="The Live Site" sub="christiesrealestategroupeh.com — the public face" />
          <div style={{ fontSize: 9, color: C.gold, fontWeight: 700, margin: '6px 0 4px', letterSpacing: '0.08em' }}>THE LIVE URL IS THE SOURCE OF TRUTH.</div>
          <Bullet text="Ed thirty-five · Ilija sixty-five" sub="Two parties at the pool" />
          <Bullet text="The platform is the pitch" sub="No decks" />
          <div style={{ fontSize: 8.5, color: 'rgba(250,248,244,0.6)', marginTop: 6, lineHeight: 1.5, fontStyle: 'italic' }}>Read clockwise: Pulse (daily) → Pipeline (weekly) → Network (monthly) → Calendar (dates) → Focus (current)</div>
          <div style={{ fontSize: 8.5, color: 'rgba(250,248,244,0.82)', marginTop: 8, lineHeight: 1.65, fontStyle: 'italic', borderTop: '1px solid rgba(148,114,49,0.22)', paddingTop: 7 }}>“We underwrite homes the way a banker underwrites a portfolio — replacement cost, comparable performance, exit scenarios. We serve families who prefer to be understood before they are advised. We hold before we sell. We carry the Christie’s Standard forward — over 250 years of it — in every conversation.”</div>
        </div>

        {/* Q2 — THE STANDARD */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}` }}>
          <h3 style={s.panelH3}>① The Christie’s Standard</h3>
          <Bullet text="Numbers Box" sub="Closings · pipeline value · active count" />
          <Bullet text="Top 3 for Ed" sub="Highest-leverage actions today" />
          <Bullet text="Top 3 for Angel" sub="Angel Day One · April 25" />
          <Bullet text="Waiting On" sub="Counterparties · attorneys · banks" />
          <Bullet text="Touch Minimums" sub="3 seller touches · 2 buyer touches · 1 recruit" />
        </div>

        {/* Q3 — THE PIPELINE */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.gold}` }}>
          <h3 style={s.panelH3}>② The Pipeline <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Weekly</span></h3>
          <Bullet text="Active Listings" sub="Price · DOM · next action" />
          <Bullet text="Buy Side" sub="Active buyers · search criteria · urgency" />
          <Bullet text="Auction House Intros" sub="Christie’s referrals in motion" />
          <Bullet text="ANEW Projects" sub="AnewHomes pipeline · Scott + Richard" />
        </div>

        {/* Q4 — THE NETWORK */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.navy}` }}>
          <h3 style={s.panelH3}>③ The Network <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Monthly</span></h3>
          <Bullet text="Key Relationships" sub="Lily · Ilija Pavlovic · Rick Moeser · Melissa True" />
          <Bullet text="NYC Contacts" sub="Finance · law · art world" />
          <Bullet text="Attorneys" sub="Deal counsel · estate counsel · referral partners" />
          <Bullet text="Recruit Targets" sub="Next agent · timeline · approach" />
        </div>

        {/* Q5 — THE CALENDAR */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.gold}` }}>
          <h3 style={s.panelH3}>④ The Calendar <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Monthly</span></h3>
          <Bullet text="Headline Events" sub="Christie’s auction dates · Hamptons circuit" />
          <Bullet text="Private Collector Series" sub="Monthly UHNW touchpoint events" />
          <Bullet text="Wednesday Circuit" sub="Recurring · brokers + culture + rhythm" />
          <div style={s.subLabel}>Team Dates</div>
          {[
            ['Angel Day One', 'April 25'],
            ['Public Launch', 'April 29'],
            ['Zoila starts', 'May 4'],
            ['Scott starts', 'June 1'],
          ].map(([who, when]) => (
            <div key={who} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6, padding: '2px 0', fontSize: 9, borderBottom: `1px dotted rgba(200,172,120,0.2)`, fontFamily: 'Georgia, serif' }}>
              <span style={{ color: 'rgba(250,248,244,0.85)' }}>{who}</span>
              <span style={{ color: C.gold, fontWeight: 700 }}>{when}</span>
            </div>
          ))}
        </div>

        {/* Q6 — THE FOCUS */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}` }}>
          <h3 style={s.panelH3}>⑤ The Focus <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Current</span></h3>
          <Bullet text="Active Hamlet" sub="East Hampton Village · Bridgehampton corridor" />
          <Bullet text="Deal Priority #1" sub="25 Horseshoe Road · in contract" />
          <Bullet text="Deal Priority #2" sub="2 Old Hollow Road · closed April 2" />
          <Bullet text="Intelligence Signal" sub="Inventory tightening · buyer urgency rising" />
          <Bullet text="Institutional Lens" sub="UHNW buyer pipeline · CPS-1 node active" />
        </div>

      </section>

      {/* NORTH STAR DOCTRINE — narrow red bar below grid, above numbers band */}
      <div style={{
        background: C.deepRed,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 10,
        border: `1px solid rgba(139,38,53,0.6)`,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 9, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap' }}>⑥ North Star</span>
        <span style={{ fontSize: 10, color: 'rgba(250,248,244,0.9)', fontStyle: 'italic', flex: 1, minWidth: 200 }}>“Seventy-five million to three billion. Three offices. One trajectory.”</span>
        <span style={{ fontSize: 9, color: 'rgba(250,248,244,0.7)' }}>Ed thirty-five · Ilija sixty-five · Two parties at the pool · The platform is the pitch · No decks.</span>
      </div>

      {/* NUMBERS BAND */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
        {[
          { value: '$4.57M', label: 'Closed · First 100 Days' },
          { value: '$13.62M', label: 'Exclusive Active' },
          { value: '$75M', label: '2026 Baseline' },
          { value: '$3B', label: '2036 Horizon' },
        ].map(({ value, label }) => (
          <div key={label} style={{ background: 'rgba(27,42,74,0.7)', color: C.cream, padding: '10px 12px', textAlign: 'center', borderLeft: `4px solid ${C.gold}`, border: `1px solid rgba(200,172,120,0.2)`, borderLeftWidth: 4 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, letterSpacing: '0.03em', fontFamily: 'Georgia, serif' }}>{value}</div>
            <div style={{ fontSize: 8.5, letterSpacing: '0.22em', marginTop: 3, textTransform: 'uppercase', color: 'rgba(250,248,244,0.6)' }}>{label}</div>
          </div>
        ))}
      </section>

      {/* FOOTER: Ten Commandments condensed + Contact */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
        <div style={s.panel}>
          <h3 style={s.panelH3}>The Ten Commandments</h3>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'The live URL is the source of truth.',
              'Tell the truth. Know the territory. Sit on the same side as the family.',
              'Every number has a named source. No invented figures.',
              'Ed thirty-five. Ilija sixty-five. Two parties at the pool.',
              'Seventy-five million to three billion. Three offices. One trajectory.',
              'The platform is the pitch. No decks.',
              'Nothing to Manny without a Claude wireframe.',
              'The operator is the gate. Ed signs off or it does not ship.',
              'No competitor names on any public surface.',
              'AnewHomes locked at seven. Ed, Scott, Richard, Jarvis, Angel, Zoila, Pool.',
            ].map((cmd, i) => (
              <li key={i} style={{
                padding: '3px 2px',
                fontSize: 9.5,
                borderBottom: i < 9 ? `1px dotted rgba(200,172,120,0.2)` : 'none',
                display: 'grid',
                gridTemplateColumns: '26px 1fr',
                gap: 5,
                alignItems: 'baseline',
                fontFamily: 'Georgia, serif',
              }}>
                <span style={{ color: C.goldDark, fontWeight: 700, fontSize: 9, textAlign: 'right' }}>
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i]}.
                </span>
                <span style={{ color: 'rgba(250,248,244,0.85)' }}>{cmd}</span>
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={s.panel}>
            <h3 style={{ ...s.panelH3, fontSize: 10 }}>The Council (Cortex)</h3>
            {[
              ['Claude', 'Architect. Wireframes. Scribe.'],
              ['Perplexity', 'Intelligence. Data. Editor.'],
              ['Manny', 'Builder. Server-side truth.'],
              ['ChatGPT', 'Pressure-test. Strategy.'],
              ['Grok', 'Challenge. Stress-test.'],
            ].map(([name, role]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 6, padding: '2px 0', fontSize: 9, fontFamily: 'Georgia, serif' }}>
                <span style={{ color: C.gold, fontWeight: 700 }}>{name}</span>
                <span style={{ color: 'rgba(250,248,244,0.75)' }}>{role}</span>
              </div>
            ))}
          </div>
          <div style={s.panel}>
            <h3 style={{ ...s.panelH3, fontSize: 10 }}>Contact</h3>
            <div style={{ fontSize: 9.5, lineHeight: 1.6, color: 'rgba(250,248,244,0.85)', fontFamily: 'Georgia, serif' }}>
              <strong style={{ color: C.gold }}>Ed Bruehl</strong> · Managing Director<br />
              26 Park Place, East Hampton, NY 11937<br />
              <strong style={{ color: C.gold }}>646-752-1233</strong><br />
              edbruehl@christiesrealestategroup.com
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
