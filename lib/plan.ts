export type DayPlan = {
  label: string;
  date: string; // YYYY-MM-DD in IST
  hours: number;
  milestone: string;
  focus: string;
  problemDay: boolean;
};

export type Plan = {
  interviewDate: string;
  // Moment the live countdown runs to. Change the time if you know the interview slot.
  interviewStart: string;
  timeZone: string;
  days: readonly DayPlan[];
  sessionSteps: readonly string[];
  framework: readonly string[];
};

export const PLAN: Plan = {
  interviewDate: "2026-11-30",
  interviewStart: "2026-11-30T00:00:00+05:30",
  timeZone: "Asia/Kolkata",
  days: [
    { label: "T-8", date: "2026-11-22", hours: 1.5, milestone: "Framework locked, mocks booked", focus: "Write the framework; book mocks for T-3 & T-2", problemDay: false },
    { label: "T-7", date: "2026-11-23", hours: 2, milestone: "News feed, timed", focus: "Design a news feed", problemDay: true },
    { label: "T-6", date: "2026-11-24", hours: 2, milestone: "Chat system, timed", focus: "Design a chat system", problemDay: true },
    { label: "T-5", date: "2026-11-25", hours: 2, milestone: "Video streaming, timed", focus: "Design a video streaming service", problemDay: true },
    { label: "T-4", date: "2026-11-26", hours: 2, milestone: "Rate limiter, URL shortener", focus: "Two smaller designs", problemDay: true },
    { label: "T-3", date: "2026-11-27", hours: 2, milestone: "Mock #1, list gaps", focus: "Mock interview; log every gap", problemDay: false },
    { label: "T-2", date: "2026-11-28", hours: 4, milestone: "Patch gaps, mock #2", focus: "Fix logged gaps; second mock", problemDay: false },
    { label: "T-1", date: "2026-11-29", hours: 4, milestone: "Light review, stop early", focus: "Review framework and gaps; stop by evening", problemDay: false },
    { label: "T-0", date: "2026-11-30", hours: 0, milestone: "Interview day", focus: "Warm up, then perform", problemDay: false },
  ],
  sessionSteps: [
    "45-min timed design, out loud",
    "Compare with a reference solution; note misses",
    "Patch the biggest gap",
    "Write tomorrow's clarifying questions",
  ],
  framework: [
    "Requirements",
    "Scale estimates",
    "API",
    "Data model",
    "High-level diagram",
    "Deep dive",
    "Bottlenecks & trade-offs",
  ],
};

// Milestone days are T-8 to T-1. T-0 is the interview itself.
export const MILESTONE_DAYS = PLAN.days.filter((d) => d.label !== "T-0");
export const TOTAL_HOURS = MILESTONE_DAYS.reduce((sum, d) => sum + d.hours, 0);
