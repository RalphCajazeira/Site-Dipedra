import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/shared/ui";
import { siteNavigation, whatsappHref } from "@/shared/config/site";
import { useScrolled } from "@/shared/hooks/useScrolled";
import styles from "./Header.module.scss";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isScrolled = useScrolled(16);
  const location = useLocation();

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
        <Link className={styles.brand} to="/" aria-label="DiPedra - página inicial">
          <span className={styles.brandMark}>Di</span>
          <span className={styles.brandWord}>Pedra</span>
        </Link>

        <nav className={styles.navDesktop} aria-label="Navegação principal">
          {siteNavigation.map((item) => (
            <Link
              key={item.to}
              className={location.pathname === item.to ? styles.activeLink : undefined}
              to={item.to}
            >
              {item.label}
            </Link>
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
            <Link
              key={item.to}
              className={location.pathname === item.to ? styles.activeLink : undefined}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
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
