import { useAuthStore } from "../../store/AuthStore";

export default function SuperadminPage() {
  const { user, userRole } = useAuthStore();

  return (
    <div className="p-8">
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
            <span className="text-text-muted">Nombre:</span> {user?.first_name}{" "}
            {user?.last_name}
          </p>
          <p>
            <span className="text-text-muted">Rol:</span> {userRole}
          </p>
          <p>
            <span className="text-text-muted">ID:</span> {user?.id}
          </p>
          <p>
            <span className="text-text-muted">Organización ID:</span>{" "}
            {user?.organization_id || "N/A"}
          </p>
          <p>
            <span className="text-text-muted">Último login:</span>{" "}
            {user?.last_login
              ? new Date(user.last_login).toLocaleString()
              : "Nunca"}
          </p>
        </div>
      </div>

      <p className="text-text-secondary mb-6">
        Welcome to the Superadmin dashboard! Here you can manage all aspects of
        the system.
      </p>

      <ul className="space-y-2 list-disc list-inside text-text-secondary">
        <li>Manage Users: Create, edit, and delete user accounts.</li>
        <li>View Analytics: Access detailed analytics and reports.</li>
        <li>
          System Settings: Configure system-wide settings and preferences.
        </li>
        <li>
          Audit Logs: Review logs of all system activities for security and
          compliance.
        </li>
      </ul>
    </div>
  );
}
