import { apiFetch } from "@/lib/api";

export interface AttendanceEntry {
  user_id: string;
  user_name?: string;
  status: "hadir" | "izin" | "alpha";
}

export function listAttendance(scheduleId: string) {
  return apiFetch<AttendanceEntry[]>(`/attendance/schedule/${scheduleId}`);
}

export function recordAttendance(scheduleId: string, entries: AttendanceEntry[]) {
  return apiFetch<void>(`/attendance/schedule/${scheduleId}`, {
    method: "POST",
    body: { entries: entries.map((e) => ({ user_id: e.user_id, status: e.status })) },
  });
}
