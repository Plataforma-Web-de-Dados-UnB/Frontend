import { Loader2 } from "lucide-react";

type ConfirmDialogProps = {
  id: string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmTone?: "danger" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
};

export const ConfirmDialog = ({
  id,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmTone = "danger",
  isLoading,
  onConfirm,
}: ConfirmDialogProps) => {
  const confirmClass =
    confirmTone === "primary"
      ? "inline-flex cursor-pointer items-center gap-2 rounded bg-destaque px-4 py-2 text-sm font-semibold text-white transition hover:bg-destaque-hover disabled:cursor-not-allowed disabled:opacity-60"
      : "inline-flex cursor-pointer items-center gap-2 rounded bg-erro px-4 py-2 text-sm font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <dialog
      id={id}
      className="fixed inset-0 m-auto rounded bg-transparent p-0 backdrop:bg-black/50"
      onClick={(e) => {
        if (e.currentTarget === e.target)
          (e.currentTarget as HTMLDialogElement).close();
      }}
    >
      <div className="w-[min(92vw,26rem)] rounded border border-borda-padrao bg-fundo-superficie p-6 text-texto-principal shadow-2xl">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-texto-secundario">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <form method="dialog">
            <button
              type="submit"
              className="cursor-pointer rounded px-4 py-2 text-sm font-semibold text-texto-secundario transition hover:bg-fundo-superficie-suave"
            >
              {cancelText}
            </button>
          </form>
          <button
            type="button"
            className={confirmClass}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
};
