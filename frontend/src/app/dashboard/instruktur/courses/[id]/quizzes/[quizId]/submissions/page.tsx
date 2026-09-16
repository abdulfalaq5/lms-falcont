"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import type { Quiz, QuizQuestion, QuizSubmission } from "@/lib/api/quizzes";
import { gradeQuizSubmission } from "@/lib/api/quizzes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/patterns/empty-state";

function SubmissionRow({ submission, questions }: { submission: QuizSubmission; questions: QuizQuestion[] }) {
  const [score, setScore] = React.useState(submission.score?.toString() ?? "");
  const [saving, setSaving] = React.useState(false);

  async function save() {
    setSaving(true);
    try {
      await gradeQuizSubmission(submission.id, Number(score));
      toast.success("Nilai tersimpan.");
    } catch {
      toast.error("Gagal menyimpan nilai.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 px-5">
      <p className="text-sm font-medium text-foreground">{submission.user_name ?? submission.user_id}</p>
      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <div key={q.id} className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="font-medium text-foreground">{q.question_text}</p>
            <p className="mt-1 text-muted-foreground">Jawaban: {submission.answers[q.id] ?? "-"}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={100}
          className="w-24"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Nilai"
        />
        <Button onClick={save} disabled={saving || score === ""}>
          {saving ? "Menyimpan..." : "Simpan Nilai"}
        </Button>
      </div>
    </Card>
  );
}

export default function QuizSubmissionsPage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>();
  const { data: quiz } = useApi<Quiz>(`/quizzes/${quizId}`);
  const { data: questions } = useApi<QuizQuestion[]>(`/quizzes/${quizId}/questions`);
  const { data: submissions } = useApi<QuizSubmission[]>(`/quizzes/${quizId}/submissions`);

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title={`Nilai Kuis: ${quiz?.title ?? ""}`} subtitle="Beri nilai untuk setiap jawaban peserta." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Link
          href={`/dashboard/instruktur/courses/${id}/quizzes/${quizId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Kembali ke Soal
        </Link>
        {submissions && submissions.length > 0 && questions ? (
          <div className="flex flex-col gap-3">
            {submissions.map((s) => (
              <SubmissionRow key={s.id} submission={s} questions={questions} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada jawaban" description="Jawaban peserta akan muncul di sini setelah dikumpulkan." />
        )}
      </div>
    </div>
  );
}
