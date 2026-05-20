"use client";

import { Eye, ReceiptText } from "lucide-react";
import type { Payroll } from "../types/payroll";
import { formatCurrency, getMonthLabel } from "../utils/payroll-format";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type PayrollListProps = {
  isLoading: boolean;
  onView: (payrollId: number) => void;
  payrolls: Payroll[];
};

export function PayrollList({ isLoading, onView, payrolls }: PayrollListProps) {
  return (
    <Panel>
      <div>
        <p className="text-sm font-medium text-slate-500">Historial</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Planillas generadas
        </h3>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando las planillas generadas para esta empresa."
            icon={<ReceiptText className="size-6" />}
            title="Cargando planillas..."
          />
        ) : payrolls.length === 0 ? (
          <EmptyState
            description="Cuando generes la primera planilla, aparecera aqui con su total y detalle."
            icon={<ReceiptText className="size-6" />}
            title="No hay planillas registradas"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Periodo</th>
                  <th className="py-3 pr-4 font-medium">Empresa</th>
                  <th className="py-3 pr-4 font-medium">Monto total</th>
                  <th className="py-3 pr-4 font-medium">Detalles</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((payroll) => (
                  <tr className="border-b border-slate-100" key={payroll.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">
                        {getMonthLabel(payroll.mes)} {payroll.anio}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      Empresa ID {payroll.empresaId}
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {formatCurrency(payroll.montoTotal)}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {payroll.detalles.length} colaboradores
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        icon={<Eye className="size-4" />}
                        onClick={() => onView(payroll.id)}
                        variant="secondary"
                      >
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Panel>
  );
}
