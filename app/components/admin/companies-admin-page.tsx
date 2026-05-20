"use client";

import { usePlatformAuth } from "../platform/platform-auth-context";
import { AdminDashboard } from "./admin-dashboard";

export function CompaniesAdminPage() {
  const { session } = usePlatformAuth();

  return <AdminDashboard apiToken={session.apiToken} />;
}
