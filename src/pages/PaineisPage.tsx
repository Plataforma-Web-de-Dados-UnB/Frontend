import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BarChart2, ChevronsRight } from "lucide-react";
import { categoriasApi } from "@/services/categoriasApi";
import { painelApi } from "@/services/painelApi";
import { ROUTES } from "@/utils/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const PaineisPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const { data: categorias, isLoading: isLoadingCategorias } = useQuery({
    queryKey: ["categorias-all"],
    queryFn: () => categoriasApi.listAll(),
  });

  const { data: paineisRes, isLoading: isLoadingPaineis } = useQuery({
    queryKey: ["paineis-search-all"],
    queryFn: () => painelApi.list(1, 1000),
    enabled: !!q,
  });

  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const searchNormalized = normalizeText(q);

  const filteredPaineis =
    q && paineisRes?.itens
      ? paineisRes.itens.filter((painel) => {
          const nameNorm = normalizeText(painel.nome);
          const descNorm = normalizeText(painel.descricao ?? "");
          return (
            nameNorm.includes(searchNormalized) ||
            descNorm.includes(searchNormalized)
          );
        })
      : [];

  const filteredCategorias = !q && categorias ? categorias : [];

  const isLoading = isLoadingCategorias || (!!q && isLoadingPaineis);

  return (
    <div className="px-6 py-8 lg:px-7">
      <Breadcrumb
        items={
          q
            ? [{ label: "Painéis", to: ROUTES.paineis }, { label: "Busca" }]
            : [{ label: "Painéis" }]
        }
      />

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tight text-titulo-destaque">
          {q ? `Busca: ${q}` : "Painéis"}
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
      </div>

      {isLoading && (
        <div className="mt-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
        </div>
      )}

      {!isLoading && q && filteredPaineis.length === 0 && (
        <p className="mt-16 text-center text-texto-secundario">
          Nenhum painel encontrado para "{q}".
        </p>
      )}

      {!isLoading && !q && filteredCategorias.length === 0 && (
        <p className="mt-16 text-center text-texto-secundario">
          Nenhuma categoria encontrada.
        </p>
      )}

      {/* Resultados da busca (Lista de Painéis) */}
      {!isLoading && q && filteredPaineis.length > 0 && (
        <div className="mt-8 flex flex-col gap-3">
          {filteredPaineis.map((painel) => (
            <Link
              key={painel.id}
              to={ROUTES.painel.replace(":id", String(painel.id))}
              className="group flex items-center gap-4 bg-fundo-superficie px-4 py-4 transition hover:bg-fundo-superficie-suave"
            >
              <ChevronsRight className="h-5 w-5 shrink-0 text-destaque transition group-hover:translate-x-1" />
              <div className="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-6">
                <div className="min-w-0 flex-1">
                  <p className="font-bold uppercase tracking-wide text-texto-principal group-hover:text-destaque">
                    {painel.nome}
                  </p>
                  {painel.descricao && (
                    <p className="mt-0.5 text-sm text-texto-secundario line-clamp-1">
                      {painel.descricao}
                    </p>
                  )}
                </div>
                <div className="mt-2 md:mt-0 flex shrink-0 select-none">
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-azul-unb text-white uppercase tracking-wider">
                    {painel.categoriaNome}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Categorias sem busca */}
      {!isLoading && !q && filteredCategorias.length > 0 && (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-4 lg:gap-8 w-full lg:px-40">
          {filteredCategorias.map((cat) => (
            <Link
              key={cat.id}
              to={ROUTES.categoria.replace(":id", String(cat.id))}
              className="group perspective aspect-square cursor-pointer w-full"
              aria-label={cat.nome}
            >
              <div className="flip-card-inner relative h-full w-full transform-style-3d transition-transform duration-500">
                {/* Frente */}
                <div className="backface-hidden absolute inset-0 flex flex-col items-center p-3 text-center shadow-xs bg-fundo-superficie">
                  <div className="flex flex-1 w-full items-center justify-center min-h-0">
                    {cat.imagemUrl ? (
                      <img
                        src={cat.imagemUrl}
                        alt={cat.nome}
                        className="max-h-full max-w-full w-auto h-auto rounded-[3.5px]"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-fundo-superficie-suave">
                        <BarChart2 className="h-10 w-10 text-texto-secundario" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-black leading-tight text-texto-principal/80 line-clamp-2 mt-1">
                    {cat.nome}
                  </span>
                </div>
                {/* Verso */}
                <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center p-3.5 text-center bg-fundo-navbar">
                  {cat.descricao ? (
                    <p className="line-clamp-6 text-sm font-medium leading-relaxed text-texto-invertido">
                      {cat.descricao}
                    </p>
                  ) : (
                    <p className="text-sm italic text-texto-invertido/60">
                      Sem descrição
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
