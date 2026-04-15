import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  console.error('GOOGLE_SERVICE_ACCOUNT_JSON not set');
  process.exit(1);
}

const credentials = JSON.parse(serviceAccountJson);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/documents.readonly'],
});

const docs = google.docs({ version: 'v1', auth });

const DOC_ID = '10J7DCQ0enCc8QnR-BLb1_ITVMd5Wn6C4DO3twuSP5rQ';

const res = await docs.documents.get({ documentId: DOC_ID });
const body = res.data.body.content;

// Extract all text
let fullText = '';
for (const element of body) {
  if (element.paragraph) {
    for (const pe of element.paragraph.elements || []) {
      if (pe.textRun?.content) {
        fullText += pe.textRun.content;
      }
    }
  }
}

// Find D39, D40, D41 sections
const sections = ['D39', 'D40', 'D41', 'D42', 'D43'];
for (const d of sections) {
  const idx = fullText.indexOf(d);
  if (idx !== -1) {
    console.log(`\n=== ${d} ===`);
    console.log(fullText.slice(idx, idx + 600));
  } else {
    console.log(`\n=== ${d} NOT FOUND ===`);
  }
}
