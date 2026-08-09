"use client";

import { useState } from "react";
import { Container } from "@mui/material";
import { Link } from "@/i18n/navigation";
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
  key: string;
  toggleLabel: string;
  eyebrow: string;
  title: string;
  sub: string;
  features: { icon: string; title: string; desc: string }[];
  codeNote: string;
}

// Code panels stay untranslated — code is code in either locale.
const CODE: Record<string, { file: string; lines: CodeLine[]; tools: string[] }> = {
  analytics: {
    file: "verkoop_pipeline.py",
    lines: [
      { t: [["cmt", "# verkoop_pipeline.py"]] },
      { t: [["key", "def"], ["punc", " verwerk(bron: Path) -> Laadrapport:"]] },
      { t: [["punc", "    df = extract(bron)"]] },
      { t: [["punc", "    df = valideer(df, schema=VerkoopSchema)"]], added: true },
      { t: [["punc", "    df = transformeer(df, model="], ["str", '"ster_schema"'], ["punc", ")"]] },
      { t: [["punc", "    kwaliteit.rapporteer(df, bron)"]], added: true },
      { t: [["key", "    return"], ["punc", " laad(df, tabel="], ["str", '"feit_verkoop"'], ["punc", ","]] },
      { t: [["punc", "        strategie="], ["str", '"upsert"'], ["punc", ")"]], added: true },
    ],
    tools: ["Python", "SQL", "pandas", "PostgreSQL", "Power BI", "Docker"],
  },
  ai: {
    file: "kennisbot_retrieval.py",
    lines: [
      { t: [["cmt", "# kennisbot_retrieval.py"]] },
      { t: [["key", "def"], ["punc", " beantwoord(vraag: "], ["str", "str"], ["punc", ") -> Antwoord:"]] },
      { t: [["punc", "    docs = vectorindex.search(vraag, k="], ["str", "8"], ["punc", ")"]] },
      { t: [["punc", "    docs = reranker.rerank(vraag, docs)"]], added: true },
      { t: [["punc", "    resultaat = keten.invoke({"], ["str", '"vraag"'], ["punc", ": vraag, "], ["str", '"context"'], ["punc", ": docs})"]] },
      { t: [["punc", "    langfuse.trace(vraag, resultaat, docs)"]], added: true },
      { t: [["key", "    return"], ["punc", " Antwoord(tekst=resultaat,"]] },
      { t: [["punc", "        bronnen=[d.bron "], ["key", "for"], ["punc", " d "], ["key", "in"], ["punc", " docs])"]], added: true },
    ],
    tools: ["Python", "LangChain", "LangGraph", "LangFuse", "Azure", "Databricks"],
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
  const code = CODE[v.key] ?? CODE.ai;

  return (
    <section className={styles.section}>
      <Container className={styles.inner}>
        {/* Eyebrow shares this row so the toggle lines up with it. It reads the
            same for every variant, so it stays put while the columns swap. */}
        <div className={styles.topRow}>
          <span className={styles.eyebrow}>{v.eyebrow}</span>
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
        </div>

        <div className={styles.grid} key={v.key}>
          <div className={styles.colFade}>
            <h2 className={styles.title}>{v.title}</h2>
            <p className={styles.sub}>{v.sub}</p>
            <div className={styles.features}>
              {v.features.map((f) => (
                <div className={styles.feature} key={f.title}>
                  <div className={styles.featureIcon}>{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link className={styles.allLink} href="/projects">
              {allProjectsLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={styles.colFade}>
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
