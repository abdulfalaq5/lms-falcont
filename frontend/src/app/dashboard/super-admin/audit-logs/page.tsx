"use client";

import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import type { AuditLog } from "@/lib/api/audit-logs";
import { DataTable } from "@/components/patterns/data-table";

export default function AuditLogsPage() {
  const { data, loading } = useApi<AuditLog[]>("/audit-logs");

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Log Aktivitas" subtitle="Riwayat aksi penting di seluruh platform." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <DataTable
          loading={loading}
          rows={data ?? undefined}
          emptyTitle="Belum ada aktivitas"
          emptyDescription="Aktivitas sistem akan muncul di sini."
          columns={[
            { header: "Waktu", cell: (l) => new Date(l.created_at).toLocaleString("id-ID") },
            { header: "Pengguna", cell: (l) => l.user_name ?? "Sistem" },
            { header: "Aksi", cell: (l) => <span className="capitalize">{l.action}</span> },
            { header: "Entitas", cell: (l) => <span className="capitalize">{l.entity}</span> },
          ]}
        />
      </div>
    </div>
  );
}
