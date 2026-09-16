"use client";

import { RoleGuard } from "@/components/patterns/route-guard";

export default function UserLayout({ children }: LayoutProps<"/dashboard/user">) {
  return <RoleGuard allow={["user"]}>{children}</RoleGuard>;
}
