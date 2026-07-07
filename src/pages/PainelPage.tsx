import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Maximize2 } from "lucide-react";
import Button from "@mui/material/Button";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { painelApi } from "@/services/painelApi";
import { supersetApi } from "@/services/supersetApi";
import { APP_CONFIG, ROUTES } from "@/utils/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const PainelPage = () => {
  const { id } = useParams<{ id: string }>();
  const painelId = Number(id);
  const embedRef = useRef<HTMLDivElement>(null);
  const [embedError, setEmbedError] = useState<string | null>(null);

  const { data: painel, isLoading } = useQuery({
    queryKey: ["painel", painelId],
    queryFn: () => painelApi.detail(painelId),
    enabled: !!painelId,
  });

  useEffect(() => {
    if (!painel?.embedDashboardUuid || !embedRef.current) return;

    setEmbedError(null);
    let unmounted = false;
    let intervalId: any = null;

    embedDashboard({
      id: painel.embedDashboardUuid,
      supersetDomain: APP_CONFIG.supersetUrl,
      mountPoint: embedRef.current,
      fetchGuestToken: () =>
        supersetApi.getGuestToken(painel.embedDashboardUuid!),
      dashboardUiConfig: {
        hideTitle: true,
        filters: { expanded: false, visible: false },
        hideTab: true,
        hideChartControls: true,
      },
    })
      .then((dashboard) => {
        if (unmounted) return;

        // Poll for size changes to keep the iframe height in sync
        intervalId = setInterval(async () => {
          try {
            const size = await dashboard.getScrollSize();
            const iframe = embedRef.current?.querySelector("iframe");
            if (iframe && size?.height) {
              const currentIframeHeight = parseInt(iframe.style.height || "0", 10);
              
              // Only update if the height changed significantly (more than 5px difference)
              if (Math.abs(currentIframeHeight - size.height) > 5) {
                iframe.style.height = `${size.height}px`;
                
                if (embedRef.current) {
                  embedRef.current.style.height = `${size.height}px`;
                }
              }
              iframe.setAttribute("scrolling", "no");
            }
          } catch (err) {
            console.warn("Could not retrieve superset scroll size:", err);
          }
        }, 800);
      })
      .catch((err) => {
        if (!unmounted) setEmbedError("Não foi possível carregar o dashboard.");
        console.error("Erro ao embedar dashboard do Superset:", err);
      });

    return () => {
      unmounted = true;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [painel?.embedDashboardUuid]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-destaque border-t-transparent" />
      </div>
    );
  }

  if (!painel) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-texto-secundario">Painel não encontrado.</p>
        <Link
          to={ROUTES.paineis}
          className="text-sm font-semibold text-destaque hover:underline"
        >
          Voltar aos painéis
        </Link>
      </div>
    );
  }

  const categoriRoute = ROUTES.categoria.replace(
    ":id",
    String(painel.categoriaId),
  );

  const hasEmbed = Boolean(painel.embedDashboardUuid);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-fundo-superficie px-6 py-8 lg:px-12">
        <Breadcrumb
          items={[
            { label: "Painéis", to: ROUTES.paineis },
            { label: painel.categoriaNome, to: categoriRoute },
            { label: painel.nome },
          ]}
        />
        <div className="mt-8 border-l-4 border-destaque pl-4">
          <h1 className="text-2xl font-black uppercase tracking-tight text-texto-principal">
            {painel.nome}
          </h1>
          {painel.descricao && (
            <p className="mt-2 text-sm text-texto-secundario">
              {painel.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Embed area */}
      <div className="relative flex-1 bg-fundo-superficie flex flex-col">
        {hasEmbed ? (
          <>
            <style>{`
              #superset-embed-container iframe {
                width: 100% !important;
                height: 100%;
                border: none !important;
                overflow: hidden !important;
              }
            `}</style>
            <div
              id="superset-embed-container"
              ref={embedRef}
              className="mx-6 lg:mx-12 mb-2 overflow-y-auto overflow-x-hidden"
              style={{
                minHeight: "400px",
              }}
            />
          </>
        ) : (
          <div
            id="fallback-embed-container"
            ref={embedRef}
            className="mx-6 lg:mx-12 mb-2 overflow-y-auto overflow-x-hidden"
            style={{
              height: "800px",
            }}
          >
            <iframe
              src={painel.graphEmbedLink}
              title={painel.nome}
              className="w-full"
              style={{
                height: "3000px",
                border: "none",
              }}
              allowFullScreen
              allow="clipboard-write; fullscreen"
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        )}

        {/* Toolbar bottom */}
        <div className="flex items-center justify-end mx-6 lg:mx-12 py-3 border-t border-fundo-superficie-suave mb-6 gap-2">
          <Button
            size="small"
            startIcon={<Maximize2 className="h-4 w-4" />}
            sx={{
              borderRadius: "4px",
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "var(--color-fundo-superficie-suave)",
              color: "var(--color-texto-secundario)",
              px: 1.5,
              py: 0.5,
              "&:hover": {
                bgcolor: "var(--color-fundo-superficie-suave)",
                color: "var(--color-texto-secundario)",
                opacity: 0.8,
              },
            }}
            onClick={() => {
              if (embedRef.current) {
                embedRef.current.requestFullscreen?.();
              }
            }}
          >
            Tela cheia
          </Button>
        </div>

        {embedError && (
          <div className="absolute inset-0 flex items-center justify-center bg-fundo-superficie">
            <p className="text-texto-secundario">{embedError}</p>
          </div>
        )}
      </div>
    </div>
  );
};
