"use client";

import { Button } from "../../ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";

export function InfoModal({
  description,
  onClose,
  open,
  title,
}: {
  description: string[];
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  return (
    <Modal onClose={onClose} open={open} size="md">
      <ModalHeader>
        <div>
          <p className="text-sm font-medium text-slate-500">Guía rápida</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
        </div>
        <ModalCloseButton onClose={onClose} />
      </ModalHeader>
      <ModalBody>
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          {description.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
