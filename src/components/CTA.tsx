"use client";

import { ArrowRight } from "./icons";
import MagneticButton from "./MagneticButton";
import { MaskReveal, Reveal, SectionLabel } from "./Reveal";

export default function CTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden py-36 md:py-52"
    >
      {/* rotating geometric backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[135vmin] w-[135vmin] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 animate-[rot_90s_linear_infinite] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-[12%] animate-[rot-rev_70s_linear_infinite] rounded-full border border-dashed border-gold/[0.09]" />
          <div className="absolute inset-[26%] animate-[rot_120s_linear_infinite] rounded-full border border-white/[0.05]" />
          <div className="absolute inset-[38%] rounded-full bg-gold/[0.05] blur-3xl" />
          <div className="absolute left-1/2 top-[8%] h-2 w-2 -translate-x-1/2 rounded-full bg-gold/60" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal className="flex justify-center">
          <SectionLabel>Start a Project</SectionLabel>
        </Reveal>

        <h2 className="mt-8 font-display text-[clamp(2.6rem,6.5vw,5.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          <MaskReveal delay={0.08}>Ready to build</MaskReveal>
          <MaskReveal delay={0.2}>
            <span className="text-gradient-gold">something intelligent?</span>
          </MaskReveal>
        </h2>

        <Reveal delay={0.3} className="mt-8">
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-mute">
            Tell us what you&apos;re building. We&apos;ll help turn the idea
            into a system that works.
          </p>
        </Reveal>

        <Reveal delay={0.42} className="mt-11 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <a
              href="mailto:hello@raiqen.ai?subject=Project%20inquiry%20—%20RAIQEN"
              className="btn-gold"
              data-cursor="link"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href="mailto:hello@raiqen.ai"
              className="btn-ghost font-mono text-[13px]"
              data-cursor="link"
            >
              hello@raiqen.ai
            </a>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
