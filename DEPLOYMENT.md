# Guida Deployment - Cloudflare Pages

## 🚀 Deploy su Cloudflare Pages

### Prerequisiti

- Account Cloudflare (gratuito)
- Repository GitHub/GitLab (opzionale ma consigliato)
- Build di produzione funzionante (`npm run build`)

---

## Metodo 1: Deploy Diretto (Drag & Drop)

### Step 1: Build Locale

```bash
cd ~/converti-csv
npm run build
```

Verifica che la directory `dist/` contenga:
- `index.html`
- `_redirects`
- `assets/` (con JS e CSS minificati)

### Step 2: Deploy su Cloudflare

1. Vai su https://dash.cloudflare.com
2. Click su "Pages" nel menu laterale
3. Click "Create a project"
4. Click "Upload assets"
5. Trascina la cartella `dist/` oppure clicca "Select from computer"
6. Dai un nome al progetto (es. `converti-csv`)
7. Click "Deploy site"

### Step 3: Verifica

Cloudflare assegnerà un URL tipo:
```
https://converti-csv.pages.dev
```

Testa l'applicazione:
- ✅ Upload CSV funziona
- ✅ Download file TXT funziona
- ✅ localStorage persiste
- ✅ Nessun errore in console

---

## Metodo 2: Deploy con Git (Consigliato)

### Step 1: Crea Repository GitHub

```bash
cd ~/converti-csv

# Se non hai già un remote
gh repo create converti-csv --public --source=. --remote=origin

# Push del codice
git push -u origin master
```

Oppure manualmente:
1. Vai su https://github.com/new
2. Crea repository `converti-csv`
3. Segui le istruzioni per push del repository esistente

### Step 2: Connetti a Cloudflare Pages

1. Vai su https://dash.cloudflare.com
2. Click su "Pages" → "Create a project"
3. Click "Connect to Git"
4. Autorizza Cloudflare ad accedere a GitHub
5. Seleziona repository `converti-csv`
6. Configura build settings:

**Build Configuration**:
```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

**Environment Variables**: (nessuna necessaria)

7. Click "Save and Deploy"

### Step 3: Deploy Automatici

Ogni push a `master` triggera un deploy automatico!

```bash
# Fai modifiche
git add .
git commit -m "Update: fix bug X"
git push

# Cloudflare deploya automaticamente
```

---

## Configurazione Build Settings (Dettagli)

### Cloudflare Pages Dashboard

```yaml
Production branch: master
Build command: npm run build
Build output directory: dist
Root directory: (Leave blank)
Environment variables: (None required)
```

### Node.js Version

Cloudflare Pages usa Node.js 18 di default. Per specificare una versione:

1. Aggiungi variabile ambiente:
   - Name: `NODE_VERSION`
   - Value: `20` (o `22`)

### Build Watch Paths (Opzionale)

Se vuoi triggare build solo per certe modifiche:
```
Include: src/**, public/**, *.ts, *.tsx, package.json
Exclude: *.md, test-cases/**, *.cjs
```

---

## Custom Domain (Opzionale)

### Setup Custom Domain

1. Nel dashboard Cloudflare Pages, vai sul tuo progetto
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Inserisci il tuo dominio (es. `converti.example.com`)
5. Segui le istruzioni per aggiornare DNS

Cloudflare fornisce automaticamente:
- ✅ HTTPS/SSL certificate (gratis)
- ✅ CDN globale
- ✅ DDoS protection

---

## Verifica Post-Deploy

### Checklist

- [ ] App si carica correttamente
- [ ] Upload CSV funziona
- [ ] Download file TXT funziona
- [ ] File generato è valido (300 byte/record)
- [ ] Progressivo incrementa e persiste
- [ ] localStorage funziona
- [ ] Responsive design OK (mobile/tablet)
- [ ] Console senza errori (F12)
- [ ] Performance OK (Lighthouse > 90)

### Test con File Reale

```bash
# Scarica file generato da produzione
# Valida localmente
node validate_record_length.cjs <file-scaricato>.TXT
```

Deve mostrare: "✅ SUCCESSO: Tutti i record sono esattamente 300 byte!"

---

## Troubleshooting

### Build Fallisce

**Errore**: `Module not found` o `Cannot find package`

**Soluzione**:
```bash
# Pulisci e reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
npm run build
```

### SPA Routing Non Funziona

**Problema**: Refresh pagina dà 404

**Soluzione**: Verifica che `public/_redirects` esista e contenga:
```
/* /index.html 200
```

Il file viene copiato automaticamente in `dist/` durante il build.

### localStorage Non Persiste

**Problema**: Progressivo si resetta sempre a 1

**Cause**:
- Browser in modalità incognito (localStorage disabilitato)
- Cookies/storage bloccati da browser
- Dominio diverso (ogni dominio ha il suo localStorage)

**Verifica**:
1. Apri DevTools (F12)
2. Application → Local Storage
3. Verifica chiave `converti_csv_progressivi` esiste

### File Scaricato Corrotto

**Problema**: File TXT ha record > 300 byte o < 300 byte

**Soluzione**:
1. Verifica CSV input non ha caratteri strani
2. Test locale prima:
   ```bash
   npm run dev
   # Genera file e valida
   node validate_record_length.cjs <file>.TXT
   ```
3. Se problema persiste, verifica encoding CSV (deve essere UTF-8)

---

## Performance Optimization

### Analisi Bundle Size

```bash
npm run build

# Output mostra:
# - index-*.js: ~216 KB (gzipped: ~66 KB)
# - csv-*.js: ~41 KB (gzipped: ~13 KB)
# - vendor-*.js: ~11 KB (gzipped: ~4 KB)
```

### Lighthouse Score

Target:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

Verifica con:
1. Chrome DevTools → Lighthouse
2. Run audit su produzione

### CDN e Caching

Cloudflare Pages fa automaticamente:
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 e HTTP/3
- ✅ Edge caching (asset statici)
- ✅ Minification JS/CSS (già fatto da Vite)

---

## Rollback e Versioning

### Cloudflare Pages Deployments

Ogni deploy è versioned:
1. Vai su Cloudflare Pages → Tuo progetto
2. Click "View builds"
3. Ogni build ha un URL univoco
4. Click "..." su vecchia build → "Rollback to this deployment"

### Git-based Rollback

```bash
# Torna al commit precedente
git revert HEAD
git push

# Oppure reset hard (attenzione!)
git reset --hard HEAD~1
git push --force
```

---

## Monitoring e Analytics

### Cloudflare Web Analytics (Gratis)

1. Cloudflare Dashboard → Web Analytics
2. Aggiungi sito
3. Ottieni snippet JavaScript (opzionale, Cloudflare traccia comunque)

Metriche:
- Page views
- Unique visitors
- Performance metrics
- Geographic distribution

### Console Errors Monitoring

Considera integrare servizio come:
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics

---

## Sicurezza

### HTTPS

✅ Cloudflare Pages fornisce HTTPS automaticamente

### Headers Security

Aggiungi `public/_headers` (opzionale):

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### CSP (Content Security Policy)

Se necessario, aggiungi in `_headers`:
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

---

## Backup e Recovery

### Backup Codice

✅ Git repository (GitHub/GitLab) è il backup principale

### Backup localStorage

Gli utenti possono esportare progressivi:

Aggiungi feature (opzionale):
```typescript
// Export progressivi
const exportProgressivi = () => {
  const data = localStorage.getItem('converti_csv_progressivi');
  const blob = new Blob([data || '[]'], { type: 'application/json' });
  saveAs(blob, 'progressivi_backup.json');
};
```

---

## Costi

### Cloudflare Pages Free Plan

✅ **Gratis per sempre**:
- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- Concurrent builds: 1

### Upgrade a Pro (Opzionale)

$20/mese:
- 5000 builds/month
- Concurrent builds: 5
- Advanced analytics

**Per questa app**: Free plan è più che sufficiente!

---

## Comandi Utili

### Sviluppo Locale

```bash
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Build produzione
npm run preview      # Preview build (http://localhost:4173)
npm run test:edge-cases  # Test automatici
```

### Deploy

```bash
# Git-based (automatico)
git add .
git commit -m "Update: description"
git push

# Manuale (drag & drop)
npm run build
# Trascina dist/ su Cloudflare Pages dashboard
```

### Debug

```bash
# Valida file TXT generato
node validate_record_length.cjs <file>.TXT

# Confronta con Flask
node compare_files.cjs <flask-file>.TXT <react-file>.TXT

# Test edge cases
npm run test:edge-cases
```

---

## Link Utili

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages
- Vite Docs: https://vite.dev
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com

---

## Support

Per problemi o bug:
1. Controlla TESTING.md per troubleshooting
2. Verifica console browser (F12)
3. Test locale con `npm run dev`
4. Apri issue su GitHub repository

---

**Deploy completato! 🎉**

L'applicazione è ora live e accessibile globalmente via Cloudflare CDN.
