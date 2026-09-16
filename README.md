# LMS E-Learning

Platform LMS dengan 4 role (Super Admin, Admin, Instruktur, User). Lihat [LMS_SPEC.md](LMS_SPEC.md) untuk spesifikasi lengkap dan [TODO.md](TODO.md) untuk status pengerjaan.

## Struktur

```
lms-project/
├── backend/    # NestJS + Knex + PostgreSQL
├── frontend/   # Next.js + TypeScript + Tailwind
└── docker-compose.yml   # Postgres + pgAdmin + Mailhog
```

Ada 3 cara menjalankan project ini, pilih salah satu:

1. **Full tanpa Docker** — Postgres, backend, dan frontend semua dijalankan native di mesin kamu.
2. **Komponen di Docker, app native** — Postgres/pgAdmin/Mailhog di Docker, backend & frontend native.
3. **Full Docker** — semuanya (termasuk backend & frontend) jalan di container, cocok untuk deployment/staging.

## Mode 1: Full tanpa Docker (semua native)

Gunakan mode ini jika Postgres (dan SMTP server, opsional) sudah tersedia/terpasang sendiri di luar Docker.

1. Siapkan database Postgres secara manual (lewat `psql`, TablePlus, dsb), sesuaikan dengan kredensial yang akan dipakai di `.env`, misalnya:

   ```sql
   CREATE USER lms_user WITH PASSWORD 'lms_password';
   CREATE DATABASE lms_db OWNER lms_user;
   ```

2. Setup backend:

   ```
   cd backend
   cp .env.example .env
   ```

   Edit `backend/.env` sesuai environment kamu, minimal:

   ```
   DB_HOST=localhost
   DB_PORT=5432              # sesuaikan dengan port Postgres native kamu
   DB_USER=lms_user
   DB_PASSWORD=lms_password
   DB_NAME=lms_db

   SMTP_HOST=localhost       # ganti dengan host SMTP provider pihak ketiga jika ada
   SMTP_PORT=1025
   SMTP_USER=                # isi jika provider butuh autentikasi
   SMTP_PASSWORD=
   ```

   > Jika belum punya SMTP server sendiri, email (reset password, dsb) tidak akan terkirim tapi aplikasi tetap jalan normal — cukup abaikan bagian SMTP untuk development.

   Contoh pakai provider pihak ketiga seperti [Mailtrap](https://mailtrap.io) (sandbox, untuk testing email tanpa mengirim ke penerima asli):

   ```
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=<username_mailtrap>
   SMTP_PASSWORD=<password_mailtrap>
   ```

   Provider SMTP lain (Gmail, SendGrid, Amazon SES, dll) juga bisa dipakai dengan pola yang sama — cukup sesuaikan `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, dan `SMTP_PASSWORD` sesuai kredensial dari provider tersebut.

   Lalu jalankan:

   ```
   npm install
   npm run migrate:latest
   npm run seed:run
   npm run build
   npm run start:dev
   npm run start:prod untuk prod



   rm tsconfig.build.tsbuildinfo
   npm run start:dev

   ```

   Backend jalan di `http://localhost:3001`, dokumentasi API di `http://localhost:3001/api/docs`.

3. Setup frontend:
   ```
   cd frontend
   cp .env.local.example .env.local
   npm install
   npm run dev
   ```
   Frontend jalan di `http://localhost:3000` (atau port lain jika 3000 terpakai).

## Mode 2: Komponen di Docker, app native

1. Jalankan komponen pendukung:

   ```
   docker compose up -d
   ```

   > Catatan: Postgres di-mapping ke port **5433** (bukan 5432 default) karena mesin dev ini sudah punya Postgres native di 5432. Jika di mesin lain tidak ada konflik, boleh diubah kembali ke `5432:5432` di `docker-compose.yml` dan `.env`.

2. Setup backend:

   ```
   cd backend
   cp .env.example .env
   npm install
   npm run migrate:latest
   npm run seed:run
   npm run start:dev
   ```

   Backend jalan di `http://localhost:3001`, dokumentasi API di `http://localhost:3001/api/docs`.

3. Setup frontend:
   ```
   cd frontend
   cp .env.local.example .env.local
   npm install
   npm run dev
   ```
   Frontend jalan di `http://localhost:3000` (atau port lain jika 3000 terpakai).

## Mode 3: Full Docker — backend & frontend juga di container

Cocok untuk deployment/staging. Jika stack mode "komponen saja" (di atas) sedang jalan, matikan dulu (`docker compose down`) karena keduanya memakai port pgAdmin/Mailhog yang sama.

```
docker compose -f docker-compose.full.yml up -d --build
docker exec lms_backend npm run seed:run:prod   # sekali saja, setelah container pertama kali jalan
```

- Frontend: `http://localhost:9578`
- Backend: `http://localhost:9577` (docs di `http://localhost:9577/api/docs`)
- Postgres: `localhost:5434` (volume terpisah dari mode native, `lms_pg_data_full`)

Migration jalan otomatis setiap container backend start (idempotent). Seeder **tidak** dijalankan otomatis karena akan menghapus data yang sudah ada — jalankan manual sekali via perintah di atas.

Untuk kembali ke mode "komponen saja": `docker compose -f docker-compose.full.yml down` lalu `docker compose up -d`.

## Akun dummy (dari seeder)

Semua akun pakai password `Password123!`.

| Role        | Email                                             |
| ----------- | ------------------------------------------------- |
| Super Admin | superadmin@lms.local                              |
| Admin       | admin@lms.local                                   |
| Instruktur  | instruktur1@lms.local, instruktur2@lms.local      |
| User        | user1@lms.local, user2@lms.local, user3@lms.local |

## Status

Lihat [TODO.md](TODO.md) untuk daftar lengkap fitur yang sudah selesai dan yang masih tertunda.
