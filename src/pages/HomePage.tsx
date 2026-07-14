import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChartColumnBig, Search } from "lucide-react";
import Button from "@mui/material/Button";
import { ROUTES } from "@/utils/constants";
import { startTour } from "@/features/tour/useTour";
import { homeSteps } from "@/features/tour/tourSteps";

export const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => startTour("home", homeSteps), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    navigate(`${ROUTES.paineis}?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="bg-fundo-superficie flex-1 flex items-center justify-center py-12 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1
            id="tour-home-title"
            className="text-4xl font-black uppercase tracking-tight text-titulo-destaque lg:text-5xl"
          >
            Portal de Dados Institucionais
          </h1>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-destaque" />
          <p className="mt-6 text-base text-texto-secundario lg:text-lg">
            Transparência e acesso a dados institucionais da Universidade de
            Brasília. Explore painéis analíticos com informações sobre ensino,
            pesquisa e gestão universitária.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <div id="tour-home-search" className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-texto-secundario" />
              <input
                type="text"
                placeholder="Procurar painel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded border border-borda-padrao hover:border-borda-padrao bg-fundo-superficie py-2.5 pl-9 pr-4 text-sm text-texto-principal placeholder:text-texto-secundario focus:border-destaque focus:outline-none"
              />
            </div>
            <Button
              id="tour-home-btn-buscar"
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "var(--color-azul-unb)",
                color: "#ffffff",
                "&:hover": { bgcolor: "var(--color-azul-unb-hover)" },
                px: 3,
                py: 1,
              }}
            >
              Buscar
            </Button>
            <Button
              id="tour-home-btn-ver-paineis"
              component={Link}
              to={ROUTES.paineis}
              variant="contained"
              startIcon={<ChartColumnBig className="h-4 w-4 text-destaque" />}
              sx={{
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "var(--color-cinza-claro)",
                color: "var(--color-texto-principal)",
                "&:hover": {
                  bgcolor: "var(--color-fundo-superficie-suave) !important",
                },
                px: 3,
                py: 1,
              }}
            >
              Ver Painéis
            </Button>
          </form>
        </div>
      </section>

      {/* Sobre */}
      <section
        id="tour-home-sobre"
        className="bg-fundo-superficie-suave px-4 py-12 shrink-0"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-black uppercase tracking-tight text-titulo-destaque">
            Sobre
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded bg-destaque" />
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Lorem ipsum",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla sit amet augue consectetur placerat. Donec nec arcu in dui posuere pulvinar. Donec quis commodo nisi.",
              },
              {
                title: "Lorem ipsum",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla sit amet augue consectetur placerat. Donec nec arcu in dui posuere pulvinar. Donec quis commodo nisi. Quisque tempus, nibh eget fermentum rutrum, tortor urna molestie purus, eu hendrerit risus nibh eu lectus.",
              },
              {
                title: "Lorem ipsum",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla sit amet augue consectetur placerat. Donec nec arcu in dui posuere pulvinar. Donec quis commodo nisi.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-base font-bold text-texto-principal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-texto-secundario">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
