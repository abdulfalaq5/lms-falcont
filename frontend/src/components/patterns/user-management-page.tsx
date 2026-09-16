"use client";

import * as React from "react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { useApi } from "@/lib/use-api";
import { useMutation } from "@/lib/use-mutation";
import { createUser, deleteUser, updateUser, type ManagedUser } from "@/lib/api/users";
import { ROLE_LABELS, type Role } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { StatusBadge } from "@/components/patterns/status-badge";
import { ConfirmDialog } from "@/components/patterns/confirm-dialog";

export function UserManagementPage({ allowedRoles }: { allowedRoles: Role[] }) {
  const { data: users, loading, refetch } = useApi<ManagedUser[]>("/users");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", password: "", role: allowedRoles[0] });

  const create = useMutation(() => createUser(form));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create.mutate(undefined);
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: allowedRoles[0] });
      refetch();
      toast.success("Pengguna berhasil dibuat.");
    } catch {
      toast.error("Gagal membuat pengguna.");
    }
  }

  const visibleUsers = users?.filter((u) => allowedRoles.includes(u.role));

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Manajemen Pengguna" subtitle="Kelola akun pengguna platform." />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">Tambah Pengguna</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Nama</Label>
                <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Kata Sandi</Label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as Role }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r]}
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
          rows={visibleUsers}
          emptyTitle="Belum ada pengguna"
          emptyDescription="Pengguna dengan role yang bisa kamu kelola akan muncul di sini."
          columns={[
            { header: "Nama", cell: (u) => u.name },
            { header: "Email", cell: (u) => u.email },
            { header: "Role", cell: (u) => ROLE_LABELS[u.role] },
            { header: "Status", cell: (u) => <StatusBadge domain="user" value={u.status} /> },
          ]}
          rowActions={(u) => (
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await updateUser(u.id, { status: u.status === "active" ? "inactive" : "active" });
                  refetch();
                  toast.success("Status pengguna diperbarui.");
                }}
              >
                {u.status === "active" ? "Nonaktifkan" : "Aktifkan"}
              </Button>
              <ConfirmDialog
                trigger={
                  <Button variant="ghost" size="sm">
                    Hapus
                  </Button>
                }
                title="Hapus pengguna ini?"
                description={u.name}
                destructive
                onConfirm={async () => {
                  await deleteUser(u.id);
                  refetch();
                  toast.success("Pengguna dihapus.");
                }}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
