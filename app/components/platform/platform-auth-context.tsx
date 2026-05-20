"use client";

import { createContext, useContext } from "react";
import type { Session } from "../../types/domain";

type PlatformAuthContextValue = {
  logout: () => void;
  session: Session;
};

const PlatformAuthContext = createContext<PlatformAuthContextValue | null>(null);

export const PlatformAuthProvider = PlatformAuthContext.Provider;

export function usePlatformAuth() {
  const context = useContext(PlatformAuthContext);

  if (!context) {
    throw new Error("usePlatformAuth debe usarse dentro de PlatformAuthProvider");
  }

  return context;
}
