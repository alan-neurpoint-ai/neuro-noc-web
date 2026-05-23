import { useState } from 'react';
import { BiUserCircle, BiX } from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { ContactRow } from '../../../../core/types/tenant/contacts.sql';

interface CreateUserForm {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

interface UserLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactRow | null;
  onSuccess: () => void;
}

export const UserLinkForm = ({
  isOpen,
  onClose,
  contact,
  onSuccess,
}: UserLinkFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserForm>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!contact?.organization_id) {
      setError('El contacto no tiene organización asignada');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name?.trim() || '',
            organization_id: contact.organization_id,
            role_name: 'user',
          },
        },
      });

      if (
        authError?.message?.includes('already been registered') ||
        authError?.message?.includes('already exists')
      ) {
        setError(
          'Este email ya está registrado. Prueba con otro email o contacta al administrador.'
        );
        setLoading(false);
        return;
      }

      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      const { error: updateError } = await supabase
        .from('contacts')
        .update({ linked_user_id: authData.user.id } as never)
        .eq('id', contact.id);

      if (updateError) throw updateError;

      setShowCreateUserModal(false);
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: '',
      });
      onSuccess();
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-elevated border border-border-default rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h3 className="text-lg font-bold text-text-on-elevated flex items-center gap-2">
            <BiUserCircle className="text-brand-accent" />
            Crear Usuario y Vincular
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-on-elevated transition"
          >
            <BiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

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
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1">
                Confirmar *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 bg-hover-bg border border-border-default rounded-lg text-text-on-elevated focus:outline-none focus:border-brand-accent"
                required
                minLength={6}
              />
            </div>
          </div>

          {contact?.organization_id && (
            <div className="p-3 bg-hover-bg rounded-lg border border-border-default">
              <p className="text-xs text-text-muted">
                Este usuario será creado en la organización:{' '}
                <span className="text-text-on-elevated font-medium">
                  {contact.organization_id}
                </span>
              </p>
            </div>
          )}

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
              className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

let setShowCreateUserModal: (value: boolean) => void;

// eslint-disable-next-line react-refresh/only-export-components
export const initUserLinkForm = (setModal: (value: boolean) => void) => {
  setShowCreateUserModal = setModal;
};
