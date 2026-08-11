"use client";

import NetworkVisual from "./NetworkVisual";
import { MaskReveal, Reveal, SectionLabel } from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <Reveal>
              <SectionLabel>About</SectionLabel>
            </Reveal>
            <h2 className="mt-7 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
              <MaskReveal delay={0.05}>Technology should do</MaskReveal>
              <MaskReveal delay={0.15}>more than exist.</MaskReveal>
              <MaskReveal delay={0.25}>
                <span className="text-gradient-gold">It should create leverage.</span>
              </MaskReveal>
            </h2>
            <Reveal delay={0.25} className="mt-8 space-y-5">
              <p className="max-w-lg text-[15px] leading-relaxed text-mute">
                RAIQEN is a technology company focused on building intelligent
                software and AI systems for modern businesses.
              </p>
              <p className="max-w-lg text-[15px] leading-relaxed text-mute">
                We combine artificial intelligence, software engineering and
                automation to turn complex ideas and business processes into
                technology that works.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-panel/40 p-2">
              <div className="relative aspect-[4/3] w-full md:aspect-square">
                <NetworkVisual className="absolute inset-0 h-full w-full" />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.04]" />
              <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-mute/40">
                <span>Interconnected systems</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
                  live
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
