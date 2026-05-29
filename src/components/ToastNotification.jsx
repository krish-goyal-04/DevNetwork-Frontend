import { toast } from "react-hot-toast";

export const ToastNotification = (
  title,
  message,
  type = "default",
) => {
  const backgroundClass =
    type === "success"
      ? "bg-emerald-50"
      : type === "error"
      ? "bg-rose-50"
      : "bg-white";
  const textClass =
    type === "success"
      ? "text-emerald-700"
      : type === "error"
      ? "text-rose-700"
      : "text-gray-900";

  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-custom-enter" : "animate-custom-leave"
      } max-w-md w-full ${backgroundClass} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${textClass}`}>
              {title}
            </p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toast.dismiss(t.id ?? undefined);
          }}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  ));
};
