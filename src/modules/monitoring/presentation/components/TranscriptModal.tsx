import { useEffect, useState } from 'react';
import { BiFile, BiX, BiRefresh } from 'react-icons/bi';
import { Button } from '../../../../core/presentation/components/ui/Button';

interface TranscriptModalProps {
  isOpen: boolean;
  vapiId: string | null;
  onClose: () => void;
}

export const TranscriptModal = ({
  isOpen,
  vapiId,
  onClose,
}: TranscriptModalProps) => {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const N8N_TRANSCRIPT_URL =
    'https://cesar.n8n-wsk.com/webhook/web_google_drive_neuro_noc_transcripcion';

  const fetchTranscript = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${N8N_TRANSCRIPT_URL}?vapi_execution_id=${encodeURIComponent(vapiId!)}`;
      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer NeuroNoc2026',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      let text = 'No hay transcripción disponible.';

      if (contentType?.includes('application/json')) {
        const jsonData = await response.json();

        // La respuesta de N8N viene en: { texto: { transcripcion_limpia: "..." } }
        text =
          jsonData.texto?.transcripcion_limpia ||
          jsonData.transcript ||
          jsonData.text ||
          jsonData.content ||
          jsonData.data ||
          JSON.stringify(jsonData, null, 2);
      } else {
        text = await response.text();
      }

      setTranscript(text);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';

      // Si el JSON viene vacío o no hay datos, mostrar mensaje amigable
      if (
        errorMessage.includes('Unexpected end of JSON input') ||
        errorMessage.includes('JSON') ||
        errorMessage.includes('Failed to parse')
      ) {
        setError('No existe transcripción para esta llamada. Consulte con soporte técnico.');
      } else {
        setError(`No se pudo obtener la transcripción: ${errorMessage}`);
      }

      console.error('fetch transcript error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vapiId) {
      // eslint-disable-next-line react-hooks/immutability
      fetchTranscript();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTranscript(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, vapiId]);

  if (!isOpen || !vapiId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-accent/20 text-brand-accent">
              <BiFile size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                Transcripción de Llamada
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
                OBTENIENDO TRANSCRIPCIÓN...
              </p>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-medium">{error}</p>
              <Button
                onClick={fetchTranscript}
                variant="secondary"
                className="mt-4 text-[10px]"
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="bg-black/40 rounded-xl p-5 h-96 overflow-y-auto border border-white/10">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase">
                  Log de Conversación
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed font-mono whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
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
