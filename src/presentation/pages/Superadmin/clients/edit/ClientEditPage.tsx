import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { HiX, HiCheckCircle } from "react-icons/hi";
import { useAuthStore } from "../../../../store/AuthStore";
import { useClients } from "../../../../hooks/useClients";
import { supabase } from "../../../../../data/sources/supabase";
import { Sidebar, Topbar, Button, Input } from "../../../../components/ui";

export default function ClientEditPage() {
  const { clientId } = useParams();
  const { user, userRole, logout } = useAuthStore();
  const navigate = useNavigate();
  const { fetchClients } = useClients();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    org_type: "client",
    is_active: true,
    parent_organization_id: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    slug: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", clientId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          org_type: data.org_type || "client",
          is_active: data.is_active ?? true,
          parent_organization_id: data.parent_organization_id || "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el cliente",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = { name: "", slug: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
      isValid = false;
    }

    if (!formData.slug.trim()) {
      errors.slug = "El slug es requerido";
      isValid = false;
    } else if (formData.slug.includes(" ")) {
      errors.slug = "El slug no debe contener espacios";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          name: formData.name,
          slug: formData.slug,
          org_type: formData.org_type,
          is_active: formData.is_active,
          parent_organization_id: formData.parent_organization_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId);

      if (error) throw error;

      await fetchClients();
      navigate(`/dashboard/super_admin/clientes`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar los cambios",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userData = {
    name:
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      user?.email ||
      "Usuario",
    role:
      userRole === "super_admin"
        ? "Super Administrador"
        : userRole || "Usuario",
    email: user?.email || "",
    organization: "Neuropoint AI",
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={userData} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-accent animate-pulse">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-linear-to-br from-background via-background to-accent/5">
      <Sidebar user={userData} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar
          organizations={[]}
          currentOrg={{ id: "edit", name: "Editar Cliente" } as any}
          onOrgChange={() => {}}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-8 bg-accent rounded-full" />
                  <h1 className="text-3xl font-black tracking-tighter">
                    Editar <span className="text-accent">Cliente</span>
                  </h1>
                </div>
                <p className="text-text-muted text-sm ml-3">
                  Modifica la información del cliente
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
                  <p className="text-rose-400 text-sm">{error}</p>
                </div>
              )}

              <div className="bg-surface/30 border border-muted/20 rounded-xl p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    label="Nombre del Cliente"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={formErrors.name}
                    placeholder="Ej: Empresa SAC"
                    required
                  />

                  <Input
                    type="text"
                    label="Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    error={formErrors.slug}
                    placeholder="ejemplo-empresa"
                    required
                  />

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">
                      Tipo
                    </label>
                    <select
                      name="org_type"
                      value={formData.org_type}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-surface/50 border border-muted/30 rounded-lg text-text-primary focus:border-accent/40 focus:outline-none transition-all"
                    >
                      <option value="client">Cliente</option>
                      <option value="distributor">Distribuidor</option>
                      <option value="provider">Proveedor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">
                      Estado
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, is_active: true }))
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          formData.is_active
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                            : "bg-surface/50 border border-muted/30 text-text-muted"
                        }`}
                      >
                        <HiCheckCircle size={16} />
                        <span className="text-xs">Activo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, is_active: false }))
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          !formData.is_active
                            ? "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                            : "bg-surface/50 border border-muted/30 text-text-muted"
                        }`}
                      >
                        <HiX size={16} />
                        <span className="text-xs">Inactivo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="cancel"
                  onClick={() => navigate("/dashboard/super_admin/clientes")}
                >
                  Cancelar
                </Button>
                <Button variant="success" type="submit" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
