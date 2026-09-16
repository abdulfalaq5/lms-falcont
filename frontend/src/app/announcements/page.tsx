"use client";

import Link from "next/link";
import { useAuth, ROLE_HOME } from "@/lib/auth-context";
import { useApi } from "@/lib/use-api";
import type { Announcement } from "@/lib/api/announcements";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/patterns/page-header";
import { EmptyState } from "@/components/patterns/empty-state";

export default function GlobalAnnouncementsPage() {
  const { user } = useAuth();
  const { data, loading } = useApi<Announcement[]>("/announcements");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Pengumuman"
        subtitle="Informasi terbaru dari platform Kelas Kita."
        actions={
          user ? (
            <Link href={ROLE_HOME[user.role]}>
              <Button variant="ghost">Ke Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
          )
        }
      />
      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat...</p>
      ) : data && data.length > 0 ? (
        <div className="flex flex-col gap-3">
          {data.map((a) => (
            <Card key={a.id} className="flex flex-col gap-1 px-5">
              <p className="font-medium text-foreground">{a.title}</p>
              <p className="text-sm text-muted-foreground">{a.content}</p>
              <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("id-ID")}</p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada pengumuman" description="Pengumuman terbaru akan muncul di sini." />
      )}
    </main>
  );
}
