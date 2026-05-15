import { Bell, Menu, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-[#eef2f7]/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Abrir menu"
            className="rounded-2xl bg-white p-3 text-slate-600 shadow-sm md:hidden"
            type="button"
          >
            <Menu className="size-5" />
          </button>
          <div>
            <p className="text-sm font-medium text-slate-500">Dashboard</p>
            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
              Resumen financiero
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden h-11 items-center gap-2 rounded-2xl bg-white px-4 text-slate-500 shadow-sm sm:flex">
            <Search className="size-4" />
            <span className="text-sm">Buscar</span>
          </div>
          <button
            aria-label="Notificaciones"
            className="rounded-2xl bg-white p-3 text-slate-600 shadow-sm transition hover:text-slate-950"
            type="button"
          >
            <Bell className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
