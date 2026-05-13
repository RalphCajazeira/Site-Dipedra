import type { HTMLAttributes } from "react";

import styles from "./SurfaceCard.module.scss";

type SurfaceCardProps = HTMLAttributes<HTMLElement>;

export function SurfaceCard({ className, ...props }: SurfaceCardProps) {
  const classes = [styles.card, className].filter(Boolean).join(" ");

  return <section className={classes} {...props} />;
}
