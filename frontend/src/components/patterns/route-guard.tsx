"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role, ROLE_HOME, useAuth } from "@/lib/auth-context";

export function RoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !allow.includes(user.role)) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [loading, user, allow, router]);

  if (loading || !user) {
    return <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">Memuat...</div>;
  }

  if (!allow.includes(user.role)) {
    return <div className="flex flex-1 items-center justify-center p-10 text-muted-foreground">Akses ditolak.</div>;
  }

  return <>{children}</>;
}
