import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { PageHeaderCard } from "@/components/ui/PageHeaderCard";
import { api } from "@/services/api";
import { pipelineApi } from "@/services/pipelineApi";
import type { PipelineExecucaoGetDto } from "@/types/dtos";
import { ROUTES } from "@/utils/constants";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutList,
  ChartColumnBig,
  RefreshCw,
  MessageSquare,
  Users,
  Database,
  CodeXml,
} from "lucide-react";

interface KpiData {
  totalPipelines: number;
  totalCategorias: number;
  totalPaineis: number;
  volumeBronze: number;
  volumeSilver: number;
  volumeGold: number;
  linhasBronze: number;
  linhasSilver: number;
  linhasGold: number;
  databaseOnline: boolean;
  supersetOnline: boolean;
  redisOnline: boolean;
  totalSugestoesPendentes: number;
  totalUsuariosPendentes: number;
}

const CharacterRoll = ({ text }: { text: string }) => {
  return (
    <span className="flex overflow-hidden select-none">
      {text.split("").map((char, index) => {
        // eslint-disable-next-line react-hooks/purity
        const direction = Math.random() > 0.5 ? 1 : -1;
        return (
          <motion.span
            key={`${char}-${index}-${text}`}
            initial={{ y: direction * 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -direction * 15, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 24,
              delay: index * 0.05,
            }}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </span>
  );
};

const VolumeCard = ({
  title,
  value,
  rows,
  desc,
  icon: Icon,
  loading,
  formatRows,
  iconColor,
  iconBg,
}: {
  title: string;
  value: string;
  rows: number;
  desc: string;
  icon: React.ElementType;
  loading: boolean;
  formatRows: (n: number) => string;
  iconColor: string;
  iconBg: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded bg-fundo-superficie p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-transparent hover:border-destaque/10 flex flex-col justify-between min-h-[140px] cursor-default"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-texto-secundario">
            {title}
          </span>

          <div className="h-8 relative mt-1 overflow-hidden">
            <AnimatePresence>
              {!isHovered ? (
                <motion.div
                  key="bytes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl font-black text-azul-unb truncate select-none absolute inset-0 flex items-center"
                >
                  {loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CharacterRoll text={value} />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="lines"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-2xl font-black text-azul-unb truncate select-none absolute inset-0 flex items-center"
                >
                  {loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CharacterRoll text={`${formatRows(rows)} registros`} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div
          style={{ color: iconColor, backgroundColor: iconBg }}
          className="flex h-12 w-12 items-center justify-center rounded shrink-0"
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-xs text-texto-secundario font-medium">{desc}</p>
    </div>
  );
};

export const AdminDashboardPage = () => {
  const { user, isSuperAdmin } = useAuth();
  const [kpis, setKpis] = useState<KpiData>({
    totalPipelines: 0,
    totalCategorias: 0,
    totalPaineis: 0,
    volumeBronze: 0,
    volumeSilver: 0,
    volumeGold: 0,
    linhasBronze: 0,
    linhasSilver: 0,
    linhasGold: 0,
    databaseOnline: false,
    supersetOnline: false,
    redisOnline: false,
    totalSugestoesPendentes: 0,
    totalUsuariosPendentes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [executions, setExecutions] = useState<PipelineExecucaoGetDto[]>([]);
  const [execLoading, setExecLoading] = useState(true);

  const fetchKpis = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<KpiData>("/admin/kpis");
      setKpis(data);
    } catch (err) {
      console.error("Erro ao carregar KPIs do dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExecutions = async () => {
    try {
      setExecLoading(true);
      const data = await pipelineApi.listExecucoes(1, 3);
      setExecutions(data.itens || []);
    } catch (err) {
      console.error("Erro ao carregar execuções do dashboard:", err);
    } finally {
      setExecLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchKpis();
    fetchExecutions();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatRows = (num: number) => {
    if (num < 1000) return num.toString();
    if (num >= 1000000000) {
      const val = num / 1000000000;
      return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + "bi";
    }
    if (num >= 1000000) {
      const val = num / 1000000;
      return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + "mi";
    }
    return num.toLocaleString("pt-BR");
  };

  const getStatusBadgeStyle = (status: string | number) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case "0":
      case "pendente":
        return "bg-[#d97706] text-white";
      case "1":
      case "processando":
        return "bg-[#2563eb] text-white";
      case "2":
      case "sucesso":
        return "bg-[#16a34a] text-white";
      case "3":
      case "erro":
        return "bg-[#dc2626] text-white";
      case "4":
      case "cancelado":
        return "bg-[#64748b] text-white";
      case "5":
      case "rollback":
        return "bg-[#991b1b] text-white";
      default:
        return "bg-[#64748b] text-white";
    }
  };

  const getStatusLabel = (status: string | number) => {
    const s = String(status).toLowerCase();
    if (s === "0" || s === "pendente") return "Pendente";
    if (s === "1" || s === "processando") return "Processando";
    if (s === "2" || s === "sucesso") return "Sucesso";
    if (s === "3" || s === "erro") return "Erro";
    if (s === "4" || s === "cancelado") return "Cancelado";
    if (s === "5" || s === "rollback") return "Rollback";
    return String(status);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <PageHeaderCard
        title={`Olá, ${user?.nome || "Administrador"}!`}
        description="Bem-vindo à Área Administrativa do Portal de Dados. Aqui você pode gerenciar painéis, categorias, pipelines de dados e acompanhar o status de integridade do ambiente."
      />

      {/* Grid de KPIs Principais */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-texto-secundario mb-4 border-l-4 border-destaque pl-3">
          Visão Geral do Sistema
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:has-[[data-superadmin]]:grid-cols-5">
          {/* Card Pipelines */}
          <Link
            to={ROUTES.adminPipelines}
            className="group relative overflow-hidden rounded bg-fundo-superficie p-6 shadow-sm border-[2.5px] border-transparent hover:border-destaque/55 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-bold text-texto-secundario">
                    Pipelines
                  </span>
                  <h3 className="mt-2 text-3xl font-black text-texto-principal">
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      kpis.totalPipelines
                    )}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded bg-fundo-superficie-suave text-azul-unb shrink-0">
                  <CodeXml className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-texto-secundario font-medium">
                Pipelines de dados cadastradas
              </p>
            </div>
          </Link>

          {/* Card Categorias */}
          <Link
            to={ROUTES.adminCategorias}
            className="group relative overflow-hidden rounded bg-fundo-superficie p-6 shadow-sm border-[2.5px] border-transparent hover:border-destaque/55 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-bold text-texto-secundario">
                    Categorias
                  </span>
                  <h3 className="mt-2 text-3xl font-black text-texto-principal">
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      kpis.totalCategorias
                    )}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded bg-fundo-superficie-suave text-azul-unb shrink-0">
                  <LayoutList className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-texto-secundario font-medium">
                Agrupamentos temáticos dos painéis públicos
              </p>
            </div>
          </Link>

          {/* Card Painéis */}
          <Link
            to={ROUTES.adminPaineis}
            className="group relative overflow-hidden rounded bg-fundo-superficie p-6 shadow-sm border-[2.5px] border-transparent hover:border-destaque/55 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-bold text-texto-secundario">
                    Painéis Publicados
                  </span>
                  <h3 className="mt-2 text-3xl font-black text-texto-principal">
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      kpis.totalPaineis
                    )}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded bg-fundo-superficie-suave text-azul-unb shrink-0">
                  <ChartColumnBig className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-texto-secundario font-medium">
                Dashboards do Superset integrados ao Portal
              </p>
            </div>
          </Link>

          {/* Card Solicitações Pendentes */}
          <Link
            to={ROUTES.adminSugestoes}
            className="group relative overflow-hidden rounded bg-fundo-superficie p-6 shadow-sm border-[2.5px] border-transparent hover:border-destaque/55 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-bold text-texto-secundario">
                    Solicitações Pendentes
                  </span>
                  <h3 className="mt-2 text-3xl font-black text-texto-principal">
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      kpis.totalSugestoesPendentes
                    )}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded bg-fundo-superficie-suave text-azul-unb shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-xs text-texto-secundario font-medium">
                Sugestões, erros e relatos aguardando análise
              </p>
            </div>
          </Link>

          {/* Card Cadastros Pendentes (Apenas SuperAdministrador) */}
          {isSuperAdmin && (
            <Link
              to={ROUTES.adminUsuarios}
              data-superadmin
              className="group relative overflow-hidden rounded bg-fundo-superficie p-6 shadow-sm border-[2.5px] border-transparent hover:border-destaque/55 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-bold text-texto-secundario">
                      Cadastros Pendentes
                    </span>
                    <h3 className="mt-2 text-3xl font-black text-texto-principal">
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        kpis.totalUsuariosPendentes
                      )}
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-fundo-superficie-suave text-azul-unb shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-4 text-xs text-texto-secundario font-medium">
                  Novos usuários aguardando aprovação de acesso
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Grid Volumes de Dados */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-texto-secundario mb-4 border-l-4 border-destaque pl-3">
          Volume de dados
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <VolumeCard
            title="Volume Bronze"
            value={formatBytes(kpis.volumeBronze)}
            rows={kpis.linhasBronze}
            desc="Dados brutos"
            icon={Database}
            iconColor="#b25a13"
            iconBg="#b25a1315"
            loading={loading}
            formatRows={formatRows}
          />
          <VolumeCard
            title="Volume Prata"
            value={formatBytes(kpis.volumeSilver)}
            rows={kpis.linhasSilver}
            desc="Dados limpos e estruturados"
            icon={Database}
            iconColor="#64748b"
            iconBg="#64748b15"
            loading={loading}
            formatRows={formatRows}
          />
          <VolumeCard
            title="Volume Ouro"
            value={formatBytes(kpis.volumeGold)}
            rows={kpis.linhasGold}
            desc="Agregações e modelos de negócios"
            icon={Database}
            iconColor="#c2930c"
            iconBg="#c2930c15"
            loading={loading}
            formatRows={formatRows}
          />
        </div>
      </div>

      {/* Seção inferior: Monitor de pipelines e Execuções Recentes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Execuções Recentes */}
        <div className="lg:col-span-2 rounded bg-fundo-superficie p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-texto-secundario border-l-4 border-destaque pl-3">
              Execuções Recentes de Pipelines
            </h2>
            <Button
              size="small"
              variant="contained"
              onClick={fetchExecutions}
              disabled={execLoading}
              startIcon={
                <RefreshCw
                  className={`h-4 w-4 ${execLoading ? "animate-spin" : ""}`}
                />
              }
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Atualizar Execuções
            </Button>
          </div>

          {execLoading && executions.length === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <CircularProgress size={32} />
            </div>
          ) : executions.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-sm text-texto-secundario">
              Nenhuma execução registrada no momento.
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-borda-padrao text-xs font-bold uppercase text-texto-secundario">
                    <th className="pb-3 px-4">ID</th>
                    <th className="pb-3 px-4">Pipeline</th>
                    <th className="pb-3 px-4">Data/Hora</th>
                    <th className="pb-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borda-padrao">
                  {executions.slice(0, 3).map((exec) => {
                    const dataHora = exec.createdAt
                      ? new Date(exec.createdAt).toLocaleString("pt-BR")
                      : "-";
                    return (
                      <tr
                        key={exec.id}
                        className="text-texto-principal hover:bg-fundo-superficie-suave transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-xs text-texto-secundario">
                          {exec.id}
                        </td>
                        <td className="py-3 px-4 text-texto-secundario">
                          {exec.pipelineNome}
                        </td>
                        <td className="py-3 px-4 text-xs text-texto-secundario">
                          {dataHora}
                        </td>
                        <td className="py-3 px-4 text-right select-none">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${getStatusBadgeStyle(exec.status)}`}
                          >
                            {getStatusLabel(exec.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Informações de Ambiente / Status */}
        <div className="rounded bg-fundo-superficie p-6 shadow-sm flex flex-col justify-between">
          <div className="w-full">
            <h2 className="text-sm font-black uppercase tracking-wider text-texto-secundario mb-4 border-l-4 border-destaque pl-3">
              Status do Ambiente
            </h2>
            <div className="space-y-4 text-sm mt-4">
              <div className="flex justify-between items-center border-b border-borda-padrao pb-3">
                <span className="text-texto-secundario">API Gateway:</span>
                <span className="inline-flex items-center gap-2 font-semibold text-texto-principal">
                  <span className="h-2.5 w-2.5 rounded-full bg-sucesso" />
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-borda-padrao pb-3">
                <span className="text-texto-secundario">Banco de Dados:</span>
                {loading ? (
                  <CircularProgress size={12} />
                ) : (
                  <span className="inline-flex items-center gap-2 font-semibold text-texto-principal">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${kpis.databaseOnline ? "bg-sucesso" : "bg-erro"}`}
                    />
                    {kpis.databaseOnline ? "Conectado" : "Desconectado"}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center border-b border-borda-padrao pb-3">
                <span className="text-texto-secundario">Redis:</span>
                {loading ? (
                  <CircularProgress size={12} />
                ) : (
                  <span className="inline-flex items-center gap-2 font-semibold text-texto-principal">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${kpis.redisOnline ? "bg-sucesso" : "bg-[#f59e0b]"}`}
                    />
                    {kpis.redisOnline ? "Online" : "Instável"}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center pb-3">
                <span className="text-texto-secundario">Superset Server:</span>
                {loading ? (
                  <CircularProgress size={12} />
                ) : (
                  <span className="inline-flex items-center gap-2 font-semibold text-texto-principal">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${kpis.supersetOnline ? "bg-sucesso" : "bg-erro"}`}
                    />
                    {kpis.supersetOnline ? "Online" : "Offline"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
