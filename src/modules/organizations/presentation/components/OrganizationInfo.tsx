import { BiCheckbox, BiCalendar } from 'react-icons/bi';
import { Card } from '../../../../core/presentation/components/ui/Card';

interface Organization {
  name: string;
  slug: string;
  org_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface OrganizationInfoProps {
  org: Organization;
}

const getOrgTypeLabel = (type: string) => {
  switch (type) {
    case 'provider':
      return 'Proveedor';
    case 'client':
      return 'Cliente';
    case 'distributor':
      return 'Distribuidor';
    default:
      return type;
  }
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const OrganizationInfo = ({ org }: OrganizationInfoProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BiCheckbox className="text-brand-accent text-lg" />
            <h3 className="text-sm font-headline font-bold text-white uppercase">
              Información General
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/40 uppercase mb-1">Nombre</p>
              <p className="text-white font-medium">{org.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase mb-1">Slug</p>
              <p className="text-white/80">{org.slug}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase mb-1">
                Tipo de Organización
              </p>
              <p className="text-white">{getOrgTypeLabel(org.org_type)}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase mb-1">Estado</p>
              <p className="text-white">
                {org.is_active ? 'Activa' : 'Inactiva'}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BiCalendar className="text-brand-accent text-lg" />
            <h3 className="text-sm font-headline font-bold text-white uppercase">
              Fechas
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-white/40 uppercase mb-1">
                Fecha de Creación
              </p>
              <p className="text-white">{formatDate(org.created_at)}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase mb-1">
                Última Actualización
              </p>
              <p className="text-white">{formatDate(org.updated_at)}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
