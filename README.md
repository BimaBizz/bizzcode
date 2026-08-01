# CockpitNest (Next.js + Cockpit CMS)

Starter frontend Next.js App Router dengan sumber konten dari Cockpit CMS, termasuk dukungan Cockpit Pro (Pages, Detektivo, Personi) dan render layout dinamis.

## Fitur yang sudah diimplementasikan

- Integrasi Cockpit API client dan query helper untuk konten, menu, post, page, dan settings.
- Routing locale berbasis path `/{locale}` (default: `id`, `en`).
- Blog listing dan detail post.
- Dynamic page route `/{locale}/[...slug]`.
- Draft mode dan disable draft mode endpoint.
- Cockpit Pro integration:
  - Pages API (`/pages/*`) untuk menu, route, dan page.
  - Detektivo search proxy endpoint (`/api/detektivo/{index}`).
  - Personi helper untuk audience-based variant resolution.
- Dynamic layout rendering dari field layout/content/body page Cockpit.

## 1) Setup environment

Buat file `.env.local`:

```bash
COCKPIT_API_URL=https://your-cockpit-domain/api
COCKPIT_API_KEY=your-public-read-key

# Optional, dipakai saat Draft Mode
COCKPIT_PREVIEW_API_KEY=your-preview-read-key
COCKPIT_PREVIEW_SECRET=your-preview-secret

# Optional, custom locale
COCKPIT_LOCALES=id,en
COCKPIT_DEFAULT_LOCALE=id

# Optional, locale behavior for Cockpit API
# true  -> kirim locale mengikuti route aktif (dengan mapping jika ada)
# false -> pakai 1 locale API tetap (lihat COCKPIT_DEFAULT_API_LOCALE)
COCKPIT_MULTI_LANGUAGE_ENABLED=true
COCKPIT_DEFAULT_API_LOCALE=id_ID
# Format: appLocale:cockpitLocale, dipisah koma
COCKPIT_LOCALE_MAP=id:id_ID,en:en_US

# Optional, override nama model Cockpit (fallback mode non-Pro)
COCKPIT_MODEL_POSTS=posts
COCKPIT_MODEL_PAGES=pages
COCKPIT_MODEL_SITE_SETTINGS=site_settings
COCKPIT_MODEL_MENUS=menus

# Cockpit Pro switches
COCKPIT_PRO_PAGES_ENABLED=true
COCKPIT_PRO_PAGES_DEFAULT_MENU=main
COCKPIT_PRO_DETEKTIVO_ENABLED=true
COCKPIT_PRO_PERSONI_ENABLED=true
```

Catatan:
- Jika flag Pro dimatikan, aplikasi fallback ke model collection/tree standard.
- Jika flag Pro diaktifkan, query menu/page akan otomatis memakai endpoint Pro.

## 2) Jalankan aplikasi

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## 3) Arsitektur konten

### Mode non-Pro (fallback)

- Singleton `site_settings` untuk data global situs.
- Collection `posts` untuk blog.
- Collection `pages` untuk halaman.
- Tree `menus` untuk navigasi.

### Mode Pro (recommended)

- Pages addon menjadi sumber menu, route, dan page.
- Dynamic route dan homepage akan membaca payload page dari endpoint `/pages/page`.

## 4) Dynamic layout rendering

Renderer layout ada di `components/layout-renderer.jsx` dan dipakai pada:

- `app/[locale]/[...slug]/page.js`
- `app/[locale]/page.js`

Prioritas field yang dirender:

1. `page.layout` (array)
2. `page.content` (array)
3. `page.body` (array)
4. fallback ke HTML string `content/body`

Komponen layout yang sudah didukung:

- `heading`
- `richtext`
- `html`
- `markdown`
- `image`
- `link`
- `button`
- `section` (nested children)
- `grid` (nested columns)
- `spacer`
- `hero`

### Mapping field Cockpit Admin -> renderer

Gunakan tabel ini saat membuat blok layout di Cockpit Admin.

| Component | Field utama yang dibaca | Catatan |
| --- | --- | --- |
| `heading` | `data.text`, `data.level` | `level` default ke `2` jika kosong. |
| `richtext` | `data.html` atau `data.content` | Dirender sebagai HTML. |
| `html` | `data.html` | HTML mentah. Pastikan konten aman. |
| `markdown` | `data.markdown` atau `data.content` | Dirender dengan parser markdown sederhana. |
| `image` | `data.src`, `data.alt`, `data.caption` | `src` bisa absolute URL atau asset URL Cockpit. |
| `link` | `data.href`, `data.label`, `data.target` | `label` fallback ke `href`. |
| `button` | `data.href`, `data.label`, `data.variant` | `variant` opsional untuk styling. |
| `section` | `components[]` atau `data.components[]` | Bisa nested blok lain. |
| `grid` | `columns[].components[]`, `data.colWidth` | Cocok untuk layout 2-3 kolom. |
| `spacer` | `data.size` atau `data.height` | Untuk jarak vertikal antarblok. |
| `hero` | `data.headline`, `data.subheadline`, `data.cta_text`, `data.cta_url` | Komponen highlight di atas halaman. |

Contoh ringkas per komponen:

```json
[
  { "component": "heading", "data": { "level": 1, "text": "Judul Halaman" } },
  { "component": "richtext", "data": { "html": "<p>Intro dari editor.</p>" } },
  { "component": "markdown", "data": { "markdown": "## Subjudul\n\nIsi markdown" } },
  { "component": "image", "data": { "src": "/storage/uploads/hero.jpg", "alt": "Hero" } },
  { "component": "button", "data": { "label": "Lihat Produk", "href": "/id/products" } }
]
```

Contoh payload layout minimal:

```json
[
  {
    "component": "hero",
    "data": {
      "headline": "Selamat Datang",
      "subheadline": "Konten dari Cockpit Pro Pages",
      "cta_text": "Mulai",
      "cta_url": "/blog"
    }
  },
  {
    "component": "grid",
    "data": { "colWidth": "1-2" },
    "columns": [
      {
        "components": [
          {
            "component": "heading",
            "data": { "level": 2, "text": "Kolom A" }
          }
        ]
      },
      {
        "components": [
          {
            "component": "markdown",
            "data": { "markdown": "## Kolom B\n\nIsi markdown" }
          }
        ]
      }
    ]
  }
]
```

## 5) Cockpit Pro API helper yang tersedia

### Pages helper

File: `lib/pro/pages.js`

- `fetchMenus()` -> `/pages/menus`
- `fetchMenu(name)` -> `/pages/menu/{name}`
- `fetchPagesTree()` -> `/pages/pages`
- `fetchPageByRoute()` -> `/pages/page`
- `fetchPageById(id)` -> `/pages/page/{id}`
- `fetchRoutes()` -> `/pages/routes`
- `fetchPagesSettings()` -> `/pages/settings`
- `fetchSitemap()` -> `/pages/sitemap`

### Detektivo helper

File: `lib/pro/detektivo.js`

- `advancedSearch({ index, q, ... })` -> `/detektivo/search/{index}`

Endpoint proxy Next.js:

- `GET /api/detektivo/{index}?q=keyword&limit=10&offset=0&locale=id`

### Personi helper

File: `lib/pro/personi.js`

- `resolveVariant(content, audienceContext)` untuk memilih varian terbaik berbasis audience.
- `personiToQuery(audienceContext)` untuk membentuk query param `personi`, `personi_vars`, dan `tz_offset`.

## 6) Draft mode (preview)

Enable:

- `/api/draft?secret=<COCKPIT_PREVIEW_SECRET>&slug=/id/blog/my-post`

Disable:

- `/api/draft/disable`

## 7) Catatan implementasi

- Dynamic metadata page sudah membaca field SEO Pro (`seo.title`, `seo.description`) dengan fallback ke field legacy.
- Homepage locale akan mencoba render page route `/` dari Pages Pro saat flag aktif.
- Untuk mapping komponen layout tambahan, tambahkan case baru di `components/layout-renderer.jsx` lalu update tabel mapping di atas agar sinkron.
