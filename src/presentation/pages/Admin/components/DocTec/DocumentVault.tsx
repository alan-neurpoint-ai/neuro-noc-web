import { useEffect, useState } from "react";
import type { TechnicalDocumentationService } from "../../../../../data/services/TechnicalDocumentationService";
import type { BusinessRuleService } from "../../../../../data/services/BusinessRuleService";
import type { TechnicalDocumentation } from "../../../../../core/entities/supabase/TechnicalDocumentation";
import type { BusinessRule } from "../../../../../core/entities/supabase/BusinessRule";

interface Props {
  docService: TechnicalDocumentationService;
  ruleService: BusinessRuleService;
  organizationId?: string;
}

export default function DocumentVault({
  docService,
  ruleService,
  organizationId,
}: Props) {
  const [docs, setDocs] = useState<TechnicalDocumentation[]>([]);
  const [selectedRules, setSelectedRules] = useState<BusinessRule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingRules, setLoadingRules] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await docService.getAllByOrganization(organizationId);
      setDocs(data);
      setLoading(false);
    })();
  }, [docService, organizationId]);

  const handleDocClick = async (docId: string) => {
    setSelectedId(docId);
    setExpandedRuleId(null);
    setLoadingRules(true);
    try {
      const rules = await ruleService.getRulesByDocumentation(docId);
      setSelectedRules(rules);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRules(false);
    }
  };

  if (loading)
    return (
      <div className="text-accent italic p-6">Cargando documentación...</div>
    );

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Lista de Documentos */}
      <div className="col-span-4 border-r border-white/5 pr-6">
        <h2 className="text-[10px] uppercase tracking-widest text-text-secondary mb-6">
          Vault Index
        </h2>
        <div className="space-y-2">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleDocClick(doc.id)}
              className={`w-full text-left p-3 text-xs transition-all border ${
                selectedId === doc.id
                  ? "bg-accent/10 border-accent text-accent"
                  : "border-white/5 hover:border-white/20 text-text-secondary"
              }`}
            >
              {doc.name}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-8">
        <h2 className="text-[10px] uppercase tracking-widest text-text-secondary mb-6">
          Linked Business Rules Intelligence
        </h2>
        {selectedId ? (
          loadingRules ? (
            <div className="animate-pulse text-accent text-xs">
              Consultando relaciones...
            </div>
          ) : (
            <div className="space-y-4">
              {selectedRules.length > 0 ? (
                selectedRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="border border-white/5 rounded-sm overflow-hidden bg-white/1"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/3 transition-colors"
                      onClick={() =>
                        setExpandedRuleId(
                          expandedRuleId === rule.id ? null : rule.id,
                        )
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-xs uppercase tracking-tighter">
                          {rule.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[8px] uppercase font-bold ${
                            rule.status === "active"
                              ? "bg-accent/20 text-accent"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {rule.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-secondary italic">
                        {expandedRuleId === rule.id
                          ? "[ HIDE DETAILS ]"
                          : "[ VIEW FULL INFO ]"}
                      </div>
                    </div>

                    {expandedRuleId === rule.id && (
                      <div className="p-4 border-t border-white/5 bg-black/20 grid grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                          <div>
                            <p className="text-[9px] uppercase text-accent mb-1 font-bold">
                              Description
                            </p>
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {rule.description || "No description provided."}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase text-accent mb-1 font-bold">
                              Affected Targets
                            </p>
                            <pre className="text-[10px] bg-black/40 p-2 rounded border border-white/5 overflow-x-auto text-blue-300">
                              {JSON.stringify(rule.affected_targets, null, 2) ||
                                "None"}
                            </pre>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <span className="text-text-secondary uppercase">
                              Schedule:
                            </span>
                            <span className="text-text-primary italic">
                              {rule.execution_schedule || "N/A"}
                            </span>

                            <span className="text-text-secondary uppercase">
                              Created By:
                            </span>
                            <span className="text-text-primary">
                              {rule.created_by || "System"}
                            </span>

                            <span className="text-text-secondary uppercase">
                              Last Update:
                            </span>
                            <span className="text-text-primary">
                              {new Date(rule.updated_at).toLocaleDateString()}
                            </span>

                            <span className="text-text-secondary uppercase">
                              Org ID:
                            </span>
                            <span className="text-text-primary font-mono">
                              {rule.organization_id}
                            </span>
                          </div>

                          <div className="pt-4 border-t border-white/5">
                            <p className="text-[8px] text-text-secondary uppercase">
                              Internal ID: {rule.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-text-secondary italic text-xs border border-dashed border-white/5">
                  Sin reglas vinculadas a este documento.
                </div>
              )}
            </div>
          )
        ) : (
          <div className="h-40 flex items-center justify-center border border-dashed border-white/10 text-text-secondary text-[10px] uppercase">
            Selecciona un documento para ver su impacto
          </div>
        )}
      </div>
    </div>
  );
}
