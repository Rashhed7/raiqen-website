"use client";

import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CoreIcon, FlowIcon, StackIcon } from "./icons3d";
import { EASE, MaskReveal, Reveal, SectionLabel } from "./Reveal";

const PRODUCTS = [
  {
    tag: "AI PRODUCT",
    line: "Intelligent product experiences — designed, engineered and shipped in-house.",
    icon: CoreIcon,
  },
  {
    tag: "BUSINESS AUTOMATION",
    line: "Agentic workflows and automation systems built for enterprise operations.",
    icon: FlowIcon,
  },
  {
    tag: "INTELLIGENT PLATFORM",
    line: "A platform layer purpose-built for intelligent systems and AI applications.",
    icon: StackIcon,
  },
];

function ProductCard({
  product,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const Icon = product.icon;

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: EASE }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-panel to-ink/70 p-8 transition-colors duration-500 hover:border-gold/25 md:p-10"
      data-cursor="link"
    >
      <div
        className="pointer-events-none absolute -top-28 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-gold/[0.05] blur-[80px] transition-colors duration-700 group-hover:bg-gold/[0.1]"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex h-24 items-center [perspective:700px]">
          <Icon />
        </div>
        <span className="flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.04] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.22em] text-gold/90">
          <span className="h-1.5 w-1.5 animate-[blink_2.6s_ease-in-out_infinite] rounded-full bg-gold" />
          Coming Soon
        </span>
      </div>

      <div className="mt-14">
        <h3 className="font-display text-xl font-medium tracking-[0.22em] text-fg">
          {product.tag}
        </h3>
        <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-mute">
          {product.line}
        </p>
      </div>

      <div className="mt-9 flex items-center justify-between border-t border-white/[0.06] pt-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute/50">
          In development
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/50">
          RAIQEN R&amp;D
        </span>
      </div>
    </motion.article>
  );
}

export default function Products() {
  return (
    <section id="research" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <SectionLabel>Products</SectionLabel>
        </Reveal>
        <div className="mt-7 flex flex-wrap items-end justify-between gap-8">
          <h2 className="max-w-2xl font-display text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            <MaskReveal delay={0.05}>Built by</MaskReveal>
            <MaskReveal delay={0.16}>
              <span className="text-gradient-gold">RAIQEN.</span>
            </MaskReveal>
          </h2>
          <Reveal delay={0.25} className="max-w-xs">
            <p className="text-[14px] leading-relaxed text-mute">
              What&apos;s next is being built. Quietly, precisely, now.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.tag} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
