import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
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
    <div className="mt-4">
      {/* Success Card */}
      <Alert variant="success" className="mb-3">
        <div className="d-flex align-items-start">
          <div className="flex-shrink-0">
            <svg
              width="24"
              height="24"
              className="text-success"
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

          <div className="ms-3 flex-grow-1">
            <Alert.Heading as="h4" className="h5 mb-3">
              File HRSuite generato con successo!
            </Alert.Heading>

            {/* Details */}
            <div className="small mb-3">
              <div className="d-flex justify-content-between py-1">
                <span className="fw-medium">Nome file:</span>
                <code className="text-success">{result.fileName}</code>
              </div>

              <div className="d-flex justify-content-between py-1">
                <span className="fw-medium">Righe processate:</span>
                <code className="text-success">{result.rowsProcessed}</code>
              </div>

              {result.rowsSkipped > 0 && (
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Righe skippate:</span>
                  <code className="text-warning">{result.rowsSkipped}</code>
                </div>
              )}
            </div>

            {/* Info Message */}
            <div className="small text-success-emphasis mb-3">
              <p className="mb-0">
                📥 Il file CSV è stato scaricato automaticamente.
                <br />
                Controlla la cartella Download del tuo browser.
              </p>
            </div>

            {/* Reset Button */}
            {onReset && (
              <Button
                variant="success"
                onClick={onReset}
                className="w-100"
              >
                Genera un altro file
              </Button>
            )}
          </div>
        </div>
      </Alert>

      {/* Warning Card - Nominativi non trovati */}
      {hasWarnings && (
        <Alert variant="warning" className="mb-0">
          <div className="d-flex align-items-start">
            <div className="flex-shrink-0">
              <svg
                width="24"
                height="24"
                className="text-warning"
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

            <div className="ms-3 flex-grow-1">
              <Alert.Heading as="h4" className="h5 mb-2">
                Attenzione: Alcuni nominativi non trovati
              </Alert.Heading>

              <p className="small mb-3">
                I seguenti nominativi presenti nel CSV Compensi <strong>non sono stati trovati</strong> nel CSV Anagrafico
                e quindi sono stati esclusi dal file generato:
              </p>

              <div
                className="small bg-warning bg-opacity-25 rounded p-3 mb-3"
                style={{ maxHeight: '160px', overflowY: 'auto' }}
              >
                <ul className="mb-0 ps-3">
                  {result.nominativiNonTrovati.map((nominativo, index) => (
                    <li key={index} className="font-monospace mb-1">
                      {nominativo}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mb-0 text-warning-emphasis" style={{ fontSize: '0.75rem' }}>
                💡 Verifica che i nominativi siano scritti esattamente allo stesso modo in entrambi i CSV
                (attenzione a spazi, maiuscole/minuscole, caratteri speciali).
              </p>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}
