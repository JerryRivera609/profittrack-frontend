"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LineChart,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";

type LoginScreenProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LoginScreen({ onSubmit }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <BrandHeader />
            <LoginIntro />

            <form
              onSubmit={onSubmit}
              className="rounded-[2rem] border border-white bg-white/85 p-5 shadow-2xl shadow-slate-200/80 backdrop-blur sm:p-6"
            >
              <label className="block text-sm font-medium text-slate-700">
                Correo
                <span className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-500 focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                  <UserRound className="size-5" />
                  <input
                    className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                    defaultValue="demo@profittrack.app"
                    type="email"
                  />
                </span>
              </label>

              <label className="mt-4 block text-sm font-medium text-slate-700">
                Contrasena
                <span className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-500 focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-cyan-100">
                  <LockKeyhole className="size-5" />
                  <input
                    className="w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                    defaultValue="profit-demo"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={
                      showPassword
                        ? "Ocultar contrasena"
                        : "Mostrar contrasena"
                    }
                    className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </span>
              </label>

              <button
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
                type="submit"
              >
                Ingresar al dashboard
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>

        <LoginShowcase />
      </section>
    </main>
  );
}

function BrandHeader() {
  return (
    <div className="mb-10 flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
        <LineChart className="size-6" strokeWidth={2.3} />
      </div>
      <div>
        <p className="text-xl font-semibold tracking-tight">ProfitTrack</p>
        <p className="text-sm text-slate-500">Demo financiero</p>
      </div>
    </div>
  );
}

function LoginIntro() {
  return (
    <div className="mb-8">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800">
        <Sparkles className="size-4" />
        Acceso demo habilitado
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        Control moderno de tu rentabilidad.
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Entra al panel para revisar ingresos, gastos, margen y actividad
        reciente desde una interfaz limpia y rapida.
      </p>
    </div>
  );
}

function LoginShowcase() {
  return (
    <div className="hidden overflow-hidden bg-slate-950 p-8 text-white lg:block">
      <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
        <div>
          <div className="mb-12 flex items-center justify-between">
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-200">
              Mayo 2026
            </span>
            <ShieldCheck className="size-6 text-cyan-300" />
          </div>
          <p className="max-w-sm text-5xl font-semibold leading-tight tracking-tight">
            Mira el pulso del negocio en una sola pantalla.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl bg-white p-5 text-slate-950">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Beneficio mensual
              </p>
              <LineChart className="size-5 text-cyan-600" />
            </div>
            <p className="text-4xl font-semibold">$18,420</p>
            <div className="mt-5 h-24 rounded-2xl bg-[linear-gradient(135deg,#06b6d4,#10b981_48%,#f59e0b)] opacity-90" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-cyan-300 p-5 text-slate-950">
              <p className="text-sm font-medium">ROI</p>
              <p className="mt-6 text-3xl font-semibold">4.8x</p>
            </div>
            <div className="rounded-3xl bg-amber-300 p-5 text-slate-950">
              <p className="text-sm font-medium">Ahorro</p>
              <p className="mt-6 text-3xl font-semibold">$3.1k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
