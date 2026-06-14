"use client";

import type { ReactNode } from "react";
import { Toaster } from "sileo";
import { appToastOptions } from "./toast";

type AppToasterProps = {
  children: ReactNode;
};

export function AppToaster({ children }: AppToasterProps) {
  return (
    <Toaster
      offset={{ right: 0, top: 5 }}
      options={appToastOptions}
      position="top-center"
      theme="light"
    >
      {children}
    </Toaster>
  );
}
