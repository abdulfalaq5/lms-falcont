import { apiFetch } from "@/lib/api";

export interface Grade {
  user_id?: string;
  user_name?: string;
  course_id: string;
  course_title?: string;
  final_score: number | null;
  certificate_issued: boolean;
}

export function getMyReports() {
  return apiFetch<Grade[]>("/reports/me");
}

export function getCourseReports(courseId: string) {
  return apiFetch<Grade[]>(`/reports/course/${courseId}`);
}

export function upsertGrade(body: { user_id: string; course_id: string; final_score?: number; certificate_issued?: boolean }) {
  return apiFetch<Grade>("/reports", { method: "POST", body });
}
