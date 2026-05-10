import React, { useState } from "react";
import { BiChevronLeft, BiLogOut } from "react-icons/bi";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
}

interface SidebarProps {
  navItems: NavItem[];
  userName: string;
  userRole: string;
  userCompany?: string;
  userAvatar?: string;
  activeId?: string;
  onNavigate?: (id: string, path: string) => void;
  onLogout?: () => void;
  className?: string;
}

const Avatar = ({
  src,
  name,
  size,
}: {
  src?: string;
  name: string;
  size: number;
}) => (
  <div
    className="shrink-0 flex items-center justify-center font-black uppercase overflow-hidden"
    style={{
      width: size,
      height: size,
      borderRadius: size / 3,
      background: "linear-gradient(135deg, #672da9 0%, #361f77 100%)",
      boxShadow:
        "0 0 0 2px rgba(178,154,244,0.3), 0 0 16px rgba(103,45,169,0.4)",
    }}
  >
    {src ? (
      <img src={src} alt={name} className="w-full h-full object-cover" />
    ) : (
      <span style={{ fontSize: size * 0.4, color: "#b29af4" }}>
        {name.charAt(0)}
      </span>
    )}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  userName,
  userRole,
  userCompany = "Neuro NOC",
  userAvatar,
  activeId,
  onNavigate,
  onLogout,
  className = "",
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const glassEffect = "backdrop-blur-xl border border-white/10 shadow-2xl";
  const headlineFont = { fontFamily: "'Stack Sans Headline', sans-serif" };

  return (
    <aside
      className={`relative h-screen flex flex-col z-50 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} ${className}`}
      style={{
        background:
          "linear-gradient(180deg, #2d1b69 0%, #1e1248 50%, #0d0820 100%)",
      }}
    >
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-primary/20 blur-2xl pointer-events-none" />

      <div className="relative flex items-center px-4 py-6 border-b border-white/5">
        {!isCollapsed && (
          <div className="flex items-center gap-3 flex-1 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary to-bg-card flex items-center justify-center border border-brand-accent/30 shadow-[0_0_15px_rgba(103,45,169,0.5)]">
              <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            </div>
            <span
              className="text-white font-black uppercase italic tracking-tighter"
              style={headlineFont}
            >
              Neuro <span className="text-brand-accent">NOC</span>
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg bg-white/5 hover:bg-brand-accent/20 text-brand-accent/60 hover:text-brand-accent transition-all ${isCollapsed ? "mx-auto rotate-180" : ""}`}
        >
          <BiChevronLeft size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scroll">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[9px] font-black uppercase tracking-[0.3em] text-brand-accent/30">
            Menú
          </p>
        )}
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id, item.path)}
              className={`group relative w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-brand-primary/30 border border-brand-accent/20 shadow-lg"
                  : "hover:bg-white/5 text-white/40 hover:text-white/80"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-brand-accent rounded-full shadow-[0_0_8px_#b29af4]" />
              )}
              <div
                className={`shrink-0 transition-colors ${isActive ? "text-brand-accent" : "group-hover:text-brand-accent/80"}`}
              >
                {item.icon}
              </div>
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span
                    className={`text-sm font-bold truncate ${isActive ? "text-white" : ""}`}
                    style={headlineFont}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-brand-accent/10 border border-brand-accent/20 text-brand-accent">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1a0f3e] border border-brand-accent/20 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 relative">
        {profileOpen && !isCollapsed && (
          <div
            className={`absolute bottom-[110%] left-4 right-4 p-4 rounded-2xl ${glassEffect} bg-[#1a0f3e]/95 animate-in slide-in-from-bottom-2 duration-200`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar src={userAvatar} name={userName} size={40} />
                <div className="min-w-0">
                  <p
                    className="text-xs font-black text-white truncate uppercase"
                    style={headlineFont}
                  >
                    {userName}
                  </p>
                  <p className="text-[10px] font-bold text-brand-accent truncate uppercase tracking-widest">
                    {userRole}
                  </p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between text-[9px] uppercase font-black text-white/30">
                  <span>Status</span>
                  <span className="text-green-400">Online</span>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-black text-white/30">
                  <span>Company</span>
                  <span className="text-white/70">{userCompany}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-[10px] font-black uppercase"
              >
                <BiLogOut size={14} /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => !isCollapsed && setProfileOpen(!profileOpen)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border ${profileOpen ? "bg-brand-primary/20 border-brand-accent/30 shadow-lg" : "bg-white/5 border-white/10"} ${isCollapsed ? "justify-center" : ""}`}
        >
          <div className="relative">
            <Avatar src={userAvatar} name={userName} size={34} />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#0d0820] rounded-full shadow-[0_0_8px_#22c55e]" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p
                className="text-xs font-black text-white truncate uppercase"
                style={headlineFont}
              >
                {userName}
              </p>
              <p className="text-[9px] font-bold text-white/40 truncate uppercase">
                {userRole}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
