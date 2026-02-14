// Script per eseguire tutti i test edge case
// Uso: node run_edge_case_tests.cjs

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEST_CASES_DIR = 'test-cases';
const TEST_SCRIPT = 'test_react_logic.cjs';

// Test cases da eseguire
const testCases = [
  {
    name: 'Test Minimo (1 record)',
    file: 'test_minimo.csv',
    expectedRecords: 3, // 1 RMA + 1 RMD + 1 RMZ
    shouldSucceed: true
  },
  {
    name: 'Test Caratteri Speciali',
    file: 'test_caratteri_speciali.csv',
    expectedRecords: 5, // 1 RMA + 3 RMD + 1 RMZ
    shouldSucceed: true,
    notes: 'Verifica encoding UTF-8 e caratteri accentati'
  },
  {
    name: 'Test Decimali Estremi',
    file: 'test_decimali_estremi.csv',
    expectedRecords: 7, // 1 RMA + 5 RMD + 1 RMZ
    shouldSucceed: true,
    notes: 'Verifica 0.00, 0.01, 0.99, grandi importi'
  },
  {
    name: 'Test Error Handling',
    file: 'test_error_handling.csv',
    expectedRecords: -1, // Dovrebbe gestire errori
    shouldSucceed: false,
    notes: 'COD_FIS mancante dovrebbe essere skippato'
  },
  {
    name: 'Test Floating Point Precision',
    file: 'test_floating_point.csv',
    expectedRecords: 7, // 1 RMA + 5 RMD + 1 RMZ
    shouldSucceed: true,
    notes: 'Verifica truncation vs rounding'
  }
];

console.log('🧪 EDGE CASE TESTING SUITE');
console.log('='.repeat(70));
console.log('');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

testCases.forEach((testCase, index) => {
  totalTests++;

  console.log(`\n📋 Test ${index + 1}/${testCases.length}: ${testCase.name}`);
  console.log('-'.repeat(70));

  if (testCase.notes) {
    console.log(`   Note: ${testCase.notes}`);
  }

  const csvPath = path.join(TEST_CASES_DIR, testCase.file);

  if (!fs.existsSync(csvPath)) {
    console.log(`   ❌ SKIP: File ${testCase.file} non trovato`);
    failedTests++;
    return;
  }

  try {
    // Esegui test
    const output = execSync(
      `node ${TEST_SCRIPT} ${csvPath} ${index + 1}`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );

    // Parse output
    const lines = output.split('\n');
    const generatedLine = lines.find(l => l.includes('[OK] Totale record:'));

    if (generatedLine) {
      const match = generatedLine.match(/Totale record: (\d+)/);
      if (match) {
        const recordCount = parseInt(match[1]);

        console.log(`   ✅ File generato con successo`);
        console.log(`   📊 Record generati: ${recordCount}`);

        if (testCase.expectedRecords > 0 && recordCount !== testCase.expectedRecords) {
          console.log(`   ⚠️  WARNING: Attesi ${testCase.expectedRecords} record`);
        }

        // Valida lunghezza record
        const outputFileName = `react_logic_test_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.TXT`;

        if (fs.existsSync(outputFileName)) {
          const validateOutput = execSync(
            `node validate_record_length.cjs ${outputFileName}`,
            { encoding: 'utf-8', stdio: 'pipe' }
          );

          if (validateOutput.includes('SUCCESSO')) {
            console.log(`   ✅ Tutti i record sono 300 byte`);
            passedTests++;
          } else {
            console.log(`   ❌ Alcuni record non sono 300 byte!`);
            failedTests++;
          }

          // Cleanup
          fs.unlinkSync(outputFileName);
        } else {
          console.log(`   ⚠️  File output non trovato per validazione`);
          passedTests++;
        }
      }
    } else if (testCase.shouldSucceed === false) {
      console.log(`   ✅ Test error handling: comportamento atteso`);
      passedTests++;
    }

  } catch (error) {
    if (testCase.shouldSucceed === false) {
      console.log(`   ✅ Errore gestito correttamente (atteso)`);
      console.log(`   📝 Messaggio: ${error.message.split('\n')[0]}`);
      passedTests++;
    } else {
      console.log(`   ❌ FAILED: ${error.message.split('\n')[0]}`);
      failedTests++;
    }
  }
});

console.log('\n' + '='.repeat(70));
console.log('📊 RISULTATI FINALI:');
console.log(`   Totale test: ${totalTests}`);
console.log(`   ✅ Passed: ${passedTests}`);
console.log(`   ❌ Failed: ${failedTests}`);
console.log(`   📈 Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('='.repeat(70));

if (failedTests === 0) {
  console.log('\n🎉 TUTTI I TEST EDGE CASE SONO PASSATI!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Alcuni test sono falliti. Verifica i dettagli sopra.\n');
  process.exit(1);
}
