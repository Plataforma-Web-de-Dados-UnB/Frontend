import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BarChart2,
  Database,
  Upload,
  LayoutList,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ROUTES } from "@/utils/constants";
import { GlobalRequestIndicator } from "@/components/ui/GlobalRequestIndicator";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type AdminNavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const adminItems: AdminNavItem[] = [
  { to: ROUTES.adminPipelines, label: "Pipelines de Dados", icon: Database },
  { to: ROUTES.adminUpload, label: "Upload de Dados", icon: Upload },
  {
    to: ROUTES.adminCategorias,
    label: "Categoria de Painéis",
    icon: LayoutList,
  },
  { to: ROUTES.adminPaineis, label: "Gestão de Painéis", icon: BarChart2 },
  { to: ROUTES.adminUsuarios, label: "Usuários", icon: Users },
];

export const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = adminItems.find((item) =>
    location.pathname.startsWith(item.to),
  );

  const sidebarList = (collapsed = false, onClick = () => {}) => (
    <List disablePadding>
      {adminItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem?.to === item.to;
        return (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end
            onClick={onClick}
            sx={{
              borderRadius: "4px",
              mb: 0.5,
              px: collapsed ? 1 : 2,
              py: 1.25,
              justifyContent: collapsed ? "center" : "flex-start",
              minHeight: 44,
              color: isActive ? "#ffffff" : "var(--color-texto-secundario)",
              bgcolor: isActive ? "var(--color-destaque)" : "transparent",
              "&:hover": {
                bgcolor: isActive
                  ? "var(--color-destaque-hover)"
                  : "var(--color-fundo-superficie-suave)",
              },
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
            {!collapsed && (
              <ListItemText>
                <span className="text-sm font-semibold">{item.label}</span>
              </ListItemText>
            )}
          </ListItemButton>
        );
      })}
    </List>
  );

  return (
    <div className="flex min-h-screen flex-col bg-fundo-pagina text-texto-principal">
      <GlobalRequestIndicator />
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside
          className={`hidden shrink-0 border-r border-borda-padrao bg-fundo-superficie transition-all duration-200 lg:flex lg:flex-col ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-borda-padrao px-3">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-azul-unb">
                  <BarChart2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-texto-principal">
                    Portal
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-destaque">
                    Dados Institucionais
                  </p>
                </div>
              </div>
            )}
            <IconButton
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
              sx={{
                borderRadius: "50%",
                color: "var(--color-texto-secundario)",
                p: 1,
                ml: collapsed ? "auto" : 0,
                "&:hover": { bgcolor: "var(--color-fundo-superficie-suave)" },
              }}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </IconButton>
          </div>
          <nav className="flex-1 p-2">{sidebarList(collapsed)}</nav>
        </aside>

        {/* Mobile drawer */}
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: "16rem",
              bgcolor: "var(--color-fundo-superficie)",
            },
          }}
        >
          <div className="flex h-16 items-center justify-between border-b border-borda-padrao px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center bg-azul-unb">
                <BarChart2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-texto-principal">
                Administração
              </span>
            </div>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: "50%",
                color: "var(--color-texto-secundario)",
                p: 1,
                "&:hover": { bgcolor: "var(--color-fundo-superficie-suave)" },
              }}
            >
              <Menu className="h-5 w-5" />
            </IconButton>
          </div>
          <nav className="p-2" onClick={() => setMobileOpen(false)}>
            {sidebarList(false, () => setMobileOpen(false))}
          </nav>
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
          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
