/**
 * Test script: generate a minimal PDF with the padded logo using jsPDF in Node.js
 * Run: node test-logo-render.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Read the logo-b64.ts file and extract the base64 string
const logoFile = readFileSync(join(__dirname, 'client/src/lib/logo-b64.ts'), 'utf-8');
const match = logoFile.match(/data:image\/\w+;base64,([A-Za-z0-9+/=\s]+)/);
if (!match) throw new Error('Logo base64 not found');
const logoB64 = 'data:image/png;base64,' + match[1].replace(/\s/g, '');

console.log('Logo data URI length:', logoB64.length);
console.log('Expected 711px height logo? Check first 100 chars of b64:', logoB64.substring(22, 122));

// Use jsPDF from the project's node_modules
const { jsPDF } = require('./node_modules/jspdf/dist/jspdf.node.js');

const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
const PAGE_W = 215.9;
const cx = PAGE_W / 2;

// Draw the logo at the same position as the letter variant
doc.addImage(logoB64, 'PNG', cx - 22, 8, 44, 17);

// Gold rule
doc.setDrawColor(197, 157, 76);
doc.setLineWidth(0.6);
doc.line(20, 28, PAGE_W - 20, 28);

// Title
doc.setFontSize(15);
doc.setTextColor(0, 32, 91);
doc.setFont('helvetica', 'bold');
doc.text("Christie's Flagship — Logo Test", 20, 42);

doc.setFontSize(9);
doc.setTextColor(80, 80, 80);
doc.setFont('helvetica', 'normal');
doc.text('If the CHRISTIE\'S wordmark is fully visible above the gold rule, the logo is rendering correctly.', 20, 52);
doc.text('If the top of the "C" is clipped, the logo asset needs more top padding.', 20, 60);

const pdfBytes = doc.output('arraybuffer');
writeFileSync('/home/ubuntu/pdf-screenshots/logo-node-test.pdf', Buffer.from(pdfBytes));
console.log('PDF written to /home/ubuntu/pdf-screenshots/logo-node-test.pdf');
