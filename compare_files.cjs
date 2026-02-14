// Script per confrontare due file TXT byte-per-byte
// Uso: node compare_files.js <file-flask> <file-react>

const fs = require('fs');
const path = require('path');

const file1 = process.argv[2];
const file2 = process.argv[3];

if (!file1 || !file2) {
  console.error('❌ Uso: node compare_files.js <file-flask> <file-react>');
  process.exit(1);
}

try {
  console.log('🔍 Confronto File:\n');
  console.log(`File 1 (Flask):  ${path.basename(file1)}`);
  console.log(`File 2 (React):  ${path.basename(file2)}\n`);

  const content1 = fs.readFileSync(file1, 'utf-8');
  const content2 = fs.readFileSync(file2, 'utf-8');

  // Normalize line endings (handle both LF and CRLF)
  const lines1 = content1.replace(/\r\n/g, '\n').split('\n').filter(line => line.length > 0);
  const lines2 = content2.replace(/\r\n/g, '\n').split('\n').filter(line => line.length > 0);

  console.log(`Record Flask: ${lines1.length}`);
  console.log(`Record React: ${lines2.length}\n`);

  if (lines1.length !== lines2.length) {
    console.log('❌ ERRORE: Numero di record diverso!');
    process.exit(1);
  }

  console.log('📋 Confronto Record:\n');

  let allMatch = true;

  for (let i = 0; i < lines1.length; i++) {
    const line1 = lines1[i];
    const line2 = lines2[i];
    const recordType = line1.substring(0, 3);

    if (line1 === line2) {
      console.log(`✅ Record ${i + 1} (${recordType}): IDENTICO`);
    } else {
      console.log(`❌ Record ${i + 1} (${recordType}): DIVERSO`);
      allMatch = false;

      // Mostra differenze posizione per posizione
      console.log(`   Lunghezza Flask: ${Buffer.byteLength(line1)} byte`);
      console.log(`   Lunghezza React: ${Buffer.byteLength(line2)} byte`);

      // Trova prima differenza
      for (let j = 0; j < Math.max(line1.length, line2.length); j++) {
        if (line1[j] !== line2[j]) {
          console.log(`   Prima differenza a posizione ${j + 1}:`);
          console.log(`     Flask: "${line1.substring(j, j + 10)}..."`);
          console.log(`     React: "${line2.substring(j, j + 10)}..."`);
          break;
        }
      }
    }
  }

  console.log('\n' + '='.repeat(50));

  if (allMatch) {
    console.log('🎉 SUCCESSO: File IDENTICI byte-per-byte!');
    process.exit(0);
  } else {
    console.log('❌ ERRORE: File DIVERSI!');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Errore:', error.message);
  process.exit(1);
}
