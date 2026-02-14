import type { ProgressivoData } from '../types/progressivo.types';

/**
 * Chiave localStorage per salvare i progressivi
 */
const STORAGE_KEY = 'converti_csv_progressivi';

/**
 * Nome base per identificativo file
 * Python: nome_base = 'IRMEQS'
 */
const NOME_BASE = 'IRMEQS';

/**
 * ProgressivoManager - Gestisce progressivi annuali in localStorage
 * Sostituisce il modello PostgreSQL dell'app Flask
 *
 * Python equivalente: app.py righe 65-85
 */
export class ProgressivoManager {
  /**
   * Ottiene il progressivo corrente per l'anno in corso
   * Python: Progressivo.query.filter_by(nome_base=nome_base, anno=anno).first()
   *
   * Se non esiste, ne crea uno nuovo con progressivo=0
   */
  static getCurrent(): ProgressivoData {
    const currentYear = new Date().getFullYear();
    const stored = this.loadAll();

    // Cerca progressivo per anno corrente
    const current = stored.find(p => p.anno === currentYear);

    if (current) {
      return current;
    }

    // Se non esiste, crea nuovo con progressivo=0
    return this.create(currentYear);
  }

  /**
   * Incrementa il progressivo e salva in localStorage
   * Python: record.progressivo += 1; db.session.commit()
   *
   * @returns ProgressivoData aggiornato
   */
  static increment(): ProgressivoData {
    const current = this.getCurrent();

    // Incrementa
    current.progressivo += 1;
    current.lastUpdated = new Date().toISOString();

    // Salva
    this.save(current);

    console.log(`[ProgressivoManager] Incrementato progressivo ${current.anno}: ${current.progressivo}`);

    return current;
  }

  /**
   * Genera identificativo file formato IRMEQS{anno}{mese}{progressivo:08}
   * Formato: IRMEQS + AAAA + MM + PPPPPPPP (6+4+2+8 = 20 caratteri)
   *
   * Esempio: IRMEQS202602000000001 (febbraio 2026, progressivo 1)
   */
  static generateIdentificativo(data: ProgressivoData): string {
    const mese = String(new Date().getMonth() + 1).padStart(2, '0');
    const progressivoPadded = String(data.progressivo).padStart(8, '0');
    return `${NOME_BASE}${data.anno}${mese}${progressivoPadded}`;
  }

  /**
   * Genera nome file completo
   * Formato: IRMEQS{anno}{mese}{progressivo:08}.TXT
   * Esempio: IRMEQS20260200000001.TXT
   */
  static generateFileName(data: ProgressivoData): string {
    return `${this.generateIdentificativo(data)}.TXT`;
  }

  /**
   * Reset progressivo (per testing o cambio anno)
   * ⚠️ Usare con cautela
   */
  static reset(anno?: number): void {
    const targetYear = anno ?? new Date().getFullYear();
    const allData = this.loadAll();

    // Rimuovi progressivo per l'anno specificato
    const filtered = allData.filter(p => p.anno !== targetYear);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    console.log(`[ProgressivoManager] Reset progressivo per anno ${targetYear}`);
  }

  /**
   * Ottieni tutti i progressivi salvati (per debug/admin)
   */
  static getAll(): ProgressivoData[] {
    return this.loadAll();
  }

  // ==================== METODI PRIVATI ====================

  /**
   * Crea nuovo progressivo per un anno
   */
  private static create(anno: number): ProgressivoData {
    const newData: ProgressivoData = {
      anno,
      progressivo: 0,
      lastUpdated: new Date().toISOString()
    };

    this.save(newData);

    console.log(`[ProgressivoManager] Creato nuovo progressivo per anno ${anno}`);

    return newData;
  }

  /**
   * Salva un progressivo in localStorage (insert o update)
   */
  private static save(data: ProgressivoData): void {
    const allData = this.loadAll();

    // Update or insert
    const index = allData.findIndex(p => p.anno === data.anno);

    if (index >= 0) {
      // Update esistente
      allData[index] = data;
    } else {
      // Inserisci nuovo
      allData.push(data);
    }

    // Ordina per anno (più recente prima)
    allData.sort((a, b) => b.anno - a.anno);

    // Salva in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }

  /**
   * Carica tutti i progressivi da localStorage
   */
  private static loadAll(): ProgressivoData[] {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('[ProgressivoManager] Errore parsing localStorage:', error);
      return [];
    }
  }
}
