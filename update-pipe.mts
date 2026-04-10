import 'dotenv/config';
import { readPipelineRows, updatePipelineStatus, appendPipelineRow, findRowByAddress } from './server/sheets-helper.js';

async function main() {
  console.log('Reading pipeline sheet...');
  const rows = await readPipelineRows();
  
  // Print all addresses to find 25 Horseshoe and 191 Bull Path
  console.log('\n=== Current pipeline addresses ===');
  rows.forEach((row, i) => {
    if (row[0]) console.log(`Row ${i+1}: "${row[0]}" | Status: "${row[4]}" | Price: "${row[3]}"`);
  });

  // Check for 25 Horseshoe Road
  const horseshoeRow = await findRowByAddress('25 Horseshoe Road');
  console.log(`\n25 Horseshoe Road row: ${horseshoeRow}`);

  // Check for 191 Bull Path
  const bullPathRow = await findRowByAddress('191 Bull Path');
  console.log(`191 Bull Path row: ${bullPathRow}`);

  // Update 25 Horseshoe Road → IN CONTRACT
  if (horseshoeRow !== null) {
    console.log('\nUpdating 25 Horseshoe Road → IN CONTRACT...');
    const result = await updatePipelineStatus('25 Horseshoe Road', 'IN CONTRACT');
    console.log('Result:', result);
  } else {
    console.log('\n25 Horseshoe Road not found in sheet — appending new row...');
    const result = await appendPipelineRow({
      address: '25 Horseshoe Road',
      town: 'East Hampton',
      type: 'Residential',
      price: '$5,750,000',
      status: 'IN CONTRACT',
      agent: 'Ed Bruehl',
      side: 'Listing',
    });
    console.log('Appended at row:', result.rowNumber);
  }

  // Update or append 191 Bull Path → ACTIVE LISTING
  if (bullPathRow !== null) {
    console.log('\nUpdating 191 Bull Path → ACTIVE LISTING...');
    const result = await updatePipelineStatus('191 Bull Path', 'ACTIVE LISTING');
    console.log('Result:', result);
  } else {
    console.log('\n191 Bull Path not found in sheet — appending new row...');
    const result = await appendPipelineRow({
      address: '191 Bull Path',
      town: 'East Hampton',
      type: 'Residential',
      price: '$3,300,000',
      status: 'ACTIVE LISTING',
      agent: 'Ed Bruehl',
      side: 'Listing',
    });
    console.log('Appended at row:', result.rowNumber);
  }

  console.log('\nDone.');
}

main().catch(console.error);
