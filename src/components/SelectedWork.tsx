"use client";

import { motion } from "framer-motion";
import { PROJECTS, type WorkProject } from "@/lib/portfolio";
import { EASE, MaskReveal, Reveal, SectionLabel } from "./Reveal";

function ProjectCard({
  project,
  index,
}: {
  project: WorkProject;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-ink/[0.08] bg-panel/70 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/35 hover:bg-panel2/80 hover:shadow-[0_30px_70px_-40px_rgba(16,24,40,0.25)] md:p-8"
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/[0.12] opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* meta row */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute/45">
          {project.industry}
        </span>
        <span className="font-mono text-[11px] text-mute/40">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* title + client */}
      <h3 className="mt-6 font-display text-[1.35rem] font-semibold leading-snug tracking-[-0.01em] text-fg">
        {project.title}
      </h3>
      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-gold/80">
        {project.client}
      </p>

      <p className="mt-4 text-[13.5px] leading-relaxed text-mute">
        {project.desc}
      </p>

      {/* what it does */}
      <ul className="mt-6 space-y-2.5">
        {project.points.map((pt) => (
          <li key={pt} className="flex items-start gap-2.5 text-[13px] text-mute">
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className="mt-[5px] h-2.5 w-2.5 shrink-0 text-gold/70"
              aria-hidden="true"
            >
              <path
                d="M2 6.5 4.5 9 10 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {pt}
          </li>
        ))}
      </ul>

      {/* tags */}
      <div className="mt-7 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-ink/[0.1] bg-ink/[0.03] px-3 py-1 text-[11px] text-mute transition-colors duration-300 group-hover:border-gold/35"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* bottom rule */}
      <div className="mt-auto pt-7">
        <div className="h-px w-full bg-gradient-to-r from-ink/10 via-ink/10 to-transparent transition-all duration-500 group-hover:from-gold/60 group-hover:via-gold/25" />
      </div>
    </motion.article>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div>
          <Reveal>
            <SectionLabel>Selected Work</SectionLabel>
          </Reveal>
          <h2 className="mt-7 max-w-2xl font-display text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
            <MaskReveal delay={0.05}>Shipped for real</MaskReveal>
            <MaskReveal delay={0.16}>
              <span className="text-gradient-gold">businesses.</span>
            </MaskReveal>
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
