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
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="scorporo-toggle"
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        <div className="ml-3 text-sm">
          <label
            htmlFor="scorporo-toggle"
            className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700 cursor-pointer'}`}
          >
            Compensi omnicomprensivi (applica scorporo contributivo)
          </label>

          <p className="text-xs text-gray-600 mt-1">
            {enabled ? (
              <>
                ✅ <span className="font-medium">Scorporo ATTIVO:</span> gli importi verranno divisi per il coefficiente contributivo
                (RD: 1.3431, Altri: 1.3270)
              </>
            ) : (
              <>
                ⚠️ <span className="font-medium">Scorporo DISATTIVO:</span> gli importi verranno utilizzati così come sono nel CSV
              </>
            )}
          </p>

          {/* Info aggiuntiva */}
          <details className="mt-2">
            <summary className="text-xs text-blue-700 cursor-pointer hover:text-blue-800">
              ℹ️ Cosa significa?
            </summary>
            <p className="text-xs text-gray-600 mt-2 pl-4 border-l-2 border-blue-300">
              Se i compensi nel CSV sono <strong>omnicomprensivi</strong> (includono già i contributi),
              lo scorporo li divide per ottenere l'imponibile netto.
              <br /><br />
              <strong>Esempio RD:</strong> 1343,10 € ÷ 1.3431 = 1000,00 €
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
