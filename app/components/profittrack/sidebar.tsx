"use client";

import { ChevronLeft, ChevronRight, LineChart, LogOut } from "lucide-react";
import { navItems } from "../../data/dashboard";

type SidebarProps = {
  collapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
  onLogout: () => void;
};

export function Sidebar({
  collapsed,
  onCollapse,
  onExpand,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={`hidden shrink-0 border-r border-slate-200 bg-white px-3 py-4 shadow-sm transition-[width] duration-300 md:block ${
        collapsed ? "w-[88px]" : "w-72"
      }`}
    >
      <div className="flex h-full flex-col">
        <SidebarBrand collapsed={collapsed} onCollapse={onCollapse} />
        {collapsed && <ExpandButton onExpand={onExpand} />}
        <SidebarNav collapsed={collapsed} />
        <LogoutButton collapsed={collapsed} onLogout={onLogout} />
      </div>
    </aside>
  );
}

function SidebarBrand({
  collapsed,
  onCollapse,
}: Pick<SidebarProps, "collapsed" | "onCollapse">) {
  return (
    <div
      className={`mb-8 flex items-center ${
        collapsed ? "justify-center" : "justify-between"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <LineChart className="size-6" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-semibold tracking-tight">ProfitTrack</p>
            <p className="text-xs text-slate-500">Demo dashboard</p>
          </div>
        )}
      </div>
      {!collapsed && (
        <button
          aria-label="Contraer menu lateral"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          onClick={onCollapse}
          type="button"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
    </div>
  );
}

function ExpandButton({ onExpand }: Pick<SidebarProps, "onExpand">) {
  return (
    <button
      aria-label="Expandir menu lateral"
      className="mx-auto mb-6 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
      onClick={onExpand}
      type="button"
    >
      <ChevronRight className="size-5" />
    </button>
  );
}

function SidebarNav({ collapsed }: Pick<SidebarProps, "collapsed">) {
  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            aria-label={collapsed ? item.label : undefined}
            className={`flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium transition ${
              collapsed ? "justify-center" : ""
            } ${
              item.active
                ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`}
            key={item.label}
            title={collapsed ? item.label : undefined}
            type="button"
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}

function LogoutButton({
  collapsed,
  onLogout,
}: Pick<SidebarProps, "collapsed" | "onLogout">) {
  return (
    <button
      className={`mt-auto flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 ${
        collapsed ? "justify-center" : ""
      }`}
      onClick={onLogout}
      title={collapsed ? "Cerrar sesion" : undefined}
      type="button"
    >
      <LogOut className="size-5 shrink-0" />
      {!collapsed && <span>Cerrar sesion</span>}
    </button>
  );
}
