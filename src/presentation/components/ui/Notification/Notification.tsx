import { useEffect, type JSX } from "react";
import {
  HiCheckCircle,
  HiExclamation,
  HiInformationCircle,
  HiX,
  HiXCircle,
} from "react-icons/hi";
import { Button } from "../Button/Button";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const config: Record<
  NotificationType,
  { icon: JSX.Element; color: string; border: string }
> = {
  success: {
    icon: <HiCheckCircle className="text-emerald-400" />,
    color: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    border: "border-emerald-500/30",
  },
  error: {
    icon: <HiXCircle className="text-red-400" />,
    color: "shadow-[0_0_15px_rgba(239,68,68,0.1)]",
    border: "border-red-500/30",
  },
  warning: {
    icon: <HiExclamation className="text-orange-400" />,
    color: "shadow-[0_0_15px_rgba(249,115,22,0.1)]",
    border: "border-orange-500/30",
  },
  info: {
    icon: <HiInformationCircle className="text-blue-glow" />,
    color: "shadow-[0_0_15px_rgba(56,189,248,0.1)]",
    border: "border-blue-glow/30",
  },
};

export const Notification = ({
  id,
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const { icon, color, border } = config[type];

  return (
    <div
      className={`
      glass-card min-w-[320px] max-w-md p-4 mb-3 
      flex gap-4 items-start animate-in slide-in-from-right duration-300
      ${border} ${color}
    `}
    >
      <div className="text-2xl mt-0.5">{icon}</div>

      <div className="flex-1 flex flex-col gap-1">
        <h5 className="text-[10px] uppercase tracking-[0.2em] text-text-primary font-bold">
          {title}
        </h5>
        <p className="text-xs text-text-secondary font-light leading-relaxed">
          {message}
        </p>
      </div>

      <Button
        variant="success"
        onClick={() => onClose(id)}
        className="text-muted hover:text-accent transition-colors p-1"
      >
        <HiX size={14} />
      </Button>
    </div>
  );
};
