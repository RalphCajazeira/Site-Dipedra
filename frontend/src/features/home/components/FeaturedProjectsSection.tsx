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
          title="Composições que mostram escala, acabamento e leitura arquitetônica."
          description="Uma vitrine inicial para o portfólio da marca, com cards premium e foco em aplicação real."
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
            Falar sobre um projeto
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  );
}
