import { jsPDF } from 'jspdf';
import fs from 'fs';

const logoContent = fs.readFileSync('/home/ubuntu/christies-eh-replatform/client/src/lib/logo-b64.ts', 'utf8');
const match = logoContent.match(/data:image\/png;base64,([A-Za-z0-9+/=\n]+)/);
const logoB64 = 'data:image/png;base64,' + match[1].replace(/\n/g, '').replace(/\s/g, '');

const cx = 215.9 / 2;

// Test at Y=8 (original drawHeader position)
const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
doc.addImage(logoB64, 'PNG', cx - 22, 8, 44, 17);
doc.setDrawColor(200, 172, 120);
doc.setLineWidth(0.5);
doc.line(18, 28, 215.9 - 18, 28);
doc.setFontSize(12);
doc.setTextColor(0, 0, 0);
doc.text('Logo at Y=8mm (original drawHeader)', cx, 40, { align: 'center' });
fs.writeFileSync('/home/ubuntu/pdf-screenshots/logo-test-y8.pdf', Buffer.from(doc.output('arraybuffer')));

// Test at Y=20
const doc2 = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
doc2.addImage(logoB64, 'PNG', cx - 22, 20, 44, 17);
doc2.setDrawColor(200, 172, 120);
doc2.setLineWidth(0.5);
doc2.line(18, 42, 215.9 - 18, 42);
doc2.setFontSize(12);
doc2.setTextColor(0, 0, 0);
doc2.text('Logo at Y=20mm', cx, 54, { align: 'center' });
fs.writeFileSync('/home/ubuntu/pdf-screenshots/logo-test-y20.pdf', Buffer.from(doc2.output('arraybuffer')));

console.log('Test PDFs generated');
