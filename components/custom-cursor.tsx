"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supportsFinePointer || prefersReducedMotion) {
      return;
    }

    const element = cursorRef.current;
    if (!element) return;

    const state = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      visible: false,
      active: false
    };

    let frame = 0;

    const render = () => {
      state.currentX += (state.targetX - state.currentX) * 0.18;
      state.currentY += (state.targetY - state.currentY) * 0.18;

      element.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0) translate(-50%, -50%) scale(${state.active ? 1.9 : 1})`;
      element.style.opacity = state.visible ? "1" : "0";
      element.style.borderColor = state.active ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.58)";
      element.style.boxShadow = state.active
        ? "0 0 0 1px rgba(255, 255, 255, 0.18), 0 0 42px rgba(255, 255, 255, 0.24)"
        : "0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 26px rgba(255, 255, 255, 0.16)";

      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      state.visible = true;

      if (event.target instanceof Element) {
        state.active = Boolean(
          event.target.closest("a, button, [role='button'], [data-cursor='hover']")
        );
      }
    };

    const onLeave = () => {
      state.visible = false;
      state.active = false;
    };

    document.documentElement.classList.add("cursor-hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-7 w-7 rounded-full border bg-white/10 md:block"
      style={{
        opacity: 0,
        willChange: "transform, opacity, box-shadow, border-color",
        backdropFilter: "blur(2px)"
      }}
    >
      <span className="absolute inset-[0.35rem] rounded-full bg-white" />
    </div>
  );
}
