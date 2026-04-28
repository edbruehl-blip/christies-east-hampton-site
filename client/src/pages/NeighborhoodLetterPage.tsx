/**
 * NEIGHBORHOOD LETTER · v15 FINAL · /letters/welcome
 *
 * Standalone cream letter page — Cormorant Garamond · 8.5×11 print-ready
 * Council-locked April 21 2026 (Addendum 5 dispatch)
 *
 * Em-dashes in P2, P9, P10 are intentional — do not strip.
 * "Standard" capitalization is intentional voice architecture:
 *   P5 lowercase → P7/P9 capital. Reader builds the concept across the letter.
 *
 * Soli Deo Gloria: NOT on this letter (public document).
 * Close: "Faithfully forward"
 */

import { useEffect } from 'react';
import { SiteFooter } from '@/components/SiteFooter';

// D65 Strict (Apr 23 2026): useIsPdfMode deleted. Single cream render path.
const PARAGRAPHS = [
  "Many of you have known me for years. Some remember when I left Morgan Stanley after 9/11 and moved to the East End to raise a family. We came for the land, the water, and the pace. We stayed because this place became home.",
  "For twenty years, I've been helping families buy and sell \u2014 but mostly steward \u2014 property here. The lesson, over and over, is simple. The families who love this place most are the ones who protect it first. Real estate on the East End is not inventory. For our families, it is legacy. The asset your grandchildren will thank you for.",
  "My favorite piece of advice, after all these years: never sell Hamptons real estate. Hold it. Improve it. Structure it. Pass it down. Let it compound across generations. If the timing is truly right to sell, we prepare it properly, market it professionally, and price it to win or continue holding.",
  "I underwrite property the way I once analyzed portfolios on Wall Street. Replacement cost, comparable performance, exit scenarios. Most agents price on emotion. We help families understand value first, and sell only when it is the best long-term strategy.",
  "That instinct led me to Christie\u2019s. James Christie, in 1766, held his first sale in London on one idea \u2014 and it became the standard that has carried his name forward ever since. Help people understand the true value of what they own before deciding what to do with it. He did not build an auction house. He built a way of handling objects, and families, and homes that has carried over 250 years.",
  "I am grateful to be chosen as Managing Director of Christie\u2019s International Real Estate Group, East Hampton Flagship, at 26 Park Place. From here, three worlds converge. Christie\u2019s London heritage. Our Rockefeller Center NYC auction house. And the Hamptons, one of the most significant luxury markets on earth. Across nearly 50 countries and territories, the rule is simple. Service first. Your interests first. Always.",
  "What the Standard brings begins where most real estate conversations end. Art appraisals. Art-secured lending. Estate continuity across generations. Specialists in fine art, jewelry, watches, wine, and automobiles join your team. When you sell, your property reaches collectors. When you buy, our global network brings new product home. But mostly, the work is stewardship.",
  "Christie\u2019s auction house events are more accessible than most people realize. NYC auctions, private sales, and collector evenings come right to your inbox when you join our list. And right here in East Hampton, we host our own. Each week we record Your Hamptons Real Estate Podcast — right here at 26 Park Place. Swing by, or suggest a mentor whose voice belongs on the show. Each month we gather to spotlight local artists and mentors whose work deserves a larger stage.",
  "I am honored to carry the Christie\u2019s Standard forward here, with energy and care \u2014 intelligent, compassionate, patient counsel for the families of the East End who prefer to be understood before they\u2019re advised.",
  "We look forward to seeing you soon. Swing by 26 Park Place \u2014 next to John Papas \u2014 for coffee or a Yerba Madre. Bring a friend, a mentor, or someone you\u2019d like us to meet, or put on the podcast.",
  "The flagship is awakening.",
];

export default function NeighborhoodLetterPage() {
  useEffect(() => {
    document.title = "Christie's East Hampton \u2014 Neighborhood Letter";
  }, []);

  return (
    <div style={{
      background: '#2a2a2a',
      minHeight: '100vh',
      padding: '30px 20px',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      {/* Letter page — cream substrate, always */}
      <div style={{
        background: '#faf7f1',
        border: '2px solid #000',
        padding: '60px 80px 50px',
        color: '#1a1a1a',
        maxWidth: 700,
        margin: '0 auto',
        lineHeight: 1.55,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>

        {/* Wordmark */}
        <div style={{
          textAlign: 'center',
          marginBottom: 38,
          paddingBottom: 20,
          borderBottom: '1px solid #947231',
        }}>
          <div style={{
            fontSize: 12,
            letterSpacing: '5px',
            color: '#1a3a5c',
            fontWeight: 500,
            textTransform: 'uppercase',
            fontFamily: 'Georgia, serif',
          }}>
            Christie&rsquo;s International Real Estate Group
          </div>
          <div style={{
            fontSize: 9.5,
            letterSpacing: '3px',
            color: '#5a5041',
            fontStyle: 'italic',
            marginTop: 5,
            fontFamily: 'Georgia, serif',
          }}>
            East Hampton Flagship &middot; Est. 1766
          </div>
        </div>

        {/* Greeting */}
        <div style={{
          fontSize: 19,
          fontWeight: 500,
          marginBottom: 18,
          letterSpacing: '0.5px',
        }}>
          Greetings,
        </div>

        {/* Letter body */}
        <div>
          {PARAGRAPHS.map((para, i) => (
            <p key={i} style={{
              fontSize: 14.5,
              margin: '0 0 14px 0',
              textAlign: 'left',
              lineHeight: 1.55,
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: 24, fontSize: 14.5, fontStyle: 'italic' }}>
          Faithfully forward,
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            marginTop: 14,
            letterSpacing: '0.3px',
            fontStyle: 'normal',
          }}>
            Ed Bruehl
          </div>
          <div style={{
            fontSize: 12,
            color: '#3a3a3a',
            lineHeight: 1.45,
            marginTop: 4,
            fontStyle: 'normal',
          }}>
            Managing Director, Christie&rsquo;s International Real Estate Group<br />
            East Hampton Flagship &middot; 26 Park Place, East Hampton<br />
            646-752-1233
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 40,
          paddingTop: 16,
          borderTop: '1px solid #947231',
          textAlign: 'center',
          fontSize: 9,
          letterSpacing: '2.5px',
          color: '#5a5041',
          textTransform: 'uppercase',
          fontFamily: 'Georgia, serif',
        }}>
          Christie&rsquo;s International Real Estate
          <div style={{
            fontSize: 11,
            letterSpacing: '6px',
            color: '#947231',
            marginTop: 7,
            fontWeight: 500,
          }}>
            Since 1766
          </div>
        </div>
      </div>


      <SiteFooter />
    </div>
  );
}
