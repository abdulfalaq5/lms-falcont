"use client";

import * as React from "react";
import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import type { Course } from "@/lib/api/courses";
import type { Schedule } from "@/lib/api/schedules";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/patterns/empty-state";

export default function InstrukturAttendancePage() {
  const { user } = useAuth();
  const { data: courses } = useApi<Course[]>(user ? `/courses?instructorId=${user.id}` : null, [user?.id]);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
  const courseId = selectedCourseId ?? courses?.[0]?.id ?? "";

  const { data: schedules } = useApi<Schedule[]>(courseId ? `/schedules?courseId=${courseId}` : null, [courseId]);
  const sessions = schedules?.filter((s) => s.type === "session") ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Absensi" subtitle="Catat kehadiran peserta untuk setiap sesi live." />
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
          sessions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {sessions.map((s) => (
                <Card key={s.id} className="flex items-center justify-between px-5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.start_time).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link href={`/dashboard/instruktur/attendance/${s.id}?courseId=${courseId}`}>
                    <Button variant="outline">Catat Kehadiran</Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada sesi live" description="Tambahkan jadwal sesi live di menu Jadwal & Tenggat." />
          )
        )}
      </div>
    </div>
  );
}
