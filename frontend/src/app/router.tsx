import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SiteLayout } from "@/layouts/SiteLayout";
import { HomePage } from "@/pages/HomePage";
import { SobrePage } from "@/pages/SobrePage";
import { ProdutosPage } from "@/pages/ProdutosPage";
import { ProjetosPage } from "@/pages/ProjetosPage";
import { ContatoPage } from "@/pages/ContatoPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/projetos" element={<ProjetosPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
