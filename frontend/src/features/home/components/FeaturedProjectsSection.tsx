import { ArrowUpRight } from "lucide-react";

import { featuredProjectItems } from "@/shared/config/home";
import { Button, Container, SectionHeading } from "@/shared/ui";
import { ProjectCard } from "./ProjectCard";
import styles from "./FeaturedProjectsSection.module.scss";

export function FeaturedProjectsSection() {
  return (
    <section className={styles.section} id="projetos">
      <Container>
        <SectionHeading
          eyebrow="Projetos em destaque"
          title="Ambientes reais que mostram escala, uso e acabamento."
          description="Uma seleção curta de aplicações do acervo, pensada para mostrar contexto, leitura espacial e impacto visual."
        />

        <div className={styles.grid}>
          {featuredProjectItems.map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
              featured={index === 0}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <Button href="#contato" variant="ghost">
            Conversar sobre um projeto
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  );
}
