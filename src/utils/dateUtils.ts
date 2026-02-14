import { format, startOfDay, endOfMonth } from 'date-fns';

/**
 * Formatta data in formato AAAAMMGG per record TXT
 * Python: datetime.now().strftime('%Y%m%d')
 * Esempio: 14 febbraio 2025 -> "20250214"
 */
export function formatDataAAAAMMGG(date: Date): string {
  return format(startOfDay(date), 'yyyyMMdd');
}

/**
 * Formatta data in formato DD/MM/YYYY per HRSuite
 * Esempio: 14 febbraio 2025 -> "14/02/2025"
 */
export function formatDataDDMMYYYY(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

/**
 * Calcola l'ultimo giorno del mese per data competenza HRSuite
 * Python: ultimo_giorno_mese()
 *
 * @param anno Anno (es. 2025)
 * @param mese Mese (1-12)
 * @returns Data formattata DD/MM/YYYY
 */
export function getUltimoGiornoMese(anno: number, mese: number): string {
  // Crea data per il primo giorno del mese
  const firstDay = new Date(anno, mese - 1, 1);

  // Calcola ultimo giorno
  const lastDay = endOfMonth(firstDay);

  return formatDataDDMMYYYY(lastDay);
}

/**
 * Ottiene anno corrente
 */
export function getAnnoCorrente(): number {
  return new Date().getFullYear();
}

/**
 * Ottiene mese corrente (01-12)
 */
export function getMeseCorrente(): string {
  const mese = new Date().getMonth() + 1; // getMonth() ritorna 0-11
  return String(mese).padStart(2, '0');
}
