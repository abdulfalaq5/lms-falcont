"use client";

import * as React from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import { createCategory, deleteCategory, type Category } from "@/lib/api/categories";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/patterns/empty-state";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";

export default function CategoriesPage() {
  const { data: categories, loading, refetch } = useApi<Category[]>("/categories");
  const [name, setName] = React.useState("");
  const create = useMutation(() => createCategory({ name }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutate(undefined);
      setName("");
      refetch();
      toast.success("Kategori ditambahkan.");
    } catch {
      toast.error("Gagal menambahkan kategori.");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Kategori Kelas" subtitle="Kelola kategori untuk pengelompokan kelas." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Card className="max-w-md px-5">
          <form onSubmit={onSubmit} className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label>Nama Kategori</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="submit" disabled={create.loading}>
              Tambah
            </Button>
          </form>
        </Card>

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat...</p>
        ) : categories && categories.length > 0 ? (
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <Card key={c.id} className="flex items-center justify-between px-5">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <ConfirmDialog
                  trigger={<Button variant="ghost">Hapus</Button>}
                  title="Hapus kategori ini?"
                  description={c.name}
                  destructive
                  onConfirm={async () => {
                    await deleteCategory(c.id);
                    refetch();
                    toast.success("Kategori dihapus.");
                  }}
                />
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada kategori" description="Tambahkan kategori pertama untuk mengelompokkan kelas." />
        )}
      </div>
    </div>
  );
}
