"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/patterns/stat-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { useApi } from "@/lib/use-api";

interface InstrukturDashboard {
  coursesCount: number;
  courses: { id: string; title: string; status: string }[];
  ungradedAssignments: number;
  upcomingSchedules: { id: string; title: string; type: string; start_time: string }[];
}

export default function InstrukturDashboardPage() {
  const { data, loading } = useApi<InstrukturDashboard>("/dashboard/instruktur");

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Ringkasan Mengajar" subtitle="Progress kelas yang kamu ampu." />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Kelas Diampu" value={data?.coursesCount ?? (loading ? "…" : 0)} />
          <StatCard
            label="Tugas Belum Dinilai"
            value={data?.ungradedAssignments ?? (loading ? "…" : 0)}
            hint={data && data.ungradedAssignments > 0 ? "Segera nilai agar peserta dapat feedback" : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-lg text-foreground">Kelas Saya</h2>
            <div className="mt-3 flex flex-col gap-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Memuat...</p>
              ) : data && data.courses.length > 0 ? (
                data.courses.map((course) => (
                  <Card key={course.id} className="flex items-center justify-between px-5">
                    <span className="text-sm font-medium text-foreground">{course.title}</span>
                    <span className="text-xs capitalize text-muted-foreground">{course.status}</span>
                  </Card>
                ))
              ) : (
                <EmptyState title="Belum ada kelas" description="Anda belum ditugaskan mengampu kelas apapun." />
              )}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg text-foreground">Jadwal Sesi Terdekat</h2>
            <div className="mt-3 flex flex-col gap-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Memuat...</p>
              ) : data && data.upcomingSchedules.length > 0 ? (
                data.upcomingSchedules.map((s) => (
                  <Card key={s.id} className="flex items-center justify-between px-5">
                    <span className="text-sm font-medium text-foreground">{s.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.start_time).toLocaleString("id-ID")}
                    </span>
                  </Card>
                ))
              ) : (
                <EmptyState title="Belum ada jadwal" description="Belum ada sesi atau deadline mendatang." />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
