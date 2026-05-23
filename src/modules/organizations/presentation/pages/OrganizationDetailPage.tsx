import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { BiArrowBack } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { OrganizationHeader } from '../components/OrganizationHeader';
import { OrganizationInfo } from '../components/OrganizationInfo';
import { PaymentHistory } from '../components/PaymentHistory';

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

  if (loading) {
    return <Loading message="Cargando organización..." variant="fullscreen" />;
  }

  if (!org) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted">Selecciona una organización</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard/organizations"
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-brand-accent transition-colors"
        >
          <BiArrowBack size={16} />
          Regresar
        </Link>
      </div>

      <OrganizationHeader name={org.name} slug={org.slug} />

      <OrganizationInfo org={org} />

      <PaymentHistory />
    </div>
  );
};
