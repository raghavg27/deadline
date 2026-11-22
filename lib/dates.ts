import { PLAN } from "./plan";

export type RowStatus = "past" | "today" | "future";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Today's date in the plan timezone (IST) as YYYY-MM-DD. */
export function todayInIST(now: Date = new Date(), timeZone: string = PLAN.timeZone): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function toUtcMs(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole calendar days from `from` to `to` (both YYYY-MM-DD). */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

/** T-minus label for a date: "T-3" before, "T-0" on, "T+1" after the interview. */
export function tMinusLabel(date: string, interviewDate: string = PLAN.interviewDate): string {
  const n = daysBetween(date, interviewDate);
  return n >= 0 ? `T-${n}` : `T+${-n}`;
}

export function rowStatus(rowDate: string, today: string): RowStatus {
  if (rowDate === today) return "today";
  return rowDate < today ? "past" : "future";
}

export function isMissed(rowDate: string, today: string, done: boolean): boolean {
  return !done && rowStatus(rowDate, today) === "past";
}

/** "Mon 23 Nov" for a YYYY-MM-DD date. */
export function formatRowDate(date: string): string {
  const d = new Date(toUtcMs(date));
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
  const month = d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  return `${weekday} ${d.getUTCDate()} ${month}`;
}

export type HeaderStatus =
  | { kind: "countdown"; label: string; daysLeft: number }
  | { kind: "interview" }
  | { kind: "done" };

export function headerStatus(today: string, interviewDate: string = PLAN.interviewDate): HeaderStatus {
  const daysLeft = daysBetween(today, interviewDate);
  if (daysLeft > 0) return { kind: "countdown", label: tMinusLabel(today, interviewDate), daysLeft };
  if (daysLeft === 0) return { kind: "interview" };
  return { kind: "done" };
}

/** Time left until `target`, split into parts. All zero once the target has passed. */
export function timeLeft(target: string, nowMs: number) {
  const ms = Math.max(0, Date.parse(target) - nowMs);
  const s = Math.floor(ms / 1000);
  return {
    ms,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}
