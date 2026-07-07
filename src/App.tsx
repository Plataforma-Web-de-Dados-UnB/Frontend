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
import { PipelinasPage } from "@/pages/admin/PipelinasPage";
import { UploadPage } from "@/pages/admin/UploadPage";
import { CategoriasAdminPage } from "@/pages/admin/CategoriasAdminPage";
import { PaineisAdminPage } from "@/pages/admin/PaineisAdminPage";
import { UsuariosPage } from "@/pages/admin/UsuariosPage";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
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
            path={ROUTES.cadastroPendente}
            element={
              <PrivateRoute>
                <CadastroPendentePage />
              </PrivateRoute>
            }
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

        {/* Área admin — PrivateRoute sem children usa Outlet internamente */}
        <Route path="admin" element={<PrivateRoute requireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route
              index
              element={<Navigate to={ROUTES.adminPipelines} replace />}
            />
            <Route path="pipelines" element={<PipelinasPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="categorias" element={<CategoriasAdminPage />} />
            <Route path="paineis" element={<PaineisAdminPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </>
  );
}
