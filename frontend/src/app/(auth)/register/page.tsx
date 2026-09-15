"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await register(name, email, password);
      router.push(ROLE_HOME[user.role]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mendaftar, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <Card className="w-full max-w-sm">
        <h1 className="font-heading text-2xl text-ink">Buat Akun Peserta</h1>
        <p className="mt-1 text-sm text-ink-soft">Daftar untuk mulai menjelajahi kelas.</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-terracotta hover:underline">
            Masuk di sini
          </Link>
        </p>
      </Card>
    </main>
  );
}
