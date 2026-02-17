import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import type { ConvertitoreDualResult } from '../../types/convertitore.types';

interface ConvertitoreResultDualProps {
  result: ConvertitoreDualResult;
  onReset?: () => void;
}

/**
 * Componente per mostrare risultati generazione doppio file IRMEQS
 * Mostra dettagli di entrambi i file generati (2500-5000 e >5000)
 */
export function ConvertitoreResultDual({ result, onReset }: ConvertitoreResultDualProps) {
  const { file1, file2, totaleRecordProcessati, recordEsclusi } = result;
  const fileGenerati = [file1, file2].filter(f => f !== null).length;

  return (
    <div className="mt-4">
      {/* Success Header */}
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
            <Alert.Heading as="h4" className="h5 mb-2">
              File IRMEQS generati con successo!
            </Alert.Heading>
            <p className="small mb-0">
              {fileGenerati === 2 ? 'Entrambi i file sono stati' : 'Un file è stato'} scaricati automaticamente.
              Controlla la cartella Download del tuo browser.
            </p>
          </div>
        </div>
      </Alert>

      {/* Riepilogo Totale */}
      <Alert variant="info" className="mb-3">
        <div className="small">
          <div className="d-flex justify-content-between py-1">
            <span className="fw-medium">Record processati:</span>
            <span className="font-monospace">{totaleRecordProcessati}</span>
          </div>
          <div className="d-flex justify-content-between py-1">
            <span className="fw-medium">File generati:</span>
            <span className="font-monospace">{fileGenerati}</span>
          </div>
          {recordEsclusi > 0 && (
            <div className="d-flex justify-content-between py-1 text-warning">
              <span className="fw-medium">Record esclusi (netto ≤ 2500€):</span>
              <span className="font-monospace">{recordEsclusi}</span>
            </div>
          )}
        </div>
      </Alert>

      {/* File Details */}
      <Row className="g-3">
        {/* File 1: 2500-5000 */}
        {file1 && (
          <Col md={fileGenerati === 2 ? 6 : 12}>
            <Alert variant="light" className="border h-100 mb-0">
              <div className="mb-2">
                <span className="badge bg-primary mb-2">File 1: Netti 2500-5000€</span>
              </div>
              <div className="small">
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Nome file:</span>
                  <code className="text-primary">{file1.fileName}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Identificativo:</span>
                  <code className="text-muted">{file1.identificativo}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Progressivo:</span>
                  <code className="text-muted">{file1.progressivo}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Record totali:</span>
                  <code className="text-muted">{file1.numeroRecord}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Record dati (RMD):</span>
                  <code className="text-muted">{file1.numeroRecordDati}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Flag pos. 65:</span>
                  <code className="text-muted bg-light px-2 py-1 rounded">"1"</code>
                </div>
              </div>
            </Alert>
          </Col>
        )}

        {/* File 2: >5000 */}
        {file2 && (
          <Col md={fileGenerati === 2 ? 6 : 12}>
            <Alert variant="light" className="border h-100 mb-0">
              <div className="mb-2">
                <span className="badge bg-success mb-2">File 2: Netti {'>'} 5000€</span>
              </div>
              <div className="small">
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Nome file:</span>
                  <code className="text-success">{file2.fileName}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Identificativo:</span>
                  <code className="text-muted">{file2.identificativo}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Progressivo:</span>
                  <code className="text-muted">{file2.progressivo}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Record totali:</span>
                  <code className="text-muted">{file2.numeroRecord}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Record dati (RMD):</span>
                  <code className="text-muted">{file2.numeroRecordDati}</code>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="fw-medium">Flag pos. 65:</span>
                  <code className="text-muted bg-light px-2 py-1 rounded">" " (spazio)</code>
                </div>
              </div>
            </Alert>
          </Col>
        )}
      </Row>

      {/* Nessun file generato */}
      {!file1 && !file2 && (
        <Alert variant="warning" className="mb-3">
          <div className="small">
            <p className="fw-medium mb-1">Nessun file generato</p>
            <p className="mb-0">
              Tutti i record hanno importi netti ≤ 2500€ e sono stati esclusi.
              Verifica i dati nel CSV caricato.
            </p>
          </div>
        </Alert>
      )}

      {/* Reset Button */}
      {onReset && (
        <Button
          variant="primary"
          onClick={onReset}
          className="w-100 mt-3 py-3"
        >
          Genera altri file
        </Button>
      )}
    </div>
  );
}
