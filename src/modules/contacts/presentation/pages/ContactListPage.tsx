import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BiPlus, BiUser, BiEnvelope, BiPhone, BiBuilding } from 'react-icons/bi';
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

const AVATAR_COLORS = [
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-fuchsia-500',
];

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

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
  const isInternalView = !selectedOrganization || selectedOrganization.isInternal;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [targetOrgId, debouncedSearch]);

  const loadContacts = async (page?: number, search?: string) => {
    if (!targetOrgId) {
      setContacts([]);
      setTotalItems(0);
      return;
    }

    setLoading(true);
    const pageNum = page ?? currentPage;
    const searchTermValue = search ?? debouncedSearch;

    try {
      const from = (pageNum - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .eq('organization_id', targetOrgId)
        .eq('status', 'active');

      if (searchTermValue) {
        query = query.or(
          `full_name.ilike.%${searchTermValue}%,email.ilike.%${searchTermValue}%`
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
    loadContacts();
  }, [targetOrgId, currentPage, debouncedSearch]);

  const columns = [
    {
      header: 'Contacto',
      accessor: (item: ContactRow) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${getAvatarColor(item.full_name)} text-white text-xs font-bold uppercase shrink-0`}>
            {item.full_name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-text-main font-semibold text-sm tracking-tight truncate">
              {item.full_name}
            </p>
            {item.job_title && (
              <p className="text-[10px] text-text-muted truncate">
                {item.job_title}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Correo',
      accessor: (item: ContactRow) => (
        <div className="flex items-center gap-2 min-w-0">
          <BiEnvelope size={12} className="text-text-muted/40 shrink-0" />
          <span className="text-text-muted text-xs font-mono truncate">
            {item.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Teléfono',
      accessor: (item: ContactRow) => (
        <div className="flex items-center gap-2">
          <BiPhone size={12} className="text-text-muted/40 shrink-0" />
          <span className="text-text-muted text-xs">
            {item.phone_number || '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessor: (item: ContactRow) =>
        item.is_internal ? (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-secondary border border-brand-primary/20">
            Interno
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-bg-surface text-text-muted border border-border-default">
            Cliente
          </span>
        ),
    },
  ];

  const subtitle = isInternalView
    ? 'Directorio general de personal interno'
    : `Contactos asociados a ${selectedOrganization?.name}`;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-text-main tracking-tighter uppercase">
            Gestión de Contactos
          </h1>
          <p className="text-sm text-text-muted font-headline mt-0.5">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated/50 border border-border-subtle/50">
          <BiUser size={12} className="text-brand-primary" />
          <span className="text-[10px] font-bold text-text-muted tracking-wide">
            {totalItems} contactos
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Search
          onSearch={(value) => setSearchTerm(value)}
          placeholder="Buscar por nombre o correo..."
          className="flex-1 sm:max-w-xs"
          isLoading={loading || searchTerm !== debouncedSearch}
        />
        <Button
          variant="action"
          icon={<BiPlus />}
          className="w-full sm:w-auto"
          onClick={() => setShowCreateModal(true)}
        >
          Nuevo Contacto
        </Button>
      </div>

      <div className="relative">
        {loading && (
          <Loading
            variant="overlay"
            message={debouncedSearch ? 'Filtrando resultados...' : 'Cargando directorio...'}
          />
        )}

        <DataTable
          title="Directorio"
          subtitle={`${totalItems} contactos registrados`}
          columns={columns}
          data={contacts}
          isLoading={false}
          onRowClick={(contact) => navigate(`/dashboard/contacts/${contact.id}`)}
        />

        {!loading && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            onPageChange={(page) => setCurrentPage(page)}
            isLoading={loading}
          />
        )}
      </div>

      <ContactForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setCurrentPage(1);
          loadContacts(1, debouncedSearch);
        }}
      />
    </div>
  );
};