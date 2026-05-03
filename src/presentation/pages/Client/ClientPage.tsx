import { useNavigate } from "react-router";
import { Sidebar } from "../../components/ui";
import { useAuthStore } from "../../store/AuthStore";
import { useUserData } from "../../hooks/useUserData";

export default function ClientPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { userData, isLoading } = useUserData();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={userData} onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-accent animate-pulse">
            Cargando información del usuario...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={userData} onLogout={handleLogout} />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              Panel de <span className="text-accent">Cliente</span>
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-3">
            Bienvenido, {userData.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
            <h3 className="text-sm uppercase tracking-wider text-accent font-bold">
              Mis Nodos
            </h3>
            <p className="text-3xl font-black text-text-primary mt-2">0</p>
          </div>
          <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
            <h3 className="text-sm uppercase tracking-wider text-accent font-bold">
              Alertas
            </h3>
            <p className="text-3xl font-black text-text-primary mt-2">0</p>
          </div>
          <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
            <h3 className="text-sm uppercase tracking-wider text-accent font-bold">
              IA Config
            </h3>
            <p className="text-3xl font-black text-text-primary mt-2">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
