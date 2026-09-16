import { apiFetch } from "@/lib/api";

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  assignment_title?: string;
  user_id: string;
  user_name?: string;
  file_url: string;
  grade: number | null;
  feedback: string | null;
  submitted_at: string;
}

export function listAssignments(courseId: string) {
  return apiFetch<Assignment[]>(`/assignments?courseId=${courseId}`);
}

export function listMyAssignmentSubmissions() {
  return apiFetch<AssignmentSubmission[]>("/assignments/me/submissions");
}

export function listAssignmentSubmissions(assignmentId: string) {
  return apiFetch<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`);
}

export function createAssignment(body: { course_id: string; title: string; description?: string; due_date?: string }) {
  return apiFetch<Assignment>("/assignments", { method: "POST", body });
}

export function updateAssignment(id: string, body: Partial<{ title: string; description: string; due_date: string }>) {
  return apiFetch<Assignment>(`/assignments/${id}`, { method: "PATCH", body });
}

export function deleteAssignment(id: string) {
  return apiFetch<void>(`/assignments/${id}`, { method: "DELETE" });
}

export function submitAssignment(id: string, fileUrl: string) {
  return apiFetch<AssignmentSubmission>(`/assignments/${id}/submit`, { method: "POST", body: { file_url: fileUrl } });
}

export function gradeAssignmentSubmission(submissionId: string, grade: number, feedback?: string) {
  return apiFetch<AssignmentSubmission>(`/assignments/submissions/${submissionId}/grade`, {
    method: "PATCH",
    body: { grade, feedback },
  });
}
