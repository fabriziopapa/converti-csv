import { useState } from 'react';
import type { FormEvent } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Card principale */}
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <Card.Title as="h2" className="mb-3">
            HRSuite - Elaborazione Compensi
          </Card.Title>

          <Card.Text className="text-muted mb-4">
            Unisci due file CSV (Anagrafico + Compensi) per generare un file CSV
            nel formato richiesto da HRSuite con calcolo scorporo contributivo.
          </Card.Text>

          {!result && (
            <Form onSubmit={handleSubmit}>
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
              <Row className="mb-4">
                {/* Identificativo Provvedimento */}
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Identificativo Provvedimento
                      <span className="text-muted fw-normal ms-1">(opzionale)</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="identificativoProvvedimento"
                      value={formValues.identificativoProvvedimento}
                      onChange={handleChange}
                      disabled={isProcessing}
                      placeholder="Es. PROV2025001"
                    />
                  </Form.Group>
                </Col>

                {/* Anno Competenza */}
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Anno Competenza *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="annoCompetenza"
                      value={formValues.annoCompetenza}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      min="2000"
                      max="2100"
                    />
                  </Form.Group>
                </Col>

                {/* Mese Competenza */}
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Mese Competenza *
                      <span className="text-muted fw-normal ms-1">(01-12)</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="meseCompetenza"
                      value={formValues.meseCompetenza}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      pattern="(0[1-9]|1[0-2])"
                      maxLength={2}
                      placeholder="Es. 01"
                    />
                  </Form.Group>
                </Col>

                {/* Codice Voce */}
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Codice Voce *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceVoce"
                      value={formValues.codiceVoce}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      placeholder="Es. 0001"
                    />
                  </Form.Group>
                </Col>

                {/* Codice Capitolo */}
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Codice Capitolo *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceCapitolo"
                      value={formValues.codiceCapitolo}
                      onChange={handleChange}
                      required
                      disabled={isProcessing}
                      placeholder="Es. 1234"
                    />
                  </Form.Group>
                </Col>

                {/* Centro di Costo */}
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Centro di Costo
                      <span className="text-muted fw-normal ms-1">(opzionale)</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceCentroDiCosto"
                      value={formValues.codiceCentroDiCosto}
                      onChange={handleChange}
                      disabled={isProcessing}
                    />
                  </Form.Group>
                </Col>

                {/* Riferimento */}
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Riferimento
                      <span className="text-muted fw-normal ms-1">(opzionale)</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="riferimento"
                      value={formValues.riferimento}
                      onChange={handleChange}
                      disabled={isProcessing}
                      placeholder="Verrà formattato come TL@testo@"
                    />
                  </Form.Group>
                </Col>

                {/* Note */}
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="small fw-medium">
                      Note
                      <span className="text-muted fw-normal ms-1">(opzionale)</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="note"
                      value={formValues.note}
                      onChange={handleChange}
                      disabled={isProcessing}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className="mb-4">
                  <div className="d-flex align-items-start">
                    <svg
                      width="20"
                      height="20"
                      className="text-danger me-2 flex-shrink-0 mt-1"
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
                    <div className="small">
                      <p className="fw-medium mb-1">Errore</p>
                      <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{error}</p>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                disabled={!anagraficFile || !compensiFile || isProcessing}
                className="w-100 py-3"
              >
                {isProcessing ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Generazione in corso...
                  </>
                ) : (
                  'Genera File HRSuite'
                )}
              </Button>
            </Form>
          )}

          {/* Result */}
          {result && (
            <HRSuiteResultComponent
              result={result}
              onReset={handleReset}
            />
          )}
        </Card.Body>
      </Card>

      {/* Info aggiuntive */}
      <Card className="mt-4 bg-light">
        <Card.Body>
          <h3 className="h6 fw-semibold text-dark mb-3">
            ℹ️ Formato CSV richiesto
          </h3>
          <div className="small text-muted">
            <div className="mb-3">
              <span className="fw-medium text-dark">CSV Anagrafico:</span>
              <ul className="mb-0 mt-1 ps-4">
                <li>Colonne: <code className="px-1 bg-white rounded">NOMINATIVO</code>, <code className="px-1 bg-white rounded">MATRICOLA</code>, <code className="px-1 bg-white rounded">RUOLO</code></li>
                <li>Delimitatore: <code className="px-1 bg-white rounded">;</code></li>
              </ul>
            </div>
            <div>
              <span className="fw-medium text-dark">CSV Compensi:</span>
              <ul className="mb-0 mt-1 ps-4">
                <li>Colonne: <code className="px-1 bg-white rounded">nominativo</code>, <code className="px-1 bg-white rounded">importo</code>, <code className="px-1 bg-white rounded">parti</code> (opzionale)</li>
                <li>Delimitatore: <code className="px-1 bg-white rounded">;</code></li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
