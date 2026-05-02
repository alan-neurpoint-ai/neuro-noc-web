import type { ReactNode } from "react";
import {
  HiCheckCircle,
  HiTrash,
  HiPencilAlt,
  HiLogout,
  HiXCircle,
  HiLogin,
  HiArrowSmLeft,
} from "react-icons/hi";

type ButtonVariant =
  | "success"
  | "delete"
  | "edit"
  | "exit"
  | "cancel"
  | "login"
  | "logout";

interface ButtonProps {
  variant: ButtonVariant;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variantConfig = {
  success: {
    icon: <HiCheckCircle className="text-lg" />,
    styles:
      "border-emerald-900/30 bg-emerald-950/20 text-emerald-200 hover:bg-emerald-900/40",
    label: "Confirmar",
  },
  delete: {
    icon: <HiTrash className="text-lg" />,
    styles: "border-red-900/30 bg-red-950/20 text-red-200 hover:bg-red-900/40",
    label: "Eliminar",
  },
  edit: {
    icon: <HiPencilAlt className="text-lg" />,
    styles: "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20",
    label: "Editar",
  },
  exit: {
    icon: <HiArrowSmLeft className="text-lg" />,
    styles: "border-muted/30 bg-muted/10 text-text-secondary hover:bg-muted/20",
    label: "Salir",
  },
  cancel: {
    icon: <HiXCircle className="text-lg" />,
    styles:
      "border-muted/30 bg-transparent text-muted hover:border-muted/60 hover:text-text-secondary",
    label: "Cancelar",
  },
  login: {
    icon: <HiLogin className="text-lg" />,
    styles:
      "border-accent/40 bg-accent/20 text-accent hover:bg-accent/30 shadow-[0_0_15px_rgba(197,160,89,0.1)]",
    label: "Acceder",
  },
  logout: {
    icon: <HiLogout className="text-lg" />,
    styles:
      "border-orange-900/30 bg-orange-950/20 text-orange-200 hover:bg-orange-900/40",
    label: "Cerrar Sesión",
  },
};

export const Button = ({
  variant,
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const config = variantConfig[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        /* Layout Base y Responsivo */
        flex items-center justify-center gap-2 
        px-4 py-2.5 min-w-30 w-full sm:w-auto
        
        /* Estética Premium Mate */
        border transition-all duration-300 ease-out
        text-xs font-medium uppercase tracking-[0.15em]
        rounded-sm backdrop-blur-sm
        disabled:opacity-40 disabled:cursor-not-allowed
        
        /* Variantes dinámicas */
        ${config.styles}
        ${className}
      `}
    >
      {config.icon}
      <span>{children || config.label}</span>
    </button>
  );
};
