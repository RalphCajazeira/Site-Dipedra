import { ArrowUpRight } from "lucide-react";

import { productCollectionItems } from "@/shared/config/home";
import { Button, Container, SectionHeading } from "@/shared/ui";
import { ProductCard } from "./ProductCard";
import styles from "./ProductCollectionSection.module.scss";

export function ProductCollectionSection() {
  return (
    <section className={styles.section} id="pedras">
      <Container>
        <SectionHeading
          eyebrow="Nossa Coleção"
          title="Chapas com presença, contraste e leitura mineral."
          description="Uma seleção curta de chapas reais do acervo da Dipedra, escolhidas para mostrar variedade de cor, textura e acabamento."
        />

        <div className={styles.grid}>
          {productCollectionItems.map((item) => (
            <ProductCard key={item.title} {...item} />
          ))}
        </div>

        <div className={styles.footer}>
          <Button href="#contato" variant="ghost">
            Pedir catálogo completo
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  );
}
