import type { Session } from "../../../types/domain";
import type {
  CreatePayrollPayload,
  Payroll,
  PayrollCatalogOption,
  PayrollDetailFormValues,
  PayrollFormValues,
  PayrollScope,
} from "../types/payroll";
import { resolveEmpresaId } from "../schema/payroll-schema";

const emptyDetail: PayrollDetailFormValues = {
  bonos: "0",
  descuentos: "0",
  empleadoId: "",
  sueldoBase: "",
};

export function createPayrollScope(session: Session): PayrollScope {
  return {
    isAdmin: session.role === "ADMIN",
    session,
    sessionEmpresaId: session.empresaId,
  };
}

export function createPayrollFormValues(session: Session): PayrollFormValues {
  return {
    anio: new Date().getFullYear().toString(),
    detalles: [createEmptyPayrollDetail()],
    empresaId: session.empresaId?.toString() ?? "",
    mes: `${new Date().getMonth() + 1}`,
  };
}

export function createEmptyPayrollDetail(): PayrollDetailFormValues {
  return { ...emptyDetail };
}

export function updatePayrollFormValue(
  form: PayrollFormValues,
  key: keyof PayrollFormValues,
  value: string | PayrollDetailFormValues[],
) {
  return {
    ...form,
    [key]: value,
  };
}

export function updatePayrollDetailValue(
  details: PayrollDetailFormValues[],
  index: number,
  key: keyof PayrollDetailFormValues,
  value: string,
) {
  return details.map((detail, detailIndex) =>
    detailIndex === index
      ? {
          ...detail,
          [key]: value,
        }
      : detail,
  );
}

export function addPayrollDetail(details: PayrollDetailFormValues[]) {
  return [...details, createEmptyPayrollDetail()];
}

export function removePayrollDetail(
  details: PayrollDetailFormValues[],
  index: number,
) {
  return details.filter((_, detailIndex) => detailIndex !== index);
}

export function buildCreatePayrollPayload(
  form: PayrollFormValues,
  scope: PayrollScope,
): CreatePayrollPayload {
  return {
    anio: Number.parseInt(form.anio, 10),
    detalles: form.detalles.map((detail) => ({
      bonos: Number.parseFloat(detail.bonos || "0"),
      descuentos: Number.parseFloat(detail.descuentos || "0"),
      empleadoId: Number.parseInt(detail.empleadoId, 10),
      sueldoBase: Number.parseFloat(detail.sueldoBase || "0"),
    })),
    empresaId: Number.parseInt(resolveEmpresaId(form, scope), 10),
    mes: Number.parseInt(form.mes, 10),
  };
}

export function buildEmployeeOptions(
  employees: Array<{
    activo: boolean;
    apellidos: string;
    correo: string;
    empresaId: number;
    id: number;
    nombres: string;
    nombreRol: string;
  }>,
  scope: PayrollScope,
): PayrollCatalogOption[] {
  return employees
    .filter((employee) =>
      scope.isAdmin || !scope.sessionEmpresaId
        ? true
        : employee.empresaId === scope.sessionEmpresaId,
    )
    .map((employee) => ({
      description: `${employee.nombreRol} · ${employee.correo}`,
      label: `${employee.nombres} ${employee.apellidos}`,
      value: employee.id.toString(),
    }));
}

export function buildVisiblePayrolls(
  payrolls: Payroll[],
  scope: PayrollScope,
) {
  return payrolls
    .filter((payroll) =>
      scope.isAdmin || !scope.sessionEmpresaId
        ? true
        : payroll.empresaId === scope.sessionEmpresaId,
    )
    .sort((a, b) => {
      if (a.anio !== b.anio) {
        return b.anio - a.anio;
      }

      return b.mes - a.mes;
    });
}
