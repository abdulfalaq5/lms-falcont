"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Role, ROLE_HOME, ROLE_LABELS, useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  super_admin: [
    { label: "Ringkasan", href: "/dashboard/super-admin" },
    { label: "Katalog Kelas", href: "/courses" },
    { label: "Kalender", href: "/calendar" },
  ],
  admin: [
    { label: "Ringkasan", href: "/dashboard/admin" },
    { label: "Katalog Kelas", href: "/courses" },
    { label: "Kalender", href: "/calendar" },
  ],
  instruktur: [
    { label: "Ringkasan", href: "/dashboard/instruktur" },
    { label: "Katalog Kelas", href: "/courses" },
    { label: "Kalender", href: "/calendar" },
  ],
  user: [
    { label: "Ringkasan", href: "/dashboard/user" },
    { label: "Katalog Kelas", href: "/courses" },
    { label: "Kalender", href: "/calendar" },
  ],
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="hidden w-60 flex-col border-r border-line bg-surface/60 px-4 py-6 md:flex">
      <Link href={ROLE_HOME[role]} className="mb-6 px-2 font-heading text-lg text-terracotta">
        Kelas Kita
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-terracotta-soft text-terracotta font-medium"
                  : "text-ink-soft hover:bg-cream-deep hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="mt-6 border-t border-line pt-4">
          <p className="px-2 text-sm font-medium text-ink">{user.name}</p>
          <p className="px-2 text-xs text-ink-soft">{ROLE_LABELS[user.role]}</p>
          <Button
            variant="ghost"
            className="mt-3 w-full"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Keluar
          </Button>
        </div>
      )}
    </aside>
  );
}
