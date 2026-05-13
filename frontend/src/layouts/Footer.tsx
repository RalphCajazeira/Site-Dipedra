import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>DiPedra - nova base frontend em construção.</p>
        <a href="#inicio">Voltar ao topo</a>
      </div>
    </footer>
  );
}
