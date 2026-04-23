/**
 * FoundingLetter.tsx — Shared rendering component for the Christie's East Hampton founding letter.
 *
 * Source: client/src/content/founding-letter.ts
 * Used by: HomeTab.tsx (Section A hero) · ReportPage.tsx (Section 1 opening)
 *
 * Renders unsigned. No "Ed Bruehl," no "Managing Director" in the letter body.
 * The letter closes with the final paragraph only — no signature block.
 */

import { FOUNDING_PARAGRAPHS } from '@/content/founding-letter';

interface FoundingLetterProps {
  /** Text color for body paragraphs. Defaults to cream rgba(250,248,244,0.88). */
  color?: string;
  /** Font size for body paragraphs. Defaults to '1.0625rem'. */
  fontSize?: string;
  /** Line height. Defaults to 1.8. */
  lineHeight?: number;
  /** Margin bottom between paragraphs. Defaults to 20. */
  paragraphGap?: number;
  /** Font family. Defaults to '"Source Sans 3", sans-serif'. */
  fontFamily?: string;
}

export function FoundingLetter({
  color = 'rgba(250,248,244,0.88)',
  fontSize = '1.0625rem',
  lineHeight = 1.8,
  paragraphGap = 20,
  fontFamily = '"Source Sans 3", sans-serif',
}: FoundingLetterProps) {
  return (
    <div>
      {FOUNDING_PARAGRAPHS.map((para, i) => (
        <p
          key={i}
          style={{
            fontFamily,
            color,
            fontSize,
            lineHeight,
            marginBottom: i === FOUNDING_PARAGRAPHS.length - 1 ? 0 : paragraphGap,
          }}
        >
          {para}
        </p>
      ))}
    </div>
  );
}
