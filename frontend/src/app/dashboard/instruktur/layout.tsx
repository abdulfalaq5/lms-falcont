"use client";

import { RoleGuard } from "@/components/patterns/route-guard";

export default function InstrukturLayout({ children }: LayoutProps<"/dashboard/instruktur">) {
  return <RoleGuard allow={["instruktur"]}>{children}</RoleGuard>;
}
