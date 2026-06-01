import React, { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
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

function Avatar({
  src,
  name,
  size,
}: {
  src?: string;
  name: string;
  size: number;
}) {
  const fontSize = Math.round(size * 0.4);
  const borderRadius = Math.round(size / 4);
  return (
    <div
      className="shrink-0 flex items-center justify-center font-bold uppercase overflow-hidden gradient-avatar"
      style={{ width: size, height: size, borderRadius }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span
          className="text-white font-headline font-bold"
          style={{ fontSize }}
        >
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
      className={`relative h-screen flex flex-col z-50 transition-all duration-300 bg-sidebar border-r border-border-subtle ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-linear-to-b from-brand-primary/5 dark:from-brand-primary/8 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 gradient-logo-icon">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {!isCollapsed && (
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-headline text-[17px] font-bold text-text-on-elevated tracking-tight">
                  NEURO
                </span>
                <span className="font-headline text-[17px] font-bold text-brand-secondary tracking-tight">
                  NOC
                </span>
              </div>
              <p className="text-[7px] font-label text-brand-secondary/40 tracking-[0.35em] uppercase leading-none mt-0.5">
                Network Intelligence
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-text-on-elevated-muted/50 hover:text-brand-secondary hover:bg-brand-primary/10 transition-all duration-200"
        >
          <TbLayoutSidebarLeftCollapseFilled
            size={16}
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div className="relative px-4 pb-2">
        <div className="h-px bg-linear-to-r from-transparent via-brand-primary/20 to-transparent" />
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
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
              className={`group relative w-full flex items-center gap-3 rounded-xl transition-all duration-200 ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-brand-primary/12 text-text-on-elevated'
                  : 'text-text-on-elevated-muted hover:bg-brand-primary/6 hover:text-text-on-elevated'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full bg-brand-secondary shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
              )}

              <div
                className={`shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'text-brand-secondary'
                    : 'text-text-on-elevated-muted/60 group-hover:text-brand-secondary/70'
                }`}
              >
                {item.icon}
              </div>

              {!isCollapsed && (
                <span
                  className={`text-[13px] font-headline truncate transition-colors duration-200 ${
                    isActive ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
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

      <div className="relative px-4 pt-2">
        <div className="h-px bg-linear-to-r from-transparent via-border-subtle to-transparent" />
      </div>

      <div className="relative px-2 py-3">
        {profileOpen && !isCollapsed && (
          <div className="absolute bottom-full left-2 right-2 mb-2 rounded-2xl overflow-hidden bg-bg-elevated/95 backdrop-blur-xl border border-brand-primary/15 shadow-2xl">
            <div className="absolute inset-0 bg-linear-to-br from-brand-primary/5 to-transparent pointer-events-none" />
            <div className="relative p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={userAvatar} name={userName} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-headline font-bold text-text-on-elevated truncate">
                    {userName}
                  </p>
                  <p className="text-[9px] font-label text-brand-secondary/60 tracking-[0.2em] uppercase mt-0.5">
                    {userRole}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pb-3 border-b border-border-subtle">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-label text-text-on-elevated-muted/50 uppercase tracking-[0.15em]">
                    Org
                  </span>
                  <span className="text-[11px] font-headline text-text-on-elevated/70">
                    {userCompany}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-label text-text-on-elevated-muted/50 uppercase tracking-[0.15em]">
                    Status
                  </span>
                  <span className="text-[11px] font-headline text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                    Online
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    onLogout?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 text-xs font-headline font-semibold uppercase tracking-[0.15em] gradient-logout-btn hover:gradient-logout-btn-hover"
                >
                  <BiLogOut size={14} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => !isCollapsed && setProfileOpen(!profileOpen)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 border ${
            profileOpen
              ? 'bg-brand-primary/10 border-brand-primary/25'
              : 'bg-hover-bg/50 border-border-subtle/50 hover:bg-brand-primary/8 hover:border-brand-primary/15'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="relative">
            <Avatar src={userAvatar} name={userName} size={32} />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(52,211,153,0.5)]"
              style={{ border: '1.5px solid var(--sidebar-bg)' }}
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-headline font-semibold text-text-on-elevated truncate">
                {userName}
              </p>
              <p className="text-[9px] font-label text-text-on-elevated-muted/50 truncate uppercase tracking-[0.12em]">
                {userRole}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
