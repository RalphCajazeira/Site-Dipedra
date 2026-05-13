import { LoaderCircle } from "lucide-react";

import { SurfaceCard } from "@/shared/ui";

import styles from "./CatalogLoadingState.module.scss";

export function CatalogLoadingState() {
  return (
    <SurfaceCard className={styles.loadingState} aria-live="polite">
      <LoaderCircle className={styles.icon} size={22} aria-hidden="true" />
      <div>
        <h3>Atualizando catálogo</h3>
        <p>Aplicando filtro, busca e ordenação aos resultados.</p>
      </div>
    </SurfaceCard>
  );
}
