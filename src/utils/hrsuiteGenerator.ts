import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { getUltimoGiornoMese } from './dateUtils';
import { parseImportoItaliano } from './stringUtils';
import type { CSVRow } from '../types/convertitore.types';
import type {
  HRSuiteConfig,
  HRSuiteResult,
  HRSuiteOutputRow
} from '../types/hrsuite.types';

/**
 * hrsuiteGenerator.ts - Logica HRSuite per elaborazione compensi
 *
 * Python equivalente: hrsuite.py righe 74-195
 *
 * Funzionalità:
 * - Join tra CSV Anagrafico e CSV Compensi
 * - Calcolo scorporo contributivo (RD: /1.3431, altri: /1.3270)
 * - Generazione CSV output 23 colonne HRSuite
 * - Data competenza = ultimo giorno del mese
 */

/**
 * Coefficienti scorporo contributivo
 * Python: righe 156-159 hrsuite.py
 */
const COEFFICIENTI_SCORPORO = {
  RD: 1.3431,  // Dirigenti
  ALTRI: 1.3270 // Altri ruoli
} as const;

/**
 * Valori default provvedimento (se identificativoProvvedimento vuoto)
 * Python: righe 170-173 hrsuite.py
 */
const PROVVEDIMENTI_DEFAULT = {
  tipoProvvedimento: '029',
  numeroProvvedimento: '61947',
  dataProvvedimento: '09/05/2025'
} as const;

/**
 * Genera output HRSuite unendo 2 CSV e applicando calcoli
 *
 * @param anagraficFile - File CSV Anagrafico (NOMINATIVO, MATRICOLA, RUOLO)
 * @param compensiFile - File CSV Compensi (nominativo, importo, parti)
 * @param config - Configurazione form HRSuite
 * @returns Promise con risultato operazione
 */
export async function generaOutputHRSuite(
  anagraficFile: File,
  compensiFile: File,
  config: HRSuiteConfig
): Promise<HRSuiteResult> {
  console.log('[hrsuiteGenerator] Inizio elaborazione HRSuite');

  // 1. Parse CSV Anagrafico
  const anagraficData = await parseCSVFile(anagraficFile);
  console.log(`[hrsuiteGenerator] Anagrafico: ${anagraficData.length} righe`);

  // 2. Crea Map anagrafico (chiave: NOMINATIVO uppercase)
  const anagraficMap = new Map<string, CSVRow>();

  for (const row of anagraficData) {
    const nominativo = (row.NOMINATIVO || '').toUpperCase().trim();

    if (nominativo) {
      anagraficMap.set(nominativo, row);
    }
  }

  console.log(`[hrsuiteGenerator] Map anagrafico: ${anagraficMap.size} voci`);

  // 3. Parse CSV Compensi
  const compensiData = await parseCSVFile(compensiFile);
  console.log(`[hrsuiteGenerator] Compensi: ${compensiData.length} righe`);

  // 4. Calcola data competenza (ultimo giorno del mese)
  const dataCompetenzaVoce = getUltimoGiornoMese(
    parseInt(config.annoCompetenza),
    parseInt(config.meseCompetenza)
  );

  // 5. Genera righe output
  const outputRows: HRSuiteOutputRow[] = [];
  const nominativiNonTrovati = new Set<string>();
  let rowsSkipped = 0;

  for (const compensoRow of compensiData) {
    const nominativo = (compensoRow.nominativo || '').toUpperCase().trim();

    if (!nominativo) {
      console.warn('[hrsuiteGenerator] Riga senza nominativo, skip');
      rowsSkipped++;
      continue;
    }

    // Cerca anagrafico
    const anagrafico = anagraficMap.get(nominativo);

    if (!anagrafico) {
      console.warn(`[hrsuiteGenerator] Nominativo non trovato: ${nominativo}`);
      nominativiNonTrovati.add(nominativo);
      rowsSkipped++;
      continue;
    }

    // Estrai dati anagrafico
    const matricola = (anagrafico.MATRICOLA || '').padStart(6, '0');
    const ruolo = anagrafico.RUOLO || 'ND';

    // Calcola importo (con eventuale scorporo)
    const importoRaw = compensoRow.importo || '0';
    let importo = parseImportoItaliano(importoRaw);

    if (config.scorporoEnabled) {
      // Applica scorporo contributivo
      const coeff = ruolo === 'RD'
        ? COEFFICIENTI_SCORPORO.RD
        : COEFFICIENTI_SCORPORO.ALTRI;

      importo = importo / coeff;

      console.log(
        `[hrsuiteGenerator] Scorporo ${nominativo}: ${importoRaw} → ${importo.toFixed(2)} (coeff: ${coeff})`
      );
    }

    const importoStr = importo.toFixed(2).replace('.', ',');

    // Parti (default: 1)
    const parti = compensoRow.parti || '1';

    // Riferimento formattato
    const riferimento = config.riferimento
      ? `TL@${config.riferimento}@`
      : '';

    // Provvedimento (se identificativoProvvedimento vuoto → usa default)
    const hasIdentificativo = config.identificativoProvvedimento.trim() !== '';

    const tipoProvv = hasIdentificativo
      ? ''
      : PROVVEDIMENTI_DEFAULT.tipoProvvedimento;

    const numProvv = hasIdentificativo
      ? ''
      : PROVVEDIMENTI_DEFAULT.numeroProvvedimento;

    const dataProvv = hasIdentificativo
      ? ''
      : PROVVEDIMENTI_DEFAULT.dataProvvedimento;

    // Costruisci riga output (23 colonne)
    const outputRow: HRSuiteOutputRow = {
      matricola,
      comparto: '1',
      ruolo,
      codiceVoce: config.codiceVoce,
      identificativoProvvedimento: config.identificativoProvvedimento,
      tipoProvvedimento: tipoProvv,
      numeroProvvedimento: numProvv,
      dataProvvedimento: dataProvv,
      annoCompetenzaLiquidazione: config.annoCompetenza,
      meseCompetenzaLiquidazione: config.meseCompetenza,
      dataCompetenzaVoce,
      codiceStatoVoce: 'E',
      aliquota: '0',
      parti,
      importo: importoStr,
      codiceDivisa: 'E',
      codiceEnte: '000000',
      codiceCapitolo: config.codiceCapitolo,
      codiceCentroDiCosto: config.codiceCentroDiCosto,
      riferimento,
      codiceRiferimentoVoce: '',
      flagAdempimenti: '',
      idContrattoCSA: '',
      nota: config.note
    };

    outputRows.push(outputRow);
  }

  console.log(`[hrsuiteGenerator] Righe output generate: ${outputRows.length}`);
  console.log(`[hrsuiteGenerator] Righe skippate: ${rowsSkipped}`);

  // 6. Genera CSV con PapaParse
  const csv = Papa.unparse(outputRows, {
    delimiter: ';',
    header: true,
    columns: [
      'matricola',
      'comparto',
      'ruolo',
      'codiceVoce',
      'identificativoProvvedimento',
      'tipoProvvedimento',
      'numeroProvvedimento',
      'dataProvvedimento',
      'annoCompetenzaLiquidazione',
      'meseCompetenzaLiquidazione',
      'dataCompetenzaVoce',
      'codiceStatoVoce',
      'aliquota',
      'parti',
      'importo',
      'codiceDivisa',
      'codiceEnte',
      'codiceCapitolo',
      'codiceCentroDiCosto',
      'riferimento',
      'codiceRiferimentoVoce',
      'flagAdempimenti',
      'idContrattoCSA',
      'nota'
    ]
  });

  // 7. Download CSV
  const fileName = `hrsuite_output_${Date.now()}.csv`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });

  saveAs(blob, fileName);

  console.log(`[hrsuiteGenerator] ✓ File generato: ${fileName}`);

  return {
    fileName,
    rowsProcessed: outputRows.length,
    rowsSkipped,
    nominativiNonTrovati: Array.from(nominativiNonTrovati)
  };
}

/**
 * Helper: Parse CSV file generico
 */
async function parseCSVFile(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,

      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn(
            `[hrsuiteGenerator] ${results.errors.length} errori parsing ${file.name}`
          );
        }

        resolve(results.data);
      },

      error: (error) => {
        console.error(`[hrsuiteGenerator] Errore parsing ${file.name}:`, error);
        reject(new Error(`Errore parsing ${file.name}: ${error.message}`));
      }
    });
  });
}
