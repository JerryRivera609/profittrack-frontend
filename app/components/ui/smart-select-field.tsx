"use client";

import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/class-names";

export type SmartSelectOption = {
  description?: string;
  label: string;
  value: string;
};

type SmartSelectFieldProps = {
  disabled?: boolean;
  helperText?: string;
  icon?: ReactNode;
  label: string;
  onChange: (value: string) => void;
  options: SmartSelectOption[];
  placeholder: string;
  required?: boolean;
  value: string;
};

export function SmartSelectField({
  disabled = false,
  helperText,
  icon,
  label,
  onChange,
  options,
  placeholder,
  required = false,
  value,
}: SmartSelectFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <label className="block text-sm font-medium text-slate-700">
        <span>{label}</span>
        <input readOnly required={required} tabIndex={-1} type="hidden" value={value} />
        <button
          aria-expanded={open}
          className={cn(
            "mt-0 flex min-h-14 w-full items-center gap-3 rounded-xl border bg-white px-2 py-1 text-left shadow-sm transition",
            disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
              : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:border-teal-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100",
            open && !disabled ? "border-teal-500 ring-4 ring-teal-100" : "",
          )}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {icon ? (
            <span className="mt-0.5 shrink-0 rounded-xl bg-slate-100 p-2 text-slate-500">
              {icon}
            </span>
          ) : null}
          <span className="min-w-0 flex-1">
            {selectedOption ? (
              <>
                <span className="block truncate text-xs font-semibold text-slate-900">
                  {selectedOption.label}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                  {selectedOption.description ?? "Seleccion actual"}
                </span>
              </>
            ) : (
              <>
                <span className="block text-sm font-semibold text-slate-500">
                  {placeholder}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  Elige una opcion de la lista
                </span>
              </>
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-slate-400 transition",
              open ? "rotate-180" : "",
            )}
          />
        </button>
        {helperText ? (
          <span className="mt-1.5 block text-xs font-normal text-slate-500">
            {helperText}
          </span>
        ) : null}
      </label>

      {open && !disabled ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="max-h-72 overflow-y-auto p-2">
            {options.length === 0 ? (
              <div className="rounded-xl px-3 py-4 text-sm text-slate-500">
                No hay opciones disponibles.
              </div>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition",
                      isSelected
                        ? "bg-slate-950 text-white"
                        : "text-slate-700 hover:bg-slate-50",
                    )}
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-slate-200 bg-white text-transparent",
                      )}
                    >
                      <Check className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-xs font-semibold",
                          isSelected ? "text-white" : "text-slate-900",
                        )}
                      >
                        {option.label}
                      </span>
                      {option.description ? (
                        <span
                          className={cn(
                            "mt-0.5 block text-[10px]",
                            isSelected ? "text-slate-200" : "text-slate-500",
                          )}
                        >
                          {option.description}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
