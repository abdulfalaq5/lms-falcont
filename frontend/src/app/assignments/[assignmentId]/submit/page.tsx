"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { uploadFile } from "@/lib/api/uploads";
import { submitAssignment } from "@/lib/api/assignments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SubmitAssignmentPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    try {
      const uploaded = await uploadFile(file);
      await submitAssignment(assignmentId, uploaded.url);
      setDone(true);
      toast.success("Tugas berhasil dikumpulkan.");
    } catch {
      toast.error("Gagal mengumpulkan tugas.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <h1 className="font-heading text-2xl text-foreground">Tugas Terkumpul</h1>
        <p className="text-sm text-muted-foreground">
          Berkas tugasmu sudah tersimpan. Nilai akan muncul setelah dinilai instruktur.
        </p>
        <Button onClick={() => router.back()}>Kembali ke Kelas</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-heading text-2xl text-foreground">Kumpulkan Tugas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Unggah berkas jawaban tugasmu di bawah ini.</p>
      </div>
      <Card className="px-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Berkas Tugas</Label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="rounded-lg border border-input px-2.5 py-1.5 text-sm"
            />
          </div>
          <Button type="submit" disabled={submitting || !file}>
            {submitting ? "Mengunggah..." : "Kumpulkan Tugas"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
