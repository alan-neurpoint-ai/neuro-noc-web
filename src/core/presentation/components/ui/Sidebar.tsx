import React, { useState } from 'react';
import { BiLogOut, BiMoon, BiSun } from 'react-icons/bi';
import { TbLayoutSidebarLeftCollapseFilled } from 'react-icons/tb';
import { NavGroup } from './NavGroup';
import type { NavItem } from '../../../types/navigation/navigation.types';

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

function Avatar({ src, name, size }: { src?: string; name: string; size: number }) {
  const fontSize = Math.round(size * 0.4);
  const borderRadius = Math.round(size / 4);
  return (
    <div
      className={`shrink-0 flex items-center justify-center font-bold uppercase overflow-hidden gradient-avatar`}
      style={{ width: size, height: size, borderRadius }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-headline font-bold" style={{ fontSize }}>
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  userName,
  userRole,
  userCompany = 'NeuroNOC',
  userAvatar,
  activeId,
  onNavigate,
  onLogout,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNavigate = (id: string, path: string) => {
    onNavigate?.(id, path);
  };

  return (
    <aside
      className={`relative h-screen flex flex-col z-50 transition-all duration-300 bg-sidebar ${
        isCollapsed ? 'w-20' : 'w-74'
      } ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px]" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-primary/10 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between px-5 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 gradient-logo-icon">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-lg font-headline font-bold text-text-on-elevated tracking-wide">
                NeuroNOC
              </span>
              <p className="text-[9px] text-text-on-elevated-muted font-headline tracking-wider">
                NETWORK INTELLIGENCE
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider transition-all text-text-on-elevated-muted hover:text-text-on-elevated hover:bg-hover-bg"
        >
          <TbLayoutSidebarLeftCollapseFilled
            size={17}
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 pb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-brand-primary/50 to-transparent" />
            <span className="text-[10px] font-headline font-bold uppercase tracking-[0.25em] text-text-on-elevated-muted">
              Menú
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-brand-primary/50 to-transparent" />
          </div>
        )}
        {navItems.map((item) => {
          if (item.children && item.children.length > 0) {
            return (
              <NavGroup
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                activeId={activeId}
                onNavigate={handleNavigate}
              />
            );
          }

          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id, item.path ?? '')}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-primary/20 to-transparent border-l-2 border-brand-primary'
                  : 'hover:bg-hover-bg text-text-on-elevated-muted hover:text-text-on-elevated'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className={`shrink-0 transition-colors ${
                isActive
                  ? 'text-brand-secondary'
                  : 'text-text-on-elevated-muted group-hover:text-brand-secondary/80'
              }`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className={`text-sm font-headline truncate ${isActive ? 'text-text-on-elevated font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-bg-elevated border border-border-default rounded-lg text-xs font-headline text-text-on-elevated opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 mt-auto border-t border-border-subtle relative">
        {profileOpen && !isCollapsed && (
          <div className="absolute bottom-full left-3 right-3 mb-3 p-4 rounded-xl overflow-hidden bg-bg-elevated border border-brand-primary/20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={userAvatar} name={userName} size={42} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-headline font-bold text-text-on-elevated truncate">
                  {userName}
                </p>
                <p className="text-[10px] font-headline text-brand-secondary truncate uppercase tracking-wider">
                  {userRole}
                </p>
              </div>
            </div>

            <div className="space-y-2 pb-3 border-b border-border-subtle">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-headline text-text-on-elevated-muted uppercase">
                  Organización
                </span>
                <span className="text-xs font-headline text-text-on-elevated/70">
                  {userCompany}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-headline text-text-on-elevated-muted uppercase">
                  Status
                </span>
                <span className="text-xs font-headline text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => { onLogout?.(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-xs font-headline font-semibold uppercase tracking-wider gradient-logout-btn hover:gradient-logout-btn-hover"
              >
                <BiLogOut size={14} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => !isCollapsed && setProfileOpen(!profileOpen)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all border ${
            profileOpen
              ? 'bg-brand-primary/10 border-brand-primary/30'
              : 'bg-hover-bg border-border-subtle hover:bg-hover-bg/80 hover:border-border-default'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="relative">
            <Avatar src={userAvatar} name={userName} size={32} />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-sidebar bg-emerald-500" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-headline font-semibold text-text-on-elevated truncate">
                {userName}
              </p>
              <p className="text-[10px] font-headline text-text-on-elevated-muted truncate uppercase">
                {userRole}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};