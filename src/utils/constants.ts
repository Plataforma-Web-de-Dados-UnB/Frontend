export const APP_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_URL as string,
  defaultPageSize: 10,
  supersetUrl: (import.meta.env.VITE_SUPERSET_URL as string) || "",
} as const;

export const ROUTES = {
  home: "/",
  paineis: "/paineis",
  categoria: "/paineis/categoria/:id",
  painel: "/paineis/painel/:id",
  sugestao: "/sugestao",
  login: "/entrar",
  cadastro: "/cadastro",
  cadastroPendente: "/cadastro/pendente",
  perfil: "/perfil",
  // Admin
  adminPipelines: "/admin/pipelines",
  adminUpload: "/admin/upload",
  adminCategorias: "/admin/categorias",
  adminPaineis: "/admin/paineis",
  adminUsuarios: "/admin/usuarios",
} as const;
