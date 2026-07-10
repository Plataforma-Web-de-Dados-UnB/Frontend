import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { X, Calendar, Clock, BarChart2 } from "lucide-react";
import type { CategoriaGetDto } from "@/types/dtos";
import { painelApi } from "@/services/painelApi";
import { ROUTES } from "@/utils/constants";

export interface CategoriaDetailModalProps {
  open: boolean;
  onClose: () => void;
  categoria: CategoriaGetDto | null;
  formatData: (dt: string) => string;
}

export const CategoriaDetailModal = ({
  open,
  onClose,
  categoria,
}: CategoriaDetailModalProps) => {
  // Query to fetch dashboards belonging to this category
  const { data: paineis, isLoading } = useQuery({
    queryKey: ["categoria-paineis", categoria?.id],
    queryFn: () =>
      categoria
        ? painelApi.listAdmin(1, 100, categoria.id).then((res) => res.itens)
        : [],
    enabled: open && !!categoria?.id,
  });

  const formatDataLocal = (dataStr?: string | null) => {
    if (!dataStr) return "-";
    try {
      // Check if it's a default min date like 0001-01-01
      if (dataStr.startsWith("0001") || dataStr.startsWith("1970")) {
        return "-";
      }
      return new Date(dataStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "4px",
            bgcolor: "var(--color-fundo-superficie)",
            color: "var(--color-texto-principal)",
            border: "1px solid var(--color-borda-padrao)",
            backgroundImage: "none",
            maxHeight: "85vh",
          },
        },
      }}
    >
      {categoria && (
        <>
          <DialogTitle
            sx={{
              m: 0,
              px: 4,
              pt: 2.5,
              pb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--color-borda-padrao)",
            }}
          >
            <h2 className="text-xl font-extrabold tracking-tight font-sans text-texto-principal truncate pr-4">
              {categoria.nome}
            </h2>
            <IconButton
              onClick={onClose}
              sx={{
                color: "var(--color-erro)",
                bgcolor: "transparent",
                borderRadius: "50%",
                transition: "all 0.2s ease-in-out",
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "var(--color-vermelho-claro)",
                  color: "var(--color-vermelho-escuro)",
                },
              }}
            >
              <X className="h-5 w-5" />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              px: 4,
              pt: 3,
              pb: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3.5,
            }}
          >
            {/* Description & Dates card */}
            <div className="w-full rounded p-5 bg-borda-padrao/40 min-w-0 flex flex-col justify-between mt-4">
              <div>
                <div className="flex justify-between items-start gap-4 mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario">
                    Descrição
                  </h4>
                  <div className="flex items-start gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-fundo-superficie text-texto-secundario select-none">
                      Ordem: {categoria.sortOrdem}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold select-none ${
                        categoria.active
                          ? "bg-[#16a34a] text-white"
                          : "bg-[#dc2626] text-white"
                      }`}
                    >
                      {categoria.active ? "Ativa" : "Desativada"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-texto-principal leading-relaxed whitespace-pre-wrap break-words">
                  {categoria.descricao || (
                    <span className="italic text-texto-secundario/50">
                      Nenhuma descrição informada para esta categoria.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4 pt-4 border-t border-borda-padrao/55 text-xs text-texto-secundario">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Calendar className="h-4 w-4 text-texto-secundario/80 shrink-0" />
                  <span className="truncate">
                    <strong>Criada em:</strong>{" "}
                    {formatDataLocal(categoria.createdAt)}
                  </span>
                </div>
                <div className="flex items-center sm:justify-end gap-1.5 min-w-0">
                  <Clock className="h-4 w-4 text-texto-secundario/80 shrink-0" />
                  <span className="truncate">
                    <strong>Atualizada em:</strong>{" "}
                    {formatDataLocal(categoria.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* List of Dashboards */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <h4 className="text-xs font-black uppercase tracking-wider text-texto-secundario flex items-center gap-1.5">
                <BarChart2 className="h-4 w-4 text-destaque" />
                Painéis vinculados ({paineis?.length ?? 0})
              </h4>
              <div className="rounded bg-fundo-superficie-suave/30 p-4 max-h-[220px] overflow-y-auto flex flex-col gap-2">
                {isLoading && (
                  <div className="flex justify-center py-6">
                    <CircularProgress size={24} color="primary" />
                  </div>
                )}
                {!isLoading && (!paineis || paineis.length === 0) && (
                  <p className="text-sm italic text-texto-secundario text-center py-4">
                    Nenhum painel vinculado a esta categoria.
                  </p>
                )}
                {!isLoading && paineis && paineis.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {paineis.map((p) => (
                      <a
                        key={p.id}
                        href={ROUTES.painel.replace(":id", String(p.id))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 p-3 bg-fundo-superficie hover:bg-fundo-superficie-suave rounded transition-all min-w-0 shadow-sm"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-sm font-bold text-texto-principal group-hover:text-destaque transition-colors truncate">
                            {p.nome}
                          </p>
                          {p.descricao ? (
                            <p className="text-xs text-texto-secundario truncate mt-0.5">
                              {p.descricao}
                            </p>
                          ) : (
                            <p className="text-xs italic text-texto-secundario/50 truncate mt-0.5">
                              Sem descrição informada.
                            </p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold select-none ${
                            p.active
                              ? "bg-[#16a34a] text-white"
                              : "bg-[#dc2626] text-white"
                          }`}
                        >
                          {p.active ? "Ativo" : "Inativo"}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
