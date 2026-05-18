import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BiPlus, BiShow } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { Pagination } from '../../../../core/presentation/components/ui/Pagination';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Search } from '../../../../core/presentation/components/ui/Search';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { ContactRow } from '../../../../core/types/tenant/contacts.sql';
import { ContactForm } from '../components/ContactForm';

const PAGE_SIZE = 10;

export const ContactListPage = () => {
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;
  const isInternalView =
    !selectedOrganization || selectedOrganization.isInternal;

  // Debounce Nativo
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [targetOrgId, debouncedSearch]);

  // Función para cargar contactos
  const loadContacts = async (page?: number, search?: string) => {
    if (!targetOrgId) {
      setContacts([]);
      setTotalItems(0);
      return;
    }

    setLoading(true);
    const pageNum = page ?? currentPage;
    const searchTerm = search ?? debouncedSearch;

    try {
      const from = (pageNum - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .eq('organization_id', targetOrgId)
        .eq('status', 'active');

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      const { data, error, count } = await query
        .order('full_name', { ascending: true })
        .range(from, to);

      if (error) throw error;

      setContacts((data as ContactRow[]) || []);
      setTotalItems(count || 0);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOrgId, currentPage, debouncedSearch]);

  const columns = [
    {
      header: 'Contacto',
      accessor: (item: ContactRow) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 text-[10px] font-bold text-brand-accent uppercase"
            style={{ background: 'rgba(103,45,169,0.2)' }}
          >
            {item.full_name.charAt(0)}
          </div>
          <span className="text-white font-bold tracking-tight">
            {item.full_name}
          </span>
        </div>
      ),
    },
    {
      header: 'Correo Electrónico',
      accessor: 'email' as keyof ContactRow,
      className: 'font-mono text-xs text-white/60',
    },
    {
      header: 'Tipo',
      accessor: (item: ContactRow) =>
        item.is_internal ? (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-brand-accent/10 text-brand-accent border border-brand-accent/20 uppercase">
            Interno
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/5 text-white/40 border border-white/10 uppercase">
            Cliente
          </span>
        ),
    },
    {
      header: 'Acciones',
      accessor: (item: ContactRow) => (
        <div className="flex justify-end">
          <Button
            variant="view"
            icon={<BiShow size={16} />}
            className="px-3 py-1.5"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Visualizando:', item.id);
            }}
          >
            VER
          </Button>
        </div>
      ),
    },
  ];

  const subtitle = isInternalView
    ? 'Directorio general de personal interno'
    : `Listado de contactos asociados a ${selectedOrganization?.name}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Gestión de Contactos
          </h1>
          <p className="text-sm text-white/40 font-headline">{subtitle}</p>
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
            onClick={() => setShowCreateModal(true)}
          >
            NUEVO CONTACTO
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
                : 'Cargando directorio...'
            }
          />
        )}

        <DataTable
          columns={columns}
          data={contacts}
          isLoading={false}
          onRowClick={(contact) =>
            navigate(`/dashboard/contacts/${contact.id}`)
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

      {/* Modal para crear contacto */}
      <ContactForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Recargar la lista de contactos
          setCurrentPage(1);
          loadContacts(1, debouncedSearch);
        }}
      />
    </div>
  );
};
