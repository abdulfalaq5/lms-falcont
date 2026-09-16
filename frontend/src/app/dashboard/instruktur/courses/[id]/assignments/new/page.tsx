"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@/lib/use-mutation";
import { createAssignment } from "@/lib/api/assignments";

export default function NewAssignmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");

  const create = useMutation(() =>
    createAssignment({ course_id: id, title, description: description || undefined, due_date: dueDate || undefined }),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutate(undefined);
      toast.success("Tugas berhasil dibuat.");
      router.push(`/dashboard/instruktur/courses/${id}`);
    } catch {
      toast.error("Gagal membuat tugas.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Buat Tugas Baru" subtitle="Tentukan judul, deskripsi, dan tenggat waktu." />
      <div className="flex flex-1 flex-col p-6">
        <Card className="max-w-lg px-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Judul Tugas</Label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Deskripsi</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Tenggat Waktu</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <Button type="submit" disabled={create.loading}>
              {create.loading ? "Menyimpan..." : "Buat Tugas"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
