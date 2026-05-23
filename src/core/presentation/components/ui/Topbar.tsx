import React, { useState } from "react";
import { CustomSelect, type SelectOption } from "./CustomSelect";

interface TopbarProps {
  envOptions: SelectOption[];
  currentEnv?: string | number;
  onEnvChange?: (value: string | number) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  envOptions,
  currentEnv,
  onEnvChange,
}) => {
  const [localEnv, setLocalEnv] = useState<string | number>(
    currentEnv || (envOptions.length > 0 ? envOptions[0].value : ""),
  );

  const handleEnvChange = (val: string | number) => {
    setLocalEnv(val);
    onEnvChange?.(val);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-6 border-b border-border-subtle transition-all duration-300 p-10 bg-sidebar"
    >
      <div className="flex items-center gap-4"></div>

      <div className="flex items-center gap-4">
        <div
          className="relative"
          style={{
            minWidth: 220,
          }}
        >
          <div
            className="absolute inset-0 rounded-xl pointer-events-none bg-brand-primary/10 border border-brand-primary/20"
          />
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
    </header>
  );
};
