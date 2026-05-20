"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LineChart,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { roleCapabilities, roleLabels } from "../../config/navigation";
import { API_BASE_URL, ApiRequestError, authApi } from "../../lib/api";
import { createSession, getRoleHome, getStoredSession, saveSession } from "../../lib/auth-session";
import type { UserRole } from "../../types/domain";
import { Button } from "../ui/button";
import { TextField } from "../ui/text-field";

type RoleLoginPageProps = {
  description: string;
  title: string;
};

export function RoleLoginPage({ description, title }: RoleLoginPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existingSession = getStoredSession();

    if (existingSession) {
      router.replace(getRoleHome(existingSession.role));
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("Validando credenciales...");

    try {
      const response = await authApi.login({
        contrasenia: password,
        correo: email.trim(),
      });

      const normalizedRole = normalizeBackendRole(response.rol, response.tipo);

      if (!normalizedRole) {
        setStatus("No se pudo identificar el rol del usuario.");
        return;
      }

      const session = createSession({
        backendRole: response.rol,
        companyName: getCompanyName(normalizedRole, response.empresaId),
        displayName: response.nombre?.trim() || email.trim(),
        email,
        empresaId: response.empresaId,
        remember,
        role: normalizedRole,
      });

      saveSession(session, remember);
      setStatus(response.mensaje || "Sesion iniciada. Redirigiendo...");
      router.replace(getRoleHome(normalizedRole));
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setStatus(error.message);
      } else {
        setStatus("No se pudo iniciar sesion. Intenta nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 md:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
              <LineChart className="size-6" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">
                ProfitTrack HH.HH
              </p>
              <p className="text-sm text-slate-500">
                Plataforma empresarial
              </p>
            </div>
          </div>

          <p className="mb-3 inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
            <ShieldCheck className="size-4" />
            Login unificado
          </p>
          <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ...roleCapabilities.ADMIN.slice(0, 2),
              ...roleCapabilities.OWNER.slice(0, 2),
            ].map((capability) => (
              <div
                className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm"
                key={capability}
              >
                <p className="text-xs font-medium uppercase text-slate-400">
                  Acceso
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {capability}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-500">Portal</p>
            <h2 className="text-xl font-semibold tracking-tight">
              Un solo acceso para Admin y Owner
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Detectamos tu rol automaticamente desde la respuesta del backend.
            </p>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <TextField
              icon={<Mail className="size-4" />}
              label="Correo"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />

            <label className="block text-sm font-medium text-slate-700">
              Password
              <span className="mt-1.5 flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-100">
                <LockKeyhole className="size-4" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresa tu contrasenia"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Ocultar password" : "Mostrar password"}
                  className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
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

            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 font-medium text-slate-600">
                <input
                  checked={remember}
                  className="size-4 rounded border-slate-300 accent-slate-950"
                  onChange={(event) => setRemember(event.target.checked)}
                  type="checkbox"
                />
                Recordar sesion
              </label>
              <button
                className="font-semibold text-teal-700 transition hover:text-teal-900"
                onClick={() =>
                  setStatus(
                    "Recuperacion pendiente de endpoint. UI preparada para conectar.",
                  )
                }
                type="button"
              >
                Recuperar password
              </button>
            </div>

            {status && (
              <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
                {status}
              </p>
            )}

            <Button
              className="w-full"
              icon={<ArrowRight className="size-4" />}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">API base - Test</p>
            <p className="mt-1 break-all">{API_BASE_URL}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function normalizeBackendRole(
  backendRole?: string,
  backendType?: string,
): UserRole | null {
  const normalizedRole = backendRole?.trim().toLowerCase();
  const normalizedType = backendType?.trim().toLowerCase();

  if (normalizedRole === roleLabels.ADMIN.toLowerCase()) {
    return "ADMIN";
  }

  if (normalizedRole === roleLabels.OWNER.toLowerCase()) {
    return "OWNER";
  }

  if (normalizedType === "administrador" || normalizedType === "admin") {
    return "ADMIN";
  }

  if (normalizedType === "duenio" || normalizedType === "owner") {
    return "OWNER";
  }

  return null;
}

function getCompanyName(role: UserRole, empresaId?: number) {
  if (role === "ADMIN") {
    return "ProfitTrack HQ";
  }

  return empresaId ? `Empresa #${empresaId}` : roleLabels[role];
}
