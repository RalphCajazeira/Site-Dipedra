import type { FeaturedProjectItem } from "@/shared/config/home";

import styles from "./ProjectCard.module.scss";

type ProjectCardProps = FeaturedProjectItem & {
  featured?: boolean;
};

export function ProjectCard({ description, featured = false, image, label, location, title }: ProjectCardProps) {
  return (
    <article className={`${styles.card} ${featured ? styles.featured : ""}`}>
      <div className={styles.media}>
        <img className={styles.image} src={image} alt={title} loading="lazy" />
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.label}>{label}</span>
          <span className={styles.location}>{location}</span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
}
