import { useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { useAuthStore } from '../../modules/auth/presentation/stores/useAuthStore';
import { useToastStore } from '../presentation/stores/useToastStore';

interface PendingDocument {
  fileName: string;
  orgId: string;
  uploadedAt: string;
  pollIntervalId: ReturnType<typeof setInterval>;
  timeoutId: ReturnType<typeof setTimeout>;
  notified: boolean;
}

const POLL_INTERVAL_MS = 3000;
const PROCESSING_TIMEOUT_MS = 2 * 60 * 1000;

const pendingDocuments: PendingDocument[] = [];

async function checkForNewRules(pending: PendingDocument) {
  if (pending.notified) return;

  try {
    const { data, error } = await supabase
      .from('business_rule')
      .select('id, name, created_at')
      .eq('organization_id', pending.orgId)
      .gte('created_at', pending.uploadedAt)
      .is('deleted_at', null);

    if (error) {
      console.error('Error polling business rules:', error);
      return;
    }

    if (data && data.length > 0) {
      pending.notified = true;
      clearInterval(pending.pollIntervalId);
      clearTimeout(pending.timeoutId);

      const idx = pendingDocuments.indexOf(pending);
      if (idx >= 0) pendingDocuments.splice(idx, 1);

      const ruleNames = data.map((r: { name: string }) => r.name).slice(0, 3).join(', ');
      const moreCount = data.length > 3 ? ` y ${data.length - 3} más` : '';
      const plural = data.length > 1 ? 's' : '';

      useToastStore.getState().addToast({
        type: 'success',
        title: `Documento procesado`,
        message: `"${pending.fileName}" generó ${data.length} regla${plural}: ${ruleNames}${moreCount}`,
        duration: 8000,
      });
    }
  } catch (err) {
    console.error('Error checking for new rules:', err);
  }
}

export function trackDocumentUpload(fileName: string, orgId: string) {
  const uploadedAt = new Date(Date.now() - 2000).toISOString();

  const pollIntervalId = setInterval(() => {
    const pending = pendingDocuments.find((d) => d.fileName === fileName && d.orgId === orgId);
    if (pending && !pending.notified) {
      checkForNewRules(pending);
    }
  }, POLL_INTERVAL_MS);

  const timeoutId = setTimeout(() => {
    const idx = pendingDocuments.findIndex((d) => d.fileName === fileName && d.orgId === orgId);
    if (idx >= 0) {
      const pending = pendingDocuments[idx];
      if (!pending.notified) {
        clearInterval(pending.pollIntervalId);
        pendingDocuments.splice(idx, 1);
        useToastStore.getState().addToast({
          type: 'warning',
          title: 'Procesamiento demorado',
          message: `El documento "${fileName}" está tomando más tiempo del esperado. Verifica el estado más tarde.`,
          duration: 8000,
        });
      }
    }
  }, PROCESSING_TIMEOUT_MS);

  pendingDocuments.push({
    fileName,
    orgId,
    uploadedAt,
    pollIntervalId,
    timeoutId,
    notified: false,
  });

  setTimeout(() => {
    const pending = pendingDocuments.find((d) => d.fileName === fileName && d.orgId === orgId);
    if (pending && !pending.notified) {
      checkForNewRules(pending);
    }
  }, 1000);
}

export function useDocumentProcessing() {
  const user = useAuthStore((s) => s.user);
  const selectedOrganization = useAuthStore((s) => s.selectedOrganization);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const orgId = selectedOrganization?.id || user?.organizationId;
    if (!orgId) return;

    cleanupRef.current = () => {
      pendingDocuments.forEach((d) => {
        if (d.orgId === orgId && !d.notified) {
          clearInterval(d.pollIntervalId);
          clearTimeout(d.timeoutId);
        }
      });
      for (let i = pendingDocuments.length - 1; i >= 0; i--) {
        if (pendingDocuments[i].orgId === orgId) {
          pendingDocuments.splice(i, 1);
        }
      }
    };

    return () => {
      cleanupRef.current?.();
    };
  }, [selectedOrganization?.id, user?.organizationId]);

  return { trackUpload: trackDocumentUpload };
}