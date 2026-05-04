import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { HiArrowLeft, HiUserCircle } from "react-icons/hi";
import { useSelectedClient } from "../../context/SelectedClientContext";
import { useContacts } from "../../../../hooks/useContacts";
import { useNotifications } from "../../../../hooks/useNotifications";
import { supabase } from "../../../../../data/sources/supabase";
import { Button, Input, Modal, Notification } from "../../../../components/ui";

export default function AdminContactDetail() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const { selectedClient } = useSelectedClient();
  const { users, fetchContacts, softDeleteContact, createContact } =
    useContacts(selectedClient?.id);
  const { notifications, notify, removeNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNew] = useState(contactId === "nuevo");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    job_title: "",
    phone_number: "",
    email: "",
    is_internal: false,
    linked_user_id: "",
    organization_id: selectedClient?.id || "",
    status: "active" as "active" | "inactive",
    notes: null as string | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew && contactId && contactId !== "nuevo") {
      fetchContact();
    } else {
      setIsLoading(false);
    }
  }, [contactId, isNew]);

  const fetchContact = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", contactId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name,
          job_title: data.job_title || "",
          phone_number: data.phone_number,
          email: data.email,
          is_internal: data.is_internal,
          linked_user_id: data.linked_user_id || "",
          organization_id: data.organization_id,
          status: data.status,
          notes: data.notes,
        });
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
      notify("error", "Error", "No se pudo cargar la información del contacto");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Nombre es requerido";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "Teléfono es requerido";
    if (!formData.email.trim()) newErrors.email = "Email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (isNew) {
        await createContact({
          full_name: formData.full_name,
          job_title: formData.job_title || null,
          phone_number: formData.phone_number,
          email: formData.email,
          is_internal: formData.is_internal,
          linked_user_id: formData.linked_user_id || null,
          organization_id: selectedClient?.id || "",
        });
        notify("success", "Éxito", "Contacto creado correctamente");
      } else {
        const { error } = await supabase
          .from("contacts")
          .update({
            full_name: formData.full_name,
            job_title: formData.job_title || null,
            phone_number: formData.phone_number,
            email: formData.email,
            is_internal: formData.is_internal,
            linked_user_id: formData.linked_user_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", contactId);
        if (error) throw error;
        notify("success", "Éxito", "Contacto actualizado correctamente");
      }
      await fetchContacts();
      navigate("/dashboard/admin/contactos");
    } catch (error) {
      console.error("Error saving contact:", error);
      notify("error", "Error", "No se pudo guardar el contacto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!deleteReason.trim()) {
      notify(
        "warning",
        "Advertencia",
        "Debes ingresar un motivo para eliminar el contacto",
      );
      return;
    }

    try {
      await softDeleteContact(contactId!, deleteReason);
      notify("success", "Éxito", "Contacto eliminado correctamente");
      setIsDeleteModalOpen(false);
      setDeleteReason("");
      navigate("/dashboard/admin/contactos");
    } catch (error) {
      console.error("Error deleting contact:", error);
      notify("error", "Error", "No se pudo eliminar el contacto");
    }
  };

  const handleGoBack = () => {
    navigate("/dashboard/admin/contactos");
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-accent animate-pulse">Cargando contacto...</div>
      </div>
    );
  }

  if (!isNew && formData.status === "inactive") {
    return (
      <div>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
        >
          <HiArrowLeft size={18} />
          <span className="text-xs uppercase tracking-wider">
            Volver a Contactos
          </span>
        </button>
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-8 text-center">
          <div className="text-red-400 text-lg mb-2">Contacto Inactivo</div>
          <p className="text-text-muted mb-4">
            Este contacto ha sido eliminado del sistema.
          </p>
          {formData.notes && (
            <p className="text-sm text-text-secondary">
              Motivo: {formData.notes}
            </p>
          )}
          <Button variant="exit" onClick={handleGoBack} className="mt-4">
            Volver a Contactos
          </Button>
        </div>
      </div>
    );
  }

  const clientName = selectedClient?.isInternal
    ? "mi organización"
    : selectedClient?.name || "seleccionada";

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={removeNotification}
            duration={5000}
          />
        ))}
      </div>

      <div className="mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
        >
          <HiArrowLeft size={18} />
          <span className="text-xs uppercase tracking-wider">
            Volver a Contactos
          </span>
        </button>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-8 bg-accent rounded-full" />
          <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            {isNew ? "Nuevo" : "Editar"}{" "}
            <span className="text-accent">Contacto</span>
          </h1>
        </div>
        <p className="text-text-muted text-sm ml-3">
          {isNew
            ? `Agregar nuevo contacto a ${clientName}`
            : `Editar información del contacto en ${clientName}`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-muted/20">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <HiUserCircle size={24} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">
                Información del Contacto
              </h2>
              <p className="text-xs text-text-muted">
                Datos personales y de contacto
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Nombre Completo"
              name="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              error={errors.full_name}
              required
            />

            <Input
              type="text"
              label="Cargo"
              name="job_title"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
            />

            <Input
              type="number"
              label="Teléfono"
              name="phone_number"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              error={errors.phone_number}
              required
            />

            <Input
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              required
            />
          </div>

          <div className="pt-3">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">
              Usuario Vinculado (opcional)
            </label>
            <select
              name="linked_user_id"
              value={formData.linked_user_id}
              onChange={(e) =>
                setFormData({ ...formData, linked_user_id: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-surface/50 border border-muted/30 rounded-lg text-text-primary focus:border-accent/40 focus:outline-none transition-all"
            >
              <option value="">Ninguno</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_internal"
              checked={formData.is_internal}
              onChange={(e) =>
                setFormData({ ...formData, is_internal: e.target.checked })
              }
              className="w-4 h-4 accent-accent"
            />
            <label
              htmlFor="is_internal"
              className="text-xs text-text-secondary"
            >
              Marcar como contacto interno (usuario del sistema)
            </label>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <div className="flex gap-3">
            {!isNew && (
              <Button variant="delete" type="button" onClick={openDeleteModal}>
                Eliminar
              </Button>
            )}
            <Button variant="success" type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteReason("");
        }}
        title="Eliminar Contacto"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="cancel"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteReason("");
              }}
            >
              Cancelar
            </Button>
            <Button variant="delete" onClick={handleSoftDelete}>
              Eliminar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            ¿Estás seguro de que deseas eliminar este contacto?
          </p>
          <p className="text-text-muted text-xs">
            El contacto se marcará como inactivo y no aparecerá en la lista
            principal.
          </p>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">
              Motivo de la eliminación
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Ej: Contacto ya no trabaja en la empresa..."
              className="w-full px-4 py-2.5 bg-surface/50 border border-muted/30 rounded-lg text-text-primary placeholder:text-text-muted/50 focus:border-accent/40 focus:outline-none transition-all resize-none"
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
