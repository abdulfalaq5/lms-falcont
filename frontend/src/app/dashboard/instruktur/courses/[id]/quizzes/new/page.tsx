"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@/lib/use-mutation";
import { createQuiz } from "@/lib/api/quizzes";

export default function NewQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<"pilihan_ganda" | "essay">("pilihan_ganda");

  const create = useMutation(() => createQuiz({ course_id: id, title, type }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const quiz = await create.mutate(undefined);
      toast.success("Kuis dibuat, sekarang tambahkan soal.");
      router.push(`/dashboard/instruktur/courses/${id}/quizzes/${quiz.id}`);
    } catch {
      toast.error("Gagal membuat kuis.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Buat Kuis Baru" subtitle="Tentukan judul dan tipe kuis, lalu tambahkan soal." />
      <div className="flex flex-1 flex-col p-6">
        <Card className="max-w-lg px-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Judul Kuis</Label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Tipe Kuis</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pilihan_ganda">Pilihan Ganda</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={create.loading}>
              {create.loading ? "Menyimpan..." : "Buat Kuis"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
