import { ReactNode, useMemo, KeyboardEvent } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function combineClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProperties {
  children: ReactNode;
  variant?: 'glass' | 'surface' | 'stat' | 'profile';
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export const Card = ({
  children,
  variant = 'glass',
  className = '',
  onClick,
  noPadding = false,
}: CardProperties) => {
  const variantStyles = useMemo(
    () => ({
      surface: 'bg-bg-card border-2 border-brand-primary/20',
      stat: 'bg-bg-card border border-[var(--border-default)] hover:border-brand-primary/40 shadow-sm transition-all duration-300',
      glass:
        'bg-bg-card/50 backdrop-blur-xl border border-[var(--border-subtle)] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]',
      profile:
        'bg-bg-card border-2 border-brand-primary shadow-xl shadow-brand-primary/10',
    }),
    []
  );

  const interactiveStyles = onClick
    ? 'cursor-pointer select-none active:scale-[0.98] transition-transform duration-200'
    : '';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={combineClasses(
        'relative overflow-hidden rounded-[20px]',
        variantStyles[variant],
        noPadding ? 'p-0' : 'p-6',
        interactiveStyles,
        className
      )}
    >
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-linear-to-br from-[var(--text-on-elevated)]/5 to-transparent pointer-events-none" />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};
