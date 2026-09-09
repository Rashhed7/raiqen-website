"use client";

import { useEffect, useRef } from "react";

/** Slow rotating network of interconnected nodes. Pure canvas 2D. */
export default function NetworkVisual({ className }: { className?: string }) {
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
    const N = 12;
    const pts: { a: number; r: number; p: number; size: number }[] = [];
    for (let i = 0; i < N; i++) {
      pts.push({
        a: (i / N) * Math.PI * 2,
        r: 0.78 + Math.sin(i * 2.4) * 0.16,
        p: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 2.4,
      });
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const rx = w * 0.34;
      const ry = h * 0.3;

      const pos = pts.map((p) => {
        const ang = p.a + t * 0.00012;
        return {
          x: cx + Math.cos(ang) * rx * p.r,
          y: cy + Math.sin(ang) * ry * p.r,
          size: p.size + Math.sin(t * 0.001 + p.p) * 0.8,
          p,
        };
      });

      // ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 0.92, ry * 0.92, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(16,24,40,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // connections — center to node
      for (let i = 0; i < pos.length; i++) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pos[i].x, pos[i].y);
        ctx.strokeStyle = "rgba(169,123,47,0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // connections — neighbours
      for (let i = 0; i < pos.length; i++) {
        const a = pos[i];
        const b = pos[(i + 1) % pos.length];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(16,24,40,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // center core glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      glow.addColorStop(0, "rgba(169,123,47,0.22)");
      glow.addColorStop(1, "rgba(169,123,47,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fill();

      // nodes
      for (let i = 0; i < pos.length; i++) {
        const p = pos[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          i % 3 === 0 ? "rgba(169,123,47,0.65)" : "rgba(16,24,40,0.3)";
        ctx.fill();
      }
      // center node
      const cs = 5 + Math.sin(t * 0.0016) * 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, cs, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(169,123,47,0.9)";
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
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
