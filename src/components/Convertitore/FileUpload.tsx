import Form from 'react-bootstrap/Form';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
}

/**
 * Componente per upload file con drag & drop
 */
export function FileUpload({
  onFileSelect,
  accept = '.csv,.CSV',
  disabled = false
}: FileUploadProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div className="mb-4">
      <Form.Label
        htmlFor="csv-upload"
        className={`
          d-block border border-2 border-dashed rounded p-4 text-center
          ${disabled
            ? 'border-secondary bg-light cursor-not-allowed opacity-50'
            : 'border-secondary cursor-pointer'
          }
        `}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          borderStyle: 'dashed'
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = 'var(--bs-primary)';
            e.currentTarget.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = 'var(--bs-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <div className="d-flex flex-column align-items-center">
          {/* Icon */}
          <svg
            width="48"
            height="48"
            className={`mb-3 ${disabled ? 'text-muted' : 'text-secondary'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {/* Text */}
          <p className={`small mb-1 ${disabled ? 'text-muted' : 'text-secondary'}`}>
            <span className="fw-semibold">Clicca per caricare</span> o trascina qui
          </p>
          <p className={`mb-0 ${disabled ? 'text-muted' : 'text-secondary'}`} style={{ fontSize: '0.75rem' }}>
            File CSV (delimitatore: punto e virgola)
          </p>
        </div>

        <Form.Control
          id="csv-upload"
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="d-none"
        />
      </Form.Label>
    </div>
  );
}
