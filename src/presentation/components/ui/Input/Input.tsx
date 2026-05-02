import React from "react";
import {
  HiHashtag,
  HiCursorClick,
  HiCalendar,
  HiDocumentText,
  HiFingerPrint,
  HiMail,
  HiLockClosed,
} from "react-icons/hi";

type InputType =
  | "text"
  | "number"
  | "decimal"
  | "alphanumeric"
  | "date"
  | "datetime"
  | "email"
  | "password";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  type: InputType;
  label?: string;
  error?: string;
}

const inputConfig = {
  text: {
    icon: <HiDocumentText />,
    pattern: "[A-Za-z\\s]*",
    placeholder: "Solo texto...",
    htmlType: "text",
  },
  number: {
    icon: <HiHashtag />,
    pattern: "[0-9]*",
    placeholder: "0000",
    htmlType: "text",
  },
  decimal: {
    icon: <HiCursorClick />,
    pattern: "[0-9]*[.,]?[0-9]*",
    placeholder: "0.00",
    htmlType: "text",
  },
  alphanumeric: {
    icon: <HiFingerPrint />,
    pattern: "[A-Za-z0-9]*",
    placeholder: "A1-B2...",
    htmlType: "text",
  },
  date: {
    icon: <HiCalendar />,
    pattern: undefined,
    placeholder: "",
    htmlType: "date",
  },
  datetime: {
    icon: <HiCalendar />,
    pattern: undefined,
    placeholder: "",
    htmlType: "datetime-local",
  },
  email: {
    icon: <HiMail />,
    pattern: undefined,
    placeholder: "usuario@ejemplo.com",
    htmlType: "email",
  },
  password: {
    icon: <HiLockClosed />,
    pattern: undefined,
    placeholder: "••••••••",
    htmlType: "password",
  },
};

export const Input = ({
  type,
  label,
  error,
  className = "",
  ...props
}: InputProps) => {
  const config = inputConfig[type];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[10px] uppercase tracking-[0.2em] text-accent/80 ml-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3 text-muted text-lg pointer-events-none transition-colors duration-300">
          {config.icon}
        </div>

        <input
          {...props}
          type={config.htmlType}
          pattern={config.pattern}
          placeholder={props.placeholder || config.placeholder}
          className={`
            w-full pl-10 pr-4 py-2.5 
            bg-surface/50 border border-muted/30
            text-text-primary text-sm placeholder:text-muted/50
            rounded-sm outline-none transition-all duration-300
            focus:border-accent/40 focus:bg-surface/80 focus:shadow-[0_0_10px_rgba(197,160,89,0.05)]
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? "border-red-900/50 focus:border-red-500/50" : ""}
            ${className}
          `}
          onBeforeInput={(e: any) => {
            if (config.pattern) {
              const regex = new RegExp(`^${config.pattern}$`);
              if (!regex.test(e.data)) e.preventDefault();
            }
          }}
        />
      </div>

      {error && (
        <span className="text-[10px] text-red-400/80 mt-1 ml-1 uppercase tracking-wider italic">
          {error}
        </span>
      )}
    </div>
  );
};
