"use client";

import { roleHome, roleLoginPath } from "../config/navigation";
import type { LoginResponse } from "./api";
import type { Session, UserRole } from "../types/domain";

const LOCAL_SESSION_KEY = "profittrack.session";
const TEMP_SESSION_KEY = "profittrack.session.temp";
const PERSISTENT_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const TEMP_SESSION_TTL_MS = 1000 * 60 * 60 * 8;

type CreateSessionInput = {
  apiToken?: string;
  accessToken?: string;
  backendRole?: string;
  companyName?: string;
  displayName: string;
  empleadoId?: number;
  email: string;
  empresaId?: number;
  expiresAt?: number;
  refreshToken?: string;
  remember: boolean;
  role: UserRole;
};

export function createSession({
  apiToken,
  accessToken,
  backendRole,
  companyName,
  displayName,
  empleadoId,
  email,
  empresaId,
  expiresAt,
  refreshToken,
  remember,
  role,
}: CreateSessionInput): Session {
  const issuedAt = Date.now();
  const sessionDurationMs = getSessionDurationMs(remember);
  const resolvedExpiresAt =
    expiresAt ?? issuedAt + sessionDurationMs;
  const tokenSeed = `${role}:${email}:${issuedAt}`;

  return {
    accessToken: accessToken ?? encodeToken(tokenSeed),
    apiToken,
    backendRole,
    companyName,
    displayName,
    empleadoId: empleadoId ?? getUserIdFromAuthResponse(undefined, accessToken) ?? undefined,
    email,
    empresaId,
    expiresAt: resolvedExpiresAt,
    refreshToken: refreshToken ?? encodeToken(`${tokenSeed}:refresh`),
    role,
    sessionDurationMs,
  };
}

export function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession =
    window.localStorage.getItem(LOCAL_SESSION_KEY) ??
    window.sessionStorage.getItem(TEMP_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as Session;

    if (session.expiresAt <= Date.now()) {
      clearStoredSession();
      return null;
    }

    return session;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function saveSession(session: Session, remember: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  const serializedSession = JSON.stringify(session);
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
  window.sessionStorage.removeItem(TEMP_SESSION_KEY);

  if (remember) {
    window.localStorage.setItem(LOCAL_SESSION_KEY, serializedSession);
    return;
  }

  window.sessionStorage.setItem(TEMP_SESSION_KEY, serializedSession);
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(LOCAL_SESSION_KEY);
  window.sessionStorage.removeItem(TEMP_SESSION_KEY);
}

export function updateStoredSession(session: Session) {
  if (typeof window === "undefined") {
    return;
  }

  const persistentSessionExists = window.localStorage.getItem(LOCAL_SESSION_KEY);
  const serializedSession = JSON.stringify(session);

  if (persistentSessionExists) {
    window.localStorage.setItem(LOCAL_SESSION_KEY, serializedSession);
    window.sessionStorage.removeItem(TEMP_SESSION_KEY);
    return;
  }

  window.sessionStorage.setItem(TEMP_SESSION_KEY, serializedSession);
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
}

export function getRoleHome(role: UserRole) {
  return roleHome[role];
}

export function getRoleLoginPath(role: UserRole) {
  return roleLoginPath[role];
}

export function normalizeBackendRole(
  backendRole?: string,
  backendType?: string,
): UserRole | null {
  const normalizedRole = backendRole?.trim().toLowerCase();
  const normalizedType = backendType?.trim().toLowerCase();

  if (normalizedRole === "owner") {
    return "OWNER";
  }

  if (normalizedType === "duenio" || normalizedType === "owner") {
    return "OWNER";
  }

  // Cualquier otro perfil autenticado entra al portal de desarrollador.
  return normalizedRole || normalizedType ? "EMPLEADO" : null;
}

export function getExpiresAtFromAuthResponse(
  response: LoginResponse | undefined,
  fallbackDurationMs: number,
) {
  const now = Date.now();

  if (response?.expiresAt !== undefined) {
    const parsedExpiresAt =
      typeof response.expiresAt === "string"
        ? Date.parse(response.expiresAt)
        : response.expiresAt;

    if (Number.isFinite(parsedExpiresAt)) {
      return parsedExpiresAt;
    }
  }

  if (typeof response?.expiresInSeconds === "number") {
    return now + response.expiresInSeconds * 1000;
  }

  if (typeof response?.exp === "number") {
    return response.exp * 1000;
  }

  const jwtExpiresAt = getJwtExpiration(response?.accessToken);

  if (jwtExpiresAt) {
    return jwtExpiresAt;
  }

  return now + fallbackDurationMs;
}

export function buildRefreshedSession(
  currentSession: Session,
  response?: LoginResponse,
) {
  const normalizedRole =
    normalizeBackendRole(response?.rol, response?.tipo) ?? currentSession.role;

  return {
    ...currentSession,
    accessToken: response?.accessToken ?? currentSession.accessToken,
    backendRole: response?.rol ?? currentSession.backendRole,
    companyName:
      normalizedRole === "ADMIN"
        ? "ProfitTrack HQ"
        : response?.empresaId
          ? `Empresa #${response.empresaId}`
          : currentSession.companyName,
    displayName: response?.nombre?.trim() || currentSession.displayName,
    empleadoId:
      getUserIdFromAuthResponse(response, response?.accessToken) ??
      currentSession.empleadoId,
    empresaId: response?.empresaId ?? currentSession.empresaId,
    expiresAt: getExpiresAtFromAuthResponse(
      response,
      currentSession.sessionDurationMs,
    ),
    refreshToken: response?.refreshToken ?? currentSession.refreshToken,
    role: normalizedRole,
  };
}

function getSessionDurationMs(remember: boolean) {
  return remember ? PERSISTENT_SESSION_TTL_MS : TEMP_SESSION_TTL_MS;
}

function getJwtExpiration(token?: string) {
  const payload = getJwtPayload(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
}

function getUserIdFromAuthResponse(
  response?: LoginResponse,
  token?: string,
) {
  const responseId =
    response?.empleadoId ??
    response?.usuarioId ??
    response?.id;

  if (typeof responseId === "number") {
    return responseId;
  }

  const payload = getJwtPayload(token);
  const candidate =
    payload?.empleadoId ??
    payload?.usuarioId ??
    payload?.userId ??
    payload?.id;

  return typeof candidate === "number" ? candidate : null;
}

function getJwtPayload(token?: string) {
  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as {
      empleadoId?: number;
      exp?: number;
      id?: number;
      userId?: number;
      usuarioId?: number;
    };
  } catch {
    return null;
  }
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

  if (typeof window === "undefined") {
    return Buffer.from(`${normalized}${padding}`, "base64").toString("utf-8");
  }

  return window.atob(`${normalized}${padding}`);
}

function encodeToken(value: string) {
  if (typeof window === "undefined") {
    return value;
  }

  return window.btoa(value).replace(/=+$/, "");
}
