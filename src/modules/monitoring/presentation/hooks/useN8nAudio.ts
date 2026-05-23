import { useState, useCallback } from 'react';

const N8N_AUDIO_URL =
  'https://cesar.n8n-wsk.com/webhook/web_google_drive_audio_neuronoc';
const GOOGLE_DRIVE_BASE_URL = import.meta.env.VITE_GOOGLE_DRIVE_BASE_URL;

interface UseN8nAudioResult {
  loading: boolean;
  error: string | null;
  fetchAudio: (vapiExecutionId: string) => Promise<void>;
}

export function useN8nAudio(): UseN8nAudioResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAudio = useCallback(async (vapiExecutionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = `${N8N_AUDIO_URL}?vapi_execution_id=${encodeURIComponent(vapiExecutionId)}`;
      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer NeuroNoc2026',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const audioData = await response.json();

      console.log('Respuesta N8N audio:', audioData);

      // Intentar extraer la URL del audio desde distintas estructuras posibles
      let audioUrl: string | null | undefined;

      if (Array.isArray(audioData) && audioData.length > 0) {
        // Formato: [{ audio: { url, name, mimeType } }]
        audioUrl = audioData[0]?.audio?.url;
      } else if (audioData?.audio?.url) {
        // Formato: { audio: { url, name, mimeType } }
        audioUrl = audioData.audio.url;
      } else if (typeof audioData?.url === 'string') {
        // Formato: { url: "..." }
        audioUrl = audioData.url;
      } else if (typeof audioData === 'string') {
        // La respuesta es directamente un string (URL)
        audioUrl = audioData;
      }

      if (!audioUrl) {
        console.error('Estructura inesperada:', JSON.stringify(audioData, null, 2));
        throw new Error('No se encontró la URL del audio en la respuesta');
      }

      // Intentar extraer el ID del archivo de Google Drive desde la URL
      const urlParts = audioUrl.split('id=');
      const audioId = urlParts[1] ? urlParts[1].split('&')[0] : null;

      let openUrl: string;

      if (audioId) {
        // Construir URL de vista de Google Drive
        const baseUrl = (GOOGLE_DRIVE_BASE_URL || 'https://drive.google.com/file/d').replace(/\/$/, '');
        openUrl = `${baseUrl}/${audioId}/view`;
      } else {
        // Si no se pudo extraer el ID, usar la URL original directamente
        openUrl = audioUrl;
      }

      window.open(openUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar el audio';
      setError(message);
      console.error('Error al obtener audio:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchAudio,
  };
}
