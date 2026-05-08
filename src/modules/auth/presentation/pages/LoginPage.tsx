import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../infrastructure/services/auth.service";
import { useAuthStore } from "../stores/useAuthStore";
import { Button } from "../../../../core/presentation/components/ui/Button";
import { MdEditNotifications } from "react-icons/md";
import { BiLogOut, BiPlus, BiRefresh } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { BsEye } from "react-icons/bs";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        // 1. LOGIN
        <Button variant="login" fullWidth onClick={handleLogin}>
          ACCEDER AL NOC
        </Button>
        // 2. EDITAR / ELIMINAR (Dashboard de alertas)
        <Button variant="edit" icon={<MdEditNotifications />} />
        // 3. LOGOUT (Navbar)
        <Button variant="logout" icon={<BiLogOut />}>
          SALIR
        </Button>
        // 4. ABRIR MODAL / SUBIR DOCUMENTO (Acción principal)
        <Button variant="action" icon={<BiPlus />}>
          NUEVA REGLA
        </Button>
        <Button variant="action" icon={<BiPlus />}>
          SUBIR PDF
        </Button>
        // 5. REFRESCAR / FILTRAR
        <Button variant="filter" icon={<BiRefresh />} />
        <Button variant="filter" icon={<FiFilter />}>
          FILTRAR NODOS
        </Button>
        // 6. VISUALIZAR
        <Button variant="view" icon={<BsEye />}>
          VER LOGS
        </Button>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 mt-1 bg-[#0d1224] border border-blue-900/50 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
                placeholder="admin@neuropoint.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 mt-1 bg-[#0d1224] border border-blue-900/50 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-[#0a0f1e] bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? "AUTENTICANDO..." : "ACCEDER AL NOC"}
          </button>
        </form>
      </div>
    </div>
  );
};
