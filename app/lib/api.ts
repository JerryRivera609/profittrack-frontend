import type {
  Duenio,
  DuenioPayload,
  DuenioUpdatePayload,
  Empresa,
  EmpresaPayload,
} from "../types/domain";
import {
  expireStoredSession,
  getStoredAuthToken,
  getValidBearerToken,
  updateStoredSessionFromAuthResponse,
} from "./auth-session";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

export type LoginPayload = {
  correo: string;
  contrasenia: string;
};

export type LoginResponse = {
  access_token?: string;
  accessToken?: string;
  data?: {
    access_token?: string;
    accessToken?: string;
    jwt?: string;
    token?: string;
  };
  empleadoId?: number;
  exp?: number;
  expiresAt?: number | string;
  expiresInSeconds?: number;
  id?: number;
  jwt?: string;
  refreshToken?: string;
  state?: {
    token?: string;
  };
  token?: string;
  tipo?: string;
  rol?: string;
  usuarioId?: number;
  mensaje: string;
  empresaId?: number;
  nombre?: string;
};

type ApiRequestOptions = {
  credentials?: RequestCredentials;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

let refreshPromise: Promise<LoginResponse | undefined> | null = null;


export async function apiRequest<T>(
  path: string,
  { credentials = "include", method = "GET", body, token }: ApiRequestOptions = {},
) {
  const isAuthRequest = path.startsWith("/api/auth/");
  const headers = new Headers({
    accept: "*/*",
  });
  const explicitToken = getValidBearerToken(token);
  const bearerToken = isAuthRequest
    ? explicitToken
    : explicitToken ?? getStoredAuthToken();

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (bearerToken) {
    headers.set("Authorization", `Bearer ${bearerToken}`);
  }

  // primera call
  let response = await fetch(`${API_BASE_URL}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers,
    method,
    credentials,
  });
  // catch de unautthoirzed
  if (response.status === 401 && !isAuthRequest) {
    try {
      const retryToken = await refreshSessionToken();

      if (retryToken) {
        headers.set("Authorization", `Bearer ${retryToken}`);
      } else {
        headers.delete("Authorization");
      }

      response = await fetch(`${API_BASE_URL}${path}`, {
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        headers,
        method,
        credentials,
      });
    } catch {
      refreshPromise = null;
      expireStoredSession();
      throw new ApiRequestError(401, "Sesion expirada");
    }

    if (response.status === 401) {
      throw new ApiRequestError(401, "No autorizado para esta operacion.");
    }
  }
  const responseText = await response.text();
  if (!response.ok) {
    const detail = getResponseErrorDetail(responseText);
    throw new ApiRequestError(
      response.status,
      `La API respondio ${response.status}${detail}`,
    );
  }
  if (!responseText) {
    return undefined as T;
  }
  return JSON.parse(responseText) as T;
}

export const empresasApi = {
  list: (token?: string) => apiRequest<Empresa[]>("/api/empresas", { token }),
  get: (id: number, token?: string) =>
    apiRequest<Empresa>(`/api/empresas/${id}`, { token }),
  create: (payload: EmpresaPayload, token?: string) =>
    apiRequest<Empresa>("/api/empresas", {
      body: payload,
      method: "POST",
      token,
    }),
  update: (id: number, payload: EmpresaPayload, token?: string) =>
    apiRequest<Empresa>(`/api/empresas/${id}`, {
      body: payload,
      method: "PATCH",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/empresas/${id}`, {
      method: "DELETE",
      token,
    }),
};

export const authApi = {
  login: (payload: LoginPayload) =>
    apiRequest<LoginResponse>("/api/auth/login", {
      body: payload,
      method: "POST",
    }),
  refresh: () =>
    apiRequest<LoginResponse | undefined>("/api/auth/refresh", {
      method: "POST",
    }),
  logout: () =>
    apiRequest<void>("/api/auth/logout", {
      method: "POST",
    }),
};

export const dueniosApi = {
  list: (token?: string) => apiRequest<Duenio[]>("/api/duenios", { token }),
  get: (id: number, token?: string) =>
    apiRequest<Duenio>(`/api/duenios/${id}`, { token }),
  create: (payload: DuenioPayload, token?: string) =>
    apiRequest<Duenio>("/api/duenios", {
      body: payload,
      method: "POST",
      token,
    }),
  update: (id: number, payload: DuenioUpdatePayload, token?: string) =>
    apiRequest<Duenio>(`/api/duenios/${id}`, {
      body: payload,
      method: "PATCH",
      token,
    }),
  remove: (id: number, token?: string) =>
    apiRequest<void>(`/api/duenios/${id}`, {
      method: "DELETE",
      token,
    }),
};

async function refreshSessionToken() {
  try {
    if (!refreshPromise) {
      refreshPromise = authApi.refresh();
    }

    const refreshResponse = await refreshPromise;

    return updateStoredSessionFromAuthResponse(refreshResponse) ??
      getStoredAuthToken();
  } finally {
    refreshPromise = null;
  }
}

function getResponseErrorDetail(responseText: string) {
  if (!responseText) {
    return "";
  }

  try {
    const parsedBody = JSON.parse(responseText) as {
      detalle?: string;
      error?: string;
      mensaje?: string;
      message?: string;
    };
    const backendMessage =
      parsedBody.message ??
      parsedBody.mensaje ??
      parsedBody.error ??
      parsedBody.detalle;

    return backendMessage ? `: ${backendMessage}` : `: ${responseText}`;
  } catch {
    return `: ${responseText}`;
  }
}
