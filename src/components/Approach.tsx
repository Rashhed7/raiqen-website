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
    num: "01",
    title: "Understand",
    desc: "We map your business, processes and constraints before a line of code is written.",
  },
  {
    num: "02",
    title: "Design",
    desc: "We architect the system, the experience and the AI strategy around the real problem.",
  },
  {
    num: "03",
    title: "Engineer",
    desc: "We build precise, scalable software with rigorous engineering discipline.",
  },
  {
    num: "04",
    title: "Integrate",
    desc: "We connect your data, tools and workflows into one coherent, reliable system.",
  },
  {
    num: "05",
    title: "Evolve",
    desc: "We measure, learn and improve the system continuously — so it gets smarter over time.",
  },
];

export default function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.78", "end 0.85"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)));
  });

  return (
    <section id="approach" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel>Approach</SectionLabel>
        </Reveal>
        <h2 className="mt-7 max-w-3xl font-display text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          <MaskReveal delay={0.05}>From idea to</MaskReveal>
          <MaskReveal delay={0.16}>
            <span className="text-gradient-gold">intelligent system.</span>
          </MaskReveal>
        </h2>

        <div ref={ref} className="mt-24">
          {/* horizontal track (desktop) */}
          <div className="relative hidden md:block">
            <div className="absolute left-0 right-0 top-[1.35rem] h-px bg-white/[0.07]">
              <motion.div
                className="absolute inset-0 origin-left bg-gold/70"
                style={{ scaleX: lineScale }}
              />
            </div>
            <div className="relative grid grid-cols-5">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border font-mono text-xs transition-all duration-700",
                      active >= i
                        ? "border-gold/60 bg-gold/[0.08] text-gold shadow-[0_0_30px_-6px_rgba(227,180,108,0.6)]"
                        : "border-white/[0.12] bg-panel text-mute/50"
                    )}
                  >
                    {s.num}
                  </div>
                  <div
                    className={cn(
                      "mt-4 font-display text-sm font-medium tracking-wide transition-colors duration-700",
                      active >= i ? "text-fg" : "text-mute/40"
                    )}
                  >
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* vertical track (mobile) */}
          <div className="relative md:hidden">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative flex items-center gap-5 pb-9">
                <span
                  className={cn(
                    "absolute left-[1.35rem] top-11 h-[calc(100%-1.5rem)] w-px",
                    active > i ? "bg-gold/50" : "bg-white/[0.07]"
                  )}
                />
                <div
                  className={cn(
                    "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-all duration-700",
                    active >= i
                      ? "border-gold/60 bg-gold/[0.08] text-gold"
                      : "border-white/[0.12] bg-panel text-mute/50"
                  )}
                >
                  {s.num}
                </div>
                <div
                  className={cn(
                    "font-display text-base font-medium transition-colors duration-700",
                    active >= i ? "text-fg" : "text-mute/40"
                  )}
                >
                  {s.title}
                </div>
              </div>
            ))}
          </div>

          {/* active description */}
          <div className="mt-4 flex min-h-[7rem] items-center justify-center border-t border-white/[0.06] pt-10 md:mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="flex max-w-xl flex-col items-center gap-3 text-center"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold/60">
                  Step {STEPS[active].num} — {STEPS[active].title}
                </span>
                <p className="text-[15px] leading-relaxed text-mute">
                  {STEPS[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
