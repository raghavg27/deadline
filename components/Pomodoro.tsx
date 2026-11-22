"use client";

import { motion } from "motion/react";
import { Brain, Coffee, Pause, Play, RotateCcw, Sofa, Timer } from "lucide-react";
import { DURATIONS, formatClock, nextPhase, remainingMs, ROUNDS, type Phase, type TimerState } from "@/lib/pomodoro";

const PHASE_NAME: Record<Phase, string> = { work: "Focus", short: "Short break", long: "Long break" };
const PHASE_ICON = { work: Brain, short: Coffee, long: Sofa };

const R = 88;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Props = {
  timer: TimerState;
  now: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function Pomodoro({ timer, now, onStart, onPause, onReset }: Props) {
  const rem = remainingMs(timer, now);
  const fraction = rem / DURATIONS[timer.phase];
  const isWork = timer.phase === "work";
  const color = isWork ? "var(--focus)" : "var(--go)";
  const completed = isWork ? timer.round - 1 : timer.round;
  const upNext = nextPhase(timer.phase, timer.round).phase;
  const Icon = PHASE_ICON[timer.phase];

  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="timer-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="timer-title" className="flex items-center gap-2 text-lg font-semibold">
          <Timer className="size-5 text-focus" aria-hidden />
          Pomodoro
        </h2>
        <span className="text-sm text-muted tabular-nums">
          Round {timer.round} of {ROUNDS}
        </span>
      </div>

      <motion.div
        key={timer.phase}
        initial={{ scale: 0.9, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative mx-auto mt-5 grid size-56 place-items-center"
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90 overflow-visible" aria-hidden>
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--line)" strokeWidth="10" />
          <motion.circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={false}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - fraction) }}
            transition={{ duration: 0.9, ease: "linear" }}
            style={{
              filter: timer.running ? `drop-shadow(0 0 10px ${color})` : "none",
              transition: "filter 400ms",
            }}
          />
        </svg>
        <div className="relative text-center">
          <Icon className="mx-auto mb-1 size-5" style={{ color }} aria-hidden />
          <div className="font-display text-6xl font-bold leading-none tabular-nums" aria-live="off">
            {formatClock(rem)}
          </div>
          <div className="mt-1.5 text-sm text-muted">{PHASE_NAME[timer.phase]}</div>
        </div>
      </motion.div>

      <div className="mt-4 flex justify-center gap-2" aria-label={`${completed} of ${ROUNDS} rounds done`}>
        {Array.from({ length: ROUNDS }, (_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scale: i === completed && timer.running && isWork ? [1, 1.35, 1] : 1 }}
            transition={{ repeat: i === completed && timer.running && isWork ? Infinity : 0, duration: 1.6 }}
            className={`size-2.5 rounded-full transition-colors ${
              i < completed ? "bg-go" : i === completed && isWork ? "bg-focus" : "bg-line"
            }`}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={timer.running ? onPause : onStart}
          className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[14px] font-semibold text-white shadow-lift transition-colors dark:text-bg"
          style={{ backgroundColor: color }}
        >
          <motion.span
            key={timer.running ? "pause" : "play"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {timer.running ? <Pause className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />}
            {timer.running ? "Pause" : "Start"}
          </motion.span>
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onReset}
          className="group flex h-12 cursor-pointer items-center gap-2 rounded-[14px] border border-line bg-surface-2 px-4 font-semibold transition-colors hover:border-muted"
        >
          <RotateCcw className="size-4 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
          Reset
        </motion.button>
      </div>
      <p className="mt-3 text-center text-sm text-muted">Up next: {PHASE_NAME[upNext].toLowerCase()}</p>
    </section>
  );
}
