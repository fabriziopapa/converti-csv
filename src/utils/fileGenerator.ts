import { saveAs } from 'file-saver';
import {
  formatRecordRMA,
  formatRecordRMD,
  formatRecordRMZ,
  validateAllRecords
} from './recordFormatter';
import { ProgressivoManager } from './progressivoManager';
import { parseImportoItaliano } from './stringUtils';
import type {
  CSVRow,
  ConvertitoreResult,
  ConvertitoreDualResult,
  ConvertitoreResultMultiplo
} from '../types/convertitore.types';

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

/**
 * Genera DUE file TXT IRMEQS con filtraggio per importo
 *
 * Flusso:
 * 1. Filtra CSV in due gruppi:
 *    - Gruppo 1: netti > 2500 e <= 5000 (flag pos 65 = "1")
 *    - Gruppo 2: netti > 5000 (flag pos 65 = " ")
 * 2. Genera file separato per ogni gruppo con progressivo distinto
 * 3. Scarica entrambi i file automaticamente
 *
 * @param csvData - Array di righe CSV parsate
 * @param data - Data di creazione file (default: oggi)
 * @returns Risultato con informazioni di entrambi i file generati
 */
export function generaDueFileTXT(
  csvData: CSVRow[],
  data: Date = new Date()
): ConvertitoreDualResult {
  console.log(`[fileGenerator] Inizio generazione doppio file per ${csvData.length} righe`);

  // Filtra CSV in due gruppi
  const gruppo1: CSVRow[] = []; // 2500 < netto <= 5000
  const gruppo2: CSVRow[] = []; // netto > 5000
  let recordEsclusi = 0;

  for (const row of csvData) {
    const nettoStr = row.NETTO?.trim() || '0';
    const importo = parseImportoItaliano(nettoStr);

    if (importo > 2500 && importo <= 5000) {
      gruppo1.push(row);
    } else if (importo > 5000) {
      gruppo2.push(row);
    } else {
      recordEsclusi++;
      console.log(`[fileGenerator] Record escluso: netto=${importo} (<=2500)`);
    }
  }

  console.log(`[fileGenerator] Gruppo 1 (2500-5000): ${gruppo1.length} record`);
  console.log(`[fileGenerator] Gruppo 2 (>5000): ${gruppo2.length} record`);
  console.log(`[fileGenerator] Record esclusi (<=2500): ${recordEsclusi}`);

  let file1Result: ConvertitoreResultMultiplo | null = null;
  let file2Result: ConvertitoreResultMultiplo | null = null;

  // Genera File 1 (2500-5000) con flag "1"
  if (gruppo1.length > 0) {
    file1Result = generaFileConFlag(gruppo1, data, '1', '2500-5000');
    console.log(`[fileGenerator] ✓ File 1 generato: ${file1Result.fileName}`);
  } else {
    console.warn('[fileGenerator] ⚠ Nessun record nella fascia 2500-5000');
  }

  // Genera File 2 (>5000) con flag " " (spazio)
  if (gruppo2.length > 0) {
    file2Result = generaFileConFlag(gruppo2, data, ' ', '>5000');
    console.log(`[fileGenerator] ✓ File 2 generato: ${file2Result.fileName}`);
  } else {
    console.warn('[fileGenerator] ⚠ Nessun record nella fascia >5000');
  }

  return {
    file1: file1Result,
    file2: file2Result,
    totaleRecordProcessati: gruppo1.length + gruppo2.length,
    recordEsclusi
  };
}

/**
 * Genera singolo file TXT con flag tipologia pagamento specificato
 * Funzione helper per generaDueFileTXT
 *
 * @param csvData - Dati CSV filtrati
 * @param data - Data creazione
 * @param flagTipologia - Flag tipologia pagamento ("1" o " ")
 * @param categoria - Categoria importo (per info)
 * @returns Risultato generazione file
 */
function generaFileConFlag(
  csvData: CSVRow[],
  data: Date,
  flagTipologia: string,
  categoria: string
): ConvertitoreResultMultiplo {
  // 1. Incrementa progressivo
  const progressivoData = ProgressivoManager.increment();
  const identificativo = ProgressivoManager.generateIdentificativo(progressivoData);

  console.log(`[fileGenerator] Identificativo (${categoria}): ${identificativo}`);

  const records: string[] = [];

  // 2. Record RMA (testa)
  const rma = formatRecordRMA(identificativo, data);
  records.push(rma);

  // 3. Record RMD (dettagli)
  let progressivoRecord = 2;

  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];
    const codiceFiscale = row.COD_FIS?.trim() || '';
    const nettoStr = row.NETTO?.trim() || '0';

    if (!codiceFiscale) {
      throw new Error(`Riga ${i + 1}: COD_FIS mancante o vuoto`);
    }

    const importo = parseImportoItaliano(nettoStr);

    // Crea RMD con flag specificato
    const rmd = formatRecordRMD(
      progressivoRecord,
      codiceFiscale,
      importo,
      data,
      flagTipologia // Flag parametrico!
    );

    records.push(rmd);
    progressivoRecord++;
  }

  // 4. Record RMZ (coda)
  const totaleRecord = records.length + 1;
  const rmz = formatRecordRMZ(
    progressivoRecord,
    identificativo,
    data,
    totaleRecord
  );

  records.push(rmz);

  console.log(`[fileGenerator] Generati ${records.length} record per ${categoria}`);

  // 5. Valida tutti i record
  if (!validateAllRecords(records)) {
    throw new Error(
      `Validazione record fallita per ${categoria}: uno o più record non sono 300 byte`
    );
  }

  // 6. Genera contenuto file
  const content = records.join('\n');

  // 7. Download file
  const fileName = ProgressivoManager.generateFileName(progressivoData);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

  saveAs(blob, fileName);

  return {
    identificativo,
    progressivo: progressivoData.progressivo,
    numeroRecord: totaleRecord,
    fileName,
    categoria,
    numeroRecordDati: csvData.length
  };
}
