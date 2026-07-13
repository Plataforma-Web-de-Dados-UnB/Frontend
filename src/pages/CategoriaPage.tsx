import { Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useQuery } from "@tanstack/react-query";
import { ChevronsRight } from "lucide-react";
import { categoriasApi } from "@/services/categoriasApi";
import { painelApi } from "@/services/painelApi";
import { ROUTES } from "@/utils/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const CategoriaPage = () => {
  const { id } = useParams<{ id: string }>();
  const categoriaId = Number(id);

  const { data: categoria, isLoading: loadingCat } = useQuery({
    queryKey: ["categoria", categoriaId],
    queryFn: () => categoriasApi.detail(categoriaId),
    enabled: !!categoriaId,
  });

  const { data: paineis, isLoading: loadingPaineis } = useQuery({
    queryKey: ["paineis-categoria", categoriaId],
    queryFn: () => painelApi.listByCategoria(categoriaId),
    enabled: !!categoriaId,
  });

  if (loadingCat) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 lg:px-7">
      <Breadcrumb
        items={[
          { label: "Painéis", to: ROUTES.paineis },
          { label: categoria?.nome ?? "Categoria" },
        ]}
      />

      {/* Header */}
      <div className="mt-6 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tight text-titulo-destaque">
          {categoria?.nome ?? "Categoria"}
        </h1>
        {categoria?.descricao && (
          <p className="mt-1 text-base text-texto-secundario">
            {categoria.descricao}
          </p>
        )}
        <div
          className={`mx-auto mt-3 h-1 rounded bg-destaque ${categoria?.descricao ? "w-24" : "w-16"}`}
        />
      </div>

      <hr className="mb-6 mt-12 border-borda-padrao" />

      {/* Lista de painéis */}
      {loadingPaineis && (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
        </div>
      )}

      {!loadingPaineis && paineis && paineis.length === 0 && (
        <p className="text-center text-texto-secundario">
          Nenhum painel disponível nesta categoria.
        </p>
      )}

      {!loadingPaineis && paineis && paineis.length > 0 && (
        <div className="flex flex-col gap-3">
          {paineis.map((painel) => (
            <Link
              key={painel.id}
              to={ROUTES.painel.replace(":id", String(painel.id))}
              className="group flex items-center gap-4 bg-fundo-superficie px-4 py-4 transition hover:bg-fundo-superficie-suave"
            >
              <ChevronsRight className="h-5 w-5 shrink-0 text-destaque transition group-hover:translate-x-1" />
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
            </Link>
          ))}
        </div>
      )}

      <hr className="mt-6 mb-10 border-borda-padrao" />

      {/* Sugestão */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-1 text-center text-sm text-texto-secundario">
        <span>
          Não encontrou o painel que procurava, identificou algum erro ou
          gostaria de enviar um relato?
        </span>
        <Button
          component={Link}
          to={ROUTES.sugestao}
          sx={{
            color: "var(--color-destaque)",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "2px 6px",
            minWidth: "auto",
            position: "relative",
            lineHeight: 1.2,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: "6px",
              right: "6px",
              height: "2px",
              backgroundColor: "var(--color-destaque)",
              transform: "scaleX(0)",
              transition: "transform 0.2s ease-in-out",
            },
            "&:hover::after": {
              transform: "scaleX(1)",
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Clique aqui
        </Button>
      </div>
    </div>
  );
};
