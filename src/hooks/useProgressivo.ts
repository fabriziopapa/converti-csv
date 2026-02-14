import { useState, useEffect, useCallback } from 'react';
import { ProgressivoManager } from '../utils/progressivoManager';
import type { ProgressivoData } from '../types/progressivo.types';

/**
 * Custom hook per gestire progressivi annuali
 *
 * Carica il progressivo corrente al mount e fornisce funzioni
 * per incrementare e refreshare.
 *
 * Uso:
 * ```tsx
 * const { progressivo, incrementProgressivo, refreshProgressivo } = useProgressivo();
 *
 * // Mostra progressivo corrente
 * <p>Progressivo corrente: {progressivo?.progressivo}</p>
 *
 * // Incrementa (fatto automaticamente da fileGenerator)
 * incrementProgressivo();
 * ```
 */
export function useProgressivo() {
  const [progressivo, setProgressivo] = useState<ProgressivoData | null>(null);

  // Carica progressivo corrente al mount
  useEffect(() => {
    const current = ProgressivoManager.getCurrent();
    setProgressivo(current);

    console.log(
      `[useProgressivo] Progressivo caricato: ${current.anno}/${current.progressivo}`
    );
  }, []);

  // Incrementa progressivo e aggiorna state
  const incrementProgressivo = useCallback((): ProgressivoData => {
    const updated = ProgressivoManager.increment();
    setProgressivo(updated);

    return updated;
  }, []);

  // Refresh progressivo (utile dopo operazioni esterne)
  const refreshProgressivo = useCallback((): void => {
    const current = ProgressivoManager.getCurrent();
    setProgressivo(current);
  }, []);

  // Genera identificativo per preview (senza incrementare)
  const getIdentificativo = useCallback((): string | null => {
    if (!progressivo) return null;

    return ProgressivoManager.generateIdentificativo(progressivo);
  }, [progressivo]);

  return {
    progressivo,
    incrementProgressivo,
    refreshProgressivo,
    getIdentificativo
  };
}
