"use client";

import { useEffect } from "react";
import { showToast, type AppToastTone } from "./toast";

type ToastMessageProps = {
  message?: string;
  title?: string;
  tone?: AppToastTone;
};

export function ToastMessage({
  message,
  tone = "success",
  title,
}: ToastMessageProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    showToast({
      message,
      title,
      tone,
    });
  }, [message, title, tone]);

  return null;
}
