import { memo } from "react";

export const UserAvatar = memo(({ user, isCollapsed, onClick }: any) => {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200
        ${isCollapsed ? "justify-center" : "hover:bg-blue-primary/20"}
      `}
    >
      <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-accent/20 to-blue-primary/20 border border-accent/30 flex items-center justify-center text-accent font-bold">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm">{initial}</span>
        )}
      </div>
      {!isCollapsed && (
        <div className="flex flex-col items-start overflow-hidden text-left flex-1">
          <span className="text-xs font-bold text-text-primary uppercase truncate w-full">
            {user.name}
          </span>
          <span className="text-[9px] text-accent/60 uppercase tracking-tighter">
            {user.organization}
          </span>
        </div>
      )}
    </button>
  );
});
UserAvatar.displayName = "UserAvatar";
