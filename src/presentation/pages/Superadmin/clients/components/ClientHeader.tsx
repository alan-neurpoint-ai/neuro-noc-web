import { HiPlus } from "react-icons/hi";

interface ClientHeaderProps {
  selectedClientId: string | undefined;
  selectedClientName: string;
}

export const ClientHeader = ({
  selectedClientId,
  selectedClientName,
}: ClientHeaderProps) => (
  <div className="flex justify-between items-end mb-10">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-8 bg-accent rounded-full" />
        <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
          Clientes <span className="text-accent">NOC</span>
        </h1>
      </div>
      <p className="text-text-muted text-sm ml-3">
        {selectedClientId === "all"
          ? "Visión general de todos los clientes del sistema"
          : `Gestión del cliente: ${selectedClientName}`}
      </p>
    </div>

    {selectedClientId !== "all" && (
      <button className="group flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/30 rounded-lg text-accent hover:bg-accent/20 transition-all hover:scale-105">
        <HiPlus
          size={18}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
        <span className="text-xs uppercase tracking-wider font-bold">
          Configurar Cliente
        </span>
      </button>
    )}
  </div>
);
