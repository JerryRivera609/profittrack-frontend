"use client";

import { useState } from "react";
import { DashboardContent } from "./dashboard-content";
import { DashboardHeader } from "./dashboard-header";
import { Sidebar } from "./sidebar";

type DashboardShellProps = {
  onLogout: () => void;
};

export function DashboardShell({ onLogout }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <main className="min-h-screen bg-[#eef2f7] text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(true)}
          onExpand={() => setSidebarCollapsed(false)}
          onLogout={onLogout}
        />

        <section className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <DashboardContent />
        </section>
      </div>
    </main>
  );
}
