# Convertitore CSV → TXT

Applicazione React+TypeScript per convertire file CSV in file TXT a lunghezza fissa (300 byte/record) per l'Agenzia delle Entrate.

Migrazione completa da Flask a React per deployment su Cloudflare Pages come applicazione completamente client-side.
La migrazione è intervenuta per un adequamneto tecnico del progetto: https://github.com/fabriziopapa/csv-to-txt-app

## ✨ Features

### Convertitore CSV → TXT
- Converte CSV in file TXT con record a lunghezza fissa (300 byte)
- Formato: RMA (testa) + N×RMD (dettaglio) + RMZ (coda)
- Gestione progressivi annuali in localStorage
- Nome file: `IRMEQS{anno}{mese}{progressivo}.TXT` (es. IRMEQS20260200000001.TXT)
- Supporto caratteri UTF-8 multi-byte (padding a livello byte)
- Output byte-per-byte identico all'app Flask originale

### HRSuite
- Join CSV Anagrafico + CSV Compensi
- Calcolo scorporo contributivo:
  - (RD): importo / 1.3431
  - Altri ruoli: importo / 1.3270
- Calcolo data competenza (ultimo giorno del mese)
- Output CSV con 23 colonne

## 🚀 Quick Start

### Installazione

```bash
# Clone repository
git clone https://github.com/fabriziopapa/converti-csv.git
cd converti-csv

# Installa dipendenze
npm install

# Avvia dev server
npm run dev
```

Apri http://localhost:5173

### Build Produzione

```bash
npm run build
npm run preview  # Test build locale
```

## 📁 Struttura Progetto

```
converti-csv/
├── src/
│   ├── components/
│   │   ├── Convertitore/        # Form e risultati convertitore
│   │   ├── HRSuite/              # Form e risultati HRSuite
│   │   └── Layout/               # Header, Navigation, Footer
│   ├── hooks/
│   │   ├── useProgressivo.ts     # Hook gestione progressivi
│   │   └── useFileProcessor.ts   # Hook elaborazione file
│   ├── utils/
│   │   ├── recordFormatter.ts    # ⚠️ CRITICO: Formattazione RMA/RMD/RMZ
│   │   ├── progressivoManager.ts # ⚠️ CRITICO: localStorage progressivi
│   │   ├── fileGenerator.ts      # Orchestrazione generazione TXT
│   │   ├── hrsuiteGenerator.ts   # Logica HRSuite
│   │   ├── csvParser.ts          # Parsing CSV (PapaParse)
│   │   ├── stringUtils.ts        # Padding e formatting
│   │   └── dateUtils.ts          # Gestione date
│   ├── types/                    # TypeScript type definitions
│   └── App.tsx                   # Root component
├── test-cases/                   # CSV di test edge cases
├── public/
│   └── _redirects                # Cloudflare Pages SPA routing
├── TESTING.md                    # Guida testing completa
├── DEPLOYMENT.md                 # Guida deploy Cloudflare Pages
└── package.json
```

## 🧪 Testing

### Test Automatici

```bash
# Suite completa edge cases
npm run test:edge-cases

# Risultato: 5/5 test passati (100%)
# - Test Minimo (1 record)
# - Test Caratteri Speciali UTF-8
# - Test Decimali Estremi
# - Test Error Handling
# - Test Floating Point Precision
```

### Validazione File

```bash
# Valida lunghezza record (deve essere 300 byte esatti)
npm run test:validate <file>.TXT

# Confronto byte-per-byte con Flask
npm run test:compare <flask-file>.TXT <react-file>.TXT
```

### Test Manuali

Vedi `TESTING.md` per:
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Test localStorage
- Test responsive design
- Test performance

## 📊 Compatibilità Flask

✅ **Output identico byte-per-byte** (330/330 record testati)

Confronto con app Flask originale:
- Stesso formato record (RMA/RMD/RMZ)
- Stessa conversione importi (truncation, non rounding)
- Stesso padding (300 byte esatti)
- Stesso formato identificativo file

Differenza chiave:
- **React**: Gestisce correttamente caratteri UTF-8 multi-byte (padding a livello byte)
- **Flask**: Può generare record > 300 byte con caratteri speciali

## 🛠️ Stack Tecnologico

- **React** 19 + **TypeScript** 5.9
- **Vite** 7.3 (build tool)
- **Tailwind CSS** 4.1 (styling)
- **PapaParse** 5.5 (CSV parsing)
- **file-saver** 2.0 (download file)
- **date-fns** 4.1 (date formatting)

## 📝 Formato Record TXT

### RMA (Record Testa) - 300 byte
```
Pos 001-003: "RMA"
Pos 004-010: "0000001"
Pos 011-030: identificativo file (IRMEQS{anno}{mese}{progressivo:08})
             Esempio: IRMEQS20260200000001 (febbraio 2026, progressivo 1)
Pos 031-038: data creazione (AAAAMMGG)
Pos 039-041: "R01"
Pos 042-300: spazi (259 caratteri)
```

### RMD (Record Dettaglio) - 300 byte
```
Pos 001-003: "RMD"
Pos 004-010: progressivo record (7 cifre zero-padded)
Pos 011-017: "0000001"
Pos 018:     "1"
Pos 019-034: codice fiscale (16 byte, right-padded)
Pos 035-049: id pagamento FSHD{data}{progressivo} (15 byte)
Pos 050-064: importo in centesimi (15 cifre zero-padded)
Pos 065:     "1"
Pos 066-300: spazi (235 caratteri)
```

### RMZ (Record Coda) - 300 byte
```
Pos 001-003: "RMZ"
Pos 004-010: progressivo finale
Pos 011-030: identificativo file
Pos 031-038: data creazione
Pos 039-045: totale record
Pos 046-300: spazi (255 caratteri)
```

## 🔐 Privacy

✅ **Nessun dato inviato a server**
- Elaborazione completamente client-side
- File CSV processati nel browser
- localStorage solo per progressivi
- Zero chiamate API esterne

## 📦 Deployment

### Cloudflare Pages (Consigliato)

```bash
# Build
npm run build

# Deploy manuale: trascina dist/ su Cloudflare dashboard
# Oppure deploy automatico via Git (vedi DEPLOYMENT.md)
```

**Settings Cloudflare**:
- Build command: `npm run build`
- Build output: `dist`
- Framework: Vite

Vedi `DEPLOYMENT.md` per guida completa.

## 🐛 Troubleshooting

### Record non sono 300 byte

**Causa**: Caratteri UTF-8 multi-byte nel codice fiscale

**Soluzione**: L'app tronca automaticamente a livello byte. Verifica CSV input.

### localStorage non persiste

**Causa**: Browser in modalità incognito o cookies bloccati

**Soluzione**: Usa browser normale, abilita localStorage

### File CSV non carica

**Causa**: Encoding diverso da UTF-8 o delimiter sbagliato

**Soluzione**:
- Encoding: UTF-8
- Delimiter: `;` (punto e virgola)
- Colonne richieste: `COD_FIS`, `NETTO`

## 📚 Documentazione

- `README.md` - Questo file
- `TESTING.md` - Guida testing completa
- `DEPLOYMENT.md` - Guida deployment Cloudflare Pages
- `src/utils/recordFormatter.ts` - Documentazione formato record

## 🤝 Contribuire

1. Fork repository
2. Crea branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📄 Licenza

Distribuito sotto la licenza [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.html).


## 🙏 Credits

Migrazione da Flask a React+TypeScript realizzata il team di Payroll Gang

---

**Made with ❤️ for Agenzia delle Entrate**
