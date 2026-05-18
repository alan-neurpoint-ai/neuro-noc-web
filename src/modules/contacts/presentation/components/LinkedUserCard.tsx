import {
  BiUserCircle,
  BiUser,
  BiAt,
  BiPhone,
  BiCalendar,
  BiLockAlt,
  BiPlus,
} from 'react-icons/bi';

interface LinkedUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  role_id: string | null;
  is_active: boolean | null;
  last_login: string | null;
  created_at: string | null;
}

interface LinkedUserCardProps {
  user: LinkedUser | null;
  onCreateUser: () => void;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const LinkedUserCard = ({ user, onCreateUser }: LinkedUserCardProps) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <BiUserCircle className="text-brand-accent" />
        Usuario Vinculado
      </h3>

      {user ? (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-accent/20 flex items-center justify-center">
              <BiUser className="text-3xl text-brand-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-bold text-white">
                  {user.first_name || user.email.split('@')[0]}{' '}
                  {user.last_name || ''}
                </h4>
                {user.is_active ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Activo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                    Inactivo
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <BiAt className="text-white/40" />
                  <span>{user.email}</span>
                </div>
                {user.phone_number && (
                  <div className="flex items-center gap-2 text-white/60">
                    <BiPhone className="text-white/40" />
                    <span>{user.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/60">
                  <BiCalendar className="text-white/40" />
                  <span>Último login: {formatDate(user.last_login)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <BiLockAlt className="text-white/40" />
                  <span>Creado: {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <BiUserCircle className="text-4xl text-white/10 mx-auto mb-2" />
          <p className="text-white/40 mb-4">
            Este contacto no está vinculado a ningún usuario
          </p>
          <button
            onClick={onCreateUser}
            className="px-4 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition flex items-center gap-2 mx-auto"
          >
            <BiPlus className="text-lg" />
            Crear vinculación de usuario
          </button>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { formatDate };
