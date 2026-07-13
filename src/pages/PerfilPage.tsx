import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  CalendarDays,
  Briefcase,
  Key,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "@/features/auth/useAuth";
import {
  alterarSenhaSchema,
  type AlterarSenhaFormValues,
} from "@/schemas/forms";
import { toast } from "sonner";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import { MuiConfirmDialog } from "@/components/ui/MuiConfirmDialog";
import { ROUTES } from "@/utils/constants";

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
    bgcolor: "var(--color-fundo-superficie)",
    color: "var(--color-texto-principal)",
    "& fieldset": { borderColor: "var(--color-borda-padrao)" },
    "&:hover fieldset": { borderColor: "var(--color-borda-padrao) !important" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-destaque) !important",
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--color-texto-secundario)",
    "&.Mui-focused": { color: "var(--color-destaque) !important" },
  },
};

export const PerfilPage = () => {
  const { user, alterarSenha, deletarConta, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteSenha, setDeleteSenha] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AlterarSenhaFormValues>({
    resolver: zodResolver(alterarSenhaSchema),
  });

  const novaSenhaValue = watch("novaSenha", "");

  const passwordCriteria = [
    { label: "Mínimo de 8 caracteres", met: novaSenhaValue.length >= 8 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(novaSenhaValue) },
    { label: "Uma letra minúscula", met: /[a-z]/.test(novaSenhaValue) },
    { label: "Um número", met: /[0-9]/.test(novaSenhaValue) },
    {
      label: "Um caractere especial (ex: !@#$)",
      met: /[^A-Za-z0-9]/.test(novaSenhaValue),
    },
  ];

  const onSubmit = async (values: AlterarSenhaFormValues) => {
    const result = await alterarSenha(values);
    if (result.ok) {
      reset();
      toast.success("Senha alterada com sucesso.");
    } else {
      setError("root", { message: result.error ?? "Erro ao alterar senha." });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setIsDeleting(true);
    const result = await deletarConta(deleteSenha);
    setIsDeleting(false);
    if (result.ok) {
      toast.success("Conta excluída com sucesso.");
      navigate(ROUTES.home);
    } else {
      setDeleteError(result.error ?? "Erro ao excluir conta.");
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteSenha("");
    setDeleteError("");
  };

  const cargoBadgeClass =
    user?.cargo === "SuperAdministrador"
      ? "bg-[#6b4683] text-white border border-[#6b4683]/10"
      : user?.cargo === "Administrador"
        ? "bg-[#0369a1] text-white border border-[#0369a1]/10"
        : "bg-[#64748b] text-white border border-[#64748b]/10";

  const cargoLabel =
    user?.cargo === "SuperAdministrador" ? "Super Admin" : (user?.cargo ?? "—");

  const passwordAdornment = (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPasswords((v) => !v)}
        edge="end"
        sx={{ borderRadius: "50%" }}
      >
        {showPasswords ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </IconButton>
    </InputAdornment>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeaderCard
        title="Meu Perfil"
        description="Gerencie suas informações pessoais, altere sua senha e controle sua conta."
      />

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <div className="lg:col-span-2 rounded bg-fundo-superficie px-5 py-4 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-texto-secundario mb-1.5">
            <User className="h-3.5 w-3.5 shrink-0" />
            Nome
          </div>
          <p className="font-bold text-texto-principal truncate">
            {user ? `${user.nome} ${user.ultimoNome}` : "—"}
          </p>
        </div>
        <div className="lg:col-span-2 rounded bg-fundo-superficie px-5 py-4 shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-texto-secundario mb-1.5">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            E-mail
          </div>
          <p className="font-bold text-texto-principal truncate">
            {user?.email ?? "—"}
          </p>
        </div>
        <div className="lg:col-span-1 rounded bg-fundo-superficie px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-texto-secundario mb-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            Membro desde
          </div>
          <p className="font-bold text-texto-principal">
            {user ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "—"}
          </p>
        </div>
        <div className="lg:col-span-1 rounded bg-fundo-superficie px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-texto-secundario mb-1.5">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            Cargo
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold select-none ${cargoBadgeClass}`}
          >
            {cargoLabel}
          </span>
        </div>
      </div>

      {/* Alterar senha + Excluir conta — mesmo card */}
      <div className="rounded bg-fundo-superficie shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-borda-padrao">
          {/* Esquerda: Alterar Senha */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Key className="h-5 w-5 text-destaque shrink-0" />
              <h2 className="text-base font-extrabold text-texto-principal">
                Alterar Senha
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <TextField
                label="Senha atual"
                placeholder="Digite sua senha atual"
                type={showPasswords ? "text" : "password"}
                size="small"
                fullWidth
                error={!!errors.senhaAtual}
                helperText={errors.senhaAtual?.message}
                slotProps={{
                  input: { endAdornment: passwordAdornment },
                }}
                sx={textFieldSx}
                {...register("senhaAtual")}
              />
              <TextField
                label="Nova senha"
                placeholder="Digite a nova senha"
                type={showPasswords ? "text" : "password"}
                size="small"
                fullWidth
                error={!!errors.novaSenha}
                helperText={errors.novaSenha?.message}
                slotProps={{
                  input: { endAdornment: passwordAdornment },
                }}
                sx={textFieldSx}
                {...register("novaSenha")}
              />

              {novaSenhaValue.length > 0 && (
                <div className="-mt-1 mb-1 text-xs pl-1">
                  <ul className="space-y-1">
                    {passwordCriteria.map((c, idx) => (
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

              <TextField
                label="Confirmar nova senha"
                placeholder="Repita a nova senha"
                type={showPasswords ? "text" : "password"}
                size="small"
                fullWidth
                error={!!errors.confirmarNovaSenha}
                helperText={errors.confirmarNovaSenha?.message}
                slotProps={{
                  input: { endAdornment: passwordAdornment },
                }}
                sx={textFieldSx}
                {...register("confirmarNovaSenha")}
              />

              <AlertBanner message={errors.root?.message} />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : null
                  }
                  sx={{
                    borderRadius: "4px",
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "var(--color-azul-unb)",
                    "&:hover": { bgcolor: "var(--color-azul-unb-hover)" },
                  }}
                >
                  {isSubmitting ? "Salvando…" : "Alterar Senha"}
                </Button>
              </div>
            </form>
          </div>

          {/* Direita: Excluir Conta — bloqueado para SuperAdmin */}
          <div className="p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="h-5 w-5 text-rose-600 shrink-0" />
              <h2 className="text-base font-extrabold text-texto-principal">
                Excluir Conta
              </h2>
            </div>
            <p className="text-[0.9375rem] leading-relaxed text-texto-secundario flex-1 flex items-center justify-center">
              {isSuperAdmin
                ? "Contas de Super Administrador não podem ser excluídas."
                : "Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos do sistema."}
            </p>
            <div className="flex justify-end mt-6">
              <Button
                variant="contained"
                disabled={isSuperAdmin}
                onClick={() => setShowDeleteDialog(true)}
                startIcon={<Trash2 className="h-4 w-4" />}
                sx={{
                  borderRadius: "4px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "var(--color-vermelho-escuro, #dc2626)",
                  "&:hover": { bgcolor: "#b91c1c" },
                  "&.Mui-disabled": { opacity: 0.5 },
                }}
              >
                Excluir minha conta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete dialog */}
      <MuiConfirmDialog
        open={showDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteAccount}
        title="Excluir Conta"
        description="Para confirmar a exclusão permanente da sua conta, digite sua senha abaixo."
        confirmText="Excluir Conta"
        cancelText="Cancelar"
        confirmTone="danger"
        isLoading={isDeleting}
      >
        <div className="flex flex-col gap-3 mt-3">
          <TextField
            label="Senha"
            type="password"
            size="small"
            fullWidth
            value={deleteSenha}
            onChange={(e) => setDeleteSenha(e.target.value)}
            error={!!deleteError}
            helperText={deleteError || undefined}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={textFieldSx}
          />
        </div>
      </MuiConfirmDialog>
    </div>
  );
};
