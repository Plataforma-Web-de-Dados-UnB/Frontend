export const openDialog = (id: string) =>
  (document.getElementById(id) as HTMLDialogElement | null)?.showModal();

export const closeDialog = (id: string) =>
  (document.getElementById(id) as HTMLDialogElement | null)?.close();
