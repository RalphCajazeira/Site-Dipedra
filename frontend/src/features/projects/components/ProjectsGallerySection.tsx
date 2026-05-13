import { useMemo, useState } from "react";

import { Container, SectionHeading, SurfaceCard } from "@/shared/ui";

import { projectCategoryOptions, projectGalleryItems } from "../data";
import type { ProjectCategoryFilterItem, ProjectCategoryId } from "../types";
import { ProjectCategoryFilter } from "./ProjectCategoryFilter";
import { ProjectGalleryCard } from "./ProjectGalleryCard";
import styles from "./ProjectsGallerySection.module.scss";

export function ProjectsGallerySection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategoryId>("all");

  const categoryFilters = useMemo<ProjectCategoryFilterItem[]>(() => {
    return projectCategoryOptions.map((option) => {
      const count =
        option.id === "all"
          ? projectGalleryItems.length
          : projectGalleryItems.filter((project) => project.categoryId === option.id).length;

      return {
        ...option,
        count
      };
    });
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projectGalleryItems;
    }

    return projectGalleryItems.filter((project) => project.categoryId === activeFilter);
  }, [activeFilter]);

  const activeFilterLabel =
    categoryFilters.find((filter) => filter.id === activeFilter)?.label ?? "Projetos";

  return (
    <section className={styles.section} id="galeria-projetos">
      <Container>
        <div className={styles.intro}>
          <SectionHeading
            eyebrow="Galeria inicial"
            title="Uma base modular para filtrar por contexto e ampliar o portfólio no futuro."
            description="A estrutura já nasce responsiva e com cards reutilizáveis, deixando o caminho pronto para conectar CMS, busca e carregamento progressivo em uma etapa posterior."
          />

          <SurfaceCard className={styles.controlsCard}>
            <div className={styles.controlsHeader}>
              <p className={styles.resultsSummary}>
                {filteredProjects.length} de {projectGalleryItems.length} projetos
              </p>
              <p className={styles.resultsHint}>
                Categoria ativa: <strong>{activeFilterLabel}</strong>
              </p>
            </div>

            <ProjectCategoryFilter
              activeFilter={activeFilter}
              filters={categoryFilters}
              onSelect={setActiveFilter}
            />
          </SurfaceCard>
        </div>

        {filteredProjects.length > 0 ? (
          <div className={styles.grid}>
            {filteredProjects.map((project) => (
              <ProjectGalleryCard key={project.id} {...project} />
            ))}
          </div>
        ) : (
          <SurfaceCard className={styles.emptyState}>
            <span>Nenhum resultado encontrado</span>
            <p>
              A categoria "{activeFilterLabel}" ainda não possui projetos nesta seleção.
              Tente mudar o filtro para explorar as composições disponíveis.
            </p>
          </SurfaceCard>
        )}
      </Container>
    </section>
  );
}
