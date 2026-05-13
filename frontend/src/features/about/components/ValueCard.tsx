import styles from "./ValueCard.module.scss";

type ValueCardProps = {
  index: string;
  title: string;
  description: string;
};

export function ValueCard({ index, title, description }: ValueCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.index}>{index}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
