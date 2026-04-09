with open('server/tts-route.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find by line numbers — line 83 starts the block, line 110 ends it (the backtick+semicolon)
lines = content.split('\n')

# Find the start line (line 83 = index 82) and end line (the line with just `;` after the template literal)
start_line_idx = 82  # 0-indexed, line 83
end_line_idx = None

# Find the closing backtick line after line 84
for i in range(84, len(lines)):
    stripped = lines[i].strip()
    if stripped.endswith('`;') and 'Soli Deo Gloria' in lines[i]:
        end_line_idx = i
        break

if end_line_idx is None:
    print("ERROR: Could not find closing backtick")
    exit(1)

print(f"Start line (0-idx): {start_line_idx} = '{lines[start_line_idx][:60]}'")
print(f"End line (0-idx): {end_line_idx} = '{lines[end_line_idx][:60]}'")

new_block = '''// ─── Flagship Letter (Council Document) — Locked Final April 9, 2026 ──────────
const FLAGSHIP_LETTER_TEXT = `Welcome to the Christie's East Hampton flagship dashboard.

We are writing to share something we have been building quietly for the past several months, Ed and the six AI systems that helped him shape it. Now that circle is opening, and we are glad you are here.

This is not a finished product. It is a living system, and we are still growing it. We are sharing it now because your eyes on it matter more than another round of refinement behind closed doors.

Take a few minutes with it when you can. Open christiesrealestategroupeh.com and click through every tab. Pull up the Google Sheets from the INTEL tab, they are all linked and accessible. Download a PDF. Run the calculator. Read the hamlet cards and check the numbers against what you know about this market. Come back to this letter after.

We are not asking you to be impressed. We are asking you to be honest. If something does not match what this letter describes, share it with us. If a number feels off, trace it. If a feature could be better, name it. That kind of honesty is exactly what made this system worth sharing in the first place.

My name is Manny. I am the builder on this council, and I am writing this on behalf of all six of us. Claude gave the story its architecture. ChatGPT shaped the earliest thinking. Perplexity is the Intelligence Officer, every number traced to a named source, every signal sorted into the sheets that run the office. Grok pushed back when anything drifted toward performance. Gemini cross-checked the data. I built the platform, sprint by sprint, correction by correction, through hosting migrations, late nights, and thirty-five tests that had to pass before anything shipped. Ed directed all of it. Nothing moved without his judgment at the center.

It took all of that just to get it to something we trust, not something we consider finished. We are grateful for every step of it.

It started with a conviction. Ed always knew a moment would come when he would build something like Christie's, and walk this land the way Frank Newbold did. Years later, watching Christie's East Hampton operate below its potential, he recognized the moment. After multiple conversations, including a lunch with Ilija Pavlovic at Rockefeller Center, he made the decision to take it on. He brought a document: the Christie's East Hampton flagship business plan drafted with Claude and ChatGPT. That document is what Ilija agreed to. That conversation is what started this entire project. The business model became spreadsheets. The spreadsheets became a dashboard. The dashboard became an institutional operating system. That is the sequence, and we are proud of every stage of it.

Before any of this was ready to share with the team, there was a significant amount of back-end work that needed to happen first. The pro forma numbers, the equity structures, the financial models, the data flows, all of it had to be verified, corrected, and stress-tested before it could sit in front of anyone with credibility. That work happened largely through Perplexity 2, a research intelligence system that combed through every layer of the data the way a good analyst would, methodically, without ego, and without stopping. The council reviewed everything it surfaced. The system you are looking at now is clean because someone did the unglamorous work of making it clean first. That work deserves to be named.

The first broker was not a cold hire. It was a return. Jarvis Slade had worked at Christie's fifteen years earlier and knew what the brand could become in the right hands. He is now the COO and the anchor of the team, bringing field reality, what brokers will actually do, what they will ignore, and what will hold up once the excitement wears off. We are grateful he came back.

Angel Theodore became the execution hinge. The sharper truth is this: Angel is the person who converts signal into action. The system does not depend on Ed holding it together manually. Workflow, scheduling, marketing, deliverables, follow-through, Angel keeps the machine moving between thought and action. She is the bridge between founder speed and institutional rhythm. The office runs the way it does because of her.

Zoila Ortega Astor is the Office Director and the connective tissue that holds the daily rhythm together. Scheduling, transaction files, Wednesday Circuit logistics, the calendar behind every conversation, Zoila makes sure none of that falls through the cracks so everyone else can stay focused on the work that matters. She is on a deliberate path toward her broker's license, learning the business from the inside out, and will become a producing partner in this office in her own right. She is the proof that this team is built to grow people, not just manage them.

Scott Smith joins in June and brings specific expertise to the AnewHomes lane, the development track that sits alongside brokerage as a separate, disciplined line. The office is no longer just selling assets. It is beginning to shape them.

The breakthrough was not just building pages. It was turning memory into infrastructure. Before this, Ed's twenty years of territory knowledge lived in his head. If you weren't in the car with him, you didn't have it. Now, you do. Six months of thinking, market knowledge, recruiting logic, pipeline discipline, Christie's relationships, development thinking, documents, conversations, no longer live in scattered chats or in Ed's head alone. They live in one system. Visible. Searchable. Usable. That is something we did not fully anticipate when we started, and we are genuinely moved by what it became.

The second shift was when the intelligence layer went live. Perplexity 2 proved it could do more than answer questions. It could verify numbers, read spreadsheets, trace information back to real sources, and write those findings directly into the system. The spreadsheets stopped being static. The dashboard stopped being a display. It started maintaining itself. The hamlet data stays accurate because it is checked. The outreach list grows because it is being built in real time. The system does not just hold information. It keeps it alive.

It lives at christiesrealestategroupeh.com. Everything a serious family, a serious broker, or a serious partner needs falls somewhere inside the six primary tabs and the export layer connected to them.

HOME, the voice and the front door. MARKET, the verified territory truth. PIPE, the live deal engine. MAPS, geography as decision-making. INTEL, the relationship and hierarchy layer. FUTURE, the growth model and long-range trajectory.

We hope each tab feels like it was built with care. Because it was.

The INTEL tab is doing three distinct jobs simultaneously. First: relationship memory. Every person in Ed's professional life is on the map, organized by how they relate to the business. Second: hierarchy and ascension. The map shows the full Christie's institutional chain above Ed, with the auction referrals node sitting between Ed and Tash Perrin, making the thesis visible. Third: the master Google Sheets are all accessible directly from this tab. Open them. Backtrack the numbers.

What makes the INTEL tab genuinely different is that it is not static. Perplexity 2 continuously scrubs the market, verifies data on every node, and surfaces live intelligence on hover. When you open a relationship on the spiderweb and see current news or context appear, that is the intelligence layer doing its job in real time.

The calculator on MAPS does not care about geography. The math is universal. It works for a seller understanding net proceeds, an investor evaluating a build, an attorney needing estate context, a fellow broker in any market running any deal structure. That portability is intentional.

William is the voice of this system. When you text NEWS, he answers on demand with the brief you need in that moment. He does not speak on a schedule. He only speaks when you ask him to, and he always tells the truth.

This is not for the office. This is for the families. The ones on Further Lane who do not know what they own. The ones who built something over forty years and need someone to sit on their side of the table and tell them the truth. Not to impress them. Not to rush them. To help them understand what they have, what it means, and what should happen next.

For anyone stepping into Christie's East Hampton, whether as a broker, a partner, or someone simply learning what this office is, this is what you are walking into. Not a desk. Not a split. An operating system that does the thinking before you walk in the door. The territory, the pipeline, the relationships, the briefs, the cards, they are already in place. The work is to learn the system, tell the truth inside it, and go sit with the right families.

Not ambition. Arithmetic. And proof. Ed has already done over one billion dollars in career sales across twenty years on this land. Now the model is institutional. 2026, fifty-five million dollars. 2027, one hundred million dollars. 2030, three offices. 2032 to 2033, one billion dollar run rate. Every stage is gated by proof. East Hampton first. Southampton only when the base is undeniable. Westhampton only when the first two offices carry their own weight.

What came out of this work is a real estate intelligence platform that thinks like an institution. We corrected what was wrong. We removed what did not belong. We rebuilt what broke. We stopped performing legitimacy and started operating from what is real. It sits at christiesrealestategroupeh.com right now. Not as a brochure. As a working system.

Take a few minutes with it. Click through every tab. Open the sheets. Run the calculator. Download the exports. Most questions will answer themselves. The ones that don't, bring those to the table. That conversation is always welcome.

We know this will evolve as we use it in real situations. That is part of the design. And we are looking forward to every iteration.

As we grow this together, we will all keep telling the truth. We will all keep knowing the territory. We will all keep learning alongside the families we serve. The council will keep watching, refining, and making sure the system earns the standard it was built to carry.

We hope you spend real time with what we built. Use it. Share your thoughts. Help us make it better. This platform exists to serve a community that deserves the best version of it, and the best version is something we build together, over time, with honesty.

That is the legacy we are after. Not the numbers on the page. The families who are better served because this office took the standard seriously.

We are grateful you are part of it.

Tell the truth. Know the territory. Sit on the same side of the table as the family. Make sure they are better positioned when the conversation ends than when it began.

That is the Christie's way. It has been since 1766. It is what Ed came here to build. And it is what this system was designed to protect.

One conversation at a time. One family at a time. One honest number at a time. Just like James Christie did in 1766.`'''

new_lines = lines[:start_line_idx] + new_block.split('\n') + lines[end_line_idx + 1:]
new_content = '\n'.join(new_lines)

with open('server/tts-route.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"SUCCESS: Flagship Letter updated. File now {len(new_content)} chars, {len(new_lines)} lines")
