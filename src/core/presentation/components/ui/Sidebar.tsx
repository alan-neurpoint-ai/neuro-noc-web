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
    className="shrink-0 flex items-center justify-center font-bold uppercase overflow-hidden"
    style={{
      width: size,
      height: size,
      borderRadius: size / 4,
      background: 'linear-gradient(135deg, #672da9 0%, #8b5cf6 100%)',
      boxShadow: '0 4px 12px rgba(103, 45, 169, 0.4)',
    }}
  >
    {src ? (
      <img src={src} alt={name} className="w-full h-full object-cover" />
    ) : (
      <span
        className="text-white font-headline font-bold"
        style={{ fontSize: size * 0.4 }}
      >
        {name.charAt(0)}
      </span>
    )}
  </div>
);

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
      className={`relative h-screen flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-74'
      } ${className}`}
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-brand-primary/10 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #672da9 0%, #8b5cf6 100%)',
              boxShadow: '0 0 20px rgba(103, 45, 169, 0.5)',
            }}
          >
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
              <span className="text-lg font-headline font-bold text-white tracking-wide">
                NeuroNOC
              </span>
              <p className="text-[9px] text-white/30 font-headline tracking-wider">
                NETWORK INTELLIGENCE
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 p-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider transition-all"
          >
            <TbLayoutSidebarLeftCollapseFilled
              size={17}
              className={`transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 pb-3">
            <div className="h-px flex-1 bg-linear-to-r from-brand-primary/50 to-transparent" />
            <span className="text-[10px] font-headline font-bold uppercase tracking-[0.25em] text-white/30">
              Menú
            </span>
            <div className="h-px flex-1 bg-linear-to-l from-brand-primary/50 to-transparent" />
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
                  ? 'bg-linear-to-r from-brand-primary/20 to-transparent border-l-2 border-brand-primary'
                  : 'hover:bg-white/5 text-white/50 hover:text-white/80'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div
                className={`shrink-0 transition-colors ${
                  isActive
                    ? 'text-brand-accent'
                    : 'text-white/40 group-hover:text-brand-accent/80'
                }`}
              >
                {item.icon}
              </div>
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span
                    className={`text-sm font-headline truncate ${
                      isActive ? 'text-white font-semibold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-[#1a1a2e] border border-white/10 rounded-lg text-xs font-headline text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 mt-auto border-t border-white/5 relative">
        {profileOpen && !isCollapsed && (
          <div
            className="absolute bottom-full left-3 right-3 mb-3 p-4 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #2d1b69 0%, #1a0f3e 100%)',
              border: '1px solid rgba(178,154,244,0.15)',
              boxShadow:
                '0 0 40px rgba(103, 45, 169, 0.3), 0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={userAvatar} name={userName} size={42} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-headline font-bold text-white truncate">
                  {userName}
                </p>
                <p className="text-[10px] font-headline text-brand-accent truncate uppercase tracking-wider">
                  {userRole}
                </p>
              </div>
            </div>

            <div className="space-y-2 pb-3 border-b border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-headline text-white/40 uppercase">
                  Organización
                </span>
                <span className="text-xs font-headline text-white/70">
                  {userCompany}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-headline text-white/40 uppercase">
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
                onClick={() => {
                  onLogout?.();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-xs font-headline font-semibold uppercase tracking-wider"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                }}
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
              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="relative">
            <Avatar src={userAvatar} name={userName} size={32} />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f1a]"
              style={{ background: '#10b981' }}
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-headline font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-[10px] font-headline text-white/40 truncate uppercase">
                {userRole}
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
