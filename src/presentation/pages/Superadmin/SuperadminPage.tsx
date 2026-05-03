import { Sidebar } from "../../components/ui/Sidebar/Sidebar";
import { useAuthStore } from "../../store/AuthStore";

import { useNavigate } from "react-router";

export default function SuperadminPage() {
  const { user, userRole, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userData = {
    name:
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      user?.email ||
      "Usuario",
    role:
      userRole === "super_admin"
        ? "Super Administrador"
        : userRole || "Usuario",
    email: user?.email || "",
    organization: user?.organization_id || "NOC System",
  };

  return (
    <div className="flex">
      <Sidebar user={userData} onLogout={handleLogout} />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-black mb-4">
          Superadmin Dashboard <span className="text-accent">{userRole}</span>
        </h1>

        <div className="bg-surface/30 border border-muted/30 rounded-sm p-6 mb-8">
          <h2 className="text-sm uppercase tracking-wider text-accent mb-4">
            Información de Sesión
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-text-muted">Usuario:</span> {user?.email}
            </p>
            <p>
              <span className="text-text-muted">Nombre:</span>{" "}
              {user?.first_name} {user?.last_name}
            </p>
            <p>
              <span className="text-text-muted">Rol:</span> {userRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
