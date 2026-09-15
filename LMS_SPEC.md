# Spesifikasi Project: LMS E-Learning

## 1. Ringkasan Project
Platform Learning Management System (LMS) berbasis web dengan 4 role pengguna: Super Admin, Admin, Instruktur, dan User (Peserta). Sistem mencakup pendaftaran kelas, materi pembelajaran, kuis/penilaian, jadwal kalender, dan dashboard khusus per role.

## 2. Tech Stack yang Direkomendasikan

- **Frontend**: Next.js (React) + TypeScript + TailwindCSS
- **Backend**: NestJS (Node.js + TypeScript) — atau Next.js API routes bila ingin monolith
- **Database**: PostgreSQL
- **Query builder**: Knex.js (raw query builder, migration & seeder built-in)
- **API Documentation**: Swagger (OpenAPI) via `@nestjs/swagger`, tersedia di endpoint `/api/docs`
- **Auth**: JWT + refresh token, role-based middleware/guard
- **File storage**: lokal/S3-compatible (untuk video, dokumen materi)
- **Kalender**: FullCalendar.js (frontend) untuk render jadwal

> Alternatif: Laravel + Livewire/Inertia + spatie/laravel-permission + Filament (untuk panel admin), bila tim lebih familiar PHP.

### 2.1 Swagger (Dokumentasi API)
- Setup `@nestjs/swagger` di `main.ts`, generate dokumentasi otomatis dari decorator (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`)
- Setiap modul (auth, users, courses, enrollments, dll) wajib punya DTO dengan decorator Swagger agar muncul di dokumentasi
- Endpoint dokumentasi: `http://localhost:PORT/api/docs`
- Tambahkan security scheme Bearer JWT di Swagger config supaya bisa test endpoint yang butuh auth langsung dari Swagger UI

## 3. Role & Hak Akses (RBAC)

### 3.1 Super Admin
- Full access ke seluruh fitur sistem
- CRUD akun Admin
- Konfigurasi sistem global (branding, email, kebijakan sertifikat)
- Lihat audit log / activity log seluruh sistem
- Kelola kategori kursus/departemen

### 3.2 Admin
- CRUD Instruktur
- CRUD User (peserta)
- CRUD Kelas/Kursus (assign instruktur ke kelas)
- Approve/reject pendaftaran user (self-register)
- Kelola jadwal & kalender kelas
- Kelola pengumuman/broadcast (global atau per kelas)
- Lihat laporan rekap kelas & statistik

### 3.3 Instruktur
- CRUD materi (dokumen, video, embed link) untuk kelas yang diampu
- CRUD kuis (pilihan ganda dengan auto-grading, essay dengan manual grading)
- Input/edit nilai & generate raport per peserta
- Lihat progress belajar tiap peserta di kelasnya
- Kelola forum diskusi per kelas
- Input absensi sesi live
- Kelola bank soal (reusable antar kelas)

### 3.4 User (Peserta)
- Register (self-register atau didaftarkan Admin)
- Browse & enroll ke kelas
- Akses materi & ikuti sesi (live/rekaman)
- Kerjakan & submit tugas/kuis
- Lihat progress belajar sendiri
- Unduh sertifikat setelah kelas selesai
- Lihat riwayat nilai & tugas
- Terima notifikasi (deadline, jadwal sesi baru)

## 4. Alur Pendaftaran (Registration Flow)

### 4.1 Jalur 1 — Didaftarkan Admin
1. Admin input manual atau bulk import (CSV)
2. Sistem generate akun & kirim email undangan (set password)
3. User set password → akun aktif
4. Admin/User pilih kelas untuk user tsb, atau user pilih sendiri setelah login

### 4.2 Jalur 2 — Self-register
1. User isi form registrasi (nama, email, password, dll)
2. Verifikasi email (kirim link/kode OTP)
3. User login → browse katalog kelas → pilih kelas
4. Enrollment status:
   - Jika kelas terbuka bebas → langsung `active`
   - Jika kelas butuh approval/berbayar/kuota terbatas → `pending` sampai disetujui Admin

### 4.3 Status Enrollment
`pending` → `approved` → `active` → `completed` / `dropped`

## 5. Kalender & Jadwal

- Kalender ditampilkan berbeda sesuai role:
  - Admin: semua jadwal kelas di sistem
  - Instruktur: jadwal kelas yang diampu
  - User: jadwal kelas yang diikuti
- Item yang muncul di kalender: sesi live, deadline tugas, deadline kuis, tanggal mulai/akhir kelas
- Reminder otomatis (email/notifikasi in-app) H-1 sebelum sesi atau deadline
- (Opsional) Export ke .ics / sync Google Calendar

## 6. Dashboard per Role

| Role | Konten Dashboard |
|---|---|
| Super Admin | Total user, total kelas aktif, statistik sistem, log aktivitas terbaru |
| Admin | User baru, kelas berjalan, approval pending, jumlah instruktur aktif |
| Instruktur | Kelas diampu, tugas belum dinilai, jadwal sesi terdekat, progress kelas |
| User | Kelas diikuti, tugas mendatang/terlambat, progress belajar, sertifikat |

## 7. Skema Database (PostgreSQL) — Entitas Utama

```
users
- id (UUID, PK), name, email, password_hash, role (enum: super_admin, admin, instruktur, user), status, created_at

courses (kelas/kursus)
- id (UUID, PK), title, description, category_id, instructor_id, capacity, is_open_enrollment, price (nullable), start_date, end_date, status

categories
- id (UUID, PK), name

enrollments
- id (UUID, PK), user_id, course_id, status (pending/approved/active/completed/dropped), enrolled_at

materials
- id (UUID, PK), course_id, title, type (video/document/link), content_url, order, created_at

quizzes
- id (UUID, PK), course_id, title, type (pilihan_ganda/essay), created_by

quiz_questions
- id (UUID, PK), quiz_id, question_text, options (json, nullable), correct_answer (nullable), type

quiz_submissions
- id (UUID, PK), quiz_id, user_id, answers (json), score, submitted_at

assignments
- id (UUID, PK), course_id, title, description, due_date

assignment_submissions
- id (UUID, PK), assignment_id, user_id, file_url, submitted_at, grade, feedback

grades / reports
- id (UUID, PK), user_id, course_id, final_score, certificate_issued (bool)

schedules
- id (UUID, PK), course_id, title, type (session/deadline), start_time, end_time

announcements
- id (UUID, PK), course_id (nullable = global), title, content, created_by, created_at

forum_posts
- id (UUID, PK), course_id, user_id, content, parent_id (nullable, untuk reply), created_at

attendance
- id (UUID, PK), schedule_id, user_id, status (hadir/izin/alpha)

audit_logs
- id (UUID, PK), user_id, action, entity, entity_id, created_at
```

> Catatan: semua kolom `*_id` (foreign key) di atas juga bertipe UUID, mengacu ke UUID primary key tabel terkait. Gunakan extension `pgcrypto` (`gen_random_uuid()`) atau `uuid-ossp` (`uuid_generate_v4()`) di PostgreSQL sebagai default value kolom `id` pada migration Knex, misalnya:

```js
table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
```

### 7.1 Migration & Seeder dengan Knex
- Gunakan struktur folder `backend/src/database/migrations/` dan `backend/src/database/seeds/`
- Satu file migration per tabel, urutan sesuai dependency (tabel independen dulu: `users`, `categories`, baru tabel yang punya foreign key)
- Buat 1 file seeder per tabel di `backend/src/database/seeds/`, dengan urutan eksekusi mengikuti dependency yang sama:
  1. `01_users.ts` — seed dummy Super Admin, beberapa Admin, Instruktur, dan User
  2. `02_categories.ts`
  3. `03_courses.ts`
  4. `04_enrollments.ts`
  5. `05_materials.ts`
  6. `06_quizzes.ts` + `07_quiz_questions.ts`
  7. `08_quiz_submissions.ts`
  8. `09_assignments.ts` + `10_assignment_submissions.ts`
  9. `11_grades.ts`
  10. `12_schedules.ts`
  11. `13_announcements.ts`
  12. `14_forum_posts.ts`
  13. `15_attendance.ts`
  14. `16_audit_logs.ts`
- Jalankan via `knex seed:run` (semua file otomatis dieksekusi berurutan sesuai nama file)
- Password dummy di-hash (bcrypt) sebelum insert, jangan simpan plaintext meski data dummy

## 8. Struktur Folder Project

Project dipisah menjadi 2 folder utama dalam satu repository (monorepo) atau bisa juga 2 repo terpisah:

```
lms-project/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── enrollments/
│   │   │   ├── materials/
│   │   │   ├── quizzes/
│   │   │   ├── assignments/
│   │   │   ├── schedules/
│   │   │   ├── announcements/
│   │   │   ├── forums/
│   │   │   └── reports/
│   │   ├── common/
│   │   │   ├── guards/         # role-based guard (super_admin, admin, instruktur, user)
│   │   │   ├── decorators/
│   │   │   └── interceptors/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── super-admin/
│   │   │   ├── admin/
│   │   │   ├── instruktur/
│   │   │   └── user/
│   │   ├── courses/
│   │   └── calendar/
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── dashboard/
│   │   ├── calendar/
│   │   └── forms/
│   ├── lib/
│   │   ├── api.ts           # API client ke backend
│   │   └── auth.ts
│   ├── .env.local
│   └── package.json
│
└── README.md
```

## 9. Prompt Desain UI Frontend (untuk Claude Code)

Gunakan arahan berikut saat meminta Claude Code membangun tampilan frontend, supaya hasilnya modern dan tidak terlihat generik/template:

```
Rancang UI LMS ini sebagai design lead, bukan sekadar menyusun komponen default.
Ini adalah platform belajar online dengan 4 jenis pengguna (Super Admin, Admin,
Instruktur, Peserta) — desain harus terasa tenang, jelas, dan mendukung fokus
belajar, bukan seperti dashboard SaaS generik.

Ketentuan desain:
1. Tentukan palet warna khusus untuk brand LMS ini (4-6 warna dengan hex value),
   hindari default ungu-biru gradient atau tema "AI generated" (cream + serif +
   aksen terracotta, atau dark mode dengan aksen neon hijau/vermilion).
2. Gunakan maksimal 2 typeface (1 untuk heading, 1 untuk body) yang punya
   karakter jelas, bukan font default seperti Inter tanpa penyesuaian scale.
3. Layout dashboard harus membedakan hierarki tiap role secara visual —
   dashboard Super Admin/Admin boleh lebih data-dense, dashboard Instruktur
   fokus ke progress kelas, dashboard User harus terasa ringan dan memotivasi
   (progress belajar, kelas berikutnya, deadline terdekat).
4. Hindari pola generik: jangan pakai card dengan border-radius & shadow yang
   sama persis di semua tempat, jangan pakai label ALL CAPS di semua eyebrow
   text, jangan tambahkan angka urutan (01/02/03) kecuali memang menampilkan
   proses/tahapan belajar yang berurutan.
5. Gunakan komponen shadcn/ui sebagai basis, tapi sesuaikan warna, radius, dan
   spacing supaya tidak terlihat seperti template shadcn default.
6. Kalender jadwal harus terintegrasi rapi secara visual (bukan komponen
   FullCalendar bawaan tanpa styling), sesuaikan warna event berdasarkan tipe
   (sesi live, deadline tugas, deadline kuis).
7. Pastikan responsif penuh sampai mobile, kontras warna accessible (WCAG AA),
   dan ada state kosong (empty state) yang jelas untuk kondisi seperti "belum
   ada kelas diikuti" atau "belum ada tugas".
8. Copy/teks di tombol dan pesan sistem harus jelas dan actionable dalam
   Bahasa Indonesia (contoh: "Simpan Perubahan" bukan "Submit", "Kumpulkan
   Tugas" bukan "Submit Tugas").

Buat dulu rencana desain singkat (palet warna, tipografi, konsep layout)
sebelum mulai coding, lalu tinjau apakah rencana itu masih terasa generik —
revisi bila perlu sebelum lanjut ke implementasi.
```

## 10. Urutan Pengerjaan yang Disarankan (untuk Claude Code)

1. Setup project (Next.js + NestJS + Prisma + PostgreSQL), auth dasar (register/login/JWT)
2. Skema database & migration Prisma sesuai bagian 7
3. Modul User Management (CRUD user, role assignment) — Super Admin & Admin
4. Modul Course Management (CRUD kelas, kategori, assign instruktur)
5. Modul Enrollment (self-register + didaftarkan admin + approval flow)
6. Modul Materi & Konten (upload/embed video, dokumen)
7. Modul Kuis & Penilaian (quiz builder, auto-grading PG, manual grading essay)
8. Modul Tugas (assignment + submission + grading)
9. Modul Kalender & Jadwal (integrasi FullCalendar, reminder)
10. Modul Dashboard per role
11. Modul tambahan: pengumuman, forum diskusi, sertifikat PDF, notifikasi

## 12. Menjalankan Project (Docker & Tanpa Docker)

Komponen pendukung (database & lainnya) dijalankan lewat Docker, sedangkan `backend/` dan `frontend/` bisa dijalankan native (npm run dev) ATAU ikut di-dockerize — keduanya harus didukung.

### 12.1 Struktur Docker
```
lms-project/
├── docker-compose.yml          # untuk mode "database & komponen saja di Docker"
├── docker-compose.full.yml     # opsional: mode full (backend+frontend juga di Docker)
├── backend/
│   └── Dockerfile              # dipakai hanya kalau pakai docker-compose.full.yml
├── frontend/
│   └── Dockerfile              # dipakai hanya kalau pakai docker-compose.full.yml
```

### 12.2 docker-compose.yml (default — hanya database & komponen pendukung)
```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    container_name: lms_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: lms_user
      POSTGRES_PASSWORD: lms_password
      POSTGRES_DB: lms_db
    ports:
      - "5432:5432"
    volumes:
      - lms_pg_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: lms_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@lms.local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

  mailhog:
    image: mailhog/mailhog
    container_name: lms_mailhog
    restart: unless-stopped
    ports:
      - "1025:1025"   # SMTP untuk testing email verifikasi/notifikasi
      - "8025:8025"   # Web UI mailhog

volumes:
  lms_pg_data:
```

> `pgadmin` dan `mailhog` opsional, boleh dihapus dari compose kalau tidak diperlukan. Tambahkan `redis` di sini juga bila nanti butuh caching/queue (misalnya untuk job reminder kalender).

### 12.3 Mode "Tanpa Docker" (semua native)
- Install PostgreSQL secara lokal, buat database `lms_db` manual
- Sesuaikan `backend/.env` mengarah ke `localhost:5432` dengan kredensial lokal
- Jalankan `npm run dev` di `backend/` dan `frontend/` seperti biasa
- Email testing bisa pakai service SMTP lain (mis. Mailtrap) kalau tidak pakai mailhog

### 12.4 Mode "Dengan Docker" (hanya komponen pendukung)
- `docker compose up -d` → menjalankan Postgres (+ pgAdmin, mailhog)
- `backend/.env` tetap mengarah ke `localhost:5432` (port di-expose ke host), backend & frontend tetap dijalankan native dengan `npm run dev`
- Jalankan migration & seeder Knex seperti biasa setelah container Postgres siap (`docker compose ps` untuk cek status healthy)

### 12.5 Mode "Full Docker" (opsional, backend & frontend juga di container)
- Gunakan `docker-compose.full.yml` yang menambahkan service `backend` dan `frontend` dengan Dockerfile masing-masing, network yang sama dengan `postgres`
- Berguna untuk deployment/staging, tapi untuk development sehari-hari lebih disarankan mode 12.4 (agar hot-reload lebih cepat tanpa overhead container untuk kode yang sering berubah)

## 13. Catatan Tambahan
- Semua endpoint API harus dilindungi role-based guard sesuai matriks di bagian 3
- Gunakan soft-delete untuk data penting (user, course, submission)
- Sertakan seeding data dummy untuk testing tiap role
