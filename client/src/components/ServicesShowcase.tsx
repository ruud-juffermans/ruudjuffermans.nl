"use client";

import { useState, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import SplitText from "./SplitText";
import styles from "./ServicesShowcase.module.css";

const CYCLE = "5s";

export interface FlowData {
  sources: [string, string, string];
  hub: { label: string; title: string };
  outputs: [{ label: string; title: string }, { label: string; title: string }];
}

export interface ServiceItem {
  key: string;
  icon: ReactNode;
  title: string;
  learnMore: string;
  flow: FlowData;
}

// Pulse travelling along a wire during the first leg of the cycle
// (sources → hub).
function PulseIn({ wireId }: { wireId: string }) {
  return (
    <circle className={styles.flowPulse} r="4" opacity="0">
      <animateMotion
        dur={CYCLE}
        repeatCount="indefinite"
        calcMode="linear"
        keyPoints="0;1;1"
        keyTimes="0;0.24;1"
      >
        <mpath href={`#${wireId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        dur={CYCLE}
        repeatCount="indefinite"
        values="0;1;1;0;0"
        keyTimes="0;0.01;0.22;0.25;1"
      />
    </circle>
  );
}

// Pulse travelling during the second leg (hub → both outputs).
function PulseOut({ wireId }: { wireId: string }) {
  return (
    <circle className={styles.flowPulse} r="4" opacity="0">
      <animateMotion
        dur={CYCLE}
        repeatCount="indefinite"
        calcMode="linear"
        keyPoints="0;0;1;1"
        keyTimes="0;0.48;0.72;1"
      >
        <mpath href={`#${wireId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        dur={CYCLE}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes="0;0.48;0.49;0.7;0.73;1"
      />
    </circle>
  );
}

const WIRES_IN = [
  { suffix: "w1", d: "M140 57 C170 57 172 140 200 140" },
  { suffix: "w2", d: "M140 170 C170 170 172 170 200 170" },
  { suffix: "w3", d: "M140 283 C170 283 172 200 200 200" },
];

// One hub port fans out to two destinations: the 1-to-2 split.
const WIRES_OUT = [
  { suffix: "w4", d: "M360 170 C386 170 388 100 415 100" },
  { suffix: "w5", d: "M360 170 C386 170 388 240 415 240" },
];

const SRC_Y = [30, 143, 256];

function FlowDiagram({ flow, idPrefix }: { flow: FlowData; idPrefix: string }) {
  const wireId = (suffix: string) => `${idPrefix}-${suffix}`;
  return (
    <div className={styles.flowVisual} aria-hidden="true">
      <svg viewBox="0 0 560 340" role="img">
        {[...WIRES_IN, ...WIRES_OUT].map((w) => (
          <path key={w.suffix} id={wireId(w.suffix)} className={styles.flowWire} d={w.d} />
        ))}

        {WIRES_IN.map((w) => (
          <path
            key={`${w.suffix}-lit`}
            className={`${styles.flowWireLit} ${styles.flowIn}`}
            pathLength={1}
            d={w.d}
          />
        ))}
        {WIRES_OUT.map((w) => (
          <path
            key={`${w.suffix}-lit`}
            className={`${styles.flowWireLit} ${styles.flowOut}`}
            pathLength={1}
            d={w.d}
          />
        ))}

        {flow.sources.map((title, i) => (
          <g className={styles.flowNode} key={title}>
            <rect x="10" y={SRC_Y[i]} width="130" height="54" rx="10" />
            <text className={styles.flowTitle} x="75" y={SRC_Y[i] + 32} textAnchor="middle">
              {title}
            </text>
            <circle className={styles.flowPort} cx="140" cy={SRC_Y[i] + 27} r="3.5" />
          </g>
        ))}

        <g className={`${styles.flowNode} ${styles.flowNodeMid}`}>
          <rect x="200" y="122" width="160" height="96" rx="12" />
          <text className={styles.flowLabel} x="280" y="160" textAnchor="middle">
            {flow.hub.label}
          </text>
          <text
            className={`${styles.flowTitle} ${styles.flowTitleLg}`}
            x="280"
            y="184"
            textAnchor="middle"
          >
            {flow.hub.title}
          </text>
          <circle className={styles.flowPort} cx="200" cy="140" r="3.5" />
          <circle className={styles.flowPort} cx="200" cy="170" r="3.5" />
          <circle className={styles.flowPort} cx="200" cy="200" r="3.5" />
          <circle className={styles.flowPort} cx="360" cy="170" r="3.5" />
        </g>

        {flow.outputs.map((out, i) => (
          <g className={`${styles.flowNode} ${styles.flowNodeOut}`} key={out.title}>
            <rect x="415" y={i === 0 ? 71 : 211} width="135" height="58" rx="10" />
            <text className={styles.flowLabel} x="482" y={i === 0 ? 94 : 234} textAnchor="middle">
              {out.label}
            </text>
            <text className={styles.flowTitle} x="482" y={i === 0 ? 114 : 254} textAnchor="middle">
              {out.title}
            </text>
            <circle className={styles.flowPort} cx="415" cy={i === 0 ? 100 : 240} r="3.5" />
          </g>
        ))}

        {WIRES_IN.map((w) => (
          <PulseIn key={`${w.suffix}-pulse`} wireId={wireId(w.suffix)} />
        ))}
        {WIRES_OUT.map((w) => (
          <PulseOut key={`${w.suffix}-pulse`} wireId={wireId(w.suffix)} />
        ))}
      </svg>
    </div>
  );
}

// "Van kennis naar antwoord"-style section: copy left, living diagram right.
// The two services toggle as pills under the intro text.
export default function ServicesShowcase({
  eyebrow,
  title,
  subtitle,
  services,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  services: ServiceItem[];
}) {
  const [active, setActive] = useState(0);
  const current = services[active];
  if (!current) return null;

  return (
    <div className={styles.layout}>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.title}>
          <SplitText text={title} />
        </h2>
        <p className={styles.sub}>{subtitle}</p>

        <div className={styles.pills} role="group">
          {services.map((service, i) => (
            <button
              key={service.key}
              type="button"
              className={`${styles.pill} ${i === active ? styles.pillActive : ""}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <span className={styles.pillIcon}>{service.icon}</span>
              {service.title}
            </button>
          ))}
        </div>

        <Link className={styles.cta} href="/services" key={current.key}>
          {current.learnMore} <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.flowCol} key={`flow-${current.key}`}>
        <FlowDiagram flow={current.flow} idPrefix={`svcflow-${current.key}`} />
      </div>
    </div>
  );
}
