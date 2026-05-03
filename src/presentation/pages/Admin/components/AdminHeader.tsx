import { type Organization } from "../../../components/ui/Topbar/Topbar";

interface AdminHeaderProps {
  currentOrg: Organization | null;
  isInternal: boolean;
}

export const AdminHeader = ({ currentOrg, isInternal }: AdminHeaderProps) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-1 h-8 bg-accent rounded-full" />
      <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
        Panel de <span className="text-accent">Administrador</span>
      </h1>
    </div>
    <p className="text-text-muted text-sm ml-3">
      Gestionando:{" "}
      <span className="text-accent font-medium">{currentOrg?.name}</span>
      {isInternal && (
        <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
          Vista General - Todos los Clientes
        </span>
      )}
    </p>
  </div>
);
