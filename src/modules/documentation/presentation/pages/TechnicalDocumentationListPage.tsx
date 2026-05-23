import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BiShow, BiTrash, BiLink, BiCheckCircle } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { Pagination } from '../../../../core/presentation/components/ui/Pagination';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Search } from '../../../../core/presentation/components/ui/Search';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { TechnicalDocumentationRow } from '../../../../core/types/knowledge/technical-documentation.sql';

const PAGE_SIZE = 10;

export const TechnicalDocumentationListPage = () => {
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<TechnicalDocumentationRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDoc, setSelectedDoc] =
    useState<TechnicalDocumentationRow | null>(null);

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
      setDocs([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
          .from('technical_documentation')
          .select('*', { count: 'exact' })
          .eq('organization_id', targetOrgId);

        if (debouncedSearch) {
          query = query.or(
            `name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`
          );
        }

        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        // Filter out inactive documents
        const filteredDocs =
          (data as TechnicalDocumentationRow[])?.filter(
            (doc) => doc.status !== 'inactive'
          ) || [];
        setDocs(filteredDocs);
        setTotalItems(count || 0);
      } catch (error) {
        console.error('Error loading documentation:', error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchDocs();
  }, [targetOrgId, currentPage, debouncedSearch]);

  const handleInactivate = async () => {
    if (!selectedDoc || !targetOrgId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('technical_documentation') as any)
        .update({ status: 'inactive' })
        .eq('id', selectedDoc.id);

      // Refresh
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from('technical_documentation') as any)
        .select('*', { count: 'exact' })
        .eq('organization_id', targetOrgId)
        .order('created_at', { ascending: false });

      const filteredDocs =
        (data as TechnicalDocumentationRow[])?.filter(
          (doc) => doc.status !== 'inactive'
        ) || [];
      setDocs(filteredDocs);
      setShowConfirmModal(false);
      setSelectedDoc(null);
    } catch (error) {
      console.error('Error inactivating documentation:', error);
    }
  };

  const openConfirmModal = (doc: TechnicalDocumentationRow) => {
    setSelectedDoc(doc);
    setShowConfirmModal(true);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'processed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
            Procesado
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
            Pendiente
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
            Fallido
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-hover-bg text-text-muted border border-border-default uppercase">
            Desconocido
          </span>
        );
    }
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: (item: TechnicalDocumentationRow) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-default text-[10px] font-bold text-brand-accent uppercase"
            style={{ background: 'rgba(103,45,169,0.2)' }}
          >
            {item.name.charAt(0)}
          </div>
          <span className="text-text-main font-bold tracking-tight">
            {item.name}
          </span>
        </div>
      ),
    },
    {
      header: 'Descripción',
      accessor: (item: TechnicalDocumentationRow) => (
        <span className="text-text-muted text-sm font-medium">
          {item.description || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (item: TechnicalDocumentationRow) =>
        getStatusBadge(item.status),
    },
    {
      header: 'Fecha Creación',
      accessor: (item: TechnicalDocumentationRow) => (
        <span className="font-mono text-xs text-text-muted">
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (item: TechnicalDocumentationRow) => (
        <div className="flex justify-end gap-2">
          {item.file_url && (
            <Button
              variant="ghost"
              icon={<BiLink size={16} />}
              className="px-3 py-1.5"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.file_url!, '_blank');
              }}
            />
          )}
          <Button
            variant="view"
            icon={<BiShow size={16} />}
            className="px-3 py-1.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/documentation/${item.id}`);
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
          <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase">
            Documentación Técnica
          </h1>
          <p className="text-sm text-text-muted font-headline">
            Base de conocimientos técnicos
          </p>
        </div>

        <div className="w-full md:w-72">
          <Search
            onSearch={(value) => setSearchTerm(value)}
            placeholder="Buscar..."
            className="w-full"
            isLoading={loading || searchTerm !== debouncedSearch}
          />
        </div>
      </div>

      <div className="relative">
        {loading && (
          <Loading
            variant="overlay"
            message={
              debouncedSearch
                ? `Filtrando resultados...`
                : 'Cargando documentación...'
            }
          />
        )}

        <DataTable
          columns={columns}
          data={docs}
          isLoading={false}
          onRowClick={(doc) => console.log('Row Clicked:', doc.id)}
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
          setSelectedDoc(null);
        }}
        title="Confirmar Inactivación"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <BiCheckCircle className="text-3xl text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-text-on-elevated mb-2">
            ¿Inactivar documentación?
          </h3>
          <p className="text-sm text-text-muted mb-2">
            El documento{' '}
            <strong className="text-text-on-elevated">{selectedDoc?.name}</strong> será
            marcado como inactivo.
          </p>
          <p className="text-xs text-text-muted mb-6">
            Esta acción no eliminará el documento, solo lo ocultará de la vista.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedDoc(null);
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
