"use client";

import { Fragment, useState } from "react";
import { motion } from "motion/react";

/** One split-flap tile. When `value` changes, the old character flips down to show the new one. */
export function FlipDigit({ value, delay = 0 }: { value: string; delay?: number }) {
  const [cur, setCur] = useState(value);
  const [prev, setPrev] = useState(value);
  if (value !== cur) {
    setPrev(cur);
    setCur(value);
  }

  return (
    <motion.span
      className="flip"
      aria-hidden
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <span className="flip-half flip-top">
        <span>{cur}</span>
      </span>
      <span className="flip-half flip-bottom">
        <span>{cur}</span>
      </span>
      {prev !== cur && (
        // The key changes on every new value, so the flip animation restarts.
        <Fragment key={`${prev}${cur}`}>
          <span className="flip-half flip-bottom flip-old">
            <span>{prev}</span>
          </span>
          <span className="flip-half flip-top flip-anim-top">
            <span>{prev}</span>
          </span>
          <span className="flip-half flip-bottom flip-anim-bottom">
            <span>{cur}</span>
          </span>
        </Fragment>
      )}
    </motion.span>
  );
}
