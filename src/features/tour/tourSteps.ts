import type { DriveStep } from "driver.js";
import { openDrawerImperative } from "@/features/accessibility/accessibilityDrawerRef";

export const homeSteps: DriveStep[] = [
  {
    element: "#tour-navbar-logo",
    popover: {
      title: "Voltar à Página Inicial",
      description:
        "Bem-vindo ao Portal de Dados Institucionais da Universidade de Brasília. Clique na logo a qualquer momento para voltar à página inicial.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-navbar-paineis",
    popover: {
      title: "Painéis",
      description:
        "Acesse todos os painéis analíticos disponíveis, organizados por categoria.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-navbar-sugestoes",
    popover: {
      title: "Sugestões",
      description:
        "Envie sugestões de novos painéis, reporte erros ou envie qualquer relato para a equipe.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-navbar-acessibilidade",
    popover: {
      title: "Acessibilidade",
      description:
        "Configure o tema visual (claro, escuro ou alto contraste) e outras preferências de acessibilidade.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-home-search",
    popover: {
      title: "Busca de Painéis",
      description:
        "Digite o nome ou descrição de um painel para encontrá-lo rapidamente. Pressione Enter ou clique em Buscar.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tour-home-btn-ver-paineis",
    popover: {
      title: "Ver Categorias de Painéis",
      description:
        "Clique para navegar pela lista completa com todos os painéis analíticos disponíveis, organizados por categoria.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-navbar-acessibilidade",
    popover: {
      title: "Repetir o Tutorial",
      description:
        "Sempre que quiser ver o tutorial de uma página novamente, abra o painel de Acessibilidade clicando neste botão.",
      side: "bottom",
      align: "end",
      onNextClick: (_el, _step, { driver: d }) => {
        openDrawerImperative();
        setTimeout(() => d.moveNext(), 350);
      },
    },
  },
  {
    element: "#tour-btn-tutorial",
    popover: {
      title: "Botão Tutorial",
      description:
        "Este botão inicia o tutorial da página atual. Ele aparece apenas nas páginas que possuem um guia interativo.",
      side: "left",
      align: "start",
    },
  },
];

export const paineisSteps: DriveStep[] = [
  {
    element: "#tour-paineis-title",
    popover: {
      title: "Painéis",
      description:
        "Esta página exibe todas as categorias de painéis disponíveis. Cada cartão representa uma área temática.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tour-paineis-grid",
    popover: {
      title: "Categorias de Painéis",
      description:
        "Cada cartão representa uma categoria. Passe o mouse sobre um cartão para ver sua descrição e clique para acessar os painéis daquela categoria.",
      side: "top",
      align: "center",
    },
  },
];

export const categoriaSteps: DriveStep[] = [
  {
    element: "#tour-categoria-breadcrumb",
    popover: {
      title: "Navegação (Breadcrumb)",
      description:
        'Mostra o caminho de navegação atual. Clique em "Painéis" para voltar à lista de categorias.',
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-categoria-title",
    popover: {
      title: "Categoria",
      description: "Nome e descrição da categoria atual.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tour-categoria-lista",
    popover: {
      title: "Painéis da Categoria",
      description:
        "Lista de painéis disponíveis nesta categoria. Clique em qualquer cartão para abrir o painel correspondente.",
      side: "top",
      align: "center",
    },
  },
];

export const painelSteps: DriveStep[] = [
  {
    element: "#tour-painel-breadcrumb",
    popover: {
      title: "Navegação",
      description:
        "Use o breadcrumb para voltar à categoria ou à lista de painéis.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-painel-title",
    popover: {
      title: "Painel",
      description:
        "Nome e descrição do painel. O conteúdo interativo é exibido abaixo.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tour-painel-embed",
    popover: {
      title: "Visualização do Painel",
      description:
        "Aqui é exibido o painel interativo. Você pode explorar os dados, aplicar filtros e interagir com os gráficos diretamente.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour-painel-compartilhar",
    popover: {
      title: "Compartilhar",
      description:
        "Compartilhe este painel por link, WhatsApp, X, Facebook, LinkedIn ou e-mail.",
      side: "top",
      align: "end",
    },
  },
  {
    element: "#tour-painel-tela-cheia",
    popover: {
      title: "Tela Cheia",
      description:
        "Expande o painel para ocupar toda a tela, ideal para apresentações e análises detalhadas.",
      side: "top",
      align: "end",
    },
  },
];

export const adminDashboardSteps: DriveStep[] = [
  {
    element: "#tour-admin-header",
    popover: {
      title: "Área Administrativa",
      description:
        "Bem-vindo à área administrativa. Aqui você gerencia todo o conteúdo do portal: pipelines, uploads, categorias, painéis, usuários e sugestões.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-admin-kpis",
    popover: {
      title: "Indicadores (KPIs)",
      description:
        "Painel de métricas em tempo real: total de pipelines, categorias, painéis, volume de dados e status dos serviços.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tour-admin-status",
    popover: {
      title: "Status dos Serviços",
      description:
        "Monitore em tempo real se a API, o banco de dados, o Superset e o Redis estão online.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour-admin-execucoes",
    popover: {
      title: "Últimas Execuções",
      description: "Histórico das execuções de pipeline mais recentes.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour-admin-nav-links",
    popover: {
      title: "Navegação Administrativa",
      description:
        "Acesse rapidamente cada módulo da área administrativa: Pipelines, Uploads, Categorias, Painéis, Usuários e Sugestões.",
      side: "top",
      align: "center",
    },
  },
];

export const adminPipelinesSteps: DriveStep[] = [
  {
    element: "#tour-admin-header",
    popover: {
      title: "Pipelines",
      description:
        "Gerencie os pipelines de processamento de dados. Cada pipeline define como os dados são transformados e disponibilizados.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-pipelines-filterbar",
    popover: {
      title: "Filtros e Busca",
      description:
        "Pesquise pipelines pelo nome e filtre por status (ativas, desativadas ou todas) usando as abas.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-pipelines-nova",
    popover: {
      title: "Nova Pipeline",
      description:
        "Clique para criar uma nova pipeline. Você precisará informar nome, descrição e configurações de execução.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-pipelines-lista",
    popover: {
      title: "Lista de Pipelines",
      description:
        "Cada item exibe nome, status, datas e ações disponíveis. Clique em uma pipeline para ver seus detalhes, ou use os ícones para editar, desativar ou excluir.",
      side: "top",
      align: "center",
    },
  },
];

export const adminUploadSteps: DriveStep[] = [
  {
    element: "#tour-admin-header",
    popover: {
      title: "Uploads / Execuções",
      description:
        "Acompanhe e gerencie as execuções de pipelines. Cada execução representa uma rodada de processamento de dados.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-upload-filterbar",
    popover: {
      title: "Filtros",
      description:
        "Filtre as execuções por status (pendente, em andamento, sucesso, erro) e pesquise por nome de pipeline.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-upload-nova",
    popover: {
      title: "Novo Processamento",
      description:
        "Dispare manualmente uma nova execução de pipeline selecionando a pipeline desejada.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-upload-lista",
    popover: {
      title: "Lista de Execuções",
      description:
        "Cada item mostra a pipeline relacionada, status, tempo de execução e logs. Clique no ícone de olho para ver os detalhes completos ou no de reload para fazer Rollback e desfazer o upload dos dados relacioados à execução.",
      side: "top",
      align: "center",
    },
  },
];

export const adminCategoriasSteps: DriveStep[] = [
  {
    element: "#tour-admin-header",
    popover: {
      title: "Categorias",
      description:
        "Gerencie as categorias que organizam os painéis do portal. Cada categoria agrupa painéis de um mesmo tema.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-categorias-filterbar",
    popover: {
      title: "Filtros",
      description:
        "Pesquise categorias pelo nome e filtre por status (ativas ou desativadas).",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-categorias-nova",
    popover: {
      title: "Nova Categoria",
      description:
        "Crie uma nova categoria informando nome, descrição e, opcionalmente, uma imagem de capa.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-categorias-lista",
    popover: {
      title: "Lista de Categorias",
      description:
        "Cada item mostra nome, status, quantidade de painéis e datas. Use o ícone de lápis para editar ou os demais ícones para ativar/desativar.",
      side: "top",
      align: "center",
    },
  },
];

export const adminPaineisSteps: DriveStep[] = [
  {
    element: "#tour-admin-header",
    popover: {
      title: "Painéis Administrativos",
      description:
        "Gerencie todos os painéis do portal: crie novos, edite existentes, ative ou desative e vincule a categorias.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-paineis-admin-filterbar",
    popover: {
      title: "Filtros",
      description:
        "Pesquise painéis pelo nome e filtre por status ou categoria.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-paineis-admin-novo",
    popover: {
      title: "Novo Painel",
      description:
        "Crie um novo painel informando nome, categoria, URL de embed do Superset e descrição.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-paineis-admin-lista",
    popover: {
      title: "Lista de Painéis",
      description:
        "Clique em qualquer painel para visualizar seus detalhes. Use o ícone de lápis para editar ou os demais para ativar/desativar.",
      side: "top",
      align: "center",
    },
  },
];

export const adminUsuariosSteps: DriveStep[] = [
  {
    element: "#tour-admin-header",
    popover: {
      title: "Usuários",
      description:
        "Gerencie os usuários com acesso à área administrativa. Aprove cadastros pendentes, altere permissões ou desative contas.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-usuarios-filterbar",
    popover: {
      title: "Filtros",
      description:
        "Filtre usuários por status (pendentes, ativos, desativados) e pesquise pelo nome ou e-mail.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-usuarios-lista",
    popover: {
      title: "Lista de Usuários",
      description:
        "Cada item exibe o nome, e-mail, cargo e status do usuário. Clique para ver detalhes completos e gerenciar a conta.",
      side: "top",
      align: "center",
    },
  },
];

export const adminSugestoesSteps: DriveStep[] = [
  {
    element: "#tour-admin-header",
    popover: {
      title: "Sugestões",
      description:
        "Gerencie as sugestões e relatos enviados pelos usuários do portal.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-sugestoes-filterbar",
    popover: {
      title: "Filtros",
      description:
        "Filtre sugestões por status (pendentes, analisadas, descartadas) e pesquise pelo título ou conteúdo.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-sugestoes-lista",
    popover: {
      title: "Lista de Sugestões",
      description:
        "Cada item mostra título, tipo, e-mail de contato e status. Clique para abrir os detalhes e registrar uma análise ou descarte.",
      side: "top",
      align: "center",
    },
  },
];
