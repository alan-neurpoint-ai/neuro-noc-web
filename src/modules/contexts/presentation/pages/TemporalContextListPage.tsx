import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BiPlus, BiShow, BiTrash, BiCheckCircle } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { Pagination } from '../../../../core/presentation/components/ui/Pagination';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Search } from '../../../../core/presentation/components/ui/Search';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { TemporalContextRow } from '../../../../core/types/monitoring/temporal-contexts.sql';

const PAGE_SIZE = 10;

export const TemporalContextListPage = () => {
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [contexts, setContexts] = useState<TemporalContextRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedContext, setSelectedContext] =
    useState<TemporalContextRow | null>(null);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  // Debounce Nativo
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [targetOrgId, debouncedSearch]);

  useEffect(() => {
    if (!targetOrgId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContexts([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const fetchContexts = async () => {
      setLoading(true);
      try {
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query = (supabase.from('temporal_contexts') as any)
          .select('*', { count: 'exact' })
          .eq('organization_id', targetOrgId);

        if (debouncedSearch) {
          query = query.or(
            `name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`
          );
        }

        const { data, error, count } = await query
          .order('start_date', { ascending: false })
          .range(from, to);

        if (error) throw error;

        // Filter out inactive
        const filteredContexts =
          (data as TemporalContextRow[])?.filter(
            (ctx) => ctx.status !== 'inactive'
          ) || [];
        setContexts(filteredContexts);
        setTotalItems(count || 0);
      } catch (error) {
        console.error('Error loading temporal contexts:', error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchContexts();
  }, [targetOrgId, currentPage, debouncedSearch]);

  const handleInactivate = async () => {
    if (!selectedContext) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('temporal_contexts') as any)
        .update({ status: 'inactive' })
        .eq('id', selectedContext.id);

      // Refresh
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from('temporal_contexts') as any)
        .select('*', { count: 'exact' })
        .eq('organization_id', targetOrgId!)
        .order('start_date', { ascending: false });

      const filteredContexts =
        (data as TemporalContextRow[])?.filter(
          (ctx) => ctx.status !== 'inactive'
        ) || [];
      setContexts(filteredContexts);
      setShowConfirmModal(false);
      setSelectedContext(null);
    } catch (error) {
      console.error('Error inactivating context:', error);
    }
  };

  const openConfirmModal = (ctx: TemporalContextRow) => {
    setSelectedContext(ctx);
    setShowConfirmModal(true);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
            Activo
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
            Expirado
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/5 text-white/40 border border-white/10 uppercase">
            Inactivo
          </span>
        );
    }
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: (item: TemporalContextRow) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-[10px] font-bold text-brand-accent uppercase"
            style={{ background: 'rgba(103,45,169,0.2)' }}
          >
            {item.name.charAt(0)}
          </div>
          <span className="text-white font-bold tracking-tight">
            {item.name}
          </span>
        </div>
      ),
    },
    {
      header: 'Descripción',
      accessor: (item: TemporalContextRow) => (
        <span className="text-white/60 text-sm font-medium">
          {item.description || '-'}
        </span>
      ),
    },
    {
      header: 'Fecha Inicio',
      accessor: (item: TemporalContextRow) => (
        <span className="font-mono text-xs text-white/50">
          {formatDate(item.start_date)}
        </span>
      ),
    },
    {
      header: 'Fecha Fin',
      accessor: (item: TemporalContextRow) => (
        <span className="font-mono text-xs text-white/50">
          {formatDate(item.end_date)}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (item: TemporalContextRow) => getStatusBadge(item.status),
    },
    {
      header: 'Acciones',
      accessor: (item: TemporalContextRow) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="view"
            icon={<BiShow size={16} />}
            className="px-3 py-1.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/temporal-contexts/${item.id}`);
            }}
          >
            VER
          </Button>
          <Button
            variant="ghost"
            icon={<BiTrash size={16} />}
            className="px-3 py-1.5 text-red-400 hover:text-red-300"
            onClick={(e) => {
              e.stopPropagation();
              openConfirmModal(item);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Contextos Temporales
          </h1>
          <p className="text-sm text-white/40 font-headline">
            Gestión de eventos y ventanas de tiempo
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Search
            onSearch={(value) => setSearchTerm(value)}
            placeholder="Buscar..."
            className="w-full md:w-72"
            isLoading={loading || searchTerm !== debouncedSearch}
          />
          <Button
            variant="action"
            icon={<BiPlus />}
            className="w-full sm:w-auto"
            onClick={() => navigate('/dashboard/temporal-contexts/create')}
          >
            NUEVO CONTEXTO
          </Button>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <Loading
            variant="overlay"
            message={
              debouncedSearch
                ? `Filtrando resultados...`
                : 'Cargando contextos...'
            }
          />
        )}

        <DataTable
          columns={columns}
          data={contexts}
          isLoading={false}
          onRowClick={(context) =>
            navigate(`/dashboard/temporal-contexts/${context.id}`)
          }
        />

        {!loading && totalItems > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              onPageChange={(page) => setCurrentPage(page)}
              isLoading={loading}
            />
          </div>
        )}
      </div>

      {/* Modal de confirmación de seguridad */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedContext(null);
        }}
        title="Confirmar Inactivación"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <BiCheckCircle className="text-3xl text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            ¿Inactivar contexto?
          </h3>
          <p className="text-sm text-white/60 mb-2">
            El contexto{' '}
            <strong className="text-white">{selectedContext?.name}</strong> será
            marcado como inactivo.
          </p>
          <p className="text-xs text-white/40 mb-6">
            Esta acción no eliminará el contexto, solo lo ocultará de la vista.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedContext(null);
              }}
            >
              CANCELAR
            </Button>
            <Button variant="danger" onClick={handleInactivate}>
              INACTIVAR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
