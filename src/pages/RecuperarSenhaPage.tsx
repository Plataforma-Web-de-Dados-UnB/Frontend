import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowLeft, MailCheck } from "lucide-react";
import {
  recuperarSenhaSchema,
  type RecuperarSenhaFormValues,
} from "@/schemas/forms";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { usuarioApi } from "@/services/usuarioApi";
import { ROUTES } from "@/utils/constants";

export const RecuperarSenhaPage = () => {
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarSenhaFormValues>({
    resolver: zodResolver(recuperarSenhaSchema),
  });

  const onSubmit = async (values: RecuperarSenhaFormValues) => {
    setError(null);
    try {
      await usuarioApi.recuperarSenha(values.email);
      setEnviado(true);
    } catch {
      setError("Não foi possível processar sua solicitação. Tente novamente.");
    }
  };

  if (enviado) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
        <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destaque/10">
              <MailCheck className="h-8 w-8 text-destaque" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-titulo-destaque">
            Email Enviado
          </h1>
          <div className="mx-auto mt-3 mb-6 h-1 w-16 rounded bg-destaque" />
          <p className="text-sm text-texto-secundario leading-relaxed mb-6">
            Se o e-mail informado estiver cadastrado, você receberá em breve um
            link para redefinição de senha. Verifique também sua caixa de spam.
          </p>
          <Button
            component={Link}
            to={ROUTES.login}
            variant="outlined"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 600 }}
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Voltar para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
      <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-titulo-destaque">
            Recuperar Senha
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
        </div>

        <p className="mt-6 text-sm text-texto-secundario leading-relaxed text-center">
          Informe o e-mail da sua conta e enviaremos um link para você criar uma
          nova senha.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <FormField
            label="E-mail"
            type="email"
            placeholder="Seu e-mail cadastrado"
            fieldError={errors.email}
            spellCheck={false}
            {...register("email")}
          />

          <AlertBanner message={error} />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 1, textTransform: "none", fontWeight: 700 }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Enviando…" : "Enviar link de recuperação"}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-center">
          <Button
            component={Link}
            to={ROUTES.login}
            sx={{
              color: "var(--color-destaque)",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "2px 6px",
              minWidth: "auto",
              position: "relative",
              lineHeight: 1.2,
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "6px",
                right: "6px",
                height: "2px",
                backgroundColor: "var(--color-destaque)",
                transform: "scaleX(0)",
                transition: "transform 0.2s ease-in-out",
              },
              "&:hover::after": { transform: "scaleX(1)" },
              "&:hover": { backgroundColor: "transparent" },
            }}
            startIcon={<ArrowLeft className="h-3.5 w-3.5" />}
          >
            Voltar para o login
          </Button>
        </div>
      </div>
    </div>
  );
};
