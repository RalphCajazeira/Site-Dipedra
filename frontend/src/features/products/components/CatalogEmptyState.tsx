import { SearchX } from "lucide-react";

import { Button, SurfaceCard } from "@/shared/ui";

import styles from "./CatalogEmptyState.module.scss";

type CatalogEmptyStateProps = {
  query: string;
  onClearQuery: () => void;
  onResetAll: () => void;
};

export function CatalogEmptyState({ onClearQuery, onResetAll, query }: CatalogEmptyStateProps) {
  const hasQuery = query.trim().length > 0;

  return (
    <SurfaceCard className={styles.emptyState} aria-live="polite">
      <div className={styles.iconWrap}>
        <SearchX size={28} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <span>Nenhum resultado encontrado</span>
        <h3>{hasQuery ? "Sua busca não retornou produtos." : "O filtro selecionado não tem itens visíveis."}</h3>
        <p>
          {hasQuery
            ? "Tente trocar a palavra-chave, limpar a busca ou voltar a um filtro mais amplo."
            : "Experimente mudar a categoria ou ajustar a ordenação para explorar outras combinações."}
        </p>

        <div className={styles.actions}>
          {hasQuery ? (
            <Button onClick={onClearQuery} variant="primary">
              Limpar busca
            </Button>
          ) : null}
          <Button onClick={onResetAll} variant="ghost">
            Exibir catálogo completo
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}
