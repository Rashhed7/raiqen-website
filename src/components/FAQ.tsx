"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, MaskReveal, Reveal, SectionLabel } from "./Reveal";

/**
 * Pre-sales questions we actually get asked. Keep answers honest and
 * concrete — no invented claims (no fake client counts, no price floors).
 */
const FAQS = [
  {
    q: "What kind of projects does RAIQEN build?",
    a: "We build AI-powered products, intelligent software platforms, business automation and AI workflows, and high-performance websites and digital experiences. If you have a business problem that software or AI could solve, that's the conversation we want to have.",
  },
  {
    q: "How long does a typical project take?",
    a: "It depends on scope — a focused automation or website can ship in a few weeks, while a full product or platform takes a few months. Before any work starts, you get a clear timeline with milestones so you always know what's happening and when.",
  },
  {
    q: "How much will my project cost?",
    a: "Every project is scoped individually. After a short discovery conversation we share a fixed quote with clear deliverables — no hourly surprises. The initial conversation itself costs nothing, and you're never pushed to commit before you're comfortable.",
  },
  {
    q: "We already have software and tools. Can you work with them?",
    a: "Yes. We regularly integrate AI and automation into existing systems — CRMs, ERPs, internal tools, spreadsheets and workflows. We adapt to your stack rather than forcing you to rebuild everything from scratch.",
  },
  {
    q: "Do you work with small businesses and early-stage ideas?",
    a: "Absolutely. Some of our best work started as an idea shared over a conversation — a café's operations, a fragrance store, a solar business's lead flow. You don't need a complete plan; bring the problem and we'll figure out the approach together.",
  },
  {
    q: "Is my idea and data safe with you?",
    a: "Your idea stays yours. We're happy to sign an NDA before any detailed discussion, and any information you share is used only to understand your project and respond to your inquiry.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="relative py-28 md:py-40">
      {/* JSON-LD for rich results in search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionLabel>FAQ</SectionLabel>
            </Reveal>
            <h2 className="mt-7 font-display text-[clamp(2.2rem,4.2vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
              <MaskReveal delay={0.05}>Questions,</MaskReveal>
              <MaskReveal delay={0.15}>
                <span className="text-gradient-gold">answered.</span>
              </MaskReveal>
            </h2>
            <Reveal delay={0.2} className="mt-6">
              <p className="max-w-sm text-[14.5px] leading-relaxed text-mute">
                The things people usually ask before working with us. Anything
                else on your mind — just reach out, the first conversation is
                free.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 hidden lg:block">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-mute/50">
                <span className="h-px w-8 bg-gold/40" />
                Still curious? Ask us directly
              </div>
            </Reveal>
          </div>

          {/* accordion */}
          <div>
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.q} delay={i * 0.06}>
                  <div
                    className={`border-b border-ink/[0.08] transition-colors duration-300 ${
                      i === 0 ? "border-t lg:border-t-0" : ""
                    } ${isOpen ? "bg-panel/60" : ""}`}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-button-${i}`}
                        className="group flex w-full items-center gap-5 px-2 py-7 text-left md:gap-8 md:px-4"
                        data-cursor="link"
                      >
                        <span className="font-mono text-xs text-gold/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`flex-1 font-display text-[16px] font-medium tracking-tight transition-colors duration-300 md:text-[19px] ${
                            isOpen
                              ? "text-gold"
                              : "text-fg group-hover:text-gold"
                          }`}
                        >
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                            isOpen
                              ? "rotate-45 border-gold/50 bg-gold/10 text-gold"
                              : "border-ink/[0.15] text-mute group-hover:border-gold/40 group-hover:text-gold"
                          }`}
                        >
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              d="M7 1v12M1 7h12"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="panel"
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-button-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl px-2 pb-8 text-[14.5px] leading-relaxed text-mute md:px-4 md:pl-[4.5rem]">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
