"use client";

import { motion } from "motion/react";

type Props = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean, el: HTMLElement) => void;
  size?: "md" | "sm";
};

export function Checkbox({ checked, label, onChange, size = "md" }: Props) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => onChange(!checked, e.currentTarget)}
      whileTap={{ scale: 0.82 }}
      whileHover={{ scale: 1.06 }}
      className={`grid shrink-0 cursor-pointer place-items-center border-2 transition-colors duration-200 ${
        size === "md" ? "size-8 rounded-[10px]" : "size-5 rounded-md"
      } ${
        checked
          ? "border-go bg-go text-white shadow-[0_6px_16px_-6px_var(--go)] dark:text-bg"
          : "border-line bg-surface hover:border-go"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-[72%]" fill="none" aria-hidden>
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </svg>
    </motion.button>
  );
}
