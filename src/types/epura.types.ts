/**
 * Type definitions per funzionalità Epura CSV
 */

export interface EpuraFormState {
  csvFile: File | null;
  irmeqsFiles: File[];
  manualCFText: string;
}

export interface EpuraResult {
  fileName: string;
  originalRows: number;
  filteredRows: number;
  removedRows: number;
  removedCF: string[];
  cfFromIRMEQS: string[];
  cfFromManual: string[];
  invalidCF: string[];
}

export interface EpuraProcessingState {
  isProcessing: boolean;
  result: EpuraResult | null;
  error: string | null;
}
