import { useEffect, useState } from 'react';
import { BiFile, BiHeadphone, BiX, BiRefresh } from 'react-icons/bi';
import { Button } from '../../../../core/presentation/components/ui/Button';

interface VapiModalProps {
  isOpen: boolean;
  type: 'transcript' | 'audio' | null;
  vapiId: string | null;
  onClose: () => void;
}

export const VapiModal = ({
  isOpen,
  type,
  vapiId,
  onClose,
}: VapiModalProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    transcript?: string;
    recordingUrl?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && vapiId) {
      // eslint-disable-next-line react-hooks/immutability
      fetchCallDetails();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, vapiId]);

  const fetchCallDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey =
        import.meta.env.VITE_VAPI_PRIVATE_KEY ||
        import.meta.env.VITE_VAPI_PUBLIC_KEY;

      if (!apiKey) {
        throw new Error('API key de Vapi no configurada');
      }

      // Intentar primero con el endpoint de calls (plural)
      let response = await fetch(`https://api.vapi.ai/calls/${vapiId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // Si no funciona, intentar con call (singular)
      if (!response.ok) {
        response = await fetch(`https://api.vapi.ai/call/${vapiId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const callData = await response.json();

      setData({
        transcript:
          callData.transcript ||
          callData.conversation?.transcript ||
          'No hay transcripción disponible para esta llamada.',
        recordingUrl: callData.recordingUrl || callData.recording?.url,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';

      // Mensaje específico para límite de retención
      if (
        errorMessage.includes('retention window') ||
        errorMessage.includes('14 days')
      ) {
        setError(
          'Esta llamada excede el período de retención de tu plan (14 días). Los registros más antiguos no están disponibles.'
        );
      } else {
        setError(`No se pudo sincronizar con Vapi: ${errorMessage}`);
      }
      console.error('Vapi fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !vapiId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                type === 'transcript'
                  ? 'bg-brand-accent/20 text-brand-accent'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {type === 'transcript' ? (
                <BiFile size={20} />
              ) : (
                <BiHeadphone size={20} />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                {type === 'transcript'
                  ? 'Transcripción de Llamada'
                  : 'Grabación de Audio'}
              </h3>
              <p className="text-[10px] text-white/40 font-mono">{vapiId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <BiX size={20} />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 min-h-75 flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-brand-accent">
              <BiRefresh size={32} className="animate-spin" />
              <p className="text-xs font-bold animate-pulse">
                SINCRONIZANDO CON VAPI CLOUD...
              </p>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-medium">{error}</p>
              <Button
                onClick={fetchCallDetails}
                variant="secondary"
                className="mt-4 text-[10px]"
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <>
              {type === 'transcript' ? (
                <div className="bg-black/40 rounded-xl p-5 h-96 overflow-y-auto border border-white/10">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">
                      Log de Conversación
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed font-mono whitespace-pre-wrap">
                    {data?.transcript}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  {data?.recordingUrl ? (
                    <div className="w-full space-y-6">
                      <div className="bg-brand-accent/5 rounded-2xl p-8 border border-brand-accent/10 flex justify-center">
                        <audio controls className="w-full max-w-md h-12">
                          <source src={data.recordingUrl} type="audio/mpeg" />
                          Tu navegador no soporta el audio.
                        </audio>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-[9px] text-brand-accent font-bold uppercase mb-1">
                            Formato
                          </p>
                          <p className="text-xs text-white">MP3 / 44.1kHz</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-[9px] text-brand-accent font-bold uppercase mb-1">
                            Almacenamiento
                          </p>
                          <p className="text-xs text-white">Vapi Cloud</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm italic">
                      La grabación está siendo procesada o no está disponible.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end items-center">
          <Button
            variant="primary"
            onClick={onClose}
            className="px-10 py-2 text-xs"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
