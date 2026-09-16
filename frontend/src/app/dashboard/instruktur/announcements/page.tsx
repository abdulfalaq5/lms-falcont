"use client";

import * as React from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import type { Course } from "@/lib/api/courses";
import type { Announcement } from "@/lib/api/announcements";
import { createAnnouncement, deleteAnnouncement } from "@/lib/api/announcements";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/patterns/empty-state";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";

export default function InstrukturAnnouncementsPage() {
  const { user } = useAuth();
  const { data: courses } = useApi<Course[]>(user ? `/courses?instructorId=${user.id}` : null, [user?.id]);
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null);
  const courseId = selectedCourseId ?? courses?.[0]?.id ?? "";

  const { data: announcements, refetch } = useApi<Announcement[]>(courseId ? `/announcements?courseId=${courseId}` : null, [courseId]);

  const [form, setForm] = React.useState({ title: "", content: "" });
  const create = useMutation(() => createAnnouncement({ course_id: courseId, title: form.title, content: form.content }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutate(undefined);
      setForm({ title: "", content: "" });
      refetch();
      toast.success("Pengumuman diterbitkan.");
    } catch {
      toast.error("Gagal menerbitkan pengumuman.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Pengumuman" subtitle="Kirim pengumuman ke peserta kelasmu." />
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
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Judul</Label>
                  <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Isi Pengumuman</Label>
                  <Textarea required value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
                </div>
                <Button type="submit" disabled={create.loading} className="w-fit">
                  Terbitkan
                </Button>
              </form>
            </Card>

            {announcements && announcements.length > 0 ? (
              <div className="flex flex-col gap-2">
                {announcements.map((a) => (
                  <Card key={a.id} className="flex items-start justify-between gap-4 px-5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.content}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <ConfirmDialog
                      trigger={<Button variant="ghost">Hapus</Button>}
                      title="Hapus pengumuman ini?"
                      description={a.title}
                      destructive
                      onConfirm={async () => {
                        await deleteAnnouncement(a.id);
                        refetch();
                        toast.success("Pengumuman dihapus.");
                      }}
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada pengumuman" description="Terbitkan pengumuman pertama untuk kelas ini." />
            )}
          </>
        )}
      </div>
    </div>
  );
}
