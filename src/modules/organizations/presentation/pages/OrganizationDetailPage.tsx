import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { supabase } from '../../../../core/supabase';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import {
  BiBuilding,
  BiCalendar,
  BiCheckbox,
  BiArrowBack,
} from 'react-icons/bi';

interface Organization {
  id: string;
  name: string;
  slug: string;
  org_type: string;
  is_active: boolean;
  parent_organization_id: string | null;
  created_at: string;
  updated_at: string;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

// Cache a nivel de módulo para evitar re-fetches innecesarios
const detailCache = new Map<string, Organization>();

async function fetchOrganization(id: string): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Organization;
}

// Datos mock de historial de pagos
const mockPayments: PaymentRecord[] = [
  {
    id: 'PAY-2026-00147',
    date: '2026-05-09',
    amount: 12500.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Factura mensual - Servicio monitorización',
  },
  {
    id: 'PAY-2026-00146',
    date: '2026-04-15',
    amount: 8400.0,
    method: 'Tarjeta de crédito',
    status: 'completed',
    description: 'Renovación licencia anual - Plataforma NOC',
  },
  {
    id: 'PAY-2026-00145',
    date: '2026-04-01',
    amount: 3200.0,
    method: 'Transferencia Bancaria',
    status: 'pending',
    description: 'Ajuste por servicios adicionales',
  },
  {
    id: 'PAY-2026-00144',
    date: '2026-03-20',
    amount: 15000.0,
    method: 'Pago contra entrega',
    status: 'completed',
    description: 'Implementación módulo IA - Primera fase',
  },
  {
    id: 'PAY-2026-00143',
    date: '2026-03-05',
    amount: 4500.0,
    method: 'Tarjeta de crédito',
    status: 'failed',
    description: 'Cargo por penalización - SLA incumplido',
  },
  {
    id: 'PAY-2026-00142',
    date: '2026-02-28',
    amount: 6700.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Soporte técnico premium - Febrero',
  },
  {
    id: 'PAY-2026-00141',
    date: '2026-02-10',
    amount: 22100.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Paquete integral Q1 - Monitoreo + IA',
  },
  {
    id: 'PAY-2026-00140',
    date: '2026-01-15',
    amount: 9800.0,
    method: 'Tarjeta de débito',
    status: 'completed',
    description: 'Licencia de usuario - 10 nodos',
  },
  {
    id: 'PAY-2026-00139',
    date: '2026-01-03',
    amount: 14200.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Setup inicial + onboarding',
  },
  {
    id: 'PAY-2025-01201',
    date: '2025-12-20',
    amount: 5300.0,
    method: 'Tarjeta de crédito',
    status: 'completed',
    description: 'Mantenimiento preventivo - Diciembre',
  },
  {
    id: 'PAY-2025-01200',
    date: '2025-12-01',
    amount: 18500.0,
    method: 'Transferencia Bancaria',
    status: 'completed',
    description: 'Contrato anual - Ciclo 2025',
  },
  {
    id: 'PAY-2025-01199',
    date: '2025-11-18',
    amount: 7600.0,
    method: 'Pago contra entrega',
    status: 'completed',
    description: 'Consultoría especializada - Red core',
  },
];

export const OrganizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    // Devolver de cache si existe
    if (detailCache.has(id)) {
      setOrg(detailCache.get(id)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;

    fetchOrganization(id)
      .then((data) => {
        if (!cancelled) {
          detailCache.set(id, data);
          setOrg(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error loading organization:', error);
        if (!cancelled) {
          setOrg(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

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

  if (loading) {
    return <Loading message="Cargando organización..." variant="fullscreen" />;
  }

  if (!org) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/40">Selecciona una organización</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/organizations"
          className="flex items-center gap-1.5 text-sm text-white/50 hover:text-brand-accent transition-colors"
        >
          <BiArrowBack size={16} />
          Regresar
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #672da9 0%, #8b5cf6 100%)',
            boxShadow: '0 0 30px rgba(103, 45, 169, 0.6)',
          }}
        >
          <BiBuilding className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-headline font-bold text-white">
            {org.name}
          </h1>
          <p className="text-sm text-white/40">{org.slug}</p>
        </div>
      </div>

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
                <p className="text-[10px] text-white/40 uppercase mb-1">
                  Nombre
                </p>
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
                <p className="text-[10px] text-white/40 uppercase mb-1">
                  Estado
                </p>
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
                <p className="text-white">
                  {org.created_at
                    ? new Date(org.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">
                  Última Actualización
                </p>
                <p className="text-white">
                  {org.updated_at
                    ? new Date(org.updated_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '-'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card variant="glass" className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BiCheckbox className="text-brand-accent text-lg" />
          <h3 className="text-sm font-headline font-bold text-white uppercase">
            Historial de Pagos
          </h3>
        </div>
        <DataTable
          columns={[
            { header: 'ID Pago', accessor: 'id' },
            { header: 'Fecha', accessor: 'date' },
            {
              header: 'Monto',
              accessor: (item: PaymentRecord) =>
                `$${item.amount.toLocaleString('es-ES')}`,
            },
            { header: 'Método', accessor: 'method' },
            {
              header: 'Estado',
              accessor: (item: PaymentRecord) => (
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                    item.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : item.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {item.status === 'completed'
                    ? 'Completado'
                    : item.status === 'pending'
                      ? 'Pendiente'
                      : 'Fallido'}
                </span>
              ),
            },
            { header: 'Descripción', accessor: 'description' },
          ]}
          data={mockPayments}
        />
      </Card>
    </div>
  );
};
