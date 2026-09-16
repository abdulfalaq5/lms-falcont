"use client";

import { RoleGuard } from "@/components/patterns/route-guard";

export default function SuperAdminLayout({ children }: LayoutProps<"/dashboard/super-admin">) {
  return <RoleGuard allow={["super_admin"]}>{children}</RoleGuard>;
}
