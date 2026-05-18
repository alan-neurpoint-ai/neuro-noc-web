import { useState } from 'react';
import { BiEdit, BiX } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { ContactRow } from '../../../../core/types/tenant/contacts.sql';

interface ContactEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactRow | null;
  onSuccess: () => void;
}

interface EditFormData {
  full_name: string;
  email: string;
  phone_number: string;
  job_title: string;
  is_internal: boolean;
  status: string;
  notes: string;
}

export const ContactEditForm = ({
  isOpen,
  onClose,
  contact,
  onSuccess,
}: ContactEditFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
    full_name: '',
    email: '',
    phone_number: '',
    job_title: '',
    is_internal: false,
    status: '',
    notes: '',
  });

  const openForm = () => {
    if (contact) {
      setFormData({
        full_name: contact.full_name || '',
        email: contact.email || '',
        phone_number: contact.phone_number || '',
        job_title: contact.job_title || '',
        is_internal: contact.is_internal || false,
        status: contact.status || 'active',
        notes: contact.notes || '',
      });
    }
  };

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

    setLoading(true);

    try {
      const updateData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.trim(),
        job_title: formData.job_title.trim() || null,
        is_internal: formData.is_internal,
        status: formData.status,
        notes: formData.notes.trim() || null,
      };

      if (!contact?.id) {
        setError('Error: ID de contacto no encontrado');
        return;
      }

      const { error: updateError } = await supabase
        .from('contacts')
        .update(updateData as never)
        .eq('id', contact.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating contact:', err);
      setError(
        err instanceof Error ? err.message : 'Error al actualizar contacto'
      );
    } finally {
      setLoading(false);
    }
  };

  // Open form when modal opens
  if (isOpen && contact && !formData.full_name) {
    openForm();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BiEdit className="text-brand-accent" />
            Editar Contacto
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white transition"
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
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-accent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">
              Cargo
            </label>
            <input
              type="text"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-accent"
            >
              <option value="active" className="bg-gray-800">
                Activo
              </option>
              <option value="inactive" className="bg-gray-800">
                Inactivo
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit_is_internal"
              checked={formData.is_internal}
              onChange={(e) =>
                setFormData({ ...formData, is_internal: e.target.checked })
              }
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-accent focus:ring-brand-accent"
            />
            <label htmlFor="edit_is_internal" className="text-sm text-white/60">
              Contacto interno
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/40 uppercase mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-accent resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
