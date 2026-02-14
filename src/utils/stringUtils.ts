/**
 * Padding a destra con spazi (equivalente Python: str.ljust())
 * Esempio: padRight("ABC", 10) -> "ABC       "
 */
export function padRight(str: string, length: number): string {
  return str.padEnd(length, ' ');
}

/**
 * Padding a sinistra con zeri (equivalente Python: str.zfill())
 * Esempio: padLeft("123", 7) -> "0000123"
 */
export function padLeft(str: string, length: number, char: string = '0'): string {
  return str.padStart(length, char);
}

/**
 * Formatta importo in centesimi con 15 cifre zero-padded
 * Python: f"{int(importo * 100):015}"
 * IMPORTANTE: Usa Math.trunc() per matchare Flask (non Math.round()!)
 * Esempio: formatImporto(100.50) -> "000000000010050"
 */
export function formatImporto(importo: number): string {
  // Flask usa int() che tronca, non arrotonda
  const centesimi = Math.trunc(importo * 100);
  return padLeft(String(centesimi), 15, '0');
}

/**
 * Calcola la lunghezza in byte di una stringa UTF-8
 * IMPORTANTE: Per validare record a lunghezza fissa
 */
export function getByteLength(str: string): number {
  return new Blob([str]).size;
}

/**
 * Tronca stringa a un numero massimo di byte (per UTF-8)
 * Utile per caratteri speciali che occupano più byte
 */
export function truncateToBytes(str: string, maxBytes: number): string {
  let truncated = str;
  while (getByteLength(truncated) > maxBytes) {
    truncated = truncated.slice(0, -1);
  }
  return truncated;
}

/**
 * Parsing importo formato italiano (1.234,56 -> 1234.56)
 * Gestisce sia formato italiano che standard
 */
export function parseImportoItaliano(str: string): number {
  if (!str || str.trim() === '') return 0;

  // Rimuovi punti separatori di migliaia
  // Sostituisci virgola con punto per decimali
  const normalized = str.trim()
    .replace(/\./g, '')  // Rimuovi punti
    .replace(',', '.');   // Virgola -> punto

  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}
