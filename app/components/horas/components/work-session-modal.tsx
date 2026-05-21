"use client";

import { PauseCircle, PlayCircle, SquareCheckBig } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { WorkSessionState } from "../types/time-entry";
import {
  formatDurationFromMs,
  formatTimeOnly,
} from "../utils/time-entry-form";
import { formatTimeEntryDate } from "../utils/time-entry-format";
import { Button } from "../../ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal";
import { LiveDurationTile } from "./live-duration-tile";
import { WorkdayDateCard } from "./workday-date-card";

type WorkSessionModalProps = {
  isSaving: boolean;
  onClose: () => void;
  onDescriptionChange: (value: string) => void;
  onFinalize: () => void;
  onPause: () => void;
  onResume: () => void;
  session: WorkSessionState | null;
};

export function WorkSessionModal({
  isSaving,
  onClose,
  onDescriptionChange,
  onFinalize,
  onPause,
  onResume,
  session,
}: WorkSessionModalProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!session?.open) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [session?.open]);

  const metrics = useMemo(() => {
    if (!session) {
      return {
        currentTime: "--:--:--",
        pauseDuration: "00:00:00",
        workedDuration: "00:00:00",
      };
    }

    const currentMs = now.getTime();
    let workedMs = session.accumulatedWorkMs;
    let pauseMs = session.accumulatedPauseMs;

    if (session.status === "running" && session.lastResumedAt) {
      workedMs += currentMs - new Date(session.lastResumedAt).getTime();
    }

    if (session.status === "paused" && session.pausedAt) {
      pauseMs += currentMs - new Date(session.pausedAt).getTime();
    }

    return {
      currentTime: formatTimeOnly(now),
      pauseDuration: formatDurationFromMs(pauseMs),
      workedDuration: formatDurationFromMs(workedMs),
    };
  }, [now, session]);

  if (!session?.open || !session.task) {
    return null;
  }

  return (
    <Modal onClose={onClose} open={session.open} size="xl">
      <ModalHeader>
        <div>
          <p className="text-sm font-medium text-slate-500">Sesion activa</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            {session.task.nombre}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {session.task.proyectoNombre} · {session.task.clienteNombre}
          </p>
        </div>
        <ModalCloseButton onClose={onClose} />
      </ModalHeader>

      <ModalBody>
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <WorkdayDateCard
              helper="Fecha que se enviará al registro de horas."
              label="Fecha de trabajo"
              value={formatTimeEntryDate(session.fechaTrabajo)}
            />
            <WorkdayDateCard
              helper="Marcada cuando iniciaste esta sesion."
              label="Hora de inicio"
              value={formatTimeOnly(new Date(session.startedAt))}
            />
            <WorkdayDateCard
              helper={session.status === "running" ? "Reloj en tiempo real." : "Sesion pausada."}
              label="Hora actual"
              value={metrics.currentTime}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <LiveDurationTile accent="teal" label="Tiempo acumulado" value={metrics.workedDuration} />
            <LiveDurationTile accent="amber" label="Tiempo en pausa" value={metrics.pauseDuration} />
            <LiveDurationTile label="Estado" value={session.status === "running" ? "Trabajando" : "Pausada"} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Comentario de avance</p>
            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
              <textarea
                className="min-h-28 w-full resize-y bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="Describe lo que avanzaste en esta sesión de trabajo."
                value={session.descripcion}
              />
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="justify-between">
        <div className="flex flex-wrap gap-3">
          {session.status === "running" ? (
            <Button
              icon={<PauseCircle className="size-4" />}
              onClick={onPause}
              variant="secondary"
            >
              Pausar
            </Button>
          ) : (
            <Button
              icon={<PlayCircle className="size-4" />}
              onClick={onResume}
              variant="secondary"
            >
              Continuar
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onClose} variant="secondary">
            Cerrar
          </Button>
          <Button
            disabled={isSaving}
            icon={<SquareCheckBig className="size-4" />}
            onClick={onFinalize}
          >
            {isSaving ? "Registrando..." : "Finalizar y registrar"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
