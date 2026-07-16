import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Maximize2, Share2 } from "lucide-react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { painelApi } from "@/services/painelApi";
import { supersetApi } from "@/services/supersetApi";
import { APP_CONFIG, ROUTES } from "@/utils/constants";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { startTour } from "@/features/tour/useTour";
import { painelSteps } from "@/features/tour/tourSteps";

export const PainelPage = () => {
  const { id } = useParams<{ id: string }>();
  const painelId = Number(id);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => startTour("painel", painelSteps), 800);
    return () => clearTimeout(timer);
  }, [painelId]);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const { data: painel, isLoading } = useQuery({
    queryKey: ["painel", painelId],
    queryFn: () => painelApi.detail(painelId),
    enabled: !!painelId,
  });

  const [shareAnchor, setShareAnchor] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const siteName =
    "Portal de Dados Institucionais - Universidade de Brasília - FCTE";
  const shareText = painel
    ? `Confira o painel "${painel.nome}" no ${siteName}`
    : `Confira este painel no ${siteName}`;

  const shareOptions = [
    {
      label: copied ? "Link copiado!" : "Copiar link",
      icon: copied ? CheckIcon : ContentCopyIcon,
      action: () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      },
    },
    {
      label: "WhatsApp",
      icon: WhatsAppIcon,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
          "_blank",
        );
      },
    },
    {
      label: "X / Twitter",
      icon: XIcon,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank",
        );
      },
    },
    {
      label: "Facebook",
      icon: FacebookIcon,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
        );
      },
    },
    {
      label: "LinkedIn",
      icon: LinkedInIcon,
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        );
      },
    },
    {
      label: "E-mail",
      icon: EmailIcon,
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
      },
    },
  ];

  useEffect(() => {
    if (!painel?.embedDashboardUuid || !embedRef.current) return;

    setEmbedError(null);
    let unmounted = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    embedDashboard({
      id: painel.embedDashboardUuid,
      supersetDomain: APP_CONFIG.supersetUrl,
      mountPoint: embedRef.current,
      fetchGuestToken: () =>
        supersetApi.getGuestToken(painel.embedDashboardUuid!),
      dashboardUiConfig: {
        hideTitle: true,
        filters: { expanded: true, visible: true },
        hideTab: false,
        hideChartControls: false,
        urlParams: {
          themeMode: "dark",
          theme_color_scheme: "unb_brand_palette",
        },
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
              const currentIframeHeight = parseInt(
                iframe.style.height || "0",
                10,
              );

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
      <div className="bg-fundo-superficie px-6 pt-8 pb-14 lg:px-7">
        <div id="tour-painel-breadcrumb">
          <Breadcrumb
            items={[
              { label: "Painéis", to: ROUTES.paineis },
              { label: painel.categoriaNome, to: categoriRoute },
              { label: painel.nome },
            ]}
          />
        </div>
        <div id="tour-painel-title" className="mt-6 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight text-titulo-destaque">
            {painel.nome}
          </h1>
          {painel.descricao && (
            <p className="mt-1 text-base text-texto-secundario">
              {painel.descricao}
            </p>
          )}
          <div
            className={`mx-auto mt-3 h-1 rounded bg-destaque ${painel.descricao ? "w-24" : "w-16"}`}
          />
        </div>
      </div>

      {/* Embed area */}
      <div
        id="tour-painel-embed"
        className="relative flex-1 bg-fundo-superficie flex flex-col"
      >
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
              className="mx-6 lg:mx-7 mb-2 overflow-y-auto overflow-x-hidden"
              style={{
                minHeight: "400px",
              }}
            />
          </>
        ) : (
          <div
            id="fallback-embed-container"
            ref={embedRef}
            className="mx-6 lg:mx-7 mb-2 overflow-y-auto overflow-x-hidden"
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
        <div className="flex items-center justify-end mx-6 lg:mx-7 py-3 border-t border-fundo-superficie-suave mb-6 gap-2">
          <Button
            id="tour-painel-compartilhar"
            size="small"
            startIcon={<Share2 className="h-4 w-4" />}
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
            onClick={(e) => setShareAnchor(e.currentTarget)}
          >
            Compartilhar
          </Button>
          <Menu
            anchorEl={shareAnchor}
            open={Boolean(shareAnchor)}
            onClose={() => setShareAnchor(null)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  mt: -1,
                  borderRadius: "8px",
                  bgcolor: "var(--color-fundo-superficie)",
                  border: "1px solid var(--color-borda-padrao)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  minWidth: 180,
                },
              },
            }}
          >
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <MenuItem
                  key={option.label}
                  onClick={() => {
                    option.action();
                    setShareAnchor(null);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1,
                    px: 2,
                    fontSize: "0.9375rem",
                    color: "var(--color-texto-principal)",
                    "&:hover": {
                      bgcolor: "var(--color-fundo-superficie-suave)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                  <span>{option.label}</span>
                </MenuItem>
              );
            })}
          </Menu>
          <Button
            id="tour-painel-tela-cheia"
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
