/**
 * Struttura dati progressivo annuale
 * Sostituisce il modello PostgreSQL Progressivo
 */
export interface ProgressivoData {
  anno: number;
  progressivo: number;
  lastUpdated: string; // ISO date string
}

/**
 * Informazioni progressivo per visualizzazione UI
 */
export interface ProgressivoDisplay {
  identificativo: string;
  anno: number;
  progressivo: number;
}
