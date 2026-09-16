import { apiFetch } from "@/lib/api";

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  created_at: string;
  user_name: string | null;
}

export function listAuditLogs() {
  return apiFetch<AuditLog[]>("/audit-logs");
}
