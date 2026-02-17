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
 * Risultato generazione file TXT con categoria importo
 */
export interface ConvertitoreResultMultiplo extends ConvertitoreResult {
  categoria: string; // es. "2500-5000" o ">5000"
  numeroRecordDati: number; // numero RMD (esclusi RMA e RMZ)
}

/**
 * Risultato generazione doppio file IRMEQS
 */
export interface ConvertitoreDualResult {
  file1: ConvertitoreResultMultiplo | null; // netti 2500-5000
  file2: ConvertitoreResultMultiplo | null; // netti >5000
  totaleRecordProcessati: number;
  recordEsclusi: number; // record con netto <= 2500
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
