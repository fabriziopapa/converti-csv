// Script per validare lunghezza record (deve essere 300 byte)
// Uso: node validate_record_length.js <path-to-txt-file>

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('❌ Uso: node validate_record_length.js <path-to-txt-file>');
  process.exit(1);
}

try {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Normalize line endings (handle both LF and CRLF)
  const lines = content.replace(/\r\n/g, '\n').split('\n').filter(line => line.length > 0);

  console.log('📊 Analisi Record:\n');
  console.log(`File: ${path.basename(filePath)}`);
  console.log(`Totale record: ${lines.length}\n`);

  let allValid = true;

  lines.forEach((line, index) => {
    const byteLength = Buffer.byteLength(line, 'utf-8');
    const recordType = line.substring(0, 3);
    const isValid = byteLength === 300;

    const status = isValid ? '✅' : '❌';
    const color = isValid ? '' : '\x1b[31m'; // Red
    const reset = '\x1b[0m';

    console.log(`${color}${status} Record ${index + 1} (${recordType}): ${byteLength} byte${reset}`);

    if (!isValid) {
      allValid = false;
      console.log(`   Expected: 300 byte`);
      console.log(`   Difference: ${byteLength - 300} byte`);
    }
  });

  console.log('\n' + '='.repeat(50));

  if (allValid) {
    console.log('✅ SUCCESSO: Tutti i record sono esattamente 300 byte!');
    process.exit(0);
  } else {
    console.log('❌ ERRORE: Alcuni record non sono 300 byte!');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Errore lettura file:', error.message);
  process.exit(1);
}
