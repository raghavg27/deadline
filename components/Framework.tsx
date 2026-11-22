"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Calculator, ChevronDown, ClipboardList, Database, Microscope, Network, Plug, Scale } from "lucide-react";
import { PLAN } from "@/lib/plan";

const ICONS = [ClipboardList, Calculator, Plug, Database, Network, Microscope, Scale];

export function Framework() {
  const [open, setOpen] = useState(false);

  return (
    <section className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="framework-steps"
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-5 text-left sm:p-6"
      >
        <span className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="size-5 text-focus" aria-hidden />
          Framework cheat sheet
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-muted">
          <ChevronDown className="size-5" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="framework-steps"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <ol className="relative space-y-1 px-5 pb-5 sm:px-6 sm:pb-6">
              {PLAN.framework.map((step, i) => {
                const Icon = ICONS[i];
                return (
                  <motion.li
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-2"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-focus-soft text-focus">
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    <span className="w-5 shrink-0 font-display text-xl font-bold text-muted">{i + 1}</span>
                    <span className="font-medium">{step}</span>
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
