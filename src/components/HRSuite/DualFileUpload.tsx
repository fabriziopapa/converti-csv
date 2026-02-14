import Form from 'react-bootstrap/Form';

interface DualFileUploadProps {
  anagraficFile: File | null;
  compensiFile: File | null;
  onAnagraficSelect: (file: File | null) => void;
  onCompensiSelect: (file: File | null) => void;
  disabled?: boolean;
}

/**
 * Componente per upload di 2 file CSV (Anagrafico + Compensi)
 */
export function DualFileUpload({
  anagraficFile,
  compensiFile,
  onAnagraficSelect,
  onCompensiSelect,
  disabled = false
}: DualFileUploadProps) {
  const handleAnagraficChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onAnagraficSelect(file);
  };

  const handleCompensiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onCompensiSelect(file);
  };

  const getLabelClasses = (hasFile: boolean) => {
    if (disabled) return 'border-secondary bg-light opacity-50';
    if (hasFile) return 'border-success bg-success bg-opacity-10';
    return 'border-secondary';
  };

  const getHoverStyle = () => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    borderStyle: 'dashed'
  });

  return (
    <div className="mb-4">
      {/* File 1: Anagrafico */}
      <div className="mb-3">
        <Form.Label className="small fw-medium text-dark mb-2">
          CSV Anagrafico *
          <span className="text-muted fw-normal ms-2">
            (NOMINATIVO, MATRICOLA, RUOLO)
          </span>
        </Form.Label>

        <Form.Label
          htmlFor="anagrafico-upload"
          className={`d-block border border-2 rounded p-3 text-center mb-0 ${getLabelClasses(!!anagraficFile)}`}
          style={getHoverStyle()}
          onMouseEnter={(e) => {
            if (!disabled && !anagraficFile) {
              e.currentTarget.style.borderColor = 'var(--bs-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !anagraficFile) {
              e.currentTarget.style.borderColor = 'var(--bs-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <svg
              width="32"
              height="32"
              className={`me-2 ${anagraficFile ? 'text-success' : 'text-secondary'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            <div className="text-start">
              <p className={`small fw-medium mb-0 ${anagraficFile ? 'text-success' : 'text-secondary'}`}>
                {anagraficFile ? anagraficFile.name : 'Seleziona file CSV Anagrafico'}
              </p>
              {anagraficFile && (
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                  {(anagraficFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>

          <Form.Control
            id="anagrafico-upload"
            type="file"
            accept=".csv,.CSV"
            onChange={handleAnagraficChange}
            disabled={disabled}
            className="d-none"
          />
        </Form.Label>
      </div>

      {/* File 2: Compensi */}
      <div>
        <Form.Label className="small fw-medium text-dark mb-2">
          CSV Compensi *
          <span className="text-muted fw-normal ms-2">
            (nominativo, importo, parti)
          </span>
        </Form.Label>

        <Form.Label
          htmlFor="compensi-upload"
          className={`d-block border border-2 rounded p-3 text-center mb-0 ${getLabelClasses(!!compensiFile)}`}
          style={getHoverStyle()}
          onMouseEnter={(e) => {
            if (!disabled && !compensiFile) {
              e.currentTarget.style.borderColor = 'var(--bs-primary)';
              e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !compensiFile) {
              e.currentTarget.style.borderColor = 'var(--bs-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <svg
              width="32"
              height="32"
              className={`me-2 ${compensiFile ? 'text-success' : 'text-secondary'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            <div className="text-start">
              <p className={`small fw-medium mb-0 ${compensiFile ? 'text-success' : 'text-secondary'}`}>
                {compensiFile ? compensiFile.name : 'Seleziona file CSV Compensi'}
              </p>
              {compensiFile && (
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                  {(compensiFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>

          <Form.Control
            id="compensi-upload"
            type="file"
            accept=".csv,.CSV"
            onChange={handleCompensiChange}
            disabled={disabled}
            className="d-none"
          />
        </Form.Label>
      </div>
    </div>
  );
}
