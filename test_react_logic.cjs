// Test script per simulare logica React senza browser
// Genera file TXT usando la stessa logica di recordFormatter.ts

const fs = require('fs');
const path = require('path');

// ============= UTILITY FUNCTIONS (da stringUtils.ts) =============
function padRight(str, length) {
  return str.padEnd(length, ' ');
}

function padLeft(str, length) {
  return str.padStart(length, '0');
}

function formatImporto(importo) {
  // Flask usa int() che tronca, non arrotonda
  const centesimi = Math.trunc(importo * 100);
  return padLeft(String(centesimi), 15);
}

function getByteLength(str) {
  return Buffer.byteLength(str, 'utf-8');
}

function truncateToBytes(str, maxBytes) {
  let truncated = str;
  while (getByteLength(truncated) > maxBytes) {
    truncated = truncated.slice(0, -1);
  }
  return truncated;
}

// ============= DATE UTILS (da dateUtils.ts) =============
function formatDataAAAAMMGG(data) {
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// ============= RECORD FORMATTER (da recordFormatter.ts) =============
function formatRecordRMA(identificativo, data) {
  const dataStr = formatDataAAAAMMGG(data);

  let record = '';
  record += 'RMA';
  record += '0000001';
  record += padRight(identificativo, 20);
  record += dataStr;
  record += 'R01';
  record += padRight('', 259);

  return record;
}

function formatRecordRMD(progressivoRecord, codiceFiscale, importo, data) {
  const progressivoStr = padLeft(String(progressivoRecord), 7);
  const dataStr = formatDataAAAAMMGG(data);
  // IMPORTANTE: Tronca a 16 byte e pad a livello BYTE (non caratteri)
  const cfTruncated = truncateToBytes(codiceFiscale, 16);
  const bytesUsed = getByteLength(cfTruncated);
  const spacesToAdd = 16 - bytesUsed;
  const cfPadded = cfTruncated + ' '.repeat(Math.max(0, spacesToAdd));

  // IMPORTANTE: usare progressivo NON zero-padded, come in Flask
  const idPagamentoBase = `FSHD${dataStr}${progressivoRecord}`;
  const idPagamento = padRight(idPagamentoBase, 15).substring(0, 15);

  const importoStr = formatImporto(importo);

  let record = '';
  record += 'RMD';
  record += progressivoStr;
  record += '0000001';
  record += '1';
  record += cfPadded;
  record += idPagamento;
  record += importoStr;
  record += '1';
  record += padRight('', 235);

  return record;
}

function formatRecordRMZ(progressivoFinale, identificativo, data, totaleRecord) {
  const progressivoStr = padLeft(String(progressivoFinale), 7);
  const dataStr = formatDataAAAAMMGG(data);
  const totaleStr = padLeft(String(totaleRecord), 7);

  let record = '';
  record += 'RMZ';
  record += progressivoStr;
  record += padRight(identificativo, 20);
  record += dataStr;
  record += totaleStr;
  record += padRight('', 255);

  return record;
}

// ============= MAIN LOGIC =============
function parseImportoItaliano(str) {
  // Remove thousand separators (.) and replace decimal comma with dot
  const cleaned = str.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned);
}

function generaFileTXT(csvPath, outputPath, progressivo) {
  console.log(`[TEST] Generazione file con logica React aggiornata`);
  console.log(`[TEST] Input: ${csvPath}`);
  console.log(`[TEST] Output: ${outputPath}`);
  console.log(`[TEST] Progressivo: ${progressivo}\n`);

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  const header = lines[0].split(';');
  const rows = lines.slice(1);

  // Find column indices
  const codFisIndex = header.indexOf('COD_FIS');
  const nettoIndex = header.indexOf('NETTO');

  if (codFisIndex === -1 || nettoIndex === -1) {
    console.error('[ERROR] Colonne COD_FIS o NETTO non trovate!');
    process.exit(1);
  }

  const data = new Date();
  const mese = String(data.getMonth() + 1).padStart(2, '0');
  const identificativo = `IRMEQS${data.getFullYear()}${mese}${String(progressivo).padStart(8, '0')}`;

  const records = [];

  // RMA
  records.push(formatRecordRMA(identificativo, data));

  // RMD
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].split(';');
    const codFis = row[codFisIndex]?.trim() || '';
    const nettoStr = row[nettoIndex]?.trim() || '0';

    if (!codFis) {
      console.log(`[WARN] Riga ${i + 2}: COD_FIS mancante, skip`);
      continue;
    }

    const netto = parseImportoItaliano(nettoStr);
    const progressivoRecord = i + 2;

    records.push(formatRecordRMD(progressivoRecord, codFis, netto, data));
    count++;
  }

  // RMZ
  const totaleRecord = count + 2;
  records.push(formatRecordRMZ(count + 2, identificativo, data, totaleRecord));

  // Write to file
  const content = records.join('\n') + '\n';
  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log(`[OK] Generati ${count} record RMD`);
  console.log(`[OK] Totale record: ${totaleRecord} (1 RMA + ${count} RMD + 1 RMZ)`);
  console.log(`[OK] File salvato: ${outputPath}`);
}

// Run
const csvPath = process.argv[2] || 'ESTRAZIONE_NETTI.csv';
const progressivo = parseInt(process.argv[3] || '1');
const outputPath = `react_logic_test_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.TXT`;

if (!fs.existsSync(csvPath)) {
  console.error(`[ERROR] File ${csvPath} non trovato!`);
  process.exit(1);
}

generaFileTXT(csvPath, outputPath, progressivo);
