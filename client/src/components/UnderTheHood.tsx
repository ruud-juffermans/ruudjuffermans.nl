"use client";

import { useState, type ReactNode } from "react";
import { Container } from "@mui/material";
import { Link } from "@/i18n/navigation";
import SplitText from "./SplitText";
import styles from "./UnderTheHood.module.css";

type Tok = [cls: keyof typeof TOK_CLASS, txt: string];
type CodeLine = { t: Tok[]; added?: boolean };

const TOK_CLASS = {
  key: "tokKey",
  str: "tokStr",
  cmt: "tokCmt",
  punc: "tokPunc",
} as const;

export interface HoodVariant {
  /** Project slug — also selects the code panel and the project-page link. */
  key: string;
  toggleLabel: string;
  eyebrow: string;
  title: string;
  sub: string;
  features: { icon: ReactNode; title: string; desc: string }[];
  codeNote: string;
  /** External repository URL. */
  github: string;
  githubLabel: string;
  projectLabel: string;
  /** Running deployment, when the project has one. */
  live?: string;
  liveLabel?: string;
}

// Code panels stay untranslated — code is code in either locale. Keyed by
// project slug; each panel is the kind of question the project's model answers.
const CODE: Record<string, { file: string; lines: CodeLine[]; tools: string[] }> = {
  "open-data-warehouse": {
    file: "top_gebreken.sql",
    lines: [
      { t: [["cmt", "-- grain: één geconstateerd gebrek per keuring per voertuig"]], added: true },
      { t: [["key", "select"], ["punc", " v.voertuigsoort, g.omschrijving,"]] },
      { t: [["punc", "    count(*) "], ["key", "as"], ["punc", " aantal_gebreken"]], added: true },
      { t: [["key", "from"], ["punc", " fct_gebrek_constatering f"]] },
      { t: [["key", "join"], ["punc", " dim_voertuig v "], ["key", "using"], ["punc", " (voertuig_key)"]] },
      { t: [["key", "join"], ["punc", " dim_gebrek g "], ["key", "using"], ["punc", " (gebrek_key)"]] },
      { t: [["key", "group by"], ["punc", " "], ["str", "1, 2"]] },
      { t: [["cmt", "-- count(*) volstaat: de grain is getest, niets telt dubbel"]], added: true },
    ],
    tools: ["SQL", "dbt", "DuckDB", "Power BI", "DAX"],
  },
  "ov-streaming-pipeline": {
    file: "vertraging_per_lijn.sql",
    lines: [
      { t: [["cmt", "-- één rij per venster van vijf minuten, per dimensie"]], added: true },
      { t: [["cmt", "-- sleutel: (window_start, dimension, dimension_id)"]], added: true },
      { t: [["key", "select"], ["punc", " *"]] },
      { t: [["key", "from"], ["punc", " delay_aggregates"]] },
      { t: [["key", "where"], ["punc", " dimension = "], ["str", "'line'"]], added: true },
      { t: [["key", "  and"], ["punc", " window_start >= now() - "], ["key", "interval"], ["punc", " "], ["str", "'1 hour'"]] },
      { t: [["key", "order by"], ["punc", " window_start "], ["key", "desc"]] },
    ],
    tools: ["SQL", "PostgreSQL", "Streamlit", "Grafana", "Python"],
  },
};

export default function UnderTheHood({
  variants,
  allProjectsLabel,
}: {
  variants: HoodVariant[];
  allProjectsLabel: string;
}) {
  const [active, setActive] = useState(0);
  const v = variants[active];
  if (!v) return null;
  const code = CODE[v.key] ?? CODE["open-data-warehouse"];

  return (
    <section className={styles.section}>
      <Container className={styles.inner}>
        {/* Eyebrow shares this row so the toggle lines up with it. It reads the
            same for every variant, so it stays put while the columns swap. */}
        <div className={styles.topRow}>
          <span className={styles.eyebrow}>{v.eyebrow}</span>
          {/* Toggle with the all-projects link tucked under it, right-aligned. */}
          <div className={styles.topRight}>
            <div className={styles.toggle} role="group">
              {variants.map((variant, i) => (
                <button
                  key={variant.key}
                  type="button"
                  className={`${styles.toggleBtn} ${i === active ? styles.toggleBtnActive : ""}`}
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                >
                  {variant.toggleLabel}
                </button>
              ))}
            </div>
            <Link className={`${styles.allLink} ${styles.allLinkQuiet}`} href="/projects">
              {allProjectsLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className={styles.grid} key={v.key}>
          <div className={styles.colFade}>
            <h2 className={styles.title}>
              <SplitText text={v.title} />
            </h2>
            <p className={styles.sub}>{v.sub}</p>
            <div className={styles.features}>
              {v.features.map((f) => (
                <div className={styles.feature} key={f.title}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Per-project links: the write-up on this site, and the repo
                itself — the code is the proof. */}
            <div className={styles.linkRow}>
              <Link
                className={styles.allLink}
                href={{ pathname: "/projects/[slug]", params: { slug: v.key } }}
              >
                {v.projectLabel} <span aria-hidden="true">→</span>
              </Link>
              <a className={styles.allLink} href={v.github} target="_blank" rel="noreferrer">
                {v.githubLabel} <span aria-hidden="true">→</span>
              </a>
              {v.live && v.liveLabel ? (
                <a className={styles.allLink} href={v.live} target="_blank" rel="noreferrer">
                  {v.liveLabel} <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Code panel — desktop only; on mobile the section is the text
              column and the links. */}
          <div className={`${styles.colFade} ${styles.codeCol}`}>
            <div className={styles.panelWrap}>
              <div className={styles.panel}>
                <div className={styles.head}>
                  <span className={styles.headTab}>{code.file}</span>
                  <span>· {v.codeNote}</span>
                </div>
                <div className={styles.body}>
                  {code.lines.map((line, i) => (
                    <code
                      className={`${styles.line} ${line.added ? styles.added : ""}`}
                      style={{ "--i": i } as React.CSSProperties}
                      key={i}
                    >
                      {line.added ? "+ " : "  "}
                      {line.t.map(([cls, txt], j) => (
                        <span className={styles[TOK_CLASS[cls]]} key={j}>
                          {txt}
                        </span>
                      ))}
                    </code>
                  ))}
                </div>
                <div className={styles.tools}>
                  {code.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
