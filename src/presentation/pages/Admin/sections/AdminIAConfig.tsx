import { useEffect, useState, useCallback } from "react";
import { AIConfigurationService } from "../../../../data/services/AIConfigurationService";
import { AIConfigurationRepositoryImpl } from "../../../../data/repositories/AIConfigurationRepositoryImpl";
import { useSelectedClient } from "../context/SelectedClientContext";
import type { AIConfiguration } from "../../../../core/entities/supabase/AIConfiguration";
import { useUserData } from "../../../hooks/useUserData";
import AIConfigForm from "../components/AIConfig/AIConfigForm";
import AIConfigList from "../components/AIConfig/AIConfigList";

const aiService = new AIConfigurationService(
  new AIConfigurationRepositoryImpl(),
);

export default function AdminIAConfig() {
  const { selectedClient } = useSelectedClient();
  const { userData } = useUserData();
  const [configs, setConfigs] = useState<AIConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [formData, setFormData] = useState<Partial<AIConfiguration>>({
    ai_name: "",
    personality_prompt: "",
    languages: "",
    status: "active",
  });

  const fetchConfigs = useCallback(async () => {
    if (!selectedClient?.id) return;
    try {
      setIsLoading(true);
      const data = await aiService.getAllConfigurations(selectedClient.id);
      setConfigs(data);
    } catch (error) {
      console.error("NOC_ERROR [AI_FETCH]:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClient?.id]);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient?.id || !userData?.id) return;
    try {
      setIsLoading(true);
      const payload = {
        ai_name: formData.ai_name,
        personality_prompt: formData.personality_prompt,
        languages: formData.languages,
        status: "active",
        organization_id: selectedClient.id,
        updated_by: userData.id,
      };



      if (formData.id) {
        await aiService.updateConfiguration(formData.id, payload as any);
      } else {
        await aiService.createNewConfiguration({
          ...payload,
          created_by: userData.id,
        } as any);
      }
      setView("list");
      await fetchConfigs();
    } catch (error) {
      console.error("NOC_ERROR [AI_SAVE]:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (view === "form") {
    return (
      <AIConfigForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => setView("list")}
        isLoading={isLoading}
        clientName={selectedClient?.name}
      />
    );
  }

  return isLoading && configs.length === 0 ? (
    <div className="h-64 flex items-center justify-center font-mono text-[10px] uppercase text-accent animate-pulse">
      Sincronizando Core...
    </div>
  ) : (
    <AIConfigList
      configs={configs}
      onCreate={() => {
        setFormData({
          ai_name: "",
          personality_prompt: "",
          languages: "",
          status: "active",
        });
        setView("form");
      }}
      onEdit={(config) => {
        setFormData(config);
        setView("form");
      }}
    />
  );
}
