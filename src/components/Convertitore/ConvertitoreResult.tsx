import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
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
    <Alert variant="success" className="mt-4 mb-0">
      {/* Success Icon + Title */}
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
            File generato con successo!
          </Alert.Heading>

          {/* Details */}
          <div className="small mb-3">
            <div className="d-flex justify-content-between py-1">
              <span className="fw-medium">Nome file:</span>
              <code className="text-success">{result.fileName}</code>
            </div>

            <div className="d-flex justify-content-between py-1">
              <span className="fw-medium">Identificativo:</span>
              <code className="text-success">{result.identificativo}</code>
            </div>

            <div className="d-flex justify-content-between py-1">
              <span className="fw-medium">Progressivo:</span>
              <code className="text-success">{result.progressivo}</code>
            </div>

            <div className="d-flex justify-content-between py-1">
              <span className="fw-medium">Record generati:</span>
              <code className="text-success">{result.numeroRecord}</code>
            </div>
          </div>

          {/* Info Message */}
          <div className="small text-success-emphasis mb-3">
            <p className="mb-0">
              📥 Il file è stato scaricato automaticamente.
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
  );
}
