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
    <header className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-8 border-b border-white/5 bg-brand-primary/40 backdrop-blur-xl transition-all duration-300">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <div className="w-52">
          <CustomSelect
            options={envOptions}
            value={currentEnv || localEnv}
            onChange={handleEnvChange}
            className="gap-0!"
          />
        </div>
      </div>
    </header>
  );
};
