import React, { useState, useMemo } from "react";
import { NavItem } from "../../../types/navigation/navigation.types";

export const NavGroup: React.FC<{
  item: NavItem;
  isCollapsed: boolean;
  activeId: string | undefined;
  onNavigate: (id: string, path: string) => void;
}> = ({ item, isCollapsed, activeId, onNavigate }) => {
  const hasActiveChild = useMemo(() => {
    if (!item.children) return false;
    return item.children.some(
      (child) =>
        child.id === activeId ||
        child.children?.some((c) => c.id === activeId),
    );
  }, [item.children, activeId]);

  const [isOpen, setIsOpen] = useState(hasActiveChild);

  const isGroupActive = item.id === activeId || hasActiveChild;

  const handleGroupClick = () => {
    if (item.children && item.children.length > 0) {
      setIsOpen(!isOpen);
    } else if (item.path) {
      onNavigate(item.id, item.path);
    }
  };

  const handleChildClick = (child: NavItem) => {
    if (child.path) {
      onNavigate(child.id, child.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleGroupClick}
        className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isGroupActive
            ? "bg-linear-to-r from-brand-primary/20 to-transparent border-l-2 border-brand-primary"
            : "hover:bg-hover-bg text-text-on-elevated-muted hover:text-text-on-elevated"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        <div
          className={`shrink-0 transition-colors ${
            isGroupActive
              ? "text-brand-accent"
              : "text-text-on-elevated-muted group-hover:text-brand-accent/80"
          }`}
        >
          {item.icon}
        </div>
        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1 min-w-0">
            <span
              className={`text-sm font-headline truncate ${
                isGroupActive ? "text-text-on-elevated font-semibold" : "font-medium"
              }`}
            >
              {item.label}
            </span>
            {item.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
                {item.badge}
              </span>
            )}
            {item.children && (
              <svg
                className={`w-3.5 h-3.5 text-text-on-elevated-muted transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-bg-elevated border border-border-default rounded-lg text-xs font-headline text-text-on-elevated opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
            {item.label}
          </div>
        )}
      </button>

      {/* Subitems */}
      {!isCollapsed && item.children && (
        <div
          className={`transition-all duration-200 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ 
            overflow: isOpen ? 'visible' : 'hidden',
            position: 'relative',
            zIndex: 5
          }}
        >
          {item.children.map((child) => {
            const isChildActive = child.id === activeId;
            return (
              <button
                key={child.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChildClick(child);
                }}
                className={`w-full flex items-center gap-3 px-9 py-2 rounded-lg transition-all duration-200 text-left cursor-pointer hover:bg-hover-bg ${
                  isChildActive
                    ? "bg-brand-primary/10 text-brand-accent font-medium"
                    : "text-text-on-elevated-muted hover:text-text-on-elevated/70"
                }`}
                style={{ position: 'relative', zIndex: 10 }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0">
                  {isChildActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-text-on-elevated-muted/30" />
                  )}
                </div>
                <span className="text-xs font-headline truncate">
                  {child.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};