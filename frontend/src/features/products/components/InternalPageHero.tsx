import type { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./InternalPageHero.module.scss";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

type InternalPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  breadcrumb: BreadcrumbItem[];
  children?: ReactNode;
};

export function InternalPageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  breadcrumb,
  children
}: InternalPageHeroProps) {
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

          {children ? <div className={styles.actions}>{children}</div> : null}
        </div>

        <div className={styles.media}>
          <img className={styles.image} src={image} alt={imageAlt} />
          <div className={styles.mediaOverlay} aria-hidden="true" />
          <div className={styles.mediaCaption}>
            <span>Curadoria DiPedra</span>
            <strong>Materiais selecionados para compor o catálogo interno da nova arquitetura.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
