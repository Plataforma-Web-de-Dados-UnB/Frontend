import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, Menu, UserPlus, X, LogOut, User, BarChart2, Megaphone, ChartColumnBig, LayoutDashboard, UserCog } from "lucide-react";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuth } from "@/features/auth/useAuth";
import { useAccessibilityDrawer } from "@/features/accessibility/useAccessibilityDrawer";
import { APP_CONFIG, ROUTES } from "@/utils/constants";
import { supersetApi } from "@/services/supersetApi";

const sharpButton = {
  borderRadius: "4px",
  textTransform: "none" as const,
  fontWeight: 600,
  fontSize: "0.875rem",
  padding: "0.5rem 1rem",
  boxShadow: "none",
  "&:hover": { boxShadow: "none" },
};

const navTextButton = {
  ...sharpButton,
  color: "#ffffff",
  padding: "0.25rem 0.5rem",
  minWidth: "auto",
  position: "relative" as const,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "0.5rem",
    right: "0.5rem",
    height: "2px",
    backgroundColor: "#ffffff",
    transform: "scaleX(0)",
    transition: "transform 0.2s ease-in-out",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
};

const navTextButtonDestaque = {
  ...navTextButton,
  color: "#22c55e",
  "&::after": {
    ...navTextButton["&::after"],
    backgroundColor: "#22c55e",
  },
  "&:hover": {
    ...navTextButton["&:hover"],
    color: "#16a34a",
  },
};

const navTextButtonRed = {
  ...navTextButton,
  color: "#f87171",
  "&::after": {
    ...navTextButton["&::after"],
    backgroundColor: "#ef4444",
  },
  "&:hover": {
    ...navTextButton["&:hover"],
    color: "#ef4444",
  },
};

export const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { openDrawer } = useAccessibilityDrawer();
  const [open, setOpen] = useState(false);
  const [supersetLoading, setSupersetLoading] = useState(false);
  const [supersetError, setSupersetError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.home);
    setOpen(false);
  };

  const handleSupersetClick = async () => {
    if (supersetLoading) return;
    setSupersetLoading(true);
    setSupersetError(null);
    try {
      const url = await supersetApi.getSsoUrl();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao abrir o Superset.";
      setSupersetError(message);
    } finally {
      setSupersetLoading(false);
      setOpen(false);
    }
  };

  const getNavButtonStyle = (route: string, isDestaque = false) => {
    const isActive =
      route === "/admin"
        ? location.pathname.startsWith("/admin")
        : location.pathname === route;

    const baseStyle = isDestaque ? navTextButtonDestaque : navTextButton;
    return {
      ...baseStyle,
      "&::after": {
        ...baseStyle["&::after"],
        transform: isActive ? "scaleX(1)" : "scaleX(0)",
      },
    };
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-fundo-navbar shadow-md">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-7">
        {/* Logo / Título */}
        <Link
          to={ROUTES.home}
          className="flex items-center gap-3 shrink-0 select-none cursor-pointer"
        >
          <img
            src="/unb-logo.png"
            alt="UnB Logo"
            className="sm:h-[31.25px] h-[34.25px] w-auto object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="hidden text-[13px] uppercase font-semibold tracking-wide text-white sm:block">
              Portal de Dados Institucionais
            </span>
            <span className="hidden text-[12px] tracking-widest text-white/90 sm:block">
              Universidade de Brasília - FCTE
            </span>
            <div className="text-sm tracking-wide text-white sm:hidden flex flex-col leading-tight">
              <span className="uppercase text-[13px] font-semibold">
                Portal de Dados Institucionais
              </span>
              <span className="text-xs text-white/90 mt-0.5 tracking-wider">
                Universidade de Brasília - FCTE
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop: botões à direita */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            component={Link}
            to={ROUTES.paineis}
            startIcon={<ChartColumnBig className="h-4 w-4" />}
            sx={getNavButtonStyle(ROUTES.paineis)}
          >
            Painéis
          </Button>

          <Button
            component={Link}
            to={ROUTES.sugestao}
            startIcon={<Megaphone className="h-4 w-4" />}
            sx={getNavButtonStyle(ROUTES.sugestao)}
          >
            Sugestões
          </Button>

          {isAuthenticated && APP_CONFIG.supersetUrl && (
            <Button
              onClick={handleSupersetClick}
              disabled={supersetLoading}
              startIcon={<LayoutDashboard className="h-4 w-4" />}
              sx={navTextButton}
            >
              Superset
            </Button>
          )}

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button
                  component={Link}
                  to={ROUTES.adminDashboard}
                  startIcon={<UserCog className="h-4.5 w-4.5" />}
                  sx={getNavButtonStyle(ROUTES.adminDashboard)}
                >
                  Área administrativa
                </Button>
              )}
              <Button
                onClick={openDrawer}
                startIcon={<AccessibilityIcon className="h-4 w-4" />}
                aria-label="Abrir configurações de acessibilidade"
                sx={navTextButton}
              >
                Acessibilidade
              </Button>
              <Button
                component={Link}
                to={ROUTES.perfil}
                startIcon={<User className="h-4 w-4" />}
                sx={getNavButtonStyle(ROUTES.perfil)}
              >
                Perfil
              </Button>
              <Button
                onClick={handleLogout}
                startIcon={<LogOut className="h-4 w-4" />}
                sx={navTextButtonRed}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={openDrawer}
                startIcon={<AccessibilityIcon className="h-4 w-4" />}
                aria-label="Abrir configurações de acessibilidade"
                sx={navTextButton}
              >
                Acessibilidade
              </Button>
              <Button
                component={Link}
                to={ROUTES.cadastro}
                startIcon={<UserPlus className="h-4 w-4" />}
                sx={getNavButtonStyle(ROUTES.cadastro)}
              >
                Cadastro
              </Button>
              <Button
                component={Link}
                to={ROUTES.login}
                startIcon={<LogIn className="h-4 w-4" />}
                sx={getNavButtonStyle(ROUTES.login, true)}
              >
                Entrar
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <IconButton
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          sx={{
            display: { lg: "none" },
            borderRadius: "50%",
            color: "#ffffff",
            p: 1.5,
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </IconButton>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-fundo-navbar px-4 pb-4 lg:hidden">
          <div className="mt-3 flex flex-col gap-2 pt-2">
            <Button
              fullWidth
              component={Link}
              to={ROUTES.paineis}
              onClick={() => setOpen(false)}
              startIcon={<ChartColumnBig className="h-4 w-4" />}
              sx={{
                ...sharpButton,
                justifyContent: "flex-start",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Painéis
            </Button>
            <Button
              fullWidth
              component={Link}
              to={ROUTES.sugestao}
              onClick={() => setOpen(false)}
              startIcon={<Megaphone className="h-4 w-4" />}
              sx={{
                ...sharpButton,
                justifyContent: "flex-start",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Sugestões
            </Button>
            {isAuthenticated && APP_CONFIG.supersetUrl && (
              <Button
                fullWidth
                onClick={handleSupersetClick}
                disabled={supersetLoading}
                startIcon={<LayoutDashboard className="h-4 w-4" />}
                sx={{
                  ...sharpButton,
                  justifyContent: "flex-start",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                Superset
              </Button>
            )}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button
                    fullWidth
                    component={Link}
                    to="/admin"
                    onClick={() => setOpen(false)}
                    startIcon={<UserCog className="h-4.5 w-4.5" />}
                    sx={{
                      ...sharpButton,
                      justifyContent: "flex-start",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.2)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    Área administrativa
                  </Button>
                )}
                <Button
                  fullWidth
                  onClick={() => {
                    setOpen(false);
                    openDrawer();
                  }}
                  startIcon={<AccessibilityIcon className="h-4 w-4" />}
                  sx={{
                    ...sharpButton,
                    justifyContent: "flex-start",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Acessibilidade
                </Button>
                <Button
                  fullWidth
                  component={Link}
                  to={ROUTES.perfil}
                  onClick={() => setOpen(false)}
                  startIcon={<User className="h-4 w-4" />}
                  sx={{
                    ...sharpButton,
                    justifyContent: "flex-start",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Perfil
                </Button>
                <Button
                  fullWidth
                  onClick={handleLogout}
                  startIcon={<LogOut className="h-4 w-4" />}
                  sx={{
                    ...sharpButton,
                    justifyContent: "flex-start",
                    color: "var(--color-erro)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  onClick={() => {
                    setOpen(false);
                    openDrawer();
                  }}
                  startIcon={<AccessibilityIcon className="h-4 w-4" />}
                  sx={{
                    ...sharpButton,
                    justifyContent: "flex-start",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Acessibilidade
                </Button>
                <Button
                  fullWidth
                  component={Link}
                  to={ROUTES.cadastro}
                  onClick={() => setOpen(false)}
                  startIcon={<UserPlus className="h-4 w-4" />}
                  sx={{
                    ...sharpButton,
                    justifyContent: "flex-start",
                    bgcolor: "var(--color-azul-unb-suave)",
                    color: "var(--color-azul-unb)",
                    "&:hover": { bgcolor: "#d8dde8" },
                  }}
                >
                  Cadastro
                </Button>
                <Button
                  fullWidth
                  component={Link}
                  to={ROUTES.login}
                  onClick={() => setOpen(false)}
                  startIcon={<LogIn className="h-4 w-4" />}
                  sx={{
                    ...sharpButton,
                    justifyContent: "flex-start",
                    bgcolor: "var(--color-destaque)",
                    color: "#ffffff",
                    "&:hover": { bgcolor: "var(--color-destaque-hover)" },
                  }}
                >
                  Entrar
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Snackbar
        open={Boolean(supersetError)}
        autoHideDuration={6000}
        onClose={() => setSupersetError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSupersetError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {supersetError}
        </Alert>
      </Snackbar>
    </header>
  );
};
