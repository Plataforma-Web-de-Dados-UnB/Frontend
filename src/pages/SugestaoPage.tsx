import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import { sugestaoApi } from "@/services/sugestaoApi";
import { sugestaoSchema, type SugestaoFormValues } from "@/schemas/forms";
import { isApiError } from "@/types/api";
import { FormField } from "@/components/ui/FormField";
import { AlertBanner } from "@/components/ui/AlertBanner";

export const SugestaoPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SugestaoFormValues>({ resolver: zodResolver(sugestaoSchema) });

  const onSubmit = async (values: SugestaoFormValues) => {
    try {
      await sugestaoApi.create({
        ...values,
        tipo: Number(values.tipo),
      });
      setSubmitted(true);
    } catch (err) {
      const msg = isApiError(err) ? err.message : "Erro ao enviar sugestão.";
      setError("root", { message: msg });
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
        <div className="w-full max-w-lg rounded bg-fundo-superficie p-8 shadow-sm text-center flex flex-col items-center justify-center gap-6">
          <CheckCircle2 className="h-16 w-16 text-sucesso" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-azul-unb">
            Solicitação Enviada!
          </h2>
          <div className="h-1 w-16 rounded bg-destaque" />
          <p className="text-base text-texto-secundario max-w-md">
            Obrigado pela sua contribuição. Nossa equipe irá analisar a sua mensagem.
          </p>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ mt: 2, px: 4 }}
          >
            Voltar para a Página Inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-fundo-pagina px-4 py-8">
      <div className="w-full max-w-lg rounded bg-fundo-superficie p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-azul-unb">
            Sugestões e Relatos
          </h1>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
          <p className="mt-4 text-sm text-texto-secundario">
            Não encontrou o painel que procurava, identificou algum erro ou gostaria de enviar um relato/sugestão? Preencha o formulário abaixo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-4"
        >
          <FormField
            select
            label="Tipo de solicitação"
            defaultValue=""
            fieldError={errors.tipo}
            {...register("tipo")}
            slotProps={{
              select: {
                native: false,
                displayEmpty: true,
              },
              inputLabel: {
                shrink: true,
              },
            }}
          >
            <MenuItem value="" disabled>
              Selecione o tipo de solicitação
            </MenuItem>
            <MenuItem value="0">Sugestão de Painel</MenuItem>
            <MenuItem value="1">Apontamento de Erro</MenuItem>
            <MenuItem value="2">Relato ou Feedback</MenuItem>
          </FormField>

          <FormField
            label="Título"
            placeholder="Título curto da sua solicitação"
            fieldError={errors.titulo}
            {...register("titulo")}
          />

          <FormField
            label="Descrição"
            placeholder="Descreva detalhadamente sua sugestão, erro ou relato..."
            fieldError={errors.descricao}
            multiline
            rows={5}
            {...register("descricao")}
          />

          <FormField
            label="Seu Nome"
            placeholder="Nome para contato"
            fieldError={errors.nomeContato}
            {...register("nomeContato")}
          />

          <FormField
            label="Seu E-mail"
            type="email"
            placeholder="seu@email.com"
            fieldError={errors.emailContato}
            {...register("emailContato")}
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
            {isSubmitting ? "Enviando…" : "Enviar Solicitação"}
          </Button>
        </form>
      </div>
    </div>
  );
};
