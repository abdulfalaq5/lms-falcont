"use client";

import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/patterns/status-badge";
import { EmptyState } from "@/components/patterns/empty-state";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/use-api";
import { useAuth } from "@/lib/auth-context";
import { downloadFile } from "@/lib/api";

interface UserDashboard {
  enrollments: { id: string; course_id: string; course_title: string; status: string }[];
  upcomingDeadlines: { id: string; title: string; type: string; start_time: string }[];
  grades: { course_id: string; final_score: number | null; certificate_issued: boolean }[];
}

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { data, loading } = useApi<UserDashboard>("/dashboard/user");

  const activeCourses = data?.enrollments.filter((e) => e.status === "active") ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <Topbar
        title={`Halo, ${user?.name?.split(" ")[0] ?? "Peserta"} 👋`}
        subtitle="Semangat terus, ini progres belajarmu hari ini."
      />
      <div className="flex flex-1 flex-col gap-8 p-6">
        <div>
          <h2 className="font-heading text-lg text-foreground">Kelas yang Diikuti</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Memuat...</p>
            ) : data && data.enrollments.length > 0 ? (
              data.enrollments.map((e) => (
                <Card key={e.id} className="flex flex-col gap-2 px-5">
                  <span className="font-medium text-foreground">{e.course_title}</span>
                  <StatusBadge domain="enrollment" value={e.status} />
                </Card>
              ))
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState
                  title="Belum ada kelas diikuti"
                  description="Yuk mulai belajar dengan menjelajahi katalog kelas yang tersedia."
                  action={
                    <Link href="/courses">
                      <Button>Jelajahi Kelas</Button>
                    </Link>
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-lg text-foreground">Deadline Terdekat</h2>
            <div className="mt-3 flex flex-col gap-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Memuat...</p>
              ) : data && data.upcomingDeadlines.length > 0 ? (
                data.upcomingDeadlines.map((d) => (
                  <Card key={d.id} className="flex items-center justify-between px-5">
                    <span className="text-sm font-medium text-foreground">{d.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(d.start_time).toLocaleDateString("id-ID")}
                    </span>
                  </Card>
                ))
              ) : (
                <EmptyState title="Tidak ada deadline" description="Kamu sedang tidak punya tugas mendesak." />
              )}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg text-foreground">Sertifikat & Nilai</h2>
            <div className="mt-3 flex flex-col gap-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Memuat...</p>
              ) : data && data.grades.length > 0 ? (
                data.grades.map((g) => (
                  <Card key={g.course_id} className="flex items-center justify-between px-5">
                    <span className="text-sm text-foreground">
                      Nilai Akhir: {g.final_score != null ? g.final_score : "Belum ada"}
                    </span>
                    {g.certificate_issued ? (
                      <button
                        onClick={() =>
                          downloadFile(`/reports/certificate/${g.course_id}`, `sertifikat-${g.course_id}.pdf`)
                        }
                        className="text-sm text-primary hover:underline"
                      >
                        Unduh Sertifikat
                      </button>
                    ) : (
                      <Badge variant="secondary">Belum tersedia</Badge>
                    )}
                  </Card>
                ))
              ) : (
                <EmptyState title="Belum ada nilai" description="Nilai akan muncul setelah kelas selesai dinilai." />
              )}
            </div>
          </div>
        </div>

        {activeCourses.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Kamu sedang aktif di {activeCourses.length} kelas. Terus semangat belajar!
          </p>
        )}
      </div>
    </div>
  );
}
