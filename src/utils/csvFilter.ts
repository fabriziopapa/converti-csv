/**
 * Utility per filtrare CSV rimuovendo righe con codici fiscali specificati
 */

import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export interface FilterResult {
  fileName: string;
  originalRows: number;
  filteredRows: number;
  removedRows: number;
  removedCF: string[];
}

/**
 * Filtra un CSV rimuovendo tutte le righe che contengono
 * i codici fiscali specificati
 */
export async function filterCSVByCodiciFiscali(
  file: File,
  codiciFiscaliToRemove: string[]
): Promise<FilterResult> {
  return new Promise((resolve, reject) => {
    // Normalizza tutti i CF a maiuscolo per confronto case-insensitive
    const cfSetToRemove = new Set(codiciFiscaliToRemove.map(cf => cf.trim().toUpperCase()));
    const removedCF: string[] = [];

    Papa.parse<Record<string, string>>(file, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          const originalRows = results.data.length;

          // Verifica se esiste la colonna COD_FIS
          if (results.data.length > 0 && !('COD_FIS' in results.data[0])) {
            reject(new Error('Il CSV non contiene la colonna COD_FIS'));
            return;
          }

          // Filtra le righe
          const filteredData = results.data.filter(row => {
            const cf = (row.COD_FIS || '').trim().toUpperCase();

            // Se il CF è nella lista da rimuovere, escludilo
            if (cfSetToRemove.has(cf)) {
              if (!removedCF.includes(cf)) {
                removedCF.push(cf);
              }
              return false;
            }

            return true;
          });

          const filteredRows = filteredData.length;
          const removedRows = originalRows - filteredRows;

          resolve({
            fileName: file.name,
            originalRows,
            filteredRows,
            removedRows,
            removedCF: removedCF.sort()
          });

          // Genera il nuovo CSV
          const csv = Papa.unparse(filteredData, {
            delimiter: ';',
            header: true
          });

          // Download del file epurato
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const newFileName = file.name.replace(/\.csv$/i, '_epurato.csv');
          saveAs(blob, newFileName);

        } catch (error) {
          reject(new Error(`Errore durante il filtraggio: ${error}`));
        }
      },
      error: (error) => {
        reject(new Error(`Errore nel parsing del CSV: ${error.message}`));
      }
    });
  });
}

/**
 * Valida che il file CSV abbia la struttura corretta
 */
export async function validateCSVStructure(file: File): Promise<{
  valid: boolean;
  error?: string;
  columns?: string[];
}> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      delimiter: ';',
      preview: 1, // Leggi solo la prima riga
      encoding: 'UTF-8',
      complete: (results) => {
        if (results.data.length === 0) {
          resolve({
            valid: false,
            error: 'Il file CSV è vuoto'
          });
          return;
        }

        const columns = Object.keys(results.data[0]);

        if (!columns.includes('COD_FIS')) {
          resolve({
            valid: false,
            error: 'Il CSV non contiene la colonna COD_FIS richiesta',
            columns
          });
          return;
        }

        resolve({
          valid: true,
          columns
        });
      },
      error: (error) => {
        resolve({
          valid: false,
          error: `Errore nel parsing: ${error.message}`
        });
      }
    });
  });
}
