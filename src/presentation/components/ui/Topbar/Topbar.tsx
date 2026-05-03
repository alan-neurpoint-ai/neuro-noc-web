import { useState, type ReactNode } from "react";
import { HiChevronDown, HiOfficeBuilding, HiShieldCheck } from "react-icons/hi";
export interface Organization {
  slug: ReactNode;
  org_type: ReactNode;
  is_active: any;
  created_at(created_at: any): import("react").ReactNode;
  parent_organization_id: import("react/jsx-runtime").JSX.Element;
  id: string;
  name: string;
  isInternal?: boolean;
}

interface TopbarProps {
  organizations: Organization[];
  currentOrg: Organization;
  onOrgChange: (org: Organization) => void;
}
export const Topbar = ({
  organizations,
  currentOrg,
  onOrgChange,
}: TopbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 border-b border-muted/10 bg-background/50 backdrop-blur-md flex items-center justify-end px-8 sticky top-0 z-40">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-3 px-4 py-2 rounded-sm border transition-all duration-200
            ${
              isOpen
                ? "border-accent bg-blue-primary/20 text-blue-glow shadow-[0_0_15px_rgba(0,243,255,0.1)]"
                : "border-muted/20 bg-surface/50 text-text-secondary hover:border-accent/50"
            }
          `}
        >
          <HiOfficeBuilding
            className={isOpen ? "text-accent" : "text-text-muted"}
          />
          <span className="text-xs uppercase tracking-widest font-bold min-w-30 text-left">
            {currentOrg.name}
          </span>
          <HiChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[-1]"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute right-0 mt-2 w-64 glass-card border border-accent/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onOrgChange(org);
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center justify-between px-4 py-3 text-left transition-colors
                      hover:bg-blue-primary/30 group
                      ${currentOrg.id === org.id ? "bg-blue-primary/10" : ""}
                    `}
                  >
                    <span
                      className={`text-[10px] uppercase tracking-wider ${currentOrg.id === org.id ? "text-accent font-bold" : "text-text-secondary group-hover:text-text-primary"}`}
                    >
                      {org.name}
                    </span>
                    {org.isInternal && (
                      <span className="flex items-center gap-1 text-[8px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full uppercase font-black border border-accent/20">
                        <HiShieldCheck size={10} /> Interno
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
