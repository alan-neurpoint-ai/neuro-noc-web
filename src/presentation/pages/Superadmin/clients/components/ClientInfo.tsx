import {
  HiOfficeBuilding,
  HiShieldCheck,
  HiChartBar,
  HiCheckCircle,
  HiCalendar,
  HiInformationCircle,
  HiXCircle,
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

      <div className="flex items-start gap-3 p-3 rounded-lg bg-surface/20 border border-muted/10 hover:border-accent/20 transition-all">
        <div
          className={`mt-0.5 ${details.is_active ? "text-emerald-400" : "text-rose-400"}`}
        >
          {details.is_active ? (
            <HiCheckCircle size={14} />
          ) : (
            <HiXCircle size={14} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
            Estado
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-sm font-medium ${details.is_active ? "text-emerald-400" : "text-rose-400"}`}
            >
              {details.is_active ? "Activo" : "Inactivo"}
            </span>
            {!details.is_active && (
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Suspendido
              </span>
            )}
            {details.is_active && (
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Operativo
              </span>
            )}
          </div>
        </div>
      </div>

      <InfoRow
        label="Fecha Creación"
        value={formatDate(details.created_at)}
        icon={<HiCalendar size={14} />}
      />
    </div>
  </div>
);
