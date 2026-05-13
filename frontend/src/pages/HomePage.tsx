import { ArrowUpRight, Gem, Layers3, ShieldCheck, Sparkles } from "lucide-react";

import { Button, Container, SectionHeading, SurfaceCard } from "@/shared/ui";
import styles from "./HomePage.module.scss";

const highlights = [
  {
    title: "Identidade premium",
    description: "Tipografia elegante, contraste alto e uma leitura mais sofisticada para a marca."
  },
  {
    title: "Estrutura modular",
    description: "Componentes pequenos e reaproveitáveis para não virar um único bloco de CSS."
  },
  {
    title: "Base pronta para crescer",
    description: "Arquitetura pensada para receber páginas e features novas sem bagunçar a base."
  }
];

const pillars = [
  {
    icon: Sparkles,
    title: "Direção visual clara",
    description: "Uma linguagem visual alinhada ao layout que você gostou, sem copiar o HTML inteiro."
  },
  {
    icon: Layers3,
    title: "Camadas bem separadas",
    description: "App, layout, shared UI e styles organizados para facilitar evolução e manutenção."
  },
  {
    icon: ShieldCheck,
    title: "Padrão consistente",
    description: "Tokens, containers e cards compartilhados para manter consistência entre telas."
  },
  {
    icon: Gem,
    title: "Reaproveitamento real",
    description: "Blocos criados pensando em uso futuro, sem acoplamento com regra de negócio."
  }
];

export function HomePage() {
  return (
    <>
      <section className={styles.hero} id="inicio">
        <Container className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Nova base frontend</span>
            <h1>Mármores, granitos e pedras naturais com presença de marca.</h1>
            <p>
              Estamos refazendo a experiência da DiPedra com uma base em Vite,
              React e TypeScript, organizada para crescer em etapas e sem
              concentrar tudo em um CSS gigante.
            </p>

            <div className={styles.heroActions}>
              <Button href="#estrutura" variant="primary">
                Ver estrutura
                <ArrowUpRight size={16} />
              </Button>
              <Button href="#contato" variant="ghost">
                Falar sobre a próxima fase
              </Button>
            </div>
          </div>

          <SurfaceCard className={styles.heroPanel}>
            <span className={styles.panelLabel}>Fase 1</span>
            <h2>Base limpa, tokens visuais e componentes mínimos.</h2>
            <ul className={styles.panelList}>
              <li>Vite + React + TypeScript</li>
              <li>Aliases configurados</li>
              <li>Estrutura pronta para evoluir</li>
            </ul>
          </SurfaceCard>
        </Container>
      </section>

      <section className={styles.section} id="estrutura">
        <Container>
          <SectionHeading
            eyebrow="Estrutura inicial"
            title="Cada coisa no seu lugar."
            description="Nesta primeira etapa, a prioridade é construir uma base reutilizável e fácil de manter."
          />

          <div className={styles.highlightsGrid}>
            {highlights.map((item) => (
              <SurfaceCard key={item.title} className={styles.highlightCard}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </SurfaceCard>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <SectionHeading
            eyebrow="Padrões"
            title="Arquitetura inspirada no Corte Certo, sem copiar a regra de negócio."
            description="A referência aqui é a organização: app, layouts, shared UI, styles e páginas separadas."
          />

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <SurfaceCard key={pillar.title} className={styles.pillarCard}>
                  <span className={styles.iconBadge}>
                    <Icon size={18} />
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </SurfaceCard>
              );
            })}
          </div>
        </Container>
      </section>

      <section className={styles.ctaSection} id="contato">
        <Container>
          <SurfaceCard className={styles.ctaCard}>
            <div>
              <span className={styles.eyebrow}>Próximo movimento</span>
              <h2>Na Fase 2, a gente começa a converter o layout em blocos reais.</h2>
              <p>
                Primeiro consolidamos a fundação. Depois, vamos ligando seções e
                componentes ao conteúdo definitivo da Dipedra, sem pressa e sem retrabalho.
              </p>
            </div>

            <Button href="mailto:contato@dipedra.com" variant="primary">
              Abrir conversa
              <ArrowUpRight size={16} />
            </Button>
          </SurfaceCard>
        </Container>
      </section>
    </>
  );
}
