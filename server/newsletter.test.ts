/**
 * Newsletter Infrastructure Tests — Sprint 7 Item 5
 * Validates that the newsletter module compiles and helper functions
 * behave correctly without requiring live credentials.
 */

import { describe, it, expect } from 'vitest';
import { buildMarketReportNewsletter } from './newsletter';

describe('Newsletter Infrastructure', () => {
  it('buildMarketReportNewsletter produces valid HTML and text', () => {
    const issue = buildMarketReportNewsletter({
      weekOf: 'April 7, 2026',
      mortgageRate: '6.46%',
      sp500: '6,582',
      hamptonsMedian: '$2.34M',
      topNews: [
        'East Hampton Town Board approved affordable housing overlay district.',
        'Bridgehampton Commons redevelopment received preliminary approval.',
      ],
    });

    // Subject contains week
    expect(issue.subject).toContain('April 7, 2026');

    // HTML contains key brand elements
    expect(issue.htmlBody).toContain("Christie's East Hampton");
    expect(issue.htmlBody).toContain('6.46%');
    expect(issue.htmlBody).toContain('$2.34M');
    expect(issue.htmlBody).toContain('East Hampton Town Board');

    // Text body is plain and contains data
    expect(issue.textBody).toContain('6.46%');
    expect(issue.textBody).toContain('christiesrealestategroupeh.com');

    // Preview text is set
    expect(issue.previewText.length).toBeGreaterThan(10);
  });

  it('buildMarketReportNewsletter handles empty news array', () => {
    const issue = buildMarketReportNewsletter({
      weekOf: 'April 7, 2026',
      mortgageRate: '6.46%',
      sp500: '6,582',
      hamptonsMedian: '$2.34M',
      topNews: [],
    });
    expect(issue.htmlBody).toContain("Christie's East Hampton");
    expect(issue.subject).toContain('Market Report');
  });
});
