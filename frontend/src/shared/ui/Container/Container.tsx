import type { HTMLAttributes } from "react";

import styles from "./Container.module.scss";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  const classes = [styles.container, className].filter(Boolean).join(" ");

  return <div className={classes} {...props} />;
}
