import { apiFetch } from "@/lib/api";

export interface Category {
  id: string;
  name: string;
}

export function listCategories() {
  return apiFetch<Category[]>("/categories");
}

export function createCategory(body: { name: string }) {
  return apiFetch<Category>("/categories", { method: "POST", body });
}

export function updateCategory(id: string, body: { name: string }) {
  return apiFetch<Category>(`/categories/${id}`, { method: "PATCH", body });
}

export function deleteCategory(id: string) {
  return apiFetch<void>(`/categories/${id}`, { method: "DELETE" });
}
