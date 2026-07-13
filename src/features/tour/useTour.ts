import { driver } from "driver.js";
import type { DriveStep } from "driver.js";

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

  let closedByX = false;

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
    onCloseClick: () => {
      closedByX = true;
      d.destroy();
    },
    onDestroyed: (_el, _step, { state }) => {
      if (closedByX) return;
      if (state.activeIndex !== undefined) return;
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
