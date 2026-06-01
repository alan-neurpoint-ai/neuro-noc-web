import { useState } from 'react';
import { BiEnvelope, BiLockAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { authService } from '../../infrastructure/services/auth.service';
import { useAuthStore } from '../stores/useAuthStore';
import { Input } from '../../../../core/presentation/components/ui/Input';
import { Button } from '../../../../core/presentation/components/ui/Button';

const PASSWORD_STRENGTH_COLORS = [
  'bg-red-500/60',
  'bg-amber-500/60',
  'bg-brand-primary/60',
  'bg-emerald-500/60',
] as const;

function PasswordStrength({ length }: { length: number }) {
  if (length === 0) return null;
  return (
    <div className="flex gap-1 px-1">
      {[1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
            length >= level * 2
              ? PASSWORD_STRENGTH_COLORS[Math.min(level - 1, 3)]
              : 'bg-border-default'
          }`}
        />
      ))}
    </div>
  );
}

function AuthError({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-xl bg-red-500/[0.07] border border-red-500/12 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <svg
          className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="font-label text-[clamp(10px,0.6vw,13px)] text-red-400 font-bold uppercase tracking-wider">
          {message}
        </p>
      </div>
    </div>
  );
}

interface LoginFormCardProps {
  mountAnim: boolean;
}

export function LoginFormCard({ mountAnim }: LoginFormCardProps) {
  const navigate = useNavigate();
  const setAuthentication = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.signIn(email, password);
      setAuthentication(result.profile);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full lg:w-[48%] flex flex-col justify-center items-center px-6 sm:px-8 lg:px-10 xl:px-16 2xl:px-24 relative z-10 py-12 lg:py-0 transition-all duration-1000 delay-300 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="w-full max-w-92 lg:max-w-96 xl:max-w-100 2xl:max-w-105">
        <div
          className={`flex lg:hidden items-center justify-center gap-3 mb-10 transition-all duration-700 delay-200 ${mountAnim ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        >
          <div>
            <span className="font-headline text-[clamp(1.1rem,2vw,1.6rem)] font-bold text-text-main tracking-tight">
              NEURO
            </span>
            <span className="font-headline text-[clamp(1.1rem,2vw,1.6rem)] font-bold text-brand-secondary tracking-tight">
              NOC
            </span>
          </div>
        </div>

        <div className="mb-8 xl:mb-10">
          <div
            className={`flex items-center gap-3 mb-3 xl:mb-4 transition-all duration-600 delay-400 ${mountAnim ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
          >
            <div className="relative w-2 h-2 xl:w-2.5 xl:h-2.5">
              <div className="absolute inset-0 rounded-full bg-brand-primary animate-login-pulse" />
              <div className="absolute -inset-0.75 rounded-full bg-brand-primary/20 animate-login-pulse [animation-delay:0.5s]" />
            </div>
            <span className="font-label text-[clamp(10px,0.6vw,14px)] font-bold text-brand-primary uppercase tracking-[0.25em]">
              Acceso
            </span>
          </div>

          <h2
            className={`font-headline text-[clamp(1.7rem,2.2vw,2.6rem)] font-extrabold text-text-main tracking-tight leading-tight transition-all duration-600 delay-500 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Inicia sesión
          </h2>
          <p
            className={`mt-2 xl:mt-3 text-[clamp(0.75rem,0.8vw,0.95rem)] text-text-muted/40 font-body transition-all duration-600 delay-600 ${mountAnim ? 'opacity-100' : 'opacity-0'}`}
          >
            Ingresa tus credenciales para acceder al centro de operaciones
          </p>
        </div>

        <div
          className={`relative transition-all duration-800 delay-500 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 gradient-login-card-border animate-login-border-rotate" />
          <div className="absolute inset-0 rounded-2xl gradient-login-card-inner" />

          <form
            className="relative p-6 sm:p-7 xl:p-8 2xl:p-10 rounded-2xl border border-border-subtle bg-bg-surface/60 backdrop-blur-xl"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4 xl:space-y-5">
              <div
                className={`transition-all duration-600 delay-700 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  icon={<BiEnvelope size={18} />}
                  disabled={isLoading}
                  placeholder="tu@empresa.com"
                />
              </div>

              <div
                className={`transition-all duration-600 delay-800 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                <Input
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  icon={<BiLockAlt size={18} />}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
              </div>

              <PasswordStrength length={password.length} />
              {error && <AuthError message={error} />}

              <div
                className={`pt-1 transition-all duration-600 delay-900 ${mountAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-[14px] gradient-login-button-glow opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
                  <Button
                    variant="primary"
                    fullWidth
                    className="py-3.5 xl:py-4 relative overflow-hidden"
                    isLoading={isLoading}
                  >
                    {isLoading ? null : (
                      <span className="relative z-10 flex items-center justify-center gap-2 text-[clamp(0.75rem,0.8vw,0.95rem)]">
                        <svg
                          className="w-4 h-4 xl:w-4.5 xl:h-4.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <polyline points="10 17 15 12 10 7" />
                          <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Acceder al Sistema
                      </span>
                    )}
                  </Button>
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-login-shimmer">
                      <div className="absolute inset-0 gradient-login-shimmer -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <p
          className={`mt-6 xl:mt-8 text-center text-[clamp(7px,0.45vw,9px)] text-text-muted/25 font-label tracking-[0.15em] uppercase transition-all duration-600 delay-1000 ${mountAnim ? 'opacity-100' : 'opacity-0'}`}
        >
          Powered by Neuropoint.ai
        </p>
      </div>
    </div>
  );
}