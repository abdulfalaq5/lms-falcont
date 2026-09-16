"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import type { Course } from "@/lib/api/courses";
import type { Material } from "@/lib/api/materials";
import { createMaterial, deleteMaterial } from "@/lib/api/materials";
import type { Quiz } from "@/lib/api/quizzes";
import type { Assignment } from "@/lib/api/assignments";
import type { Enrollment } from "@/lib/api/enrollments";
import type { Announcement } from "@/lib/api/announcements";
import { createAnnouncement, deleteAnnouncement } from "@/lib/api/announcements";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/patterns/empty-state";
import { StatusBadge } from "@/components/patterns/status-badge";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";

export default function InstrukturCourseManagePage() {
  const { id } = useParams<{ id: string }>();
  const { data: course } = useApi<Course>(`/courses/${id}`);
  const { data: materials, refetch: refetchMaterials } = useApi<Material[]>(`/materials?courseId=${id}`);
  const { data: quizzes } = useApi<Quiz[]>(`/quizzes?courseId=${id}`);
  const { data: assignments } = useApi<Assignment[]>(`/assignments?courseId=${id}`);
  const { data: enrollments } = useApi<Enrollment[]>(`/enrollments/course/${id}`);
  const { data: announcements, refetch: refetchAnnouncements } = useApi<Announcement[]>(`/announcements?courseId=${id}`);

  const [materialForm, setMaterialForm] = React.useState({ title: "", type: "document", content_url: "" });
  const addMaterial = useMutation(() =>
    createMaterial({ course_id: id, title: materialForm.title, type: materialForm.type as Material["type"], content_url: materialForm.content_url }),
  );

  async function handleAddMaterial(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addMaterial.mutate(undefined);
      setMaterialForm({ title: "", type: "document", content_url: "" });
      refetchMaterials();
      toast.success("Materi ditambahkan.");
    } catch {
      toast.error("Gagal menambahkan materi.");
    }
  }

  const [announcementForm, setAnnouncementForm] = React.useState({ title: "", content: "" });
  const addAnnouncement = useMutation(() =>
    createAnnouncement({ course_id: id, title: announcementForm.title, content: announcementForm.content }),
  );

  async function handleAddAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addAnnouncement.mutate(undefined);
      setAnnouncementForm({ title: "", content: "" });
      refetchAnnouncements();
      toast.success("Pengumuman diterbitkan.");
    } catch {
      toast.error("Gagal menerbitkan pengumuman.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title={course?.title ?? "Kelola Kelas"} subtitle="Kelola materi, kuis, tugas, dan peserta." />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Tabs defaultValue="materi">
          <TabsList>
            <TabsTrigger value="materi">Materi</TabsTrigger>
            <TabsTrigger value="kuis">Kuis</TabsTrigger>
            <TabsTrigger value="tugas">Tugas</TabsTrigger>
            <TabsTrigger value="peserta">Peserta</TabsTrigger>
            <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
          </TabsList>

          <TabsContent value="materi" className="mt-4 flex flex-col gap-4">
            <Card className="px-5">
              <form onSubmit={handleAddMaterial} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label>Judul Materi</Label>
                  <Input
                    required
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Tipe</Label>
                  <Select
                    value={materialForm.type}
                    onValueChange={(v) => setMaterialForm((f) => ({ ...f, type: v }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Dokumen</SelectItem>
                      <SelectItem value="link">Tautan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label>URL Konten</Label>
                  <Input
                    required
                    placeholder="https://..."
                    value={materialForm.content_url}
                    onChange={(e) => setMaterialForm((f) => ({ ...f, content_url: e.target.value }))}
                  />
                </div>
                <Button type="submit" disabled={addMaterial.loading}>
                  Tambah
                </Button>
              </form>
            </Card>

            {materials && materials.length > 0 ? (
              <div className="flex flex-col gap-2">
                {materials.map((m) => (
                  <Card key={m.id} className="flex items-center justify-between px-5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">{m.type}</p>
                    </div>
                    <ConfirmDialog
                      trigger={<Button variant="ghost">Hapus</Button>}
                      title="Hapus materi ini?"
                      description={m.title}
                      destructive
                      onConfirm={async () => {
                        await deleteMaterial(m.id);
                        refetchMaterials();
                        toast.success("Materi dihapus.");
                      }}
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada materi" description="Tambahkan materi pertama untuk kelas ini." />
            )}
          </TabsContent>

          <TabsContent value="kuis" className="mt-4 flex flex-col gap-3">
            <Link href={`/dashboard/instruktur/courses/${id}/quizzes/new`} className="w-fit">
              <Button>Buat Kuis Baru</Button>
            </Link>
            {quizzes && quizzes.length > 0 ? (
              <div className="flex flex-col gap-2">
                {quizzes.map((q) => (
                  <Card key={q.id} className="flex items-center justify-between px-5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">{q.type.replace("_", " ")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/instruktur/courses/${id}/quizzes/${q.id}`}>
                        <Button variant="outline">Kelola Soal</Button>
                      </Link>
                      <Link href={`/dashboard/instruktur/courses/${id}/quizzes/${q.id}/submissions`}>
                        <Button variant="outline">Nilai Jawaban</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada kuis" description="Buat kuis pertama untuk kelas ini." />
            )}
          </TabsContent>

          <TabsContent value="tugas" className="mt-4 flex flex-col gap-3">
            <Link href={`/dashboard/instruktur/courses/${id}/assignments/new`} className="w-fit">
              <Button>Buat Tugas Baru</Button>
            </Link>
            {assignments && assignments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {assignments.map((a) => (
                  <Card key={a.id} className="flex items-center justify-between px-5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      {a.due_date && (
                        <p className="text-xs text-muted-foreground">
                          Tenggat: {new Date(a.due_date).toLocaleDateString("id-ID")}
                        </p>
                      )}
                    </div>
                    <Link href={`/dashboard/instruktur/courses/${id}/assignments/${a.id}/submissions`}>
                      <Button variant="outline">Nilai Kumpulan</Button>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada tugas" description="Buat tugas pertama untuk kelas ini." />
            )}
          </TabsContent>

          <TabsContent value="peserta" className="mt-4 flex flex-col gap-3">
            <Link href={`/dashboard/instruktur/courses/${id}/grades`} className="w-fit">
              <Button variant="outline">Kelola Nilai & Sertifikat</Button>
            </Link>
            {enrollments && enrollments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {enrollments.map((e) => (
                  <Card key={e.id} className="flex items-center justify-between px-5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{e.user_name}</p>
                      <p className="text-xs text-muted-foreground">{e.user_email}</p>
                    </div>
                    <StatusBadge domain="enrollment" value={e.status} />
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada peserta" description="Peserta yang mendaftar akan muncul di sini." />
            )}
          </TabsContent>

          <TabsContent value="pengumuman" className="mt-4 flex flex-col gap-4">
            <Card className="px-5">
              <form onSubmit={handleAddAnnouncement} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Judul</Label>
                  <Input
                    required
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Isi Pengumuman</Label>
                  <Textarea
                    required
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm((f) => ({ ...f, content: e.target.value }))}
                  />
                </div>
                <Button type="submit" disabled={addAnnouncement.loading} className="w-fit">
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
                    </div>
                    <ConfirmDialog
                      trigger={<Button variant="ghost">Hapus</Button>}
                      title="Hapus pengumuman ini?"
                      description={a.title}
                      destructive
                      onConfirm={async () => {
                        await deleteAnnouncement(a.id);
                        refetchAnnouncements();
                        toast.success("Pengumuman dihapus.");
                      }}
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada pengumuman" description="Terbitkan pengumuman pertama untuk kelas ini." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
