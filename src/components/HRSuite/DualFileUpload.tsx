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

  const labelClasses = (hasFile: boolean) => `
    block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
    transition-colors duration-200
    ${disabled
      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
      : hasFile
        ? 'border-green-400 bg-green-50'
        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
    }
  `;

  return (
    <div className="space-y-4 mb-6">
      {/* File 1: Anagrafico */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CSV Anagrafico *
          <span className="text-gray-500 font-normal ml-2">
            (NOMINATIVO, MATRICOLA, RUOLO)
          </span>
        </label>

        <label htmlFor="anagrafico-upload" className={labelClasses(!!anagraficFile)}>
          <div className="flex items-center justify-center">
            <svg
              className={`h-8 w-8 mr-2 ${anagraficFile ? 'text-green-600' : 'text-gray-400'}`}
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

            <div className="text-left">
              <p className={`text-sm font-medium ${anagraficFile ? 'text-green-700' : 'text-gray-600'}`}>
                {anagraficFile ? anagraficFile.name : 'Seleziona file CSV Anagrafico'}
              </p>
              {anagraficFile && (
                <p className="text-xs text-gray-500 mt-1">
                  {(anagraficFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>

          <input
            id="anagrafico-upload"
            type="file"
            accept=".csv,.CSV"
            onChange={handleAnagraficChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      </div>

      {/* File 2: Compensi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CSV Compensi *
          <span className="text-gray-500 font-normal ml-2">
            (nominativo, importo, parti)
          </span>
        </label>

        <label htmlFor="compensi-upload" className={labelClasses(!!compensiFile)}>
          <div className="flex items-center justify-center">
            <svg
              className={`h-8 w-8 mr-2 ${compensiFile ? 'text-green-600' : 'text-gray-400'}`}
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

            <div className="text-left">
              <p className={`text-sm font-medium ${compensiFile ? 'text-green-700' : 'text-gray-600'}`}>
                {compensiFile ? compensiFile.name : 'Seleziona file CSV Compensi'}
              </p>
              {compensiFile && (
                <p className="text-xs text-gray-500 mt-1">
                  {(compensiFile.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
          </div>

          <input
            id="compensi-upload"
            type="file"
            accept=".csv,.CSV"
            onChange={handleCompensiChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
