"use client";

import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/patterns/stat-card";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/use-api";

interface AdminDashboard {
  newUsers: number;
  runningCourses: number;
  pendingApprovals: number;
  activeInstructors: number;
}

export default function AdminDashboardPage() {
  const { data, loading } = useApi<AdminDashboard>("/dashboard/admin");

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Ringkasan Admin" subtitle="Kelola kelas, pendaftaran, dan pengguna." />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pengguna Baru (30 hari)" value={data?.newUsers ?? (loading ? "…" : 0)} />
          <StatCard label="Kelas Berjalan" value={data?.runningCourses ?? (loading ? "…" : 0)} />
          <StatCard label="Menunggu Persetujuan" value={data?.pendingApprovals ?? (loading ? "…" : 0)} />
          <StatCard label="Instruktur Aktif" value={data?.activeInstructors ?? (loading ? "…" : 0)} />
        </div>

        {!!data?.pendingApprovals && (
          <div className="flex items-center justify-between rounded-xl border border-warning-soft bg-warning-soft/60 px-5 py-4">
            <p className="text-sm text-foreground">
              Ada <span className="font-semibold">{data.pendingApprovals}</span> pendaftaran menunggu persetujuan.
            </p>
            <Link href="/dashboard/admin/enrollments">
              <Button variant="secondary">Tinjau Sekarang</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
