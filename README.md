# LMS E-Learning

Platform LMS dengan 4 role (Super Admin, Admin, Instruktur, User). Lihat [LMS_SPEC.md](LMS_SPEC.md) untuk spesifikasi lengkap dan [TODO.md](TODO.md) untuk status pengerjaan.

## Struktur

```
lms-project/
├── backend/    # NestJS + Knex + PostgreSQL
├── frontend/   # Next.js + TypeScript + Tailwind
└── docker-compose.yml   # Postgres + pgAdmin + Mailhog
```

## Menjalankan (mode: komponen di Docker, app native)

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

## Menjalankan (mode: full Docker — backend & frontend juga di container)

Cocok untuk deployment/staging. Jika stack mode "komponen saja" (di atas) sedang jalan, matikan dulu (`docker compose down`) karena keduanya memakai port pgAdmin/Mailhog yang sama.

```
docker compose -f docker-compose.full.yml up -d --build
docker exec lms_backend npm run seed:run:prod   # sekali saja, setelah container pertama kali jalan
```

- Frontend: `http://localhost:3010`
- Backend: `http://localhost:3001` (docs di `/api/docs`)
- Postgres: `localhost:5434` (volume terpisah dari mode native, `lms_pg_data_full`)

Migration jalan otomatis setiap container backend start (idempotent). Seeder **tidak** dijalankan otomatis karena akan menghapus data yang sudah ada — jalankan manual sekali via perintah di atas.

Untuk kembali ke mode "komponen saja": `docker compose -f docker-compose.full.yml down` lalu `docker compose up -d`.

## Akun dummy (dari seeder)

Semua akun pakai password `Password123!`.

| Role | Email |
|---|---|
| Super Admin | superadmin@lms.local |
| Admin | admin@lms.local |
| Instruktur | instruktur1@lms.local, instruktur2@lms.local |
| User | user1@lms.local, user2@lms.local, user3@lms.local |

## Status

Lihat [TODO.md](TODO.md) untuk daftar lengkap fitur yang sudah selesai dan yang masih tertunda.
