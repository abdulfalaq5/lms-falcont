"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center text-ink-soft">
        Memuat...
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
