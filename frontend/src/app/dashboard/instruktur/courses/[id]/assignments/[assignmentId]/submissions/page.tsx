"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import type { AssignmentSubmission } from "@/lib/api/assignments";
import { gradeAssignmentSubmission } from "@/lib/api/assignments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/patterns/empty-state";
import { StatusBadge } from "@/components/patterns/status-badge";

function SubmissionRow({ submission }: { submission: AssignmentSubmission }) {
  const [grade, setGrade] = React.useState(submission.grade?.toString() ?? "");
  const [feedback, setFeedback] = React.useState(submission.feedback ?? "");
  const [saving, setSaving] = React.useState(false);

  async function save() {
    setSaving(true);
    try {
      await gradeAssignmentSubmission(submission.id, Number(grade), feedback || undefined);
      toast.success("Nilai tersimpan.");
    } catch {
      toast.error("Gagal menyimpan nilai.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 px-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{submission.user_name ?? submission.user_id}</p>
        <StatusBadge domain="submission" value={submission.grade != null ? "dinilai" : "menunggu_nilai"} />
      </div>
      <a href={submission.file_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
        Lihat Berkas Tugas
      </a>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="number"
          min={0}
          max={100}
          className="w-24"
          placeholder="Nilai"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <Textarea
          placeholder="Feedback (opsional)"
          className="flex-1"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button onClick={save} disabled={saving || grade === ""}>
          {saving ? "Menyimpan..." : "Simpan Nilai"}
        </Button>
      </div>
    </Card>
  );
}

export default function AssignmentSubmissionsPage() {
  const { id, assignmentId } = useParams<{ id: string; assignmentId: string }>();
  const { data: submissions } = useApi<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`);

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Nilai Kumpulan Tugas" subtitle="Beri nilai dan feedback untuk setiap kumpulan tugas." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Link href={`/dashboard/instruktur/courses/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Kembali ke Kelas
        </Link>
        {submissions && submissions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {submissions.map((s) => (
              <SubmissionRow key={s.id} submission={s} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada kumpulan" description="Kumpulan tugas peserta akan muncul di sini." />
        )}
      </div>
    </div>
  );
}
