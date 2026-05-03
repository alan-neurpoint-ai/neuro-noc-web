import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { HiTerminal } from "react-icons/hi";
import { fondo } from "../../assets";
import { Input, Button } from "../../components/ui";
import { useAuthStore } from "../../store/AuthStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localErrors, setLocalErrors] = useState({ email: "", password: "" });
  const {
    login,
    isLoading,
    error: authError,
    isAuthenticated,
    userRole,
  } = useAuthStore();
  const navigate = useNavigate();

  console.log("LoginPage - Estado:", {
    isAuthenticated,
    userRole,
    isLoading,
    authError,
  });

  useEffect(() => {
    console.log("LoginPage - useEffect ejecutado:", {
      isAuthenticated,
      userRole,
    });

    if (isAuthenticated && userRole) {
      const redirectPath = `/dashboard/${userRole}`;
      console.log("LoginPage - Redirigiendo a:", redirectPath);
      navigate(redirectPath);
    }
  }, [isAuthenticated, userRole, navigate]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("LoginPage - handleLogin iniciado", { email, password: "***" });

    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setLocalErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      console.log("LoginPage - Validaciones pasadas, llamando a login...");
      await login(email, password);
      console.log("LoginPage - Login completado");
    } else {
      console.log("LoginPage - Error de validación:", newErrors);
    }
  };
  return (
    <div className="min-h-screen flex bg-background text-text-primary font-sans selection:bg-accent/30">
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-12 lg:p-24 relative overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.25)]">
            <HiTerminal className="text-background" size={24} />
          </div>
          <span className="font-black uppercase tracking-[0.4em] text-xs">
            NOC System
          </span>
        </div>

        <div className="max-w-md w-full mx-auto z-10">
          <header className="mb-12 text-center lg:text-left">
            <h1 className="text-5xl font-black tracking-tighter mb-4">
              Login <span className="text-accent">_</span>
            </h1>
            <p className="text-text-muted text-sm font-medium tracking-widest uppercase opacity-70">
              Neuropoint Operations Interface
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="bg-red-950/20 border border-red-900/50 rounded-sm p-3">
                <p className="text-red-400 text-xs uppercase tracking-wider text-center">
                  {authError}
                </p>
              </div>
            )}

            <Input
              type="email"
              label="EMAIL / USERNAME"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (localErrors.email)
                  setLocalErrors({ ...localErrors, email: "" });
              }}
              placeholder="admin@neuropoint.com"
              error={localErrors.email}
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              label="PASSWORD"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (localErrors.password)
                  setLocalErrors({ ...localErrors, password: "" });
              }}
              placeholder="••••••••"
              error={localErrors.password}
              required
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.15em] text-text-muted">
              <label className="flex items-center gap-2 cursor-pointer hover:text-text-primary transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-accent w-4 h-4 rounded border-muted/20 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="cursor-pointer">Remember Me</span>
              </label>
              <a
                href="#"
                className="hover:text-accent transition-colors underline-offset-4 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              variant="login"
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "CONNECTING..." : "Establish Connection"}
            </Button>
          </form>
        </div>

        <footer className="flex justify-between text-[9px] text-text-muted/50 uppercase tracking-[0.3em] font-black z-10">
          <span className="hover:text-text-muted transition-colors cursor-help">
            Privacy Policy
          </span>
          <span>© 2026 Neuropoint AI</span>
        </footer>

        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <img
            src={fondo}
            alt="NOC Terminal"
            className="w-full h-full object-contain object-bottom-right opacity-90 drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-tr from-background via-transparent to-accent/5 pointer-events-none" />
      </div>
    </div>
  );
}
