import { BiCog, BiUser } from 'react-icons/bi';
import { Card } from '../../../../core/presentation/components/ui/Card';

import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
export const SettingsPage = () => {
  const { user, selectedOrganization } = useAuthStore();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
          <BiCog className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase">
            Configuración
          </h1>
          <p className="text-sm text-text-muted font-headline">
            Administra las preferencias del sistema
          </p>
        </div>
      </div>

      {/* Perfil */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <BiUser size={20} />
            </div>
            <h2 className="text-lg font-bold text-text-main">Perfil</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                Nombre
              </p>
              <p className="text-text-main font-medium">
                {[user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
                  '—'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                Correo Electrónico
              </p>
              <p className="text-text-main font-medium">{user?.email || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                Rol
              </p>
              <p className="text-text-main font-medium capitalize">
                {user?.role?.name || '—'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">
                Organización
              </p>
              <p className="text-text-main font-medium">
                {selectedOrganization?.name || user?.organizationId || '—'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
