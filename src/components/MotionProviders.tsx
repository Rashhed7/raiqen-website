"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Applies user motion preferences to all framer-motion animations. */
export default function MotionProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
