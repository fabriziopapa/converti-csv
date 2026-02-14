/**
 * Riga CSV generica (chiave-valore)
 */
export type CSVRow = Record<string, string>;

/**
 * Input per generazione file TXT
 */
export interface ConvertitoreInput {
  csvData: CSVRow[];
  data: Date;
}

/**
 * Risultato generazione file TXT
 */
export interface ConvertitoreResult {
  identificativo: string;
  progressivo: number;
  numeroRecord: number;
  fileName: string;
}

/**
 * Risultato parsing CSV
 */
export interface ParseResult {
  data: CSVRow[];
  errors: string[];
}

/**
 * Risultato validazione colonne CSV
 */
export interface ValidationResult {
  valid: boolean;
  missing: string[];
}
