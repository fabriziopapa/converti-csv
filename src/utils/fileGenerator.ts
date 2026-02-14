import { saveAs } from 'file-saver';
import {
  formatRecordRMA,
  formatRecordRMD,
  formatRecordRMZ,
  validateAllRecords
} from './recordFormatter';
import { ProgressivoManager } from './progressivoManager';
import { parseImportoItaliano } from './stringUtils';
import type { CSVRow, ConvertitoreResult } from '../types/convertitore.types';

/**
 * Genera file TXT con record a lunghezza fissa
 *
 * Python equivalente: funzione principale in app.py route '/' (righe 152-200)
 *
 * Flusso:
 * 1. Incrementa progressivo
 * 2. Genera identificativo file
 * 3. Crea RMA (record di testa)
 * 4. Loop su csvData → crea RMD per ogni riga
 * 5. Crea RMZ (record di coda con totali)
 * 6. Valida tutti i record (300 byte)
 * 7. Join con \n
 * 8. Crea Blob e trigger download
 *
 * @param csvData - Array di righe CSV parsate
 * @param data - Data di creazione file (default: oggi)
 * @returns Risultato con informazioni file generato
 */
export function generaFileTXT(
  csvData: CSVRow[],
  data: Date = new Date()
): ConvertitoreResult {
  console.log(`[fileGenerator] Inizio generazione per ${csvData.length} righe`);

  // 1. Incrementa progressivo
  const progressivoData = ProgressivoManager.increment();
  const identificativo = ProgressivoManager.generateIdentificativo(progressivoData);

  console.log(`[fileGenerator] Identificativo: ${identificativo}`);

  const records: string[] = [];

  // 2. Record RMA (testa)
  const rma = formatRecordRMA(identificativo, data);
  records.push(rma);

  // 3. Record RMD (dettagli - uno per ogni riga CSV)
  let progressivoRecord = 2; // Inizia da 2 (1 è RMA)

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];

    // Estrai campi obbligatori
    const codiceFiscale = row.COD_FIS?.trim() || '';
    const nettoStr = row.NETTO?.trim() || '0';

    // Validazione
    if (!codiceFiscale) {
      throw new Error(
        `Riga ${i + 1}: COD_FIS mancante o vuoto`
      );
    }

    // Parsing importo (gestisce formato italiano)
    const importo = parseImportoItaliano(nettoStr);

    // Crea record RMD
    const rmd = formatRecordRMD(
      progressivoRecord,
      codiceFiscale,
      importo,
      data
    );

    records.push(rmd);
    progressivoRecord++;
  }

  // 4. Record RMZ (coda)
  const totaleRecord = records.length + 1; // +1 per RMZ stesso
  const rmz = formatRecordRMZ(
    progressivoRecord,
    identificativo,
    data,
    totaleRecord
  );

  records.push(rmz);

  console.log(`[fileGenerator] Generati ${records.length} record (1 RMA + ${csvData.length} RMD + 1 RMZ)`);

  // 5. Valida tutti i record
  if (!validateAllRecords(records)) {
    throw new Error(
      'Validazione record fallita: uno o più record non sono 300 byte'
    );
  }

  // 6. Genera contenuto file (record separati da \n)
  const content = records.join('\n');

  // 7. Download file
  const fileName = ProgressivoManager.generateFileName(progressivoData);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

  saveAs(blob, fileName);

  console.log(`[fileGenerator] ✓ File generato: ${fileName}`);

  return {
    identificativo,
    progressivo: progressivoData.progressivo,
    numeroRecord: totaleRecord,
    fileName
  };
}

/**
 * Preview record senza salvare file
 * Utile per debug/testing
 *
 * @param csvData - Dati CSV
 * @param data - Data creazione
 * @returns Array di record generati
 */
export function previewRecords(
  csvData: CSVRow[],
  data: Date = new Date()
): string[] {
  // Usa progressivo attuale senza incrementare
  const progressivoData = ProgressivoManager.getCurrent();
  const identificativo = ProgressivoManager.generateIdentificativo(progressivoData);

  const records: string[] = [];

  // RMA
  const rma = formatRecordRMA(identificativo, data);
  records.push(rma);

  // RMD
  let progressivoRecord = 2;

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];
    const codiceFiscale = row.COD_FIS?.trim() || '';
    const importo = parseImportoItaliano(row.NETTO?.trim() || '0');

    const rmd = formatRecordRMD(
      progressivoRecord,
      codiceFiscale,
      importo,
      data
    );

    records.push(rmd);
    progressivoRecord++;
  }

  // RMZ
  const totaleRecord = records.length + 1;
  const rmz = formatRecordRMZ(
    progressivoRecord,
    identificativo,
    data,
    totaleRecord
  );

  records.push(rmz);

  return records;
}
