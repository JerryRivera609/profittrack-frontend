"use client";

import { Button } from "../../ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import type { Payroll } from "../types/payroll";
import { formatCurrency, getMonthLabel } from "../utils/payroll-format";

type PayrollDetailModalProps = {
  isLoading: boolean;
  onClose: () => void;
  payroll: Payroll | null;
};

export function PayrollDetailModal({
  isLoading,
  onClose,
  payroll,
}: PayrollDetailModalProps) {
  return (
    <Modal onClose={onClose} open={Boolean(payroll) || isLoading} size="xl">
      <ModalHeader>
        <div>
          <p className="text-sm font-medium text-slate-500">Detalle</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {payroll
              ? `Planilla ${getMonthLabel(payroll.mes)} ${payroll.anio}`
              : "Cargando planilla"}
          </h3>
        </div>
        <ModalCloseButton onClose={onClose} />
      </ModalHeader>
      <ModalBody>
        {isLoading || !payroll ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            Cargando detalle de planilla...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Empresa ID</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{payroll.empresaId}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Periodo</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {getMonthLabel(payroll.mes)} {payroll.anio}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-400">Monto total</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {formatCurrency(payroll.montoTotal)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="py-3 pr-4 font-medium">Empleado</th>
                    <th className="py-3 pr-4 font-medium">Sueldo base</th>
                    <th className="py-3 pr-4 font-medium">Bonos</th>
                    <th className="py-3 pr-4 font-medium">Descuentos</th>
                    <th className="py-3 font-medium">Sueldo final</th>
                  </tr>
                </thead>
                <tbody>
                  {payroll.detalles.map((detail) => (
                    <tr className="border-b border-slate-100" key={detail.id}>
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {detail.empleadoNombre}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {formatCurrency(detail.sueldoBase)}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {formatCurrency(detail.bonos)}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        {formatCurrency(detail.descuentos)}
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        {formatCurrency(detail.sueldoFinal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
