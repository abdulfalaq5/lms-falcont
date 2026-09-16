"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import type { Enrollment } from "@/lib/api/enrollments";
import type { AttendanceEntry } from "@/lib/api/attendance";
import { recordAttendance } from "@/lib/api/attendance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/patterns/empty-state";

const STATUS_OPTIONS: AttendanceEntry["status"][] = ["hadir", "izin", "alpha"];

export default function RecordAttendancePage() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";

  const { data: enrollments } = useApi<Enrollment[]>(courseId ? `/enrollments/course/${courseId}` : null, [courseId]);
  const { data: existing } = useApi<AttendanceEntry[]>(`/attendance/schedule/${scheduleId}`);

  const [overrides, setOverrides] = React.useState<Record<string, AttendanceEntry["status"]>>({});
  const [saving, setSaving] = React.useState(false);

  const existingStatuses = React.useMemo(() => {
    const map: Record<string, AttendanceEntry["status"]> = {};
    for (const e of existing ?? []) map[e.user_id] = e.status;
    return map;
  }, [existing]);
  const statuses = { ...existingStatuses, ...overrides };

  const activeEnrollments = enrollments?.filter((e) => e.status === "active" || e.status === "approved") ?? [];

  async function handleSave() {
    if (!activeEnrollments.length) return;
    setSaving(true);
    try {
      await recordAttendance(
        scheduleId,
        activeEnrollments.map((e) => ({
          user_id: e.user_id!,
          status: statuses[e.user_id!] ?? "alpha",
        })),
      );
      toast.success("Absensi tersimpan.");
    } catch {
      toast.error("Gagal menyimpan absensi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Catat Kehadiran" subtitle="Tandai status kehadiran setiap peserta untuk sesi ini." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        {activeEnrollments.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              {activeEnrollments.map((e) => (
                <Card key={e.id} className="flex items-center justify-between px-5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.user_name}</p>
                    <p className="text-xs text-muted-foreground">{e.user_email}</p>
                  </div>
                  <Select
                    value={statuses[e.user_id!] ?? "alpha"}
                    onValueChange={(v) => setOverrides((s) => ({ ...s, [e.user_id!]: v as AttendanceEntry["status"] }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt} className="capitalize">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Card>
              ))}
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-fit">
              {saving ? "Menyimpan..." : "Simpan Absensi"}
            </Button>
          </>
        ) : (
          <EmptyState title="Tidak ada peserta" description="Belum ada peserta aktif terdaftar di kelas ini." />
        )}
      </div>
    </div>
  );
}
