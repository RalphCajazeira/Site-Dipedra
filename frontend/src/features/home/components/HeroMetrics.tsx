import type { HeroMetric } from "@/shared/config/site";

import styles from "./HeroMetrics.module.scss";

type HeroMetricsProps = {
  metrics: HeroMetric[];
};

export function HeroMetrics({ metrics }: HeroMetricsProps) {
  return (
    <dl className={styles.metrics} aria-label="Indicadores institucionais">
      {metrics.map((metric) => (
        <div key={metric.label} className={styles.metric}>
          <dt className={styles.value}>{metric.value}</dt>
          <dd className={styles.label}>{metric.label}</dd>
          <dd className={styles.caption}>{metric.caption}</dd>
        </div>
      ))}
    </dl>
  );
}
