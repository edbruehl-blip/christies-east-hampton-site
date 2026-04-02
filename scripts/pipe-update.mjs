/**
 * Manny Brief — Part I-A (revised)
 * 1. Delete all 6 seed/placeholder records
 * 2. Insert 25 Horseshoe Road → IN CONTRACT
 * 3. Insert 2 Old Hollow → IN CONTRACT
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);

// 1. Show current state
const [before] = await conn.execute('SELECT id, address, status FROM pipeline ORDER BY id');
console.log('\n=== BEFORE ===');
console.table(before);

// 2. Delete all seed records (ids 1–6 are the placeholder seed data)
const seedIds = before.map(r => r.id);
if (seedIds.length > 0) {
  const placeholders = seedIds.map(() => '?').join(',');
  const [del] = await conn.execute(`DELETE FROM pipeline WHERE id IN (${placeholders})`, seedIds);
  console.log(`\nDeleted ${del.affectedRows} seed record(s): ids [${seedIds.join(', ')}]`);
} else {
  console.log('\nNo seed records to delete.');
}

// 3. Get full pipeline schema to know which columns exist
const [cols] = await conn.execute('DESCRIBE pipeline');
const colNames = cols.map(c => c.Field);
console.log('\nPipeline columns:', colNames.join(', '));

// 4. Insert 25 Horseshoe Road — IN CONTRACT
// Use minimal required fields; detect what columns exist
const hasNotes = colNames.includes('notes');
const hasDealType = colNames.includes('deal_type');
const hasHamlet = colNames.includes('hamlet');
const hasPrice = colNames.includes('price');

let insertCols = ['address', 'status'];
let insertVals = ['25 Horseshoe Road', 'IN CONTRACT'];

if (hasDealType) { insertCols.push('deal_type'); insertVals.push('Listing'); }
if (hasHamlet)   { insertCols.push('hamlet');    insertVals.push('East Hampton Village'); }
if (hasNotes)    { insertCols.push('notes');     insertVals.push('Manny Brief — April 1 2026'); }

const colStr = insertCols.join(', ');
const qStr   = insertCols.map(() => '?').join(', ');

const [ins1] = await conn.execute(`INSERT INTO pipeline (${colStr}) VALUES (${qStr})`, insertVals);
console.log(`\nInserted 25 Horseshoe Road — id: ${ins1.insertId}`);

// 5. Insert 2 Old Hollow — IN CONTRACT
let vals2 = ['2 Old Hollow', 'IN CONTRACT'];
if (hasDealType) vals2.push('Listing');
if (hasHamlet)   vals2.push('East Hampton Town');
if (hasNotes)    vals2.push('Manny Brief — April 1 2026');

const [ins2] = await conn.execute(`INSERT INTO pipeline (${colStr}) VALUES (${qStr})`, vals2);
console.log(`Inserted 2 Old Hollow — id: ${ins2.insertId}`);

// 6. Final state
const [after] = await conn.execute('SELECT id, address, status FROM pipeline ORDER BY id');
console.log('\n=== AFTER ===');
console.table(after);

await conn.end();
console.log('\nDone.');

