"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import confetti from "canvas-confetti";
import { Hero } from "./Hero";
import { Progress } from "./Progress";
import { Timeline } from "./Timeline";
import { Pomodoro } from "./Pomodoro";
import { Framework } from "./Framework";
import { todayInIST } from "@/lib/dates";
import { MILESTONE_DAYS, PLAN } from "@/lib/plan";
import { advance, formatClock, initialTimer, pause, remainingMs, start, type TimerState } from "@/lib/pomodoro";
import { loadState, saveState, type AppState, type DayState } from "@/lib/storage";
import { beep, unlockAudio } from "@/lib/beep";

const DEFAULT_TITLE = "Deadline | System design prep";
const CONFETTI_COLORS = ["#9b8cff", "#3ddc97", "#f3f0e6", "#6352e0"];

function burst(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  confetti({
    origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
    particleCount: 50,
    spread: 70,
    startVelocity: 28,
    scalar: 0.8,
    ticks: 120,
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  });
}

function bigBurst() {
  for (const x of [0.15, 0.85]) {
    confetti({
      origin: { x, y: 0.7 },
      angle: x < 0.5 ? 60 : 120,
      particleCount: 120,
      spread: 80,
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    });
  }
}

export default function Tracker() {
  const [state, setState] = useState<AppState>(loadState);
  const [now, setNow] = useState(() => Date.now());
  const today = todayInIST(new Date(now));
  // Today's row starts expanded.
  const [expanded, setExpanded] = useState(() => {
    const label = PLAN.days.find((d) => d.date === todayInIST())?.label;
    return new Set(label ? [label] : []);
  });

  // Keep a ref to the timer so the interval can read it without restarting.
  const timerRef = useRef(state.timer);
  useEffect(() => {
    timerRef.current = state.timer;
    saveState(state);
  }, [state]);

  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      // Round to the second so the page only re-renders when the display changes.
      setNow(Math.floor(t / 1000) * 1000);
      const { timer, transitioned } = advance(timerRef.current, t);
      if (transitioned) {
        timerRef.current = timer;
        setState((s) => ({ ...s, timer }));
        beep();
      }
    };
    const id = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    // Browsers allow sound only after a user gesture. After a reload with a running
    // timer, the first click or key press anywhere turns sound back on.
    document.addEventListener("pointerdown", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
      document.removeEventListener("pointerdown", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // Show the time left in the browser tab title while the timer is in use.
  const { timer } = state;
  const rem = remainingMs(timer, now);
  const idle = !timer.running && timer.phase === "work" && timer.round === 1 && rem === initialTimer().remainingMs;
  useEffect(() => {
    if (idle) {
      document.title = DEFAULT_TITLE;
    } else {
      const phase = timer.phase === "work" ? "Focus" : "Break";
      document.title = `${timer.running ? "" : "Paused "}${formatClock(rem)} ${phase} | Deadline`;
    }
  }, [idle, rem, timer.phase, timer.running]);

  const updateDay = useCallback((label: string, patch: (d: DayState) => Partial<DayState>) => {
    setState((s) => ({ ...s, days: { ...s.days, [label]: { ...s.days[label], ...patch(s.days[label]) } } }));
  }, []);

  const setTimer = (fn: (t: TimerState, now: number) => TimerState) =>
    setState((s) => ({ ...s, timer: fn(s.timer, Date.now()) }));

  const toggleDone = (label: string, done: boolean, el: HTMLElement) => {
    updateDay(label, () => ({ done }));
    if (!done) return;
    const allDone = MILESTONE_DAYS.every((d) => (d.label === label ? true : state.days[d.label]?.done));
    if (allDone && label !== "T-0") bigBurst();
    else burst(el);
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:pt-8">
        <Hero now={now} today={today} />

        {/* Phone order: progress, timer, timeline, cheat sheet. Desktop: two columns. */}
        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="contents lg:flex lg:flex-col lg:gap-6">
            <div className="order-1">
              <Progress days={state.days} today={today} />
            </div>
            <div className="order-3">
              <Timeline
                days={state.days}
                today={today}
                expanded={expanded}
                toggleExpanded={(label) =>
                  setExpanded((prev) => {
                    const next = new Set(prev);
                    if (next.has(label)) next.delete(label);
                    else next.add(label);
                    return next;
                  })
                }
                toggleDone={toggleDone}
                toggleStep={(label, i, done) =>
                  updateDay(label, (d) => ({ steps: d.steps.map((v, j) => (j === i ? done : v)) }))
                }
                setText={(label, field, value) => updateDay(label, () => ({ [field]: value }))}
              />
            </div>
          </div>
          <aside className="contents lg:sticky lg:top-6 lg:flex lg:flex-col lg:gap-6">
            <div className="order-2">
              <Pomodoro
                timer={timer}
                now={now}
                onStart={() => {
                  unlockAudio();
                  setTimer(start);
                }}
                onPause={() => setTimer(pause)}
                onReset={() => setTimer(() => initialTimer())}
              />
            </div>
            <div className="order-4">
              <Framework />
            </div>
          </aside>
        </div>
      </main>
    </MotionConfig>
  );
}
