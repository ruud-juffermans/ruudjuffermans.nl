"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FlowLines.module.css";

// One tile of the artwork, in SVG user units. The paths are drawn so the tile
// stacks seamlessly: every line leaves the bottom edge at roughly the x it
// enters the top edge, so repeating the group reads as one continuous flow.
const TILE_W = 740;
const TILE_H = 2000;

// How many pixels the dash pattern travels per pixel scrolled. Higher = the
// light dots race further along the lines for the same scroll distance.
const FLOW_RATE = 1.15;

// Delay, in pixels of scroll. The flow would otherwise begin the moment the
// layer's top edge reaches the bottom of the viewport; this holds the dots
// still until the section has scrolled this much further up.
const FLOW_DELAY = 100;

const PATHS = [
  "m 106,45h 375c 114,0 226,128 226,235v 236c 0,136 -122,222 -224,221l -182,-2c -89,1 -141,42 -142,158l -2,204c -1,117 37,173 134,173h 186c 110,-3 230,111 230,220v 242c 0,113 -125,225 -248,225H 105",
  "m 33,85h 444c 96,0 190,107 190,201v 224c 0,116 -98,188 -190,187l -192,-2c -92,0 -166,75 -166,168v 278c 0,94 74,169 166,169h 194c 92,0 188,94 188,188v 228c 0,94 -104,191 -214,191H 105",
  "m 155,127h 308c 94,0 162,86 162,177v 178c 0,109 -50,174 -166,173L 277,653C 158,653 77,762 77,849v 302c 0,118 107,196 180,197l 204,4c 92,0 164,67 164,160v 200c 0,91 -89,163 -188,163H 105",
  "m 283,173c 2,0 165,0 165,0C 544,175 577,238 577,330v 156c 0,94 -48,126 -140,125L 269,609C 167,602 29,702 29,851v 312c 0,111 101,235 242,235h 162c 109,1 144,49 144,136v 162c 0,73 -53,130 -118,130l -353,1",
];

// Scroll-driven backdrop of flowing dashed lines. Renders as an absolutely
// positioned layer that fills its (relatively positioned) parent, so it spans
// exactly the sections the parent wraps. Per-section visibility is not handled
// here — sections dial it with their own translucent background.
export default function FlowLines() {
  const ref = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState(1);

  // Repeat the tile enough times to cover however tall the wrapped sections are.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setTiles(Math.max(1, Math.ceil(el.offsetHeight / TILE_H)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Advance the dash offset with scroll position, rAF-throttled.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Pixels scrolled since the layer's top entered the viewport bottom,
      // minus the delay — negative values are clamped away below.
      const travelled =
        window.innerHeight - FLOW_DELAY - el.getBoundingClientRect().top;
      el.style.setProperty(
        "--flow-offset",
        String(-Math.max(0, travelled) * FLOW_RATE)
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.layer} ref={ref} aria-hidden="true">
      <svg
        className={styles.svg}
        width={TILE_W}
        height={TILE_H * tiles}
        viewBox={`0 0 ${TILE_W} ${TILE_H * tiles}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="flowLinesStroke"
            gradientUnits="objectBoundingBox"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="var(--app-red-light)" />
            <stop offset="45%" stopColor="var(--app-red)" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        {Array.from({ length: tiles }, (_, tile) => (
          <g key={tile} transform={`translate(0 ${tile * TILE_H})`}>
            {PATHS.map((d, i) => (
              <path key={i} d={d} data-line={i + 1} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
