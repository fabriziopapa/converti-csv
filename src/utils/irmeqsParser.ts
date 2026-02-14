/**
 * Parser per file IRMEQS - Estrae codici fiscali dai record RMD
 */

/**
 * Estrae tutti i codici fiscali dai record RMD di un file IRMEQS
 * Formato RMD: posizione 19-34 contiene il codice fiscale (16 caratteri)
 */
export async function extractCodiciFiscali(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split(/\r?\n/);
        const codiciFiscali = new Set<string>();

        for (const line of lines) {
          // Salta linee vuote
          if (!line || line.trim().length === 0) continue;

          // Prendi i primi 3 caratteri per identificare il tipo di record
          const tipoRecord = line.substring(0, 3);

          // Processa solo i record RMD
          if (tipoRecord === 'RMD') {
            // Estrai CF dalla posizione 19-34 (indice 18-33 in JS, 0-indexed)
            // Rimuovi spazi finali
            const cf = line.substring(18, 34).trim();

            if (cf && cf.length > 0) {
              codiciFiscali.add(cf);
            }
          }
        }

        resolve(Array.from(codiciFiscali));
      } catch (error) {
        reject(new Error(`Errore nel parsing del file ${file.name}: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error(`Errore nella lettura del file ${file.name}`));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Processa multipli file IRMEQS e ritorna un set unico di codici fiscali
 */
export async function extractCodiciFiscaliFromMultipleFiles(files: File[]): Promise<string[]> {
  const allCF = new Set<string>();

  for (const file of files) {
    try {
      const cfs = await extractCodiciFiscali(file);
      cfs.forEach(cf => allCF.add(cf));
    } catch (error) {
      console.error(`Errore nel file ${file.name}:`, error);
      throw error;
    }
  }

  return Array.from(allCF).sort();
}

/**
 * Valida se una stringa è un potenziale codice fiscale
 * (16 caratteri alfanumerici)
 */
export function isValidCodiceFiscale(cf: string): boolean {
  if (!cf || typeof cf !== 'string') return false;

  const cleaned = cf.trim().toUpperCase();

  // Codice fiscale italiano: 16 caratteri alfanumerici
  return /^[A-Z0-9]{16}$/.test(cleaned);
}

/**
 * Pulisce e valida una lista di codici fiscali da textarea
 */
export function parseManualCodiciFiscali(text: string): {
  valid: string[];
  invalid: string[];
} {
  const lines = text.split(/\r?\n/);
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim().toUpperCase();

    if (trimmed.length === 0) continue;

    if (isValidCodiceFiscale(trimmed)) {
      valid.push(trimmed);
    } else {
      invalid.push(trimmed);
    }
  }

  return { valid, invalid };
}
