import { useState } from "react";
import { HiUserCircle, HiChevronLeft, HiMenu } from "react-icons/hi";
import { Button } from "../Button/Button";
import { getMenuItemsByRole } from "./menuConfig";

interface UserData {
  name: string;
  role: string;
  email: string;
  organization: string;
  avatar?: string;
}

interface SidebarProps {
  user: UserData;
  onLogout?: () => void;
}

export const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const menuItems = getMenuItemsByRole(user.role);

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    window.location.href = path;
  };

  return (
    <aside
      className={`
        ${isCollapsed ? "w-20" : "w-64"} 
        h-screen bg-background border-r border-muted/10 
        flex flex-col relative transition-all duration-300 ease-in-out
      `}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
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
            <button
              key={idx}
              onClick={() => handleNavigation(item.path)}
              className={`
                flex items-center gap-4 px-3 py-3 rounded-sm text-text-secondary 
                hover:bg-blue-primary/30 hover:text-blue-glow transition-all duration-200 group
                ${currentPath === item.path ? "bg-blue-primary/20 text-blue-glow" : ""}
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <span className="shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-xs uppercase tracking-[0.2em] font-medium animate-in fade-in duration-300">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-muted/10 bg-background shrink-0">
        {!isCollapsed && isUserMenuOpen && (
          <div className="absolute bottom-20 left-4 right-4 glass-card p-4 animate-in fade-in zoom-in duration-200 z-60">
            <div className="flex flex-col gap-3">
              <div className="space-y-1">
                <p className="text-[9px] text-accent uppercase tracking-widest font-bold">
                  Role
                </p>
                <p className="text-[11px] text-text-primary uppercase">
                  {user.role}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-accent uppercase tracking-widest font-bold">
                  Email
                </p>
                <p className="text-[11px] text-text-secondary">{user.email}</p>
              </div>
              <Button
                variant="logout"
                className="w-full mt-1 py-2 text-[9px]"
                onClick={onLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}

        <button
          onClick={() => !isCollapsed && setIsUserMenuOpen(!isUserMenuOpen)}
          className={`
            w-full flex items-center gap-3 p-2 rounded-sm transition-colors
            ${isCollapsed ? "justify-center" : "hover:bg-blue-primary/20"}
          `}
        >
          <div className="w-10 h-10 shrink-0 rounded-full border border-accent/30 bg-surface flex items-center justify-center text-accent">
            <HiUserCircle size={28} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className="text-xs font-bold text-text-primary uppercase truncate w-full">
                {user.name}
              </span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
