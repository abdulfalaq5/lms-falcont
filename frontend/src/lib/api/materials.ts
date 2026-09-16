import { apiFetch } from "@/lib/api";

export interface Material {
  id: string;
  course_id: string;
  title: string;
  type: "video" | "document" | "link";
  content_url: string;
  order: number | null;
}

export interface MaterialInput {
  course_id: string;
  title: string;
  type: Material["type"];
  content_url: string;
  order?: number;
}

export function listMaterials(courseId: string) {
  return apiFetch<Material[]>(`/materials?courseId=${courseId}`);
}

export function createMaterial(body: MaterialInput) {
  return apiFetch<Material>("/materials", { method: "POST", body });
}

export function updateMaterial(id: string, body: Partial<MaterialInput>) {
  return apiFetch<Material>(`/materials/${id}`, { method: "PATCH", body });
}

export function deleteMaterial(id: string) {
  return apiFetch<void>(`/materials/${id}`, { method: "DELETE" });
}
