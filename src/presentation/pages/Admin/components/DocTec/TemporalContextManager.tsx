import { useEffect, useState, useCallback } from "react";
import { TemporalContextService } from "../../../../../data/services/TemporalContextService";
import { TemporalContextRepositoryImpl } from "../../../../../data/repositories/TemporalContextRepositoryImpl";
import { useSelectedClient } from "../../context/SelectedClientContext";
import { useUserData } from "../../../../hooks/useUserData";
import type { TemporalContext } from "../../../../../core/entities/supabase/TemporalContext";
import { Button } from "../../../../components/ui";

const temporalService = new TemporalContextService(
  new TemporalContextRepositoryImpl(),
);

export default function TemporalContextManager() {
  const { selectedClient } = useSelectedClient();
  const { userData } = useUserData();

  const [contexts, setContexts] = useState<TemporalContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<TemporalContext>>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  const fetchContexts = useCallback(async () => {
    if (!selectedClient?.id) return;
    try {
      setIsLoading(true);
      const data = await temporalService.getAllByOrganization(
        selectedClient.id,
      );
      setContexts(data);
    } catch (error) {
      console.error("NOC_ERROR [TEMPORAL_FETCH]:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClient?.id]);

  useEffect(() => {
    fetchContexts();
  }, [fetchContexts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient?.id || !userData?.id) return;

    try {
      setIsLoading(true);
      await temporalService.createTemporalContext({
        ...formData,
        organization_id: selectedClient.id,
        created_by: userData.id,
      } as any);

      setIsAdding(false);
      setFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "active",
      });
      await fetchContexts();
    } catch (error) {
      console.error("NOC_ERROR [TEMPORAL_SAVE]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (
      !userData?.id ||
      !window.confirm("¿Confirmar cancelación de contexto temporal?")
    )
      return;
    try {
      await temporalService.archiveContext(
        id,
        userData.id,
        "Cancelado por operador",
      );
      await fetchContexts();
    } catch (error) {
      console.error("NOC_ERROR [TEMPORAL_ARCHIVE]:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white/2 border border-white/5 p-4 rounded-sm">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black tracking-[0.3em] text-accent uppercase">
            Temporal Nodes
          </span>
          <span className="text-[9px] font-mono text-white/20">
            || COUNT: {contexts.length}
          </span>
        </div>
        {!isAdding && (
          <Button
            variant="login"
            onClick={() => setIsAdding(true)}
            className="h-9 px-6 text-[9px]"
          >
            Nuevo Contexto
          </Button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="glass-card p-8 border-l-2 border-accent animate-in zoom-in-95 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                Identificador de Evento
              </label>
              <input
                className="w-full bg-background border border-white/10 p-3 text-sm focus:border-accent outline-none text-text-primary"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ej: Mantenimiento de Fibra Nivel 3"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                  Inicio
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-background border border-white/10 p-3 text-[11px] font-mono focus:border-accent outline-none text-text-primary"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                  Fin (ETR)
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-background border border-white/10 p-3 text-[11px] font-mono focus:border-accent outline-none text-text-primary"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
              Descripción de Impacto
            </label>
            <textarea
              className="w-full bg-background border border-white/10 p-4 text-sm h-24 resize-none focus:border-accent outline-none text-text-secondary italic"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="cancel"
              type="button"
              onClick={() => setIsAdding(false)}
            >
              Abortar
            </Button>
            <Button variant="success" type="submit" disabled={isLoading}>
              Desplegar Contexto
            </Button>
          </div>
        </form>
      )}

      {/* LISTADO TÉCNICO */}
      <div className="grid grid-cols-1 gap-4">
        {contexts.length > 0
          ? contexts.map((ctx) => (
              <div
                key={ctx.id}
                className="border border-white/5 bg-white/1 p-6 flex flex-col md:flex-row justify-between gap-6 group hover:border-accent/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${ctx.status === "active" ? "bg-success animate-pulse" : "bg-text-secondary/30"}`}
                    />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary">
                      {ctx.name}
                    </h4>
                    <span className="text-[9px] font-mono text-white/10 uppercase tracking-tighter">
                      [{ctx.id.slice(0, 8)}]
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary italic line-clamp-2 max-w-2xl mb-4">
                    {ctx.description ||
                      "Sin descripción de contexto proporcionada."}
                  </p>
                  <div className="flex gap-8">
                    <div>
                      <label className="text-[8px] font-black uppercase text-accent/40 block mb-1">
                        Start_Window
                      </label>
                      <span className="text-[10px] font-mono">
                        {new Date(ctx.start_date).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <label className="text-[8px] font-black uppercase text-accent/40 block mb-1">
                        Exp_Closure
                      </label>
                      <span className="text-[10px] font-mono">
                        {new Date(ctx.end_date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {ctx.status === "active" && (
                    <Button
                      variant="cancel"
                      onClick={() => handleArchive(ctx.id)}
                      className="opacity-0 group-hover:opacity-100 h-8 px-4 text-[9px]"
                    >
                      Terminar
                    </Button>
                  )}
                </div>
              </div>
            ))
          : !isAdding && (
              <div className="h-32 border border-dashed border-white/5 flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-[0.5em] text-white/10 italic">
                  Zero Temporal Conflicts Detected
                </span>
              </div>
            )}
      </div>
    </div>
  );
}
