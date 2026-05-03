import {
  HiOfficeBuilding,
  HiShieldCheck,
  HiChartBar,
  HiCheckCircle,
  HiCalendar,
  HiInformationCircle,
} from "react-icons/hi";
import { formatDate } from "../../../../utils/formatters";
import { InfoRow } from "./InfoRow";

interface ClientInfoProps {
  details: any;
}

export const ClientInfo = ({ details }: ClientInfoProps) => (
  <div className="mb-10">
    <div className="flex items-center gap-2 mb-5">
      <div className="p-1.5 bg-accent/10 rounded-lg">
        <HiInformationCircle className="text-accent text-sm" />
      </div>
      <h2 className="text-[11px] uppercase tracking-[0.25em] text-accent font-black">
        Información de la Organización
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <InfoRow
        label="Nombre"
        value={details.name}
        icon={<HiOfficeBuilding size={14} />}
      />
      <InfoRow
        label="Slug"
        value={details.slug}
        icon={<HiShieldCheck size={14} />}
      />
      <InfoRow
        label="Tipo"
        value={details.org_type}
        icon={<HiChartBar size={14} />}
      />
      <InfoRow
        label="Estado"
        value={details.is_active ? "Activo" : "Inactivo"}
        icon={<HiCheckCircle size={14} />}
      />
      <InfoRow
        label="Fecha Creación"
        value={formatDate(details.created_at)}
        icon={<HiCalendar size={14} />}
      />
    </div>
  </div>
);
