import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import {
  redefinirSenhaSchema,
  type RedefinirSenhaFormValues,
} from "@/schemas/forms";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { usuarioApi } from "@/services/usuarioApi";
import { ROUTES } from "@/utils/constants";

export const RedefinirSenhaPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [showNova, setShowNova] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RedefinirSenhaFormValues>({
    resolver: zodResolver(redefinirSenhaSchema),
  });

  const novaSenhaValue = watch("novaSenha", "");

  const criteria = [
    { label: "Mínimo de 8 caracteres", met: novaSenhaValue.length >= 8 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(novaSenhaValue) },
    { label: "Uma letra minúscula", met: /[a-z]/.test(novaSenhaValue) },
    { label: "Um número", met: /[0-9]/.test(novaSenhaValue) },
    {
      label: "Um caractere especial (ex: !@#$)",
      met: /[^A-Za-z0-9]/.test(novaSenhaValue),
    },
  ];

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
        <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-titulo-destaque">
            Link Inválido
          </h1>
          <div className="mx-auto mt-3 mb-6 h-1 w-16 rounded bg-destaque" />
          <p className="text-sm text-texto-secundario leading-relaxed mb-6">
            Este link de redefinição de senha é inválido ou está incompleto.
            Solicite um novo link de recuperação.
          </p>
          <Button
            component={Link}
            to={ROUTES.recuperarSenha}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Solicitar novo link
          </Button>
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
        <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destaque/10">
              <CheckCircle className="h-8 w-8 text-destaque" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-titulo-destaque">
            Senha Redefinida
          </h1>
          <div className="mx-auto mt-3 mb-6 h-1 w-16 rounded bg-destaque" />
          <p className="text-sm text-texto-secundario leading-relaxed mb-6">
            Sua senha foi redefinida com sucesso. Você já pode entrar na
            plataforma com a nova senha.
          </p>
          <Button
            onClick={() => navigate(ROUTES.login)}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Ir para o login
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: RedefinirSenhaFormValues) => {
    setError(null);
    try {
      await usuarioApi.redefinirSenha(token, values.novaSenha);
      setSucesso(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao redefinir senha.";
      setError(msg);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
      <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-titulo-destaque">
            Nova Senha
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
        </div>

        <p className="mt-6 text-sm text-texto-secundario leading-relaxed text-center">
          Escolha uma nova senha segura para a sua conta.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <FormField
            label="Nova Senha"
            type={showNova ? "text" : "password"}
            placeholder="Nova senha"
            fieldError={errors.novaSenha}
            {...register("novaSenha")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNova(!showNova)}
                      edge="end"
                      sx={{ borderRadius: "50%" }}
                    >
                      {showNova ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {novaSenhaValue.length > 0 && (
            <div className="mt-0.5 mb-2 text-xs pl-1">
              <ul className="space-y-1">
                {criteria.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                        c.met
                          ? "bg-emerald-500"
                          : "bg-rose-300 dark:bg-rose-800"
                      }`}
                    />
                    <span className="text-texto-secundario font-normal text-[11px]">
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FormField
            label="Confirmar Nova Senha"
            type={showConfirmar ? "text" : "password"}
            placeholder="Confirme a nova senha"
            fieldError={errors.confirmarNovaSenha}
            {...register("confirmarNovaSenha")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmar(!showConfirmar)}
                      edge="end"
                      sx={{ borderRadius: "50%" }}
                    >
                      {showConfirmar ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
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
            {isSubmitting ? "Salvando…" : "Redefinir senha"}
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
