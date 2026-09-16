import { apiFetch } from "@/lib/api";
import type { Role } from "@/lib/auth-context";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  created_at?: string;
}

export interface UserInput {
  name: string;
  email: string;
  password?: string;
  role: Role;
  status?: string;
}

export function listUsers(params: { role?: string } = {}) {
  const qs = params.role ? `?role=${params.role}` : "";
  return apiFetch<ManagedUser[]>(`/users${qs}`);
}

export function getUser(id: string) {
  return apiFetch<ManagedUser>(`/users/${id}`);
}

export function createUser(body: UserInput) {
  return apiFetch<ManagedUser>("/users", { method: "POST", body });
}

export function updateUser(id: string, body: Partial<UserInput>) {
  return apiFetch<ManagedUser>(`/users/${id}`, { method: "PATCH", body });
}

export function deleteUser(id: string) {
  return apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}
