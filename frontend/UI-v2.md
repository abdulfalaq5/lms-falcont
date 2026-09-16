# Prompt Khusus: Landing Page & Banner (Terinspirasi Struktur Coursera)

> Prompt ini fokus untuk halaman landing/beranda publik LMS (sebelum login) — termasuk banner utama. Gunakan terpisah dari prompt dashboard internal. Cocok dipakai di Claude Code maupun Lovable, lalu hasil keduanya dipadukan.
>
> Catatan: prompt ini mengambil **pola struktur & layout** dari halaman Coursera (susunan section, tipe komponen, perilaku carousel), BUKAN meniru teks, gambar, logo, atau aset asli mereka — semua konten, salinan (copy), dan ilustrasi harus original milik LMS ini.

```
Buat landing page publik untuk platform LMS ini, dengan struktur section
mengikuti pola berikut (isi & gaya visual disesuaikan dengan brand LMS
sendiri, jangan pakai copy/logo/aset dari sumber manapun):

1. HEADER / NAVBAR
   - Logo di kiri
   - Search bar di tengah/kanan untuk cari kelas/kursus (rounded input,
     ikon kaca pembesar, placeholder "Cari kelas, topik, atau instruktur")
   - Menu: Jelajahi Kelas, Kategori, Tentang, kemudian tombol "Masuk" (outline)
     dan "Daftar Gratis" (solid, warna primary) di paling kanan

2. HERO / BANNER UTAMA
   - Layout 2 kolom: kiri teks (headline besar 1-2 baris + sub-headline 1
     kalimat + search bar besar atau tombol CTA ganda "Mulai Belajar" /
     "Lihat Semua Kelas"), kanan ilustrasi/foto orang belajar (ilustrasi
     flat design atau foto dengan overlay warna brand)
   - Background section memakai warna primary lembut atau gradient halus,
     bukan putih polos, supaya banner terasa menonjol dari section lain
   - Tambahkan baris kecil di bawah CTA berisi social proof singkat
     (mis. "Dipercaya X+ peserta" / logo mitra instansi) — opsional

3. CATEGORY CHIPS / QUICK LINKS
   - Baris horizontal berisi chip/pill kategori kelas (mis. Data, IT,
     Bisnis, Desain, Bahasa, Kepemimpinan) tepat di bawah hero,
     masing-masing clickable menuju filter katalog

4. SECTION "KELAS POPULER" / "PILIHAN UNTUKMU"
   - Heading besar + sub-teks singkat di atas
   - Grid/carousel horizontal-scroll berisi product card kelas:
     thumbnail di atas, badge kecil (level/kategori) di pojok, judul kelas,
     nama instruktur, rating bintang atau jumlah peserta, dan CTA "Lihat
     Detail"
   - Tombol navigasi carousel (panah kiri/kanan) muncul saat hover di
     desktop, swipe di mobile

5. SECTION "JELAJAHI BERDASARKAN TUJUAN"
   - Beberapa card besar dengan ikon/ilustrasi + judul singkat, mewakili
     tujuan belajar berbeda (mis. "Mulai Karier Baru", "Tingkatkan
     Skill di Pekerjaan Saat Ini", "Belajar untuk Sertifikasi") —
     masing-masing mengarah ke katalog kelas yang relevan

6. SECTION STATISTIK / KEPERCAYAAN
   - Baris angka besar dengan label singkat di bawahnya (mis. jumlah kelas,
     jumlah peserta aktif, jumlah instruktur, tingkat kelulusan)

7. SECTION TESTIMONI (opsional)
   - Card testimoni dengan foto/avatar, nama, peran, dan kutipan singkat
     dalam Bahasa Indonesia — gunakan data dummy/placeholder, bukan
     testimoni asli dari sumber manapun

8. FOOTER
   - Multi-kolom: Tentang, Kategori Populer, Untuk Instruktur, Bantuan,
     Kebijakan Privasi/Syarat — plus ikon sosial media dan copyright line

9. FLOATING CHAT WIDGET (opsional)
   - Bubble chat di pojok kanan bawah, label singkat (mis. "Tanya Kami" /
     "Bantuan"), untuk FAQ/live chat — bisa dihubungkan ke fitur bantuan
     LMS nanti

Ketentuan visual:
- Palet warna: putih/netral terang sebagai dasar, 1 warna primary tegas
  (tentukan hex value spesifik, jangan default biru Coursera persis — pilih
  turunan warna lain: teal, indigo, atau warna brand sendiri) untuk CTA,
  chip aktif, dan aksen penting
- Card konsisten: rounded corner medium, shadow tipis, hover state (scale
  kecil atau shadow lebih tegas)
- Tipografi: heading besar & tebal, body text ukuran sedang dengan
  line-height lega, hindari font default tanpa penyesuaian scale
- Banyak whitespace antar section, section dipisah jelas (bisa dengan
  warna background berselang-seling: putih - abu sangat muda - putih)
- Semua CTA text actionable dalam Bahasa Indonesia
- Responsif penuh sampai mobile: hero jadi 1 kolom (teks di atas,
  ilustrasi di bawah atau disembunyikan), carousel tetap swipeable,
  category chips scroll horizontal

Halaman ini murni landing/marketing — TIDAK terhubung ke logic backend
autentikasi/dashboard yang sudah didefinisikan sebelumnya kecuali tombol
"Masuk" dan "Daftar" yang mengarah ke halaman login/register yang sudah ada.
Jangan ubah struktur API atau logic backend.
```
