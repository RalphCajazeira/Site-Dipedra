import type { ProductCollectionItem } from "@/shared/config/home";

import styles from "./ProductCard.module.scss";

type ProductCardProps = ProductCollectionItem;

export function ProductCard({ description, highlight, image, tag, title }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img className={styles.image} src={image} alt={title} loading="lazy" />
        <span className={styles.tag}>{tag}</span>
      </div>

      <div className={styles.content}>
        <span className={styles.highlight}>{highlight}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
