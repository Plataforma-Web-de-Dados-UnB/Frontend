import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import Button from "@mui/material/Button";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/features/auth/useAuth";

export const CadastroPendentePage = () => {
  const { logout, user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { email?: string; allowed?: boolean } | null;
  const email = state?.email || user?.email || "";
  const isAllowed = state?.allowed || false;

  useEffect(() => {
    // If user is not logged in and didn't come from the specific login redirect,
    // prevent access and redirect them to the home page.
    if (!isAuthenticated && !isAllowed) {
      navigate(ROUTES.home, { replace: true });
    } else if (isAllowed) {
      // Clear the history state so that back/forward navigation won't have it anymore
      try {
        const historyState = window.history.state;
        if (historyState && typeof historyState === "object") {
          const newHistoryState = { ...historyState, usr: null };
          window.history.replaceState(newHistoryState, "");
        }
      } catch (e) {
        console.error("Erro ao limpar estado de histórico:", e);
      }
    }
  }, [isAuthenticated, isAllowed, navigate]);

  if (!isAuthenticated && !isAllowed) {
    return null;
  }

  const handleBack = async () => {
    if (isAuthenticated) {
      await logout();
    }
    navigate(ROUTES.home);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
      <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm text-center flex flex-col items-center justify-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fundo-superficie-suave">
          <Clock className="h-8 w-8 text-texto-secundario" />
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-azul-unb">
            Cadastro Pendente
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
        </div>

        <p className="text-sm text-texto-secundario">
          Sua conta foi criada com sucesso, mas o acesso à Área Administrativa requer aprovação manual da equipe administrativa.
        </p>

        <div className="w-full space-y-2 rounded bg-azul-unb-suave p-4 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-texto-secundario">Status da Conta:</span>
            <span className="font-semibold text-aviso">Pendente</span>
          </div>
          {email && (
            <div className="flex justify-between">
              <span className="text-texto-secundario">E-mail:</span>
              <span className="text-texto-principal">{email}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-texto-secundario">Permissões:</span>
            <span className="text-texto-principal">Leitura (Pública)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-texto-secundario">Próximo Passo:</span>
            <span className="text-texto-principal">Aguarde notificação por e-mail</span>
          </div>
        </div>

        <Button
          onClick={handleBack}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          //startIcon={<LogOut className="h-4 w-4" />}
        >
          {isAuthenticated ? "Sair e Voltar para a Página Inicial" : "Ir para a Página Inicial"}
        </Button>
      </div>
    </div>
  );
};
