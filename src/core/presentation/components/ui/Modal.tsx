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

const VARIANTS = {
  default: {
    accent: "#b29af4",
    primary: "#672da9",
    glow: "rgba(103,45,169,0.25)",
    ring: "rgba(178,154,244,0.18)",
    bar: "linear-gradient(90deg, transparent, #b29af4 30%, #672da9 70%, transparent)",
  },
  danger: {
    accent: "#f87171",
    primary: "#7c0808",
    glow: "rgba(124,8,8,0.30)",
    ring: "rgba(248,113,113,0.18)",
    bar: "linear-gradient(90deg, transparent, #f87171 30%, #7c0808 70%, transparent)",
  },
  success: {
    accent: "#34d399",
    primary: "#065f46",
    glow: "rgba(6,95,70,0.30)",
    ring: "rgba(52,211,153,0.18)",
    bar: "linear-gradient(90deg, transparent, #34d399 30%, #065f46 70%, transparent)",
  },
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
  const v = VARIANTS[variant];

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
      className="fixed inset-0 z-999 flex items-center justify-center p-4 sm:p-6"
      style={{ perspective: "1200px" }}
    >
      <div
        className="absolute inset-0"
        onClick={dismissOnOverlay ? onClose : undefined}
        style={{
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          animation: "overlayIn 0.25s ease forwards",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${v.glow} 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
          animation: "orbPulse 3s ease-in-out infinite",
        }}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`relative w-full ${MAX_WIDTH_MAP[maxWidth]} flex flex-col rounded-2xl overflow-hidden ${className}`}
        style={{
          background:
            "linear-gradient(160deg, #2d1b69 0%, #1a0f3e 55%, #0d0820 100%)",
          border: `1px solid ${v.ring}`,
          boxShadow: [
            `0 0 0 1px ${v.ring}`,
            `0 0 60px ${v.glow}`,
            "0 40px 80px rgba(0,0,0,0.7)",
            "0 0 0 1px rgba(255,255,255,0.03) inset",
          ].join(", "),
          animation: "modalIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards",
          transformOrigin: "center bottom",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-0.75 w-full shrink-0" style={{ background: v.bar }} />

        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: 180,
            height: 180,
            background: `radial-gradient(circle at 0% 0%, ${v.glow} 0%, transparent 65%)`,
            borderRadius: "0 0 100% 0",
          }}
        />

        <div
          className="relative flex items-start justify-between gap-4 px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(178,154,244,0.08)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl"
                style={{
                  background: `rgba(103,45,169,0.25)`,
                  border: `1px solid ${v.ring}`,
                  boxShadow: `0 0 12px ${v.glow}`,
                }}
              >
                {icon}
              </div>
            )}

            <div className="flex flex-col gap-0.5 min-w-0">
              {title && (
                <h3
                  id="modal-title"
                  className="text-sm font-black uppercase tracking-[0.22em] truncate"
                  style={{ color: v.accent }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  className="text-xs truncate"
                  style={{ color: "rgba(156,163,175,0.6)" }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(178,154,244,0.06)",
              border: "1px solid rgba(178,154,244,0.1)",
              color: "rgba(178,154,244,0.5)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(178,154,244,0.15)";
              el.style.color = "#ffffff";
              el.style.borderColor = "rgba(178,154,244,0.25)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(178,154,244,0.06)";
              el.style.color = "rgba(178,154,244,0.5)";
              el.style.borderColor = "rgba(178,154,244,0.1)";
            }}
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

        <div
          className="relative px-6 py-6 overflow-y-auto flex-1"
          style={{
            maxHeight: "65vh",
            color: "rgba(255,255,255,0.78)",
            scrollbarWidth: "none",
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            className="relative px-6 py-4 flex items-center justify-end gap-3 shrink-0"
            style={{
              borderTop: "1px solid rgba(178,154,244,0.08)",
              background: "rgba(0,0,0,0.25)",
            }}
          >
            <div className="absolute left-6 flex gap-1 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: i === 0 ? v.accent : "rgba(178,154,244,0.2)",
                  }}
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
