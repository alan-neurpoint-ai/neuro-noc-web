import { BiEnvelope, BiLockAlt, BiShield } from "react-icons/bi";
import { Button } from "../../../../core/presentation/components/ui/Button";
import { Input } from "../../../../core/presentation/components/ui/Input";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] xl:w-[58%] relative bg-[#0c0c0c] overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#0c0c0c] via-[#0c0c0c]/95 to-[#1a1a2e]" />
        </div>

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-75 h-75 rounded-full bg-brand-primary/20 blur-[150px]" />
          <div className="absolute bottom-[30%] right-[15%] w-62.5 h-62.5 rounded-full bg-[#4a1d7c]/30 blur-[120px]" />
          <div className="absolute top-[60%] left-[40%] w-45 h-45 rounded-full bg-brand-accent/15 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-brand-primary to-[#8b5cf6] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-[#0c0c0c]" />
            </div>
            <div>
              <span className="text-2xl font-headline font-semibold text-white tracking-wide">
                NeuroNOC
              </span>
              <p className="text-xs text-white/40 font-headline tracking-wider">
                NETWORK INTELLIGENCE
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-linear-to-r from-transparent to-brand-primary" />
              <span className="text-xs font-headline font-medium text-brand-accent uppercase tracking-[0.3em]">
                Sistema de Gestión de Operaciones
              </span>
            </div>
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-headline font-bold text-white leading-[1.15]">
              Inteligencia en el{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-accent to-brand-primary">
                borde
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/50 font-headline leading-relaxed max-w-lg">
              La próxima generación de operaciones de red con capacidades de IA
              para monitoreo predictivo y respuesta automática.
            </p>

            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <BiShield className="text-brand-accent text-lg" />
                </div>
                <span className="text-sm text-white/60 font-headline">
                  Cifrado de grado militar
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg
                    className="text-brand-accent text-lg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm text-white/60 font-headline">
                  Certificación SOC 2
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-white/30 text-xs font-headline">
            <span>© 2026 Citrus Cloud. All rights reserved.</span>
            <span>Enterprise Edition v3.2.1</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] xl:w-[42%] bg-white flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary to-[#8b5cf6] flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg font-headline font-semibold text-[#1a1a2e]">
              NeuroNOC
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-10 xl:px-16 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-brand-primary" />
                <span className="text-xs font-headline font-medium text-brand-primary/60 uppercase tracking-[0.25em]">
                  Autenticación
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-[#1a1a2e] leading-tight">
                Bienvenido de nuevo
              </h2>
              <p className="mt-2 text-sm text-gray-500 font-headline">
                Ingresa tus credenciales para acceder al panel
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Input
                label="CORREO ELECTRÓNICO"
                type="email"
                placeholder="nombre@empresa.com"
                icon={<BiEnvelope className="text-lg" />}
              />

              <Input
                label="CONTRASEÑA"
                type="password"
                placeholder="••••••••"
                icon={<BiLockAlt className="text-lg" />}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4.5 h-4.5 border border-gray-300 rounded-sm peer-checked:bg-brand-primary peer-checked:border-brand-primary transition-all duration-150 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-headline text-gray-500">
                    Recordarme
                  </span>
                </label>
                <a
                  href="#"
                  className="text-xs font-headline text-brand-primary hover:text-[#4a1d7c] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button variant="login" fullWidth className="mt-2">
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <BiShield className="text-[#10b981]" />
                  <span className="font-headline">Conexión segura</span>
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <span className="text-xs text-gray-400 font-headline">
                  256-bit SSL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
