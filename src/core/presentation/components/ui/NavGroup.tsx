import React, { useState, useMemo } from 'react';
import { NavItem } from '../../../types/navigation/navigation.types';

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
        child.id === activeId || child.children?.some((c) => c.id === activeId)
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
        className={`group relative w-full flex items-center gap-3 rounded-xl transition-all duration-200 ${
          isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
        } ${
          isGroupActive
            ? 'bg-brand-primary/12 text-text-on-elevated'
            : 'text-text-on-elevated-muted hover:bg-brand-primary/6 hover:text-text-on-elevated'
        }`}
      >
        {isGroupActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full bg-brand-secondary shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
        )}

        <div
          className={`shrink-0 transition-all duration-200 ${
            isGroupActive
              ? 'text-brand-secondary'
              : 'text-text-on-elevated-muted/60 group-hover:text-brand-secondary/70'
          }`}
        >
          {item.icon}
        </div>

        {!isCollapsed && (
          <div className="flex items-center justify-between flex-1 min-w-0">
            <span
              className={`text-[13px] font-headline truncate transition-colors duration-200 ${
                isGroupActive ? 'font-semibold' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/25">
                  {item.badge}
                </span>
              )}
              {item.children && (
                <svg
                  className={`w-3.5 h-3.5 text-text-on-elevated-muted/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
          </div>
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-bg-elevated border border-border-default rounded-lg text-xs font-headline text-text-on-elevated opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
            {item.label}
          </div>
        )}
      </button>

      {!isCollapsed && item.children && (
        <div
          className={`transition-all duration-200 overflow-hidden ${isOpen ? 'max-h-96 opacity-100 mt-0.5' : 'max-h-0 opacity-0'}`}
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
                className={`group/child relative w-full flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg transition-all duration-200 text-left cursor-pointer ${
                  isChildActive
                    ? 'bg-brand-primary/8 text-brand-secondary'
                    : 'text-text-on-elevated-muted hover:bg-brand-primary/5 hover:text-text-on-elevated/80'
                }`}
              >
                {isChildActive && (
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-0.75 h-3 rounded-r-full bg-brand-secondary shadow-[0_0_6px_rgba(129,140,248,0.4)]" />
                )}

                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                    isChildActive
                      ? 'bg-brand-secondary shadow-[0_0_4px_rgba(129,140,248,0.5)]'
                      : 'bg-text-on-elevated-muted/20 group-hover/child:bg-brand-secondary/40'
                  }`}
                />

                <span
                  className={`text-[13px] font-headline truncate transition-colors duration-200 ${
                    isChildActive ? 'font-semibold' : ''
                  }`}
                >
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
