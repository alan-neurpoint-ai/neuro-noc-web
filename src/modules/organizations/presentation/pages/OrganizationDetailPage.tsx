import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { supabase } from "../../../../core/supabase";
import { Card } from "../../../../core/presentation/components/ui/Card";
import { Loading } from "../../../../core/presentation/components/ui/Loading";
import {
  BiBuilding,
  BiLink,
  BiCalendar,
  BiCheckbox,
  BiGitBranch,
  BiIdCard,
  BiArrowBack,
} from "react-icons/bi";

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

async function fetchOrganization(id: string): Promise<Organization> {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
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

    setLoading(true);
    let cancelled = false;

    fetchOrganization(id)
      .then((data) => {
        if (!cancelled) {
          setOrg(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error loading organization:", error);
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
      case "provider":
        return "Proveedor";
      case "client":
        return "Cliente";
      case "distributor":
        return "Distribuidor";
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
            background: "linear-gradient(135deg, #672da9 0%, #8b5cf6 100%)",
            boxShadow: "0 0 30px rgba(103, 45, 169, 0.6)",
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
        <div className="lg:col-span-1 space-y-4">
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BiIdCard className="text-brand-accent text-lg" />
              <h3 className="text-sm font-headline font-bold text-white uppercase">
                Estado
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Estado actual</span>
              {org.is_active ? (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Activo
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  Inactivo
                </span>
              )}
            </div>
          </Card>

          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BiLink className="text-brand-accent text-lg" />
              <h3 className="text-sm font-headline font-bold text-white uppercase">
                Relación
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Tipo</span>
                <span className="text-white font-medium">
                  {getOrgTypeLabel(org.org_type)}
                </span>
              </div>
              {org.parent_organization_id ? (
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Padre</span>
                  <span className="text-white/60 text-xs font-mono">
                    {org.parent_organization_id.slice(0, 8)}...
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Rol</span>
                  <span className="text-brand-accent text-xs font-medium">
                    Organización Raíz
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BiGitBranch className="text-brand-accent text-lg" />
              <h3 className="text-sm font-headline font-bold text-white uppercase">
                Identificador
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-white/40 uppercase">ID</p>
              <p className="text-xs text-white/80 font-mono break-all">
                {org.id}
              </p>
            </div>
          </Card>
        </div>

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
                  {org.is_active ? "Activa" : "Inactiva"}
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
                    ? new Date(org.created_at).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase mb-1">
                  Última Actualización
                </p>
                <p className="text-white">
                  {org.updated_at
                    ? new Date(org.updated_at).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};