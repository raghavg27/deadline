export type Phase = "work" | "short" | "long";

export type TimerState = {
  phase: Phase;
  round: number; // 1 to ROUNDS
  running: boolean;
  endsAt: number | null; // epoch ms while running
  remainingMs: number; // used while paused
};

export const ROUNDS = 4;
export const DURATIONS: Record<Phase, number> = {
  work: 25 * 60_000,
  short: 5 * 60_000,
  long: 15 * 60_000,
};

export function initialTimer(): TimerState {
  return { phase: "work", round: 1, running: false, endsAt: null, remainingMs: DURATIONS.work };
}

export function remainingMs(t: TimerState, now: number): number {
  return t.running && t.endsAt !== null ? Math.max(0, t.endsAt - now) : t.remainingMs;
}

export function start(t: TimerState, now: number): TimerState {
  if (t.running) return t;
  return { ...t, running: true, endsAt: now + t.remainingMs };
}

export function pause(t: TimerState, now: number): TimerState {
  if (!t.running) return t;
  return { ...t, running: false, endsAt: null, remainingMs: remainingMs(t, now) };
}

export function nextPhase(phase: Phase, round: number): { phase: Phase; round: number } {
  if (phase === "work") return { phase: round >= ROUNDS ? "long" : "short", round };
  return { phase: "work", round: phase === "long" ? 1 : round + 1 };
}

/**
 * Move a running timer forward to `now`. Uses timestamps, so it catches up
 * correctly after the tab was in the background, even across several phases.
 */
export function advance(t: TimerState, now: number): { timer: TimerState; transitioned: boolean } {
  if (!t.running || t.endsAt === null || now < t.endsAt) return { timer: t, transitioned: false };
  let { phase, round } = t;
  let endsAt = t.endsAt;
  while (endsAt <= now) {
    ({ phase, round } = nextPhase(phase, round));
    endsAt += DURATIONS[phase];
  }
  return { timer: { ...t, phase, round, endsAt, remainingMs: DURATIONS[phase] }, transitioned: true };
}

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
