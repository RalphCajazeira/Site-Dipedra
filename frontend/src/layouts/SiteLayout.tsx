import { Outlet } from "react-router-dom";

import { Header } from "@/layouts/Header";
import { Footer } from "@/layouts/Footer";

export function SiteLayout() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
