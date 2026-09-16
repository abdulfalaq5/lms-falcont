"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/patterns/password-input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      router.push(ROLE_HOME[user.role]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal masuk, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <Card className="w-full max-w-sm px-6">
        <h1 className="font-heading text-2xl text-foreground">Masuk ke Kelas Kita</h1>
        <p className="mt-1 text-sm text-muted-foreground">Lanjutkan proses belajarmu.</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
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
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} size="lg" className="mt-2 w-full">
            {submitting ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Daftar di sini
          </Link>
        </p>
      </Card>
    </main>
  );
}
