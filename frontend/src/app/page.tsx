"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace(ROLE_HOME[user.role]);
  }, [loading, user, router]);

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-heading text-xl text-terracotta">Kelas Kita</span>
        <nav className="flex items-center gap-3">
          <Link href="/courses" className="text-sm text-ink-soft hover:text-ink">
            Katalog Kelas
          </Link>
          <Link href="/login">
            <Button variant="ghost">Masuk</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">Daftar</Button>
          </Link>
        </nav>
      </header>

      <section className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <span className="rounded-full bg-terracotta-soft px-4 py-1 text-sm text-terracotta">
          Belajar tenang, progres jelas
        </span>
        <h1 className="font-heading text-4xl leading-tight text-ink md:text-5xl">
          Satu tempat untuk kelas, tugas, dan jadwal belajarmu
        </h1>
        <p className="max-w-xl text-ink-soft">
          Kelas Kita membantu peserta, instruktur, dan admin mengelola pembelajaran online
          tanpa drama — materi, kuis, tugas, dan kalender dalam satu alur yang rapi.
        </p>
        <div className="flex gap-3">
          <Link href="/courses">
            <Button variant="primary">Jelajahi Kelas</Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost">Buat Akun</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
