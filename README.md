# Deadline

Deadline is a single-page app. It tracks an 8-day system design interview plan.

The interview date is 30 November 2026. All dates use India Standard Time (IST).

## Features

- A flip-board countdown that shows the time to the interview. It changes each second.
- A progress bar. It shows the milestones that are done and the planned hours that are done.
- A timeline of the 9 plan days. Today is highlighted. A past day that is not done shows "Missed".
- A Pomodoro timer: 25 minutes of work, 5 minutes of break, and 15 minutes of break after 4 rounds.
- A cheat sheet with the 7 steps of the design framework.

The app keeps all data in the browser (localStorage). It has no server and no account.

## Run the app

You must have Node.js 20.19 or a later version.

1. Install the packages:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser.

## Commands

| Command         | Result                                  |
| --------------- | --------------------------------------- |
| `npm run dev`   | Starts the development server.          |
| `npm run build` | Makes a production build.               |
| `npm start`     | Starts the production build.            |
| `npm run lint`  | Examines the code with ESLint.          |
| `npm test`      | Runs the unit tests with Vitest.        |

## Change the plan

The plan data is in `lib/plan.ts`.

The countdown stops at `interviewStart`. The default value is 00:00 IST on 30 November. If you know the time of your interview, change this value.

## Files

| File                  | Contents                                          |
| --------------------- | ------------------------------------------------- |
| `lib/plan.ts`         | The plan days, session steps and framework steps. |
| `lib/dates.ts`        | Date functions that use IST.                      |
| `lib/pomodoro.ts`     | Timer functions.                                  |
| `lib/storage.ts`      | Read and write of the saved data.                 |
| `lib/beep.ts`         | The sound at the end of each timer phase.         |
| `components/`         | The parts of the page.                            |

## Note about sound

Browsers do not play sound before you click on the page. If you reload the page while the timer runs, click one time on the page to turn on the sound again.
