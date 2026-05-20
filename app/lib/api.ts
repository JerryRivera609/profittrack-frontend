import type {
  Duenio,
  DuenioPayload,
  DuenioUpdatePayload,
  Empresa,
  EmpresaPayload,
} from "../types/domain";

const DEFAULT_API_BASE_URL = "http://localhost:8080";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

type ApiRequestOptions = {
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

async function apiRequest<T>(
  path: string,
  { method = "GET", body, token }: ApiRequestOptions = {},
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers,
    method,
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
