import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { IrmeqsFilesUpload } from './IrmeqsFilesUpload';
import { ManualCFInput } from './ManualCFInput';
import { EpuraResult } from './EpuraResult';
import { extractCodiciFiscaliFromMultipleFiles } from '../../utils/irmeqsParser';
import { parseManualCodiciFiscali } from '../../utils/irmeqsParser';
import { filterCSVByCodiciFiscali, validateCSVStructure } from '../../utils/csvFilter';
import type { EpuraResult as EpuraResultType } from '../../types/epura.types';

/**
 * Form per epurazione CSV
 * Rimuove righe con codici fiscali specificati da file IRMEQS o input manuale
 */
export function EpuraForm() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [irmeqsFiles, setIrmeqsFiles] = useState<File[]>([]);
  const [manualCFText, setManualCFText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EpuraResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCSVChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCsvFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!csvFile) {
      setError('Seleziona un file CSV');
      return;
    }

    // Verifica che ci sia almeno una fonte di CF (IRMEQS o manuali)
    if (irmeqsFiles.length === 0 && !manualCFText.trim()) {
      setError('Carica almeno un file IRMEQS o inserisci codici fiscali manualmente');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // 1. Valida struttura CSV
      const validation = await validateCSVStructure(csvFile);
      if (!validation.valid) {
        throw new Error(validation.error || 'CSV non valido');
      }

      // 2. Estrai CF dai file IRMEQS
      let cfFromIRMEQS: string[] = [];
      if (irmeqsFiles.length > 0) {
        cfFromIRMEQS = await extractCodiciFiscaliFromMultipleFiles(irmeqsFiles);
      }

      // 3. Estrai CF manuali
      const manualParsed = parseManualCodiciFiscali(manualCFText);
      const cfFromManual = manualParsed.valid;
      const invalidCF = manualParsed.invalid;

      // 4. Combina tutti i CF da rimuovere
      const allCFToRemove = [...new Set([...cfFromIRMEQS, ...cfFromManual])];

      if (allCFToRemove.length === 0) {
        throw new Error('Nessun codice fiscale valido trovato. Verifica i file IRMEQS o i codici inseriti manualmente.');
      }

      // 5. Filtra il CSV
      const filterResult = await filterCSVByCodiciFiscali(csvFile, allCFToRemove);

      // 6. Costruisci risultato completo
      setResult({
        ...filterResult,
        cfFromIRMEQS,
        cfFromManual,
        invalidCF
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCsvFile(null);
    setIrmeqsFiles([]);
    setManualCFText('');
    setResult(null);
    setError(null);
  };

  const canSubmit = csvFile && !isProcessing && (irmeqsFiles.length > 0 || manualCFText.trim());

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <Card className="shadow-sm">
            <Card.Header className="bg-gradient">
              <h5 className="mb-0">
                <i className="bi bi-funnel me-2"></i>
                Epura CSV - Rimuovi Codici Fiscali
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Descrizione */}
              <Alert variant="info" className="mb-4">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Funzionalità:</strong> Rimuove dal CSV tutte le righe con codici fiscali presenti nei file IRMEQS
                o inseriti manualmente. Il CSV epurato può essere riutilizzato nel <strong>Convertitore CSV</strong>.
              </Alert>

              {/* Form */}
              <Form onSubmit={handleSubmit}>
                {/* Upload CSV Base */}
                <div className="mb-3">
                  <Form.Label>
                    <strong>File CSV da Epurare</strong> <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={handleCSVChange}
                    required
                    aria-describedby="csvHelp"
                  />
                  <Form.Text id="csvHelp" className="text-muted">
                    Carica il file CSV (es. ESTRAZIONE_NETTI.csv) da cui rimuovere i codici fiscali
                  </Form.Text>

                  {csvFile && (
                    <div className="mt-2">
                      <small className="text-success">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        File selezionato: <code>{csvFile.name}</code>
                      </small>
                    </div>
                  )}
                </div>

                <hr className="my-4" />

                <h6 className="mb-3">
                  <i className="bi bi-filter me-2"></i>
                  Sorgenti Codici Fiscali da Rimuovere
                </h6>

                {/* Upload File IRMEQS */}
                <IrmeqsFilesUpload
                  files={irmeqsFiles}
                  onFilesChange={setIrmeqsFiles}
                />

                {/* Input Manuale CF */}
                <ManualCFInput
                  value={manualCFText}
                  onChange={setManualCFText}
                />

                {/* Riepilogo CF */}
                {(irmeqsFiles.length > 0 || manualCFText.trim()) && (
                  <Alert variant="secondary" className="mb-3">
                    <small>
                      <i className="bi bi-list-check me-2"></i>
                      <strong>Riepilogo sorgenti:</strong>
                      <ul className="mb-0 mt-2">
                        {irmeqsFiles.length > 0 && (
                          <li>{irmeqsFiles.length} file IRMEQS selezionat{irmeqsFiles.length === 1 ? 'o' : 'i'}</li>
                        )}
                        {manualCFText.trim() && (
                          <li>{manualCFText.split(/\r?\n/).filter(l => l.trim()).length} codic{manualCFText.split(/\r?\n/).filter(l => l.trim()).length === 1 ? 'e' : 'i'} fiscale{manualCFText.split(/\r?\n/).filter(l => l.trim()).length === 1 ? '' : 'i'} inserit{manualCFText.split(/\r?\n/).filter(l => l.trim()).length === 1 ? 'o' : 'i'} manualmente</li>
                        )}
                      </ul>
                    </small>
                  </Alert>
                )}

                {/* Error Alert */}
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={!canSubmit}
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
                        Elaborazione in corso...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-funnel-fill me-2"></i>
                        Epura CSV
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              {/* Result */}
              {result && <EpuraResult result={result} onReset={handleReset} />}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
