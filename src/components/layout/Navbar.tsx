import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BarChart2,
  LogIn,
  Menu,
  UserPlus,
  X,
  LogOut,
  User,
} from "lucide-react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "@/features/auth/useAuth";
import { APP_CONFIG, ROUTES } from "@/utils/constants";

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
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.home);
    setOpen(false);
  };

  const getNavButtonStyle = (route: string, isDestaque = false) => {
    const isActive = route === "/admin"
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
    <header className="sticky top-0 z-50 w-full bg-azul-unb shadow-md">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-7">
        {/* Logo / Título */}
        <Link to={ROUTES.home} className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center bg-destaque">
            <BarChart2 className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="hidden text-sm font-black uppercase tracking-wide text-texto-invertido sm:block">
              Portal de Dados Institucionais
            </span>
            <span className="hidden text-[10px] font-medium tracking-widest text-texto-invertido/60 sm:block">
              Universidade de Brasília
            </span>
            <span className="text-sm font-black uppercase tracking-wide text-texto-invertido sm:hidden">
              PDI · UnB
            </span>
          </div>
        </Link>

        {/* Desktop: botões à direita */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            component={Link}
            to={ROUTES.paineis}
            //startIcon={<BarChart2 className="h-4 w-4" />}
            sx={getNavButtonStyle(ROUTES.paineis)}
          >
            Painéis
          </Button>

          <Button
            component={Link}
            to={ROUTES.sugestao}
            sx={getNavButtonStyle(ROUTES.sugestao)}
          >
            Sugestões
          </Button>

          {isAuthenticated && APP_CONFIG.supersetUrl && (
            <Button
              component="a"
              href={APP_CONFIG.supersetUrl}
              target="_blank"
              rel="noopener noreferrer"
              //startIcon={<LayoutDashboard className="h-4 w-4" />}
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
                  //startIcon={<Settings2 className="h-4 w-4" />}
                  sx={getNavButtonStyle(ROUTES.adminDashboard)}
                >
                  Área administrativa
                </Button>
              )}
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
                component={Link}
                to={ROUTES.cadastro}
                //startIcon={<UserPlus className="h-4 w-4" />}
                sx={getNavButtonStyle(ROUTES.cadastro)}
              >
                Cadastro
              </Button>
              <Button
                component={Link}
                to={ROUTES.login}
                //startIcon={<LogIn className="h-4 w-4" />}
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
        <div className="border-t border-white/10 bg-azul-unb px-4 pb-4 lg:hidden">
          <div className="mt-3 flex flex-col gap-2 pt-2">
            <Button
              fullWidth
              component={Link}
              to={ROUTES.paineis}
              onClick={() => setOpen(false)}
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
                component="a"
                href={APP_CONFIG.supersetUrl}
                target="_blank"
                rel="noopener noreferrer"
                //startIcon={<LayoutDashboard className="h-4 w-4" />}
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
                    //startIcon={<Settings2 className="h-4 w-4" />}
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
                  component={Link}
                  to={ROUTES.perfil}
                  onClick={() => setOpen(false)}
                  //startIcon={<User className="h-4 w-4" />}
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
    </header>
  );
};
