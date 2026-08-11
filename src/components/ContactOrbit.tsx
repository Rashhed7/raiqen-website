"use client";

import { useEffect, useRef } from "react";

/**
 * Calm connection/orbit system for the Contact section.
 * A central node with four stage nodes (Idea → Conversation →
 * Intelligence → Solution) drifting on elliptical orbits, connected by
 * thin lines, with a gentle parallax response to the cursor.
 * Canvas 2D for performance; disables itself under reduced motion.
 */
export default function ContactOrbit({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const N = 4;
    const nodes = Array.from({ length: N }, (_, i) => ({
      base: (i / N) * Math.PI * 2,
      rx: 0.74 + (i % 2) * 0.05,
      ry: 0.66 + (i % 3) * 0.04,
      speed: 0.00009 + (i % 2) * 0.00002,
      size: 3.1 + (i % 3) * 0.8,
      phase: i * 1.9,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - (r.left + r.width / 2)) / r.width;
      mouse.ty = (e.clientY - (r.top + r.height / 2)) / r.height;
    };

    const tick = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.035;
      mouse.y += (mouse.ty - mouse.y) * 0.035;
      const cx = w / 2 + mouse.x * 14;
      const cy = h / 2 + mouse.y * 14;
      const rx = w * 0.36;
      const ry = h * 0.32;

      ctx.clearRect(0, 0, w, h);

      // faint orbital paths
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * n.rx, ry * n.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(245,245,245,0.045)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const pos = nodes.map((n) => {
        const ang = n.base + t * n.speed;
        return {
          x: cx + Math.cos(ang) * rx * n.rx,
          y: cy + Math.sin(ang) * ry * n.ry,
          n,
        };
      });

      // center → stage lines
      for (let i = 0; i < pos.length; i++) {
        const p = pos[i];
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(227,180,108,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // neighbour ring
      for (let i = 0; i < pos.length; i++) {
        const a = pos[i];
        const b = pos[(i + 1) % pos.length];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(245,245,245,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // central glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 74);
      glow.addColorStop(0, "rgba(227,180,108,0.18)");
      glow.addColorStop(1, "rgba(227,180,108,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 74, 0, Math.PI * 2);
      ctx.fill();

      // core
      const cs = 5 + Math.sin(t * 0.0014) * 1.1;
      ctx.beginPath();
      ctx.arc(cx, cy, cs, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(227,180,108,0.9)";
      ctx.fill();

      // stage nodes
      for (let i = 0; i < pos.length; i++) {
        const p = pos[i];
        const s = p.n.size + Math.sin(t * 0.001 + p.n.phase) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx.fillStyle =
          i === 1 ? "rgba(227,180,108,0.55)" : "rgba(245,245,245,0.3)";
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      role="presentation"
    />
  );
}
