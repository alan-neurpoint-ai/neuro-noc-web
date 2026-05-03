import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { HiChevronLeft, HiMenu } from "react-icons/hi";
import { getMenuItemsByRole } from "./menuConfig";
import { UserAvatar } from "./UserAvatar";
import { UserMenu } from "./UserMenu";
import { NavItem } from "./NavItem";
import type { UserData } from "../../../../core/entities/analytics";

interface SidebarProps {
  user: UserData;
  onLogout?: () => void;
}

export const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const navigate = useNavigate();
  const menuItems = getMenuItemsByRole(user.role);

  const handleNavigation = useCallback(
    (path: string) => {
      setCurrentPath(path);
      navigate(path);
    },
    [navigate],
  );

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    if (!isCollapsed) {
      setIsUserMenuOpen((prev) => !prev);
    }
  }, [isCollapsed]);

  const closeUserMenu = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  return (
    <aside
      className={`
        ${isCollapsed ? "w-20" : "w-64"} 
        h-screen bg-background border-r border-muted/10 
        flex flex-col relative transition-all duration-300 ease-in-out
      `}
    >
      <button
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        className="absolute -right-3 top-10 w-6 h-6 bg-blue-primary border border-accent/20 rounded-full flex items-center justify-center text-accent hover:text-blue-glow transition-colors z-50"
      >
        {isCollapsed ? <HiMenu size={14} /> : <HiChevronLeft size={14} />}
      </button>

      <div className="p-6 mb-2 overflow-hidden whitespace-nowrap shrink-0">
        <h2 className="text-xl font-bold tracking-tighter text-text-primary">
          N
          {!isCollapsed && (
            <span>
              EURO<span className="text-accent">NOC</span>
            </span>
          )}
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 custom-scrollbar">
        <div className="flex flex-col gap-2 pb-4">
          {menuItems.map((item, idx) => (
            <NavItem
              key={idx}
              item={item}
              isActive={currentPath === item.path}
              isCollapsed={isCollapsed}
              onNavigate={handleNavigation}
            />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-muted/10 bg-background shrink-0">
        {!isCollapsed && isUserMenuOpen && (
          <UserMenu user={user} onLogout={onLogout} onClose={closeUserMenu} />
        )}

        <UserAvatar
          user={user}
          isCollapsed={isCollapsed}
          onClick={toggleUserMenu}
        />
      </div>
    </aside>
  );
};
