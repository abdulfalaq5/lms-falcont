"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Role, ROLE_HOME, ROLE_LABELS, useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
}

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  super_admin: [
    { label: "Ringkasan", href: "/dashboard/super-admin" },
    { label: "Manajemen Pengguna", href: "/dashboard/super-admin/users" },
    { label: "Manajemen Kelas", href: "/dashboard/super-admin/courses" },
    { label: "Kategori Kelas", href: "/dashboard/super-admin/categories" },
    { label: "Persetujuan Pendaftaran", href: "/dashboard/admin/enrollments" },
    { label: "Log Aktivitas", href: "/dashboard/super-admin/audit-logs" },
    { label: "Katalog Kelas", href: "/courses" },
    { label: "Kalender", href: "/calendar" },
    { label: "Profil", href: "/dashboard/profile" },
  ],
  admin: [
    { label: "Ringkasan", href: "/dashboard/admin" },
    { label: "Manajemen Pengguna", href: "/dashboard/admin/users" },
    { label: "Manajemen Kelas", href: "/dashboard/admin/courses" },
    { label: "Persetujuan Pendaftaran", href: "/dashboard/admin/enrollments" },
    { label: "Katalog Kelas", href: "/courses" },
    { label: "Kalender", href: "/calendar" },
    { label: "Profil", href: "/dashboard/profile" },
  ],
  instruktur: [
    { label: "Ringkasan", href: "/dashboard/instruktur" },
    { label: "Kelas Saya", href: "/dashboard/instruktur/courses" },
    { label: "Tugas Perlu Dinilai", href: "/dashboard/instruktur/grading" },
    { label: "Absensi", href: "/dashboard/instruktur/attendance" },
    { label: "Jadwal & Tenggat", href: "/dashboard/instruktur/schedules" },
    { label: "Pengumuman", href: "/dashboard/instruktur/announcements" },
    { label: "Kalender", href: "/calendar" },
    { label: "Profil", href: "/dashboard/profile" },
  ],
  user: [
    { label: "Ringkasan", href: "/dashboard/user" },
    { label: "Kelas Saya", href: "/dashboard/user/courses" },
    { label: "Tugas Saya", href: "/dashboard/user/assignments" },
    { label: "Nilai & Sertifikat", href: "/dashboard/user/grades" },
    { label: "Katalog Kelas", href: "/courses" },
    { label: "Kalender", href: "/calendar" },
    { label: "Profil", href: "/dashboard/profile" },
  ],
};

export function NavList({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-primary-soft font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarFooter() {
  const router = useRouter();
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="mt-6 border-t border-border pt-4">
      <p className="px-2 text-sm font-medium text-foreground">{user.name}</p>
      <p className="px-2 text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
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
  );
}

export function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card px-4 py-6 md:flex">
      <Link href={ROLE_HOME[role]} className="mb-6 px-2 font-heading text-lg text-primary">
        Kelas Kita
      </Link>
      <NavList role={role} />
      <SidebarFooter />
    </aside>
  );
}
