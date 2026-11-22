import { PLAN } from "./plan";
import { initialTimer, type TimerState } from "./pomodoro";

export type DayState = {
  done: boolean;
  steps: boolean[];
  gaps: string;
  nextStep: string;
};

export type AppState = {
  days: Record<string, DayState>;
  timer: TimerState;
};

export const STORAGE_KEY = "deadline-tracker:v1";

function emptyDay(): DayState {
  return { done: false, steps: PLAN.sessionSteps.map(() => false), gaps: "", nextStep: "" };
}

export function defaultState(): AppState {
  return {
    days: Object.fromEntries(PLAN.days.map((d) => [d.label, emptyDay()])),
    timer: initialTimer(),
  };
}

export function loadState(): AppState {
  const fallback = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw) as Partial<AppState>;
    const days = { ...fallback.days };
    for (const label of Object.keys(days)) {
      days[label] = { ...days[label], ...saved.days?.[label] };
    }
    return { days, timer: { ...fallback.timer, ...saved.timer } };
  } catch {
    return fallback;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage is full or blocked. The app keeps working for this session.
  }
}
