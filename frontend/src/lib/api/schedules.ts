import { apiFetch } from "@/lib/api";

export interface Schedule {
  id: string;
  course_id: string;
  course_title?: string;
  title: string;
  type: "session" | "deadline";
  start_time: string;
  end_time: string | null;
}

export interface ScheduleInput {
  course_id: string;
  title: string;
  type: Schedule["type"];
  start_time: string;
  end_time?: string;
}

export function listCalendar() {
  return apiFetch<Schedule[]>("/schedules/calendar");
}

export function listSchedules(courseId: string) {
  return apiFetch<Schedule[]>(`/schedules?courseId=${courseId}`);
}

export function createSchedule(body: ScheduleInput) {
  return apiFetch<Schedule>("/schedules", { method: "POST", body });
}

export function updateSchedule(id: string, body: Partial<ScheduleInput>) {
  return apiFetch<Schedule>(`/schedules/${id}`, { method: "PATCH", body });
}

export function deleteSchedule(id: string) {
  return apiFetch<void>(`/schedules/${id}`, { method: "DELETE" });
}
