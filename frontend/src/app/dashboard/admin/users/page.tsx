"use client";

import { UserManagementPage } from "@/components/patterns/user-management-page";

export default function AdminUsersPage() {
  return <UserManagementPage allowedRoles={["instruktur", "user"]} />;
}
