/**
 * Christie's East Hampton — Google Apps Script
 * Nightly Calendar Sync + Wednesday Circuit + Christie's Auction Scraper
 *
 * VERSION: Sprint 6 — April 2, 2026 (Rev 2: Sale Type column added)
 *
 * PURPOSE:
 *   1. Reads Event Calendar sheet and Podcast Calendar sheet.
 *      Any row with a date + event name (on or after today) creates a Google Calendar event.
 *      NO BACKFILL — past events are skipped.
 *   2. Creates the Wednesday Circuit as a weekly recurring event starting May 7, 2026.
 *   3. Weekly scraper: fetches christies.com/en/calendar, extracts all New York sale dates,
 *      and writes them into the Event Calendar sheet as the auction feed.
 *
 * SETUP:
 *   1. Open script.google.com → New Project → paste this file.
 *   2. Run createWednesdayCircuit() ONCE manually to seed the recurring event (starts May 7, 2026).
 *   3. Run scrapeChristiesAuctions() ONCE manually to seed the current NY auction schedule.
 *   4. Set time-driven triggers:
 *      a. syncSheetsToCalendar  → Time-driven → Day timer → Midnight to 1am (nightly)
 *      b. scrapeChristiesAuctions → Time-driven → Week timer → Every Monday at 6am (weekly)
 *
 * CALENDAR ID (Christie's East Hampton Master Calendar):
 *   b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com
 *
 * SHEET IDs:
 *   Event Calendar:   1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s
 *   Podcast Calendar: 1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8
 *
 * EVENT CALENDAR COLUMN MAP (Sheet1):
 *   A = Start Date (MM/DD/YYYY)
 *   B = Event Name / Sale Title
 *   C = Description (subtitle + URL)
 *   D = Sync Status (auto: SYNCED / PAST)
 *   E = Sale Type (Live Auction | Online Auction | Internal | Podcast | Social | blank)
 *   F = End Date (MM/DD/YYYY)
 *   G = Source (CHRISTIES_SCRAPE | manual)
 *
 * SALE TYPE COLOR CODING:
 *   Live Auction   → Gold   (#947231 background, dark text)
 *   Online Auction → Grey   (#9E9E9E background, white text)
 *   (other types use default calendar color)
 */

// ─── Configuration ────────────────────────────────────────────────────────────

const CALENDAR_ID = 'b591e65ffdfeee02ac8b410880b54bfdd20f29bec8b910fcefa51dd3c8cc97ab@group.calendar.google.com';
const EVENT_SHEET_ID = '1cBDdmA63ZStEQZLt74WtKU3ewmVaXHWfOgVQhPbOg2s';
const PODCAST_SHEET_ID = '1mYrrOOcJuKYEdWsDQpY4NNF4I3vO5QW6DhaRXBaRBL8';
const CHRISTIES_CALENDAR_URL = 'https://www.christies.com/en/calendar';

// Wednesday Circuit — official start date
const CIRCUIT_START_DATE = new Date('2026-05-07T09:30:00'); // May 7, 2026

// Google Calendar color IDs for sale types
// See: https://developers.google.com/apps-script/reference/calendar/event-color
const COLOR_LIVE_AUCTION   = CalendarApp.EventColor.YELLOW;   // closest to gold
const COLOR_ONLINE_AUCTION = CalendarApp.EventColor.GRAPHITE; // grey

// ─── Main: Nightly Sync ───────────────────────────────────────────────────────

/**
 * Main entry point — called nightly by time-driven trigger.
 * Reads both sheets and creates calendar events for any row
 * that has a date + event name, has not been synced yet,
 * and is on or after today (NO BACKFILL of past events).
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
 *
 * Event Calendar columns: A=Date, B=Event Name, C=Description, D=Synced, E=Sale Type, F=End Date, G=Source
 * Podcast Calendar columns: A=Date, B=Event Name, C=Description, D=Synced
 *
 * NO BACKFILL: events with dates before today are skipped (marked PAST in column D).
 * Sale Type (column E) drives calendar event color:
 *   "Live Auction"   → YELLOW (gold)
 *   "Online Auction" → GRAPHITE (grey)
 */
function syncSheet(cal, sheetId, sheetLabel) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();

  // Today at midnight — used for the no-backfill filter
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isEventCalendar = (sheetId === EVENT_SHEET_ID);

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rawDate = row[0];
    const eventName = row[1] ? String(row[1]).trim() : '';
    const description = row[2] ? String(row[2]).trim() : '';
    const synced = row[3] ? String(row[3]).trim() : '';
    // Column E: Sale Type (only present on Event Calendar)
    const saleType = isEventCalendar && row[4] ? String(row[4]).trim() : '';

    // Skip if no date or no event name
    if (!rawDate || !eventName) continue;
    // Skip if already synced or already marked as past
    if (synced === 'SYNCED' || synced === 'PAST') continue;

    let eventDate;
    try {
      eventDate = new Date(rawDate);
      if (isNaN(eventDate.getTime())) continue;
    } catch (e) {
      Logger.log('Row ' + (i + 1) + ': invalid date — ' + rawDate);
      continue;
    }

    // NO BACKFILL: skip events before today
    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);
    if (eventDay < today) {
      sheet.getRange(i + 1, 4).setValue('PAST');
      Logger.log('Skipped (past): ' + eventName + ' on ' + eventDate.toDateString());
      continue;
    }

    // Check for duplicate before creating
    const dayStart = new Date(eventDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(eventDate);
    dayEnd.setHours(23, 59, 59, 999);
    const existing = cal.getEvents(dayStart, dayEnd);
    const eventTitle = '[' + sheetLabel + '] ' + eventName;
    const duplicate = existing.some(function(e) { return e.getTitle() === eventTitle; });

    if (!duplicate) {
      const newEvent = cal.createAllDayEvent(
        eventTitle,
        eventDate,
        { description: description || ('Auto-synced from ' + sheetLabel) }
      );

      // Apply color based on Sale Type (Event Calendar only)
      if (isEventCalendar && saleType) {
        try {
          if (saleType === 'Live Auction') {
            newEvent.setColor(COLOR_LIVE_AUCTION);
          } else if (saleType === 'Online Auction') {
            newEvent.setColor(COLOR_ONLINE_AUCTION);
          }
        } catch (colorErr) {
          Logger.log('Color set failed for "' + eventName + '": ' + colorErr.message);
        }
      }

      Logger.log('Created: ' + eventName + ' on ' + eventDate.toDateString() + (saleType ? ' [' + saleType + ']' : ''));
    }

    // Mark row as synced in column D
    sheet.getRange(i + 1, 4).setValue('SYNCED');
  }
}

// ─── Wednesday Circuit (One-time setup) ──────────────────────────────────────

/**
 * Creates the Wednesday Circuit as a weekly recurring event.
 * Run this ONCE manually.
 *
 * START DATE: May 7, 2026 — first Wednesday in May, official Circuit launch.
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

  // Fixed start: May 7, 2026 (first Wednesday in May)
  const startTime = new Date(CIRCUIT_START_DATE);
  const endTime = new Date(CIRCUIT_START_DATE);
  endTime.setHours(13, 0, 0, 0); // 1:00 PM

  const recurrence = CalendarApp.newRecurrence()
    .addWeeklyRule()
    .onlyOnWeekday(CalendarApp.Weekday.WEDNESDAY);

  cal.createEventSeries(
    "Wednesday Circuit · Christie's East Hampton",
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
        "\nChristie's East Hampton · 26 Park Place, East Hampton, NY 11937",
      location: '26 Park Place, East Hampton, NY 11937',
    }
  );

  Logger.log("Wednesday Circuit created — starts May 7, 2026 (9:30 AM – 1:00 PM, weekly)");
}

// ─── Christie's Auction Scraper (Weekly) ─────────────────────────────────────

/**
 * Fetches christies.com/en/calendar, extracts all New York sale dates,
 * and writes them into the Event Calendar sheet.
 *
 * The page embeds all upcoming events as a JSON object in the HTML
 * (window.chrComponents.calendar = { data: {...} }).
 * No JavaScript rendering required — UrlFetchApp gets the full data.
 *
 * Run manually once to seed, then set a weekly Monday trigger.
 *
 * Sale Type detection:
 *   - If sale.type_txt contains "online" → "Online Auction"
 *   - Otherwise → "Live Auction"
 *
 * Sheet columns written (Event Calendar):
 *   A = Start Date (MM/DD/YYYY)
 *   B = Sale Title
 *   C = Description (subtitle + URL)
 *   D = (left blank — sync status, written by syncSheet)
 *   E = Sale Type (Live Auction | Online Auction)
 *   F = End Date (MM/DD/YYYY)
 *   G = Source (CHRISTIES_SCRAPE)
 */
function scrapeChristiesAuctions() {
  const ss = SpreadsheetApp.openById(EVENT_SHEET_ID);
  const sheet = ss.getSheets()[0];

  // Fetch the calendar page
  let html;
  try {
    const response = UrlFetchApp.fetch(CHRISTIES_CALENDAR_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CalendarBot/1.0)' },
      muteHttpExceptions: true,
    });
    if (response.getResponseCode() !== 200) {
      Logger.log('ERROR: christies.com returned ' + response.getResponseCode());
      return;
    }
    html = response.getContentText();
  } catch (e) {
    Logger.log('ERROR fetching christies.com/en/calendar: ' + e.message);
    return;
  }

  // Extract the data JSON object using brace-counting
  // Structure: window.chrComponents.calendar = { data: { ... }, ... }
  const dataStart = html.indexOf('data:');
  if (dataStart === -1) {
    Logger.log('ERROR: Could not find data: block in christies.com HTML');
    return;
  }

  // Find the opening brace of the data object
  const braceStart = html.indexOf('{', dataStart);
  if (braceStart === -1) {
    Logger.log('ERROR: No opening brace found after data:');
    return;
  }

  // Count braces to find the matching closing brace
  let depth = 0;
  let braceEnd = braceStart;
  for (let i = braceStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) {
        braceEnd = i + 1;
        break;
      }
    }
  }

  let calData;
  try {
    calData = JSON.parse(html.substring(braceStart, braceEnd));
  } catch (e) {
    Logger.log('ERROR parsing calendar JSON: ' + e.message);
    return;
  }

  const events = calData.events || [];
  Logger.log('Total events on christies.com/en/calendar: ' + events.length);

  // Filter for New York events only
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nyEvents = events.filter(function(e) {
    return e.location_txt && e.location_txt.toLowerCase().indexOf('new york') !== -1;
  });

  Logger.log('New York events found: ' + nyEvents.length);

  // Get existing entries to avoid duplicates
  // Read column B (sale titles) and column G (source) to check
  const existingData = sheet.getDataRange().getValues();
  const existingTitles = new Set();
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][6] === 'CHRISTIES_SCRAPE') {
      existingTitles.add(String(existingData[i][1]).trim());
    }
  }

  let added = 0;
  let skipped = 0;

  nyEvents.forEach(function(sale) {
    const title = sale.title_txt ? sale.title_txt.trim() : '';
    if (!title) return;

    // Skip if already in the sheet from a previous scrape
    if (existingTitles.has(title)) {
      skipped++;
      return;
    }

    // Parse start date
    let startDate;
    try {
      startDate = new Date(sale.start_date);
      if (isNaN(startDate.getTime())) return;
    } catch (e) {
      return;
    }

    // NO BACKFILL: skip sales that have already ended
    let endDate;
    try {
      endDate = sale.end_date ? new Date(sale.end_date) : startDate;
    } catch (e) {
      endDate = startDate;
    }
    if (endDate < today) {
      skipped++;
      return;
    }

    const subtitle = sale.subtitle_txt || '';
    const url = sale.landing_url || '';
    const description = [subtitle, url].filter(Boolean).join(' · ');

    // Determine Sale Type from sale type text
    const typeText = (sale.type_txt || sale.sale_type || '').toLowerCase();
    const saleType = typeText.indexOf('online') !== -1 ? 'Online Auction' : 'Live Auction';

    // Format dates as MM/DD/YYYY for the sheet
    const fmt = function(d) {
      return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    };

    // Append row: Date | Title | Description | (blank) | Sale Type | End Date | Source
    sheet.appendRow([
      fmt(startDate),
      title,
      description,
      '',              // Column D: sync status — left blank for syncSheet to fill
      saleType,        // Column E: Sale Type (Live Auction | Online Auction)
      fmt(endDate),    // Column F: End Date
      'CHRISTIES_SCRAPE', // Column G: Source
    ]);

    existingTitles.add(title);
    added++;
    Logger.log('Added: ' + title + ' (' + fmt(startDate) + ' – ' + fmt(endDate) + ') [' + saleType + ']');
  });

  Logger.log('Scrape complete — added: ' + added + ', skipped: ' + skipped);
  Logger.log('Run syncSheetsToCalendar() to push new entries to Google Calendar.');
}

// ─── Utility: Add Sale Type header to Event Calendar sheet ───────────────────

/**
 * One-time utility: ensures the Event Calendar sheet has the correct headers.
 * Run once after pasting this script to set up column headers.
 *
 * Expected header row (row 1):
 *   A=Start Date | B=Event Name | C=Description | D=Sync Status | E=Sale Type | F=End Date | G=Source
 */
function setupEventCalendarHeaders() {
  const ss = SpreadsheetApp.openById(EVENT_SHEET_ID);
  const sheet = ss.getSheets()[0];

  // Check if headers already exist
  const firstRow = sheet.getRange(1, 1, 1, 7).getValues()[0];
  const hasHeaders = firstRow[0] && String(firstRow[0]).trim() !== '';

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, 7).setValues([[
      'Start Date', 'Event Name', 'Description', 'Sync Status', 'Sale Type', 'End Date', 'Source'
    ]]);
    Logger.log('Headers set on Event Calendar sheet.');
  } else {
    // Update column E header to "Sale Type" if it's missing
    if (!firstRow[4] || String(firstRow[4]).trim() === '') {
      sheet.getRange(1, 5).setValue('Sale Type');
      Logger.log('Column E header set to "Sale Type".');
    }
    // Update column F to "End Date" and G to "Source" if needed
    if (!firstRow[5] || String(firstRow[5]).trim() === '') {
      sheet.getRange(1, 6).setValue('End Date');
    }
    if (!firstRow[6] || String(firstRow[6]).trim() === '') {
      sheet.getRange(1, 7).setValue('Source');
    }
    Logger.log('Headers verified. Existing data preserved.');
  }
}

// ─── Utility: Color-code existing Sale Type entries ──────────────────────────

/**
 * One-time utility: applies background color to all rows in the Event Calendar
 * that have a Sale Type in column E.
 *   Live Auction   → Gold background (#947231)
 *   Online Auction → Light grey background (#E0E0E0)
 *
 * Run once after scrapeChristiesAuctions() to visually distinguish sale types.
 */
function colorCodeSaleTypes() {
  const ss = SpreadsheetApp.openById(EVENT_SHEET_ID);
  const sheet = ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  const lastCol = sheet.getLastColumn();

  for (let i = 1; i < data.length; i++) {
    const saleType = data[i][4] ? String(data[i][4]).trim() : '';
    if (!saleType) continue;

    const range = sheet.getRange(i + 1, 1, 1, lastCol);
    if (saleType === 'Live Auction') {
      range.setBackground('#FFF3CD'); // warm gold tint
    } else if (saleType === 'Online Auction') {
      range.setBackground('#F5F5F5'); // light grey
    }
  }

  Logger.log('Color-coding complete.');
}

// ─── Utility: List all events today (for testing) ─────────────────────────────

function listTodayEvents() {
  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const events = cal.getEvents(today, tomorrow);
  Logger.log('Events today (' + events.length + '):');
  events.forEach(function(e) {
    Logger.log('  · ' + e.getTitle() + ' @ ' + e.getStartTime());
  });
}

/**
 * Test function — run manually to verify the scraper output without writing to the sheet.
 * Logs the first 10 NY sales found on christies.com/en/calendar.
 */
function testScrapePreview() {
  const response = UrlFetchApp.fetch(CHRISTIES_CALENDAR_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CalendarBot/1.0)' },
    muteHttpExceptions: true,
  });
  const html = response.getContentText();
  const dataStart = html.indexOf('data:');
  const braceStart = html.indexOf('{', dataStart);
  let depth = 0, braceEnd = braceStart;
  for (let i = braceStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') { depth--; if (depth === 0) { braceEnd = i + 1; break; } }
  }
  const calData = JSON.parse(html.substring(braceStart, braceEnd));
  const nyEvents = (calData.events || []).filter(function(e) {
    return e.location_txt && e.location_txt.toLowerCase().indexOf('new york') !== -1;
  });
  Logger.log('NY events preview (' + nyEvents.length + ' total):');
  nyEvents.slice(0, 10).forEach(function(e) {
    const typeText = (e.type_txt || e.sale_type || '').toLowerCase();
    const saleType = typeText.indexOf('online') !== -1 ? 'Online Auction' : 'Live Auction';
    Logger.log('  · ' + e.title_txt + ' | ' + e.date_display_txt + ' | ' + e.location_txt + ' | ' + saleType);
  });
}
