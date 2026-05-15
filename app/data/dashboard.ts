import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home as HomeIcon,
  PieChart,
  ReceiptText,
  Settings,
  TrendingUp,
  WalletCards,
} from "lucide-react";

export const navItems = [
  { label: "Resumen", icon: HomeIcon, active: true },
  { label: "Ingresos", icon: TrendingUp },
  { label: "Gastos", icon: ReceiptText },
  { label: "Tarjetas", icon: CreditCard },
  { label: "Reportes", icon: BarChart3 },
  { label: "Ajustes", icon: Settings },
];

export const metrics = [
  {
    label: "Beneficio neto",
    value: "$18,420",
    delta: "+12.4%",
    icon: DollarSign,
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    label: "Ingresos",
    value: "$46,980",
    delta: "+8.1%",
    icon: WalletCards,
    tone: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  },
  {
    label: "Margen",
    value: "39.2%",
    delta: "+3.7%",
    icon: PieChart,
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
  },
];

export const weeklyProfitability = [42, 58, 48, 72, 63, 86, 78, 92, 84, 96];

export const transactions = [
  { name: "Plan Business", type: "Suscripcion", amount: "+$2,400" },
  { name: "Campana Meta Ads", type: "Marketing", amount: "-$620" },
  { name: "Consultoria financiera", type: "Servicio", amount: "+$1,150" },
  { name: "Servidor cloud", type: "Operaciones", amount: "-$180" },
];
