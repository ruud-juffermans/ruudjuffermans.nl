"use client";

import { useState } from "react";
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
  features: { icon: string; title: string; desc: string }[];
  codeNote: string;
  /** External repository URL. */
  github: string;
  githubLabel: string;
  projectLabel: string;
}

// Code panels stay untranslated — code is code in either locale. Keyed by
// project slug; each panel echoes the real repo, not a generic snippet.
const CODE: Record<string, { file: string; lines: CodeLine[]; tools: string[] }> = {
  "open-data-warehouse": {
    file: "fct_gebreken.sql",
    lines: [
      { t: [["cmt", "-- grain: één rij per geconstateerd gebrek"]] },
      { t: [["key", "select"], ["punc", " k.voertuig_sk, d.datum_sk, g.gebrek_sk,"]] },
      { t: [["punc", "    count(*) "], ["key", "as"], ["punc", " aantal_gebreken"]] },
      { t: [["key", "from"], ["punc", " "], ["str", "{{ ref('stg_rdw__gebreken') }}"], ["punc", " g"]], added: true },
      { t: [["key", "join"], ["punc", " dim_voertuig k "], ["key", "using"], ["punc", " (kenteken)"]] },
      { t: [["key", "join"], ["punc", " dim_datum d "], ["key", "using"], ["punc", " (meld_datum)"]] },
      { t: [["key", "group by"], ["punc", " "], ["str", "1, 2, 3"]], added: true },
      { t: [["cmt", "-- dbt test: not_null + relationships op elke sk"]], added: true },
    ],
    tools: ["Python", "dbt", "DuckDB", "SQL", "GitHub Actions"],
  },
  "ov-streaming-pipeline": {
    file: "delay_aggregator.py",
    lines: [
      { t: [["cmt", "# delay_aggregator.py"]] },
      { t: [["key", "async def"], ["punc", " verwerk(stream: KafkaStream) -> "], ["str", "None"], ["punc", ":"]] },
      { t: [["key", "    async for"], ["punc", " positie "], ["key", "in"], ["punc", " stream.topic("], ["str", '"gtfs-rt"'], ["punc", "):"]] },
      { t: [["punc", "        venster = tumbling(positie, minuten="], ["str", "5"], ["punc", ")"]], added: true },
      { t: [["punc", "        vertraging = venster.mean(positie.delay)"]] },
      { t: [["punc", "        dode_brief.vang(positie, on_error=parse_fout)"]], added: true },
      { t: [["key", "        await"], ["punc", " publiceer(lijn=positie.lijn,"]] },
      { t: [["punc", "            station=positie.halte, p95=venster.p95)"]], added: true },
    ],
    tools: ["Python", "Kafka", "Redpanda", "Streamlit", "Docker"],
  },
  "uitspraak-rag": {
    file: "uitspraak_retrieval.py",
    lines: [
      { t: [["cmt", "# uitspraak_retrieval.py"]] },
      { t: [["key", "def"], ["punc", " beantwoord(vraag: "], ["str", "str"], ["punc", ") -> Antwoord:"]] },
      { t: [["punc", "    passages = vectorindex.search(vraag, k="], ["str", "8"], ["punc", ")"]] },
      { t: [["key", "    if not"], ["punc", " passages: "], ["key", "return"], ["punc", " GeenAntwoord()"]], added: true },
      { t: [["punc", "    resultaat = keten.invoke({"], ["str", '"vraag"'], ["punc", ": vraag, "], ["str", '"context"'], ["punc", ": passages})"]] },
      { t: [["punc", "    langfuse.trace(vraag, resultaat, passages)"]], added: true },
      { t: [["key", "    return"], ["punc", " Antwoord(tekst=resultaat,"]] },
      { t: [["punc", "        ecli=[p.ecli "], ["key", "for"], ["punc", " p "], ["key", "in"], ["punc", " passages])"]], added: true },
    ],
    tools: ["Python", "LangChain", "LangFuse", "pgvector", "Rechtspraak.nl"],
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
  const code = CODE[v.key] ?? CODE["uitspraak-rag"];

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
