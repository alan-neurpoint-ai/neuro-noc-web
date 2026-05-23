import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BiShow, BiTrash } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { DataTable } from '../../../../core/presentation/components/ui/DataTable';
import { Pagination } from '../../../../core/presentation/components/ui/Pagination';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { RuleListHeader } from '../components/RuleListHeader';
import { InactivateConfirmModal } from '../components/InactivateConfirmModal';

const PAGE_SIZE = 10;

interface BusinessRule {
  id: string;
  name: string;
  description: string | null;
  execution_schedule: string | null;
  status: string | null;
  created_at: string | null;
}

export const BusinessRuleListPage = () => {
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<BusinessRule | null>(null);

  const targetOrgId = selectedOrganization?.id || user?.organizationId;

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
      setRules([]);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    const fetchRules = async () => {
      setLoading(true);
      try {
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query = (supabase.from('business_rule') as any)
          .select('*', { count: 'exact' })
          .eq('organization_id', targetOrgId)
          .is('deleted_at', null);

        if (debouncedSearch) {
          query = query.or(
            `name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%`
          );
        }

        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        const filteredRules =
          (data as BusinessRule[])?.filter(
            (rule) => rule.status !== 'inactive'
          ) || [];
        setRules(filteredRules);
        setTotalItems(count || 0);
      } catch (error) {
        console.error('Error loading business rules:', error);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchRules();
  }, [targetOrgId, currentPage, debouncedSearch]);

  const handleInactivate = async () => {
    if (!selectedRule || !targetOrgId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('business_rule') as any)
        .update({ status: 'inactive' })
        .eq('id', selectedRule.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from('business_rule') as any)
        .select('*')
        .eq('organization_id', targetOrgId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      const filteredRules =
        (data as BusinessRule[])?.filter(
          (rule) => rule.status !== 'inactive'
        ) || [];
      setRules(filteredRules);
      setShowConfirmModal(false);
      setSelectedRule(null);
    } catch (error) {
      console.error('Error inactivating rule:', error);
    }
  };

  const openConfirmModal = (rule: BusinessRule) => {
    setSelectedRule(rule);
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
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      active: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        label: 'Activa',
      },
      inactive: { bg: 'bg-hover-bg', text: 'text-text-muted', label: 'Inactiva' },
      draft: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        label: 'Borrador',
      },
    };
    const config = statusConfig[status || ''] || {
      bg: 'bg-hover-bg',
      text: 'text-text-muted',
      label: 'Desconocido',
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[9px] font-black ${config.bg} ${config.text} border border-border-default uppercase`}
      >
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: (item: BusinessRule) => (
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
      accessor: (item: BusinessRule) => (
        <span className="text-text-muted text-sm font-medium">
          {item.description || '-'}
        </span>
      ),
    },
    {
      header: 'Programación',
      accessor: (item: BusinessRule) => (
        <span className="font-mono text-xs text-text-muted">
          {item.execution_schedule || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: (item: BusinessRule) => getStatusBadge(item.status),
    },
    {
      header: 'Fecha Creación',
      accessor: (item: BusinessRule) => (
        <span className="font-mono text-xs text-text-muted">
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (item: BusinessRule) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="view"
            icon={<BiShow size={16} />}
            className="px-3 py-1.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/rules/${item.id}`);
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
      <RuleListHeader
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        debouncedSearch={debouncedSearch}
        onCreate={() => navigate('/dashboard/rules/create')}
        loading={loading}
      />

      <div className="relative">
        {loading && (
          <Loading
            variant="overlay"
            message={
              debouncedSearch ? 'Filtrando resultados...' : 'Cargando reglas...'
            }
          />
        )}

        <DataTable
          columns={columns}
          data={rules}
          isLoading={false}
          onRowClick={(rule) => navigate(`/dashboard/rules/${rule.id}`)}
        />

        {!loading && totalItems > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              isLoading={loading}
            />
          </div>
        )}
      </div>

      <InactivateConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedRule(null);
        }}
        ruleName={selectedRule?.name ?? null}
        onConfirm={handleInactivate}
      />
    </div>
  );
};
