import styles from "./DifferentialCard.module.scss";

type DifferentialCardProps = {
  description: string;
  index: string;
  title: string;
};

export function DifferentialCard({ description, index, title }: DifferentialCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.index}>{index}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
