import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BiEnvelope, BiLockAlt, BiShield, BiCheckShield } from 'react-icons/bi';
import { authService } from '../../infrastructure/services/auth.service';
import { useAuthStore } from '../stores/useAuthStore';
import { Input } from '../../../../core/presentation/components/ui/Input';
import { Button } from '../../../../core/presentation/components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuthentication = useAuthStore((state) => state.setAuth);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [authenticationError, setAuthenticationError] = useState('');

  const handleAuthenticationSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsProcessingRequest(true);
    setAuthenticationError('');

    try {
      const authenticationResult = await authService.signIn(
        emailValue,
        passwordValue
      );
      setAuthentication(authenticationResult.profile);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al iniciar sesión';
      setAuthenticationError(errorMessage);
    } finally {
      setIsProcessingRequest(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-body antialiased">
      <div className="hidden lg:flex lg:w-[58%] relative bg-bg-main overflow-hidden border-r border-white/5">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-secondary/5 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <div className="flex items-center gap-4">
            <div></div>
          </div>

          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-0.5 w-10 bg-brand-primary" />
              <span className="font-label text-[10px] font-bold text-brand-secondary uppercase tracking-[0.25em]">
                Sistema de Gestión de Operaciones
              </span>
            </div>
            <h1 className="text-6xl font-headline font-extrabold text-white leading-tight">
              Inteligencia en el <br />
              <span className="text-brand-secondary">borde</span>
            </h1>
            <p className="mt-8 text-lg text-text-muted font-body leading-relaxed max-w-md">
              Operaciones de red con capacidades de IA para monitoreo
              predictivo.
            </p>

            <div className="mt-12 flex gap-4">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                <BiShield className="text-brand-primary text-xl" />
                <span className="text-[10px] font-label text-text-muted uppercase tracking-wider">
                  Cifrado Militar
                </span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                <BiCheckShield className="text-brand-primary text-xl" />
                <span className="text-[10px] font-label text-text-muted uppercase tracking-wider">
                  SOC 2 Certified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between font-label text-[10px] text-text-muted/40 uppercase tracking-widest">
            <span>© 2026 Neuropoint.ai</span>
            <span>v3.2.1</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[42%] flex flex-col justify-center items-center px-6 sm:px-12 xl:px-24">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-0.5 w-8 bg-brand-primary" />
              <span className="font-label text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">
                Autenticación
              </span>
            </div>
            <h2 className="text-4xl font-headline font-bold text-bg-main tracking-tight leading-tight">
              Bienvenido
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleAuthenticationSubmit}>
            <Input
              label="Correo Electrónico"
              type="email"
              value={emailValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmailValue(e.target.value)
              }
              icon={<BiEnvelope size={18} />}
              disabled={isProcessingRequest}
            />

            <Input
              label="Contraseña"
              type="password"
              value={passwordValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordValue(e.target.value)
              }
              icon={<BiLockAlt size={18} />}
              disabled={isProcessingRequest}
            />

            {authenticationError && (
              <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/20">
                <p className="font-label text-[10px] text-status-error font-bold uppercase tracking-wider">
                  {authenticationError}
                </p>
              </div>
            )}

            <Button
              variant="primary"
              fullWidth
              className="py-4 shadow-xl shadow-brand-primary/30"
              isLoading={isProcessingRequest}
            >
              Acceder al Sistema
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
