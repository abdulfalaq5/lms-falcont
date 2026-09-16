import { apiFetch } from "@/lib/api";

export interface Enrollment {
  id: string;
  status: "pending" | "approved" | "active" | "completed" | "dropped";
  course_id: string;
  course_title: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  enrolled_at: string;
}

export function listEnrollments(params: { status?: string } = {}) {
  const qs = params.status ? `?status=${params.status}` : "";
  return apiFetch<Enrollment[]>(`/enrollments${qs}`);
}

export function listMyEnrollments() {
  return apiFetch<Enrollment[]>("/enrollments/me");
}

export function listCourseEnrollments(courseId: string) {
  return apiFetch<Enrollment[]>(`/enrollments/course/${courseId}`);
}

export function createEnrollment(courseId: string) {
  return apiFetch<Enrollment>("/enrollments", { method: "POST", body: { course_id: courseId } });
}

export function updateEnrollmentStatus(id: string, status: Enrollment["status"]) {
  return apiFetch<Enrollment>(`/enrollments/${id}/status`, { method: "PATCH", body: { status } });
}
