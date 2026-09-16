"use client";

import { RoleGuard } from "@/components/patterns/route-guard";

export default function AdminLayout({ children }: LayoutProps<"/dashboard/admin">) {
  return <RoleGuard allow={["admin", "super_admin"]}>{children}</RoleGuard>;
}
