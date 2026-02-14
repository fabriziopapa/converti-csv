import { Alert, Badge, Accordion } from 'react-bootstrap';
import type { EpuraResult } from '../../types/epura.types';

interface EpuraResultProps {
  result: EpuraResult;
  onReset: () => void;
}

/**
 * Componente per visualizzare il risultato dell'epurazione CSV
 */
export function EpuraResult({ result, onReset }: EpuraResultProps) {
  return (
    <div className="result-section">
      <Alert variant="success">
        <Alert.Heading>
          <i className="bi bi-check-circle-fill me-2"></i>
          File Epurato Generato con Successo!
        </Alert.Heading>

        <hr />

        <div className="mb-3">
          <strong>File Originale:</strong> {result.fileName}
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <div className="text-center p-3 bg-light rounded">
              <div className="fs-4 fw-bold text-primary">{result.originalRows}</div>
              <small className="text-muted">Righe Originali</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-3 bg-light rounded">
              <div className="fs-4 fw-bold text-danger">{result.removedRows}</div>
              <small className="text-muted">Righe Rimosse</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center p-3 bg-light rounded">
              <div className="fs-4 fw-bold text-success">{result.filteredRows}</div>
              <small className="text-muted">Righe Finali</small>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <strong>Codici Fiscali Rimossi:</strong>{' '}
          <Badge bg="danger">{result.removedCF.length}</Badge>
        </div>

        <Accordion className="mb-3">
          {/* CF da file IRMEQS */}
          {result.cfFromIRMEQS.length > 0 && (
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <i className="bi bi-file-earmark-text me-2"></i>
                CF da File IRMEQS ({result.cfFromIRMEQS.length})
              </Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled mb-0" style={{ columnCount: 2, fontSize: '0.9rem' }}>
                  {result.cfFromIRMEQS.map((cf, index) => (
                    <li key={index} style={{ fontFamily: 'monospace' }}>
                      <i className="bi bi-arrow-right-short text-primary"></i>
                      {cf}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {/* CF manuali */}
          {result.cfFromManual.length > 0 && (
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <i className="bi bi-pencil-square me-2"></i>
                CF Inseriti Manualmente ({result.cfFromManual.length})
              </Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled mb-0" style={{ columnCount: 2, fontSize: '0.9rem' }}>
                  {result.cfFromManual.map((cf, index) => (
                    <li key={index} style={{ fontFamily: 'monospace' }}>
                      <i className="bi bi-arrow-right-short text-success"></i>
                      {cf}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {/* CF rimossi dal CSV */}
          {result.removedCF.length > 0 && (
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <i className="bi bi-trash me-2"></i>
                CF Trovati e Rimossi dal CSV ({result.removedCF.length})
              </Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled mb-0" style={{ columnCount: 2, fontSize: '0.9rem' }}>
                  {result.removedCF.map((cf, index) => (
                    <li key={index} style={{ fontFamily: 'monospace' }}>
                      <i className="bi bi-x-circle text-danger"></i>
                      {cf}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {/* CF non validi */}
          {result.invalidCF.length > 0 && (
            <Accordion.Item eventKey="3">
              <Accordion.Header>
                <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                CF Non Validi Ignorati ({result.invalidCF.length})
              </Accordion.Header>
              <Accordion.Body>
                <Alert variant="warning" className="mb-2">
                  <small>I seguenti codici fiscali non sono validi (formato errato) e sono stati ignorati:</small>
                </Alert>
                <ul className="list-unstyled mb-0" style={{ fontSize: '0.9rem' }}>
                  {result.invalidCF.map((cf, index) => (
                    <li key={index} style={{ fontFamily: 'monospace' }}>
                      <i className="bi bi-x text-warning"></i>
                      {cf}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>

        <div className="alert alert-info mb-3">
          <i className="bi bi-info-circle me-2"></i>
          <small>
            Il file epurato <code>{result.fileName.replace(/\.csv$/i, '_epurato.csv')}</code> è stato scaricato automaticamente.
            Puoi caricarlo nella sezione <strong>Convertitore CSV</strong> per generare il file TXT.
          </small>
        </div>

        <button className="btn btn-primary" onClick={onReset}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Nuova Epurazione
        </button>
      </Alert>
    </div>
  );
}
