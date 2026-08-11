"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, MaskReveal, Reveal, SectionLabel } from "./Reveal";

const STEPS = [
  {
    label: "INPUT",
    note: "Raw business processes, data and signals enter the system.",
    core: false,
  },
  {
    label: "UNDERSTAND",
    note: "Context, structure and intent are extracted and mapped.",
    core: false,
  },
  {
    label: "INTELLIGENCE",
    note: "Models reason over your domain and decide the optimal path.",
    core: true,
  },
  {
    label: "AUTOMATION",
    note: "Decisions become precise, repeatable actions — executed by systems.",
    core: false,
  },
  {
    label: "ACTION",
    note: "Systems respond, outcomes are measured and results flow back.",
    core: false,
  },
];

export default function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.72", "end 0.6"],
  });
  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotTop = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length));
    setActive(i);
  });

  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.035] blur-[160px]" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="flex justify-center">
            <SectionLabel>AI Transformation</SectionLabel>
          </Reveal>
          <h2 className="mt-7 font-display text-[clamp(2.3rem,5vw,4.1rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            <MaskReveal delay={0.05}>Your business already has workflows.</MaskReveal>
            <MaskReveal delay={0.16}>
              <span className="text-gradient-gold">We make them intelligent.</span>
            </MaskReveal>
          </h2>
        </div>

        {/* subtle 3D depth on desktop */}
        <div
          ref={ref}
          className="relative mx-auto mt-24 max-w-lg [perspective:1400px]"
        >
          <div className="relative md:[transform:rotateX(5deg)]">
            {/* spine */}
            <div className="absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-white/[0.07]">
              <motion.div
                className="absolute inset-0 origin-top bg-gradient-to-b from-gold/80 via-gold/60 to-gold/40"
                style={{ scaleY: fillScale }}
              />
              {/* travelling pulse — lives inside the spine so 0–100% maps to the visible track */}
              <motion.div
                className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_16px_rgba(227,180,108,0.9)]"
                style={{ top: dotTop }}
                aria-hidden="true"
              />
            </div>

            <div className="relative flex flex-col">
              {STEPS.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    "relative flex flex-col items-center",
                    s.core ? "py-12" : "py-8 md:py-9"
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10 flex items-center justify-center rounded-full border transition-all duration-700",
                      s.core ? "h-16 w-16" : "h-12 w-12",
                      active >= i
                        ? s.core
                          ? "border-gold/60 bg-gold/[0.07] shadow-[0_0_40px_-8px_rgba(227,180,108,0.6)]"
                          : "border-gold/40 bg-gold/[0.05]"
                        : "border-white/[0.12] bg-panel"
                    )}
                    style={{ animation: `bob 6s ease-in-out ${i * 0.7}s infinite` }}
                  >
                    {s.core && (
                      <span className="absolute inset-0 animate-[pulse-ring_3.2s_ease-out_infinite] rounded-full border border-gold/30" />
                    )}
                    <span
                      className={cn(
                        "relative font-mono text-[10px] tracking-widest transition-colors duration-500",
                        active >= i ? "text-gold" : "text-mute/50"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "mt-4 font-display text-sm font-medium uppercase tracking-[0.3em] transition-colors duration-500 md:text-[15px]",
                      s.core
                        ? "text-gold"
                        : active >= i
                          ? "text-fg"
                          : "text-mute/40"
                    )}
                  >
                    {s.label}
                  </div>

                  <AnimatePresence mode="wait">
                    {active === i && (
                      <motion.p
                        key={s.label}
                        initial={{ opacity: 0, y: 8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="mt-2 max-w-xs overflow-hidden text-center text-[13px] leading-relaxed text-mute"
                      >
                        {s.note}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
