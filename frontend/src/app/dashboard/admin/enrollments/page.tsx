"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Badge, ENROLLMENT_STATUS_LABEL, ENROLLMENT_STATUS_TONE } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useApi } from "@/lib/use-api";
import { apiFetch } from "@/lib/api";

interface EnrollmentItem {
  id: string;
  status: string;
  course_title: string;
  user_name: string;
  user_email: string;
  enrolled_at: string;
}

export default function AdminEnrollmentsPage() {
  const { data, loading, refetch } = useApi<EnrollmentItem[]>("/enrollments?status=pending");
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setProcessingId(id);
    try {
      await apiFetch(`/enrollments/${id}/status`, { method: "PATCH", body: { status } });
      await refetch();
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Persetujuan Pendaftaran" subtitle="Tinjau pendaftaran kelas yang membutuhkan approval." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        {loading ? (
          <p className="text-sm text-ink-soft">Memuat...</p>
        ) : data && data.length > 0 ? (
          data.map((e) => (
            <Card key={e.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-ink">{e.user_name}</p>
                <p className="text-xs text-ink-soft">{e.user_email}</p>
                <p className="mt-1 text-sm text-ink-soft">Kelas: {e.course_title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={ENROLLMENT_STATUS_TONE[e.status]}>{ENROLLMENT_STATUS_LABEL[e.status]}</Badge>
                <Button
                  variant="secondary"
                  disabled={processingId === e.id}
                  onClick={() => updateStatus(e.id, "active")}
                >
                  Setujui
                </Button>
                <Button
                  variant="ghost"
                  disabled={processingId === e.id}
                  onClick={() => updateStatus(e.id, "dropped")}
                >
                  Tolak
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState title="Tidak ada pendaftaran menunggu" description="Semua pendaftaran sudah diproses." />
        )}
      </div>
    </div>
  );
}
