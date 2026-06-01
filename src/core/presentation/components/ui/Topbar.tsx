import React, { useState, useEffect } from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';
import { CustomSelect, type SelectOption } from './CustomSelect';
import { useThemeContext } from '../../../hooks/useTheme';

interface TopbarProps {
  envOptions: SelectOption[];
  currentEnv?: string | number;
  onEnvChange?: (value: string | number) => void;
  userName?: string;
  userRole?: string;
}

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-2 font-label text-[11px] text-text-muted/60">
      <span className="tracking-[0.15em]">
        {hours}<span className="animate-pulse">:</span>{minutes}<span className="animate-pulse">:</span>{seconds}
      </span>
      <div className="w-1 h-1 rounded-full bg-emerald-500/60 animate-pulse" />
    </div>
  );
}

export const Topbar: React.FC<TopbarProps> = ({
  envOptions,
  currentEnv,
  onEnvChange,
  userName,
  userRole,
}) => {
  const { theme, toggleTheme, isDark } = useThemeContext();
  const [localEnv, setLocalEnv] = useState<string | number>(
    currentEnv || (envOptions.length > 0 ? envOptions[0].value : ''),
  );

  const handleEnvChange = (val: string | number) => {
    setLocalEnv(val);
    onEnvChange?.(val);
  };

  const displayName = userName?.split(' ')[0] || 'Usuario';
  const displayRole = userRole
    ? userRole === 'super_admin'
      ? 'Super Admin'
      : userRole === 'admin'
        ? 'Admin'
        : userRole.charAt(0).toUpperCase() + userRole.slice(1)
    : '';

  return (
    <header className="sticky top-0 z-40 w-full h-14 flex items-center justify-between px-6 border-b border-border-subtle bg-topbar backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/60 animate-pulse" />
          <span className="font-label text-[10px] text-brand-primary/70 uppercase tracking-[0.2em]">
            Operativo
          </span>
        </div>
        {displayRole && (
          <span className="hidden md:inline font-label text-[10px] text-text-muted/40 uppercase tracking-[0.15em]">
            {displayRole}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <LiveClock />

        <div className="h-5 w-px bg-border-subtle" />

        <div className="w-[220px]">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl pointer-events-none gradient-select-glow" />
            <div className="relative">
              <CustomSelect
                options={envOptions}
                value={currentEnv || localEnv}
                onChange={handleEnvChange}
                className="gap-0!"
              />
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-border-subtle" />

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border-subtle bg-hover-bg hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all duration-200"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? (
            <BiSun size={15} className="text-text-muted/60 hover:text-brand-secondary" />
          ) : (
            <BiMoon size={15} className="text-text-muted/60 hover:text-brand-secondary" />
          )}
        </button>

        <div className="hidden sm:flex items-center gap-2.5 pl-2">
          <div className="text-right">
            <p className="text-xs font-headline font-medium text-text-main leading-tight">
              {displayName}
            </p>
            <p className="text-[9px] font-label text-text-muted/50 uppercase tracking-wider">
              {displayRole}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg gradient-avatar flex items-center justify-center text-white font-headline font-bold text-xs uppercase">
            {displayName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};