import { useState } from "react";
import ManualRulesForm from "./Manual/ManualRulesForm";
import TechDocUpload from "./n8n/TechDocUpload";

export default function BusinessRulesManager() {
  const [uploadMode, setUploadMode] = useState<"manual" | "doc">("manual");

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          onClick={() => setUploadMode("manual")}
          className={`glass-card p-8 border-t-2 cursor-pointer transition-all ${
            uploadMode === "manual"
              ? "border-accent bg-white/3"
              : "border-white/5 opacity-50"
          }`}
        >
          <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-text-primary">
            Entrada Directa
          </h3>
          <p className="text-[11px] text-text-secondary font-mono italic">
            Persistencia inmediata en el núcleo de reglas.
          </p>
        </div>

        <div
          onClick={() => setUploadMode("doc")}
          className={`glass-card p-8 border-t-2 cursor-pointer transition-all ${
            uploadMode === "doc"
              ? "border-accent bg-white/3"
              : "border-white/5 opacity-50"
          }`}
        >
          <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-text-primary">
            Procesamiento IA
          </h3>
          <p className="text-[11px] text-text-secondary font-mono italic">
            Extracción de reglas vía n8n desde archivos técnicos.
          </p>
        </div>
      </section>

      <div className="pt-10 border-t border-white/5">
        {uploadMode === "manual" ? <ManualRulesForm /> : <TechDocUpload />}
      </div>
    </div>
  );
}
