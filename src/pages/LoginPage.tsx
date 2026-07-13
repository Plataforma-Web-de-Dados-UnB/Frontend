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
import { Eye, EyeOff } from "lucide-react";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    const result = await login(values);
    if (result.ok) {
      navigate("/admin");
    } else {
      if (
        result.error ===
        "Seu cadastro está pendente de aprovação pelo administrador."
      ) {
        navigate(ROUTES.cadastroPendente, {
          state: { email: values.email, allowed: true },
        });
      } else {
        setError("root", { message: result.error ?? "Credenciais inválidas." });
      }
    }
  };

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
            label="E-mail"
            type="email"
            placeholder="Seu email"
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
                      sx={{ borderRadius: "50%" }}
                    >
                      {showPassword ? (
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

          <div className="flex justify-end -mt-2">
            <Button
              component={Link}
              to={ROUTES.recuperarSenha}
              sx={{
                color: "var(--color-texto-secundario)",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.8rem",
                padding: "2px 4px",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "var(--color-destaque)",
                },
              }}
            >
              Esqueceu sua senha?
            </Button>
          </div>

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
