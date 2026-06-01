import { useEffect, useCallback } from 'react';
import { BiCheckCircle, BiErrorCircle, BiInfoCircle, BiX } from 'react-icons/bi';
import { useToastStore, type ToastType } from '../../stores/useToastStore';

const ICON_MAP: Record<ToastType, typeof BiCheckCircle> = {
  success: BiCheckCircle,
  error: BiErrorCircle,
  warning: BiInfoCircle,
  info: BiInfoCircle,
};

const ACCENT_MAP: Record<ToastType, string> = {
  success: 'border-l-emerald-400',
  error: 'border-l-red-400',
  warning: 'border-l-amber-400',
  info: 'border-l-brand-primary',
};

const ICON_COLOR_MAP: Record<ToastType, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-brand-primary',
};

const PROGRESS_COLOR_MAP: Record<ToastType, string> = {
  success: 'bg-emerald-400',
  error: 'bg-red-400',
  warning: 'bg-amber-400',
  info: 'bg-brand-primary',
};

function ToastItem({ toast }: { toast: ReturnType<typeof useToastStore.getState>['toasts'][number] }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const Icon = ICON_MAP[toast.type];

  const handleClose = useCallback(() => {
    removeToast(toast.id);
  }, [removeToast, toast.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      className={`animate-toast-in flex items-start gap-3 w-80 bg-bg-card/95 backdrop-blur-xl border border-border-subtle border-l-[3px] ${ACCENT_MAP[toast.type]} rounded-xl p-4 shadow-2xl shadow-black/40 pointer-events-auto`}
    >
      <Icon className={`text-lg mt-0.5 shrink-0 ${ICON_COLOR_MAP[toast.type]}`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-on-elevated leading-tight">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="shrink-0 text-text-muted hover:text-text-main transition-colors mt-0.5"
      >
        <BiX className="text-base" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${PROGRESS_COLOR_MAP[toast.type]} animate-toast-progress`}
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      </div>
    </div>
  );
}

export const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};