import { homeMarqueeCategories } from "@/shared/config/home";
import styles from "./HomeMarquee.module.scss";

export function HomeMarquee() {
  const items = [...homeMarqueeCategories, ...homeMarqueeCategories];

  return (
    <section className={styles.marquee} aria-label="Categorias de pedras">
      <div className={styles.track}>
        {items.map((category, index) => (
          <span key={`${category}-${index}`} className={styles.item}>
            {category}
          </span>
        ))}
      </div>
    </section>
  );
}
