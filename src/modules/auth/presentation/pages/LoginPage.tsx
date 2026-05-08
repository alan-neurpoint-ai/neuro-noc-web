import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../infrastructure/services/auth.service";
import { useAuthStore } from "../stores/useAuthStore";
import { BiLock } from "react-icons/bi";
import { Input } from "../../../../core/presentation/components/ui/Input";

export const LoginPage = () => {
  const [email] = useState("");
  const [password] = useState("");
  const [, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { profile } = await authService.signIn(email, password);
      setAuth(profile);
      navigate("/dashboard");
    } catch (error) {
      alert(
        `Error de autenticación: Verifique sus credenciales. ${(error as Error).message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#161b2c] p-10 rounded-2xl border border-blue-900/30 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            NEUROPOINT <span className="text-yellow-500">AI</span>
          </h2>
          <p className="mt-2 text-sm text-blue-300/60 font-medium">
            Network Operations Center Management
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          // 1. Prefijo Telefónico (+52)
          <Input
            label="Lada"
            validationType="phonePrefix"
            placeholder="+52"
            maxLength={4}
          />
          // 2. Decimales
          <Input label="Monto" validationType="decimal" placeholder="0.00" />
          // 3. Password con icono
          <Input type="password" label="Contraseña" icon={<BiLock />} />
          // 4. DateTime
          <Input type="datetime-local" label="Fecha de Alerta" />
        </form>
      </div>
    </div>
  );
};
