import React, { useState, useEffect } from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';
import { CustomSelect, type SelectOption } from './CustomSelect';
import { useThemeContext } from '../../../hooks/useTheme';

interface TopbarProps {
  envOptions: SelectOption[];
  currentEnv?: string | number;
  onEnvChange?: (value: string | number) => void;
  hasChildren?: boolean;
  orgDisplayName?: string;
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
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated/50 border border-border-subtle/50">
      <span className="font-label text-[10px] text-text-muted/50 tracking-[0.15em]">
        {hours}
        <span className="animate-pulse mx-px">:</span>
        {minutes}
        <span className="animate-pulse mx-px">:</span>
        {seconds}
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
    </div>
  );
}

export const Topbar: React.FC<TopbarProps> = ({
  envOptions,
  currentEnv,
  onEnvChange,
  hasChildren = false,
  orgDisplayName,
}) => {
  const { toggleTheme, isDark } = useThemeContext();
  const [localEnv, setLocalEnv] = useState<string | number>(
    currentEnv || (envOptions.length > 0 ? envOptions[0].value : '')
  );

  const handleEnvChange = (val: string | number) => {
    setLocalEnv(val);
    onEnvChange?.(val);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-12 flex items-center justify-between p-10 border-b border-border-subtle bg-topbar backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.07] border border-emerald-500/15">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
          <span className="font-label text-[9px] text-emerald-400/80 uppercase tracking-[0.25em] font-bold">
            Operativo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LiveClock />

        <div className="h-4 w-px bg-border-subtle" />

        {hasChildren ? (
          <div className="w-52">
            <CustomSelect
              options={envOptions}
              value={currentEnv || localEnv}
              onChange={handleEnvChange}
              className="gap-0!"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated/50 border border-border-subtle/50">
            <span className="text-[13px] font-medium tracking-wide text-text-main">
              {orgDisplayName}
            </span>
          </div>
        )}

        <div className="h-4 w-px bg-border-subtle" />

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border-subtle/60 bg-bg-elevated/30 hover:bg-brand-primary/10 hover:border-brand-primary/20 transition-all duration-200"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? (
            <BiSun
              size={14}
              className="text-text-muted/40 hover:text-brand-secondary"
            />
          ) : (
            <BiMoon
              size={14}
              className="text-text-muted/40 hover:text-brand-secondary"
            />
          )}
        </button>
      </div>
    </header>
  );
};
