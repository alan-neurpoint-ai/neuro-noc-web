import { useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useAuthStore } from '../../modules/auth/presentation/stores/useAuthStore';
import { useToastStore } from '../presentation/stores/useToastStore';

interface PendingDocument {
  fileName: string;
  orgId: string;
  timestamp: number;
  timeoutId: ReturnType<typeof setTimeout>;
}

const PROCESSING_TIMEOUT_MS = 5 * 60 * 1000;

const pendingDocuments: PendingDocument[] = [];

export function trackDocumentUpload(fileName: string, orgId: string) {
  const timeoutId = setTimeout(() => {
    const idx = pendingDocuments.findIndex((d) => d.fileName === fileName && d.orgId === orgId);
    if (idx >= 0) {
      pendingDocuments.splice(idx, 1);
      useToastStore.getState().addToast({
        type: 'warning',
        title: 'Procesamiento demorado',
        message: `El documento "${fileName}" está tomando más tiempo del esperado. Verifica el estado más tarde.`,
        duration: 8000,
      });
    }
  }, PROCESSING_TIMEOUT_MS);

  pendingDocuments.push({ fileName, orgId, timestamp: Date.now(), timeoutId });
}

function removePendingDocument(fileName: string, orgId: string) {
  const idx = pendingDocuments.findIndex((d) => d.fileName === fileName && d.orgId === orgId);
  if (idx >= 0) {
    clearTimeout(pendingDocuments[idx].timeoutId);
    pendingDocuments.splice(idx, 1);
  }
}

export function useDocumentProcessing() {
  const user = useAuthStore((s) => s.user);
  const selectedOrganization = useAuthStore((s) => s.selectedOrganization);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const orgId = selectedOrganization?.id || user?.organizationId;
    if (!orgId) return;

    const channel = supabase
      .channel('business-rule-processing')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'business_rule',
          filter: `organization_id=eq.${orgId}`,
        },
        (payload) => {
          const pendingDoc = pendingDocuments.find((d) => d.orgId === orgId);
          if (!pendingDoc) return;

          const newRule = payload.new as { name?: string };
          removePendingDocument(pendingDoc.fileName, pendingDoc.orgId);

          useToastStore.getState().addToast({
            type: 'success',
            title: 'Documento procesado',
            message: `El documento "${pendingDoc.fileName}" ya está disponible como regla: ${newRule.name || 'Nueva regla'}`,
            duration: 8000,
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [selectedOrganization?.id, user?.organizationId, user?.id]);

  return { trackUpload: trackDocumentUpload };
}