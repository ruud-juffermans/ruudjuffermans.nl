"use client";

import { useId } from "react";

// The platform mark — the R tile from brand/ruudjuffermans.svg, inlined so it
// renders without a network request and can be sized via props. Gradient ids
// are namespaced with useId so multiple instances (header + drawer) don't clash.
export default function Logo({ size = 26 }: { size?: number }) {
  const id = useId();
  const g = `${id}-g`;
  const s = `${id}-s`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      aria-hidden
      focusable="false"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={g} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="512" y2="512">
          <stop offset="0" stopColor="#ef4d76" />
          <stop offset="1" stopColor="#b8244c" />
        </linearGradient>
        <linearGradient id={s} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="512">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.17" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="115" fill={`url(#${g})`} />
      <rect width="512" height="512" rx="115" fill={`url(#${s})`} />
      <path
        fill="#ffffff"
        d="M163.6 365.0V159.0H251.3Q268.5 159.0 282.5 161.7Q296.6 164.3 307.3 169.5Q318.1 174.6 325.6 182.0Q333.1 189.3 336.8 198.8Q340.6 208.3 340.6 219.9Q340.6 230.8 337.1 239.5Q333.7 248.3 326.7 254.8Q319.6 261.4 309.0 265.4Q298.4 269.5 284.4 271.4V276.0Q302.2 277.9 312.0 284.0Q321.8 290.1 327.1 300.1Q332.4 310.0 336.5 324.1L348.4 365.0H292.5L283.5 327.2Q280.6 314.7 275.8 307.9Q271.0 301.0 263.5 298.3Q256.0 295.7 244.8 295.7H213.9V365.0ZM213.9 258.6H247.9Q266.9 258.6 277.5 251.1Q288.1 243.6 288.1 227.7Q288.1 212.1 278.5 204.6Q268.8 197.1 249.1 197.1H213.9Z"
      />
    </svg>
  );
}
