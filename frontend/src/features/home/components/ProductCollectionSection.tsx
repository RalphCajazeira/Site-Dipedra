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
          title="Peças com presença, textura e cuidado no acabamento."
          description="Uma primeira vitrine de produtos para a Home, organizada em cards reutilizáveis e com imagens locais do próprio acervo da Dipedra."
        />

        <div className={styles.grid}>
          {productCollectionItems.map((item) => (
            <ProductCard key={item.title} {...item} />
          ))}
        </div>

        <div className={styles.footer}>
          <Button href="#contato" variant="ghost">
            Solicitar catálogo completo
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  );
}
