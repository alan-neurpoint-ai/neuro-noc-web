import { createContext, useContext, type ReactNode } from "react";
import type { Organization } from "../../../components/ui/Topbar/Topbar";

interface SelectedClientContextType {
  selectedClient: Organization | null;
}

const SelectedClientContext = createContext<
  SelectedClientContextType | undefined
>(undefined);

interface SelectedClientProviderProps {
  children: ReactNode;
  selectedClient: Organization | null;
}

export const SelectedClientProvider = ({
  children,
  selectedClient,
}: SelectedClientProviderProps) => {
  return (
    <SelectedClientContext.Provider value={{ selectedClient }}>
      {children}
    </SelectedClientContext.Provider>
  );
};

export const useSelectedClient = () => {
  const context = useContext(SelectedClientContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedClient must be used within a SelectedClientProvider",
    );
  }
  return context;
};
