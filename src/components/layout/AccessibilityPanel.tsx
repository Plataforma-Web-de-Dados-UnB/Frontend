import { X, Sun, Moon, Contrast } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import {
  useAccessibility,
  type FontSizeLevel,
} from "@/features/accessibility/useAccessibility";
import { useAccessibilityDrawer } from "@/features/accessibility/useAccessibilityDrawer";

const FONT_MIN = 100;
const FONT_MAX = 150;
const FONT_STEP = 6.25;
const DRAWER_BOTTOM_OFFSET = 0;

const FONT_SIZE_MAP: Record<string, string> = {};
for (let v = FONT_MIN; v <= FONT_MAX; v += FONT_STEP) {
  FONT_SIZE_MAP[String(v)] = `${v}%`;
}

function valueToFontSize(value: number): FontSizeLevel {
  const clamped = Math.max(FONT_MIN, Math.min(FONT_MAX, value));
  const steps = Math.round((clamped - FONT_MIN) / FONT_STEP);
  return String(FONT_MIN + steps * FONT_STEP) as FontSizeLevel;
}

function fontSizeToValue(level: string): number {
  const num = parseFloat(level);
  if (Number.isNaN(num)) return FONT_MIN;
  return Math.max(FONT_MIN, Math.min(FONT_MAX, num));
}

const ThumbLabel = ({ value }: { value: number }) => (
  <span
    className="flex h-full w-full items-center justify-center rounded-full bg-destaque text-white font-bold"
    style={{
      fontSize: `${Math.max(0.65, value / 100)}rem`,
    }}
  >
    A
  </span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-black uppercase tracking-wider text-texto-secundario mb-3 border-l-4 border-destaque pl-3">
    {children}
  </h3>
);

export const AccessibilityPanel = () => {
  const { open, closeDrawer } = useAccessibilityDrawer();
  const {
    theme,
    setTheme,
    highContrast,
    toggleHighContrast,
    fontSizeLevel,
    setFontSizeLevel,
  } = useAccessibility();

  const fontValue = fontSizeToValue(fontSizeLevel);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeDrawer}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "85vw", sm: "320px" },
            bgcolor: "transparent",
            top: 0,
            bottom: `${DRAWER_BOTTOM_OFFSET}px`,
            height: "auto",
            borderRadius: 0,
          },
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          top: 0,
          bottom: `${DRAWER_BOTTOM_OFFSET}px`,
          height: "auto",
        },
      }}
    >
      <div className="flex h-full flex-col bg-fundo-superficie text-texto-principal shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="w-10" />
          <h2 className="text-center text-lg font-black uppercase tracking-wider text-texto-secundario">
            Acessibilidade
          </h2>
          <IconButton
            className="flex h-10 w-10 items-center justify-center"
            onClick={closeDrawer}
            aria-label="Fechar painel de acessibilidade"
            sx={{
              color: "var(--color-texto-secundario)",
              bgcolor: "var(--color-fundo-superficie-suave)",
              p: 1,
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "var(--color-fundo-superficie)",
                color: "var(--color-texto-principal)",
              },
            }}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        <div className="mx-auto mb-5 h-1 w-16 rounded bg-destaque"></div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-8">
          {/* Tema */}
          <section>
            <SectionTitle>Tema</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={theme === "light" ? "contained" : "outlined"}
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
                startIcon={<Sun className="h-4 w-4" />}
                sx={{
                  borderRadius: "4px",
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: theme === "light" ? "primary.main" : "transparent",
                  color: theme === "light" ? "primary.contrastText" : "text.primary",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: theme === "light" ? "primary.dark" : "var(--color-fundo-superficie-suave)",
                  },
                }}
              >
                Claro
              </Button>
              <Button
                variant={theme === "dark" ? "contained" : "outlined"}
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
                startIcon={<Moon className="h-4 w-4" />}
                sx={{
                  borderRadius: "4px",
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: theme === "dark" ? "primary.main" : "transparent",
                  color: theme === "dark" ? "primary.contrastText" : "text.primary",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: theme === "dark" ? "primary.dark" : "var(--color-fundo-superficie-suave)",
                  },
                }}
              >
                Escuro
              </Button>
            </div>
          </section>
 
          {/* Alto contraste */}
          <section>
            <SectionTitle>Alto contraste</SectionTitle>
            <Button
              fullWidth
              variant={highContrast ? "contained" : "outlined"}
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              startIcon={<Contrast className="h-4 w-4" />}
              color="secondary"
              sx={{
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 600,
                bgcolor: highContrast ? "secondary.main" : "transparent",
                color: highContrast ? "secondary.contrastText" : "text.primary",
                borderColor: "divider",
                "&:hover": {
                  bgcolor: highContrast ? "secondary.dark" : "var(--color-fundo-superficie-suave)",
                },
              }}
            >
              {highContrast ? "Ativado" : "Desativado"}
            </Button>
          </section>

          {/* Tamanho da fonte */}
          <section>
            <SectionTitle>Tamanho da fonte</SectionTitle>
            <Box className="px-2 py-3">
              <Slider
                value={fontValue}
                min={FONT_MIN}
                max={FONT_MAX}
                step={FONT_STEP}
                onChange={(_, value) =>
                  setFontSizeLevel(valueToFontSize(value as number))
                }
                aria-label="Tamanho da fonte"
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{
                  "& .MuiSlider-thumb": {
                    width: 28,
                    height: 28,
                    bgcolor: "var(--color-destaque)",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(0, 156, 59, 0.16)",
                    },
                  },
                  "& .MuiSlider-track": {
                    height: 8,
                    borderRadius: 1,
                    bgcolor: "var(--color-destaque)",
                  },
                  "& .MuiSlider-rail": {
                    height: 8,
                    borderRadius: 1,
                    bgcolor: "var(--color-borda-padrao)",
                  },
                  "& .MuiSlider-valueLabel": {
                    bgcolor: "var(--color-azul-unb-hover)",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                    padding: "4px 10px",
                    boxShadow:
                      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                  },
                  "& .MuiSlider-valueLabel:before": {
                    bgcolor: "var(--color-azul-unb-hover)",
                  },
                }}
                slotProps={{
                  thumb: {
                    children: <ThumbLabel value={fontValue} />,
                  },
                }}
              />
            </Box>
            <div className="flex justify-between px-2 text-xs text-texto-secundario font-semibold">
              <span>A</span>
              <span className="text-base">A</span>
            </div>
          </section>
        </div>
      </div>
    </Drawer>
  );
};
