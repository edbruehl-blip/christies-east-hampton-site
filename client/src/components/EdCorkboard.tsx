/**
 * Ed's Corkboard v3 — Canonical Six-Quadrant Operational Layout
 * Per Ed's ruling February 2026. Rebuilt April 22 2026.
 * Six quadrants: THE PULSE · THE PIPELINE · THE NETWORK ·
 *                THE CALENDAR · THE FOCUS · THE COMPASS
 * Text fixes applied: "Angel Day One · April 25" · "Ilija Pavlovic" · "Key Relationships"
 */
import React from 'react';

const C = {
  gold: '#c8ac78',
  goldDark: '#a88f5f',
  charcoal: '#384249',
  cream: '#f8f4ed',
  paper: '#fffdf7',
  deepRed: '#8b2635',
  stone: '#e8dcc0',
  line: '#b9a87f',
  navy: '#1B2A4A',
};

const s = {
  panel: {
    background: C.paper,
    border: `1px solid ${C.line}`,
    padding: '12px 14px',
    height: '100%',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,
  panelH3: {
    fontSize: 10,
    letterSpacing: '0.28em',
    color: C.deepRed,
    borderBottom: `1px solid ${C.gold}`,
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
    color: C.charcoal,
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
    borderTop: `1px dotted ${C.gold}`,
    paddingTop: 5,
    fontFamily: 'Georgia, serif',
  } as React.CSSProperties,
};

function Bullet({ text, sub }: { text: string; sub?: string }) {
  return (
    <div style={s.item}>
      <span style={s.bullet}>◆</span>
      <span>
        <span style={{ color: C.charcoal }}>{text}</span>
        {sub && <span style={{ color: C.goldDark, fontSize: 8.5, display: 'block' }}>{sub}</span>}
      </span>
    </div>
  );
}

export function EdCorkboard() {
  return (
    <div style={{
      background: C.cream,
      color: C.charcoal,
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: 11,
      lineHeight: 1.4,
      padding: '0.35in',
      maxWidth: '14in',
      margin: '0 auto',
    }}>

      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${C.gold}`, paddingBottom: 8, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: C.charcoal, lineHeight: 1.6 }}>
          <strong style={{ color: C.deepRed }}>CHRISTIE'S</strong><br />
          INTERNATIONAL REAL ESTATE GROUP<br />
          EAST HAMPTON · 26 PARK PLACE
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 400, letterSpacing: '0.35em', color: C.deepRed, fontFamily: 'Georgia, serif', margin: 0 }}>ED'S CORKBOARD</h1>
          <div style={{ fontSize: 10, color: C.goldDark, letterSpacing: '0.3em', marginTop: 4, fontStyle: 'italic' }}>
            Nouns, not numbers · One page · Internal only
          </div>
        </div>
        <div style={{ fontSize: 9, letterSpacing: '0.15em', color: C.charcoal, textAlign: 'right', lineHeight: 1.6 }}>
          <strong style={{ color: C.deepRed }}>v3</strong> · April 22, 2026<br />
          Six-quadrant operational layout<br />
          T-7 days to public launch
        </div>
      </header>

      {/* PRINCIPLES BAND */}
      <section style={{
        background: C.stone,
        padding: '7px 14px',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: 10.5,
        letterSpacing: '0.1em',
        borderTop: `1px solid ${C.gold}`,
        borderBottom: `1px solid ${C.gold}`,
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>JESUS FIRST</strong></span>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>The Christie's Standard</strong> · Since 1766</span>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>The Richard Rule</strong> · Operate from what is real</span>
        <span><strong style={{ color: C.deepRed, fontStyle: 'italic' }}>The Hagler Standard</strong> · Train in the dark</span>
      </section>

      {/* SIX QUADRANTS — 3×2 grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>

        {/* Q1 — THE PULSE */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}` }}>
          <h3 style={s.panelH3}>① The Pulse <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Daily</span></h3>
          <Bullet text="Numbers Box" sub="Closings · pipeline value · active count" />
          <Bullet text="Top 3 for Ed" sub="Highest-leverage actions today" />
          <Bullet text="Top 3 for Angel" sub="Angel Day One · April 25" />
          <Bullet text="Waiting On" sub="Counterparties · attorneys · banks" />
          <Bullet text="Touch Minimums" sub="3 seller touches · 2 buyer touches · 1 recruit" />
        </div>

        {/* Q2 — THE PIPELINE */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.gold}` }}>
          <h3 style={s.panelH3}>② The Pipeline <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Weekly</span></h3>
          <Bullet text="Active Listings" sub="Price · DOM · next action" />
          <Bullet text="Buy Side" sub="Active buyers · search criteria · urgency" />
          <Bullet text="Auction House Intros" sub="Christie's referrals in motion" />
          <Bullet text="ANEW Projects" sub="AnewHomes pipeline · Scott + Richard" />
        </div>

        {/* Q3 — THE NETWORK */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.navy}` }}>
          <h3 style={s.panelH3}>③ The Network <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Monthly</span></h3>
          <Bullet text="Key Relationships" sub="Lily · Ilija Pavlovic · Rick Moeser · Melissa True" />
          <Bullet text="NYC Contacts" sub="Finance · law · art world" />
          <Bullet text="Attorneys" sub="Deal counsel · estate counsel · referral partners" />
          <Bullet text="Recruit Targets" sub="Next agent · timeline · approach" />
        </div>

        {/* Q4 — THE CALENDAR */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.gold}` }}>
          <h3 style={s.panelH3}>④ The Calendar <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Monthly</span></h3>
          <Bullet text="Headline Events" sub="Christie's auction dates · Hamptons circuit" />
          <Bullet text="Private Collector Series" sub="Monthly UHNW touchpoint events" />
          <Bullet text="Wednesday Caravan" sub="Recurring · brokers + culture + rhythm" />
          <div style={s.subLabel}>Team Dates</div>
          {[
            ['Angel Day One', 'April 25'],
            ['Public Launch', 'April 29'],
            ['Zoila starts', 'May 4'],
            ['Scott starts', 'June 1'],
          ].map(([who, when]) => (
            <div key={who} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 6, padding: '2px 0', fontSize: 9, borderBottom: `1px dotted ${C.stone}`, fontFamily: 'Georgia, serif' }}>
              <span style={{ color: C.charcoal }}>{who}</span>
              <span style={{ color: C.deepRed, fontWeight: 700 }}>{when}</span>
            </div>
          ))}
        </div>

        {/* Q5 — THE FOCUS */}
        <div style={{ ...s.panel, borderLeft: `4px solid ${C.deepRed}` }}>
          <h3 style={s.panelH3}>⑤ The Focus <span style={{ color: C.goldDark, fontSize: 8, fontStyle: 'italic', letterSpacing: '0.1em' }}>Current</span></h3>
          <Bullet text="Active Hamlet" sub="East Hampton Village · Bridgehampton corridor" />
          <Bullet text="Deal Priority #1" sub="25 Horseshoe Road · in contract" />
          <Bullet text="Deal Priority #2" sub="2 Old Hollow Road · closed April 2" />
          <Bullet text="Intelligence Signal" sub="Inventory tightening · buyer urgency rising" />
          <Bullet text="Institutional Lens" sub="UHNW buyer pipeline · CPS-1 node active" />
        </div>

        {/* Q6 — THE COMPASS */}
        <div style={{
          background: C.deepRed,
          color: C.cream,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}>
          <div>
            <h3 style={{ ...s.panelH3, color: C.gold, borderBottomColor: 'rgba(200,172,120,0.4)', marginBottom: 10 }}>
              ⑥ The Compass
            </h3>
            <div style={{ fontSize: 11, color: C.stone, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 10 }}>
              "Seventy-five million to three billion. Three offices. One trajectory."
            </div>
            <div style={{ fontSize: 9.5, color: C.stone, lineHeight: 1.55 }}>
              <strong style={{ color: C.gold }}>Doctrine:</strong> The live URL is the source of truth. Ed thirty-five. Ilija sixty-five. Two parties at the pool. The platform is the pitch. No decks.
            </div>
          </div>
          <div style={{
            borderTop: `1px solid rgba(200,172,120,0.4)`,
            paddingTop: 10,
            marginTop: 10,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9, letterSpacing: '0.22em', color: C.gold, textTransform: 'uppercase', marginBottom: 4 }}>Daily Mentor Anchor</div>
            <div style={{ fontSize: 13, letterSpacing: '0.3em', color: C.cream, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              Soli Deo Gloria.
            </div>
          </div>
        </div>

      </section>

      {/* NUMBERS BAND */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
        {[
          { value: '$4.57M', label: 'Closed · First 100 Days' },
          { value: '$13.62M', label: 'Exclusive Active' },
          { value: '$75M', label: '2026 Baseline' },
          { value: '$3B', label: '2036 Horizon' },
        ].map(({ value, label }) => (
          <div key={label} style={{ background: C.charcoal, color: C.cream, padding: '10px 12px', textAlign: 'center', borderLeft: `4px solid ${C.gold}` }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.gold, letterSpacing: '0.03em', fontFamily: 'Georgia, serif' }}>{value}</div>
            <div style={{ fontSize: 8.5, letterSpacing: '0.22em', marginTop: 3, textTransform: 'uppercase', color: C.stone }}>{label}</div>
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
                borderBottom: i < 9 ? `1px dotted ${C.stone}` : 'none',
                display: 'grid',
                gridTemplateColumns: '26px 1fr',
                gap: 5,
                alignItems: 'baseline',
                fontFamily: 'Georgia, serif',
              }}>
                <span style={{ color: C.goldDark, fontWeight: 700, fontSize: 9, textAlign: 'right' }}>
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i]}.
                </span>
                <span style={{ color: C.charcoal }}>{cmd}</span>
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
                <span style={{ color: C.deepRed, fontWeight: 700 }}>{name}</span>
                <span style={{ color: C.charcoal }}>{role}</span>
              </div>
            ))}
          </div>
          <div style={s.panel}>
            <h3 style={{ ...s.panelH3, fontSize: 10 }}>Contact</h3>
            <div style={{ fontSize: 9.5, lineHeight: 1.6, color: C.charcoal, fontFamily: 'Georgia, serif' }}>
              <strong style={{ color: C.deepRed }}>Ed Bruehl</strong> · Managing Director<br />
              26 Park Place, East Hampton, NY 11937<br />
              <strong style={{ color: C.deepRed }}>646-752-1233</strong><br />
              edbruehl@christiesrealestategroup.com
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
