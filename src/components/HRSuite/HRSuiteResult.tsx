import type { HRSuiteResult } from '../../types/hrsuite.types';

interface HRSuiteResultProps {
  result: HRSuiteResult;
  onReset?: () => void;
}

/**
 * Componente per mostrare risultato generazione HRSuite
 */
export function HRSuiteResultComponent({ result, onReset }: HRSuiteResultProps) {
  const hasWarnings = result.nominativiNonTrovati.length > 0;

  return (
    <div className="mt-6 space-y-4">
      {/* Success Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="ml-3 flex-1">
            <h3 className="text-lg font-semibold text-green-800">
              File HRSuite generato con successo!
            </h3>

            {/* Details */}
            <div className="mt-4 space-y-2 text-sm text-green-700">
              <div className="flex justify-between">
                <span className="font-medium">Nome file:</span>
                <span className="font-mono">{result.fileName}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Righe processate:</span>
                <span className="font-mono">{result.rowsProcessed}</span>
              </div>

              {result.rowsSkipped > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Righe skippate:</span>
                  <span className="font-mono text-yellow-700">{result.rowsSkipped}</span>
                </div>
              )}
            </div>

            {/* Info Message */}
            <div className="mt-4 text-sm text-green-700">
              <p>
                📥 Il file CSV è stato scaricato automaticamente.
                <br />
                Controlla la cartella Download del tuo browser.
              </p>
            </div>

            {/* Reset Button */}
            {onReset && (
              <button
                onClick={onReset}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Genera un altro file
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warning Card - Nominativi non trovati */}
      {hasWarnings && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-yellow-800">
                Attenzione: Alcuni nominativi non trovati
              </h3>

              <p className="mt-2 text-sm text-yellow-700">
                I seguenti nominativi presenti nel CSV Compensi <strong>non sono stati trovati</strong> nel CSV Anagrafico
                e quindi sono stati esclusi dal file generato:
              </p>

              <ul className="mt-3 space-y-1 text-sm text-yellow-800 max-h-40 overflow-y-auto bg-yellow-100 rounded p-3">
                {result.nominativiNonTrovati.map((nominativo, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span className="font-mono">{nominativo}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-xs text-yellow-600">
                💡 Verifica che i nominativi siano scritti esattamente allo stesso modo in entrambi i CSV
                (attenzione a spazi, maiuscole/minuscole, caratteri speciali).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
