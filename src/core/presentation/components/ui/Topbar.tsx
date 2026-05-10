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
      className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-6 border-b backdrop-blur-xl transition-all duration-300 p-10"
      style={{
        background: " linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
        borderColor: "rgba(178, 154, 244, 0.1)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      }}
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
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(103, 45, 169, 0.15) 0%, rgba(54, 31, 119, 0.1) 100%)",
              border: "1px solid rgba(178, 154, 244, 0.15)",
              boxShadow: "0 0 20px rgba(103, 45, 169, 0.15)",
            }}
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
