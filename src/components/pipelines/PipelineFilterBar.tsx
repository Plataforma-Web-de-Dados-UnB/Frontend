import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Search, Plus } from "lucide-react";

export interface PipelineFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSearchSubmit: (e?: React.SyntheticEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
  statusFilter: "ativos" | "desativados" | "todos";
  setStatusFilter: (val: "ativos" | "desativados" | "todos") => void;
  onNewClick: () => void;
}

export const PipelineFilterBar = ({
  searchTerm,
  setSearchTerm,
  inputRef,
  onSearchSubmit,
  onClearSearch,
  statusFilter,
  setStatusFilter,
  onNewClick,
}: PipelineFilterBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
      {/* Search Input Box (Wider / max-w-2xl) */}
      <form onSubmit={onSearchSubmit} className="flex gap-2 w-full lg:w-auto">
        <TextField
          inputRef={inputRef}
          placeholder="Buscar pipeline..."
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
          }}
        >
          Buscar
        </Button>

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
          }}
        >
          Limpar
        </Button>
      </form>

      {/* Group Tabs & Nova Pipeline button together on the right */}
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
          <Tab value="ativos" label="Ativas" />
          <Tab value="desativados" label="Desativadas" />
          <Tab value="todos" label="Todas" />
        </Tabs>

        {/* New Pipeline Button */}
        <Button
          id="tour-pipelines-nova"
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
          Nova Pipeline
        </Button>
      </div>
    </div>
  );
};
