"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import type { Enrollment } from "@/lib/api/enrollments";
import type { Grade } from "@/lib/api/reports";
import { upsertGrade } from "@/lib/api/reports";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/patterns/empty-state";

function GradeRow({ enrollment, grade }: { enrollment: Enrollment; grade?: Grade }) {
  const [score, setScore] = React.useState(grade?.final_score?.toString() ?? "");
  const [certificate, setCertificate] = React.useState(grade?.certificate_issued ?? false);
  const [saving, setSaving] = React.useState(false);

  async function save() {
    setSaving(true);
    try {
      await upsertGrade({
        user_id: enrollment.user_id!,
        course_id: enrollment.course_id,
        final_score: score === "" ? undefined : Number(score),
        certificate_issued: certificate,
      });
      toast.success("Nilai tersimpan.");
    } catch {
      toast.error("Gagal menyimpan nilai.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{enrollment.user_name}</p>
        <p className="text-xs text-muted-foreground">{enrollment.user_email}</p>
      </div>
      <div className="flex items-center gap-3">
        <Input
          type="number"
          min={0}
          max={100}
          className="w-24"
          placeholder="Nilai akhir"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox checked={certificate} onCheckedChange={(v) => setCertificate(!!v)} />
          Sertifikat
        </label>
        <Button onClick={save} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </Card>
  );
}

export default function CourseGradesPage() {
  const { id } = useParams<{ id: string }>();
  const { data: enrollments } = useApi<Enrollment[]>(`/enrollments/course/${id}`);
  const { data: grades } = useApi<Grade[]>(`/reports/course/${id}`);

  const activeEnrollments = enrollments?.filter((e) => e.status === "active" || e.status === "completed") ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Nilai & Sertifikat" subtitle="Masukkan nilai akhir dan terbitkan sertifikat peserta." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        {activeEnrollments.length > 0 ? (
          <div className="flex flex-col gap-2">
            {activeEnrollments.map((e) => (
              <GradeRow
                key={e.id}
                enrollment={e}
                grade={grades?.find((g) => g.user_id === e.user_id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada peserta aktif" description="Nilai bisa dimasukkan setelah peserta aktif di kelas ini." />
        )}
      </div>
    </div>
  );
}
