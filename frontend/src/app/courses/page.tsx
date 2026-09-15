"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface CourseItem {
  id: string;
  title: string;
  description: string | null;
  category_name: string | null;
  instructor_name: string | null;
  is_open_enrollment: boolean;
  price: string | null;
  status: string;
}

export default function CoursesCatalogPage() {
  const { user } = useAuth();
  const { data, loading } = useApi<CourseItem[]>("/courses?status=active");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleEnroll(courseId: string) {
    if (!user) return;
    setEnrollingId(courseId);
    setMessage(null);
    try {
      const res = await apiFetch<{ status: string }>("/enrollments", {
        method: "POST",
        body: { course_id: courseId },
      });
      setMessage(
        res.status === "active"
          ? "Berhasil! Kamu langsung terdaftar aktif di kelas ini."
          : "Pendaftaran dikirim, menunggu persetujuan Admin.",
      );
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Gagal mendaftar kelas.");
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-ink">Katalog Kelas</h1>
          <p className="mt-1 text-sm text-ink-soft">Pilih kelas yang ingin kamu ikuti.</p>
        </div>
        {user ? (
          <Link href={ROLE_HOME[user.role]}>
            <Button variant="ghost">Ke Dashboard</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="ghost">Masuk</Button>
          </Link>
        )}
      </div>

      {message && (
        <div className="rounded-xl border border-teal-soft bg-teal-soft/60 px-4 py-3 text-sm text-teal">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink-soft">Memuat kelas...</p>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((course) => (
            <Card key={course.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                {course.category_name && <Badge tone="blue">{course.category_name}</Badge>}
                <Badge tone={course.is_open_enrollment ? "teal" : "plum"}>
                  {course.is_open_enrollment ? "Pendaftaran Terbuka" : "Perlu Persetujuan"}
                </Badge>
              </div>
              <h2 className="font-heading text-lg text-ink">{course.title}</h2>
              <p className="line-clamp-3 text-sm text-ink-soft">{course.description}</p>
              <p className="text-xs text-ink-soft">Pengajar: {course.instructor_name ?? "-"}</p>
              <p className="text-sm font-medium text-terracotta">
                {course.price ? `Rp ${Number(course.price).toLocaleString("id-ID")}` : "Gratis"}
              </p>

              {user?.role === "user" && (
                <Button
                  variant="primary"
                  disabled={enrollingId === course.id}
                  onClick={() => handleEnroll(course.id)}
                >
                  {enrollingId === course.id ? "Memproses..." : "Daftar Kelas"}
                </Button>
              )}
              {!user && (
                <Link href="/login">
                  <Button variant="primary" className="w-full">
                    Masuk untuk Mendaftar
                  </Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada kelas tersedia" description="Kelas baru akan muncul di sini." />
      )}
    </main>
  );
}
