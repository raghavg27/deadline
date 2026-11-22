"use client";

import dynamic from "next/dynamic";

// The tracker reads the clock and localStorage, so it renders only in the browser.
// This avoids hydration mismatches.
const Tracker = dynamic(() => import("./Tracker"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:pt-8">
      <div className="h-[340px] animate-pulse rounded-[28px] bg-board shadow-board" />
    </div>
  ),
});

export default function ClientApp() {
  return <Tracker />;
}
