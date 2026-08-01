# Panduan Membuat Custom Component untuk Cockpit CMS di Frontend

Dokumen ini menjelaskan alur untuk membuat custom component baru agar dapat dirender secara dinamis melalui **Pages Addon di Cockpit CMS** ke frontend Next.js.

> [!NOTE]
> Sistem menggunakan file `CustomComponentRenderer.jsx` sebagai *dispatcher* yang akan mencocokkan tipe/nama komponen dari payload Cockpit CMS dengan React Component yang sesuai.

## Langkah 1: Buat File Component Baru

Buat file komponen React Anda di dalam folder khusus untuk custom component Cockpit, yaitu di:
[`frontend/components/cockpit_custom_components/`](file:///Users/mocca/Documents/GitHub/bmdev/frontend/components/cockpit_custom_components)

**Contoh `MyCustomComponent.jsx`**:

```jsx
// frontend/components/cockpit_custom_components/MyCustomComponent.jsx

export default function MyCustomComponent({ data }) {
  // `data` berisi payload dari field yang Anda isi di Cockpit CMS
  return (
    <div className="p-4 border rounded bg-gray-100">
      <h3 className="text-xl font-bold">{data?.title || 'Default Title'}</h3>
      <p>{data?.description || 'Default description'}</p>
    </div>
  );
}
```

## Langkah 2: Export Component (Opsional tapi Direkomendasikan)

Tambahkan export komponen Anda ke dalam file `index.js` agar import lebih rapi.

Buka file [`index.js`](file:///Users/mocca/Documents/GitHub/bmdev/frontend/components/cockpit_custom_components/index.js) di folder yang sama:

```javascript
// frontend/components/cockpit_custom_components/index.js

export { default as MyCustomComponent } from "./MyCustomComponent";
```

## Langkah 3: Daftarkan di CustomComponentRenderer

Ini adalah langkah paling krusial. Buka file [`CustomComponentRenderer.jsx`](file:///Users/mocca/Documents/GitHub/bmdev/frontend/components/cockpit_custom_components/CustomComponentRenderer.jsx) dan lakukan dua hal:

**1. Import Component di bagian atas file:**

```jsx
import MyCustomComponent from "./MyCustomComponent";
```

**2. Tambahkan logika mapping `if` di dalam function `CustomComponentRenderer`:**

Variabel `rawComponent` berisi nama/tipe komponen dari Cockpit CMS yang sudah diubah menjadi format *lowercase* dan menggunakan tanda hubung.

```jsx
  if (rawComponent === "mycustomcomponent" || rawComponent === "my-custom-component") {
    return <MyCustomComponent data={data} />;
  }
```

## Langkah 4: Panggil dari Cockpit CMS

Saat Anda menambahkan blok komponen di layout builder Cockpit CMS, pastikan nama (identifier/type) dari komponen tersebut sesuai dengan apa yang Anda tulis di kondisi `if` pada Langkah 3.

> [!TIP]
> Misalnya tipe komponen diatur menjadi `My Custom Component`, `MyCustomComponent`, atau `my-custom-component` di Cockpit. Data field tambahan (seperti `title`, `description`) yang dibuat di Cockpit akan otomatis terkirim dan bisa diakses melalui props `{ data }` di komponen React Anda.

## Langkah 5: Menambahkan Kunci Metadata (Meta Keys)

Berikut adalah rincian lengkap mengenai kunci metadata (*meta keys*) yang dapat digunakan pada **`SectionComponent`** dan **`GridComponent`** beserta kegunaannya masing-masing:

---

### 1. SectionComponent (`Section`)
Digunakan untuk mengonfigurasi layout section/seksi pembungkus konten utama halaman.

| Nama Kunci (Meta Key) | Tipe Data | Nilai Contoh | Kegunaan |
| :--- | :--- | :--- | :--- |
| **`hScreen`** | Boolean | `true` / `1` | Membuat tinggi seksi ini **setinggi layar penuh** browser (menambahkan kelas Tailwind `min-h-screen h-full`). |
| **`itemCenter`** | Boolean | `true` / `1` | Menyejajarkan seluruh item di dalam seksi ini secara **vertikal tepat di tengah** (menggunakan `flex flex-col justify-center h-full`). |
| **`contentCenter`** | Boolean | `true` / `1` | Menyejajarkan seksi secara **horizontal/tengah grid** (`flex items-center h-full`) dan menonaktifkan margin bawaan. |
| **`backgroundColor`** <br> *(atau `backgroudColor` / `color`)* | String | `"#f0f0f0"` / `"ffffff"` | Mengubah **warna latar belakang** seksi secara dinamis. Jika Anda menuliskan kode HEX tanpa tanda `#` (seperti `"ffffff"`), sistem akan otomatis melengkapinya menjadi `"#ffffff"`. |

---

### 2. GridComponent (`Grid`)
Digunakan untuk mengonfigurasi layout grid (baris & kolom) serta masing-masing kolom di dalamnya.

#### A. Setelan Grid Tingkat Atas (Grid Container Meta):
| Nama Kunci (Meta Key) | Tipe Data | Nilai Contoh | Kegunaan |
| :--- | :--- | :--- | :--- |
| **`itemCenter`** | Boolean | `true` / `1` | Menyejajarkan semua kolom di dalam grid ini agar **rata tengah secara vertikal** (menambahkan kelas `items-center` pada container grid). |
| **`height`** | String | `"100%"` | Memaksa kontainer grid untuk mengisi **tinggi 100%** dari elemen induknya (menambahkan kelas `h-full` dan gaya inline `height: 100%`). |

#### B. Setelan Tiap Kolom Grid (Column Meta):
*Setelan ini dipasang pada array `columns` di masing-masing objek kolom.*

| Nama Kunci (Meta Key) | Tipe Data | Nilai Contoh | Kegunaan |
| :--- | :--- | :--- | :--- |
| **`itemCenter`** | Boolean | `true` / `1` | Mengatur agar konten di dalam kolom spesifik ini berada di **tengah-tengah** baik secara horizontal maupun vertikal (`flex items-center justify-center`). |
| **`height`** | String | `"100%"` | Memaksa isi kolom spesifik ini untuk mengambil **tinggi penuh 100%** mengikuti tinggi baris gridnya. |
| **`rowspan`** <br> *(atau `rowSpan` / `row_span`)* | Angka/String | `2` / `"3"` | **Menggabungkan Baris (Row Span)**. Membuat kolom ini memanjang vertikal ke bawah sebanyak X baris di layar desktop (menggunakan kelas `md:row-span-X`). *Secara otomatis memicu tinggi kolom menjadi h-full.* |
| **`colspan`** <br> *(atau `colSpan` / `col_span`)* | Angka/String | `2` / `"3"` | **Menggabungkan Kolom (Col Span)**. Membuat kolom ini melebar horizontal ke samping sebanyak X kolom di layar desktop (menggunakan kelas `md:col-span-X`). |