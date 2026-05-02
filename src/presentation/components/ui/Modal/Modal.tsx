import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import { Button } from "../Button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeConfig = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div
        className={`
        relative w-full ${sizeConfig[size]} 
        glass-card border border-accent/20 
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        flex flex-col animate-in fade-in zoom-in duration-300
      `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-muted/10">
          <h3 className="text-xs uppercase tracking-[0.3em] text-accent font-light">
            {title}
          </h3>
          <Button
            variant="exit"
            onClick={onClose}
            className="text-muted hover:text-accent transition-colors"
          >
            <HiX size={18} />
          </Button>
        </div>

        <div className="px-6 py-8 overflow-y-auto max-h-[70vh]">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-muted/10 flex justify-end gap-3 bg-surface/20">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};
