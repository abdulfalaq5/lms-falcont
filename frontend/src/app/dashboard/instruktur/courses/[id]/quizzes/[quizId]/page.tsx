"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import type { Quiz, QuizQuestion } from "@/lib/api/quizzes";
import { createQuizQuestion } from "@/lib/api/quizzes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/patterns/empty-state";

export default function QuizQuestionsPage() {
  const { id, quizId } = useParams<{ id: string; quizId: string }>();
  const { data: quiz } = useApi<Quiz>(`/quizzes/${quizId}`);
  const { data: questions, refetch } = useApi<QuizQuestion[]>(`/quizzes/${quizId}/questions`);

  const [questionText, setQuestionText] = React.useState("");
  const [options, setOptions] = React.useState("");
  const [correctAnswer, setCorrectAnswer] = React.useState("");

  const isPilihanGanda = quiz?.type === "pilihan_ganda";

  const addQuestion = useMutation(() =>
    createQuizQuestion(quizId, {
      question_text: questionText,
      type: quiz!.type,
      options: isPilihanGanda ? options.split("\n").map((o) => o.trim()).filter(Boolean) : undefined,
      correct_answer: isPilihanGanda ? correctAnswer : undefined,
    }),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addQuestion.mutate(undefined);
      setQuestionText("");
      setOptions("");
      setCorrectAnswer("");
      refetch();
      toast.success("Soal ditambahkan.");
    } catch {
      toast.error("Gagal menambahkan soal.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title={quiz?.title ?? "Kelola Soal"} subtitle="Tambahkan soal untuk kuis ini." />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex justify-between">
          <Link href={`/dashboard/instruktur/courses/${id}`} className="text-sm text-muted-foreground hover:text-foreground">
            ← Kembali ke Kelas
          </Link>
          <Link href={`/dashboard/instruktur/courses/${id}/quizzes/${quizId}/submissions`}>
            <Button variant="outline">Nilai Jawaban Peserta</Button>
          </Link>
        </div>

        <Card className="px-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Pertanyaan</Label>
              <Textarea required value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            </div>
            {isPilihanGanda && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label>Pilihan Jawaban (satu per baris)</Label>
                  <Textarea
                    required
                    placeholder={"Opsi A\nOpsi B\nOpsi C"}
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Jawaban Benar</Label>
                  <Input
                    required
                    placeholder="Sesuai salah satu opsi di atas"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  />
                </div>
              </>
            )}
            <Button type="submit" disabled={addQuestion.loading} className="w-fit">
              Tambah Soal
            </Button>
          </form>
        </Card>

        {questions && questions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {questions.map((q, idx) => (
              <Card key={q.id} className="px-5">
                <p className="text-sm font-medium text-foreground">
                  {idx + 1}. {q.question_text}
                </p>
                {q.options && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                    {q.options.map((opt) => (
                      <li key={opt} className={opt === q.correct_answer ? "font-medium text-primary" : ""}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada soal" description="Tambahkan soal pertama untuk kuis ini." />
        )}
      </div>
    </div>
  );
}
