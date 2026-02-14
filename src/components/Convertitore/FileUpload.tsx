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
      <label
        htmlFor="csv-upload"
        className={`
          block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }
        `}
      >
        <div className="flex flex-col items-center">
          {/* Icon */}
          <svg
            className={`h-12 w-12 mb-3 ${disabled ? 'text-gray-300' : 'text-gray-400'}`}
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
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-semibold">Clicca per caricare</span> o trascina qui
          </p>
          <p className={`text-xs mt-1 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            File CSV (delimitatore: punto e virgola)
          </p>
        </div>

        <input
          id="csv-upload"
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
    </div>
  );
}
