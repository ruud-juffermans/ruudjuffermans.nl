"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroCircles.module.css";

// Decorative circle pattern for the hero. The ambient pulse runs in CSS;
// moving the mouse within the hero morphs amplitude/scale, leaving restores
// the animation. Interaction is bound to the parent element so the overlay
// itself can stay pointer-events: none.
export default function HeroCircles() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = ref.current?.parentElement;
    if (!ref.current || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Centered mobile variant (and touch devices in general) stays ambient —
    // no mouse morphing there.
    if (window.matchMedia("(hover: none), (max-width: 899px)").matches) return;

    const circles = Array.from(
      ref.current.querySelectorAll<HTMLElement>(`.${styles.circle}`)
    );

    const morph = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const percentX = (e.clientX - rect.left) / rect.width;
      const percentY = (e.clientY - rect.top) / rect.height;
      for (const el of circles) {
        el.style.animation = "none";
        el.style.setProperty("--amplitude", `${300 * percentX}px`);
        el.style.setProperty("--scale", `${1 + 4 * percentY}`);
      }
    };

    const reset = () => {
      for (const el of circles) el.removeAttribute("style");
    };

    hero.addEventListener("mousemove", morph);
    hero.addEventListener("mouseleave", reset);
    return () => {
      hero.removeEventListener("mousemove", morph);
      hero.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div ref={ref} className={styles.pattern} aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={styles.circle} />
      ))}
    </div>
  );
}
