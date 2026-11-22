import { describe, expect, it } from "vitest";
import {
  daysBetween,
  formatRowDate,
  headerStatus,
  isMissed,
  rowStatus,
  tMinusLabel,
  timeLeft,
  todayInIST,
} from "./dates";
import { PLAN } from "./plan";

describe("tMinusLabel", () => {
  it("labels every plan day to match the plan table", () => {
    for (const day of PLAN.days) {
      expect(tMinusLabel(day.date)).toBe(day.label);
    }
  });

  it("labels days after the interview with T+", () => {
    expect(tMinusLabel("2026-12-01")).toBe("T+1");
  });

  it("counts across a month boundary", () => {
    expect(daysBetween("2026-10-31", "2026-11-30")).toBe(30);
  });
});

describe("todayInIST across the IST midnight boundary", () => {
  // IST is UTC+5:30, so IST midnight on 23 Nov is 18:30 UTC on 22 Nov.
  const at2359IST = new Date("2026-11-22T18:29:00Z"); // 22 Nov, 23:59 IST
  const at0001IST = new Date("2026-11-22T18:31:00Z"); // 23 Nov, 00:01 IST

  it("is still the old day at 23:59 IST", () => {
    expect(todayInIST(at2359IST)).toBe("2026-11-22");
  });

  it("is the new day at 00:01 IST even though UTC is still the previous day", () => {
    expect(todayInIST(at0001IST)).toBe("2026-11-23");
    expect(at0001IST.getUTCDate()).toBe(22);
  });

  it("moves the today row from T-8 to T-7", () => {
    const todayRow = (now: Date) =>
      PLAN.days.find((d) => rowStatus(d.date, todayInIST(now)) === "today")?.label;
    expect(todayRow(at2359IST)).toBe("T-8");
    expect(todayRow(at0001IST)).toBe("T-7");
  });
});

describe("rowStatus", () => {
  it("returns past, today and future", () => {
    expect(rowStatus("2026-11-23", "2026-11-24")).toBe("past");
    expect(rowStatus("2026-11-24", "2026-11-24")).toBe("today");
    expect(rowStatus("2026-11-25", "2026-11-24")).toBe("future");
  });
});

describe("isMissed", () => {
  it("is true only for past rows that are not done", () => {
    expect(isMissed("2026-11-23", "2026-11-24", false)).toBe(true);
    expect(isMissed("2026-11-23", "2026-11-24", true)).toBe(false);
  });

  it("is false for today and future rows", () => {
    expect(isMissed("2026-11-24", "2026-11-24", false)).toBe(false);
    expect(isMissed("2026-11-25", "2026-11-24", false)).toBe(false);
  });
});

describe("headerStatus", () => {
  it("counts down before the interview", () => {
    expect(headerStatus("2026-11-22")).toEqual({ kind: "countdown", label: "T-8", daysLeft: 8 });
  });

  it("shows interview day on T-0 and done after", () => {
    expect(headerStatus("2026-11-30")).toEqual({ kind: "interview" });
    expect(headerStatus("2026-12-01")).toEqual({ kind: "done" });
  });
});

describe("formatRowDate", () => {
  it("formats as weekday, day and month", () => {
    expect(formatRowDate("2026-11-23")).toBe("Mon 23 Nov");
    expect(formatRowDate("2026-11-30")).toBe("Mon 30 Nov");
  });
});

describe("timeLeft", () => {
  it("splits the remaining time and stops at zero", () => {
    const now = Date.parse("2026-11-28T22:58:30+05:30");
    expect(timeLeft(PLAN.interviewStart, now)).toMatchObject({ days: 1, hours: 1, minutes: 1, seconds: 30 });
    expect(timeLeft(PLAN.interviewStart, Date.parse("2026-12-01T00:00:00Z")).ms).toBe(0);
  });
});
