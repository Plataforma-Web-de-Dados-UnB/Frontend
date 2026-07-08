import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BarChart2 } from "lucide-react";
import { categoriasApi } from "@/services/categoriasApi";
import { ROUTES } from "@/utils/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const PaineisPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const { data: categorias, isLoading } = useQuery({
    queryKey: ["categorias-all"],
    queryFn: () => categoriasApi.listAll(),
  });

  const filtered = q
    ? categorias?.filter((c) => c.nome.toLowerCase().includes(q.toLowerCase()))
    : categorias;

  return (
    <div className="px-6 py-8 lg:px-7">
      <Breadcrumb items={[{ label: "Painéis" }]} />

      <div className="mt-6 border-l-4 border-destaque pl-4">
        <h1 className="text-3xl font-black uppercase tracking-tight text-azul-unb">
          Painéis
        </h1>
      </div>

      {isLoading && (
        <div className="mt-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
        </div>
      )}

      {!isLoading && filtered && filtered.length === 0 && (
        <p className="mt-16 text-center text-texto-secundario">
          Nenhuma categoria encontrada{q ? ` para "${q}"` : ""}.
        </p>
      )}

      {!isLoading && filtered && filtered.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {filtered.map((cat) => (
            <Link
              key={cat.id}
              to={ROUTES.categoria.replace(":id", String(cat.id))}
              className="group perspective aspect-square cursor-pointer"
              aria-label={cat.nome}
            >
              <div className="flip-card-inner relative h-full w-full transform-style-3d transition-transform duration-500">
                {/* Frente */}
                <div className="backface-hidden absolute inset-0 flex flex-col items-center p-3 text-center shadow-sm bg-fundo-superficie">
                  <div className="flex flex-1 items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fundo-superficie-suave">
                      {cat.imagemUrl ? (
                        <img
                          src={cat.imagemUrl}
                          alt={cat.nome}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <BarChart2 className="h-6 w-6 text-texto-secundario" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold leading-tight text-texto-principal line-clamp-2 mt-2">
                    {cat.nome}
                  </span>
                </div>
                {/* Verso */}
                <div className="backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center bg-azul-unb p-3 text-center shadow-md">
                  {cat.descricao ? (
                    <p className="line-clamp-3 text-sm font-medium leading-normal text-texto-invertido">
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
