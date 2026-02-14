import { padRight, padLeft, formatImporto, truncateToBytes, getByteLength } from './stringUtils';
import { formatDataAAAAMMGG } from './dateUtils';

/**
 * recordFormatter.ts - Generazione record a lunghezza fissa (300 byte)
 *
 * ⚠️ CRITICO: Questo file implementa la logica di formattazione identica
 * alla versione Flask (app.py righe 87-150). L'output DEVE essere
 * byte-per-byte identico.
 *
 * Ogni record è ESATTAMENTE 300 byte (caratteri ASCII).
 */

/**
 * Formatta record RMA (Record di testa) - 300 byte
 *
 * Python: format_record_rma() in app.py righe 87-99
 *
 * Struttura:
 * - Pos 001-003: "RMA"
 * - Pos 004-010: "0000001" (progressivo fisso)
 * - Pos 011-030: identificativo file (20 caratteri)
 * - Pos 031-038: data creazione AAAAMMGG
 * - Pos 039-041: "R01" (release)
 * - Pos 042-300: spazi (259 caratteri)
 *
 * @param identificativo - Es. "IRMEQS20250000000001"
 * @param data - Data di creazione
 * @returns Record RMA di 300 byte
 */
export function formatRecordRMA(
  identificativo: string,
  data: Date
): string {
  const dataStr = formatDataAAAAMMGG(data);

  let record = '';
  record += 'RMA';                              // Pos 001-003 (3 byte)
  record += '0000001';                          // Pos 004-010 (7 byte)
  record += padRight(identificativo, 20);       // Pos 011-030 (20 byte)
  record += dataStr;                            // Pos 031-038 (8 byte)
  record += 'R01';                              // Pos 039-041 (3 byte)
  record += padRight('', 259);                  // Pos 042-300 (259 byte)

  return record;
}

/**
 * Formatta record RMD (Record dettaglio) - 300 byte
 *
 * Python: format_record_rmd() in app.py righe 101-128
 *
 * Struttura:
 * - Pos 001-003: "RMD"
 * - Pos 004-010: progressivo record (7 cifre zero-padded)
 * - Pos 011-017: "0000001" (progressivo richiesta fisso)
 * - Pos 018:     "1" (tipo soggetto)
 * - Pos 019-034: codice fiscale (16 caratteri, padded right)
 * - Pos 035-049: identificativo pagamento (15 caratteri)
 * - Pos 050-064: importo in centesimi (15 cifre zero-padded)
 * - Pos 065:     "1" (flag tipologia pagamento)
 * - Pos 066-300: spazi (235 caratteri)
 *
 * @param progressivoRecord - Numero progressivo del record (2, 3, 4...)
 * @param codiceFiscale - Codice fiscale (max 16 caratteri)
 * @param importo - Importo in euro (es. 100.50)
 * @param data - Data per identificativo pagamento
 * @returns Record RMD di 300 byte
 */
export function formatRecordRMD(
  progressivoRecord: number,
  codiceFiscale: string,
  importo: number,
  data: Date
): string {
  const progressivoStr = padLeft(String(progressivoRecord), 7);
  const dataStr = formatDataAAAAMMGG(data);
  // IMPORTANTE: Tronca a 16 byte e pad a livello BYTE (non caratteri!)
  const cfTruncated = truncateToBytes(codiceFiscale, 16);
  const bytesUsed = getByteLength(cfTruncated);
  const spacesToAdd = 16 - bytesUsed;
  const cfPadded = cfTruncated + ' '.repeat(Math.max(0, spacesToAdd));

  // Identificativo pagamento: FSHD{AAAAMMGG}{progressivo}
  // Python: f"FSHD{oggi.strftime('%Y%m%d')}{index + 2}".ljust(15)[:15]
  // IMPORTANTE: usare progressivo NON zero-padded, come in Flask
  const idPagamentoBase = `FSHD${dataStr}${progressivoRecord}`;
  const idPagamento = padRight(idPagamentoBase, 15).substring(0, 15);

  const importoStr = formatImporto(importo);

  let record = '';
  record += 'RMD';                              // Pos 001-003 (3 byte)
  record += progressivoStr;                     // Pos 004-010 (7 byte)
  record += '0000001';                          // Pos 011-017 (7 byte)
  record += '1';                                // Pos 018 (1 byte)
  record += cfPadded;                           // Pos 019-034 (16 byte)
  record += idPagamento;                        // Pos 035-049 (15 byte)
  record += importoStr;                         // Pos 050-064 (15 byte)
  record += '1';                                // Pos 065 (1 byte)
  record += padRight('', 235);                  // Pos 066-300 (235 byte)

  return record;
}

/**
 * Formatta record RMZ (Record di coda) - 300 byte
 *
 * Python: format_record_rmz() in app.py righe 130-150
 *
 * Struttura:
 * - Pos 001-003: "RMZ"
 * - Pos 004-010: progressivo finale (7 cifre)
 * - Pos 011-030: identificativo file (20 caratteri)
 * - Pos 031-038: data creazione AAAAMMGG
 * - Pos 039-045: totale record RMA+RMD+RMZ (7 cifre)
 * - Pos 046-300: spazi (255 caratteri)
 *
 * @param progressivoFinale - Numero progressivo del record RMZ
 * @param identificativo - Identificativo file (stesso di RMA)
 * @param data - Data di creazione
 * @param totaleRecord - Numero totale di record nel file (RMA + N*RMD + RMZ)
 * @returns Record RMZ di 300 byte
 */
export function formatRecordRMZ(
  progressivoFinale: number,
  identificativo: string,
  data: Date,
  totaleRecord: number
): string {
  const progressivoStr = padLeft(String(progressivoFinale), 7);
  const dataStr = formatDataAAAAMMGG(data);
  const totaleStr = padLeft(String(totaleRecord), 7);

  let record = '';
  record += 'RMZ';                              // Pos 001-003 (3 byte)
  record += progressivoStr;                     // Pos 004-010 (7 byte)
  record += padRight(identificativo, 20);       // Pos 011-030 (20 byte)
  record += dataStr;                            // Pos 031-038 (8 byte)
  record += totaleStr;                          // Pos 039-045 (7 byte)
  record += padRight('', 255);                  // Pos 046-300 (255 byte)

  return record;
}

/**
 * Valida che un record sia esattamente 300 byte
 * CRITICO: Controlla lunghezza in byte, non in caratteri
 * (caratteri UTF-8 speciali possono occupare più byte)
 *
 * @param record - Record da validare
 * @returns true se il record è esattamente 300 byte
 */
export function validateRecordLength(record: string): boolean {
  // Calcola lunghezza in byte (UTF-8)
  const byteLength = new Blob([record]).size;

  if (byteLength !== 300) {
    console.error(
      `[recordFormatter] ERRORE: Record length = ${byteLength} byte, expected 300`
    );
    return false;
  }

  return true;
}

/**
 * Valida tutti i record in un array
 * Utile per debug durante lo sviluppo
 *
 * @param records - Array di record da validare
 * @returns true se tutti i record sono validi
 */
export function validateAllRecords(records: string[]): boolean {
  let allValid = true;

  records.forEach((record, index) => {
    if (!validateRecordLength(record)) {
      console.error(`[recordFormatter] Record #${index + 1} non valido`);
      allValid = false;
    }
  });

  if (allValid) {
    console.log(`[recordFormatter] ✓ Tutti i ${records.length} record sono validi (300 byte)`);
  }

  return allValid;
}
