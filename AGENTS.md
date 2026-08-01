# AGENT.md — Panduan AI untuk Proyek Next.js + Cockpit CMS

> File ini adalah sumber kebenaran utama untuk semua AI agent yang bekerja di repositori ini.
> Baca **seluruhnya** sebelum menulis atau mengubah kode apapun.

---

<!-- BEGIN:nextjs-agent-rules -->
## ⚠️ Peringatan Kritis: Versi Next.js Ini Mungkin Berbeda

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.  
**Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.**

Jangan berasumsi bahwa kamu tahu cara kerja Next.js versi ini hanya dari data pelatihan.  
Selalu verifikasi dari dokumentasi lokal atau `package.json` terlebih dahulu.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:cockpit-agent-rules -->
## 📖 Aturan Cockpit CMS — Wajib Dibaca Sebelum Mulai

Proyek ini menggunakan **Cockpit CMS** sebagai headless backend.  
Sebelum menulis kode apapun yang menyentuh konten, asset, autentikasi, atau fitur CMS:

### 1. Baca Dokumentasi API dari `frontend/docs-main/`

Folder `docs-main/` berisi dokumentasi resmi Cockpit CMS untuk proyek ini.  
Struktur dokumentasinya:

```
docs-main/
├── core/
│   ├── api/
│   │   ├── content/       → API untuk mengambil & menyimpan konten
│   │   ├── assets/        → API untuk gambar & file
│   │   └── authentication/ → API key, public API, OIDC
│   └── concepts/
│       ├── fields/        → Tipe field yang tersedia
│       ├── localization/  → Cara kerja multi-bahasa
│       └── roles-permissions/ → Sistem izin
├── pro/
│   ├── pages/api/         → API untuk Pages & Menus
│   ├── lokalize/api/      → API untuk terjemahan (i18n)
│   ├── inbox/api/         → API untuk form submission
│   ├── detektivo/api/     → API untuk full-text search
│   ├── personi/api/       → API untuk personalisasi konten
│   └── webhooks/          → Konfigurasi webhook
└── guides/
    └── cockpit-with-nextjs.md → Panduan integrasi Next.js
```

**Urutan baca yang disarankan:**
1. `frontend/docs-main/core/api/authentication/index.md` — pahami autentikasi dulu
2. `frontend/docs-main/core/api/content/index.md` — API konten utama
3. Bagian fitur yang relevan dengan task kamu

### 2. Aturan Wajib untuk Kode Cockpit

```bash
# Selalu gunakan env vars, JANGAN hardcode URL atau API key
COCKPIT_API_URL=...
COCKPIT_API_KEY=...

# Gunakan lib/cockpit.ts sebagai satu-satunya titik akses ke Cockpit API
# Jangan memanggil Cockpit API langsung dari komponen
```

- **Gunakan `lib/cockpit.ts`** sebagai wrapper tunggal untuk semua panggilan API
- **Jangan** hardcode URL Cockpit atau API key di manapun selain `.env.local`
<!-- END:cockpit-agent-rules -->

---

## 🗂️ Struktur Proyek

```
.
├── app/                    # App Router
├── components/             # Komponen reusable
├── lib/
│   └── cockpit.ts          # ← Semua Cockpit API calls wajib lewat sini
├── public/
├── docs-main/              # ← Dokumentasi resmi Cockpit CMS (jangan edit)
├── .env.local              # API keys (JANGAN di-commit)
└── AGENT.md                # File ini
```

---

## 🚫 Larangan Keras

1. **Jangan** hardcode `COCKPIT_API_URL` atau `COCKPIT_API_KEY` di kode
2. **Jangan** memanggil Cockpit API langsung dari komponen — gunakan `lib/cockpit.ts`
3. **Jangan** berasumsi tentang struktur konten — cek `docs-main/core/concepts/content/`
4. **Jangan** abaikan deprecation notice dari Next.js
5. **Jangan** commit file `.env.local`
6. **Jangan** membuat file di `docs-main/`
---
