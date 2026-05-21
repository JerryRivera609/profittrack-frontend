    "use client";

import {
  Bell,
  ChevronDown,
  LineChart,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  navigationItems,
  roleLabels,
  roleLoginPath,
} from "../../config/navigation";
import {
  authApi,
  ApiRequestError,
} from "../../lib/api";
import {
  buildRefreshedSession,
  clearStoredSession,
  getRoleLoginPath,
  getStoredSession,
  updateStoredSession,
} from "../../lib/auth-session";
import { cn } from "../../lib/class-names";
import type { Session } from "../../types/domain";
import { PlatformAuthProvider } from "./platform-auth-context";

type PlatformShellProps = {
  children: ReactNode;
};

export function PlatformShell({ children }: PlatformShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allowedItems = useMemo(
    () =>
      session
        ? navigationItems.filter((item) => item.roles.includes(session.role))
        : [],
    [session],
  );

  const currentItem = navigationItems.find((item) => item.href === pathname);
  const canAccess =
    !currentItem || (session ? currentItem.roles.includes(session.role) : false);

  useEffect(() => {
    setSession(getStoredSession());
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!session) {
      router.replace("/login");
    }
  }, [hasHydrated, router, session]);

  useEffect(() => {
    if (!hasHydrated || !session) {
      return;
    }

    const activeSession = session;
    let cancelled = false;
    let refreshTimeoutId: number | undefined;
    let logoutTimeoutId: number | undefined;

    async function runRefresh() {
      try {
        const response = await authApi.refresh();

        if (cancelled) {
          return;
        }

        const refreshedSession = buildRefreshedSession(activeSession, response);
        updateStoredSession(refreshedSession);
        setSession(refreshedSession);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("[sessionRefresh]", error);
        forceLogout(activeSession);
      }
    }

    const refreshDelay = Math.max(activeSession.expiresAt - Date.now() - 10000, 0);
    const logoutDelay = Math.max(activeSession.expiresAt - Date.now(), 0);

    refreshTimeoutId = window.setTimeout(() => {
      void runRefresh();
    }, refreshDelay);

    logoutTimeoutId = window.setTimeout(() => {
      forceLogout(activeSession);
    }, logoutDelay);

    return () => {
      cancelled = true;

      if (refreshTimeoutId) {
        window.clearTimeout(refreshTimeoutId);
      }

      if (logoutTimeoutId) {
        window.clearTimeout(logoutTimeoutId);
      }
    };
  }, [hasHydrated, router, session]);

  function handleLogout() {
    if (!session) {
      return;
    }

    forceLogout(session);
  }

  function forceLogout(activeSession: Session) {
    const loginPath = getRoleLoginPath(activeSession.role);
    clearStoredSession();
    setSession(null);
    router.replace(loginPath);
  }

  if (!hasHydrated || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-950">
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="font-semibold">
            {hasHydrated ? "Redirigiendo al login..." : "Cargando sesion..."}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hasHydrated
              ? "Necesitas iniciar sesion para continuar."
              : "Estamos preparando tu espacio de trabajo."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <PlatformAuthProvider value={{ logout: handleLogout, session }}>
      <main className="min-h-screen bg-slate-100 text-slate-950">
        <div className="flex min-h-screen">
          <Sidebar
            allowedItems={allowedItems}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
            pathname={pathname}
            session={session}
          />

          <section className="flex min-w-0 flex-1 flex-col">
            <Header
              onLogout={handleLogout}
              onMenu={() => setMobileOpen(true)}
              session={session}
            />
            <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
              {canAccess ? (
                children
              ) : (
                <AccessDenied
                  loginPath={roleLoginPath[session.role]}
                  roleLabel={roleLabels[session.role]}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </PlatformAuthProvider>
  );
}

function Header({
  onLogout,
  onMenu,
  session,
}: {
  onLogout: () => void;
  onMenu: () => void;
  session: Session;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Abrir menu"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 md:hidden"
            onClick={onMenu}
            type="button"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden size-10 items-center justify-center rounded-lg bg-slate-950 text-white sm:flex">
            <LineChart className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {session.companyName ?? "ProfitTrack"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {roleLabels[session.role]}
            </p>
          </div>
        </div>

        <div className="hidden h-10 min-w-[280px] max-w-md flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-500 lg:flex">
          <Search className="size-4" />
          <span className="text-sm">Buscar empresas, proyectos o tareas</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Notificaciones"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:text-slate-950"
            type="button"
          >
            <Bell className="size-5" />
          </button>
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:flex">
            <span className="max-w-32 truncate font-semibold">
              {session.displayName}
            </span>
            <ChevronDown className="size-4 text-slate-400" />
          </div>
          <button
            aria-label="Cerrar sesion"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            onClick={onLogout}
            type="button"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  allowedItems,
  mobileOpen,
  onCloseMobile,
  pathname,
  session,
}: {
  allowedItems: typeof navigationItems;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  pathname: string;
  session: Session;
}) {
  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-3 py-4 shadow-sm md:block">
        <SidebarContent
          allowedItems={allowedItems}
          pathname={pathname}
          session={session}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            aria-label="Cerrar menu"
            className="absolute inset-0 bg-slate-950/30"
            onClick={onCloseMobile}
            type="button"
          />
          <aside className="relative h-full w-72 border-r border-slate-200 bg-white px-3 py-4 shadow-xl">
            <SidebarContent
              allowedItems={allowedItems}
              onNavigate={onCloseMobile}
              pathname={pathname}
              session={session}
            />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  allowedItems,
  onNavigate,
  pathname,
  session,
}: {
  allowedItems: typeof navigationItems;
  onNavigate?: () => void;
  pathname: string;
  session: Session;
}) {
  return (
    <div className="flex h-full min-h-[calc(100vh-2rem)] flex-col">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-white">
          <LineChart className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold tracking-tight">ProfitTrack</p>
          <p className="truncate text-xs text-slate-500">Sistema HH.HH</p>
        </div>
      </div>

      <nav className="space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <Icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium uppercase text-slate-400">Sesion</p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
          {session.email}
        </p>
        <p className="mt-1 text-xs text-slate-500">{roleLabels[session.role]}</p>
      </div>
    </div>
  );
}

function AccessDenied({
  loginPath,
  roleLabel,
}: {
  loginPath: string;
  roleLabel: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Acceso restringido</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">
        Este modulo no esta disponible para {roleLabel}.
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        El frontend ya oculta las opciones del menu por rol. Si llegas por URL
        directa, esta vista bloquea el contenido.
      </p>
      <Link
        className="mt-5 inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        href={loginPath}
      >
        Cambiar de portal
      </Link>
    </section>
  );
}
