import type { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

interface ManualCFInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Componente per input manuale di codici fiscali
 */
export function ManualCFInput({ value, onChange }: ManualCFInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Conta le righe non vuote
  const countLines = () => {
    const lines = value.split(/\r?\n/).filter(line => line.trim().length > 0);
    return lines.length;
  };

  return (
    <div className="mb-3">
      <Form.Label>
        <strong>Codici Fiscali Manuali</strong> (opzionale)
      </Form.Label>
      <Form.Control
        as="textarea"
        rows={6}
        value={value}
        onChange={handleChange}
        placeholder="Inserisci i codici fiscali da rimuovere, uno per riga&#10;Esempio:&#10;RSSMRA85M01H501Z&#10;BNCGPP90A01F205K&#10;VRDLCU75C10Z133K"
        style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
        aria-describedby="manualCFHelp"
      />
      <Form.Text id="manualCFHelp" className="text-muted">
        Inserisci un codice fiscale per riga (16 caratteri alfanumerici). Verranno convertiti automaticamente in maiuscolo.
      </Form.Text>

      {value && countLines() > 0 && (
        <div className="mt-2">
          <small className="text-info">
            <i className="bi bi-info-circle me-1"></i>
            {countLines()} codice{countLines() === 1 ? ' fiscale' : ' fiscali'} inserit{countLines() === 1 ? 'o' : 'i'}
          </small>
        </div>
      )}
    </div>
  );
}
