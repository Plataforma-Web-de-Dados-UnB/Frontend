import { driver } from "driver.js";
import type { DriveStep } from "driver.js";
import { useLocation } from "react-router-dom";
import { closeDrawerImperative } from "@/features/accessibility/accessibilityDrawerRef";
import {
  homeSteps,
  paineisSteps,
  categoriaSteps,
  painelSteps,
  adminDashboardSteps,
  adminPipelinesSteps,
  adminUploadSteps,
  adminCategoriasSteps,
  adminPaineisSteps,
  adminUsuariosSteps,
  adminSugestoesSteps,
} from "./tourSteps";

const STORAGE_KEY_PREFIX = "tour-done-";

function isDone(page: string): boolean {
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}${page}`) === "1";
}

function markDone(page: string): void {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${page}`, "1");
}

function resetAll(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_KEY_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

function buildDriver(steps: DriveStep[], onDone?: () => void) {
  const isHC = document.documentElement.classList.contains("high-contrast");
  const isDark = document.documentElement.classList.contains("dark");
  const overlayColor = isHC || isDark ? "#000000" : "#1a2744";
  const overlayOpacity = isHC ? 0.9 : isDark ? 0.7 : 0.5;

  let closedByOverlay = false;

  const d = driver({
    showProgress: true,
    showButtons: ["next", "previous", "close"],
    steps,
    popoverClass: "unb-tour-popover",
    nextBtnText: "Próximo",
    prevBtnText: "Anterior",
    doneBtnText: "Concluir",
    progressText: "{{current}} de {{total}}",
    overlayColor,
    overlayOpacity,
    smoothScroll: true,
    popoverOffset: 12,
    stagePadding: 6,
    stageRadius: 4,
    overlayClickBehavior: () => {
      closedByOverlay = true;
      d.destroy();
    },
    onDestroyed: () => {
      closeDrawerImperative();
      if (closedByOverlay) return;
      onDone?.();
    },
  });

  return d;
}

export function startTour(
  page: string,
  steps: DriveStep[],
  force = false,
): void {
  if (!force && isDone(page)) return;
  const d = buildDriver(steps, () => markDone(page));
  d.drive();
}

export function resetTours(): void {
  resetAll();
}

export { isDone as isTourDone };

const ROUTE_TOUR_MAP: Array<{
  pattern: RegExp;
  page: string;
  label: string;
  steps: DriveStep[];
}> = [
  {
    pattern: /^\/admin\/pipelines/,
    page: "admin-pipelines",
    label: "Pipelines",
    steps: adminPipelinesSteps,
  },
  {
    pattern: /^\/admin\/upload/,
    page: "admin-upload",
    label: "Upload",
    steps: adminUploadSteps,
  },
  {
    pattern: /^\/admin\/categorias/,
    page: "admin-categorias",
    label: "Categorias",
    steps: adminCategoriasSteps,
  },
  {
    pattern: /^\/admin\/paineis/,
    page: "admin-paineis",
    label: "Painéis Admin",
    steps: adminPaineisSteps,
  },
  {
    pattern: /^\/admin\/usuarios/,
    page: "admin-usuarios",
    label: "Usuários",
    steps: adminUsuariosSteps,
  },
  {
    pattern: /^\/admin\/sugestoes/,
    page: "admin-sugestoes",
    label: "Sugestões Admin",
    steps: adminSugestoesSteps,
  },
  {
    pattern: /^\/admin/,
    page: "admin-dashboard",
    label: "Dashboard Admin",
    steps: adminDashboardSteps,
  },
  {
    pattern: /^\/paineis\/categoria\//,
    page: "categoria",
    label: "Categoria",
    steps: categoriaSteps,
  },
  {
    pattern: /^\/paineis\/painel\//,
    page: "painel",
    label: "Painel",
    steps: painelSteps,
  },
  {
    pattern: /^\/paineis/,
    page: "paineis",
    label: "Painéis",
    steps: paineisSteps,
  },
  { pattern: /^\/$/, page: "home", label: "Início", steps: homeSteps },
];

export function useTourForPage(): {
  page: string;
  label: string;
  steps: DriveStep[];
} | null {
  const { pathname } = useLocation();
  const match = ROUTE_TOUR_MAP.find(({ pattern }) => pattern.test(pathname));
  return match ?? null;
}
