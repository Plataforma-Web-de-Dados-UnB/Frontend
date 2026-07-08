import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { useAuth } from "@/features/auth/useAuth";
import { cadastroSchema, type CadastroFormValues } from "@/schemas/forms";
import { ROUTES } from "@/utils/constants";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export const CadastroPage = () => {
  const { cadastro } = useAuth();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(100);
  const [timerId, setTimerId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormValues>({ resolver: zodResolver(cadastroSchema) });

  const senhaValue = watch("senha", "");

  const criteria = [
    { label: "Mínimo de 8 caracteres", met: senhaValue.length >= 8 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(senhaValue) },
    { label: "Uma letra minúscula", met: /[a-z]/.test(senhaValue) },
    { label: "Um número", met: /[0-9]/.test(senhaValue) },
    { label: "Um caractere especial (ex: !@#$)", met: /[^A-Za-z0-9]/.test(senhaValue) },
  ];

  const onSubmit = async (values: CadastroFormValues) => {
    const result = await cadastro(values);
    if (result.ok) {
      setSuccess(true);
      const duration = 5000;
      const intervalTime = 100;
      let elapsed = 0;
      const timer = window.setInterval(() => {
        elapsed += intervalTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (elapsed >= duration) {
          window.clearInterval(timer);
          navigate(ROUTES.login);
        }
      }, intervalTime);
      setTimerId(timer);
    } else {
      setError("root", { message: result.error ?? "Erro ao cadastrar." });
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
        <div className="w-full max-w-md rounded bg-fundo-superficie p-8 shadow-sm text-center flex flex-col items-center justify-center gap-6">
          <CheckCircle2 className="h-16 w-16 text-sucesso" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-azul-unb">
            Cadastro Solicitado!
          </h2>
          <div className="h-1 w-16 rounded bg-destaque" />
          <p className="text-base text-texto-secundario">
            Sua conta foi criada com sucesso e está aguardando aprovação de um administrador.
          </p>
          <div className="w-full space-y-2 mt-2">
            <p className="text-xs text-texto-secundario">
              Redirecionando para a tela de login em {Math.ceil((progress / 100) * 5)} segundos...
            </p>
            <LinearProgress variant="determinate" value={progress} color="secondary" />
          </div>
          <Button
            onClick={() => {
              if (timerId) window.clearInterval(timerId);
              navigate(ROUTES.login);
            }}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Ir para o Login Agora
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
            Cadastro
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
          <p className="mt-4 text-sm text-texto-secundario">
            O cadastro precisará ser aprovado por um administrador antes de
            receber acesso ao sistema.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Nome"
              placeholder="Seu primeiro nome"
              fieldError={errors.nome}
              {...register("nome")}
            />
            <FormField
              label="Sobrenome"
              placeholder="Seu sobrenome"
              fieldError={errors.ultimoNome}
              {...register("ultimoNome")}
            />
          </div>

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
            type={showPasswords ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            fieldError={errors.senha}
            {...register("senha")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(!showPasswords)}
                      edge="end"
                      sx={{ borderRadius: "50%" }}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {senhaValue.length > 0 && (
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
            label="Confirme a senha"
            type={showPasswords ? "text" : "password"}
            placeholder="Repita a senha"
            fieldError={errors.confirmarSenha}
            {...register("confirmarSenha")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(!showPasswords)}
                      edge="end"
                      sx={{ borderRadius: "50%" }}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
            {isSubmitting ? "Cadastrando…" : "Cadastrar"}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-1 text-sm text-texto-secundario">
          <span>Já tem uma conta?</span>
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
              "&:hover::after": {
                transform: "scaleX(1)",
              },
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
};
