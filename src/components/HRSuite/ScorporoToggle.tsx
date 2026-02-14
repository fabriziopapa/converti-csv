import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';

interface ScorporoToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle per abilitare/disabilitare scorporo contributivo
 */
export function ScorporoToggle({
  enabled,
  onChange,
  disabled = false
}: ScorporoToggleProps) {
  return (
    <Alert variant="info" className="mb-4">
      <div className="d-flex align-items-start">
        <div className="d-flex align-items-center" style={{ height: '20px' }}>
          <Form.Check
            type="checkbox"
            id="scorporo-toggle"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="me-0"
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          />
        </div>

        <div className="ms-3 small flex-grow-1">
          <Form.Label
            htmlFor="scorporo-toggle"
            className={`fw-medium mb-1 ${disabled ? 'text-muted' : 'text-dark'}`}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            Compensi omnicomprensivi (applica scorporo contributivo)
          </Form.Label>

          <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
            {enabled ? (
              <>
                ✅ <span className="fw-medium">Scorporo ATTIVO:</span> gli importi verranno divisi per il coefficiente contributivo
                (RD: 1.3431, Altri: 1.3270)
              </>
            ) : (
              <>
                ⚠️ <span className="fw-medium">Scorporo DISATTIVO:</span> gli importi verranno utilizzati così come sono nel CSV
              </>
            )}
          </p>

          {/* Info aggiuntiva */}
          <Accordion flush>
            <Accordion.Item eventKey="0" className="border-0 bg-transparent">
              <Accordion.Header className="p-0 bg-transparent border-0" style={{ fontSize: '0.75rem' }}>
                <span className="text-info">ℹ️ Cosa significa?</span>
              </Accordion.Header>
              <Accordion.Body className="px-0 pt-2 pb-0" style={{ fontSize: '0.75rem' }}>
                <div className="text-muted ps-3 border-start border-info border-2">
                  Se i compensi nel CSV sono <strong>omnicomprensivi</strong> (includono già i contributi),
                  lo scorporo li divide per ottenere l'imponibile netto.
                  <br /><br />
                  <strong>Esempio RD:</strong> 1343,10 € ÷ 1.3431 = 1000,00 €
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </Alert>
  );
}
