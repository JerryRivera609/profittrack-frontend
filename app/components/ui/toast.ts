"use client";

import { sileo, type SileoOptions } from "sileo";

export type AppToastTone = "success" | "error" | "warning" | "info";

type AppToastOptions = {
  duration?: number | null;
  message: string;
  title?: string;
  tone?: AppToastTone;
};

type SileoOptionsWithId = SileoOptions & {
  id: string;
};

const toneTitles: Record<AppToastTone, string> = {
  error: "Error",
  info: "Notificacion",
  success: "Listo",
  warning: "Atencion",
};

const toastMethods: Record<AppToastTone, (options: SileoOptions) => string> = {
  error: sileo.error,
  info: sileo.info,
  success: sileo.success,
  warning: sileo.warning,
};

let toastCounter = 0;
const recentToastKeys = new Map<string, number>();
const TOAST_DEDUPE_WINDOW_MS = 750;

export const appToastOptions: Partial<SileoOptions> = {
  autopilot: {
    collapse: 4200,
    expand: 350,
  },
  duration: 5200,
  fill: "#020617",
  roundness: 14,
  styles: {
    badge: "profittrack-sileo-badge",
    button: "profittrack-sileo-button",
    description: "profittrack-sileo-description",
    title: "profittrack-sileo-title",
  },
};

export function showToast({
  duration,
  message,
  title,
  tone = "info",
}: AppToastOptions) {
  const description = message.trim();

  if (!description) {
    return "";
  }

  const dedupeKey = `${tone}:${title ?? ""}:${description}`;
  const now = Date.now();
  const recentMatch = recentToastKeys.get(dedupeKey);

  for (const [key, timestamp] of recentToastKeys) {
    if (now - timestamp > TOAST_DEDUPE_WINDOW_MS) {
      recentToastKeys.delete(key);
    }
  }

  if (recentMatch && now - recentMatch < TOAST_DEDUPE_WINDOW_MS) {
    return "";
  }

  recentToastKeys.set(dedupeKey, now);

  const notify = toastMethods[tone];

  return notify({
    ...appToastOptions,
    description,
    duration: duration ?? appToastOptions.duration,
    id: `profittrack-toast-${Date.now()}-${toastCounter++}`,
    title: title ?? toneTitles[tone],
  } as SileoOptionsWithId);
}

export function showErrorToast(
  error: unknown,
  fallback = "No se pudo completar la operacion.",
) {
  showToast({
    message: getToastErrorMessage(error, fallback),
    tone: "error",
  });
}

export function getToastErrorMessage(
  error: unknown,
  fallback = "No se pudo completar la operacion.",
) {
  return error instanceof Error ? error.message : fallback;
}
