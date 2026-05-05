import { useEffect, useState } from "react";
import { HiDocumentText, HiVolumeUp, HiX, HiRefresh } from "react-icons/hi";
import { Button } from "../../../../components/ui";

interface VapiModalsProps {
  isOpen: boolean;
  type: "transcript" | "audio" | null;
  vapiId: string | null;
  onClose: () => void;
}

export const VapiModals = ({
  isOpen,
  type,
  vapiId,
  onClose,
}: VapiModalsProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    transcript?: string;
    recordingUrl?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && vapiId) {
      fetchCallDetails();
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, vapiId]);

  const fetchCallDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.vapi.ai/call/${vapiId}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_VAPI_PUBLIC_KEY}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener datos de Vapi");

      const callData = await response.json();

      setData({
        transcript:
          callData.transcript ||
          "No hay transcripción disponible para esta llamada.",
        recordingUrl: callData.recordingUrl,
      });
    } catch (err) {
      setError(
        "No se pudo sincronizar con Vapi. Verifique la conexión o el ID de llamada.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !vapiId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-surface border border-muted/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-muted/20 bg-muted/5">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${type === "transcript" ? "bg-accent/20 text-accent" : "bg-blue-500/20 text-blue-400"}`}
            >
              {type === "transcript" ? (
                <HiDocumentText size={20} />
              ) : (
                <HiVolumeUp size={20} />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">
                {type === "transcript"
                  ? "Transcripción Operativa"
                  : "Registro de Audio"}
              </h3>
              <p className="text-[10px] text-text-muted font-mono">{vapiId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 min-h-75 flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-accent">
              <HiRefresh size={32} className="animate-spin" />
              <p className="text-xs font-bold animate-pulse">
                SINCRONIZANDO CON VAPI CLOUD...
              </p>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-medium">{error}</p>
              <Button
                onClick={fetchCallDetails}
                variant="exit"
                className="mt-4 text-[10px]"
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <>
              {type === "transcript" ? (
                <div className="bg-black/40 rounded-xl p-5 h-96 overflow-y-auto border border-muted/10 custom-scrollbar">
                  <div className="flex items-center gap-2 mb-4 border-b border-muted/10 pb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">
                      Log de Conversación
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed font-mono whitespace-pre-wrap">
                    {data?.transcript}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  {data?.recordingUrl ? (
                    <div className="w-full space-y-6">
                      <div className="bg-accent/5 rounded-2xl p-8 border border-accent/10 flex justify-center">
                        <audio
                          controls
                          className="w-full max-w-md h-12 shadow-lg"
                        >
                          <source src={data.recordingUrl} type="audio/mpeg" />
                          Tu navegador no soporta el audio.
                        </audio>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/5 rounded-lg border border-muted/10">
                          <p className="text-[9px] text-accent font-bold uppercase mb-1">
                            Formato
                          </p>
                          <p className="text-xs text-text-primary">
                            MP3 / 44.1kHz
                          </p>
                        </div>
                        <div className="p-3 bg-muted/5 rounded-lg border border-muted/10">
                          <p className="text-[9px] text-accent font-bold uppercase mb-1">
                            Almacenamiento
                          </p>
                          <p className="text-xs text-text-primary">
                            Vapi Cloud
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm italic">
                      La grabación está siendo procesada o no está disponible.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/5 border-t border-muted/20 flex justify-between items-center">
          <span className="text-[9px] text-text-muted font-mono ml-2">
            VAPI_RECORDING_SYSTEM_v3
          </span>
          <Button
            variant="exit"
            onClick={onClose}
            className="px-10 py-2 text-xs"
          >
            Cerrar Terminal
          </Button>
        </div>
      </div>
    </div>
  );
};
