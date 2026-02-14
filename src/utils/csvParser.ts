import Papa from 'papaparse';
import type { CSVRow, ParseResult, ValidationResult } from '../types/convertitore.types';

/**
 * Parse CSV con delimiter ; (formato italiano)
 *
 * Python equivalente: csv.DictReader(f, delimiter=';')
 *
 * @param file - File CSV da parsare
 * @param delimiter - Delimitatore colonne (default: ';')
 * @returns Promise con dati parsati ed eventuali errori
 */
export async function parseCSV(
  file: File,
  delimiter: string = ';'
): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse<CSVRow>(file, {
      header: true,              // Prima riga = intestazione
      delimiter,                 // Delimiter (;)
      skipEmptyLines: true,      // Ignora righe vuote

      complete: (results) => {
        const errors: string[] = results.errors.map(
          (e) => `Riga ${e.row}: ${e.message}`
        );

        console.log(`[csvParser] Parsate ${results.data.length} righe`);

        if (errors.length > 0) {
          console.warn(`[csvParser] ${errors.length} errori di parsing`);
        }

        resolve({
          data: results.data,
          errors
        });
      },

      error: (error) => {
        console.error('[csvParser] Errore parsing:', error);

        resolve({
          data: [],
          errors: [error.message]
        });
      }
    });
  });
}

/**
 * Valida presenza colonne obbligatorie nel CSV
 *
 * @param data - Dati CSV parsati
 * @param requiredColumns - Colonne obbligatorie (es. ['COD_FIS', 'NETTO'])
 * @returns Risultato validazione con colonne mancanti
 */
export function validateCSVColumns(
  data: CSVRow[],
  requiredColumns: string[]
): ValidationResult {
  if (data.length === 0) {
    return {
      valid: false,
      missing: requiredColumns
    };
  }

  const firstRow = data[0];
  const availableColumns = Object.keys(firstRow);

  // Controlla colonne mancanti (case-sensitive)
  const missing = requiredColumns.filter(
    (col) => !availableColumns.includes(col)
  );

  if (missing.length > 0) {
    console.error(
      `[csvParser] Colonne mancanti: ${missing.join(', ')}`
    );
    console.log(
      `[csvParser] Colonne disponibili: ${availableColumns.join(', ')}`
    );
  }

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Valida singola riga per Convertitore
 * Controlla presenza COD_FIS e NETTO
 *
 * @param row - Riga CSV
 * @param index - Indice riga (per messaggi errore)
 * @returns true se valida, altrimenti lancia errore
 */
export function validateConvertitoreRow(
  row: CSVRow,
  index: number
): boolean {
  const codFis = row.COD_FIS?.trim();
  const netto = row.NETTO?.trim();

  if (!codFis) {
    throw new Error(
      `Riga ${index + 1}: COD_FIS mancante o vuoto`
    );
  }

  if (!netto) {
    throw new Error(
      `Riga ${index + 1}: NETTO mancante o vuoto`
    );
  }

  // Valida formato importo (opzionale, ma utile)
  const nettoFloat = parseFloat(netto.replace(',', '.'));
  if (isNaN(nettoFloat)) {
    throw new Error(
      `Riga ${index + 1}: NETTO non è un numero valido (${netto})`
    );
  }

  return true;
}
