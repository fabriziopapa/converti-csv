/**
 * Configurazione HRSuite con tutti i campi del form
 */
export interface HRSuiteConfig {
  // Flag scorporo contributivo
  scorporoEnabled: boolean;

  // Campi form (da hrsuite.py)
  identificativoProvvedimento: string;
  annoCompetenza: string;
  meseCompetenza: string;
  codiceVoce: string;
  codiceCapitolo: string;
  codiceCentroDiCosto: string;
  riferimento: string;
  note: string;
}

/**
 * Risultato generazione HRSuite
 */
export interface HRSuiteResult {
  fileName: string;
  rowsProcessed: number;
  rowsSkipped: number;
  nominativiNonTrovati: string[];
}

/**
 * Riga output HRSuite (23 colonne)
 */
export interface HRSuiteOutputRow {
  matricola: string;
  comparto: string;
  ruolo: string;
  codiceVoce: string;
  identificativoProvvedimento: string;
  tipoProvvedimento: string;
  numeroProvvedimento: string;
  dataProvvedimento: string;
  annoCompetenzaLiquidazione: string;
  meseCompetenzaLiquidazione: string;
  dataCompetenzaVoce: string;
  codiceStatoVoce: string;
  aliquota: string;
  parti: string;
  importo: string;
  codiceDivisa: string;
  codiceEnte: string;
  codiceCapitolo: string;
  codiceCentroDiCosto: string;
  riferimento: string;
  codiceRiferimentoVoce: string;
  flagAdempimenti: string;
  idContrattoCSA: string;
  nota: string;
}

/**
 * Dati anagrafico da CSV
 */
export interface AnagraficRow {
  NOMINATIVO: string;
  MATRICOLA: string;
  RUOLO: string;
  [key: string]: string;
}

/**
 * Dati compensi da CSV
 */
export interface CompensiRow {
  nominativo: string;
  importo?: string;
  parti?: string;
  [key: string]: string | undefined;
}
