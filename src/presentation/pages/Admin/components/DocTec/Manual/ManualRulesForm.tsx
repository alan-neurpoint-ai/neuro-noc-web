import { useState } from "react";
import { Button } from "../../../../../components/ui";
import { useSelectedClient } from "../../../context/SelectedClientContext";
import { useUserData } from "../../../../../hooks/useUserData";
import { BusinessRuleRepositoryImpl } from "../../../../../../data/repositories/BusinessRuleRepositoryImpl";
import { BusinessRuleService } from "../../../../../../data/services/BusinessRuleService";

const ruleService = new BusinessRuleService(new BusinessRuleRepositoryImpl());

export default function ManualRulesForm() {
  const { selectedClient } = useSelectedClient();
  const { userData } = useUserData();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    affected_targets: "",
    execution_schedule: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient?.id || !userData?.id) return;

    try {
      setIsLoading(true);

      let parsedTargets;
      try {
        parsedTargets = formData.affected_targets
          ? JSON.parse(formData.affected_targets)
          : null;
      } catch {
        parsedTargets = { raw_target: formData.affected_targets };
      }

      await ruleService.defineRule({
        name: formData.name,
        description: formData.description,
        affected_targets: parsedTargets,
        execution_schedule: formData.execution_schedule || null,
        status: "active",
        organization_id: selectedClient.id,
        created_by: userData.id,
        updated_by: userData.id,
      } as any);

      setFormData({
        name: "",
        description: "",
        affected_targets: "",
        execution_schedule: "",
      });
      alert("Regla atómica desplegada con éxito.");
    } catch (error) {
      console.error("NOC_ERROR [RULE_MANUAL_SAVE]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-4 duration-500"
    >
      <h4 className="text-[10px] text-accent uppercase font-black mb-6 tracking-[0.3em]">
        Nueva Regla Atómica
      </h4>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
            Nombre de la Regla
          </label>
          <input
            className="w-full bg-background border border-white/10 p-3 text-sm focus:border-accent outline-none text-text-primary rounded-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Priorización de Tráfico VoIP"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
              Affected Targets (Nodos/Tags)
            </label>
            <input
              className="w-full bg-background border border-white/10 p-3 text-[11px] font-mono focus:border-accent outline-none text-text-primary rounded-sm"
              value={formData.affected_targets}
              onChange={(e) =>
                setFormData({ ...formData, affected_targets: e.target.value })
              }
              placeholder='{"node": "TX-DAL-01"}'
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
              Execution Schedule (Fecha/Hora)
            </label>
            <input
              type="datetime-local"
              className="w-full bg-background border border-white/10 p-3 text-[11px] font-mono focus:border-accent outline-none text-text-primary rounded-sm appearance-none"
              style={{ colorScheme: "dark" }}
              value={formData.execution_schedule}
              onChange={(e) =>
                setFormData({ ...formData, execution_schedule: e.target.value })
              }
            />
            <p className="text-[8px] text-text-secondary/40 font-mono italic">
              ISO_8601_FORMAT:{" "}
              {formData.execution_schedule || "YYYY-MM-DDTHH:MM"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
            Descripción Operativa
          </label>
          <textarea
            className="w-full bg-background border border-white/10 p-3 text-sm h-32 focus:border-accent outline-none text-text-secondary italic rounded-sm resize-none"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describa la lógica técnica de esta regla..."
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="success"
          type="submit"
          disabled={isLoading}
          className="w-full md:w-64 h-12 uppercase tracking-[0.2em] text-[10px] font-black"
        >
          {isLoading ? "Sincronizando..." : "Registrar Regla"}
        </Button>
      </div>
    </form>
  );
}
