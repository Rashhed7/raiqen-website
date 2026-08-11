"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Mode = "view" | "load";

/** Fade + rise reveal on scroll (or on mount with mode="load"). */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  once = true,
  mode = "view",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  mode?: Mode;
}) {
  if (mode === "load") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Line-by-line masked text reveal for headlines. */
export function MaskReveal({
  children,
  className,
  delay = 0,
  mode = "view",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  mode?: Mode;
}) {
  const wrapper = cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", className);
  const transition = { duration: 1, delay, ease: EASE };

  if (mode === "load") {
    return (
      <span className={wrapper}>
        <motion.span
          className="block will-change-transform"
          initial={{ y: "115%" }}
          animate={{ y: 0 }}
          transition={transition}
        >
          {children}
        </motion.span>
      </span>
    );
  }
  return (
    <span className={wrapper}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "115%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
        transition={transition}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Small mono uppercase section label with a gold rule. */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-gold/70",
        className
      )}
    >
      <span className="h-px w-8 bg-gold/40" />
      {children}
    </div>
  );
}
