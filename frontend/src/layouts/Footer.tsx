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
          <a href="#pedras">Coleção</a>
          <a href="#projetos">Projetos</a>
          <a href="#sobre">Diferenciais</a>
          <a href="#contato">Contato</a>
        </nav>

        <a className={styles.backToTop} href="#inicio">
          Voltar ao topo
        </a>
      </div>
    </footer>
  );
}
