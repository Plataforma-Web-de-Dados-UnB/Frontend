import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PrivateRoute } from "@/features/auth/PrivateRoute";
import { ROUTES } from "@/utils/constants";

import { HomePage } from "@/pages/HomePage";
import { PaineisPage } from "@/pages/PaineisPage";
import { CategoriaPage } from "@/pages/CategoriaPage";
import { PainelPage } from "@/pages/PainelPage";
import { SugestaoPage } from "@/pages/SugestaoPage";
import { LoginPage } from "@/pages/LoginPage";
import { CadastroPage } from "@/pages/CadastroPage";
import { CadastroPendentePage } from "@/pages/CadastroPendentePage";
import { PerfilPage } from "@/pages/PerfilPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { PipelinesPage } from "@/pages/admin/PipelinesPage";
import { UploadPage } from "@/pages/admin/UploadPage";
import { CategoriasAdminPage } from "@/pages/admin/CategoriasAdminPage";
import { PaineisAdminPage } from "@/pages/admin/PaineisAdminPage";
import { UsuariosPage } from "@/pages/admin/UsuariosPage";
import { SugestoesAdminPage } from "@/pages/admin/SugestoesAdminPage";

import { PoliticaPrivacidadePage } from "@/pages/PoliticaPrivacidadePage";
import { CookieConsent } from "@/components/layout/CookieConsent";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <CookieConsent />
      <Routes>
        {/* Área pública */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.paineis} element={<PaineisPage />} />
          <Route path={ROUTES.categoria} element={<CategoriaPage />} />
          <Route path={ROUTES.painel} element={<PainelPage />} />
          <Route path={ROUTES.sugestao} element={<SugestaoPage />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.cadastro} element={<CadastroPage />} />
          <Route
            path={ROUTES.politicaPrivacidade}
            element={<PoliticaPrivacidadePage />}
          />
          <Route
            path={ROUTES.cadastroPendente}
            element={<CadastroPendentePage />}
          />
          <Route
            path={ROUTES.perfil}
            element={
              <PrivateRoute>
                <PerfilPage />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Área admin - PrivateRoute sem children usa Outlet internamente */}
        <Route path="admin" element={<PrivateRoute requireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="pipelines" element={<PipelinesPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="categorias" element={<CategoriasAdminPage />} />
            <Route path="paineis" element={<PaineisAdminPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="sugestoes" element={<SugestoesAdminPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </>
  );
}
