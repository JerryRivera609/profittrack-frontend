"use client";

import { ClipboardCheck, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "../../../lib/class-names";
import { ServiceTypeManagement } from "../../tipos-servicio/components/service-type-management";
import { TaskTypeManagement } from "../../tipos-tarea/components/task-type-management";

type ConfigurationSection = "service-types" | "task-types";

type ConfigurationTab = {
  icon: ReactNode;
  id: ConfigurationSection;
  label: string;
};

const tabs: ConfigurationTab[] = [
  {
    icon: <Settings className="size-4" />,
    id: "service-types",
    label: "Tipos de servicio",
  },
  {
    icon: <ClipboardCheck className="size-4" />,
    id: "task-types",
    label: "Tipos de tarea",
  },
];

export function ConfigurationManagement() {
  const [activeSection, setActiveSection] =
    useState<ConfigurationSection>("service-types");

  return (
    <div className="space-y-5">
      <div className="grid rounded-lg bg-slate-100 p-1 sm:grid-cols-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeSection;

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:bg-white/60 hover:text-slate-950",
              )}
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              type="button"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeSection === "service-types" ? (
        <ServiceTypeManagement />
      ) : (
        <TaskTypeManagement />
      )}
    </div>
  );
}
