import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./ProjectsPageHero.module.scss";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type ProjectsPageHeroProps = {
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export function ProjectsPageHero({
  breadcrumb,
  eyebrow,
  title,
  description,
  image,
  imageAlt
}: ProjectsPageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;

              return (
                <span className={styles.breadcrumbItem} key={`${item.label}-${index}`}>
                  {index === 0 ? <Home size={14} aria-hidden="true" /> : null}
                  {item.to && !isLast ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
                  {isLast ? null : <ChevronRight size={14} aria-hidden="true" />}
                </span>
              );
            })}
          </nav>

          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>

          <div className={styles.badges} aria-label="Destaques da página">
            <span>Hero interno</span>
            <span>Galeria responsiva</span>
            <span>Acervo real</span>
          </div>
        </div>

        <div className={styles.media}>
          <img className={styles.image} src={image} alt={imageAlt} />
          <div className={styles.mediaOverlay} aria-hidden="true" />
          <div className={styles.mediaCaption}>
            <span>Curadoria visual</span>
            <strong>Um banner pensado para apresentar o portfólio com leitura premium e profundidade.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
