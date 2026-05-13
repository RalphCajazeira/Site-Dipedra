import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button, Container, SectionHeading, SurfaceCard } from "@/shared/ui";

import { catalogFilters, catalogHero, catalogProducts, catalogSortOptions } from "../data";
import { useProductCatalog } from "../hooks/useProductCatalog";
import { CatalogEmptyState } from "./CatalogEmptyState";
import { CatalogFilter } from "./CatalogFilter";
import { CatalogGrid } from "./CatalogGrid";
import { CatalogLoadingState } from "./CatalogLoadingState";
import { CatalogSearch } from "./CatalogSearch";
import { CatalogSort } from "./CatalogSort";
import { CatalogStats } from "./CatalogStats";
import { InternalPageHero } from "./InternalPageHero";
import styles from "./ProductCatalogSection.module.scss";

export function ProductCatalogSection() {
  const {
    activeFilter,
    categoryCounts,
    clearQuery,
    filteredProducts,
    isLoading,
    queryInput,
    resetCatalog,
    setActiveFilter,
    setQueryInput,
    setSortBy,
    sortBy,
    totalFound,
    totalProducts
  } = useProductCatalog({
    products: catalogProducts
  });

  return (
    <section className={styles.section} id="catalogo">
      <InternalPageHero
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Pedras / Produtos" }
        ]}
        description={catalogHero.description}
        eyebrow={catalogHero.eyebrow}
        image={catalogHero.image}
        imageAlt={catalogHero.imageAlt}
        title={catalogHero.title}
      >
        <Button to="/contato" variant="primary">
          Falar com especialista
          <ArrowUpRight size={16} />
        </Button>
        <Button to="/#pedras" variant="ghost">
          Voltar à Home
        </Button>
      </InternalPageHero>

      <Container>
        <div className={styles.catalogIntro}>
          <SectionHeading
            eyebrow="Estrutura funcional"
            title="Catálogo organizado para navegação rápida e leitura clara."
            description="Os filtros, a busca e a ordenação agora compartilham estado pela URL, deixando a página pronta para uso, compartilhamento e evolução futura."
          />

          <SurfaceCard className={styles.controlCard}>
            <div className={styles.controlsHeader}>
              <CatalogSearch onChange={setQueryInput} onClear={clearQuery} value={queryInput} />
              <CatalogSort onChange={setSortBy} options={catalogSortOptions} value={sortBy} />
            </div>

            <CatalogFilter activeFilter={activeFilter} filters={catalogFilters} onSelect={setActiveFilter} />

            <CatalogStats categoryCounts={categoryCounts} isLoading={isLoading} sortBy={sortBy} totalFound={totalFound} />
          </SurfaceCard>
        </div>

        {isLoading ? (
          <CatalogLoadingState />
        ) : filteredProducts.length > 0 ? (
          <CatalogGrid products={filteredProducts} />
        ) : (
          <CatalogEmptyState onClearQuery={clearQuery} onResetAll={resetCatalog} query={queryInput} />
        )}

        <SurfaceCard className={styles.noteCard}>
          <span>Próxima evolução</span>
          <p>
            Nesta fundação já deixamos o catálogo pronto para receber backend, CMS
            ou filtros funcionais sem reestruturar a apresentação visual.
          </p>
          <Link className={styles.noteLink} to="/contato">
            Solicitar um catálogo sob medida
          </Link>
        </SurfaceCard>

        <p className={styles.srOnly}>
          {totalFound} resultados de {totalProducts} itens disponíveis no catálogo.
        </p>
      </Container>
    </section>
  );
}
