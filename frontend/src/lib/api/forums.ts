import { apiFetch } from "@/lib/api";

export interface ForumPost {
  id: string;
  course_id: string;
  content: string;
  parent_id: string | null;
  user_id: string;
  user_name?: string;
  created_at: string;
}

export function listForumPosts(courseId: string) {
  return apiFetch<ForumPost[]>(`/forums?courseId=${courseId}`);
}

export function createForumPost(body: { course_id: string; content: string; parent_id?: string }) {
  return apiFetch<ForumPost>("/forums", { method: "POST", body });
}

export function deleteForumPost(id: string) {
  return apiFetch<void>(`/forums/${id}`, { method: "DELETE" });
}
