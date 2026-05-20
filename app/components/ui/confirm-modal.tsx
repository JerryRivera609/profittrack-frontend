"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "./modal";

type ConfirmModalProps = {
  confirmLabel?: string;
  description: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
};

export function ConfirmModal({
  confirmLabel = "Confirmar",
  description,
  isLoading = false,
  onClose,
  onConfirm,
  open,
  title,
}: ConfirmModalProps) {
  return (
    <Modal onClose={onClose} open={open} size="md">
      <ModalHeader>
        <div>
          <p className="text-sm font-medium text-slate-500">Confirmacion</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
        </div>
        <ModalCloseButton onClose={onClose} />
      </ModalHeader>
      <ModalBody>
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <p className="text-sm leading-6 text-amber-900">{description}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="secondary">
          Cancelar
        </Button>
        <Button disabled={isLoading} onClick={onConfirm} variant="danger">
          {isLoading ? "Procesando..." : confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
