import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, CalendarDays, Shield, Key } from "lucide-react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/features/auth/useAuth";
import {
  alterarSenhaSchema,
  type AlterarSenhaFormValues,
} from "@/schemas/forms";
import { toast } from "sonner";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";

export const PerfilPage = () => {
  const { user, alterarSenha } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AlterarSenhaFormValues>({
    resolver: zodResolver(alterarSenhaSchema),
  });

  const onSubmit = async (values: AlterarSenhaFormValues) => {
    const result = await alterarSenha(values);
    if (result.ok) {
      reset();
      toast.success("Senha alterada com sucesso.");
    } else {
      setError("root", { message: result.error ?? "Erro ao alterar senha." });
    }
  };

  const infoCard = (icon: React.ReactNode, label: string, value: string) => (
    <div className="rounded border border-borda-padrao bg-fundo-superficie-suave px-5 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-texto-secundario">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 font-bold text-texto-principal">{value}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
      <h1 className="text-2xl font-black text-texto-principal">Perfil</h1>

      {/* Info cards */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {infoCard(
          <User className="h-3.5 w-3.5" />,
          "Nome",
          user ? `${user.nome} ${user.ultimoNome}` : "—",
        )}
        {infoCard(
          <Mail className="h-3.5 w-3.5" />,
          "E-mail",
          user?.email ?? "—",
        )}
        {infoCard(
          <CalendarDays className="h-3.5 w-3.5" />,
          "Data de Cadastro",
          user ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "—",
        )}
        {infoCard(
          <Shield className="h-3.5 w-3.5" />,
          "Cargo",
          user?.cargo ?? "—",
        )}
      </div>

      {/* Alterar senha */}
      <div className="mt-6 rounded border border-borda-padrao bg-fundo-superficie p-6 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-texto-principal">
          <Key className="h-5 w-5 text-destaque" />
          Alterar Senha
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-1 sm:max-w-sm"
        >
          <FormField
            label="Senha atual"
            type="password"
            placeholder="Sua senha atual"
            fieldError={errors.senhaAtual}
            {...register("senhaAtual")}
          />
          <FormField
            label="Nova senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            fieldError={errors.novaSenha}
            {...register("novaSenha")}
          />
          <FormField
            label="Confirmar nova senha"
            type="password"
            placeholder="Repita a nova senha"
            fieldError={errors.confirmarNovaSenha}
            {...register("confirmarNovaSenha")}
          />

          <AlertBanner message={errors.root?.message} />

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {isSubmitting ? "Salvando…" : "Alterar senha"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
