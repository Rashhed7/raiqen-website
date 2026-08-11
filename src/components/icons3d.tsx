"use client";

/**
 * Abstract CSS-3D icons used inside cards. Pure transforms —
 * GPU friendly, no WebGL context cost.
 */

const S = 28; // half cube size
const FACES = [
  `rotateY(0deg) translateZ(${S}px)`,
  `rotateY(90deg) translateZ(${S}px)`,
  `rotateY(180deg) translateZ(${S}px)`,
  `rotateY(270deg) translateZ(${S}px)`,
  `rotateX(90deg) translateZ(${S}px)`,
  `rotateX(-90deg) translateZ(${S}px)`,
];

/** Spinning wireframe cube with a lit core. */
export function CoreIcon({ className }: { className?: string }) {
  return (
    <div
      className={`icon-3d relative h-14 w-14 [transform-style:preserve-3d] ${className ?? ""}`}
    >
      {FACES.map((t, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-[4px] border border-gold/45 bg-gold/[0.03] [backface-visibility:hidden]"
          style={{ transform: t }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_rgba(227,180,108,0.8)]" />
    </div>
  );
}

/** Floating layered system stack. */
export function StackIcon({ className }: { className?: string }) {
  return (
    <div className={`icon-bob ${className ?? ""}`}>
      <div className="relative h-16 w-16 [transform:rotateX(56deg)] [transform-style:preserve-3d]">
        <div className="absolute inset-x-0 bottom-0 h-11 rounded-lg border border-white/15 bg-panel2/80 [transform:translateZ(0px)]" />
        <div className="absolute inset-x-1.5 bottom-2 h-10 rounded-lg border border-white/20 bg-panel2/95 [transform:translateZ(9px)]" />
        <div className="absolute inset-x-3 bottom-4 h-9 rounded-lg border border-gold/45 bg-panel2 [transform:translateZ(18px)]" />
      </div>
    </div>
  );
}

/** Nodes joined by a connection line, rotating in 3D. */
export function FlowIcon({ className }: { className?: string }) {
  return (
    <div
      className={`icon-3d relative h-16 w-16 [transform-style:preserve-3d] ${className ?? ""}`}
    >
      <div className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-gold/60 bg-gold/10 [transform:translateZ(10px)]" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/80 [transform:translateZ(14px)]" />
      <div className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-gold/60 bg-gold/10 [transform:translateZ(10px)]" />
      <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-gold/10 via-gold/55 to-gold/10 [transform:translateZ(12px)]" />
    </div>
  );
}

/** Tilted orbital ring. */
export function RingIcon({ className }: { className?: string }) {
  return (
    <div
      className={`icon-3d-z relative h-16 w-16 [transform-style:preserve-3d] ${className ?? ""}`}
    >
      <div className="absolute inset-0 rounded-full border-2 border-gold/45 [transform:rotateX(66deg)]" />
      <div className="absolute inset-3 rounded-full border border-gold/25 [transform:rotateX(66deg) translateZ(6px)]" />
      <div className="absolute inset-6 rounded-full bg-gold/[0.06] [transform:rotateX(66deg)]" />
    </div>
  );
}
