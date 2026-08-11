import { ArrowRight } from "./icons";
import BrandMark from "./BrandMark";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 text-fg"
              data-cursor="link"
            >
              <BrandMark />
              <span className="font-display text-[16px] font-semibold tracking-[0.34em]">
                RAIQEN
              </span>
            </a>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-mute">
              Intelligence. Engineered for Business.
            </p>
            <a
              href="https://raiqen.ai"
              className="mt-7 inline-flex items-center gap-2 font-mono text-[13px] text-gold/80 transition-colors hover:text-gold"
              data-cursor="link"
            >
              raiqen.ai
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.35em] text-mute/50">
              Navigate
            </h3>
            <ul className="mt-6 space-y-3.5">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[14px] text-mute transition-colors duration-300 hover:text-gold"
                    data-cursor="link"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.35em] text-mute/50">
              Connect
            </h3>
            <ul className="mt-6 space-y-3.5">
              <li>
                <a
                  href="mailto:hello@raiqen.ai"
                  className="text-[14px] text-mute transition-colors duration-300 hover:text-gold"
                  data-cursor="link"
                >
                  hello@raiqen.ai
                </a>
              </li>
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-mute transition-colors duration-300 hover:text-gold"
                    data-cursor="link"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.05] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute/50">
            © 2026 RAIQEN. All rights reserved.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute/50">
            Intelligence. Engineered for Business.
          </p>
        </div>
      </div>
    </footer>
  );
}
