"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { Rocket } from "lucide-react";
import { FlipDigit } from "./FlipDigit";
import { formatRowDate, headerStatus, timeLeft } from "@/lib/dates";
import { PLAN } from "@/lib/plan";

const pad = (n: number) => String(n).padStart(2, "0");

export function Hero({ now, today }: { now: number; today: string }) {
  const status = headerStatus(today);
  const left = timeLeft(PLAN.interviewStart, now);
  const todayPlan = PLAN.days.find((d) => d.date === today);
  const firstDay = PLAN.days[0];

  const groups = [
    { label: "days", value: pad(left.days) },
    { label: "hours", value: pad(left.hours) },
    { label: "minutes", value: pad(left.minutes) },
    { label: "seconds", value: pad(left.seconds) },
  ];

  let title: string;
  let subtitle: string;
  if (status.kind === "countdown") {
    title = status.label;
    subtitle = status.daysLeft === 1 ? "1 day left" : `${status.daysLeft} days left`;
  } else if (status.kind === "interview") {
    title = "Interview day";
    subtitle = "Warm up, then perform";
  } else {
    title = "Done";
    subtitle = "The interview is over. Well done.";
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative overflow-hidden rounded-[28px] bg-board px-5 py-6 text-tile-ink shadow-board sm:px-8 sm:py-8"
    >
      {/* Soft light behind the T-minus label */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-32 size-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--board-focus), transparent)" }}
      />

      <div className="relative flex items-center justify-between gap-3 text-sm text-tile-ink/70">
        <span className="flex items-center gap-2 font-medium text-tile-ink">
          <Rocket className="size-4 text-board-focus" aria-hidden />
          System design prep
        </span>
        <span>{formatRowDate(today)}, IST</span>
      </div>

      <div className="relative mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className={`font-display font-extrabold leading-[0.85] tracking-tight ${
              status.kind === "countdown" ? "text-8xl sm:text-9xl" : "text-6xl sm:text-8xl"
            }`}
          >
            {title}
          </motion.h1>
          <p className="mt-3 text-lg text-tile-ink/85 sm:text-xl">{subtitle}</p>
  
          {status.kind === "countdown" && (
            <p className="mt-2 max-w-prose text-tile-ink/70">
              {todayPlan ? (
                <>
                  Today: <span className="font-medium text-tile-ink">{todayPlan.milestone}</span>
                </>
              ) : (
                <>Prep starts on {formatRowDate(firstDay.date)}.</>
              )}
            </p>
          )}
        </div>
  
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-tile-ink/70">
            <span className="relative flex size-2">
              {left.ms > 0 && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-board-go opacity-75 motion-reduce:hidden" />
              )}
              <span className="relative inline-flex size-2 rounded-full bg-board-go" />
            </span>
            {left.ms > 0 ? "Live countdown to the interview" : "Countdown complete"}
          </div>
  
          {left.ms > 0 ? (
            <div
              role="timer"
              aria-label={`${left.days} days, ${left.hours} hours and ${left.minutes} minutes left`}
              className="flex items-start gap-[clamp(4px,1.6vw,14px)]"
            >
              {groups.map((g, gi) => (
                <Fragment key={g.label}>
                  {gi > 0 && (
                    <span
                      aria-hidden
                      className="font-display text-[clamp(22px,6vw,48px)] font-bold leading-[1.15] text-tile-ink/40"
                    >
                      :
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      {g.value.split("").map((ch, i) => (
                        <FlipDigit key={i} value={ch} delay={0.25 + (gi * 2 + i) * 0.06} />
                      ))}
                    </div>
                    <span className="text-xs text-tile-ink/60">{g.label}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          ) : (
            <div aria-label={status.kind === "done" ? "Done" : "Good luck"} className="flex flex-wrap gap-1">
              {(status.kind === "done" ? "DONE" : "GOOD LUCK").split("").map((ch, i) =>
                ch === " " ? (
                  <span key={i} className="w-4" />
                ) : (
                  <FlipDigit key={i} value={ch} delay={0.25 + i * 0.08} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
