import { toast } from "react-hot-toast";

export const ToastNotification = (title, message, type = "default") => {
  const style =
    type === "success"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
      : type === "error"
        ? "bg-rose-50 text-rose-900 border-rose-200"
        : "bg-slate-50 text-slate-900 border-slate-200";
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  toast.custom(
    (t) => (
      <div
        className={`max-w-sm w-full ${style} border shadow-sm rounded-2xl pointer-events-auto flex items-center gap-3 px-4 py-3 transition duration-150 ease-out`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-base font-semibold">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-5">{title}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-600">{message}</p>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toast.remove(t.id);
          }}
          className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 focus:outline-none"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    ),
    {
      duration: 3000,
      position: "top-right",
    },
  );
};
