"use client";

import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import type { Enrollment } from "@/lib/api/enrollments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/patterns/status-badge";
import { EmptyState } from "@/components/patterns/empty-state";

export default function UserCoursesPage() {
  const { data, loading } = useApi<Enrollment[]>("/enrollments/me");

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Kelas Saya" subtitle="Semua kelas yang sudah kamu ikuti." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((e) => (
              <Card key={e.id} className="flex flex-col gap-2 px-5">
                <StatusBadge domain="enrollment" value={e.status} />
                <h2 className="font-heading text-base text-foreground">{e.course_title}</h2>
                <Link href={`/courses/${e.course_id}`}>
                  <Button variant="outline" className="mt-2 w-full">
                    Lanjutkan Belajar
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada kelas diikuti"
            description="Yuk mulai belajar dengan menjelajahi katalog kelas yang tersedia."
            action={
              <Link href="/courses">
                <Button>Jelajahi Kelas</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
