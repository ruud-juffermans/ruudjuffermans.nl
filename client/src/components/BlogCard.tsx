import { Link } from "@/i18n/navigation";
import type { PostMeta } from "@/lib/content";
import styles from "./BlogCard.module.css";

// Abstract thumbnail art per card, in the site palette. Colors are absolute
// (like the navy CTA panel) so the artwork is identical in both schemes.
const NAVY = "#0B1120";
const NAVY_LIGHT = "#131B2E";
const RED = "#2563eb";
const RED_SOFT = "#60a5fa";
const PINK = "#a6c8f7";
const PINK_PALE = "#e0ecfd";

function ThumbArt({ variant }: { variant: number }) {
  const art = [
    {
      bg: `linear-gradient(135deg, ${NAVY}, ${RED} 130%)`,
      svg: (
        <>
          <circle cx="230" cy="80" r="46" fill={PINK} opacity="0.35" />
          <circle cx="230" cy="80" r="28" fill={PINK_PALE} opacity="0.6" />
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${NAVY}, ${NAVY_LIGHT})`,
      svg: (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={40 + i * 46}
              y={120 - i * 18}
              width="26"
              height={20 + i * 18}
              rx="4"
              fill={i === 4 ? RED_SOFT : "#2a3348"}
            />
          ))}
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${PINK_PALE}, ${PINK})`,
      svg: (
        <>
          <path
            d="M40 120 C 100 40, 200 40, 260 120"
            stroke={NAVY}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="260" cy="120" r="10" fill={NAVY} />
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${NAVY}, #1d1530)`,
      svg: (
        <>
          <path
            d="M50 80 H 120 M 150 50 H 220 M 150 110 H 220 M 120 80 C 135 80, 135 50, 150 50 M 120 80 C 135 80, 135 110, 150 110"
            stroke={RED_SOFT}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="50" cy="80" r="10" fill={PINK} />
          <circle cx="220" cy="50" r="10" fill={PINK_PALE} />
          <circle cx="220" cy="110" r="10" fill={RED_SOFT} />
          <circle cx="250" cy="50" r="4" fill={PINK_PALE} opacity="0.5" />
          <circle cx="250" cy="110" r="4" fill={RED_SOFT} opacity="0.5" />
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${PINK_PALE}, ${PINK})`,
      svg: (
        <>
          <ellipse cx="150" cy="46" rx="58" ry="16" fill={NAVY} />
          <path d="M92 46 V 82 A 58 16 0 0 0 208 82 V 46" fill={NAVY} opacity="0.85" />
          <path d="M92 82 V 118 A 58 16 0 0 0 208 118 V 82" fill={NAVY} opacity="0.65" />
          <ellipse cx="150" cy="82" rx="58" ry="16" fill="none" stroke={PINK_PALE} strokeWidth="3" />
          <ellipse cx="150" cy="118" rx="58" ry="16" fill="none" stroke={PINK_PALE} strokeWidth="3" />
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${NAVY}, ${NAVY_LIGHT})`,
      svg: (
        <>
          {[0, 1, 2, 3, 4, 5, 6].map((col) =>
            [0, 1, 2, 3].map((row) => (
              <circle
                key={`${col}-${row}`}
                cx={54 + col * 32}
                cy={32 + row * 32}
                r="5"
                fill={col === row + 1 ? RED_SOFT : "#2a3348"}
              />
            ))
          )}
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${PINK}, ${RED_SOFT})`,
      svg: (
        <>
          <path
            d="M30 125 L 90 95 L 150 105 L 210 55 L 270 40 V 160 H 30 Z"
            fill={NAVY}
            opacity="0.15"
          />
          <path
            d="M30 125 L 90 95 L 150 105 L 210 55 L 270 40"
            stroke={NAVY}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="210" cy="55" r="8" fill={PINK_PALE} stroke={NAVY} strokeWidth="4" />
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${NAVY}, ${RED})`,
      svg: (
        <>
          {[70, 52, 34].map((r, i) => (
            <path
              key={r}
              d={`M ${150 - r} 130 A ${r} ${r} 0 0 1 ${150 + r} 130`}
              stroke={[PINK, PINK_PALE, RED_SOFT][i]}
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              opacity={0.45 + i * 0.25}
            />
          ))}
          <circle cx="150" cy="130" r="9" fill={PINK_PALE} />
        </>
      ),
    },
    {
      bg: `linear-gradient(135deg, ${RED_SOFT}, ${PINK})`,
      svg: (
        <>
          <rect x="48" y="34" width="60" height="40" rx="8" fill={NAVY} />
          <rect x="126" y="60" width="60" height="40" rx="8" fill={NAVY} opacity="0.75" />
          <rect x="204" y="86" width="60" height="40" rx="8" fill={NAVY} opacity="0.5" />
          <path
            d="M108 54 H 126 M 186 80 H 204"
            stroke={NAVY}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      ),
    },
  ];
  const { bg, svg } = art[((variant % art.length) + art.length) % art.length];
  return (
    <div className={styles.thumbArt} style={{ background: bg }}>
      <svg viewBox="0 0 300 160" aria-hidden="true">{svg}</svg>
    </div>
  );
}

// Stable per-slug variant so a post keeps its artwork across builds.
function variantFor(slug: string) {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export default function BlogCard({
  post,
  meta,
}: {
  post: PostMeta;
  meta?: string;
}) {
  return (
    <Link
      className={styles.card}
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
    >
      <div className={styles.thumb}>
        <ThumbArt variant={variantFor(post.slug)} />
      </div>
      <div className={styles.body}>
        <span className={styles.tag}>{post.tags[0]}</span>
        <h4 className={styles.title}>{post.title}</h4>
        <div className={styles.date}>{meta ?? post.date}</div>
      </div>
    </Link>
  );
}
