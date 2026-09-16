"use client";

import * as React from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import { createCourse, deleteCourse, type Course } from "@/lib/api/courses";
import type { Category } from "@/lib/api/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/patterns/data-table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";

export function CourseManagementPage() {
  const { data: courses, loading, refetch } = useApi<Course[]>("/courses");
  const { data: categories } = useApi<Category[]>("/categories");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", description: "", category_id: "" });

  const create = useMutation(() =>
    createCourse({ title: form.title, description: form.description || undefined, category_id: form.category_id || undefined }),
  );

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutate(undefined);
      setOpen(false);
      setForm({ title: "", description: "", category_id: "" });
      refetch();
      toast.success("Kelas berhasil dibuat.");
    } catch {
      toast.error("Gagal membuat kelas.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Manajemen Kelas" subtitle="Kelola kelas yang tersedia di platform." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">Tambah Kelas</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Judul Kelas</Label>
                <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Deskripsi</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Kategori</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm((f) => ({ ...f, category_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={create.loading}>
                  {create.loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DataTable
          loading={loading}
          rows={courses ?? undefined}
          emptyTitle="Belum ada kelas"
          emptyDescription="Kelas yang dibuat akan muncul di sini."
          columns={[
            { header: "Judul", cell: (c) => c.title },
            { header: "Kategori", cell: (c) => c.category_name ?? "-" },
            { header: "Pengajar", cell: (c) => c.instructor_name ?? "-" },
            { header: "Status", cell: (c) => <Badge variant="secondary" className="capitalize">{c.status}</Badge> },
          ]}
          rowActions={(c) => (
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm">
                  Hapus
                </Button>
              }
              title="Hapus kelas ini?"
              description={c.title}
              destructive
              onConfirm={async () => {
                await deleteCourse(c.id);
                refetch();
                toast.success("Kelas dihapus.");
              }}
            />
          )}
        />
      </div>
    </div>
  );
}
