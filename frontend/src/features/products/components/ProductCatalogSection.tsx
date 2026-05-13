import { ArrowUpRight, Copy, QrCode } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const location = useLocation();
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
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const catalogUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return new URL(`${location.pathname}${location.search}`, window.location.origin).toString();
  }, [location.pathname, location.search]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const showShareFeedback = (message: string) => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    setShareFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setShareFeedback(null);
      feedbackTimerRef.current = null;
    }, 2400);
  };

  const copyCatalogLink = async () => {
    if (!catalogUrl) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(catalogUrl);
      } else {
        const fallbackTextArea = document.createElement("textarea");
        fallbackTextArea.value = catalogUrl;
        fallbackTextArea.setAttribute("readonly", "true");
        fallbackTextArea.style.position = "absolute";
        fallbackTextArea.style.left = "-9999px";
        document.body.appendChild(fallbackTextArea);
        fallbackTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(fallbackTextArea);
      }

      showShareFeedback("Link copiado para a seleção atual.");
    } catch {
      showShareFeedback("Não foi possível copiar o link agora.");
    }
  };

  const downloadCatalogQrCode = async () => {
    if (!catalogUrl) {
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(catalogUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 480
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "dipedra-catalogo-pedras.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showShareFeedback("QR Code gerado para a seleção atual.");
    } catch {
      showShareFeedback("Não foi possível gerar o QR Code.");
    }
  };

  return (
    <section className={styles.section} id="catalogo">
      <InternalPageHero
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Pedras" }
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
            title="Catálogo completo do acervo legado."
            description="A busca, os filtros e o compartilhamento agora vivem na aba Pedras, preservando o layout atual e trazendo todo o catálogo antigo para dentro do site."
          />

          <SurfaceCard className={styles.controlCard}>
            <div className={styles.controlsHeader}>
              <div className={styles.searchStack}>
                <div className={styles.searchRow}>
                  <CatalogSearch onChange={setQueryInput} onClear={clearQuery} value={queryInput} />

                  <div className={styles.shareActions}>
                    <Button className={styles.actionButton} onClick={downloadCatalogQrCode} variant="ghost">
                      <QrCode size={16} />
                      QR Code
                    </Button>
                    <Button className={styles.actionButton} onClick={copyCatalogLink} variant="ghost">
                      <Copy size={16} />
                      Copiar link
                    </Button>
                  </div>
                </div>

                {shareFeedback ? (
                  <p className={styles.shareFeedback} aria-live="polite">
                    {shareFeedback}
                  </p>
                ) : null}
              </div>
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
          <span>Catálogo do site</span>
          <p>
            O catálogo agora vive nas próprias páginas do site, com o acervo legado
            organizado, busca persistida na URL, QR Code e link copiável.
          </p>
          <Link className={styles.noteLink} to="/contato">
            Solicitar uma seleção de pedras
          </Link>
        </SurfaceCard>

        <p className={styles.srOnly}>
          {totalFound} resultados de {totalProducts} itens disponíveis no catálogo.
        </p>
      </Container>
    </section>
  );
}
