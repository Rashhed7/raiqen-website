"use client";

import { motion } from "framer-motion";
import { CoreIcon, FlowIcon, RingIcon, StackIcon } from "./icons3d";
import { EASE, MaskReveal, Reveal, SectionLabel } from "./Reveal";

const ITEMS = [
  {
    num: "01",
    title: "AI PRODUCTS",
    desc: "AI-powered products and SaaS platforms designed around real business problems.",
    icon: CoreIcon,
  },
  {
    num: "02",
    title: "INTELLIGENT SOFTWARE",
    desc: "Scalable software, platforms, APIs and applications engineered for modern businesses.",
    icon: StackIcon,
  },
  {
    num: "03",
    title: "AI WORKFLOWS",
    desc: "Transform repetitive business processes into intelligent, automated workflows.",
    icon: FlowIcon,
  },
  {
    num: "04",
    title: "DIGITAL EXPERIENCES",
    desc: "High-performance websites and digital products designed for clarity, usability and impact.",
    icon: RingIcon,
  },
];

export default function WhatWeBuild() {
  return (
    <section id="build" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel>What We Build</SectionLabel>
        </Reveal>
        <h2 className="mt-7 max-w-3xl font-display text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          <MaskReveal delay={0.05}>We build systems that think,</MaskReveal>
          <MaskReveal delay={0.16}>
            <span className="text-gradient-gold">work and evolve.</span>
          </MaskReveal>
        </h2>

        <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ITEMS.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.85, delay: i * 0.09, ease: EASE }}
              className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-panel/50 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold/25 hover:bg-panel2/70 hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)]"
            >
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-gold/0 blur-3xl transition-all duration-700 group-hover:bg-gold/[0.06]" />

              <div className="mb-12 flex h-20 items-start justify-between">
                <div className="[perspective:700px]">
                  <item.icon />
                </div>
                <span className="font-mono text-[11px] text-mute/40">
                  {item.num}
                </span>
              </div>

              <h3 className="font-display text-[15px] font-medium tracking-[0.2em] text-fg">
                {item.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-mute">
                {item.desc}
              </p>

              <div className="mt-7 h-px w-full bg-gradient-to-r from-white/10 via-white/10 to-transparent transition-all duration-500 group-hover:from-gold/50 group-hover:via-gold/20" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
