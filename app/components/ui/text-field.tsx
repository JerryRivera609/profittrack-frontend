import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/class-names";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  label: string;
};

export function TextField({ className, icon, label, ...props }: TextFieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className="mt-1.5 flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
        {icon}
        <input
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400",
            className,
          )}
          {...props}
        />
      </span>
    </label>
  );
}
