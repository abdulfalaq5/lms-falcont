"use client";

import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import type { AssignmentSubmission } from "@/lib/api/assignments";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/patterns/status-badge";
import { EmptyState } from "@/components/patterns/empty-state";

export default function UserAssignmentsPage() {
  const { data, loading } = useApi<AssignmentSubmission[]>("/assignments/me/submissions");

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Tugas Saya" subtitle="Riwayat tugas yang sudah kamu kumpulkan." />
      <div className="flex flex-1 flex-col gap-2 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        ) : data && data.length > 0 ? (
          data.map((s) => (
            <Card key={s.id} className="flex items-center justify-between px-5">
              <div>
                <p className="text-sm font-medium text-foreground">{s.assignment_title ?? "Tugas"}</p>
                <p className="text-xs text-muted-foreground">
                  Dikumpulkan: {new Date(s.submitted_at).toLocaleString("id-ID")}
                </p>
                {s.feedback && <p className="mt-1 text-xs text-muted-foreground">Feedback: {s.feedback}</p>}
              </div>
              <div className="flex items-center gap-2">
                {s.grade != null && <span className="text-sm font-medium text-foreground">{s.grade}</span>}
                <StatusBadge domain="submission" value={s.grade != null ? "dinilai" : "menunggu_nilai"} />
              </div>
            </Card>
          ))
        ) : (
          <EmptyState title="Belum ada tugas" description="Tugas yang sudah kamu kumpulkan akan muncul di sini." />
        )}
      </div>
    </div>
  );
}
