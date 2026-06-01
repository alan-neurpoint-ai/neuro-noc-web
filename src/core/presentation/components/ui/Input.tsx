import {
  type InputHTMLAttributes,
  type ReactNode,
  type ChangeEvent,
} from 'react';

const INPUT_PATTERNS = {
  text: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/,
  numeric: /^[0-9]*$/,
  decimal: /^\d*\.?\d*$/,
  alphanumeric: /^[a-zA-Z0-9]*$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phonePrefix: /^\+[0-9]*$/,
};

export type InputValidationType =
  | keyof typeof INPUT_PATTERNS
  | 'password'
  | 'datetime'
  | 'none';

interface InputProperties extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  validationType?: InputValidationType;
  type?: 'text' | 'password' | 'email' | 'number' | 'datetime-local' | 'tel';
}

export const Input = ({
  label,
  icon,
  error,
  validationType = 'none',
  onChange,
  className = '',
  type = 'text',
  ...props
}: InputProperties) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      validationType !== 'none' &&
      validationType !== 'password' &&
      validationType !== 'datetime'
    ) {
      const validationPattern =
        INPUT_PATTERNS[validationType as keyof typeof INPUT_PATTERNS];
      if (validationPattern && !validationPattern.test(event.target.value)) {
        return;
      }
    }
    if (onChange) onChange(event);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="font-label text-[clamp(9px,0.6vw,13px)] font-black uppercase tracking-[0.15em] text-brand-secondary ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary transition-colors duration-300 z-10">
            {icon}
          </div>
        )}

        <input
          type={type}
          onChange={handleInputChange}
          className={`
            w-full bg-bg-surface font-body text-[clamp(0.8rem,0.85vw,1rem)] text-text-main transition-all duration-300
            ${icon ? 'pl-12 pr-4' : 'px-5'} py-3 xl:py-3.5
            rounded-[12px]
            border border-border-subtle
            ${
              error
                ? 'border-status-error ring-4 ring-status-error/10'
                : 'focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'
            }
            placeholder:text-text-muted/30 outline-none
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="font-label text-[clamp(8px,0.5vw,11px)] font-bold text-status-error uppercase tracking-widest ml-1">
          {error}
        </span>
      )}
    </div>
  );
};
