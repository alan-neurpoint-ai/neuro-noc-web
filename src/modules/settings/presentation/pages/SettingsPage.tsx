import { BiCog, BiUser, BiBell, BiSun, BiMoon } from 'react-icons/bi';
import { Card } from '../../../../core/presentation/components/ui/Card';

import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { useTheme } from '../../../../core/hooks/useTheme';
export const SettingsPage = () => {
  const { user, selectedOrganization } = useAuthStore();
  const { toggleTheme, isDark } = useTheme();
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

      {/* Preferencias */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <BiBell size={20} />
            </div>
            <h2 className="text-lg font-bold text-text-main">Preferencias</h2>
          </div>

          <div className="space-y-4">
            {/* Tema */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-default hover:border-brand-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? 'bg-brand-primary/20 text-brand-primary'
                      : 'bg-amber-500/20 text-amber-500'
                  }`}
                >
                  {isDark ? <BiMoon size={18} /> : <BiSun size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-main">
                    {isDark ? 'Modo Oscuro' : 'Modo Claro'}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {isDark
                      ? 'Interfaz en modo oscuro. Haz clic para cambiar a modo claro.'
                      : 'Interfaz en modo claro. Haz clic para cambiar a modo oscuro.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label="Alternar tema"
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer ${
                  isDark ? 'bg-brand-primary/30' : 'bg-amber-300/50'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                    isDark
                      ? 'left-0.5 bg-brand-primary text-white'
                      : 'left-7 bg-amber-400 text-white'
                  }`}
                >
                  {isDark ? <BiMoon size={12} /> : <BiSun size={12} />}
                </div>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
