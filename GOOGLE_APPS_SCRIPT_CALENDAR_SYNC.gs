/**
 * Christie's East Hampton — Google Apps Script
 * Nightly Calendar Sync + Wednesday Circuit Setup
 *
 * PURPOSE:
 *   1. Reads Event Calendar sheet and Podcast Calendar sheet.
 *      Any row with a date + event name creates a Google Calendar event.
 *   2. Creates the Wednesday Circuit as a weekly recurring event.
 *   3. Subscribes to Christie's public auction house iCal feed.
 *
 * SETUP:
 *   1. Open script.google.com → New Project → paste this file.
 *   2. Run createWednesdayCircuit() once manually to seed the recurring event.
 *   3. Run subscribeToChristiesAuctions() once manually to add the iCal feed.
 *   4. Set a time-driven trigger: syncSheetsToCalendar → midnight daily.
 *      (Triggers → Add Trigger → syncSheetsToCalendar → Time-driven → Day timer → Midnight to 1am)
 *
 * CALENDAR ID (Christie's East Hampton Master Calendar):
 *   b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com
 *
 * SHEET IDs:
 *   Event Calendar:   1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s
 *   Podcast Calendar: 1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8
 *
 * Christie's Public Auction iCal:
 *   https://www.christies.com/calendar/ical
 */

// ─── Configuration ────────────────────────────────────────────────────────────

const CALENDAR_ID = 'b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com';
const EVENT_SHEET_ID = '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s';
const PODCAST_SHEET_ID = '1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8';
const CHRISTIES_ICAL_URL = 'https://www.christies.com/calendar/ical';

// ─── Main: Nightly Sync ───────────────────────────────────────────────────────

/**
 * Main entry point — called nightly by time-driven trigger.
 * Reads both sheets and creates calendar events for any row
 * that has a date + event name and has not been synced yet.
 */
function syncSheetsToCalendar() {
  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!cal) {
    Logger.log('ERROR: Calendar not found. Check CALENDAR_ID.');
    return;
  }

  syncSheet(cal, EVENT_SHEET_ID, 'Event Calendar');
  syncSheet(cal, PODCAST_SHEET_ID, 'Podcast Calendar');
  Logger.log('Nightly sync complete: ' + new Date().toISOString());
}

/**
 * Reads a sheet and creates calendar events for unsynced rows.
 * Expected columns: A=Date, B=Event Name, C=Description (optional), D=Synced (auto-written)
 */
function syncSheet(cal, sheetId, sheetLabel) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheets()[0]; // First sheet
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) { // Skip header row
    const row = data[i];
    const rawDate = row[0];
    const eventName = row[1] ? String(row[1]).trim() : '';
    const description = row[2] ? String(row[2]).trim() : '';
    const synced = row[3] ? String(row[3]).trim() : '';

    // Skip if no date or no event name
    if (!rawDate || !eventName) continue;
    // Skip if already synced
    if (synced === 'SYNCED') continue;

    let eventDate;
    try {
      eventDate = new Date(rawDate);
      if (isNaN(eventDate.getTime())) continue;
    } catch (e) {
      Logger.log('Row ' + (i + 1) + ': invalid date — ' + rawDate);
      continue;
    }

    // Check for duplicate before creating
    const dayStart = new Date(eventDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(eventDate);
    dayEnd.setHours(23, 59, 59, 999);
    const existing = cal.getEvents(dayStart, dayEnd);
    const duplicate = existing.some(e => e.getTitle() === eventName);

    if (!duplicate) {
      cal.createAllDayEvent(
        '[' + sheetLabel + '] ' + eventName,
        eventDate,
        { description: description || ('Auto-synced from ' + sheetLabel) }
      );
      Logger.log('Created: ' + eventName + ' on ' + eventDate.toDateString());
    }

    // Mark row as synced in column D
    sheet.getRange(i + 1, 4).setValue('SYNCED');
  }
}

// ─── Wednesday Circuit (One-time setup) ──────────────────────────────────────

/**
 * Creates the Wednesday Circuit as a weekly recurring event.
 * Run this ONCE manually. It creates the event starting next Wednesday.
 *
 * Schedule:
 *   9:30  Office Meeting
 *   10:00 Podcast (guest locked by Monday)
 *   11:00 Caravan (one listing per agent)
 *   12:00 Lunch + 48-hour clip distribution to six platforms
 *   All day: camera on
 */
function createWednesdayCircuit() {
  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!cal) {
    Logger.log('ERROR: Calendar not found. Check CALENDAR_ID.');
    return;
  }

  // Find next Wednesday
  const today = new Date();
  const daysUntilWed = (3 - today.getDay() + 7) % 7 || 7; // 0=Sun, 3=Wed
  const nextWed = new Date(today);
  nextWed.setDate(today.getDate() + daysUntilWed);

  // Create the recurring weekly event block (9:30 AM – 1:00 PM)
  const startTime = new Date(nextWed);
  startTime.setHours(9, 30, 0, 0);
  const endTime = new Date(nextWed);
  endTime.setHours(13, 0, 0, 0);

  const recurrence = CalendarApp.newRecurrence()
    .addWeeklyRule()
    .onlyOnWeekday(CalendarApp.Weekday.WEDNESDAY);

  cal.createEventSeries(
    'Wednesday Circuit · Christie\'s East Hampton',
    startTime,
    endTime,
    recurrence,
    {
      description:
        '9:30 AM  — Office Meeting\n' +
        '10:00 AM — Podcast (guest locked by Monday)\n' +
        '11:00 AM — Caravan (one listing per agent)\n' +
        '12:00 PM — Lunch + 48-hour clip distribution to six platforms\n' +
        '\nAll day: camera on.\n' +
        '\nChristie\'s East Hampton · 26 Park Place, East Hampton, NY 11937',
      location: '26 Park Place, East Hampton, NY 11937',
    }
  );

  Logger.log('Wednesday Circuit created — starts ' + nextWed.toDateString());
}

// ─── Christie's Auction iCal Subscription (One-time setup) ───────────────────

/**
 * Subscribes the Christie's East Hampton calendar to the Christie's
 * public auction house iCal feed. Run ONCE manually.
 *
 * Note: Google Calendar does not expose a native "subscribe to iCal" API
 * via Apps Script. The recommended approach is to manually add the URL
 * in Google Calendar UI: Settings → Add calendar → From URL → paste CHRISTIES_ICAL_URL.
 *
 * This function logs the URL and instructions for the manual step.
 */
function subscribeToChristiesAuctions() {
  Logger.log('=== Christie\'s Auction iCal Subscription ===');
  Logger.log('');
  Logger.log('Google Apps Script cannot programmatically subscribe to external iCal feeds.');
  Logger.log('Complete this step manually in Google Calendar:');
  Logger.log('');
  Logger.log('1. Open Google Calendar → Settings (gear icon) → Settings');
  Logger.log('2. Left sidebar → "Add calendar" → "From URL"');
  Logger.log('3. Paste this URL:');
  Logger.log('   ' + CHRISTIES_ICAL_URL);
  Logger.log('4. Click "Add calendar"');
  Logger.log('');
  Logger.log('The Christie\'s auction schedule will then appear in your calendar automatically.');
  Logger.log('Google refreshes external iCal feeds approximately every 12–24 hours.');
}

// ─── Utility: List all events today (for testing) ─────────────────────────────

function listTodayEvents() {
  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const events = cal.getEvents(today, tomorrow);
  Logger.log('Events today (' + events.length + '):');
  events.forEach(e => Logger.log('  · ' + e.getTitle() + ' @ ' + e.getStartTime()));
}
