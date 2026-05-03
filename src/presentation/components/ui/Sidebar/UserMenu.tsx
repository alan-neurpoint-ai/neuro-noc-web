import { memo } from "react";
import { Button } from "../Button/Button";

export const UserMenu = memo(({ user, onLogout, onClose }: any) => (
  <div className="absolute bottom-20 left-4 right-4 bg-surface/95 backdrop-blur-sm border border-accent/20 rounded-lg p-4 animate-in fade-in zoom-in duration-200 shadow-xl z-50">
    <div className="flex flex-col gap-3">
      <div className="space-y-1">
        <p className="text-[9px] text-accent uppercase tracking-widest font-bold">
          Rol
        </p>
        <p className="text-xs text-text-primary font-medium">{user.role}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[9px] text-accent uppercase tracking-widest font-bold">
          Email
        </p>
        <p className="text-xs text-text-secondary break-all">{user.email}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[9px] text-accent uppercase tracking-widest font-bold">
          Organización
        </p>
        <p className="text-xs text-text-secondary">{user.organization}</p>
      </div>
      <Button
        variant="logout"
        className="w-full mt-2 py-2 text-[10px]"
        onClick={() => {
          onLogout?.();
          onClose();
        }}
      >
        Cerrar Sesión
      </Button>
    </div>
  </div>
));
UserMenu.displayName = "UserMenu";
