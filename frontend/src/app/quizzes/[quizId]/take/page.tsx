"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import type { Quiz, QuizQuestion } from "@/lib/api/quizzes";
import { submitQuiz } from "@/lib/api/quizzes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

export default function TakeQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: quiz } = useApi<Quiz>(`/quizzes/${quizId}`);
  const { data: questions } = useApi<QuizQuestion[]>(`/quizzes/${quizId}/questions`);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitQuiz(quizId, answers);
      setDone(true);
      toast.success("Jawaban terkirim!");
    } catch {
      toast.error("Gagal mengirim jawaban.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return null;
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <h1 className="font-heading text-2xl text-foreground">Jawaban Terkirim</h1>
        <p className="text-sm text-muted-foreground">
          Terima kasih, jawabanmu sudah tersimpan. Nilai akan muncul setelah dinilai instruktur.
        </p>
        <Button onClick={() => router.back()}>Kembali ke Kelas</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="font-heading text-2xl text-foreground">{quiz?.title ?? "Mengerjakan Kuis"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Jawab semua pertanyaan di bawah ini, lalu kirim.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {questions?.map((q, idx) => (
          <Card key={q.id} className="px-5">
            <Label className="text-sm font-medium text-foreground">
              {idx + 1}. {q.question_text}
            </Label>
            {q.options ? (
              <RadioGroup
                className="mt-3 flex flex-col gap-2"
                value={answers[q.id] ?? ""}
                onValueChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
              >
                {q.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-foreground">
                    <RadioGroupItem value={opt} />
                    {opt}
                  </label>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                className="mt-3"
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              />
            )}
          </Card>
        ))}

        <Button type="submit" disabled={submitting || !questions?.length} size="lg">
          {submitting ? "Mengirim..." : "Kumpulkan Jawaban"}
        </Button>
      </form>
    </main>
  );
}
