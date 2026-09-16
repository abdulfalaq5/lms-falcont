"use client";

import { UserManagementPage } from "@/components/patterns/user-management-page";

export default function SuperAdminUsersPage() {
  return <UserManagementPage allowedRoles={["super_admin", "admin", "instruktur", "user"]} />;
}
