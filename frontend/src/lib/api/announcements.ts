import { apiFetch } from "@/lib/api";

export interface Announcement {
  id: string;
  course_id: string | null;
  course_title?: string | null;
  title: string;
  content: string;
  created_at: string;
}

export function listAnnouncements(courseId?: string) {
  const qs = courseId ? `?courseId=${courseId}` : "";
  return apiFetch<Announcement[]>(`/announcements${qs}`);
}

export function createAnnouncement(body: { course_id?: string; title: string; content: string }) {
  return apiFetch<Announcement>("/announcements", { method: "POST", body });
}

export function deleteAnnouncement(id: string) {
  return apiFetch<void>(`/announcements/${id}`, { method: "DELETE" });
}
