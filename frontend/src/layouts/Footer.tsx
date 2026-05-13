import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.branding}>
          <strong>DiPedra</strong>
          <p>Mármores, granitos e pedras naturais com presença premium.</p>
        </div>

        <nav className={styles.links} aria-label="Links do rodapé">
          <Link to="/#pedras">Coleção</Link>
          <Link to="/projetos">Projetos</Link>
          <NavLink to="/sobre">Sobre</NavLink>
          <Link to="/contato">Contato</Link>
        </nav>

        <Link className={styles.backToTop} to="/">
          Voltar ao topo
        </Link>
      </div>
    </footer>
  );
}
