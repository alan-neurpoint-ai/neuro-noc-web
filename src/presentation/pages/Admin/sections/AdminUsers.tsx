import { useState, useEffect, useMemo } from "react";
import { UserRepositoryImpl } from "../../../../data/repositories/UserRepositoryImpl";
import type { User } from "../../../../core/entities/supabase/User";
import { useSelectedClient } from "../context/SelectedClientContext";

export default function AdminUsers() {
  const { selectedClient } = useSelectedClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Instancia del repositorio memorizada para evitar re-creaciones
  const userRepo = useMemo(() => new UserRepositoryImpl(), []);

  useEffect(() => {
    async function loadUsers() {
      // Si no hay cliente seleccionado, limpiamos la lista y detenemos carga
      if (!selectedClient?.id) {
        setUsers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Filtrado estricto por la organización seleccionada en el contexto
        const data = await userRepo.findAll(selectedClient.id);
        setUsers(data);
      } catch (error) {
        console.error("Critical: Error loading organization users:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [selectedClient?.id, userRepo]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-text-primary">
            User <span className="text-accent">Directory</span>
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-text-secondary uppercase mt-2">
            Gestión de Operadores para:{" "}
            <span className="text-accent/80">
              {selectedClient?.name || "Organización no seleccionada"}
            </span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">
            Total Registros
          </span>
          <p className="text-2xl font-mono font-bold text-accent">
            {users.length}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-accent text-[10px] uppercase tracking-widest animate-pulse">
            Sincronizando registros de {selectedClient?.name}...
          </p>
        </div>
      ) : (
        <div className="border border-white/5 bg-white/1 rounded-sm overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-widest text-text-secondary">
                <th className="p-4 font-bold">Operador</th>
                <th className="p-4 font-bold">Identificador de Org</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold">Último Acceso</th>
                <th className="p-4 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-all duration-300 group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center text-accent font-black text-sm group-hover:scale-110 transition-transform">
                          {user.first_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary uppercase tracking-tighter">
                            {user.first_name || "Sin nombre"}{" "}
                            {user.last_name || ""}
                          </p>
                          <p className="text-[10px] text-text-secondary font-mono">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-[10px] bg-black/30 px-2 py-1 rounded border border-white/5 text-blue-300/70">
                        {user.organization_id || "N/A"}
                      </code>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}
                        />
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest ${
                            user.is_active
                              ? "text-green-500/80"
                              : "text-red-500/80"
                          }`}
                        >
                          {user.is_active ? "Online" : "Disabled"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary font-mono text-[10px]">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString("es-MX", {
                            hour12: true,
                          })
                        : "SIN REGISTRO"}
                    </td>
                    <td className="p-4 text-right">
                      <button className="bg-white/5 border border-white/10 px-3 py-1 text-[9px] uppercase font-black tracking-widest text-text-secondary hover:text-accent hover:border-accent transition-all">
                        Edit Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <p className="text-text-secondary italic text-xs uppercase tracking-widest opacity-50">
                      No se encontraron activos asociados a{" "}
                      <span className="text-accent underline decoration-dotted underline-offset-4">
                        {selectedClient?.name}
                      </span>
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
