"use client";

import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/class-names";

type CalendarFieldProps = {
  disabled?: boolean;
  helperText?: string;
  icon?: ReactNode;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
};

const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export function CalendarField({
  disabled = false,
  helperText,
  icon,
  label,
  onChange,
  placeholder = "Selecciona una fecha",
  required = false,
  value,
}: CalendarFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate ?? new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

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

  const monthMatrix = useMemo(() => buildMonthMatrix(viewDate), [viewDate]);

  return (
    <div className="relative" ref={rootRef}>
      <label className="block text-sm font-medium text-slate-700">
        <span>{label}</span>
        <input readOnly required={required} tabIndex={-1} type="hidden" value={value} />
        <button
          aria-expanded={open}
          className={cn(
            "mt-1.5 flex min-h-10 w-full items-center gap-3 rounded-xl border bg-white px-2 py-1 text-left shadow-sm transition",
            disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
              : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:border-teal-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100",
            open && !disabled ? "border-teal-500 ring-4 ring-teal-100" : "",
          )}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="mt-0.5 shrink-0 rounded-xl bg-slate-100 p-2 text-slate-500">
            {icon ?? <CalendarDays className="size-4" />}
          </span>
          <span className="min-w-0 flex-1">
            {selectedDate ? (
              <>
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {formatLongDate(selectedDate)}
                </span>
              </>
            ) : (
              <>
                <span className="block text-sm font-semibold text-slate-500">
                  {placeholder}
                </span>
              </>
            )}
          </span>
        </button>
        {helperText ? (
          <span className="mt-1.5 block text-xs font-normal text-slate-500">
            {helperText}
          </span>
        ) : null}
      </label>

      {open && !disabled ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-200 bg-slate-50 px-2 py-1">
            <div className="flex items-center justify-between gap-3">
              <button
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                onClick={() => setViewDate((current) => shiftMonth(current, -1))}
                type="button"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900">
                  {formatMonthLabel(viewDate)}
                </p>
                <p className="text-xs text-slate-500">
                  Selecciona una fecha del calendario
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!required && value ? (
                  <button
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}
                    type="button"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
                <button
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  onClick={() => setViewDate((current) => shiftMonth(current, 1))}
                  type="button"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="mb-3 grid grid-cols-7">
              {weekDays.map((day) => (
                <div
                  className="px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                  key={day}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {monthMatrix.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                const isToday = isSameDay(date, new Date());

                return (
                  <button
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-xl text-xs font-semibold transition",
                      isSelected
                        ? "bg-slate-950 text-white shadow-[10px]"
                        : isCurrentMonth
                          ? "text-slate-700 hover:bg-slate-100"
                          : "text-slate-300 hover:bg-slate-50",
                      isToday && !isSelected ? "ring-1 ring-teal-300" : "",
                    )}
                    key={date.toISOString()}
                    onClick={() => {
                      onChange(formatInputDate(date));
                      setOpen(false);
                    }}
                    type="button"
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function buildMonthMatrix(viewDate: Date) {
  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startDay = (startOfMonth.getDay() + 6) % 7;
  const startDate = new Date(startOfMonth);
  startDate.setDate(startOfMonth.getDate() - startDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

function shiftMonth(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function parseDateValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function isSameDay(left: Date, right: Date | null) {
  if (!right) {
    return false;
  }

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
