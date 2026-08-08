"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { PortfolioMeta } from "@/lib/content";
import styles from "./ProjectShowcase.module.css";

const ROTATE_MS = 8000;

// Tabbed project showcase: tabs on the left, detail panel on the right.
// Rotates to the next project every ROTATE_MS; hovering the layout pauses
// the rotation, and the detail panel re-animates on every switch via key.
export default function ProjectShowcase({
  projects,
  viewCaseLabel,
}: {
  projects: PortfolioMeta[];
  viewCaseLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || projects.length < 2) return;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % projects.length),
      ROTATE_MS
    );
    return () => clearTimeout(id);
  }, [active, paused, projects.length]);

  const project = projects[active];
  if (!project) return null;

  return (
    <div
      className={styles.layout}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.tabs}>
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.tabInner}>
              <span className={styles.tabLabel}>{p.industry}</span>
              <span className={styles.tabTitle}>{p.title}</span>
            </span>
          </button>
        ))}
      </div>

      <div className={styles.detail}>
        <div className={styles.detailCard}>
          <div className={styles.detailInner} key={active}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <div className={styles.projectMeta}>{project.industry}</div>
            <p className={styles.desc}>{project.summary}</p>
            <div className={styles.stack}>
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className={styles.footer}>
              <span className={styles.duration}>{project.duration}</span>
              <Link
                className={styles.link}
                href={{ pathname: "/portfolio/[slug]", params: { slug: project.slug } }}
              >
                {viewCaseLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
