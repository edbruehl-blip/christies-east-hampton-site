/**
 * Newsletter Infrastructure — Sprint 7 Item 5
 *
 * Two delivery channels:
 *   1. Beehiiv API — subscriber management + publication
 *   2. Gmail SMTP  — branded send-as edbruehl@christiesrealestategroup.com
 *
 * Weekly cadence: Every Monday. Product: Christie's East Hampton Market Report.
 */

import nodemailer from "nodemailer";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsletterIssue {
  subject: string;
  previewText: string;
  htmlBody: string;
  textBody: string;
}

export interface BeehiivSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  utmSource?: string;
}

// ─── Beehiiv API ──────────────────────────────────────────────────────────────

const BEEHIIV_API_BASE = "https://api.beehiiv.com/v2";

function getBeehiivHeaders() {
  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!apiKey) throw new Error("BEEHIIV_API_KEY not configured");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function getBeehiivPubId() {
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!pubId) throw new Error("BEEHIIV_PUBLICATION_ID not configured");
  return pubId;
}

/**
 * Subscribe a new reader to the Christie's East Hampton newsletter via Beehiiv.
 */
export async function beehiivSubscribe(subscriber: BeehiivSubscriber): Promise<{ success: boolean; message: string }> {
  try {
    const pubId = getBeehiivPubId();
    const res = await fetch(`${BEEHIIV_API_BASE}/publications/${pubId}/subscriptions`, {
      method: "POST",
      headers: getBeehiivHeaders(),
      body: JSON.stringify({
        email: subscriber.email,
        first_name: subscriber.firstName ?? "",
        last_name: subscriber.lastName ?? "",
        utm_source: subscriber.utmSource ?? "christies-eh-dashboard",
        reactivate_existing: false,
        send_welcome_email: true,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { success: false, message: `Beehiiv error: ${err}` };
    }
    return { success: true, message: "Subscribed successfully" };
  } catch (err: unknown) {
    return { success: false, message: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Fetch subscriber count from Beehiiv for dashboard display.
 */
export async function beehiivGetStats(): Promise<{ subscriberCount: number | null; error?: string }> {
  try {
    const pubId = getBeehiivPubId();
    const res = await fetch(`${BEEHIIV_API_BASE}/publications/${pubId}`, {
      headers: getBeehiivHeaders(),
    });
    if (!res.ok) return { subscriberCount: null, error: `Beehiiv ${res.status}` };
    const data = await res.json() as { data?: { stats?: { total_active_subscriptions?: number } } };
    const count = data?.data?.stats?.total_active_subscriptions ?? null;
    return { subscriberCount: count };
  } catch (err: unknown) {
    return { subscriberCount: null, error: err instanceof Error ? err.message : String(err) };
  }
}

// ─── Gmail SMTP ───────────────────────────────────────────────────────────────

/**
 * Create a nodemailer transporter using Gmail SMTP with App Password.
 * Sends as edbruehl@christiesrealestategroup.com via Gmail "Send As".
 */
function createGmailTransporter() {
  const user = process.env.GMAIL_SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("GMAIL_SMTP_USER or GMAIL_APP_PASSWORD not configured");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/**
 * Send a single branded email via Gmail SMTP.
 * From: Christie's East Hampton <edbruehl@christiesrealestategroup.com>
 */
export async function sendNewsletterEmail(
  to: string,
  issue: NewsletterIssue
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createGmailTransporter();
    const fromAddress = process.env.NEWSLETTER_FROM_ADDRESS ?? process.env.GMAIL_SMTP_USER ?? "edbruehl@christiesrealestategroup.com";
    const info = await transporter.sendMail({
      from: `"Christie's East Hampton" <${fromAddress}>`,
      to,
      subject: issue.subject,
      text: issue.textBody,
      html: issue.htmlBody,
      headers: {
        "X-Mailer": "Christie's East Hampton Dashboard",
        "List-Unsubscribe": `<mailto:${fromAddress}?subject=unsubscribe>`,
      },
    });
    return { success: true, messageId: info.messageId };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Send a test email to confirm SMTP credentials are working.
 */
export async function sendTestEmail(to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const testIssue: NewsletterIssue = {
    subject: "Christie's East Hampton — SMTP Test",
    previewText: "SMTP configuration test from the Christie's East Hampton dashboard.",
    htmlBody: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FAF8F4;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 0.22em; color: #C8AC78; text-transform: uppercase; margin-bottom: 8px;">
            Christie's International Real Estate Group
          </div>
          <div style="font-family: Georgia, serif; font-size: 22px; color: #1B2A4A; font-weight: 600;">
            Christie's East Hampton
          </div>
          <div style="font-size: 11px; color: #7a8a8e; margin-top: 4px; letter-spacing: 0.1em;">
            ART. BEAUTY. PROVENANCE. SINCE 1766.
          </div>
        </div>
        <div style="border-top: 1px solid #C8AC78; padding-top: 24px;">
          <p style="color: #1B2A4A; font-size: 15px; line-height: 1.7;">
            This is a test email confirming that Gmail SMTP is configured correctly for the Christie's East Hampton newsletter infrastructure.
          </p>
          <p style="color: #1B2A4A; font-size: 15px; line-height: 1.7;">
            The weekly Christie's East Hampton Market Report will be delivered every Monday to subscribers via this channel.
          </p>
        </div>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #D3D1C7; text-align: center;">
          <div style="font-size: 10px; color: #7a8a8e; letter-spacing: 0.1em;">
            Christie's East Hampton · 26 Park Place, East Hampton, NY 11937
          </div>
          <div style="font-size: 10px; color: #7a8a8e; margin-top: 4px;">
            646-752-1233 · edbruehl@christiesrealestategroup.com
          </div>
        </div>
      </div>
    `,
    textBody: "Christie's East Hampton — SMTP test. Gmail SMTP is configured correctly. The weekly Market Report will be delivered every Monday.",
  };
  return sendNewsletterEmail(to, testIssue);
}

// ─── Market Report Newsletter Builder ─────────────────────────────────────────

/**
 * Build the weekly Christie's East Hampton Market Report newsletter HTML.
 * Pulls from the same data that feeds the /report page.
 */
export function buildMarketReportNewsletter(params: {
  weekOf: string;
  mortgageRate: string;
  sp500: string;
  hamptonsMedian: string;
  topNews: string[];
}): NewsletterIssue {
  const { weekOf, mortgageRate, sp500, hamptonsMedian, topNews } = params;

  const newsHtml = topNews
    .map(item => `<li style="margin-bottom: 8px; color: #1B2A4A; font-size: 14px; line-height: 1.6;">${item}</li>`)
    .join("");

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Christie's East Hampton Market Report · ${weekOf}</title>
    </head>
    <body style="margin: 0; padding: 0; background: #F5F3EE; font-family: Georgia, serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #FAF8F4;">

        <!-- Header -->
        <div style="background: #1B2A4A; padding: 32px 40px; text-align: center;">
          <div style="font-size: 10px; letter-spacing: 0.22em; color: #C8AC78; text-transform: uppercase; margin-bottom: 10px; font-family: Arial, sans-serif;">
            Christie's International Real Estate Group · East Hampton
          </div>
          <div style="font-size: 26px; color: #FAF8F4; font-weight: 600; letter-spacing: 0.02em;">
            Christie's East Hampton
          </div>
          <div style="font-size: 11px; color: #C8AC78; margin-top: 6px; letter-spacing: 0.12em; font-family: Arial, sans-serif;">
            WEEKLY MARKET REPORT · ${weekOf.toUpperCase()}
          </div>
        </div>

        <!-- Market Strip -->
        <div style="background: #1B2A4A; padding: 16px 40px; border-top: 1px solid rgba(200,172,120,0.3);">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="text-align: center; padding: 0 8px;">
                <div style="font-size: 10px; color: #7a8a8e; letter-spacing: 0.12em; font-family: Arial, sans-serif; text-transform: uppercase;">30Y Fixed</div>
                <div style="font-size: 16px; color: #C8AC78; font-weight: 600;">${mortgageRate}</div>
              </td>
              <td style="text-align: center; padding: 0 8px; border-left: 1px solid rgba(200,172,120,0.2);">
                <div style="font-size: 10px; color: #7a8a8e; letter-spacing: 0.12em; font-family: Arial, sans-serif; text-transform: uppercase;">S&amp;P 500</div>
                <div style="font-size: 16px; color: #C8AC78; font-weight: 600;">${sp500}</div>
              </td>
              <td style="text-align: center; padding: 0 8px; border-left: 1px solid rgba(200,172,120,0.2);">
                <div style="font-size: 10px; color: #7a8a8e; letter-spacing: 0.12em; font-family: Arial, sans-serif; text-transform: uppercase;">Hamptons Median</div>
                <div style="font-size: 16px; color: #C8AC78; font-weight: 600;">${hamptonsMedian}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 40px;">
          <div style="font-size: 11px; letter-spacing: 0.18em; color: #C8AC78; text-transform: uppercase; margin-bottom: 16px; font-family: Arial, sans-serif;">
            Market Intelligence
          </div>
          <ul style="padding-left: 20px; margin: 0;">
            ${newsHtml}
          </ul>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #D3D1C7;">
            <div style="font-size: 11px; letter-spacing: 0.18em; color: #C8AC78; text-transform: uppercase; margin-bottom: 12px; font-family: Arial, sans-serif;">
              Christie's East Hampton
            </div>
            <p style="color: #1B2A4A; font-size: 14px; line-height: 1.7; margin: 0;">
              The South Fork is not a market. It is a territory — eleven distinct hamlets, each with its own character, its own price corridor, its own buyer. Christie's East Hampton carries the standard that James Christie established in 1766: the family's interest comes before the sale.
            </p>
            <div style="margin-top: 20px;">
              <a href="https://www.christiesrealestategroupeh.com" style="display: inline-block; padding: 12px 24px; background: #1B2A4A; color: #C8AC78; text-decoration: none; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-family: Arial, sans-serif;">
                View Full Market Report →
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #1B2A4A; padding: 24px 40px; text-align: center;">
          <div style="font-size: 10px; color: #7a8a8e; letter-spacing: 0.1em; font-family: Arial, sans-serif;">
            Christie's East Hampton · 26 Park Place, East Hampton, NY 11937
          </div>
          <div style="font-size: 10px; color: #7a8a8e; margin-top: 4px; font-family: Arial, sans-serif;">
            646-752-1233 · edbruehl@christiesrealestategroup.com
          </div>
          <div style="font-size: 9px; color: #384249; margin-top: 12px; font-family: Arial, sans-serif;">
            You are receiving this because you subscribed to the Christie's East Hampton Market Report.
            To unsubscribe, reply with "unsubscribe" in the subject line.
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  const textBody = [
    `Christie's East Hampton Market Report · ${weekOf}`,
    "",
    `30Y Fixed Mortgage: ${mortgageRate} | S&P 500: ${sp500} | Hamptons Median: ${hamptonsMedian}`,
    "",
    "MARKET INTELLIGENCE",
    ...topNews.map((item, i) => `${i + 1}. ${item}`),
    "",
    "Christie's East Hampton · 26 Park Place, East Hampton, NY 11937",
    "646-752-1233 · edbruehl@christiesrealestategroup.com",
    "www.christiesrealestategroupeh.com",
  ].join("\n");

  return {
    subject: `Christie's East Hampton Market Report · ${weekOf}`,
    previewText: `30Y Fixed: ${mortgageRate} · Hamptons Median: ${hamptonsMedian} · Weekly intelligence from Christie's East Hampton`,
    htmlBody,
    textBody,
  };
}
