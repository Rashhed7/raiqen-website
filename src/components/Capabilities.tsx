"use client";

import { motion } from "framer-motion";
import { EASE, MaskReveal, Reveal, SectionLabel } from "./Reveal";

const GROUPS = [
  {
    num: "01",
    title: "Artificial Intelligence",
    items: [
      "LLM applications",
      "AI agents",
      "Computer vision",
      "Generative AI",
      "AI integration",
    ],
  },
  {
    num: "02",
    title: "Software Engineering",
    items: [
      "Web applications",
      "SaaS",
      "APIs",
      "Backend systems",
      "Cloud applications",
    ],
  },
  {
    num: "03",
    title: "Automation",
    items: [
      "Business workflows",
      "AI automation",
      "Process automation",
      "System integrations",
      "Internal tools",
    ],
  },
  {
    num: "04",
    title: "Digital Products",
    items: ["Product design", "UI/UX", "Websites", "Interactive experiences"],
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionLabel>Capabilities</SectionLabel>
            </Reveal>
            <h2 className="mt-7 font-display text-[clamp(2.2rem,4.2vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
              <MaskReveal delay={0.05}>Everything we</MaskReveal>
              <MaskReveal delay={0.15}>
                <span className="text-gradient-gold">engineer with.</span>
              </MaskReveal>
            </h2>
            <Reveal delay={0.2} className="mt-6">
              <p className="max-w-sm text-[14.5px] leading-relaxed text-mute">
                From reasoning systems to product interfaces — the disciplines
                RAIQEN combines to build intelligent technology.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 hidden lg:block">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-mute/50">
                <span className="h-px w-8 bg-gold/30" />
                4 disciplines · One system
              </div>
            </Reveal>
          </div>

          {/* groups */}
          <div>
            {GROUPS.map((g, gi) => (
              <motion.div
                key={g.num}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, ease: EASE }}
                className="group border-b border-white/[0.07] py-10 first:border-t lg:py-12"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-xs text-gold/60">{g.num}</span>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-fg transition-colors duration-500 group-hover:text-gold md:text-3xl">
                    {g.title}
                  </h3>
                </div>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {g.items.map((item, ii) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-6% 0px" }}
                      transition={{
                        duration: 0.55,
                        delay: gi * 0.1 + ii * 0.055,
                        ease: EASE,
                      }}
                      data-cursor="link"
                      className="cursor-pointer rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[13px] text-mute transition-all duration-300 hover:border-gold/40 hover:bg-gold/[0.05] hover:text-fg"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
