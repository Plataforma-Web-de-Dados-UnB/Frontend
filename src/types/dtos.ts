// ─── Paginação ────────────────────────────────────────────────
export type ResultadoPaginado<T> = {
  itens: T[];
  totalItens: number;
  totalPaginas: number;
  page: number;
  limit: number;
};

// ─── Usuário ──────────────────────────────────────────────────
export type CargoUsuario = "SuperAdministrador" | "Administrador" | "Visitante";
export type StatusUsuario = "Pendente" | "Ativo" | "Recusado";

export type UsuarioGetDto = {
  id: string;
  nome: string;
  ultimoNome: string;
  email: string;
  cargo: CargoUsuario;
  status: StatusUsuario;
  createdAt: string;
  updatedAt: string;
};

export type LoginDto = {
  email: string;
  senha: string;
};

export type LoginResponseDto = {
  accessToken: string;
  refreshToken: string;
};

export type CadastroDto = {
  nome: string;
  ultimoNome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export type AlterarSenhaDto = {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

// ─── Categoria ────────────────────────────────────────────────
export type CategoriaGetDto = {
  id: number;
  nome: string;
  descricao: string | null;
  imagemUrl: string | null;
  sortOrdem: number;
  active: boolean;
  deactivatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  quantidadePaineis?: number;
};

export type CategoriaCreateDto = {
  nome: string;
  descricao?: string;
  sortOrdem?: number;
  imagem?: File;
};

// ─── Painel ───────────────────────────────────────────────────
export type PainelGetDto = {
  id: number;
  nome: string;
  descricao: string | null;
  graphEmbedLink: string;
  embedDashboardUuid: string | null;
  sortOrdem: number;
  categoriaId: number;
  categoriaNome: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PainelCreateDto = {
  nome: string;
  descricao?: string;
  graphEmbedLink: string;
  embedDashboardUuid?: string;
  sortOrdem?: number;
  categoriaId: number;
};

export type PainelUpdateDto = PainelCreateDto;

// ─── Pipeline ─────────────────────────────────────────────────
export type PipelineGetDto = {
  id: number;
  nome: string;
  descricao: string | null;
  scriptPython: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PipelineCreateDto = {
  nome: string;
  descricao?: string;
  scriptPython: string;
};

export type PipelineUpdateDto = PipelineCreateDto;

export type StatusPipelineExecucao = 0 | 1 | 2 | 3 | 4 | 5;
export const StatusPipelineLabel: Record<StatusPipelineExecucao, string> = {
  0: "Pendente",
  1: "Processando",
  2: "Sucesso",
  3: "Erro",
  4: "Cancelado",
  5: "Rollback",
};

export type PipelineExecucaoGetDto = {
  id: number;
  pipelineId: number;
  pipelineNome: string;
  batchId: string;
  tabelaSilver: string;
  tabelaGold: string;
  status: StatusPipelineExecucao;
  mensagem: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UploadPreviewDto = {
  batchId: string;
  colunas: string[];
  totalLinhas: number;
  primeirasLinhas: Record<string, string>[];
};

export type PipelineExecucaoCreateDto = {
  pipelineId: number;
  batchId: string;
  tabelaSilver: string;
  tabelaGold: string;
};

// ─── Sugestão ─────────────────────────────────────────────────
export type TipoSugestao = 0 | 1 | 2;
export type StatusSugestao = 0 | 1 | 2;

export const TipoSugestaoLabel: Record<TipoSugestao, string> = {
  0: "Sugestão",
  1: "Erro",
  2: "Relato",
};

export const StatusSugestaoLabel: Record<StatusSugestao, string> = {
  0: "Pendente",
  1: "Analisado",
  2: "Descartado",
};

export type SugestaoCreateDto = {
  tipo: TipoSugestao;
  titulo: string;
  descricao: string;
  nomeContato?: string | null;
  emailContato?: string | null;
};

export type SugestaoGetDto = {
  id: number;
  tipo: TipoSugestao;
  titulo: string;
  descricao: string;
  nomeContato: string | null;
  emailContato: string | null;
  status: StatusSugestao;
  createdAt: string;
  updatedAt: string;
};

export type SugestaoListDto = {
  id: number;
  tipo: TipoSugestao;
  titulo: string;
  nomeContato: string | null;
  emailContato: string | null;
  status: StatusSugestao;
  createdAt: string;
};
