"use client";

import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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
          <StatCard label="Total Pengguna" value={data?.totalUsers ?? (loading ? "…" : 0)} accent="terracotta" />
          <StatCard label="Kelas Aktif" value={data?.activeCourses ?? (loading ? "…" : 0)} accent="teal" />
        </div>

        <div>
          <h2 className="font-heading text-lg text-ink">Log Aktivitas Terbaru</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-surface">
            {loading ? (
              <p className="p-6 text-sm text-ink-soft">Memuat aktivitas...</p>
            ) : data && data.recentActivity.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-ink-soft">
                  <tr>
                    <th className="px-4 py-3 font-medium">Waktu</th>
                    <th className="px-4 py-3 font-medium">Pengguna</th>
                    <th className="px-4 py-3 font-medium">Aksi</th>
                    <th className="px-4 py-3 font-medium">Entitas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentActivity.map((log) => (
                    <tr key={log.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 text-ink-soft">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">{log.user_name ?? "Sistem"}</td>
                      <td className="px-4 py-3 capitalize">{log.action}</td>
                      <td className="px-4 py-3 capitalize">{log.entity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="Belum ada aktivitas" description="Aktivitas sistem akan muncul di sini." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
