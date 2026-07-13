import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import Button from "@mui/material/Button";
import { Lock, ArrowLeft } from "lucide-react";

export const PoliticaPrivacidadePage = () => {
  return (
    <div className="min-h-screen bg-fundo-pagina py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Button
            component={Link}
            to={ROUTES.home}
            startIcon={<ArrowLeft className="h-4 w-4" />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "var(--color-titulo-destaque)",
            }}
          >
            Voltar
          </Button>
        </div>

        <div className="bg-fundo-superficie rounded shadow-sm p-8 space-y-8">
          {/* Header */}
          <div className="border-b border-borda-padrao pb-6 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-titulo-destaque/10 text-titulo-destaque shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-texto-principal tracking-tight">
                Política de Privacidade
              </h1>
              <p className="text-xs text-texto-secundario mt-1">
                Última atualização: julho de 2026
              </p>
            </div>
          </div>

          {/* Intro */}
          <p className="text-sm text-texto-secundario leading-relaxed">
            Este portal é um projeto acadêmico de Trabalho de Conclusão de
            Curso. Coletamos somente as informações estritamente necessárias
            para o funcionamento da plataforma, sem qualquer finalidade
            comercial.
          </p>

          {/* Dados coletados */}
          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-texto-principal">
              Dados coletados
            </h2>
            <ul className="text-sm text-texto-secundario space-y-2 pl-2">
              <li className="flex gap-2">
                <span className="text-azul-unb font-bold shrink-0">–</span>
                <span>
                  <strong className="text-texto-principal">
                    Conta de acesso:
                  </strong>{" "}
                  nome, e-mail e senha (armazenada como hash). Usados
                  exclusivamente para autenticação.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-azul-unb font-bold shrink-0">–</span>
                <span>
                  <strong className="text-texto-principal">Sugestões:</strong>{" "}
                  título, descrição e tipo da sugestão enviada pelo formulário
                  público.
                </span>
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-texto-principal">
              Cookies
            </h2>
            <p className="text-sm text-texto-secundario leading-relaxed">
              Usamos um único cookie{" "}
              <code className="bg-borda-padrao/60 px-1 py-0.5 rounded text-xs">
                refreshToken
              </code>
              , do tipo <em>HttpOnly</em> e seguro, que mantém sua sessão ativa
              sem expor credenciais ao navegador. Nenhum cookie de rastreamento
              ou publicidade é utilizado.
            </p>
          </div>

          {/* Seus direitos */}
          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-texto-principal">
              Seus dados
            </h2>
            <p className="text-sm text-texto-secundario leading-relaxed">
              Você pode solicitar a exclusão da sua conta a qualquer momento
              diretamente na tela de perfil. Nenhuma informação é vendida ou
              compartilhada com terceiros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
