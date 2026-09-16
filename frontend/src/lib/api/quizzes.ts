import { apiFetch } from "@/lib/api";

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  type: "pilihan_ganda" | "essay";
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[] | null;
  correct_answer: string | null;
  type: Quiz["type"];
}

export interface QuizSubmission {
  id: string;
  quiz_id: string;
  user_id: string;
  user_name?: string;
  answers: Record<string, string>;
  score: number | null;
  submitted_at: string;
}

export function listQuizzes(courseId: string) {
  return apiFetch<Quiz[]>(`/quizzes?courseId=${courseId}`);
}

export function getQuiz(id: string) {
  return apiFetch<Quiz>(`/quizzes/${id}`);
}

export function listQuizQuestions(quizId: string) {
  return apiFetch<QuizQuestion[]>(`/quizzes/${quizId}/questions`);
}

export function listQuizSubmissions(quizId: string) {
  return apiFetch<QuizSubmission[]>(`/quizzes/${quizId}/submissions`);
}

export function createQuiz(body: { course_id: string; title: string; type: Quiz["type"] }) {
  return apiFetch<Quiz>("/quizzes", { method: "POST", body });
}

export function createQuizQuestion(
  quizId: string,
  body: { question_text: string; options?: string[]; correct_answer?: string; type: Quiz["type"] },
) {
  return apiFetch<QuizQuestion>(`/quizzes/${quizId}/questions`, { method: "POST", body });
}

export function submitQuiz(quizId: string, answers: Record<string, string>) {
  return apiFetch<QuizSubmission>(`/quizzes/${quizId}/submit`, { method: "POST", body: { answers } });
}

export function gradeQuizSubmission(submissionId: string, score: number) {
  return apiFetch<QuizSubmission>(`/quizzes/submissions/${submissionId}/grade`, {
    method: "PATCH",
    body: { score },
  });
}
