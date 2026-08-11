"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const FINE_POINTER = "(pointer: fine)";

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(FINE_POINTER);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(FINE_POINTER).matches;
const getServerSnapshot = () => false;

/** Minimal custom cursor — dot + lagging ring. Desktop (fine pointer) only. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  // Hydration-safe: renders nothing on the server, enables after mount.
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("cursor-none-active");

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let seen = false;
    let hovering = false;
    let pressed = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!seen) {
        seen = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      hovering = !!t?.closest("a, button, [data-cursor], input, textarea, canvas");
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) {
        const scale = hovering ? 1.6 : pressed ? 0.75 : 1;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.dataset.hover = String(hovering);
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none-active");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot opacity-0" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring opacity-0" aria-hidden="true" />
    </>
  );
}
