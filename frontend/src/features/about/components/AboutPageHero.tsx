import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./AboutPageHero.module.scss";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type AboutPageHeroProps = {
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export function AboutPageHero({
  breadcrumb,
  eyebrow,
  title,
  description,
  image,
  imageAlt
}: AboutPageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <nav className={styles.breadcrumb} aria-label="Trilha de navegação">
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
            <span>Tradição em pedras</span>
            <span>Curadoria e beneficiamento</span>
            <span>Contato e orçamento</span>
          </div>
        </div>

        <div className={styles.media}>
          <img className={styles.image} src={image} alt={imageAlt} />
          <div className={styles.mediaOverlay} aria-hidden="true" />
          <div className={styles.mediaCaption}>
            <span>DiPedra institucional</span>
            <strong>Uma apresentação visual que reforça confiança, acabamento e curadoria em pedra natural.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
