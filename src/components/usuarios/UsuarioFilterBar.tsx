import React, { useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Search, Plus } from "lucide-react";

interface UsuarioFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSearchSubmit: (e: React.SyntheticEvent) => void;
  onClearSearch: () => void;
  filterCargo: string;
  setFilterCargo: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  pendingCount: number;
}

export const UsuarioFilterBar = ({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  onClearSearch,
  filterCargo,
  setFilterCargo,
  statusFilter,
  setStatusFilter,
  pendingCount,
}: UsuarioFilterBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full flex-wrap">
      {/* Search Bar and Cargo Select */}
      <form
        onSubmit={onSearchSubmit}
        className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto flex-wrap"
      >
        <TextField
          inputRef={inputRef}
          placeholder="Buscar usuário..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              inputRef.current?.blur();
            }
          }}
          sx={{ width: { xs: "100%", lg: 400 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="h-4 w-4 text-texto-secundario" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className="hidden sm:flex gap-1 select-none"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    inputRef.current?.focus();
                  }}
                  onClick={() => inputRef.current?.focus()}
                >
                  <span className="text-[10px] font-bold text-texto-principal bg-borda-padrao px-1.5 py-0.5 rounded select-none">
                    Ctrl
                  </span>
                  <Plus className="h-3 w-3 text-texto-primario" />
                  <span className="text-[10px] font-bold text-texto-principal bg-borda-padrao px-2.5 py-0.5 rounded select-none">
                    K
                  </span>
                </InputAdornment>
              ),
              sx: {
                height: "40px",
                boxSizing: "border-box",
                borderRadius: "4px",
                bgcolor: "var(--color-fundo-superficie)",
                color: "var(--color-texto-principal)",
                "& fieldset": { borderColor: "var(--color-borda-padrao)" },
                "&:hover fieldset": {
                  borderColor: "var(--color-borda-padrao) !important",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-destaque) !important",
                },
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            height: "40px",
            boxSizing: "border-box",
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "var(--color-azul-unb)",
            color: "#ffffff",
            "&:hover": { bgcolor: "var(--color-azul-unb-hover)" },
            px: 3,
            flexShrink: 0,
          }}
        >
          Buscar
        </Button>

        {/* Cargo Select */}
        <Select
          value={filterCargo}
          displayEmpty
          onChange={(e) => setFilterCargo(e.target.value)}
          MenuProps={{
            slotProps: {
              paper: {
                sx: {
                  backgroundColor: "var(--color-fundo-superficie)",
                  color: "var(--color-texto-principal)",
                  border: "1px solid var(--color-borda-padrao)",
                  "& .MuiMenuItem-root": {
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "var(--color-fundo-superficie-suave)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "var(--color-destaque-suave)",
                      color: "var(--color-destaque)",
                      "&:hover": {
                        backgroundColor: "var(--color-destaque-suave)",
                      },
                    },
                  },
                },
              },
            },
          }}
          sx={{
            height: "40px",
            minWidth: "180px",
            boxSizing: "border-box",
            borderRadius: "4px",
            bgcolor: "var(--color-fundo-superficie)",
            color: "var(--color-texto-principal)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-borda-padrao)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-borda-padrao) !important",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-destaque) !important",
            },
          }}
        >
          <MenuItem value="">
            <em>Todos os Cargos</em>
          </MenuItem>
          <MenuItem value="SuperAdministrador">Super Administrador</MenuItem>
          <MenuItem value="Administrador">Administrador</MenuItem>
          <MenuItem value="Visitante">Visitante</MenuItem>
        </Select>

        <Button
          type="button"
          variant="text"
          onClick={onClearSearch}
          sx={{
            height: "40px",
            boxSizing: "border-box",
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "var(--color-borda-padrao)",
            color: "var(--color-texto-principal)",
            "&:hover": {
              bgcolor: "var(--color-fundo-superficie-suave)",
              color: "var(--color-texto-secundario)",
            },
            px: 3,
            flexShrink: 0,
          }}
        >
          Limpar
        </Button>
      </form>

      {/* Tabs on the right */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto justify-end shrink-0 lg:min-h-10 flex-wrap">
        <Tabs
          value={statusFilter}
          onChange={(_, newValue) => {
            setStatusFilter(newValue);
          }}
          sx={{
            minHeight: 40,
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--color-destaque)",
              height: 3,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "var(--color-texto-secundario)",
              px: 2.5,
              minHeight: 40,
              height: 40,
              paddingTop: 0,
              paddingBottom: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              "&.Mui-selected": {
                color: "var(--color-titulo-destaque)",
              },
              "&:hover": {
                color: "var(--color-texto-principal)",
              },
            },
          }}
        >
          <Tab value="ativos" label="Ativos" />
          <Tab
            value="pendentes"
            label={
              <div className="flex items-center gap-1.5">
                <span>Pendentes</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-white text-[11px] font-black rounded-full h-5.5 px-2 flex items-center justify-center min-w-[22px] animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </div>
            }
          />
          <Tab value="recusados" label="Recusados" />
          <Tab value="todos" label="Todos" />
        </Tabs>
      </div>
    </div>
  );
};
