import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SiteLayout } from "@/layouts/SiteLayout";
import { HomePage } from "@/pages/HomePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
