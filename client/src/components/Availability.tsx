"use client";

import { useLocale, useTranslations } from "next-intl";
import styles from "./Availability.module.css";

// Availability is never maintained by hand: the badge always shows the
// current month as the start moment. Prerendered HTML can carry an older
// month, hence suppressHydrationWarning on the text.
export default function Availability({ variant }: { variant: "hero" | "footer" }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const month = new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date());

  return (
    <span className={variant === "hero" ? styles.badge : styles.status}>
        {variant === "hero"
          ? t("availableHero", { month })
          : t("availableFrom", { month })}
        <span className={styles.dot} />
        <span suppressHydrationWarning>
      </span>
    </span>
  );
}
