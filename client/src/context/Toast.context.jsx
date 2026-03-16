import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ message, type = "info", duration = 4000 }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl
              font-mono text-sm font-bold animate-in slide-in-from-right duration-300 ${
                t.type === "success"
                  ? "bg-green-950/80 border-green-500/30 text-green-300"
                  : t.type === "error"
                  ? "bg-red-950/80 border-red-500/30 text-red-300"
                  : t.type === "warning"
                  ? "bg-amber-950/80 border-amber-500/30 text-amber-300"
                  : "bg-[#161616]/90 border-white/10 text-gray-200"
              }`}
          >
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
