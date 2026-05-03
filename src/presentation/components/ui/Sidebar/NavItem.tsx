import { memo } from "react";

export const NavItem = memo(
  ({ item, isActive, isCollapsed, onNavigate }: any) => (
    <button
      onClick={() => onNavigate(item.path)}
      className={`
      flex items-center gap-4 px-3 py-3 rounded-sm transition-all duration-200 group w-full
      ${isCollapsed ? "justify-center" : ""}
      ${
        isActive
          ? "bg-blue-primary/20 text-blue-glow border-l-2 border-accent"
          : "text-text-secondary hover:bg-blue-primary/30 hover:text-blue-glow"
      }
    `}
    >
      <span className="shrink-0 group-hover:scale-110 transition-transform">
        {item.icon}
      </span>
      {!isCollapsed && (
        <span className="text-xs uppercase tracking-[0.2em] font-medium">
          {item.label}
        </span>
      )}
    </button>
  ),
);

NavItem.displayName = "NavItem";
