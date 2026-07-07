import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/features/auth/useAuth";
import { loginSchema, type LoginFormValues } from "@/schemas/forms";
import { ROUTES } from "@/utils/constants";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Eye, EyeOff, Clock } from "lucide-react";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login(values);
    if (result.ok) {
      navigate(ROUTES.home);
    } else {
      if (result.error === "Seu cadastro está pendente de aprovação pelo administrador.") {
        setPendingEmail(values.email);
        setIsPending(true);
      } else {
        setError("root", { message: result.error ?? "Credenciais inválidas." });
      }
    }
  };

  if (isPending) {
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

          <div className="w-full space-y-2 rounded bg-fundo-superficie-suave p-4 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-texto-secundario">Status da Conta:</span>
              <span className="font-semibold text-aviso">Pendente</span>
            </div>
            <div className="flex justify-between">
              <span className="text-texto-secundario">E-mail:</span>
              <span className="text-texto-principal">
                {pendingEmail}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-texto-secundario">Permissões:</span>
              <span className="text-texto-principal">
                Leitura (Pública)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-texto-secundario">Próximo Passo:</span>
              <span className="text-texto-principal">
                Aguarde notificação por e-mail
              </span>
            </div>
          </div>

          <Button
            onClick={() => { setIsPending(false); navigate(ROUTES.home); }}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Ir para a Página Inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
      <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-azul-unb">
            Entrar
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4"
        >
          <FormField
            label="Email Institucional"
            type="email"
            placeholder="seu@unb.br"
            fieldError={errors.email}
            spellCheck={false}
            {...register("email")}
          />

          <FormField
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Sua senha"
            fieldError={errors.senha}
            {...register("senha")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <AlertBanner message={errors.root?.message} />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 1 }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-1 text-sm text-texto-secundario">
          <span>Não tem uma conta?</span>
          <Button
            component={Link}
            to={ROUTES.cadastro}
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
              "&:hover::after": {
                transform: "scaleX(1)",
              },
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            Cadastrar-se
          </Button>
        </div>
      </div>
    </div>
  );
};
