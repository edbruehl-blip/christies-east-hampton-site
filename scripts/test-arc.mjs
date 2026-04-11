import { readAscensionArcData } from '../server/sheets-helper.ts';

const data = await readAscensionArcData();
console.log('Years returned:');
data.years.forEach(y => {
  console.log(`  ${y.year}: officeVolume=${y.officeVolume}, netProfit=${y.netProfit}, edPool=${y.edPool}, edGci=${y.edGci}`);
});
