import { useRef, useEffect } from "react";
import type { SyntheticEvent } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Search } from "lucide-react";
import type { StatusSugestao, TipoSugestao } from "@/types/dtos";

export interface SugestaoFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSearchSubmit: (e?: SyntheticEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
  tipoFilter: TipoSugestao | "";
  setTipoFilter: (val: TipoSugestao | "") => void;
  statusFilter: StatusSugestao | "";
  setStatusFilter: (val: StatusSugestao | "") => void;
}

export const SugestaoFilterBar = ({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  onClearSearch,
  tipoFilter,
  setTipoFilter,
  statusFilter,
  setStatusFilter,
}: SugestaoFilterBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
      {/* Search and Type Select Box */}
      <form
        onSubmit={onSearchSubmit}
        className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto"
      >
        <TextField
          inputRef={inputRef}
          placeholder="Buscar sugestão..."
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
                  <span className="text-texto-secundario text-xs font-semibold select-none">
                    +
                  </span>
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

        {/* Tipo Select */}
        <Select
          value={tipoFilter}
          displayEmpty
          onChange={(e) => {
            const val = e.target.value as string | number;
            setTipoFilter(val !== "" ? (Number(val) as TipoSugestao) : "");
          }}
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
            minWidth: "150px",
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
            <em>Todos os Tipos</em>
          </MenuItem>
          <MenuItem value={0}>Sugestão</MenuItem>
          <MenuItem value={1}>Erro</MenuItem>
          <MenuItem value={2}>Relato</MenuItem>
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto justify-end shrink-0 lg:h-10">
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
          <Tab value={0} label="Pendentes" />
          <Tab value={1} label="Analisadas" />
          <Tab value={2} label="Descartadas" />
          <Tab value="" label="Todas" />
        </Tabs>
      </div>
    </div>
  );
};
