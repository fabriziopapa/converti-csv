import { useState } from 'react';
import type { FormEvent } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { FileUpload } from './FileUpload';
import { ConvertitoreResultDual } from './ConvertitoreResultDual';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import { useProgressivo } from '../../hooks/useProgressivo';
import { parseCSV, validateCSVColumns } from '../../utils/csvParser';
import { generaDueFileTXT } from '../../utils/fileGenerator';
import type { ConvertitoreDualResult } from '../../types/convertitore.types';

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
    useFileProcessor<ConvertitoreDualResult>();
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

      // 3. Genera DUE file IRMEQS (filtrati per importo)
      return generaDueFileTXT(parsed.data, new Date());
    });
  };

  // Reset per generare nuovo file
  const handleReset = () => {
    setCsvFile(null);
    reset();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Card principale */}
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <Card.Title as="h2" className="mb-3">
            Convertitore CSV → IRMEQS
          </Card.Title>

          <Card.Text className="text-muted mb-4">
            Carica un file CSV con le colonne <code className="px-2 py-1 bg-light rounded">COD_FIS</code>
            {' '}e <code className="px-2 py-1 bg-light rounded">NETTO</code> per generare
            {' '}<strong>due file IRMEQS</strong> separati per fascia di importo (300 byte/record).
          </Card.Text>

          {/* Progressivo corrente */}
          {progressivo && !result && (
            <Alert variant="info" className="mb-4">
              <div className="d-flex align-items-center small">
                <svg
                  width="20"
                  height="20"
                  className="text-info me-2 flex-shrink-0"
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
                  <span className="fw-medium">Progressivo corrente:</span>
                  <span className="ms-2 font-monospace">{progressivo.anno}/{progressivo.progressivo}</span>
                </div>
              </div>
            </Alert>
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
                <div className="mb-4 p-3 bg-light rounded">
                  <p className="small mb-0 text-dark">
                    <span className="fw-medium">File selezionato:</span>
                    <span className="ms-2 font-monospace">{csvFile.name}</span>
                    <span className="ms-2 text-muted">
                      ({(csvFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </p>
                </div>
              )}

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
                disabled={!csvFile || isProcessing}
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
                  'Genera File IRMEQS'
                )}
              </Button>
            </form>
          )}

          {/* Result */}
          {result && (
            <ConvertitoreResultDual
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
          <ul className="small text-muted mb-0" style={{ listStyle: 'none', paddingLeft: 0 }}>
            <li className="mb-1">• Delimitatore: <code className="px-1 bg-white rounded">;</code> (punto e virgola)</li>
            <li className="mb-1">• Colonne obbligatorie: <code className="px-1 bg-white rounded">COD_FIS</code>, <code className="px-1 bg-white rounded">NETTO</code></li>
            <li className="mb-1">• Prima riga: intestazione colonne</li>
            <li className="mb-0">• Formato importi: <code className="px-1 bg-white rounded">1234,56</code> o <code className="px-1 bg-white rounded">1234.56</code></li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
}
