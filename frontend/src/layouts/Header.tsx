import { ArrowUpRight } from "lucide-react";

import { Button } from "@/shared/ui";
import styles from "./Header.module.scss";

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Estrutura", href: "#estrutura" },
  { label: "Contato", href: "#contato" }
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#inicio" aria-label="DiPedra">
          <span>Di</span>
          <span>Pedra</span>
        </a>

        <nav className={styles.nav} aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button className={styles.actionButton} href="#contato" variant="ghost">
            Solicitar contato
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}
