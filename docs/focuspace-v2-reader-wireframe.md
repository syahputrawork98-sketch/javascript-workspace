# JavaScript Focuspace v2 Reader Wireframe

Dokumen ini merapikan arah UI `JavaScript Workspace` agar tampil sebagai `JavaScript Focuspace`: pengalaman membaca yang lebih nyaman untuk sumber konten `JavaScript Learning Hub`.

Fokus dokumen ini adalah jalur `v2`.

## Tujuan

- Menjadikan `JavaScript Learning Hub` sebagai sumber konten.
- Menjadikan `JavaScript Workspace` sebagai reader layer yang enak dilihat dan dibaca.
- Menyatukan pengalaman chapter agar `materi`, `gambar`, dan `examples` hadir dalam satu halaman yang konsisten.
- Tetap menampilkan `v1` sebagai arsip, tetapi tidak menjadi jalur utama.

## Prinsip UX

- `V2` harus terasa sebagai jalur utama.
- `V1` tetap terlihat, tetapi statusnya jelas sebagai arsip.
- User tidak membaca struktur file mentah, melainkan alur belajar.
- Satu chapter harus punya satu pengalaman baca yang utuh.
- Konten yang belum lengkap tetap tampil dengan status yang jujur, bukan disembunyikan.

## Alur Navigasi Utama

```text
Home
 -> V2 Library
 -> Rack Detail
 -> Book Detail
 -> Chapter Reader

Home
 -> V1 Archive
```

## Peta Halaman

### 1. Home

Tujuan:

- Menjelaskan posisi produk.
- Menampilkan pilihan `V2` dan `V1`.
- Menunjukkan progres konten.

Wireframe:

```text
+------------------------------------------------------------+
| JavaScript Focuspace                                       |
| Belajar JavaScript seperti membaca perpustakaan modern.    |
|                                                            |
| [Masuk ke V2]                    [Lihat Arsip V1]          |
+------------------------------------------------------------+

+---------------------------+  +-----------------------------+
| V2 - Library Aktif        |  | V1 - Arsip Referensi       |
| Jalur utama belajar.      |  | Versi lama untuk referensi |
| Rak, buku, chapter aktif. |  | dan perbandingan.          |
+---------------------------+  +-----------------------------+

+------------------------------------------------------------+
| Statistik Ringkas                                          |
| 9 rak direncanakan | 1 rak aktif | 7 buku tersedia         |
| total chapter | total example set | total visual           |
+------------------------------------------------------------+

+------------------------------------------------------------+
| Mulai dari Rak Aktif                                       |
| R01 Fondasi Bahasa                                         |
| Buku aktif: B00-B06                                        |
| [Buka R01]                                                 |
+------------------------------------------------------------+
```

Catatan:

- `V2` harus jadi kartu paling dominan.
- Statistik harus mengambil data real dari Learning Hub.
- `R02-R09` boleh muncul sebagai roadmap ringkas.

### 2. V2 Library

Tujuan:

- Menampilkan seluruh rak v2.
- Memisahkan rak aktif dan rak yang masih dibangun.

Wireframe:

```text
+------------------------------------------------------------+
| V2 Library                                                 |
| Perpustakaan utama JavaScript Learning Hub                 |
+------------------------------------------------------------+

+------------------------------------------------------------+
| Summary                                                    |
| Rak aktif | Buku tersedia | Chapter tersedia | Example set |
+------------------------------------------------------------+

+------------------------------------------------------------+
| R01 Fondasi Bahasa                         [Aktif]         |
| Sintaks inti, fungsi dasar, object, array, modules dasar.  |
| 7 buku | total chapter | total assets | total examples     |
| [Masuk ke Rak]                                             |
+------------------------------------------------------------+

+------------------------------------------------------------+
| R02 Runtime Dasar                        [Dalam Proses]    |
| Execution context, scope, closure, this, call stack.       |
| Buku belum tersedia.                                       |
+------------------------------------------------------------+
```

Aturan tampilan:

- Rak aktif memakai CTA jelas.
- Rak kosong tetap tampil dengan badge `Dalam Pembangunan`.
- Jumlah konten per rak perlu terlihat sebelum user masuk.

### 3. Rack Detail

Tujuan:

- Menjelaskan fokus rak.
- Menampilkan semua buku dalam rak.

Wireframe:

```text
+------------------------------------------------------------+
| R01 / Fondasi Bahasa                                       |
| Rak fondasi untuk pembaca yang baru mulai belajar JS.      |
| [Kembali ke V2 Library]                                    |
+------------------------------------------------------------+

+------------------------------------------------------------+
| Ringkasan Rak                                              |
| deskripsi singkat + coverage + status                      |
+------------------------------------------------------------+

+---------------------------+  +-----------------------------+
| B00 Tutorial Map          |  | B01 Lexical dan Grammar    |
| Buku orientasi            |  | 15 chapter                 |
| 6 chapter | 4 visual      |  | 15 example set            |
| [Buka Buku]               |  | [Buka Buku]               |
+---------------------------+  +-----------------------------+
```

Aturan tampilan:

- Buku tidak perlu tampil seperti file browser.
- Gunakan model kartu tipis seperti cover buku.
- Badge status:
  - `Lengkap`
  - `Sebagian`
  - `Map`
  - `Dalam Pembangunan`

### 4. Book Detail

Tujuan:

- Memberi pengantar buku.
- Menampilkan daftar chapter yang bisa dipilih.
- Membuat user langsung paham buku ini membahas apa.

Wireframe:

```text
+------------------------------------------------------------+
| R01 / B04                                                  |
| Functions dan Scope Dasar                                  |
| Fondasi fungsi, scope, class, generator, async function.   |
| 20 chapter | 20 example set | 20 visual map               |
| [Mulai dari Chapter 1]  [Lanjutkan Terakhir Dibaca]        |
+------------------------------------------------------------+

+------------------------------------------------------------+
| Tentang Buku                                               |
| Pengantar singkat dari README buku                         |
+------------------------------------------------------------+

+------------------------------------------------------------+
| Daftar Chapter                                             |
| C01 Parameter Lists Dasar                    [visual] [3x] |
| C02 Parameter Initializer                     [visual] [3x] |
| C03 Function Definitions                      [visual] [3x] |
| ...                                                        |
| C19 Async Arrow Function Definitions         [visual] [3x] |
+------------------------------------------------------------+
```

Aturan tampilan:

- List chapter lebih baik daripada card besar.
- Setiap row chapter menampilkan sinyal cepat:
  - kode chapter
  - judul
  - apakah ada visual
  - apakah ada example set
- Untuk buku seperti `B00`, tampilkan badge `Buku Orientasi`.

### 5. Chapter Reader

Tujuan:

- Menyatukan `materi`, `gambar`, dan `examples` dalam satu halaman.
- Menjadikan pembacaan chapter seragam di seluruh buku v2.

Wireframe desktop:

```text
+----------------------------+-------------------------------------------+
| Sidebar kiri               | Reader utama                              |
|----------------------------|-------------------------------------------|
| Buku ini                   | Breadcrumb                                |
| C01 ...                    | R01 / B04 / C19                           |
| C02 ...                    |                                           |
| ...                        | C19 - Async Arrow Function Definitions    |
| C19 ... active             | ringkasan chapter                         |
| C20 ...                    | [Prev] [Next]                             |
|                            |                                           |
| Di chapter ini             | ----------------------------------------  |
| - Materi                   | Materi                                    |
| - Gambar                   | markdown content                          |
| - Examples                 |                                           |
|                            | ----------------------------------------  |
| Status                     | Gambar                                    |
| - 1 visual                 | visual map + caption                      |
| - 3 examples               |                                           |
| - ready                    | ----------------------------------------  |
|                            | Examples                                  |
| Aksi                       | [Example 1] [Example 2] [Example 3]       |
| - Kembali ke Buku          | deskripsi                                 |
|                            | code block                                |
|                            | penjelasan                                |
+----------------------------+-------------------------------------------+
```

Wireframe mobile:

```text
+------------------------------------------------------------+
| Breadcrumb                                                 |
| Judul chapter                                              |
| ringkasan                                                  |
| [Materi] [Gambar] [Examples]                               |
+------------------------------------------------------------+

+------------------------------------------------------------+
| Materi                                                     |
+------------------------------------------------------------+

+------------------------------------------------------------+
| Gambar                                                     |
+------------------------------------------------------------+

+------------------------------------------------------------+
| [Ex 1] [Ex 2] [Ex 3]                                       |
| Example aktif                                              |
+------------------------------------------------------------+
```

## Struktur Section di Chapter Reader

Urutan section disarankan tetap:

1. `Chapter header`
2. `Materi`
3. `Gambar`
4. `Examples`
5. `Catatan belajar`
6. `Navigasi prev/next`

Ini penting supaya user cepat hafal pola baca.

## Sidebar Chapter

Sidebar tidak boleh terlalu padat. Cukup 4 blok:

### A. Buku ini

- Daftar chapter dalam buku
- Chapter aktif harus sangat jelas

### B. Di chapter ini

- `Materi`
- `Gambar`
- `Examples`

Blok ini adalah anchor navigation.

### C. Status

- `Visual tersedia` atau `Visual belum tersedia`
- `3 examples`
- `Spec aligned` bila memang ada metadata tersebut

### D. Aksi

- `Kembali ke Buku`
- `Chapter Sebelumnya`
- `Chapter Berikutnya`

## Section Materi

Bagian ini adalah isi markdown chapter.

Aturan presentasi:

- Lebar baca harus nyaman, jangan terlalu penuh.
- Heading harus jelas.
- Code block di dalam materi harus konsisten dengan style examples.
- Jika chapter sangat panjang, gunakan table of contents mini dari heading markdown.

## Section Gambar

Bagian gambar tidak cukup hanya preview asset.

Format yang disarankan:

```text
Judul visual
gambar besar
caption 1-3 kalimat
opsi buka penuh
```

Fallback saat visual belum ada:

```text
Visual chapter ini masih dalam proses penyusunan.
```

## Section Examples

Karena struktur v2 memakai `example.js`, `example-02.js`, dan `example-03.js`, section ini paling cocok memakai segmented tabs:

```text
[Example 1] [Example 2] [Example 3]
```

Isi panel:

1. Judul example
2. Penjelasan singkat
3. File code aktif
4. Penjelasan perilaku kode
5. Link `Buka file asli` bila perlu

Jika example terdiri dari banyak file pendukung, gunakan sidebar mini di dalam panel example:

```text
README
example.js
example-02.js
helper.js
config.js
```

Tetapi default awal untuk `Learning Hub` cukup menonjolkan tiga file utama.

## Status Konten

Karena isi v2 belum merata, UI harus mengenal empat keadaan:

- `Lengkap`
- `Sebagian`
- `Map`
- `Dalam Pembangunan`

Contoh penerapan:

- `R02-R09`: `Dalam Pembangunan`
- `B00`: `Map`
- `B05/B06`: `Sebagian` untuk coverage visual yang belum penuh
- `B04`: `Lengkap`

## Rekomendasi Bahasa Tampilan

Istilah yang dipakai sebaiknya konsisten:

- `Rak`
- `Buku`
- `Chapter`
- `Materi`
- `Gambar`
- `Examples`

Jangan campur terlalu banyak istilah teknis seperti `item`, `section`, atau `viewer` di UI utama. Istilah itu boleh tetap hidup di level internal kode.

## Arah Visual

Fokus visual yang disarankan:

- Nuansa perpustakaan modern, bukan dashboard admin.
- Warna hangat seperti kertas, tinta, kayu muda, hijau-teal lembut.
- Heading lebih berkarakter, body text tetap nyaman dibaca panjang.
- Card buku terasa seperti cover tipis.
- Reader chapter terasa seperti lembar baca, bukan panel dokumentasi.

Hindari:

- putih polos + border abu-abu generik di semua tempat
- semua halaman terasa seperti CMS
- chapter ditampilkan sebagai daftar file mentah

## Pemetaan ke Route Saat Ini

Route saat ini:

- `/` -> home
- `/racks` -> library v2
- `/racks/[rackId]` -> detail rak
- `/racks/[rackId]/books/[bookId]` -> detail buku
- `/racks/[rackId]/books/[bookId]/sections/[section]/[itemId]` -> item tunggal
- `/legacy` -> arsip v1

Masalah route saat ini:

- `materi`, `asset`, dan `example` masih dibaca sebagai item terpisah
- user belum mendapat pengalaman `satu chapter = satu halaman`
- halaman buku masih menonjolkan istilah `section/item`, bukan `chapter`

Target UX di atas route yang ada:

- tetap pakai sumber data yang sama
- tambahkan layer agregasi chapter
- gabungkan chapter markdown + asset chapter + example chapter dalam satu reader

## Rekomendasi Implementasi Bertahap

### Tahap 1

- Rapikan `Home` agar menonjolkan `V2` vs `V1`
- Tambahkan statistik konten real
- Bedakan rak aktif dan rak kosong

### Tahap 2

- Ubah `Book Detail` agar berfokus pada daftar chapter, bukan daftar section mentah
- Tampilkan progress visual dan examples per chapter

### Tahap 3

- Buat `Chapter Reader` baru
- Gabungkan `chapter + visual + examples` dalam satu halaman
- Tambahkan sidebar chapter

### Tahap 4

- Tambahkan progress reading
- Tambahkan last-read chapter
- Tambahkan mode fokus baca

## Komponen UI yang Disarankan

- `VersionSplitHero`
- `LibraryStatsStrip`
- `RackShelfCard`
- `BookCoverCard`
- `BookChapterList`
- `ChapterReaderShell`
- `ChapterSidebar`
- `ChapterMaterialSection`
- `ChapterVisualSection`
- `ChapterExamplesSection`
- `ExampleSwitcher`
- `ContentStatusBadge`

## Keputusan Produk yang Disarankan

- `V2` menjadi default landing path.
- `V1` tetap tersedia, tetapi diberi label arsip.
- `Chapter` menjadi unit baca utama.
- `Materi`, `Gambar`, dan `Examples` tidak dipisah ke halaman berbeda.
- Konten yang belum lengkap tetap terlihat dengan label status yang jelas.

## Ringkasan Singkat

Tujuan akhirnya adalah mengubah pengalaman dari:

```text
browser file + viewer markdown
```

menjadi:

```text
perpustakaan digital + reader chapter yang utuh
```

Itu berarti user tidak lagi merasa sedang membuka folder, melainkan sedang membaca buku.
