import type {
  Duenio,
  DuenioPayload,
  DuenioUpdatePayload,
  Empresa,
  EmpresaPayload,
} from "../types/domain";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

export type LoginPayload = {
  correo: string;
  contrasenia: string;
};

export type LoginResponse = {
  accessToken?: string;
  exp?: number;
  expiresAt?: number | string;
  expiresInSeconds?: number;
  refreshToken?: string;
  tipo?: string;
  rol?: string;
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

export async function apiRequest<T>(
  path: string,
  { credentials = "include", method = "GET", body, token }: ApiRequestOptions = {},
) {
  const headers = new Headers({
    accept: "*/*",
  });

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token?.trim()) {
    headers.set("Authorization", `Bearer ${token.trim()}`);
  }

  console.log("[apiRequest]", {
    authorizationHeader: headers.get("Authorization") ?? null,
    body,
    credentials,
    method,
    path: `${API_BASE_URL}${path}`,
    tokenProvided: Boolean(token?.trim()),
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers,
    method,
    credentials: "include",
  });

  console.log("[apiResponse]", {
    ok: response.ok,
    path: `${API_BASE_URL}${path}`,
    status: response.status,
  });

  const responseText = await response.text();

  if (!response.ok) {
    const detail = responseText ? `: ${responseText}` : "";
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
