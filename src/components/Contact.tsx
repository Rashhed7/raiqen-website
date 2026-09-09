"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContactPopup } from "@/lib/contact-popup-context";
import { buildLeadPayload, submitLead } from "@/lib/lead-form";
import ContactOrbit from "./ContactOrbit";
import { ArrowRight, MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import MagneticButton from "./MagneticButton";
import { EASE, MaskReveal, Reveal, SectionLabel } from "./Reveal";

const TOPICS = [
  "AI Product Development",
  "AI Integration",
  "Business Automation",
  "AI Workflow",
  "Software Development",
  "Website / Web Application",
  "SaaS Product",
  "Something else",
];

const BUDGETS = [
  "Not sure yet",
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Let's discuss",
];

const WHATSAPP_DISPLAY = "+91 7259516443";
const WHATSAPP_INTL = "917259516443";
const WA_TEXT = encodeURIComponent(
  "Hi RAIQEN, I'd like to talk about a project."
);

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sentVia, setSentVia] = useState<"webhook" | "mailto">("webhook");
  const { open } = useContactPopup();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || sent) return;

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const topic = String(data.get("topic") ?? "").trim();
    const idea = String(data.get("idea") ?? "").trim();
    const budget = String(data.get("budget") ?? "").trim();

    setSubmitting(true);

    // Primary: save the lead via /api/leads — same pipeline as the popup.
    try {
      await submitLead(
        buildLeadPayload({
          name,
          email,
          company,
          phone: "",
          service: topic,
          message: idea,
          timeline: "Not specified",
          budget: budget || "Not specified",
        })
      );
      setSentVia("webhook");
      setSent(true);
      return;
    } catch (err) {
      console.error("Lead form submission error:", err);
    } finally {
      setSubmitting(false);
    }

    // Fallback: open the visitor's mail client with the message pre-filled.
    const subject = `Project inquiry — ${name} (${topic})`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      `I'm interested in: ${topic}`,
      budget ? `Budget: ${budget}` : null,
      "",
      `About my project / idea:`,
      idea || "(no details provided yet)",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:hello@raiqen.ai?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSentVia("mailto");
    setSent(true);
  };

  const fieldAnim = {
    hidden: { opacity: 0, y: 14 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE, delay: 0.05 * i },
    }),
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -right-40 top-24 h-[34rem] w-[34rem] rounded-full bg-gold/[0.03] blur-3xl" />
        <div className="absolute -left-48 bottom-0 h-[28rem] w-[28rem] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        {/* ---------------- header ---------------- */}
        <div className="max-w-2xl">
          <Reveal>
            <SectionLabel>Contact RAIQEN</SectionLabel>
          </Reveal>
          <h2 className="mt-7 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.03em]">
            <MaskReveal delay={0.05}>Let&apos;s build</MaskReveal>
            <MaskReveal delay={0.16}>
              <span className="text-gradient-gold">something intelligent.</span>
            </MaskReveal>
          </h2>
          <Reveal delay={0.22} className="mt-7">
            <p className="max-w-xl text-[15px] leading-relaxed text-mute">
              Have an idea, a business problem, or a workflow you want to
              improve with AI? Tell us about it. You don&apos;t need all the
              answers — we&apos;ll figure out the possibilities together.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-5">
            <p className="max-w-xl font-mono text-[12px] leading-relaxed tracking-[0.08em] text-gold/70">
              Have an idea? A question? Just curious about what&apos;s
              possible? Reach out.
            </p>
          </Reveal>

          <Reveal delay={0.38} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <button
                type="button"
                onClick={open}
                className="btn-gold"
                data-cursor="link"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4" />
              </button>
            </MagneticButton>
            <MagneticButton>
              <a
                href="mailto:hello@raiqen.ai"
                className="btn-ghost font-mono text-[13px]"
                data-cursor="link"
              >
                Email us
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </MagneticButton>
          </Reveal>
        </div>

        {/* ---------------- form + side panel ---------------- */}
        <div className="mt-20 grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:gap-8">
          {/* form card */}
          <Reveal className="relative">
            <div
              id="contact-form"
              className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-panel/40 p-6 md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.04]" />

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="relative flex min-h-[26rem] flex-col items-center justify-center text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-7 w-7 text-gold"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10.5 8 14l8-8"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="mt-7 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      Thanks for reaching out.
                    </h3>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-mute">
                      {sentVia === "webhook" ? (
                        <>We&apos;ve received your request. We&apos;ll get back to you soon.</>
                      ) : (
                        <>
                          Your email app should have opened with your message
                          ready — if not, email us directly at{" "}
                          <a
                            href="mailto:hello@raiqen.ai"
                            className="text-gold underline-offset-4 hover:underline"
                            data-cursor="link"
                          >
                            hello@raiqen.ai
                          </a>
                          .
                        </>
                      )}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    className="relative space-y-5"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-12% 0px" }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: { staggerChildren: 0.06 },
                      },
                    }}
                  >
                    <motion.div
                      custom={0}
                      variants={fieldAnim}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Your name"
                          className="field"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                        >
                          Work Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@company.com"
                          className="field"
                        />
                      </div>
                    </motion.div>

                    <motion.div custom={1} variants={fieldAnim}>
                      <label
                        htmlFor="company"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                      >
                        Company
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Your company (optional)"
                        className="field"
                      />
                    </motion.div>

                    <motion.div custom={2} variants={fieldAnim}>
                      <label
                        htmlFor="topic"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                      >
                        What can we help with?
                      </label>
                      <select
                        id="topic"
                        name="topic"
                        required
                        defaultValue=""
                        className="field"
                      >
                        <option value="" disabled>
                          Select a topic
                        </option>
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div custom={3} variants={fieldAnim}>
                      <label
                        htmlFor="idea"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                      >
                        Tell us about your idea
                      </label>
                      <textarea
                        id="idea"
                        name="idea"
                        rows={5}
                        placeholder="Tell us what you're building, what problem you're trying to solve, or what you'd like to automate..."
                        className="field"
                      />
                      <p className="mt-2 text-[12.5px] text-mute/70">
                        Don&apos;t have everything figured out yet? That&apos;s
                        completely fine.
                      </p>
                    </motion.div>

                    <motion.div custom={4} variants={fieldAnim}>
                      <label
                        htmlFor="budget"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                      >
                        Budget
                        <span className="ml-2 normal-case tracking-normal text-mute/40">
                          (optional)
                        </span>
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        defaultValue=""
                        className="field"
                      >
                        <option value="" disabled>
                          Select a range
                        </option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div custom={5} variants={fieldAnim} className="pt-1">
                      <MagneticButton className="block sm:inline-block">
                        <button
                          type="submit"
                          disabled={submitting || sent}
                          className="btn-gold w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting ? "Sending…" : "Let's Talk"}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </MagneticButton>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* side column */}
          <div className="flex flex-col gap-6">
            {/* direct contact */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-white/[0.07] bg-panel/40 p-6 md:p-7">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  Prefer a direct conversation?
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mute">
                  Skip the form — reach us however feels natural.
                </p>

                <a
                  href="mailto:hello@raiqen.ai"
                  className="group mt-6 flex items-center gap-3.5"
                  data-cursor="link"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] transition-colors duration-300 group-hover:border-gold/50 group-hover:bg-gold/10">
                    <MailIcon className="h-4 w-4 text-mute transition-colors duration-300 group-hover:text-gold" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.22em] text-mute/50">
                      Email
                    </span>
                    <span className="block text-[14px] text-fg transition-colors duration-300 group-hover:text-gold">
                      hello@raiqen.ai
                    </span>
                  </span>
                </a>

                <a
                  href={`tel:+${WHATSAPP_INTL}`}
                  className="group mt-5 flex items-center gap-3.5"
                  data-cursor="link"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] transition-colors duration-300 group-hover:border-gold/50 group-hover:bg-gold/10">
                    <PhoneIcon className="h-4 w-4 text-mute transition-colors duration-300 group-hover:text-gold" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.22em] text-mute/50">
                      Phone / WhatsApp
                    </span>
                    <span className="block text-[14px] text-fg transition-colors duration-300 group-hover:text-gold">
                      {WHATSAPP_DISPLAY}
                    </span>
                  </span>
                </a>

                <MagneticButton className="mt-6 block" strength={0.2}>
                  <a
                    href={`https://wa.me/${WHATSAPP_INTL}?text=${WA_TEXT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/[0.05] px-5 py-3 text-[13.5px] font-medium text-gold transition-all duration-300 hover:border-gold/60 hover:bg-gold/10"
                    data-cursor="link"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Chat on WhatsApp
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </MagneticButton>
              </div>
            </Reveal>

            {/* just have an idea? */}
            <Reveal delay={0.18}>
              <div className="relative overflow-hidden rounded-3xl border border-gold/[0.18] bg-gold/[0.04] p-6 md:p-7">
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-gold/[0.08]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/60">
                  Just have an idea?
                </p>
                <p className="mt-4 text-[14px] leading-relaxed text-mute">
                  You don&apos;t need a complete plan. If you have an idea, a
                  problem, or a process you think AI could improve, talk to us.
                </p>
                <button
                  type="button"
                  onClick={open}
                  className="group mt-5 inline-flex items-center gap-2 text-[13.5px] font-medium text-gold transition-colors duration-300 hover:text-fg"
                  data-cursor="link"
                >
                  Tell us your idea
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </Reveal>

            {/* orbit visual */}
            <Reveal delay={0.26} className="flex-1">
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-panel/40 p-2">
                <div className="relative aspect-[4/3] w-full">
                  <ContactOrbit className="absolute inset-0 h-full w-full" />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.04]" />
                <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-mute/40">
                  <span>Idea → Conversation</span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
                    Intelligence → Solution
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* trust message */}
        <Reveal delay={0.15} className="mt-12">
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] px-6 py-5 md:flex-row md:items-center md:gap-6 md:px-8">
            <span className="flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-tight text-fg">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-4 w-4 text-gold"
                aria-hidden="true"
              >
                <path
                  d="M8 2.2c-2.6 0-4.7 2-4.7 4.5 0 3.1 4.7 7 4.7 7s4.7-3.9 4.7-7c0-2.5-2.1-4.5-4.7-4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <circle
                  cx="8"
                  cy="6.7"
                  r="1.6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              Your idea stays yours.
            </span>
            <p className="text-[13px] leading-relaxed text-mute md:max-w-xl">
              We respect your privacy and will only use the information you
              provide to understand your project and respond to your inquiry.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
