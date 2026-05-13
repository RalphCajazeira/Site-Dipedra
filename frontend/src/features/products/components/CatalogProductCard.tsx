import type { CatalogProduct } from "../types";

import styles from "./CatalogProductCard.module.scss";

type CatalogProductCardProps = CatalogProduct;

export function CatalogProductCard({
  application,
  category,
  description,
  finish,
  image,
  imageAlt,
  title
}: CatalogProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img className={styles.image} src={image} alt={imageAlt || title} loading="lazy" />
        <div className={styles.badges}>
          <span>{category}</span>
          <span>{finish}</span>
        </div>
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{description}</p>

        <dl className={styles.meta}>
          <div>
            <dt>Aplicação</dt>
            <dd>{application}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
