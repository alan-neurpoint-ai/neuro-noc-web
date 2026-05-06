import { useState } from "react";
import { useSelectedClient } from "../../../context/SelectedClientContext";
import { useUserData } from "../../../../../hooks/useUserData";

const N8N_WEBHOOK_URL = "https://cesar.n8n-wsk.com/webhook/base-conocimientos";

export default function TechDocUpload() {
  const { selectedClient } = useSelectedClient();
  const { userData } = useUserData();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !selectedClient?.id || !userData?.id) {
      console.warn(
        "NOC_WARN: Faltan dependencias de contexto (Client/User/File)",
      );
      return;
    }

    try {
      setIsProcessing(true);

      const queryParams = new URLSearchParams({
        organization_id: selectedClient.id,
        user_id: userData.id,
        filename: file.name,
        action: "extract_business_rules",
      }).toString();

      const formData = new FormData();
      formData.append("pdfd", file);
      fetch(`${N8N_WEBHOOK_URL}?${queryParams}`, {
        method: "POST",
        body: formData,
      }).catch((err) => {
        console.error("NOC_ASYNC_ERROR:", err);
      });

      alert(
        "Documento enviado con éxito. El motor de IA está procesando las reglas en segundo plano; esto puede tomar un momento dependiendo del tamaño del archivo.",
      );
    } catch (error) {
      console.error("NOC_ERROR [TECH_DOC_UPLOAD_FAILED]:", error);
      alert(
        "Error crítico al intentar conectar con el motor de procesamiento.",
      );
    } finally {
      setIsProcessing(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-6">
        <h4 className="text-[10px] text-accent uppercase font-black tracking-[0.3em]">
          Knowledge Extraction Engine
        </h4>
        <p className="text-[9px] text-text-secondary/60 font-mono mt-1">
          STATUS: {isProcessing ? "PROCESSING_QUEUE" : "IDLE"}
        </p>
      </header>

      <div
        className={`border border-dashed transition-all duration-500 rounded-sm p-16 text-center group ${
          isProcessing
            ? "border-accent animate-pulse bg-accent/5"
            : "border-white/10 hover:border-accent/40 bg-white/1"
        }`}
      >
        <input
          type="file"
          className="hidden"
          id="doc-upload-field"
          onChange={handleFileChange}
          disabled={isProcessing}
          accept=".pdf,.docx,.txt"
        />

        <label
          htmlFor="doc-upload-field"
          className={`block ${isProcessing ? "cursor-wait" : "cursor-pointer"}`}
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {isProcessing ? "⏳" : "📂"}
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary group-hover:text-accent font-bold transition-colors">
            {isProcessing
              ? "Paquete enviado. Procesando..."
              : "Seleccionar Documentación Técnica"}
          </p>
        </label>
      </div>

      <footer className="mt-4 p-4 bg-white/2 border border-white/5 rounded-sm">
        <p className="text-[9px] text-text-secondary italic leading-relaxed">
          <span className="text-accent font-bold">OPTIMIZACIÓN:</span> El
          archivo se sube a n8n y la extracción ocurre de forma asíncrona para
          no bloquear su sesión.
        </p>
      </footer>
    </div>
  );
}
