import { z } from "zod";

const passwordComplexitySchema = z
  .string()
  .min(8, "A senha deve ter ao menos 8 caracteres.")
  .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula.")
  .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula.")
  .regex(/[0-9]/, "A senha deve conter ao menos um número.")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter ao menos um caractere especial.");

export const loginSchema = z.object({
  email: z.email("E-mail inválido."),
  senha: z.string().min(1, "Senha obrigatória."),
});

export const cadastroSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres."),
    ultimoNome: z.string().min(2, "Sobrenome deve ter ao menos 2 caracteres."),
    email: z.email("E-mail inválido."),
    senha: passwordComplexitySchema,
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

export const alterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual obrigatória."),
    novaSenha: passwordComplexitySchema,
    confirmarNovaSenha: z.string(),
  })
  .refine((d) => d.novaSenha === d.confirmarNovaSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarNovaSenha"],
  });

export const categoriaSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório."),
  descricao: z.string().optional(),
  sortOrdem: z.number().int().min(0).optional(),
});

export const painelSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório."),
  descricao: z.string().optional(),
  graphEmbedLink: z.url("Informe uma URL válida."),
  embedDashboardUuid: z.uuid("Informe um UUID válido."),
  sortOrdem: z.number().int().min(0).optional(),
  categoriaId: z.number().int().min(1, "Selecione uma categoria."),
});

export const pipelineSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório."),
  descricao: z.string().optional(),
  scriptPython: z.string().min(1, "Script Python obrigatório."),
});

export const sugestaoSchema = z.object({
  tipo: z.string().min(1, "Selecione o tipo de solicitação."),
  titulo: z
    .string()
    .min(3, "O título deve ter ao menos 3 caracteres.")
    .max(255, "Máximo de 255 caracteres."),
  descricao: z.string().min(10, "A descrição deve ter ao menos 10 caracteres."),
  nomeContato: z
    .string()
    .max(255, "Máximo de 255 caracteres.")
    .optional()
    .or(z.literal("")),
  emailContato: z
    .string()
    .email("E-mail inválido.")
    .max(255, "Máximo de 255 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CadastroFormValues = z.infer<typeof cadastroSchema>;
export type AlterarSenhaFormValues = z.infer<typeof alterarSenhaSchema>;
export type CategoriaFormValues = z.infer<typeof categoriaSchema>;
export type PainelFormValues = z.infer<typeof painelSchema>;
export type PipelineFormValues = z.infer<typeof pipelineSchema>;
export type SugestaoFormValues = z.infer<typeof sugestaoSchema>;
