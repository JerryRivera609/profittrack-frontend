"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { cn } from "../../lib/class-names";

type ModalSize = "md" | "lg" | "xl";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  open: boolean;
  size?: ModalSize;
};

type ModalSectionProps = {
  children: ReactNode;
  className?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  lg: "max-w-3xl",
  md: "max-w-xl",
  xl: "max-w-5xl",
};

export function Modal({
  children,
  onClose,
  open,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />
      <div
        className={cn(
          "relative z-10 w-full overflow-visible rounded-2xl border border-slate-200 bg-white shadow-2xl",
          sizeClasses[size],
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, className }: ModalSectionProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-label="Cerrar"
      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
      onClick={onClose}
      type="button"
    >
      <X className="size-4" />
    </button>
  );
}

export function ModalBody({ children, className }: ModalSectionProps) {
  return <div className={cn("px-5 py-5 sm:px-6", className)}>{children}</div>;
}

export function ModalFooter({ children, className }: ModalSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
