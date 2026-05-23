import { useState, useEffect } from 'react';
import { BiCog, BiUser, BiBell, BiSun, BiMoon, BiShield, BiX, BiCheck } from 'react-icons/bi';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { useTheme } from '../../../../core/hooks/useTheme';
import { useNotifications } from '../../../../core/hooks/useNotifications';

export const SettingsPage = () => {
  const { user, selectedOrganization } = useAuthStore();
  const { toggleTheme, isDark } = useTheme();
  const { getPermission, requestPermission, syncPreferenceToServer, isSupported } = useNotifications();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>(getPermission());
  const [permissionLoading, setPermissionLoading] = useState(false);

  // Cargar estado inicial desde el usuario
  useEffect(() => {
    if (user?.notificationsEnabled === true) {
      setNotificationsEnabled(true);
    }
    setBrowserPermission(getPermission());
  }, [user, getPermission]);

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      // Apagar notificaciones
      setNotificationsEnabled(false);
      if (user?.id) {
        await syncPreferenceToServer(user.id, false);
      }
    } else {
      // Mostrar modal de confirmación
      setShowConfirmModal(true);
    }
  };

  const handleConfirmNotifications = async () => {
    setShowConfirmModal(false);
    setPermissionLoading(true);

    const perm = await requestPermission();
    setBrowserPermission(perm);
    setPermissionLoading(false);

    if (perm === 'granted') {
      setNotificationsEnabled(true);
      // Enviar notificación de prueba
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('NeuroNOC', {
          body: 'Notificaciones activadas correctamente. Recibirás alertas en tiempo real.',
          icon: '/favicon.ico',
        });
      }
      if (user?.id) {
        await syncPreferenceToServer(user.id, true);
      }
    }
  };

  const permissionText = () => {
    if (!isSupported) return 'No soportado por este navegador';
    if (browserPermission === 'granted') return 'Permiso concedido';
    if (browserPermission === 'denied') return 'Permiso denegado. Debes habilitarlo desde la configuración del navegador.';
    return 'Se solicitará permiso al activar';
  };

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
                {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'}
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
                <div className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'bg-brand-primary/20 text-brand-primary' : 'bg-amber-500/20 text-amber-500'
                }`}>
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
                  isDark
                    ? 'bg-brand-primary/30'
                    : 'bg-amber-300/50'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                    isDark
                      ? 'left-0.5 bg-brand-primary text-white'
                      : 'left-7 bg-amber-400 text-white'
                  }`}
                >
                  {isDark ? (
                    <BiMoon size={12} />
                  ) : (
                    <BiSun size={12} />
                  )}
                </div>
              </button>
            </div>

            {/* Notificaciones */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-default">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  notificationsEnabled
                    ? 'bg-brand-primary/20 text-brand-primary'
                    : 'bg-hover-bg text-text-muted'
                }`}>
                  <BiBell size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-main">
                    Notificaciones de Alertas
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {notificationsEnabled
                      ? 'Recibirás notificaciones de nuevas alertas'
                      : 'Recibir alertas en tiempo real'}
                  </p>
                  <p className="text-[9px] text-text-muted/60 mt-0.5">
                    {permissionText()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notificationsEnabled}
                aria-label="Activar notificaciones"
                onClick={handleToggleNotifications}
                disabled={permissionLoading || !isSupported}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer ${
                  notificationsEnabled
                    ? 'bg-brand-primary/30'
                    : 'bg-hover-bg border border-border-default'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
                    notificationsEnabled
                      ? 'left-7 bg-brand-primary text-white'
                      : 'left-0.5 bg-bg-card text-text-muted'
                  }`}
                >
                  {notificationsEnabled ? (
                    <BiCheck size={12} />
                  ) : (
                    <BiX size={12} />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-elevated border border-border-default w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
                  <BiBell size={22} />
                </div>
                <h3 className="text-lg font-bold text-text-on-elevated">
                  Activar Notificaciones
                </h3>
              </div>

              <p className="text-sm text-text-on-elevated-muted mb-6 leading-relaxed">
                ¿Estás seguro de que deseas recibir notificaciones de alertas en este navegador?
                Recibirás una notificación cada vez que ocurra una alerta en tu organización.
              </p>

              <div className="flex items-center gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmNotifications}
                >
                  Sí, Activar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seguridad */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <BiShield size={20} />
            </div>
            <h2 className="text-lg font-bold text-text-main">Seguridad</h2>
          </div>

          <p className="text-sm text-text-muted mb-4">
            La autenticación y permisos son gestionados a través de Supabase
            con políticas de seguridad a nivel de fila (RLS).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-bg-surface border border-border-default">
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider mb-1">
                Método de Autenticación
              </p>
              <p className="text-text-main font-medium">Supabase Auth</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-surface border border-border-default">
              <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider mb-1">
                Base de Datos
              </p>
              <p className="text-text-main font-medium">PostgreSQL (Supabase)</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
