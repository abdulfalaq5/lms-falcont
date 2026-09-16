"use client";

import * as React from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import type { Course } from "@/lib/api/courses";
import type { Schedule } from "@/lib/api/schedules";
import { createSchedule, deleteSchedule } from "@/lib/api/schedules";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/patterns/status-badge";
import { EmptyState } from "@/components/patterns/empty-state";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";

export default function InstrukturSchedulesPage() {
  const { user } = useAuth();
  const { data: courses } = useApi<Course[]>(user ? `/courses?instructorId=${user.id}` : null, [user?.id]);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
  const courseId = selectedCourseId ?? courses?.[0]?.id ?? "";

  const { data: schedules, refetch } = useApi<Schedule[]>(courseId ? `/schedules?courseId=${courseId}` : null, [courseId]);

  const [form, setForm] = React.useState({ title: "", type: "session" as "session" | "deadline", start_time: "" });
  const create = useMutation(() =>
    createSchedule({ course_id: courseId, title: form.title, type: form.type, start_time: form.start_time }),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutate(undefined);
      setForm({ title: "", type: "session", start_time: "" });
      refetch();
      toast.success("Jadwal ditambahkan.");
    } catch {
      toast.error("Gagal menambahkan jadwal.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Jadwal & Tenggat" subtitle="Kelola sesi live dan tenggat tugas per kelas." />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-1.5 sm:w-64">
          <Label>Pilih Kelas</Label>
          <Select value={courseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              {courses?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {courseId && (
          <>
            <Card className="px-5">
              <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label>Judul</Label>
                  <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Tipe</Label>
                  <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as typeof f.type }))}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="session">Sesi Live</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Waktu Mulai</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={form.start_time}
                    onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                  />
                </div>
                <Button type="submit" disabled={create.loading}>
                  Tambah
                </Button>
              </form>
            </Card>

            {schedules && schedules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {schedules.map((s) => (
                  <Card key={s.id} className="flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                      <StatusBadge domain="schedule" value={s.type} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(s.start_time).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <ConfirmDialog
                      trigger={<Button variant="ghost">Hapus</Button>}
                      title="Hapus jadwal ini?"
                      description={s.title}
                      destructive
                      onConfirm={async () => {
                        await deleteSchedule(s.id);
                        refetch();
                        toast.success("Jadwal dihapus.");
                      }}
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada jadwal" description="Tambahkan sesi atau deadline pertama untuk kelas ini." />
            )}
          </>
        )}
      </div>
    </div>
  );
}
