/**
 * test-calendar-access.mjs
 * Tests whether the service account has access to the Christie's East Hampton calendar.
 * Run: node scripts/test-calendar-access.mjs
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const CALENDAR_ID = 'b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com';

async function main() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const credentials = JSON.parse(raw);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  try {
    const res = await calendar.calendars.get({ calendarId: CALENDAR_ID });
    console.log('✓ Calendar access confirmed:', res.data.summary);
    console.log('  Time zone:', res.data.timeZone);
  } catch (err) {
    console.error('✗ Calendar access FAILED:', err.message);
    console.error('  Status:', err.status);
    console.error('');
    console.error('  The service account needs to be added as an editor on the calendar.');
    console.error('  Service account email: christies-eh-sheets@christies-hamptons.iam.gserviceaccount.com');
    console.error('  Go to Google Calendar → Settings → Share with specific people → add the service account email with "Make changes to events" permission.');
  }
}

main().catch(console.error);
