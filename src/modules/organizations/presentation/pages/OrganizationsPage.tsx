import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "../../../../core/supabase";
import { Card } from "../../../../core/presentation/components/ui/Card";
import { useAuthStore } from "../../../auth/presentation/stores/useAuthStore";

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

// Cache a nivel de módulo para evitar re-fetches innecesarios
const childrenCache = new Map<string, Organization[]>();

async function fetchChildOrganizations(
  parentId: string,
): Promise<Organization[]> {
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("parent_organization_id", parentId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Organization[]) || [];
}

export const OrganizationsPage = () => {
  const { user, selectedOrganization } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const currentOrgId = user?.organizationId;
  const isInternal = !selectedOrganization || selectedOrganization.isInternal;

  useEffect(() => {
    if (!currentOrgId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrganizations([]);
      setLoading(false);
      return;
    }

    // Devolver de cache si existe
    if (childrenCache.has(currentOrgId)) {
      setOrganizations(childrenCache.get(currentOrgId)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    let cancelled = false;

    fetchChildOrganizations(currentOrgId)
      .then((data) => {
        if (!cancelled && currentOrgId) {
          childrenCache.set(currentOrgId, data);
        }
        if (!cancelled) {
          setOrganizations(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error loading organizations:", error);
        if (!cancelled) {
          setOrganizations([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentOrgId]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent" />
      </div>
    );
  }

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

  const viewLabel = isInternal
    ? "Interno"
    : selectedOrganization?.name || "Organización";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-headline font-bold text-white">
              Organización
            </h1>
            {isInternal && (
              <span className="text-[10px] font-headline bg-brand-primary/20 text-brand-accent px-2 py-0.5 rounded-full">
                Vista interna
              </span>
            )}
          </div>
          <p className="text-sm text-white/50">{viewLabel}</p>
        </div>
        <span className="text-xs text-white/40">
          {organizations.length} organizacion{organizations.length !== 1 ? "es" : ""}
        </span>
      </div>

      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <Link key={org.id} to={`/dashboard/organizations/${org.id}`}>
              <Card variant="glass" className="p-4 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                          background:
                            "linear-gradient(135deg, #672da9 0%, #8b5cf6 100%)",
                          boxShadow: "0 0 20px rgba(103, 45, 169, 0.5)",
                        }}
                      >
                        <span className="text-white font-bold text-lg">
                          {org.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-headline font-bold group-hover:text-brand-accent transition-colors">
                          {org.name}
                        </h3>
                        <p className="text-white/40 text-xs">{org.slug}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="text-[10px] font-headline text-white/40 uppercase">
                          Tipo
                        </p>
                        <span className="text-xs text-white font-medium">
                          {getOrgTypeLabel(org.org_type)}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-headline text-white/40 uppercase">
                          Estado
                        </p>
                        {org.is_active ? (
                          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-headline text-white/40 uppercase">
                          ID
                        </p>
                        <span
                          className="text-xs text-white/60 font-mono truncate"
                          title={org.id}
                        >
                          {org.id.slice(0, 8)}...
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-headline text-white/40 uppercase">
                          Creada
                        </p>
                        <span className="text-xs text-white/60">
                          {org.created_at
                            ? new Date(org.created_at).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/10 text-brand-accent group-hover:bg-brand-primary/20 transition-colors shrink-0">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <p className="text-white/40">
            {isInternal
              ? "No hay organizaciones hijas disponibles"
              : "No hay organizaciones disponibles"}
          </p>
        </div>
      )}
    </div>
  );
};