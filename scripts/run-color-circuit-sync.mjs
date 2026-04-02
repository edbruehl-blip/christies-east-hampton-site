/**
 * run-color-circuit-sync.mjs
 * Replicates three Apps Script functions:
 *   3. colorCodeSaleTypes()       — applies background colors to Event Calendar rows
 *   4. createWednesdayCircuit()   — creates May 7, 2026 recurring weekly event
 *   5. syncSheetsToCalendar()     — pushes Event Calendar + Podcast Calendar rows to Google Calendar
 *
 * Run: node scripts/run-color-circuit-sync.mjs
 */

import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

const CALENDAR_ID = 'b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com';
const EVENT_SHEET_ID   = '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s';
const PODCAST_SHEET_ID = '1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8';

const EVENT_TAB   = 'Event Calendar';
const PODCAST_TAB_FALLBACK = null; // will detect first sheet

// Wednesday Circuit
const CIRCUIT_START = new Date('2026-05-07T09:30:00-04:00'); // EDT
const CIRCUIT_END   = new Date('2026-05-07T13:00:00-04:00');

// Google Calendar color IDs
// https://developers.google.com/calendar/api/v3/reference/events#colorId
const COLOR_LIVE_AUCTION   = '5'; // banana/yellow
const COLOR_ONLINE_AUCTION = '8'; // graphite

async function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/calendar',
    ],
  });
}

function tabRange(tab, range) {
  return `'${tab}'!${range}`;
}

function parseDate(raw) {
  if (!raw) return null;
  // Handle MM/DD/YYYY
  if (typeof raw === 'string' && raw.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    const [m, d, y] = raw.split('/');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

// ─── Step 3: Color-code Sale Types in the Event Calendar sheet ────────────────

async function colorCodeSaleTypes(sheets) {
  console.log('\n─── Step 3: colorCodeSaleTypes ───');

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: EVENT_SHEET_ID,
    range: tabRange(EVENT_TAB, 'A:G'),
  });
  const rows = res.data.values ?? [];
  console.log(`  Total rows (including header): ${rows.length}`);

  // Build batch update requests for background colors
  const requests = [];
  for (let i = 1; i < rows.length; i++) {
    const saleType = rows[i][4] ? String(rows[i][4]).trim() : '';
    if (!saleType) continue;

    let bgColor;
    if (saleType === 'Live Auction') {
      bgColor = { red: 1.0, green: 0.953, blue: 0.804 }; // #FFF3CD warm gold tint
    } else if (saleType === 'Online Auction') {
      bgColor = { red: 0.961, green: 0.961, blue: 0.961 }; // #F5F5F5 light grey
    } else {
      continue;
    }

    requests.push({
      repeatCell: {
        range: {
          sheetId: 1923398197, // Event Calendar sheet ID
          startRowIndex: i,
          endRowIndex: i + 1,
          startColumnIndex: 0,
          endColumnIndex: 7,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: bgColor,
          },
        },
        fields: 'userEnteredFormat.backgroundColor',
      },
    });
  }

  if (requests.length > 0) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: EVENT_SHEET_ID,
      requestBody: { requests },
    });
    console.log(`✓ Applied color to ${requests.length} rows`);
  } else {
    console.log('✓ No rows with Sale Type found to color');
  }
}

// ─── Step 4: Create Wednesday Circuit recurring event ─────────────────────────

async function createWednesdayCircuit(calendar) {
  console.log('\n─── Step 4: createWednesdayCircuit ───');

  // Check if already exists
  const checkRes = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: '2026-05-01T00:00:00Z',
    timeMax: '2026-05-31T23:59:59Z',
    q: 'Wednesday Circuit',
    singleEvents: false,
  });

  const existing = checkRes.data.items ?? [];
  if (existing.some(e => e.summary && e.summary.includes('Wednesday Circuit'))) {
    console.log('✓ Wednesday Circuit already exists — skipping creation');
    existing.forEach(e => console.log(`  Found: "${e.summary}" (${e.recurrence?.[0] ?? 'no recurrence'})`));
    return;
  }

  const event = {
    summary: "Wednesday Circuit · Christie's East Hampton",
    location: '26 Park Place, East Hampton, NY 11937',
    description:
      '9:30 AM  — Office Meeting\n' +
      '10:00 AM — Podcast (guest locked by Monday)\n' +
      '11:00 AM — Caravan (one listing per agent)\n' +
      '12:00 PM — Lunch + 48-hour clip distribution to six platforms\n' +
      '\nAll day: camera on.\n' +
      "\nChristie's East Hampton · 26 Park Place, East Hampton, NY 11937",
    start: {
      dateTime: CIRCUIT_START.toISOString(),
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: CIRCUIT_END.toISOString(),
      timeZone: 'America/New_York',
    },
    recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=WE'],
  };

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
  });

  console.log(`✓ Wednesday Circuit created — ID: ${res.data.id}`);
  console.log(`  Starts: ${res.data.start.dateTime}`);
  console.log(`  Recurrence: ${res.data.recurrence?.[0]}`);
}

// ─── Step 5: Sync sheets to calendar ─────────────────────────────────────────

async function syncSheetToCalendar(calendar, sheets, sheetId, sheetLabel, tabName) {
  console.log(`\n  Syncing "${sheetLabel}"...`);

  // Detect actual tab name if not provided
  let tab = tabName;
  if (!tab) {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    tab = meta.data.sheets[0].properties.title;
    console.log(`  Auto-detected tab: "${tab}"`);
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${tab}'!A:G`,
  });
  const rows = res.data.values ?? [];
  console.log(`  Rows: ${rows.length - 1} (excluding header)`);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isEventCalendar = (sheetId === EVENT_SHEET_ID);

  let created = 0;
  let skipped = 0;
  let past = 0;
  const syncUpdates = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rawDate   = row[0];
    const eventName = row[1] ? String(row[1]).trim() : '';
    const description = row[2] ? String(row[2]).trim() : '';
    const synced    = row[3] ? String(row[3]).trim() : '';
    const saleType  = isEventCalendar && row[4] ? String(row[4]).trim() : '';

    if (!rawDate || !eventName) continue;
    if (synced === 'SYNCED' || synced === 'PAST') { skipped++; continue; }

    const eventDate = parseDate(rawDate);
    if (!eventDate) { console.log(`  Row ${i+1}: invalid date "${rawDate}"`); continue; }

    const eventDay = new Date(eventDate); eventDay.setHours(0, 0, 0, 0);
    if (eventDay < today) {
      syncUpdates.push({ row: i + 1, value: 'PAST' });
      past++;
      continue;
    }

    const eventTitle = `[${sheetLabel}] ${eventName}`;

    // Check for duplicate
    const dayStart = new Date(eventDate); dayStart.setHours(0, 0, 0, 0);
    const dayEnd   = new Date(eventDate); dayEnd.setHours(23, 59, 59, 999);
    const existingRes = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      q: eventTitle,
      singleEvents: true,
    });
    const duplicate = (existingRes.data.items ?? []).some(e => e.summary === eventTitle);

    if (!duplicate) {
      const newEvent = {
        summary: eventTitle,
        description: description || `Auto-synced from ${sheetLabel}`,
        start: { date: eventDate.toISOString().split('T')[0] },
        end:   { date: eventDate.toISOString().split('T')[0] },
      };

      if (isEventCalendar && saleType) {
        if (saleType === 'Live Auction')   newEvent.colorId = COLOR_LIVE_AUCTION;
        if (saleType === 'Online Auction') newEvent.colorId = COLOR_ONLINE_AUCTION;
      }

      await calendar.events.insert({ calendarId: CALENDAR_ID, requestBody: newEvent });
      console.log(`  + Created: ${eventName}${saleType ? ` [${saleType}]` : ''}`);
      created++;
    } else {
      console.log(`  ~ Duplicate: ${eventName}`);
    }

    syncUpdates.push({ row: i + 1, value: 'SYNCED' });
  }

  // Write SYNCED/PAST status back to sheet in batch
  if (syncUpdates.length > 0) {
    const data = syncUpdates.map(u => ({
      range: `'${tab}'!D${u.row}`,
      values: [[u.value]],
    }));
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: { valueInputOption: 'RAW', data },
    });
  }

  console.log(`  Done: ${created} created, ${skipped} already synced, ${past} past`);
}

async function syncSheetsToCalendar(calendar, sheets) {
  console.log('\n─── Step 5: syncSheetsToCalendar ───');
  await syncSheetToCalendar(calendar, sheets, EVENT_SHEET_ID,   'Event Calendar',   EVENT_TAB);
  await syncSheetToCalendar(calendar, sheets, PODCAST_SHEET_ID, 'Podcast Calendar', null);
  console.log('✓ Nightly sync complete');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const auth = await getAuth();
  const sheets   = google.sheets({ version: 'v4', auth });
  const calendar = google.calendar({ version: 'v3', auth });

  await colorCodeSaleTypes(sheets);
  await createWednesdayCircuit(calendar);
  await syncSheetsToCalendar(calendar, sheets);

  console.log('\n✓ Steps 3, 4 & 5 complete.');
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
