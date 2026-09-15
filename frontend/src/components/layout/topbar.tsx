"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface/60 px-6 py-5">
      <div>
        <h1 className="font-heading text-2xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Keluar
      </Button>
    </header>
  );
}
