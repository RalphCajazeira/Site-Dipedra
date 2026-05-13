import { ProjectsGallerySection } from "@/features/projects/components/ProjectsGallerySection";
import { ProjectsPageHero } from "@/features/projects/components/ProjectsPageHero";
import { projectsPageHero } from "@/features/projects/data";

export function ProjetosPage() {
  return (
    <>
      <ProjectsPageHero
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Projetos" }
        ]}
        description={projectsPageHero.description}
        eyebrow={projectsPageHero.eyebrow}
        image={projectsPageHero.image}
        imageAlt={projectsPageHero.imageAlt}
        title={projectsPageHero.title}
      />
      <ProjectsGallerySection />
    </>
  );
}
