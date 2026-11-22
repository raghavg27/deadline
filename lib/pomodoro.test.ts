import { describe, expect, it } from "vitest";
import { advance, DURATIONS, formatClock, initialTimer, pause, remainingMs, start } from "./pomodoro";

const MIN = 60_000;

describe("pomodoro", () => {
  it("keeps time from timestamps across pause and start", () => {
    let t = start(initialTimer(), 0);
    t = pause(t, 10 * MIN);
    expect(remainingMs(t, 999 * MIN)).toBe(15 * MIN);
    t = start(t, 100 * MIN);
    expect(remainingMs(t, 105 * MIN)).toBe(10 * MIN);
  });

  it("goes work, short break, work and a long break after round 4", () => {
    let t = start(initialTimer(), 0);
    const phases: string[] = [];
    for (let i = 0; i < 8; i++) {
      t = advance(t, t.endsAt!).timer;
      phases.push(`${t.phase}${t.round}`);
    }
    expect(phases).toEqual(["short1", "work2", "short2", "work3", "short3", "work4", "long4", "work1"]);
  });

  it("catches up over several phases after a long background gap", () => {
    const t = start(initialTimer(), 0);
    // 25 work + 5 break + 25 work = 55 min, so at 57 min we are 2 min into break 2.
    const { timer, transitioned } = advance(t, 57 * MIN);
    expect(transitioned).toBe(true);
    expect(timer.phase).toBe("short");
    expect(timer.round).toBe(2);
    expect(remainingMs(timer, 57 * MIN)).toBe(DURATIONS.short - 2 * MIN);
  });

  it("never shows more than the full time when the clock reads a little early", () => {
    const t = start(initialTimer(), 1_500);
    expect(remainingMs(t, 1_000)).toBe(DURATIONS.work);
  });

  it("formats the clock", () => {
    expect(formatClock(25 * MIN)).toBe("25:00");
    expect(formatClock(61_500)).toBe("01:02");
  });
});
