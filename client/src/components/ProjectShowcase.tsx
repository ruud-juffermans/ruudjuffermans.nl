"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/lib/content";
import styles from "./ProjectShowcase.module.css";

const ROTATE_MS = 8000;

// Tabbed project showcase: tabs on the left, detail panel on the right.
// Rotates to the next project every ROTATE_MS; hover, keyboard focus and
// touch all pause the rotation, picking a tab stops it for good, and
// prefers-reduced-motion disables it entirely (WCAG 2.2.2), and the detail
// panel re-animates on every switch via key.
export default function ProjectShowcase({
  projects,
  viewCaseLabel,
  tabsLabel,
}: {
  projects: ProjectMeta[];
  viewCaseLabel: string;
  /** Accessible name for the tab group, e.g. "Projecten". */
  tabsLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || projects.length < 2) return;
    const id = setTimeout(
      () => setActive((a) => (a + 1) % projects.length),
      ROTATE_MS
    );
    return () => clearTimeout(id);
  }, [active, paused, reducedMotion, projects.length]);

  const project = projects[active];
  if (!project) return null;

  return (
    <div
      className={styles.layout}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        // Only resume when focus leaves the whole layout, not between tabs.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      onTouchStart={() => setPaused(true)}
    >
      <div className={styles.tabs} role="group" aria-label={tabsLabel}>
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
            aria-pressed={i === active}
            onClick={() => {
              setActive(i);
              // A manual choice shouldn't be rotated away from.
              setPaused(true);
            }}
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
                href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }}
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
