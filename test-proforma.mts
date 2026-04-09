import { generateProFormaPDF } from './server/proforma-generator.js';
import { writeFileSync } from 'fs';

console.log('Starting generateProFormaPDF...');
try {
  const buf = await generateProFormaPDF();
  console.log('SUCCESS: PDF size:', buf.length, 'bytes');
  writeFileSync('/tmp/test-proforma.pdf', buf);
  console.log('Written to /tmp/test-proforma.pdf');
} catch (e: any) {
  console.error('FAIL:', e.message);
  console.error(e.stack?.split('\n').slice(0, 8).join('\n'));
}
