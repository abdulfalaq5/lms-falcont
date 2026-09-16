"use client";

import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/patterns/stat-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { useApi } from "@/lib/use-api";

interface SuperAdminDashboard {
  totalUsers: number;
  activeCourses: number;
  recentActivity: {
    id: string;
    action: string;
    entity: string;
    entity_id: string | null;
    created_at: string;
    user_name: string | null;
  }[];
}

export default function SuperAdminDashboardPage() {
  const { data, loading } = useApi<SuperAdminDashboard>("/dashboard/super-admin");

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Ringkasan Sistem" subtitle="Pantauan menyeluruh seluruh platform LMS." />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Pengguna" value={data?.totalUsers ?? (loading ? "…" : 0)} />
          <StatCard label="Kelas Aktif" value={data?.activeCourses ?? (loading ? "…" : 0)} />
        </div>

        <div>
          <h2 className="font-heading text-lg text-foreground">Log Aktivitas Terbaru</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
            {loading ? (
              <p className="p-6 text-sm text-muted-foreground">Memuat aktivitas...</p>
            ) : data && data.recentActivity.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Entitas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentActivity.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>{log.user_name ?? "Sistem"}</TableCell>
                      <TableCell className="capitalize">{log.action}</TableCell>
                      <TableCell className="capitalize">{log.entity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="Belum ada aktivitas" description="Aktivitas sistem akan muncul di sini." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
