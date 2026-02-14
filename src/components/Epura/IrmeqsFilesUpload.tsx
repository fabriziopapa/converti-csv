import type { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';

interface IrmeqsFilesUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

/**
 * Componente per upload multiplo di file IRMEQS
 */
export function IrmeqsFilesUpload({ files, onFilesChange }: IrmeqsFilesUploadProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      onFilesChange(Array.from(selectedFiles));
    }
  };

  const handleRemoveFiles = () => {
    onFilesChange([]);
  };

  return (
    <div className="mb-3">
      <Form.Label>
        <strong>File IRMEQS</strong> (opzionale - caricamento multiplo)
      </Form.Label>
      <Form.Control
        type="file"
        accept=".txt"
        multiple
        onChange={handleFileChange}
        aria-describedby="irmeqsHelp"
      />
      <Form.Text id="irmeqsHelp" className="text-muted">
        Carica uno o più file IRMEQS*.txt per estrarre automaticamente i codici fiscali dai record RMD
      </Form.Text>

      {files.length > 0 && (
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-success">
              <i className="bi bi-check-circle-fill me-1"></i>
              {files.length} file selezionat{files.length === 1 ? 'o' : 'i'}
            </small>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemoveFiles}
            >
              <i className="bi bi-trash me-1"></i>
              Rimuovi
            </button>
          </div>
          <ul className="list-group list-group-flush">
            {files.map((file, index) => (
              <li key={index} className="list-group-item px-0 py-1">
                <small>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  {file.name}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
