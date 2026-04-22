/**
 * One-time migration: create daily_brief table
 * Run: node scripts/create-daily-brief-table.mjs
 */
import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL not set');

const conn = await mysql.createConnection(url);

await conn.execute(`
  CREATE TABLE IF NOT EXISTS \`daily_brief\` (
    \`id\`           INT AUTO_INCREMENT PRIMARY KEY,
    \`brief_date\`   VARCHAR(16) NOT NULL UNIQUE,
    \`hamptons\`     TEXT NOT NULL,
    \`markets\`      TEXT NOT NULL,
    \`art\`          TEXT NOT NULL,
    \`audio_url\`    TEXT,
    \`generated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`created_at\`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('[OK] daily_brief table created (or already exists)');
await conn.end();
