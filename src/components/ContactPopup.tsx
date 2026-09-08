"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useContactPopup } from "@/lib/contact-popup-context";
import { buildLeadPayload, submitLead } from "@/lib/lead-form";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SERVICES = [
  "AI Product Development",
  "AI Integration",
  "AI Automation",
  "AI Workflow",
  "AI Agents",
  "Software Development",
  "Web Development",
  "SaaS Product",
  "Business Process Automation",
  "Other",
] as const;

const TIMELINES = [
  "Exploring an idea",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Not sure yet",
] as const;

const BUDGETS = [
  "Not sure yet",
  "Under $1,000",
  "$1,000–$5,000",
  "$5,000–$10,000",
  "$10,000+",
  "Let's discuss",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.22, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/*  Field animation helper                                             */
/* ------------------------------------------------------------------ */

const fieldAnim = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, delay: 0.04 * i },
  }),
};

/* ------------------------------------------------------------------ */
/*  Service Multi-Select                                               */
/* ------------------------------------------------------------------ */

function ServiceMultiSelect({
  selected,
  onChange,
  error,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (svc: string) => {
    onChange(
      selected.includes(svc)
        ? selected.filter((s) => s !== svc)
        : [...selected, svc]
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "popup-field flex w-full items-center justify-between text-left",
          open && "ring-gold/40",
          error && "ring-red-400/50"
        )}
      >
        <span
          className={cn(
            "truncate",
            selected.length === 0 ? "text-mute/55" : "text-fg"
          )}
        >
          {selected.length === 0
            ? "Select one or more services"
            : `${selected.length} service${selected.length > 1 ? "s" : ""} selected`}
        </span>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={cn(
            "h-3 w-3 shrink-0 text-mute transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full border border-gold/25 bg-gold/[0.07] px-2.5 py-1 text-[11px] font-medium text-gold"
            >
              {s}
              <button
                type="button"
                onClick={() => toggle(s)}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-gold/20"
                aria-label={`Remove ${s}`}
              >
                <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5">
                  <path
                    d="M2 2l6 6M8 2l-6 6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: EASE }}
            className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-white/[0.09] bg-[#0d0f13] p-1.5 shadow-xl shadow-black/30"
          >
            {SERVICES.map((svc) => {
              const active = selected.includes(svc);
              return (
                <button
                  key={svc}
                  type="button"
                  onClick={() => toggle(svc)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
                    active
                      ? "bg-gold/[0.1] text-gold"
                      : "text-mute hover:bg-white/[0.04] hover:text-fg"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      active
                        ? "border-gold bg-gold text-ink"
                        : "border-white/20"
                    )}
                  >
                    {active && (
                      <svg
                        viewBox="0 0 10 10"
                        fill="none"
                        className="h-2.5 w-2.5"
                      >
                        <path
                          d="M2 5.5 4 7.5l4-4"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {svc}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <p className="mt-1.5 text-[12px] text-red-400/80">{error}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ContactPopup() {
  const { isOpen, close } = useContactPopup();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [honeypot, setHoneypot] = useState(""); // must stay empty

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error_, setError_] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /* ---- Lock body scroll when open ---- */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ---- Focus first field on open ---- */
  useEffect(() => {
    if (isOpen) {
      // small delay so animation starts before focus
      const t = setTimeout(() => firstFieldRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  /* ---- Escape key ---- */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  /* ---- Validate ---- */
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Name is required.";
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!EMAIL_RE.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (services.length === 0) errs.services = "Please select at least one service.";
    if (!message.trim()) {
      errs.message = "Project description is required.";
    } else if (message.trim().length < 10) {
      errs.message = "Please describe your project in at least 10 characters.";
    }

    // Honeypot — if filled, silently fail
    if (honeypot) {
      // pretend success but don't submit
      setSubmitted(true);
      return false;
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [name, email, services, message, honeypot]);

  /* ---- Submit ---- */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setSubmitting(true);
      setError_(null);

      try {
        const payload = buildLeadPayload({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          phone: phone.trim(),
          service: services.join(", "),
          message: message.trim(),
          timeline: timeline || "Not specified",
          budget: budget || "Not specified",
        });

        await submitLead(payload);

        setSubmitted(true);
      } catch (err) {
        console.error("Lead form submission error:", err);
        setError_(
          "Something went wrong. Please try again, or contact us directly at hello@raiqen.ai."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, company, phone, services, message, timeline, budget, honeypot, validate]
  );

  /* ---- Reset for "Try Again" ---- */
  const tryAgain = useCallback(() => {
    setError_(null);
    setSubmitting(false);
  }, []);

  /* ---- Close & reset everything ---- */
  const handleClose = useCallback(() => {
    close();
    // Reset after animation finishes
    setTimeout(() => {
      setSubmitted(false);
      setError_(null);
      setSubmitting(false);
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setServices([]);
      setMessage("");
      setTimeline("");
      setBudget("");
      setHoneypot("");
      setFieldErrors({});
    }, 300);
  }, [close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-popup-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm"
          style={{ paddingTop: "5vh", paddingBottom: "5vh" }}
          role="dialog"
          aria-modal="true"
          aria-label="Contact RAIQEN"
          onMouseDown={(e) => {
            // only close if clicking the backdrop itself
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative my-auto w-full max-w-[600px] mx-4 sm:mx-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* ---- Modal Card ---- */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e12] shadow-2xl shadow-black/40">
              {/* subtle top glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              {/* inner ring */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" />

              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ==================== SUCCESS STATE ==================== */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex flex-col items-center px-8 py-16 text-center sm:px-12"
                    role="status"
                    aria-live="polite"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
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

                    <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      Thanks for reaching out.
                    </h3>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-mute">
                      We&apos;ve received your request. We&apos;ll review it
                      and get back to you soon.
                    </p>

                    <div className="mt-8">
                      <p className="font-display text-sm font-semibold tracking-[0.3em] text-fg">
                        RAIQEN
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-mute/50">
                        Intelligence. Engineered for Business.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn-ghost mt-10 font-mono text-[13px]"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : error_ ? (
                  /* ==================== ERROR STATE ==================== */
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex flex-col items-center px-8 py-16 text-center sm:px-12"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-7 w-7 text-red-400"
                        aria-hidden="true"
                      >
                        <path
                          d="M10 6v5M10 14h.01"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      Something went wrong.
                    </h3>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-mute">
                      Please try again, or contact us directly at{" "}
                      <a
                        href="mailto:hello@raiqen.ai"
                        className="text-gold underline-offset-4 hover:underline"
                        data-cursor="link"
                      >
                        hello@raiqen.ai
                      </a>
                      .
                    </p>

                    <button
                      type="button"
                      onClick={tryAgain}
                      className="btn-gold mt-10"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  /* ==================== FORM STATE ==================== */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    {/* Close button */}
                    <button
                      type="button"
                      onClick={handleClose}
                      className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-mute transition-colors hover:border-white/20 hover:text-fg"
                      aria-label="Close popup"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="h-3 w-3"
                      >
                        <path
                          d="M2 2l8 8M10 2l-8 8"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    {/* Header */}
                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                      <h2 className="font-display text-[1.65rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.85rem]">
                        Let&apos;s build something{" "}
                        <span className="text-gradient-gold">intelligent.</span>
                      </h2>
                      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-mute">
                        Tell us what you&apos;re working on. Whether you have a
                        complete project or just an idea, we&apos;d love to hear
                        about it.
                      </p>
                      <p className="mt-2.5 font-mono text-[11px] tracking-[0.06em] text-gold/60">
                        No complicated process. Just start the conversation.
                      </p>
                    </div>

                    {/* Form */}
                    <form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      className="space-y-4 px-8 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8"
                      noValidate
                    >
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="absolute left-[-9999px] opacity-0"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                      />

                      {/* Name + Email row */}
                      <motion.div
                        custom={0}
                        variants={fieldAnim}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        <div>
                          <label
                            htmlFor="popup-name"
                            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                          >
                            Full Name <span className="text-gold">*</span>
                          </label>
                          <input
                            ref={firstFieldRef}
                            id="popup-name"
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (fieldErrors.name)
                                setFieldErrors((p) => ({ ...p, name: "" }));
                            }}
                            className={cn(
                              "popup-field",
                              fieldErrors.name && "ring-red-400/50"
                            )}
                          />
                          {fieldErrors.name && (
                            <p className="mt-1 text-[12px] text-red-400/80">
                              {fieldErrors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="popup-email"
                            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                          >
                            Work Email <span className="text-gold">*</span>
                          </label>
                          <input
                            id="popup-email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (fieldErrors.email)
                                setFieldErrors((p) => ({ ...p, email: "" }));
                            }}
                            className={cn(
                              "popup-field",
                              fieldErrors.email && "ring-red-400/50"
                            )}
                          />
                          {fieldErrors.email && (
                            <p className="mt-1 text-[12px] text-red-400/80">
                              {fieldErrors.email}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Company + Phone row */}
                      <motion.div
                        custom={1}
                        variants={fieldAnim}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        <div>
                          <label
                            htmlFor="popup-company"
                            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                          >
                            Company
                          </label>
                          <input
                            id="popup-company"
                            type="text"
                            autoComplete="organization"
                            placeholder="Your company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="popup-field"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="popup-phone"
                            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                          >
                            Phone / WhatsApp
                          </label>
                          <input
                            id="popup-phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="popup-field"
                          />
                        </div>
                      </motion.div>

                      {/* Services multi-select */}
                      <motion.div
                        custom={2}
                        variants={fieldAnim}
                        initial="hidden"
                        animate="show"
                      >
                        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60">
                          What can RAIQEN help you with?{" "}
                          <span className="text-gold">*</span>
                        </label>
                        <ServiceMultiSelect
                          selected={services}
                          onChange={(v) => {
                            setServices(v);
                            if (fieldErrors.services)
                              setFieldErrors((p) => ({
                                ...p,
                                services: "",
                              }));
                          }}
                          error={fieldErrors.services}
                        />
                      </motion.div>

                      {/* Message */}
                      <motion.div
                        custom={3}
                        variants={fieldAnim}
                        initial="hidden"
                        animate="show"
                      >
                        <label
                          htmlFor="popup-message"
                          className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                        >
                          Project Description{" "}
                          <span className="text-gold">*</span>
                        </label>
                        <textarea
                          id="popup-message"
                          rows={4}
                          required
                          placeholder="Tell us about your idea, business problem, workflow, or what you'd like to build..."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                            if (fieldErrors.message)
                              setFieldErrors((p) => ({ ...p, message: "" }));
                          }}
                          className={cn(
                            "popup-field resize-none",
                            fieldErrors.message && "ring-red-400/50"
                          )}
                        />
                        {fieldErrors.message && (
                          <p className="mt-1 text-[12px] text-red-400/80">
                            {fieldErrors.message}
                          </p>
                        )}
                      </motion.div>

                      {/* Timeline + Budget row */}
                      <motion.div
                        custom={4}
                        variants={fieldAnim}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        <div>
                          <label
                            htmlFor="popup-timeline"
                            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                          >
                            Project Timeline
                          </label>
                          <select
                            id="popup-timeline"
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            className="popup-field popup-select"
                          >
                            <option value="">Select a timeline</option>
                            {TIMELINES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="popup-budget"
                            className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.3em] text-mute/60"
                          >
                            Estimated Budget
                          </label>
                          <select
                            id="popup-budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="popup-field popup-select"
                          >
                            <option value="">Select a range</option>
                            {BUDGETS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>

                      {/* Submit */}
                      <motion.div
                        custom={5}
                        variants={fieldAnim}
                        initial="hidden"
                        animate="show"
                        className="pt-2"
                      >
                        <button
                          type="submit"
                          disabled={submitting}
                          className={cn(
                            "group flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-[14px] font-semibold tracking-wide transition-all duration-300",
                            submitting
                              ? "cursor-not-allowed bg-gold/20 text-gold/50"
                              : "bg-gradient-to-b from-[#edc688] to-[#d9a755] text-[#14100a] hover:shadow-lg hover:shadow-gold/20"
                          )}
                        >
                          {submitting ? (
                            <>
                              <svg
                                className="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  className="opacity-25"
                                />
                                <path
                                  d="M12 2a10 10 0 0 1 10 10"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Submitting…
                            </>
                          ) : (
                            <>
                              Start the Conversation
                              <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                              >
                                <path
                                  d="M3 8h10M9 4l4 4-4 4"
                                  stroke="currentColor"
                                  strokeWidth="1.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
