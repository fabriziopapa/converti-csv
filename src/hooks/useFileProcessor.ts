import { useState, useCallback } from 'react';

/**
 * Custom hook generico per gestire processing asincrono di file
 *
 * Gestisce automaticamente:
 * - State isProcessing (spinner/loading)
 * - State result (risultato operazione)
 * - State error (errori)
 *
 * Tipo generico <T> = tipo risultato
 *
 * Uso:
 * ```tsx
 * const { isProcessing, result, error, processFile, reset } =
 *   useFileProcessor<ConvertitoreResult>();
 *
 * const handleSubmit = async () => {
 *   await processFile(async () => {
 *     const parsed = await parseCSV(file);
 *     return generaFileTXT(parsed.data);
 *   });
 * };
 *
 * // UI
 * {isProcessing && <Spinner />}
 * {result && <SuccessMessage result={result} />}
 * {error && <ErrorAlert error={error} />}
 * ```
 */
export function useFileProcessor<T>() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Processa file con funzione asincrona
   * Gestisce automaticamente state loading/error/result
   *
   * @param processFn - Funzione async che ritorna risultato tipo T
   */
  const processFile = useCallback(
    async (processFn: () => Promise<T>): Promise<void> => {
      setIsProcessing(true);
      setError(null);
      setResult(null);

      try {
        const res = await processFn();
        setResult(res);

        console.log('[useFileProcessor] Processing completato con successo');
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : 'Errore sconosciuto durante il processing';

        setError(errorMessage);

        console.error('[useFileProcessor] Errore:', errorMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  /**
   * Reset completo dello state
   * Utile per pulire dopo download o per ripartire
   */
  const reset = useCallback((): void => {
    setIsProcessing(false);
    setResult(null);
    setError(null);
  }, []);

  return {
    isProcessing,
    result,
    error,
    processFile,
    reset
  };
}
