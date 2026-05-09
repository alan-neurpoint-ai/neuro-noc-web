import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "glass" | "surface" | "stat" | "profile";
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export const Card = ({
  children,
  variant = "glass",
  className = "",
  onClick,
  noPadding = false,
}: CardProps) => {
  const variants = {
    surface: "bg-[#f3f0ff] border-2 border-brand-primary/40",
    stat: "bg-[#f3f0ff] border-2 border-brand-primary/30 hover:border-brand-primary transition-colors",
    glass: "bg-white/[0.03] backdrop-blur-xl border border-white/10",
    profile: "bg-[#f3f0ff] border-2 border-brand-primary shadow-lg",
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        rounded-[20px] 
        ${variants[variant]}
        ${noPadding ? "p-0" : "p-6"}
        ${onClick ? "cursor-pointer active:scale-[0.98] transition-all" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
