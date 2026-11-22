"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronDown, Clock, Crosshair, ListChecks, TriangleAlert } from "lucide-react";
import { Checkbox } from "./Checkbox";
import { formatRowDate, isMissed, rowStatus } from "@/lib/dates";
import { PLAN, type DayPlan } from "@/lib/plan";
import type { AppState, DayState } from "@/lib/storage";

export type DayActions = {
  toggleDone: (label: string, done: boolean, el: HTMLElement) => void;
  toggleStep: (label: string, index: number, done: boolean) => void;
  setText: (label: string, field: "gaps" | "nextStep", value: string) => void;
};

type Props = DayActions & {
  days: AppState["days"];
  today: string;
  expanded: Set<string>;
  toggleExpanded: (label: string) => void;
};

export function Timeline({ days, today, expanded, toggleExpanded, ...actions }: Props) {
  const todayIndex = PLAN.days.findIndex((d) => d.date === today);
  const lastIndex = PLAN.days.length - 1;
  // How far down the rail the "elapsed" line reaches.
  const railFill =
    todayIndex >= 0 ? todayIndex / lastIndex : today > PLAN.days[lastIndex].date ? 1 : 0;

  return (
    <section aria-labelledby="timeline-title">
      <h2 id="timeline-title" className="mb-4 flex items-center gap-2 px-1 text-lg font-semibold">
        <CalendarDays className="size-5 text-focus" aria-hidden />
        Timeline
      </h2>
      <ol className="relative space-y-3">
        <div aria-hidden className="absolute bottom-8 left-[15px] top-8 w-0.5 rounded-full bg-line">
          <motion.div
            className="w-full origin-top rounded-full bg-focus"
            initial={{ height: 0 }}
            animate={{ height: `${railFill * 100}%` }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>
        {PLAN.days.map((day, i) => (
          <DayRow
            key={day.label}
            day={day}
            index={i}
            state={days[day.label]}
            today={today}
            open={expanded.has(day.label)}
            onToggleOpen={() => toggleExpanded(day.label)}
            {...actions}
          />
        ))}
      </ol>
    </section>
  );
}

type RowProps = DayActions & {
  day: DayPlan;
  index: number;
  state: DayState;
  today: string;
  open: boolean;
  onToggleOpen: () => void;
};

function DayRow({ day, index, state, today, open, onToggleOpen, toggleDone, toggleStep, setText }: RowProps) {
  const status = rowStatus(day.date, today);
  const missed = isMissed(day.date, today, state.done);
  const isToday = status === "today";
  const panelId = `day-${day.label}`;
  const stepsDone = state.steps.filter(Boolean).length;

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
      className="relative pl-11"
    >
      <RailNode done={state.done} isToday={isToday} missed={missed} />

      <div
        className={`overflow-hidden rounded-2xl border bg-surface transition-shadow duration-300 ${
          isToday ? "border-transparent shadow-today" : "border-line shadow-panel hover:shadow-lift"
        }`}
      >
        <div className="flex items-center gap-3 p-3 sm:p-4">
          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl text-left"
          >
            <span
              className={`w-12 shrink-0 font-display text-3xl font-bold leading-none ${
                isToday ? "text-focus" : status === "past" ? "text-muted" : "text-ink"
              }`}
            >
              {day.label}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{formatRowDate(day.date)}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" aria-hidden />
                  {day.hours} h
                </span>
                {isToday && (
                  <span className="rounded-full bg-focus px-2 py-0.5 text-xs font-semibold text-white dark:text-bg">
                    Today
                  </span>
                )}
                {missed && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1 rounded-full bg-warn-soft px-2 py-0.5 text-xs font-semibold text-warn"
                  >
                    <TriangleAlert className="size-3" aria-hidden />
                    Missed
                  </motion.span>
                )}
              </span>
              <span
                className={`mt-0.5 block font-medium transition-colors ${
                  state.done ? "text-muted line-through decoration-go decoration-2" : "text-ink"
                }`}
              >
                {day.milestone}
              </span>
            </span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0 text-muted">
              <ChevronDown className="size-5" aria-hidden />
            </motion.span>
          </button>
          <Checkbox
            checked={state.done}
            label={`Mark ${day.label} done`}
            onChange={(done, el) => toggleDone(day.label, done, el)}
          />
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 border-t border-line px-4 pb-5 pt-4">
                <p className="flex gap-3">
                  <Crosshair className="mt-0.5 size-5 shrink-0 text-focus" aria-hidden />
                  <span>
                    <span className="block text-sm text-muted">Focus</span>
                    {day.focus}
                  </span>
                </p>

                {day.problemDay && (
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <ListChecks className="size-4 text-focus" aria-hidden />
                        Session steps
                      </h3>
                      <span className="text-sm tabular-nums text-muted">
                        {stepsDone} of {PLAN.sessionSteps.length}
                      </span>
                    </div>
                    <ol className="space-y-1">
                      {PLAN.sessionSteps.map((step, i) => (
                        <li key={step} className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-surface-2">
                          <Checkbox
                            size="sm"
                            checked={state.steps[i]}
                            label={step}
                            onChange={(done) => toggleStep(day.label, i, done)}
                          />
                          <span
                            onClick={() => toggleStep(day.label, i, !state.steps[i])}
                            className={`cursor-pointer select-none text-sm transition-colors ${
                              state.steps[i] ? "text-muted line-through" : ""
                            }`}
                          >
                            {i + 1}. {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Gaps found</span>
                  <textarea
                    rows={3}
                    value={state.gaps}
                    onChange={(e) => setText(day.label, "gaps", e.target.value)}
                    placeholder="What did you miss or get stuck on?"
                    className="field resize-y"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Tomorrow&apos;s first step</span>
                  <input
                    type="text"
                    value={state.nextStep}
                    onChange={(e) => setText(day.label, "nextStep", e.target.value)}
                    placeholder="The first thing to do tomorrow"
                    className="field"
                  />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

function RailNode({ done, isToday, missed }: { done: boolean; isToday: boolean; missed: boolean }) {
  return (
    <span aria-hidden className="absolute left-0 top-5 grid size-8 place-items-center">
      {isToday && !done && (
        <span className="absolute inset-0 animate-ping rounded-full bg-focus opacity-30 motion-reduce:hidden" />
      )}
      <motion.span
        initial={false}
        animate={{ scale: done ? [1.4, 1] : 1 }}
        className={`relative size-3.5 rounded-full border-2 transition-colors ${
          done
            ? "border-go bg-go"
            : isToday
              ? "border-focus bg-focus"
              : missed
                ? "border-warn bg-warn-soft"
                : "border-line bg-surface"
        }`}
      />
    </span>
  );
}
