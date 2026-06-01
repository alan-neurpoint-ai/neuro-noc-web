import React, { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  dismissOnOverlay?: boolean;
  icon?: React.ReactNode;
  variant?: "default" | "danger" | "success";
}

const MAX_WIDTH_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "md",
  className = "",
  dismissOnOverlay = true,
  icon,
  variant = "default",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return createPortal(
    <div
      data-variant={variant}
      className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6 [perspective:1200px]"
    >
      <div
        className={`absolute inset-0 ${dismissOnOverlay ? 'cursor-pointer' : ''}`}
        onClick={dismissOnOverlay ? onClose : undefined}
      />

      <div className="absolute inset-0 bg-black/50 dark:bg-black/72 backdrop-blur-xl animate-overlay-in" />

      <div className="absolute pointer-events-none w-80 h-80 rounded-full top-1/2 left-1/2 blur-[40px] gradient-modal-orb animate-orb-pulse origin-center" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`relative w-full ${MAX_WIDTH_MAP[maxWidth]} flex flex-col rounded-2xl overflow-hidden gradient-modal-bg border border-[var(--modal-ring)] shadow-modal animate-modal-in origin-bottom ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-0.75 w-full shrink-0 gradient-modal-bar" />

        <div className="absolute top-0 left-0 pointer-events-none w-[180px] h-[180px] gradient-modal-corner [border-radius:0_0_100%_0]" />

        <div className="relative flex items-start justify-between gap-4 px-6 py-5 shrink-0 border-b border-[var(--modal-ring)]/40">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-modal-icon">
                {icon}
              </div>
            )}

            <div className="flex flex-col gap-0.5 min-w-0">
              {title && (
                <h3
                  id="modal-title"
                  className="text-sm font-black uppercase tracking-[0.22em] truncate text-[var(--modal-accent)]"
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs truncate text-text-muted/60">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 bg-[var(--modal-ring)]/30 border border-[var(--modal-ring)]/55 text-[var(--modal-accent)]/50 hover:bg-[var(--modal-ring)] hover:text-white hover:border-[var(--modal-accent)]/40"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2L12 12M12 2L2 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="relative px-6 py-6 overflow-y-auto flex-1 max-h-[65vh] text-text-on-elevated [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>

        {footer && (
          <div className="relative px-6 py-4 flex items-center justify-end gap-3 shrink-0 border-t border-[var(--modal-ring)]/40 bg-text-on-elevated/5">
            <div className="absolute left-6 flex gap-1 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-[var(--modal-accent)]' : 'bg-[var(--modal-ring)]'}`}
                />
              ))}
            </div>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};