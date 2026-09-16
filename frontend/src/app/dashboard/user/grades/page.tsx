"use client";

import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import { downloadFile } from "@/lib/api";
import type { Grade } from "@/lib/api/reports";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/patterns/empty-state";

export default function UserGradesPage() {
  const { data, loading } = useApi<Grade[]>("/reports/me");

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Nilai & Sertifikat" subtitle="Nilai akhir dan sertifikat dari kelas yang sudah selesai." />
      <div className="flex flex-1 flex-col gap-2 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        ) : data && data.length > 0 ? (
          data.map((g) => (
            <Card key={g.course_id} className="flex items-center justify-between px-5">
              <div>
                <p className="text-sm font-medium text-foreground">{g.course_title}</p>
                <p className="text-sm text-muted-foreground">
                  Nilai Akhir: {g.final_score != null ? g.final_score : "Belum ada"}
                </p>
              </div>
              {g.certificate_issued ? (
                <button
                  onClick={() => downloadFile(`/reports/certificate/${g.course_id}`, `sertifikat-${g.course_id}.pdf`)}
                  className="text-sm font-medium text-primary hover:underline"
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
  );
}
