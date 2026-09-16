"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import { apiFetch, ApiError } from "@/lib/api";
import { toast } from "sonner";
import type { Course } from "@/lib/api/courses";
import type { Material } from "@/lib/api/materials";
import type { Quiz } from "@/lib/api/quizzes";
import type { Assignment } from "@/lib/api/assignments";
import type { Announcement } from "@/lib/api/announcements";
import type { ForumPost } from "@/lib/api/forums";
import { createForumPost } from "@/lib/api/forums";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/patterns/empty-state";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: course, loading: courseLoading } = useApi<Course>(`/courses/${id}`);
  const { data: materials } = useApi<Material[]>(`/materials?courseId=${id}`);
  const { data: quizzes } = useApi<Quiz[]>(user ? `/quizzes?courseId=${id}` : null);
  const { data: assignments } = useApi<Assignment[]>(user ? `/assignments?courseId=${id}` : null);
  const { data: announcements } = useApi<Announcement[]>(`/announcements?courseId=${id}`);
  const { data: forumPosts, refetch: refetchForum } = useApi<ForumPost[]>(user ? `/forums?courseId=${id}` : null);

  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const isStaff = user && ["super_admin", "admin", "instruktur"].includes(user.role);

  async function handleEnroll() {
    setEnrolling(true);
    setMessage(null);
    try {
      const res = await apiFetch<{ status: string }>("/enrollments", {
        method: "POST",
        body: { course_id: id },
      });
      setMessage(
        res.status === "active"
          ? "Berhasil! Kamu langsung terdaftar aktif di kelas ini."
          : "Pendaftaran dikirim, menunggu persetujuan Admin.",
      );
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Gagal mendaftar kelas.");
    } finally {
      setEnrolling(false);
    }
  }

  const postReply = useMutation(() => createForumPost({ course_id: id, content: reply }));

  async function handlePostReply() {
    if (!reply.trim()) return;
    try {
      await postReply.mutate(undefined);
      setReply("");
      refetchForum();
      toast.success("Komentar terkirim.");
    } catch {
      toast.error("Gagal mengirim komentar.");
    }
  }

  if (courseLoading || !course) {
    return <p className="p-10 text-center text-sm text-muted-foreground">Memuat kelas...</p>;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">
          ← Kembali ke Katalog
        </Link>
        {user && (
          <Link href={ROLE_HOME[user.role]}>
            <Button variant="ghost">Ke Dashboard</Button>
          </Link>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          {course.category_name && <Badge variant="outline">{course.category_name}</Badge>}
          <Badge variant={course.is_open_enrollment ? "default" : "secondary"}>
            {course.is_open_enrollment ? "Pendaftaran Terbuka" : "Perlu Persetujuan"}
          </Badge>
        </div>
        <h1 className="font-heading mt-2 text-2xl text-foreground sm:text-3xl">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{course.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">Pengajar: {course.instructor_name ?? "-"}</p>
      </div>

      {message && (
        <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      {user?.role === "user" && (
        <Button className="w-fit" disabled={enrolling} onClick={handleEnroll}>
          {enrolling ? "Memproses..." : "Daftar Kelas Ini"}
        </Button>
      )}
      {!user && (
        <Link href="/login">
          <Button>Masuk untuk Mendaftar</Button>
        </Link>
      )}

      <Tabs defaultValue="materi">
        <TabsList>
          <TabsTrigger value="materi">Materi</TabsTrigger>
          {user && <TabsTrigger value="kuis">Kuis</TabsTrigger>}
          {user && <TabsTrigger value="tugas">Tugas</TabsTrigger>}
          <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
          {user && <TabsTrigger value="diskusi">Diskusi</TabsTrigger>}
        </TabsList>

        <TabsContent value="materi" className="mt-4">
          {materials && materials.length > 0 ? (
            <div className="flex flex-col gap-2">
              {materials.map((m) => (
                <Card key={m.id} className="flex items-center justify-between px-5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{m.type}</p>
                  </div>
                  <a href={m.content_url} target="_blank" rel="noreferrer">
                    <Button variant="outline">Buka Materi</Button>
                  </a>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada materi" description="Materi kelas akan muncul di sini." />
          )}
        </TabsContent>

        {user && (
          <TabsContent value="kuis" className="mt-4">
            {quizzes && quizzes.length > 0 ? (
              <div className="flex flex-col gap-2">
                {quizzes.map((q) => (
                  <Card key={q.id} className="flex items-center justify-between px-5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{q.title}</p>
                      <p className="text-xs capitalize text-muted-foreground">{q.type.replace("_", " ")}</p>
                    </div>
                    {isStaff ? (
                      <Link href={`/dashboard/instruktur/courses/${id}/quizzes/${q.id}`}>
                        <Button variant="outline">Kelola</Button>
                      </Link>
                    ) : (
                      <Link href={`/quizzes/${q.id}/take`}>
                        <Button variant="outline">Kerjakan</Button>
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada kuis" description="Kuis untuk kelas ini akan muncul di sini." />
            )}
          </TabsContent>
        )}

        {user && (
          <TabsContent value="tugas" className="mt-4">
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
                    {isStaff ? (
                      <Link href={`/dashboard/instruktur/courses/${id}/assignments/${a.id}/submissions`}>
                        <Button variant="outline">Lihat Kumpulan</Button>
                      </Link>
                    ) : (
                      <Link href={`/assignments/${a.id}/submit`}>
                        <Button variant="outline">Kumpulkan Tugas</Button>
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada tugas" description="Tugas untuk kelas ini akan muncul di sini." />
            )}
          </TabsContent>
        )}

        <TabsContent value="pengumuman" className="mt-4">
          {announcements && announcements.length > 0 ? (
            <div className="flex flex-col gap-2">
              {announcements.map((a) => (
                <Card key={a.id} className="flex flex-col gap-1 px-5">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString("id-ID")}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada pengumuman" description="Pengumuman kelas akan muncul di sini." />
          )}
        </TabsContent>

        {user && (
          <TabsContent value="diskusi" className="mt-4 flex flex-col gap-3">
            <div className="flex gap-2">
              <Textarea
                placeholder="Tulis komentar atau pertanyaan..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <Button onClick={handlePostReply} disabled={postReply.loading} className="self-end">
                Kirim
              </Button>
            </div>
            {forumPosts && forumPosts.length > 0 ? (
              <div className="flex flex-col gap-2">
                {forumPosts.map((p) => (
                  <Card key={p.id} className="flex flex-col gap-1 px-5">
                    <p className="text-sm font-medium text-foreground">{p.user_name ?? "Pengguna"}</p>
                    <p className="text-sm text-muted-foreground">{p.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleString("id-ID")}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState title="Belum ada diskusi" description="Jadilah yang pertama bertanya di forum kelas ini." />
            )}
          </TabsContent>
        )}
      </Tabs>
    </main>
  );
}
