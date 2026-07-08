import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChartColumnBig,
  CodeXml,
  Upload,
  LayoutList,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  MessageSquare,
  Sun,
  Moon,
  LogOut,
  User
} from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import { ROUTES } from "@/utils/constants";
import { GlobalRequestIndicator } from "@/components/ui/GlobalRequestIndicator";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "@/features/auth/useAuth";

type AdminNavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const adminItems: AdminNavItem[] = [
  { to: ROUTES.adminPipelines, label: "Pipelines de Dados", icon: CodeXml },
  { to: ROUTES.adminUpload, label: "Upload de Dados", icon: Upload },
  {
    to: ROUTES.adminCategorias,
    label: "Categorias de Painéis",
    icon: LayoutList,
  },
  { to: ROUTES.adminPaineis, label: "Gestão de Painéis", icon: ChartColumnBig },
  { to: ROUTES.adminUsuarios, label: "Usuários", icon: Users },
  { to: ROUTES.adminSugestoes, label: "Sugestões e Relatos", icon: MessageSquare },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) === true : false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const tooltipSlotProps = {
    tooltip: {
      sx: {
        bgcolor: "var(--color-azul-unb-hover)",
        color: "#ffffff",
        fontSize: "0.875rem",
        fontWeight: "600",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        padding: "6px 12px",
        borderRadius: "6px",
        "& .MuiTooltip-arrow": {
          color: "var(--color-azul-unb-hover)"
        }
      }
    }
  };
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const activeItem = adminItems.find((item) =>
    location.pathname.startsWith(item.to)
  );

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.home);
    setMobileOpen(false);
  };

  const sidebarList = (collapsed = false, onClick = () => {}) => (
    <List disablePadding>
      {adminItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem?.to === item.to;
        return (
          <Tooltip
            key={item.to}
            title={item.label}
            placement="right"
            disableHoverListener={!collapsed}
            arrow
            slotProps={tooltipSlotProps}
          >
            <ListItemButton
              component={NavLink}
              to={item.to}
              end
              onClick={onClick}
              sx={{
                borderRadius: "0 4px 4px 0",
                mb: 1,
                pl: collapsed ? 2 : 1.25,
                pr: collapsed ? 1 : 2,
                py: 1.25,
                justifyContent: "flex-start",
                minHeight: 44,
                color: isActive ? "var(--color-destaque)" : "var(--color-texto-secundario)",
                bgcolor: isActive ? "var(--color-destaque-suave)" : "transparent",
                borderLeft: isActive ? "4px solid var(--color-destaque)" : "4px solid transparent",
                "&:hover": {
                  bgcolor: isActive
                    ? "var(--color-destaque-suave)"
                    : "var(--color-fundo-superficie-suave)",
                  color: isActive ? "var(--color-destaque-hover)" : "var(--color-texto-principal)",
                },
                "&.Mui-disabled": {
                  bgcolor: "var(--color-fundo-superficie-suave)",
                  opacity: 0.5,
                  color: "var(--color-texto-secundario)",
                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? "auto" : 32,
                  color: "inherit",
                  justifyContent: "center",
                  mr: collapsed ? 0 : 1,
                }}
              >
                <Icon className="h-5 w-5" />
              </ListItemIcon>
              <div
                className={`transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden ${
                  collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"
                }`}
              >
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );

  const bottomSection = (collapsed = false, onClick = () => {}) => (
    <div className="p-2 border-t border-borda-padrao flex flex-col gap-1 mt-auto">
      {/* Theme Toggle Button */}
      <Tooltip
        title={isDark ? "Modo Claro" : "Modo Escuro"}
        placement="right"
        disableHoverListener={!collapsed}
        arrow
        slotProps={tooltipSlotProps}
      >
        <ListItemButton
          onClick={() => {
            toggleTheme();
            onClick();
          }}
          sx={{
            borderRadius: "0 4px 4px 0",
            pl: collapsed ? 2 : 1.25,
            pr: collapsed ? 1 : 2,
            py: 1.25,
            justifyContent: "flex-start",
            minHeight: 44,
            color: "var(--color-texto-secundario)",
            bgcolor: "transparent",
            borderLeft: "4px solid transparent",
            "&:hover": {
              bgcolor: "var(--color-fundo-superficie-suave)",
              color: "var(--color-texto-principal)",
            },
            "&.Mui-disabled": {
              bgcolor: "var(--color-fundo-superficie-suave)",
              opacity: 0.5,
              color: "var(--color-texto-secundario)",
              "& .MuiListItemIcon-root": {
                color: "inherit",
              }
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? "auto" : 32,
              color: "inherit",
              justifyContent: "center",
              mr: collapsed ? 0 : 1,
            }}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          </ListItemIcon>
          <div
            className={`transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden ${
              collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"
            }`}
          >
            <span className="text-sm font-semibold">
              {isDark ? "Modo Claro" : "Modo Escuro"}
            </span>
          </div>
        </ListItemButton>
      </Tooltip>

      {/* Perfil Button */}
      <Tooltip
        title="Perfil"
        placement="right"
        disableHoverListener={!collapsed}
        arrow
        slotProps={tooltipSlotProps}
      >
        <ListItemButton
          component={NavLink}
          to={ROUTES.perfil}
          onClick={onClick}
          sx={{
            borderRadius: "0 4px 4px 0",
            pl: collapsed ? 2 : 1.25,
            pr: collapsed ? 1 : 2,
            py: 1.25,
            justifyContent: "flex-start",
            minHeight: 44,
            color: "var(--color-texto-secundario)",
            bgcolor: "transparent",
            borderLeft: "4px solid transparent",
            "&:hover": {
              bgcolor: "var(--color-fundo-superficie-suave)",
              color: "var(--color-texto-principal)",
            },
            "&.Mui-disabled": {
              bgcolor: "var(--color-fundo-superficie-suave)",
              opacity: 0.5,
              color: "var(--color-texto-secundario)",
              "& .MuiListItemIcon-root": {
                color: "inherit",
              }
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? "auto" : 32,
              color: "inherit",
              justifyContent: "center",
              mr: collapsed ? 0 : 1,
            }}
          >
            <User className="h-5 w-5" />
          </ListItemIcon>
          <div
            className={`transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden ${
              collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"
            }`}
          >
            <span className="text-sm font-semibold">Perfil</span>
          </div>
        </ListItemButton>
      </Tooltip>

      {/* Sair Button */}
      <Tooltip
        title="Sair"
        placement="right"
        disableHoverListener={!collapsed}
        arrow
        slotProps={tooltipSlotProps}
      >
        <ListItemButton
          onClick={() => {
            handleLogout();
            onClick();
          }}
          sx={{
            borderRadius: "0 4px 4px 0",
            pl: collapsed ? 2 : 1.25,
            pr: collapsed ? 1 : 2,
            py: 1.25,
            justifyContent: "flex-start",
            minHeight: 44,
            color: "var(--color-erro)",
            bgcolor: "transparent",
            borderLeft: "4px solid transparent",
            "&:hover": {
              bgcolor: "var(--color-vermelho-claro)",
              color: "var(--color-vermelho-escuro)",
            },
            "&.Mui-disabled": {
              bgcolor: "var(--color-fundo-superficie-suave)",
              opacity: 0.5,
              color: "var(--color-erro)",
              "& .MuiListItemIcon-root": {
                color: "inherit",
              }
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: collapsed ? "auto" : 32,
              color: "inherit",
              justifyContent: "center",
              mr: collapsed ? 0 : 1,
            }}
          >
            <LogOut className="h-5 w-5" />
          </ListItemIcon>
          <div
            className={`transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden ${
              collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"
            }`}
          >
            <span className="text-sm font-semibold">Sair</span>
          </div>
        </ListItemButton>
      </Tooltip>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-fundo-pagina text-texto-principal">
      <GlobalRequestIndicator />
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Sidebar desktop */}
        <aside
          className={`relative hidden shrink-0 border-r border-borda-padrao bg-fundo-superficie transition-all duration-200 lg:flex lg:flex-col ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="relative flex h-16 items-center p-2 border-b border-borda-padrao">
            {/* Floating collapse button */}
            <div className="absolute top-4 -right-4 z-20">
              <IconButton
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: location.pathname === "/admin" ? "#ffffff" : "var(--color-destaque)",
                  border: location.pathname === "/admin" ? "1px solid var(--color-borda-padrao)" : "none",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  color: location.pathname === "/admin" ? "var(--color-texto-secundario)" : "#ffffff",
                  p: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    bgcolor: location.pathname === "/admin"
                      ? "var(--color-fundo-superficie-suave)"
                      : "var(--color-destaque-hover)",
                    color: location.pathname === "/admin"
                      ? "var(--color-texto-principal)"
                      : "#ffffff"
                  },
                }}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </IconButton>
            </div>

            {/* Painel button in place of logo */}
            <Tooltip
              title="Painel"
              placement="right"
              disableHoverListener={!collapsed}
              arrow
              slotProps={tooltipSlotProps}
            >
              <ListItemButton
                component={NavLink}
                to="/admin"
                end
                sx={{
                  borderRadius: "0 4px 4px 0",
                  width: "100%",
                  pl: collapsed ? 2 : 1.25,
                  pr: collapsed ? 1 : 2,
                  py: 1.25,
                  justifyContent: "flex-start",
                  minHeight: 44,
                  color: location.pathname === "/admin" ? "var(--color-destaque)" : "var(--color-texto-secundario)",
                  bgcolor: location.pathname === "/admin" ? "var(--color-destaque-suave)" : "transparent",
                  borderLeft: location.pathname === "/admin" ? "4px solid var(--color-destaque)" : "4px solid transparent",
                  "&:hover": {
                    bgcolor: location.pathname === "/admin"
                      ? "var(--color-destaque-suave)"
                      : "var(--color-fundo-superficie-suave)",
                    color: location.pathname === "/admin" ? "var(--color-destaque-hover)" : "var(--color-texto-principal)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "var(--color-fundo-superficie-suave)",
                    opacity: 0.5,
                    color: "var(--color-texto-secundario)",
                    "& .MuiListItemIcon-root": {
                      color: "inherit",
                    }
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? "auto" : 32,
                    color: "inherit",
                    justifyContent: "center",
                    mr: collapsed ? 0 : 1,
                  }}
                >
                  <LayoutDashboard className="h-5 w-5" />
                </ListItemIcon>
                <div
                  className={`transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden ${
                    collapsed ? "opacity-0 max-w-0" : "opacity-100 max-w-[200px]"
                  }`}
                >
                  <span className="text-sm font-semibold">Painel</span>
                </div>
              </ListItemButton>
            </Tooltip>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">{sidebarList(collapsed)}</nav>
          {bottomSection(collapsed)}
        </aside>

        {/* Mobile drawer */}
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          variant="temporary"
          ModalProps={{ 
            keepMounted: true,
            disablePortal: true
          }}
          sx={{
            position: "fixed",
            top: "64px",
            height: "calc(100vh - 64px)",
            zIndex: 40,
            "& .MuiDrawer-paper": {
              width: "16rem",
              bgcolor: "var(--color-fundo-superficie)",
              position: "absolute",
              height: "100%",
              boxShadow: "none",
            },
            "& .MuiBackdrop-root": {
              position: "absolute",
              height: "100%",
            }
          }}
        >
          <div className="flex h-16 items-center justify-between border-b border-borda-padrao p-2 pl-0">
            <ListItemButton
              component={NavLink}
              to="/admin"
              end
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "0 4px 4px 0",
                pl: 1.25,
                pr: 2,
                py: 1.25,
                justifyContent: "flex-start",
                minHeight: 44,
                color: location.pathname === "/admin" ? "var(--color-destaque)" : "var(--color-texto-secundario)",
                bgcolor: location.pathname === "/admin" ? "var(--color-destaque-suave)" : "transparent",
                borderLeft: location.pathname === "/admin" ? "4px solid var(--color-destaque)" : "4px solid transparent",
                "&:hover": {
                  bgcolor: location.pathname === "/admin"
                    ? "var(--color-destaque-suave)"
                    : "var(--color-fundo-superficie-suave)",
                  color: location.pathname === "/admin" ? "var(--color-destaque-hover)" : "var(--color-texto-principal)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: "inherit",
                  justifyContent: "center",
                  mr: 1,
                }}
              >
                <LayoutDashboard className="h-5 w-5" />
              </ListItemIcon>
              <div className="transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden opacity-100 max-w-[150px]">
                <span className="text-sm font-semibold">Painel</span>
              </div>
            </ListItemButton>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "50%",
                color: "var(--color-texto-secundario)",
                p: 1,
                mr: 1.5,
                "&:hover": { bgcolor: "var(--color-fundo-superficie-suave)" },
              }}
            >
              <X className="h-5 w-5" />
            </IconButton>
          </div>
          <nav className="flex-1 overflow-y-auto p-2" onClick={() => setMobileOpen(false)}>
            {sidebarList(false, () => setMobileOpen(false))}
          </nav>
          {bottomSection(false, () => setMobileOpen(false))}
        </Drawer>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-borda-padrao bg-fundo-superficie px-4 py-2 lg:hidden">
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              sx={{
                borderRadius: "50%",
                color: "var(--color-texto-principal)",
                p: 1.5,
                "&:hover": { bgcolor: "var(--color-fundo-superficie-suave)" },
              }}
            >
              <Menu className="h-5 w-5" />
            </IconButton>
            <span className="text-sm font-bold text-texto-principal">
              Administração
            </span>
          </div>
          <main className="flex-1 px-6 py-4 lg:px-7 lg:py-6 min-h-[820px]">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};
