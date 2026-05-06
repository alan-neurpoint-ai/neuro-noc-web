import { useState, useMemo } from "react";
import BusinessRulesManager from "../components/DocTec/BusinessRulesManager";
import TemporalContextManager from "../components/DocTec/TemporalContextManager";
import DocumentVault from "../components/DocTec/DocumentVault";
import { TechnicalDocumentationRepositoryImpl } from "../../../../data/repositories/TechnicalDocumentationRepositoryImpl";
import { BusinessRuleRepositoryImpl } from "../../../../data/repositories/BusinessRuleRepositoryImpl";
import { BusinessRuleSourceRepositoryImpl } from "../../../../data/repositories/BusinessRuleSourceRepositoryImpl";
import { TechnicalDocumentationService } from "../../../../data/services/TechnicalDocumentationService";
import { BusinessRuleService } from "../../../../data/services/BusinessRuleService";
import { useSelectedClient } from "../context/SelectedClientContext";

export default function AdminDocs() {
  const { selectedClient } = useSelectedClient();

  const [activeTab, setActiveTab] = useState<
    "business" | "temporal" | "documents"
  >("business");

  const { docService, ruleService } = useMemo(() => {
    const docRepo = new TechnicalDocumentationRepositoryImpl();
    const ruleRepo = new BusinessRuleRepositoryImpl();
    const sourceRepo = new BusinessRuleSourceRepositoryImpl();
    return {
      docService: new TechnicalDocumentationService(docRepo),
      ruleService: new BusinessRuleService(ruleRepo, sourceRepo),
    };
  }, []);

  return (
    <div className="max-w-350 mx-auto animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-white/5 pb-8 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Knowledge <span className="text-accent">Base</span>
          </h1>
          <p className="text-[10px] tracking-[0.4em] text-text-secondary uppercase mt-2">
            Gestión de Inteligencia Operativa y Contexto
          </p>
        </div>

        <nav className="flex gap-2 bg-white/5 p-1 rounded-sm border border-white/5">
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
              activeTab === "documents"
                ? "bg-accent text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Document Vault
          </button>
          <button
            onClick={() => setActiveTab("business")}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
              activeTab === "business"
                ? "bg-accent text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Business Rules
          </button>
          <button
            onClick={() => setActiveTab("temporal")}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
              activeTab === "temporal"
                ? "bg-accent text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Temporal Context
          </button>
        </nav>
      </header>

      <main className="min-h-[60vh]">
        {activeTab === "documents" && (
          <DocumentVault
            docService={docService}
            ruleService={ruleService}
            organizationId={selectedClient?.id}
          />
        )}

        {activeTab === "business" && <BusinessRulesManager />}
        {activeTab === "temporal" && <TemporalContextManager />}
      </main>
    </div>
  );
}
