import { useState } from 'react';
import type { FormEvent } from 'react';
import { FileUpload } from './FileUpload';
import { ConvertitoreResult } from './ConvertitoreResult';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import { useProgressivo } from '../../hooks/useProgressivo';
import { parseCSV, validateCSVColumns } from '../../utils/csvParser';
import { generaFileTXT } from '../../utils/fileGenerator';
import type { ConvertitoreResult as ConvertitoreResultType } from '../../types/convertitore.types';

/**
 * Form principale per il Convertitore CSV → TXT
 *
 * Funzionalità:
 * - Upload CSV
 * - Validazione colonne (COD_FIS, NETTO)
 * - Generazione file TXT con record a lunghezza fissa
 * - Download automatico
 * - Mostra progressivo corrente
 */
export function ConvertitoreForm() {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Custom hooks
  const { isProcessing, result, error, processFile, reset } =
    useFileProcessor<ConvertitoreResultType>();
  const { progressivo } = useProgressivo();

  // Handler submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!csvFile) {
      alert('Seleziona un file CSV');
      return;
    }

    await processFile(async () => {
      console.log('[ConvertitoreForm] Inizio processing...');

      // 1. Parse CSV
      const parsed = await parseCSV(csvFile);

      if (parsed.errors.length > 0) {
        throw new Error(`Errori nel parsing CSV: ${parsed.errors.join(', ')}`);
      }

      if (parsed.data.length === 0) {
        throw new Error('Il file CSV è vuoto');
      }

      // 2. Valida colonne obbligatorie
      const validation = validateCSVColumns(parsed.data, ['COD_FIS', 'NETTO']);

      if (!validation.valid) {
        throw new Error(
          `Colonne mancanti nel CSV: ${validation.missing.join(', ')}\n\n` +
          `Colonne richieste: COD_FIS, NETTO`
        );
      }

      // 3. Genera file TXT
      return generaFileTXT(parsed.data, new Date());
    });
  };

  // Reset per generare nuovo file
  const handleReset = () => {
    setCsvFile(null);
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card principale */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Convertitore CSV → TXT
        </h2>

        <p className="text-gray-600 mb-6">
          Carica un file CSV con le colonne <code className="px-2 py-1 bg-gray-100 rounded">COD_FIS</code>
          {' '}e <code className="px-2 py-1 bg-gray-100 rounded">NETTO</code> per generare
          un file TXT a lunghezza fissa (300 byte/record) per l'Agenzia delle Entrate.
        </p>

        {/* Progressivo corrente */}
        {progressivo && !result && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-sm text-blue-800">
              <svg
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <span className="font-medium">Progressivo corrente:</span>
                <span className="ml-2 font-mono">{progressivo.anno}/{progressivo.progressivo}</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!result && (
          <form onSubmit={handleSubmit}>
            {/* File Upload */}
            <FileUpload
              onFileSelect={setCsvFile}
              disabled={isProcessing}
            />

            {/* File selezionato */}
            {csvFile && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">File selezionato:</span>
                  <span className="ml-2 font-mono">{csvFile.name}</span>
                  <span className="ml-2 text-gray-500">
                    ({(csvFile.size / 1024).toFixed(1)} KB)
                  </span>
                </p>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">Errore</p>
                    <p className="whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!csvFile || isProcessing}
              className={`
                w-full py-3 px-6 rounded-lg font-semibold text-white
                transition-all duration-200
                ${!csvFile || isProcessing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }
              `}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generazione in corso...
                </span>
              ) : (
                'Genera File TXT'
              )}
            </button>
          </form>
        )}

        {/* Result */}
        {result && (
          <ConvertitoreResult
            result={result}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Info aggiuntive */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          ℹ️ Formato CSV richiesto
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Delimitatore: <code className="px-1 bg-gray-200 rounded">;</code> (punto e virgola)</li>
          <li>• Colonne obbligatorie: <code className="px-1 bg-gray-200 rounded">COD_FIS</code>, <code className="px-1 bg-gray-200 rounded">NETTO</code></li>
          <li>• Prima riga: intestazione colonne</li>
          <li>• Formato importi: <code className="px-1 bg-gray-200 rounded">1234,56</code> o <code className="px-1 bg-gray-200 rounded">1234.56</code></li>
        </ul>
      </div>
    </div>
  );
}
