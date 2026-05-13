import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui";
import { siteNavigation, whatsappHref } from "@/shared/config/site";
import { useScrolled } from "@/shared/hooks/useScrolled";
import styles from "./Header.module.scss";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = useScrolled(16);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#inicio" aria-label="DiPedra - página inicial">
          <span className={styles.brandMark}>Di</span>
          <span className={styles.brandWord}>Pedra</span>
        </a>

        <nav className={styles.navDesktop} aria-label="Navegação principal">
          {siteNavigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button className={styles.quoteButton} href={whatsappHref} variant="ghost">
            Solicitar Orçamento
            <ArrowUpRight size={16} />
          </Button>

          <button
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen((current) => !current)}
            type="button"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.navMobile} aria-label="Navegação mobile">
          {siteNavigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <Button className={styles.mobileQuoteButton} href={whatsappHref} variant="primary">
          Solicitar Orçamento
          <ArrowUpRight size={16} />
        </Button>
      </div>
    </header>
  );
}
