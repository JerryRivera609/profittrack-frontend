import type {
  Payroll,
  PayrollDetailFormValues,
  PayrollStats,
} from "../types/payroll";

export function getPayrollStats(payrolls: Payroll[]): PayrollStats[] {
  return [
    {
      label: "Planillas",
      value: payrolls.length.toString(),
    },
    {
      label: "Activas",
      value: payrolls.filter((payroll) => payroll.activo).length.toString(),
    },
    {
      label: "Monto total",
      value: formatCurrency(
        payrolls.reduce((total, payroll) => total + payroll.montoTotal, 0),
      ),
    },
  ];
}

export function getPayrollDetailFinalAmount(detail: PayrollDetailFormValues) {
  const sueldoBase = Number.parseFloat(detail.sueldoBase || "0");
  const bonos = Number.parseFloat(detail.bonos || "0");
  const descuentos = Number.parseFloat(detail.descuentos || "0");

  return sueldoBase + bonos - descuentos;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    currency: "PEN",
    style: "currency",
  }).format(value);
}

export function getMonthLabel(month: number) {
  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
  }).format(new Date(2026, month - 1, 1));
}
