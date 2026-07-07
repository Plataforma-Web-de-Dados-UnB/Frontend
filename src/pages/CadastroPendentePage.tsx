import { Link } from "react-router-dom";
import { Clock, LogOut } from "lucide-react";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/features/auth/useAuth";

export const CadastroPendentePage = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-fundo-pagina px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-fundo-superficie-suave">
        <Clock className="h-8 w-8 text-texto-secundario" />
      </div>

      <h1 className="mt-4 text-2xl font-bold text-texto-principal">
        Cadastro Pendente
      </h1>

      <div className="mt-4 w-full max-w-md rounded border border-borda-padrao bg-fundo-superficie p-6 shadow-sm">
        <p className="text-center text-sm text-texto-secundario">
          Sua conta foi criada com sucesso, mas o acesso à Área Administrativa
          requer aprovação manual da equipe de TI ou da Reitoria.
        </p>

        <div className="mt-5 space-y-2 rounded bg-fundo-superficie-suave p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-texto-secundario">Status da Conta:</span>
            <span className="font-bold text-aviso">Pendente</span>
          </div>
          {user && (
            <div className="flex justify-between">
              <span className="text-texto-secundario">E-mail:</span>
              <span className="font-semibold text-texto-principal">
                {user.email}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-texto-secundario">Permissões:</span>
            <span className="font-semibold text-texto-principal">
              Leitura (Pública)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-texto-secundario">Próximo Passo:</span>
            <span className="font-semibold text-texto-principal">
              Aguarde notificação por e-mail
            </span>
          </div>
        </div>

        <Link
          to={ROUTES.home}
          onClick={logout}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded border border-borda-padrao py-2.5 text-sm font-semibold text-texto-secundario transition hover:bg-fundo-superficie-suave"
        >
          <LogOut className="h-4 w-4" />
          Sair e voltar para a área pública
        </Link>
      </div>
    </div>
  );
};
