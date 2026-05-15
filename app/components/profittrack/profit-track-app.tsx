"use client";

import { FormEvent, useState } from "react";
import { DashboardShell } from "./dashboard-shell";
import { LoginScreen } from "./login-screen";

export function ProfitTrackApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return <LoginScreen onSubmit={handleLogin} />;
  }

  return <DashboardShell onLogout={() => setIsAuthenticated(false)} />;
}
