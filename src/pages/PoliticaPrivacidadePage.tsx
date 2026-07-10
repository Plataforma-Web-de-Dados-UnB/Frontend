import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import Button from "@mui/material/Button";
import { Shield, ArrowLeft, Cookie, Lock, Eye } from "lucide-react";

export const PoliticaPrivacidadePage = () => {
  return (
    <div className="min-h-screen bg-fundo-principal py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            component={Link}
            to={ROUTES.home}
            startIcon={<ArrowLeft className="h-4 w-4" />}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Voltar para a Página Inicial
          </Button>
        </div>

        {/* Card Principal */}
        <div className="bg-fundo-superficie border border-borda-padrao rounded shadow-md p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="border-b border-borda-padrao pb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-emerald-50 text-emerald-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-texto-principal tracking-tight sm:text-3xl">
                Política de Privacidade
              </h1>
              <p className="text-sm text-texto-secundario mt-1">
                Portal de Dados da Universidade de Brasília (UnB)
              </p>
            </div>
          </div>

          {/* Intro */}
          <p className="text-texto-principal text-sm leading-relaxed">
            Esta Política de Privacidade descreve como o Portal de Dados UnB
            coleta, armazena, protege e utiliza as informações fornecidas pelos
            usuários no âmbito de suas funcionalidades, em total conformidade
            com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-texto-principal flex items-center gap-2">
              <Lock className="h-5 w-5 text-azul-unb" />
              1. Coleta de Dados e Finalidade
            </h2>
            <p className="text-texto-secundario text-sm leading-relaxed">
              Coletamos informações pessoais apenas nos casos estritamente
              necessários para o funcionamento e administração da plataforma:
            </p>
            <ul className="list-disc list-inside text-texto-secundario text-sm space-y-2 pl-4">
              <li>
                <strong className="text-texto-principal">
                  Cadastro e Autenticação:
                </strong>{" "}
                Coletamos seu nome, sobrenome, e-mail e senha para criar sua
                conta de acesso seguro à Área Administrativa.
              </li>
              <li>
                <strong className="text-texto-principal">
                  Sugestões e Apontamentos:
                </strong>{" "}
                Coletamos nome e e-mail de contato para viabilizar o envio de
                retornos da equipe técnica às sugestões cadastradas.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-texto-principal flex items-center gap-2">
              <Cookie className="h-5 w-5 text-azul-unb" />
              2. Uso de Cookies
            </h2>
            <p className="text-texto-secundario text-sm leading-relaxed">
              O Portal de Dados UnB utiliza apenas **cookies estritamente
              necessários** para o funcionamento da plataforma. Não utilizamos
              cookies de publicidade ou rastreamento de terceiros.
            </p>
            <ul className="list-disc list-inside text-texto-secundario text-sm space-y-2 pl-4">
              <li>
                <strong className="text-texto-principal">
                  Cookie de Refresh Token (HttpOnly):
                </strong>{" "}
                Um cookie seguro criptografado de nome `refreshToken` é
                armazenado no seu navegador para permitir a renovação automática
                da sua sessão de usuário administrativo sem que você precise
                inserir sua senha repetidamente. Este cookie é protegido contra
                scripts do lado do cliente (bloqueando ataques XSS).
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-texto-principal flex items-center gap-2">
              <Eye className="h-5 w-5 text-azul-unb" />
              3. Compartilhamento e Proteção
            </h2>
            <p className="text-texto-secundario text-sm leading-relaxed">
              Os dados coletados são de uso exclusivo da Universidade de
              Brasília para o gerenciamento de suas pipelines e dashboards.
              Garantimos que os dados pessoais **não serão compartilhados**,
              vendidos ou distribuídos a terceiros externos sem consentimento
              expresso.
            </p>
            <p className="text-texto-secundario text-sm leading-relaxed">
              Utilizamos chaves criptográficas fortes para a emissão de tokens
              de sessão (JWT) e conexões de rede seguras (HTTPS/SSL) em todas as
              comunicações entre o frontend e a API.
            </p>
          </div>

          {/* Footer Info */}
          <div className="border-t border-borda-padrao pt-6 text-xs text-texto-secundario flex flex-col sm:flex-row justify-between gap-4">
            <span>Última atualização: Julho de 2026</span>
            <span>Universidade de Brasília - UnB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
