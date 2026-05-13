import type { ProjectGalleryItem } from "../types";

import styles from "./ProjectGalleryCard.module.scss";

type ProjectGalleryCardProps = ProjectGalleryItem;

export function ProjectGalleryCard({
  categoryLabel,
  environment,
  description,
  featured,
  image,
  imageAlt,
  location,
  material,
  tags,
  title,
  slug,
  year
}: ProjectGalleryCardProps) {
  const titleId = `${slug}-title`;
  const descriptionId = `${slug}-description`;

  return (
    <article
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
      tabIndex={0}
    >
      <div className={styles.media}>
        <img className={styles.image} src={image} alt={imageAlt || title} loading="lazy" />
        <div className={styles.overlay} />
        <div className={styles.badges}>
          <span>{categoryLabel}</span>
          <span>{year}</span>
          {featured ? <span>Destaque</span> : null}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span>{environment}</span>
          <span>Curadoria DiPedra</span>
        </div>

        <h3 id={titleId}>{title}</h3>
        <p id={descriptionId}>{description}</p>

        <dl className={styles.metaGrid}>
          <div>
            <dt>Material</dt>
            <dd>{material}</dd>
          </div>
          <div>
            <dt>Local</dt>
            <dd>{location}</dd>
          </div>
        </dl>

        <ul className={styles.tags} aria-label={`Destaques de ${title}`}>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
