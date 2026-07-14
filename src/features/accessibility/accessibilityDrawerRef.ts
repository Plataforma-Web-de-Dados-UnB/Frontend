let _openDrawer: (() => void) | null = null;
let _closeDrawer: (() => void) | null = null;

export function registerOpenDrawer(fn: () => void) {
  _openDrawer = fn;
}

export function registerCloseDrawer(fn: () => void) {
  _closeDrawer = fn;
}

export function openDrawerImperative() {
  _openDrawer?.();
}

export function closeDrawerImperative() {
  _closeDrawer?.();
}
