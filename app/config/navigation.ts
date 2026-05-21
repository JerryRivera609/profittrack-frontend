import {
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  ReceiptText,
  Settings,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "../types/domain";

export type NavigationItem = {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
  roles: UserRole[];
};

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  EMPLEADO: "Desarrollador",
  LIDER: "Lider",
  OWNER: "Owner",
};

export const roleHome: Record<UserRole, string> = {
  ADMIN: "/empresas",
  EMPLEADO: "/proyectos",
  LIDER: "/proyectos",
  OWNER: "/dashboard",
};

export const roleLoginPath: Record<UserRole, string> = {
  ADMIN: "/login",
  EMPLEADO: "/login",
  LIDER: "/login",
  OWNER: "/login",
};

export const navigationItems: NavigationItem[] = [
  {
    description: "KPIs principales, tareas abiertas y estado operativo.",
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["ADMIN", "OWNER", "LIDER", "EMPLEADO"],
  },
  {
    description: "Registro de empresas y owners asignados.",
    href: "/empresas",
    icon: Building2,
    label: "Empresas",
    roles: ["ADMIN", "OWNER"],
  },
  {
    description: "Equipo, cargos, contratos y estado laboral.",
    href: "/empleados",
    icon: UsersRound,
    label: "Empleados",
    roles: ["ADMIN", "OWNER"],
  },
  {
    description: "Clientes, contactos, contratos y cartera activa.",
    href: "/clientes",
    icon: BriefcaseBusiness,
    label: "Clientes",
    roles: ["ADMIN", "OWNER"],
  },
  {
    description: "Proyectos, lideres, presupuestos y avance.",
    href: "/proyectos",
    icon: FolderKanban,
    label: "Proyectos",
    roles: ["ADMIN", "OWNER", "LIDER", "EMPLEADO"],
  },
  {
    description: "Tablero de tareas, prioridades y responsables.",
    href: "/tareas",
    icon: ClipboardCheck,
    label: "Tareas",
    roles: ["ADMIN", "OWNER", "LIDER", "EMPLEADO"],
  },
  {
    description: "Registro de tiempo trabajado por tarea y aprobacion del lider.",
    href: "/horas",
    icon: Clock3,
    label: "Horas HH",
    roles: ["LIDER", "EMPLEADO"],
  },
  {
    description: "Planillas, pagos, descuentos y cierres mensuales.",
    href: "/planillas",
    icon: ReceiptText,
    label: "Planillas",
    roles: ["ADMIN", "OWNER"],
  },
  {
    description: "Roles, permisos, integraciones y parametros.",
    href: "/configuracion",
    icon: Settings,
    label: "Configuracion",
    roles: ["ADMIN", "OWNER"],
  },
];

export const roleCapabilities: Record<UserRole, string[]> = {
  ADMIN: ["Empresas", "Usuarios", "Catalogos", "Proyectos"],
  EMPLEADO: ["Mis proyectos", "Mis tareas"],
  LIDER: ["Proyectos", "Tareas"],
  OWNER: ["Mi empresa", "Equipo", "Proyectos", "Planillas"],
};

export const portalOptions = [
  {
    href: "/admin",
    icon: UserRoundCog,
    label: "Admin",
    role: "ADMIN" as const,
  },
  {
    href: "/login",
    icon: Building2,
    label: "Owner",
    role: "OWNER" as const,
  },
  {
    href: "/empleados/login",
    icon: UsersRound,
    label: "Desarrollador",
    role: "EMPLEADO" as const,
  },
];
