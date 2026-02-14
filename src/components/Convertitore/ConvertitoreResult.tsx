import type { ConvertitoreResult } from '../../types/convertitore.types';

interface ConvertitoreResultProps {
  result: ConvertitoreResult;
  onReset?: () => void;
}

/**
 * Componente per mostrare risultato generazione file TXT
 * Mostra identificativo, progressivo e numero record
 */
export function ConvertitoreResult({ result, onReset }: ConvertitoreResultProps) {
  return (
    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
      {/* Success Icon + Title */}
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
            File generato con successo!
          </h3>

          {/* Details */}
          <div className="mt-4 space-y-2 text-sm text-green-700">
            <div className="flex justify-between">
              <span className="font-medium">Nome file:</span>
              <span className="font-mono">{result.fileName}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Identificativo:</span>
              <span className="font-mono">{result.identificativo}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Progressivo:</span>
              <span className="font-mono">{result.progressivo}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Record generati:</span>
              <span className="font-mono">{result.numeroRecord}</span>
            </div>
          </div>

          {/* Info Message */}
          <div className="mt-4 text-sm text-green-700">
            <p>
              📥 Il file è stato scaricato automaticamente.
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
  );
}
