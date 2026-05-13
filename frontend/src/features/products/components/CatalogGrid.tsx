import type { CatalogProduct } from "../types";

import { CatalogProductCard } from "./CatalogProductCard";
import styles from "./CatalogGrid.module.scss";

type CatalogGridProps = {
  products: CatalogProduct[];
};

export function CatalogGrid({ products }: CatalogGridProps) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <CatalogProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
