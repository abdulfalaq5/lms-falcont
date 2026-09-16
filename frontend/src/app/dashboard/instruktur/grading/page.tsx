"use client";

import * as React from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import type { Course } from "@/lib/api/courses";
import type { Quiz } from "@/lib/api/quizzes";
import type { Assignment } from "@/lib/api/assignments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/patterns/empty-state";

interface PendingQuiz {
  courseId: string;
  courseTitle: string;
  quiz: Quiz;
  ungraded: number;
}

interface PendingAssignment {
  courseId: string;
  courseTitle: string;
  assignment: Assignment;
  ungraded: number;
}

export default function GradingOverviewPage() {
  const { user } = useAuth();
  const [pendingQuizzes, setPendingQuizzes] = React.useState<PendingQuiz[]>([]);
  const [pendingAssignments, setPendingAssignments] = React.useState<PendingAssignment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const courses = await apiFetch<Course[]>(`/courses?instructorId=${user!.id}`);
      const quizzesAcc: PendingQuiz[] = [];
      const assignmentsAcc: PendingAssignment[] = [];

      for (const course of courses) {
        const [quizzes, assignments] = await Promise.all([
          apiFetch<Quiz[]>(`/quizzes?courseId=${course.id}`),
          apiFetch<Assignment[]>(`/assignments?courseId=${course.id}`),
        ]);

        for (const quiz of quizzes) {
          const submissions = await apiFetch<{ score: number | null }[]>(`/quizzes/${quiz.id}/submissions`);
          const ungraded = submissions.filter((s) => s.score == null).length;
          if (ungraded > 0) quizzesAcc.push({ courseId: course.id, courseTitle: course.title, quiz, ungraded });
        }

        for (const assignment of assignments) {
          const submissions = await apiFetch<{ grade: number | null }[]>(`/assignments/${assignment.id}/submissions`);
          const ungraded = submissions.filter((s) => s.grade == null).length;
          if (ungraded > 0) assignmentsAcc.push({ courseId: course.id, courseTitle: course.title, assignment, ungraded });
        }
      }

      if (!cancelled) {
        setPendingQuizzes(quizzesAcc);
        setPendingAssignments(assignmentsAcc);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isEmpty = !loading && pendingQuizzes.length === 0 && pendingAssignments.length === 0;

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Tugas Perlu Dinilai" subtitle="Kuis dan tugas dari peserta yang menunggu penilaianmu." />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        ) : isEmpty ? (
          <EmptyState title="Semua sudah dinilai" description="Tidak ada kuis atau tugas yang menunggu penilaian." />
        ) : (
          <>
            {pendingQuizzes.length > 0 && (
              <div>
                <h2 className="font-heading text-lg text-foreground">Kuis</h2>
                <div className="mt-3 flex flex-col gap-2">
                  {pendingQuizzes.map((p) => (
                    <Card key={p.quiz.id} className="flex items-center justify-between px-5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.quiz.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.courseTitle} · {p.ungraded} jawaban menunggu nilai
                        </p>
                      </div>
                      <Link href={`/dashboard/instruktur/courses/${p.courseId}/quizzes/${p.quiz.id}/submissions`}>
                        <Button variant="outline">Nilai Sekarang</Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {pendingAssignments.length > 0 && (
              <div>
                <h2 className="font-heading text-lg text-foreground">Tugas</h2>
                <div className="mt-3 flex flex-col gap-2">
                  {pendingAssignments.map((p) => (
                    <Card key={p.assignment.id} className="flex items-center justify-between px-5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.assignment.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.courseTitle} · {p.ungraded} kumpulan menunggu nilai
                        </p>
                      </div>
                      <Link href={`/dashboard/instruktur/courses/${p.courseId}/assignments/${p.assignment.id}/submissions`}>
                        <Button variant="outline">Nilai Sekarang</Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
