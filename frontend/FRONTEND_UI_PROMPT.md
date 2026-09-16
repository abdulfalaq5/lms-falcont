# Prompt Khusus: Frontend UI LMS (Backend Tidak Berubah)

> Gunakan prompt ini terpisah saat meminta Claude Code mengerjakan/merapikan tampilan frontend. Backend (NestJS, Knex, PostgreSQL, Swagger) sudah final — jangan disentuh sama sekali.

```
Kerjakan HANYA bagian frontend (folder frontend/) dari project LMS ini.
Backend (folder backend/) sudah final — JANGAN mengubah, menambah, atau
menghapus apapun di folder backend/, termasuk struktur API, DTO, response
format, endpoint, migration, seeder, atau konfigurasi Swagger. Frontend
harus menyesuaikan diri ke kontrak API backend yang sudah ada, bukan
sebaliknya.

Referensi gaya visual: Coursera (coursera.org). Ambil pola layout dan
komponennya, BUKAN aset/logo/kontennya:

- Warna dasar putih/netral terang dengan 1 warna primary tegas (biru atau
  warna brand pilihan sendiri) untuk CTA, link aktif, dan elemen penting.
  Teks gelap dengan kontras tinggi untuk keterbacaan.
- Pola card horizontal-scroll untuk daftar kelas per kategori di halaman
  katalog/dashboard User — card berisi thumbnail, badge kecil
  (level/kategori/status enrollment), judul kelas, nama instruktur, dan
  progress bar bila kelas sedang diikuti.
- Setiap section diberi heading besar + sub-teks pendek deskriptif sebelum
  grid/card konten muncul (pola: judul section → deskripsi singkat → konten).
- Navigasi atas simpel: logo kiri, menu utama, tombol akun/CTA di kanan.
  Untuk dashboard (setelah login), gunakan sidebar kiri dengan menu sesuai
  role yang sedang login (Super Admin / Admin / Instruktur / User).
- Badge/label status (pending, active, completed, dll) pakai warna
  background lembut/pastel dengan teks warna solid senada — bukan warna
  solid mencolok penuh.
- Card & elemen interaktif punya rounded corner halus (medium radius) dan
  shadow tipis, konsisten di semua tempat — hindari radius/shadow yang
  beda-beda tiap komponen.
- Tipografi: 1 typeface untuk seluruh teks sudah cukup asal skalanya jelas —
  heading besar & tebal, body text lebih kecil dengan line-height lega.
- Banyak whitespace antar section, tidak padat/sesak.

Ketentuan tambahan:
1. Kalender jadwal (FullCalendar), tabel nilai, dan form tugas tetap
   mengikuti gaya bersih ini: banyak whitespace, border tipis, tanpa elemen
   visual yang ramai.
2. Copy/teks di tombol dan pesan sistem harus jelas dan actionable dalam
   Bahasa Indonesia (contoh: "Lanjutkan Belajar", "Kumpulkan Tugas",
   "Lihat Nilai" — bukan "Submit" atau "View").
3. Sediakan empty state yang jelas untuk kondisi seperti "belum ada kelas
   diikuti" atau "belum ada tugas".
4. Dashboard tiap role harus punya penekanan visual berbeda sesuai
   kebutuhannya:
   - Super Admin/Admin: lebih data-dense (tabel, angka statistik)
   - Instruktur: fokus ke progress kelas & daftar tugas yang perlu dinilai
   - User: lebih ringan dan memotivasi (progress belajar, kelas berikutnya,
     deadline terdekat)
5. Gunakan shadcn/ui sebagai basis komponen, tapi sesuaikan warna, radius,
   dan spacing sesuai palet yang ditentukan — jangan biarkan terlihat seperti
   template shadcn default.
6. Pastikan responsif penuh sampai mobile dan kontras warna accessible
   (WCAG AA).

Sebelum mulai coding, buat dulu rencana desain singkat (palet warna final
dengan hex value, komponen card utama, struktur navigasi/sidebar per role),
lalu tinjau apakah rencana itu masih terasa generik — revisi bila perlu
sebelum lanjut ke implementasi.
```
