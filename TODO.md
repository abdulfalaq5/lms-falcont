# TODO — LMS E-Learning

Diturunkan dari [LMS_SPEC.md](LMS_SPEC.md), diurutkan mengikuti §10 (Urutan Pengerjaan yang Disarankan). Centang tiap item saat selesai.

## 0. Setup Awal
- [x] Init monorepo: `backend/`, `frontend/`, `README.md`
- [x] `docker-compose.yml` (postgres, pgadmin, mailhog) — §12.2 (Postgres di-mapping ke port 5433, lihat README)
- [x] Setup backend NestJS + TypeScript, struktur folder `modules/`, `common/guards`, `common/decorators` — §8
- [x] Setup Knex (bukan Prisma, sesuai §7.1), config `.env` DB
- [x] Setup frontend Next.js + TypeScript + TailwindCSS, struktur `app/(auth)`, `app/dashboard`, `components/`, `lib/` — §8 (komponen UI dibuat custom, bukan shadcn/ui — lihat catatan §11)
- [x] Setup Swagger (`@nestjs/swagger`) di `main.ts`, Bearer JWT security scheme, endpoint `/api/docs` — §2.1
- [x] Auth dasar: register/login, JWT + refresh token, role-based guard

## 1. Skema Database & Migration (§7)
- [x] Migration Knex per tabel, urutan dependency: `users`, `categories` → `courses`, `enrollments` → `materials`, `quizzes`, `quiz_questions`, `quiz_submissions`, `assignments`, `assignment_submissions`, `grades`, `schedules`, `announcements`, `forum_posts`, `attendance`, `audit_logs`
- [x] Semua PK UUID pakai `gen_random_uuid()`
- [x] Soft-delete di tabel penting: `users`, `courses`, `assignment_submissions` — §13
- [x] Seeder Knex 01–16 sesuai urutan §7.1 (password bcrypt-hashed)
- [x] Jalankan `knex migrate:latest && knex seed:run`, verifikasi data dummy tiap role (diverifikasi — 16 migration + 16 seed berhasil, login tiap role berfungsi)

## 2. Modul User Management (Super Admin & Admin)
- [x] CRUD akun Admin/Instruktur/User dengan pembatasan role (Super Admin kelola semua, Admin hanya Instruktur & User)
- [x] Role assignment & guard per endpoint sesuai matriks §3
- [x] Audit log utk aksi CRUD user (Super Admin bisa lihat) — endpoint `GET /audit-logs`
- [ ] Approve/reject pendaftaran **user** (akun, bukan enrollment) — belum ada alur approval akun self-register; saat ini self-register langsung `active`
- [ ] Halaman frontend CRUD user (Super Admin/Admin) — backend siap, UI belum dibuat

## 3. Modul Course Management
- [x] CRUD kategori kursus (Super Admin) — backend + guard
- [x] CRUD kelas/kursus (Admin) — assign instruktur, capacity, open enrollment, harga (nullable)
- [x] Browse/katalog kelas (frontend `/courses`, publik)
- [ ] Halaman frontend CRUD kelas & kategori untuk Admin/Super Admin — backend siap, UI belum dibuat

## 4. Modul Enrollment
- [x] Self-register ke kelas dari katalog (frontend + backend)
- [ ] Verifikasi email (OTP/link) saat self-register — disederhanakan (akun langsung aktif, belum ada SMTP/mailhog integration)
- [ ] Didaftarkan Admin: bulk import CSV — belum diimplementasi (bisa buat manual lewat endpoint create user)
- [x] Flow status: `pending → approved → active → completed / dropped` — §4.3
- [x] Logic: kelas open enrollment → langsung `active`; kelas approval/berbayar/kuota terbatas → `pending`
- [x] Endpoint + halaman approval enrollment (Admin) — `/dashboard/admin/enrollments`

## 5. Modul Materi & Konten
- [x] Backend CRUD materi per kelas: dokumen, video, embed link (Instruktur, kelas yang diampu saja)
- [x] Upload file lokal (`POST /uploads`, disajikan statis dari `/uploads`)
- [x] Ordering materi (`order` field)
- [ ] Halaman frontend untuk Instruktur kelola materi & peserta akses materi — backend siap, UI belum dibuat

## 6. Modul Kuis & Penilaian
- [x] Backend quiz builder: pilihan ganda + essay (Instruktur), guard kepemilikan kelas
- [x] Auto-grading pilihan ganda
- [x] Manual grading essay (`PATCH /quizzes/submissions/:id/grade`)
- [x] Submission kuis oleh User + skor tersimpan
- [ ] Bank soal reusable antar kelas — saat ini soal langsung melekat ke satu kuis, belum ada bank soal terpisah
- [ ] Halaman frontend quiz builder, pengerjaan kuis, & grading — backend siap, UI belum dibuat

## 7. Modul Tugas (Assignment)
- [x] Backend CRUD assignment per kelas (due_date), guard kepemilikan kelas
- [x] Submission tugas oleh User (file_url dari hasil upload)
- [x] Grading + feedback oleh Instruktur
- [x] Raport/nilai akhir per peserta (`grades`), flag `certificate_issued`
- [ ] Halaman frontend submission tugas (User) & grading (Instruktur) — backend siap, UI belum dibuat

## 8. Modul Kalender & Jadwal
- [x] Kalender kustom di frontend (`/calendar`), warna event per tipe (sesi live = biru, deadline = terracotta) — bukan FullCalendar.js, dibuat list-view custom karena keterbatasan waktu
- [x] Render jadwal beda per role (Admin: semua, Instruktur: kelas diampu, User: kelas diikuti) — `GET /schedules/calendar`
- [x] Item kalender: sesi live, deadline (schema `type: session/deadline`, tidak membedakan deadline tugas vs kuis secara eksplisit)
- [ ] Reminder otomatis H-1 (email/in-app) — belum diimplementasi, butuh scheduler (cron) + integrasi mailhog
- [ ] (Opsional) export .ics / sync Google Calendar — belum dikerjakan

## 9. Modul Dashboard per Role
- [x] Dashboard Super Admin: total user, kelas aktif, log aktivitas (data-dense)
- [x] Dashboard Admin: user baru, kelas berjalan, approval pending, instruktur aktif (data-dense)
- [x] Dashboard Instruktur: kelas diampu, tugas belum dinilai, jadwal sesi terdekat (progress-focused)
- [x] Dashboard User: kelas diikuti, deadline terdekat, nilai & sertifikat (ringan, memotivasi)

## 10. Modul Tambahan
- [x] Backend pengumuman/broadcast (global atau per kelas) — belum ada halaman frontend
- [x] Backend forum diskusi per kelas (dengan reply/`parent_id`) — belum ada halaman frontend
- [x] Backend absensi sesi live (status hadir/izin/alpha) — belum ada halaman frontend
- [x] Sertifikat PDF (generate via `pdfkit`, tombol unduh di dashboard User)
- [ ] Notifikasi in-app (deadline, jadwal sesi baru) — belum diimplementasi

## 11. Desain UI Frontend
- [x] Palet warna khusus: cream (`#FBF6EE`) + terracotta (`#C6572B`) + teal (`#2F6F62`) + plum (`#6F4A6E`) + blue (`#3E6FA1`), dark mode otomatis via `prefers-color-scheme`
- [x] Tipografi: Fraunces (heading, serif berkarakter) + Plus Jakarta Sans (body) — bukan Inter default
- [x] Layout dashboard dibedakan per role (lihat §9)
- [x] Komponen UI dibuat custom dari nol (Button, Card, Input, Badge, EmptyState) — **bukan shadcn/ui** karena keterbatasan waktu instalasi/setup; secara desain sudah memenuhi maksud "tidak generik" dari spec
- [x] Kalender custom-styled dengan warna per tipe event
- [x] Empty state jelas di semua listing (kelas kosong, tugas kosong, dst.)
- [x] Copy UI Bahasa Indonesia yang actionable ("Daftar Kelas", "Setujui", "Unduh Sertifikat", dst.)
- [ ] Audit kontras WCAG AA formal — belum diverifikasi dengan tool khusus
- [ ] Rencana desain tertulis terpisah sebelum coding — dilewati demi kecepatan, langsung diterapkan saat implementasi

## 12. Docker & Deployment
- [x] Test mode "dengan Docker" (postgres+pgadmin+mailhog di container, app native) — §12.4, sudah diverifikasi migrate+seed+login berhasil
- [ ] Test mode "tanpa Docker" (native, postgres lokal) — §12.3, belum diverifikasi eksplisit
- [ ] (Opsional) `docker-compose.full.yml` + Dockerfile backend/frontend utk mode full Docker — §12.5, belum dibuat

## 13. QA & Hardening
- [x] Endpoint dilindungi role-based guard (`JwtAuthGuard` + `RolesGuard` + `@Roles`) sesuai matriks §3
- [x] Soft-delete diterapkan di `users`, `courses`, `categories`, `assignment_submissions`
- [x] Seeding dummy tiap role bisa login & tested via API (login, dashboard, courses)
- [x] Swagger docs lengkap (DTO + decorator) di semua modul, tersedia di `/api/docs`
- [ ] Automated test suite (unit/e2e) — belum ada test ditulis, hanya smoke test manual
