"use client";

import { motion } from "motion/react";
import { Gauge } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { isMissed, rowStatus } from "@/lib/dates";
import { MILESTONE_DAYS, TOTAL_HOURS } from "@/lib/plan";
import type { AppState } from "@/lib/storage";

export function Progress({ days, today }: { days: AppState["days"]; today: string }) {
  const done = MILESTONE_DAYS.filter((d) => days[d.label]?.done);
  const pct = Math.round((done.length / MILESTONE_DAYS.length) * 100);
  const hours = done.reduce((sum, d) => sum + d.hours, 0);

  return (
    <section className="panel p-5 sm:p-6" aria-labelledby="progress-title">
      <div className="flex items-end justify-between gap-4">
        <h2 id="progress-title" className="flex items-center gap-2 text-lg font-semibold">
          <Gauge className="size-5 text-focus" aria-hidden />
          Progress
        </h2>
        <p className="font-display text-5xl font-bold leading-none tabular-nums">
          <AnimatedNumber value={pct} />
          <span className="text-3xl text-muted">%</span>
        </p>
      </div>

      {/* One segment per milestone day. Segment width matches the planned hours. */}
      <div className="mt-5 flex gap-1" role="img" aria-label={`${done.length} of ${MILESTONE_DAYS.length} milestones done`}>
        {MILESTONE_DAYS.map((d) => {
          const isDone = !!days[d.label]?.done;
          const status = rowStatus(d.date, today);
          const missed = isMissed(d.date, today, isDone);
          return (
            <div key={d.label} className="flex min-w-0 flex-col gap-1.5" style={{ flexGrow: d.hours, flexBasis: 0 }}>
              <div
                className={`relative h-3.5 overflow-hidden rounded-full bg-surface-2 ring-1 ring-inset ${
                  status === "today" ? "ring-focus" : missed ? "ring-warn/60" : "ring-line"
                }`}
                style={
                  missed
                    ? {
                        backgroundImage:
                          "repeating-linear-gradient(-45deg, var(--warn-soft) 0 4px, transparent 4px 8px)",
                      }
                    : undefined
                }
              >
                <motion.div
                  className="absolute inset-0 origin-left rounded-full bg-go"
                  initial={false}
                  animate={{ scaleX: isDone ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 160, damping: 22 }}
                />
              </div>
              <span
                className={`text-center text-[10px] leading-none ${
                  status === "today" ? "font-semibold text-focus" : "text-muted"
                }`}
              >
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-surface-2 p-3">
          <dt className="text-sm text-muted">Milestones</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums">
            <AnimatedNumber value={done.length} /> of {MILESTONE_DAYS.length}
          </dd>
        </div>
        <div className="rounded-2xl bg-surface-2 p-3">
          <dt className="text-sm text-muted">Hours done</dt>
          <dd className="mt-1 text-lg font-semibold">
            <AnimatedNumber value={hours} decimals={hours % 1 ? 1 : 0} /> of {TOTAL_HOURS}
          </dd>
        </div>
      </dl>
    </section>
  );
}
