"use client";

import { Reveal, SectionLabel } from "./Reveal";

const ITEMS = [
  {
    num: "01",
    title: "Think deeper.",
    desc: "We understand the problem before building the technology.",
  },
  {
    num: "02",
    title: "Build precisely.",
    desc: "We engineer software around real-world requirements.",
  },
  {
    num: "03",
    title: "Automate intelligently.",
    desc: "We use AI where it creates measurable value.",
  },
];

export default function WhyRAIQEN() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel>Why RAIQEN</SectionLabel>
        </Reveal>

        <div className="mt-16">
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.num}
              delay={i * 0.1}
              className="group border-t border-white/[0.07] py-12 md:py-16"
            >
              <div className="grid items-baseline gap-4 md:grid-cols-[7rem_1fr_20rem] md:gap-8">
                <span className="font-mono text-xs text-gold/60">{item.num}</span>
                <h3 className="font-display text-[clamp(2.2rem,4.6vw,3.7rem)] font-semibold leading-none tracking-[-0.02em] transition-colors duration-500 group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="max-w-xs text-[15px] leading-relaxed text-mute md:justify-self-end">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
