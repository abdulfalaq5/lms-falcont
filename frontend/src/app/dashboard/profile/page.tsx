"use client";

import { Topbar } from "@/components/layout/topbar";
import { useAuth, ROLE_LABELS } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/patterns/status-badge";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex flex-1 flex-col">
      <Topbar title="Profil Saya" subtitle="Informasi akunmu di platform Kelas Kita." />
      <div className="flex flex-1 flex-col p-6">
        <Card className="max-w-lg px-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-heading text-lg text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
          <dl className="mt-6 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{user.email}</dd>
            </div>
            <div className="flex justify-between pb-2">
              <dt className="text-muted-foreground">Status Akun</dt>
              <dd>
                <StatusBadge domain="user" value={user.status} />
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
