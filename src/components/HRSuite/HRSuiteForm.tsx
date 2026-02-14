import { useState } from 'react';
import type { FormEvent } from 'react';
import { DualFileUpload } from './DualFileUpload';
import { ScorporoToggle } from './ScorporoToggle';
import { HRSuiteResultComponent } from './HRSuiteResult';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import { generaOutputHRSuite } from '../../utils/hrsuiteGenerator';
import { getAnnoCorrente, getMeseCorrente } from '../../utils/dateUtils';
import type { HRSuiteResult } from '../../types/hrsuite.types';

/**
 * Form principale HRSuite
 *
 * Funzionalità:
 * - Upload 2 CSV (Anagrafico + Compensi)
 * - Toggle scorporo contributivo
 * - Form con 8 campi configurazione
 * - Join CSV e generazione output HRSuite
 */
export function HRSuiteForm() {
  // File uploads
  const [anagraficFile, setAnagraficFile] = useState<File | null>(null);
  const [compensiFile, setCompensiFile] = useState<File | null>(null);

  // Scorporo contributivo
  const [scorporoEnabled, setScorporoEnabled] = useState(true);

  // Form values
  const [formValues, setFormValues] = useState({
    identificativoProvvedimento: '',
    annoCompetenza: getAnnoCorrente().toString(),
    meseCompetenza: getMeseCorrente(),
    codiceVoce: '',
    codiceCapitolo: '',
    codiceCentroDiCosto: '',
    riferimento: '',
    note: ''
  });

  // Processing state
  const { isProcessing, result, error, processFile, reset } =
    useFileProcessor<HRSuiteResult>();

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!anagraficFile || !compensiFile) {
      alert('Seleziona entrambi i file CSV');
      return;
    }

    // Validazione mese (01-12)
    const mese = parseInt(formValues.meseCompetenza);
    if (isNaN(mese) || mese < 1 || mese > 12) {
      alert('Mese non valido. Inserisci un valore tra 01 e 12');
      return;
    }

    await processFile(async () => {
      console.log('[HRSuiteForm] Inizio processing...');

      return generaOutputHRSuite(anagraficFile, compensiFile, {
        scorporoEnabled,
        ...formValues
      });
    });
  };

  // Reset form
  const handleReset = () => {
    setAnagraficFile(null);
    setCompensiFile(null);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Card principale */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          HRSuite - Elaborazione Compensi
        </h2>

        <p className="text-gray-600 mb-6">
          Unisci due file CSV (Anagrafico + Compensi) per generare un file CSV
          nel formato richiesto da HRSuite con calcolo scorporo contributivo.
        </p>

        {!result && (
          <form onSubmit={handleSubmit}>
            {/* Dual File Upload */}
            <DualFileUpload
              anagraficFile={anagraficFile}
              compensiFile={compensiFile}
              onAnagraficSelect={setAnagraficFile}
              onCompensiSelect={setCompensiFile}
              disabled={isProcessing}
            />

            {/* Scorporo Toggle */}
            <ScorporoToggle
              enabled={scorporoEnabled}
              onChange={setScorporoEnabled}
              disabled={isProcessing}
            />

            {/* Form Fields - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Identificativo Provvedimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identificativo Provvedimento
                  <span className="text-gray-500 font-normal ml-1">(opzionale)</span>
                </label>
                <input
                  type="text"
                  name="identificativoProvvedimento"
                  value={formValues.identificativoProvvedimento}
                  onChange={handleChange}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Es. PROV2025001"
                />
              </div>

              {/* Anno Competenza */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anno Competenza *
                </label>
                <input
                  type="number"
                  name="annoCompetenza"
                  value={formValues.annoCompetenza}
                  onChange={handleChange}
                  required
                  disabled={isProcessing}
                  min="2000"
                  max="2100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Mese Competenza */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mese Competenza *
                  <span className="text-gray-500 font-normal ml-1">(01-12)</span>
                </label>
                <input
                  type="text"
                  name="meseCompetenza"
                  value={formValues.meseCompetenza}
                  onChange={handleChange}
                  required
                  disabled={isProcessing}
                  pattern="(0[1-9]|1[0-2])"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Es. 01"
                />
              </div>

              {/* Codice Voce */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Codice Voce *
                </label>
                <input
                  type="text"
                  name="codiceVoce"
                  value={formValues.codiceVoce}
                  onChange={handleChange}
                  required
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Es. 0001"
                />
              </div>

              {/* Codice Capitolo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Codice Capitolo *
                </label>
                <input
                  type="text"
                  name="codiceCapitolo"
                  value={formValues.codiceCapitolo}
                  onChange={handleChange}
                  required
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Es. 1234"
                />
              </div>

              {/* Centro di Costo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centro di Costo
                  <span className="text-gray-500 font-normal ml-1">(opzionale)</span>
                </label>
                <input
                  type="text"
                  name="codiceCentroDiCosto"
                  value={formValues.codiceCentroDiCosto}
                  onChange={handleChange}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Riferimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Riferimento
                  <span className="text-gray-500 font-normal ml-1">(opzionale)</span>
                </label>
                <input
                  type="text"
                  name="riferimento"
                  value={formValues.riferimento}
                  onChange={handleChange}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Verrà formattato come TL@testo@"
                />
              </div>

              {/* Note */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note
                  <span className="text-gray-500 font-normal ml-1">(opzionale)</span>
                </label>
                <input
                  type="text"
                  name="note"
                  value={formValues.note}
                  onChange={handleChange}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

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
              disabled={!anagraficFile || !compensiFile || isProcessing}
              className={`
                w-full py-3 px-6 rounded-lg font-semibold text-white
                transition-all duration-200
                ${!anagraficFile || !compensiFile || isProcessing
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
                'Genera File HRSuite'
              )}
            </button>
          </form>
        )}

        {/* Result */}
        {result && (
          <HRSuiteResultComponent
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
        <div className="text-sm text-gray-600 space-y-2">
          <div>
            <span className="font-medium">CSV Anagrafico:</span>
            <ul className="ml-4 mt-1">
              <li>• Colonne: <code className="px-1 bg-gray-200 rounded">NOMINATIVO</code>, <code className="px-1 bg-gray-200 rounded">MATRICOLA</code>, <code className="px-1 bg-gray-200 rounded">RUOLO</code></li>
              <li>• Delimitatore: <code className="px-1 bg-gray-200 rounded">;</code></li>
            </ul>
          </div>
          <div>
            <span className="font-medium">CSV Compensi:</span>
            <ul className="ml-4 mt-1">
              <li>• Colonne: <code className="px-1 bg-gray-200 rounded">nominativo</code>, <code className="px-1 bg-gray-200 rounded">importo</code>, <code className="px-1 bg-gray-200 rounded">parti</code> (opzionale)</li>
              <li>• Delimitatore: <code className="px-1 bg-gray-200 rounded">;</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
