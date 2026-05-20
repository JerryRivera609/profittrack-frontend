"use client";

import { roleHome, roleLoginPath } from "../config/navigation";
import type { Session, UserRole } from "../types/domain";

const LOCAL_SESSION_KEY = "profittrack.session";
const TEMP_SESSION_KEY = "profittrack.session.temp";

type CreateSessionInput = {
  apiToken?: string;
  companyName?: string;
  displayName: string;
  email: string;
  remember: boolean;
  role: UserRole;
};

export function createDemoSession({
  apiToken,
  companyName,
  displayName,
  email,
  remember,
  role,
}: CreateSessionInput): Session {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + (remember ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 8);
  const tokenSeed = `${role}:${email}:${issuedAt}`;

  return {
    accessToken: encodeToken(tokenSeed),
    apiToken,
    companyName,
    displayName,
    email,
    expiresAt,
    refreshToken: encodeToken(`${tokenSeed}:refresh`),
    role,
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

export function getRoleHome(role: UserRole) {
  return roleHome[role];
}

export function getRoleLoginPath(role: UserRole) {
  return roleLoginPath[role];
}

function encodeToken(value: string) {
  if (typeof window === "undefined") {
    return value;
  }

  return window.btoa(value).replace(/=+$/, "");
}
