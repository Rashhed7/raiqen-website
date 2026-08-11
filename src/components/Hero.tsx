"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/hooks";
import { ArrowRight } from "./icons";
import MagneticButton from "./MagneticButton";
import ParticleField from "./ParticleField";
import { MaskReveal, Reveal } from "./Reveal";

// Lazy-load the Three.js scene for faster initial paint & smaller bundle.
const IntelligenceCore = dynamic(() => import("./IntelligenceCore"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 rounded-full border border-white/10" />
    </div>
  ),
});

export default function Hero() {
  const offset = useMediaQuery("(min-width: 1024px)");
  const highQuality = useMediaQuery("(min-width: 768px)");

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* backdrop glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-[-10%] h-[46rem] w-[46rem] rounded-full bg-gold/[0.045] blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-15%] h-[36rem] w-[36rem] rounded-full bg-white/[0.02] blur-[120px]" />
      </div>

      <ParticleField className="absolute inset-0 h-full w-full" density={1} />

      {/* 3D core — beside the text on desktop, behind on mobile */}
      <div
        className="pointer-events-none absolute inset-0 lg:left-[32%]"
        aria-hidden="true"
      >
        <IntelligenceCore
          quality={highQuality ? "high" : "low"}
          offset={offset}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[110px]" />
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-32 pt-36 md:px-10 md:pt-40">
        <div className="max-w-2xl">
          <Reveal mode="load" delay={0.1} className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/50" />
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold/80">
              RAIQEN — AI &amp; Software Systems
            </span>
          </Reveal>

          <h1 className="mt-8 font-display text-[clamp(3.1rem,8.5vw,6.9rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            <MaskReveal mode="load" delay={0.18}>
              Intelligence.
            </MaskReveal>
            <MaskReveal mode="load" delay={0.3}>
              <span className="text-gradient-gold">Engineered for Business.</span>
            </MaskReveal>
          </h1>

          <Reveal mode="load" delay={0.52} className="mt-9">
            <p className="max-w-md text-[15.5px] leading-relaxed text-mute">
              RAIQEN builds AI-powered products, intelligent software, and
              automated systems that help businesses work smarter and grow
              faster.
            </p>
          </Reveal>

          <Reveal mode="load" delay={0.66} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <a href="#build" className="btn-gold" data-cursor="link">
                Explore RAIQEN
                <ArrowRight className="h-4 w-4" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#contact" className="btn-ghost" data-cursor="link">
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>
      </div>

      {/* bottom strip */}
      <Reveal
        mode="load"
        delay={1}
        className="absolute inset-x-0 bottom-0 z-10"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 pb-7 md:px-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mute/60">
            <span className="relative flex h-8 w-px overflow-hidden bg-white/10">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrolldrop_2.4s_ease-in-out_infinite] bg-gold/80" />
            </span>
            Scroll
          </div>
          <div className="hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-mute/45 md:flex">
            <span>AI Products</span>
            <span className="h-1 w-1 rounded-full bg-gold/40" />
            <span>Intelligent Software</span>
            <span className="h-1 w-1 rounded-full bg-gold/40" />
            <span>Automation</span>
            <span className="h-1 w-1 rounded-full bg-gold/40" />
            <span>Digital Experiences</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
