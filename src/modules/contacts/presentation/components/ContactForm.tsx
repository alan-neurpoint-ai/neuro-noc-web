import { useState, useEffect } from 'react';
import { BiUser, BiX, BiSave } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ContactFormData {
  full_name: string;
  email: string;
  phone_number: string;
  job_title: string;
  organization_id: string;
  is_internal: boolean;
  notes: string;
}

export const ContactForm = ({
  isOpen,
  onClose,
  onSuccess,
}: ContactFormProps) => {
  const { user, selectedOrganization } = useAuthStore();
  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>('');
  const [formData, setFormData] = useState<ContactFormData>({
    full_name: '',
    email: '',
    phone_number: '',
    job_title: '',
    organization_id: targetOrgId || '',
    is_internal: false,
    notes: '',
  });

  useEffect(() => {
    if (targetOrgId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, organization_id: targetOrgId }));

      // Fetch organization name
      const fetchOrgName = async () => {
        const { data } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', targetOrgId)
          .single();

        const orgData = data as { name: string } | null;
        if (orgData) {
          setOrgName(orgData.name);
        }
      };

      fetchOrgName();
    }
  }, [targetOrgId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.full_name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!formData.phone_number.trim()) {
      setError('El teléfono es requerido');
      return;
    }

    if (!formData.organization_id) {
      setError('La organización es requerida');
      return;
    }

    setLoading(true);

    try {
      const insertData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.trim(),
        job_title: formData.job_title.trim() || null,
        organization_id: formData.organization_id,
        is_internal: formData.is_internal,
        notes: formData.notes.trim() || null,
        status: 'active',
      };

      const { error: insertError } = await supabase
        .from('contacts')
        .insert(insertData as never);

      if (insertError) throw insertError;

      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        job_title: '',
        organization_id: targetOrgId || '',
        is_internal: false,
        notes: '',
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating contact:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear contacto';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-elevated border border-border-default rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h3 className="text-lg font-bold text-text-on-elevated flex items-center gap-2">
            <BiUser className="text-brand-accent" />
            Nuevo Contacto
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-on-elevated transition"
          >
            <BiX className="text-xl" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 overflow-y-auto flex-1"
        >
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
              placeholder="juan@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
              placeholder="+52 555 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Cargo
            </label>
            <input
              type="text"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
              placeholder="Gerente de TI"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Organización
            </label>
            <div className="px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-main">
              {orgName || 'Cargando...'}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Este contacto queda registrado de la empresa:{' '}
              <span className="text-text-on-elevated">{orgName || '...'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_internal"
              checked={formData.is_internal}
              onChange={(e) =>
                setFormData({ ...formData, is_internal: e.target.checked })
              }
              className="w-4 h-4 rounded border-border-default bg-hover-bg text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="is_internal" className="text-sm text-text-muted">
              Contacto interno (de la organización)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent resize-none"
              rows={3}
              placeholder="Notas adicionales sobre el contacto..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-text-muted hover:text-text-on-elevated transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creando...
                </>
              ) : (
                <>
                  <BiSave />
                  Crear Contacto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
