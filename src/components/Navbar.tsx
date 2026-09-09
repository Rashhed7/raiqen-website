"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useContactPopup } from "@/lib/contact-popup-context";
import { ArrowRight } from "./icons";
import BrandMark from "./BrandMark";
import { EASE } from "./Reveal";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: openPopup } = useContactPopup();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the menu first, then scroll — body overflow is locked while open.
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!open) return;
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) {
      window.setTimeout(
        () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
        80
      );
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-ink/[0.06] bg-white/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:h-[4.5rem] md:px-10"
          aria-label="Main navigation"
        >
          <a
            href="#top"
            className="flex items-center gap-2.5 text-fg"
            data-cursor="link"
          >
            <BrandMark priority />
            <span className="font-display text-[16px] font-semibold tracking-[0.34em]">
              RAIQEN
            </span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="nav-link text-[13.5px] text-mute transition-colors duration-300 hover:text-fg"
                data-cursor="link"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openPopup}
              className="group hidden items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.05] px-5 py-2 text-[13px] font-medium text-gold transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 md:flex"
              data-cursor="link"
            >
              Start a Project
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="flex h-10 w-10 items-center justify-center md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-fg transition-all duration-300",
                    open && "top-1/2 rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-px w-full bg-fg transition-all duration-300",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full bg-fg transition-all duration-300",
                    open && "bottom-1/2 -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-1 flex-col justify-center gap-1 px-8 pt-16">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNav(e, l.href)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.06 * i }}
                  className="group flex items-center gap-5 border-b border-ink/[0.08] py-5"
                >
                  <span className="font-mono text-xs text-gold/60">0{i + 1}</span>
                  <span className="font-display text-3xl font-medium tracking-tight text-fg transition-colors duration-300 group-hover:text-gold">
                    {l.label}
                  </span>
                </motion.a>
              ))}
            </div>
            <div className="px-8 pb-12">
              <a
                href="mailto:hello@raiqen.ai"
                className="font-mono text-sm text-mute transition-colors hover:text-gold"
              >
                hello@raiqen.ai
              </a>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em] text-mute/50">
                Intelligence. Engineered for Business.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
