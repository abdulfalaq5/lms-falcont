import { apiFetch } from "@/lib/api";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  category_name?: string | null;
  instructor_id: string | null;
  instructor_name?: string | null;
  capacity: number | null;
  is_open_enrollment: boolean;
  price: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "draft" | "active" | "archived";
}

export interface CourseInput {
  title: string;
  description?: string;
  category_id?: string;
  instructor_id?: string;
  capacity?: number;
  is_open_enrollment?: boolean;
  price?: number;
  start_date?: string;
  end_date?: string;
  status?: Course["status"];
}

function query(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function listCourses(params: { instructorId?: string; categoryId?: string; status?: string } = {}) {
  return apiFetch<Course[]>(
    `/courses${query({ instructorId: params.instructorId, categoryId: params.categoryId, status: params.status })}`,
  );
}

export function getCourse(id: string) {
  return apiFetch<Course>(`/courses/${id}`);
}

export function createCourse(body: CourseInput) {
  return apiFetch<Course>("/courses", { method: "POST", body });
}

export function updateCourse(id: string, body: Partial<CourseInput>) {
  return apiFetch<Course>(`/courses/${id}`, { method: "PATCH", body });
}

export function deleteCourse(id: string) {
  return apiFetch<void>(`/courses/${id}`, { method: "DELETE" });
}
