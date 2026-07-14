import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Search, Plus } from "lucide-react";
import type { CategoriaGetDto } from "@/types/dtos";

export interface PainelFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSearchSubmit: (e?: React.SyntheticEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
  filterCat: number | "";
  setFilterCat: (val: number | "") => void;
  categorias: CategoriaGetDto[] | undefined;
  statusFilter: "ativos" | "inativos" | "todos";
  setStatusFilter: (val: "ativos" | "inativos" | "todos") => void;
  onNewClick: () => void;
}

export const PainelFilterBar = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  onSearchSubmit,
  onClearSearch,
  filterCat,
  setFilterCat,
  categorias,
  statusFilter,
  setStatusFilter,
  onNewClick,
}: PainelFilterBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
      {/* Search and Category Select Box */}
      <form
        onSubmit={onSearchSubmit}
        className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto"
      >
        <TextField
          inputRef={inputRef}
          placeholder="Buscar painel..."
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

        {/* Categoria Select with Green Border, No Hover Border Change, and Max Height Scroll */}
        <Select
          value={filterCat}
          displayEmpty
          onChange={(e) =>
            setFilterCat(e.target.value ? Number(e.target.value) : "")
          }
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
              borderColor: "var(--color-borda-padrao) !important",
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
            <em>Todas as Categorias</em>
          </MenuItem>
          {categorias?.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.nome}
            </MenuItem>
          ))}
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

      {/* Tabs and Create Button on the right */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto justify-end shrink-0 lg:h-10">
        {/* Status Tabs */}
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
          <Tab value="inativos" label="Inativos" />
          <Tab value="todos" label="Todos" />
        </Tabs>

        {/* New Panel Button */}
        <Button
          id="tour-paineis-admin-novo"
          variant="contained"
          color="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={onNewClick}
          sx={{
            borderRadius: "4px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "none",
            bgcolor: "var(--color-azul-unb)",
            "&:hover": {
              bgcolor: "var(--color-azul-unb-hover)",
              boxShadow: "none",
            },
          }}
        >
          Novo Painel
        </Button>
      </div>
    </div>
  );
};
