import { Button } from '../../../../core/presentation/components/ui/Button';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { BiUpload, BiFile } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { useToastStore } from '../../../../core/presentation/stores/useToastStore';
import { trackDocumentUpload } from '../../../../core/hooks/useDocumentProcessing';

const N8N_WEBHOOK_URL = 'https://cesar.n8n-wsk.com/webhook/base-conocimientos';

interface DocumentFormProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export const DocumentRuleForm = ({
  selectedFile,
  setSelectedFile,
}: DocumentFormProps) => {
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      useToastStore.getState().addToast({
        type: 'warning',
        title: 'Archivo requerido',
        message: 'Por favor selecciona un archivo antes de subir.',
        duration: 4000,
      });
      return;
    }

    setUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('file_name', selectedFile.name);
      formData.append(
        'organization_id',
        selectedOrganization?.id || user?.organizationId || ''
      );
      formData.append('created_by', user?.id || '');

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const orgId = selectedOrganization?.id || user?.organizationId || '';

        trackDocumentUpload(selectedFile.name, orgId);

        useToastStore.getState().addToast({
          type: 'info',
          title: 'Documento enviado',
          message: `"${selectedFile.name}" se está procesando. Te notificaremos cuando esté disponible.`,
          duration: 6000,
        });

        setUploadingFile(false);
        navigate('/dashboard/rules');
      } else {
        throw new Error('Error del webhook');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadingFile(false);

      useToastStore.getState().addToast({
        type: 'error',
        title: 'Error al procesar',
        message: `No se pudo procesar "${selectedFile.name}". Intenta nuevamente.`,
        duration: 6000,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Seleccionar Archivo
        </label>
        <div className="mt-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md,.json,.yaml,.yml"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={uploadingFile}
            className="w-full px-4 py-3 bg-hover-bg border border-border-default rounded-xl text-text-main file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-primary file:text-white file:cursor-pointer file:transition-all file:duration-200 hover:file:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <p className="text-[10px] text-text-muted mt-1">
          Formatos aceptados: PDF, DOC, DOCX, TXT, MD, JSON, YAML
        </p>
      </div>

      <Button
        variant="action"
        icon={<BiUpload />}
        onClick={handleUpload}
        disabled={!selectedFile || uploadingFile}
        isLoading={uploadingFile}
        className="w-full"
      >
        SUBIR DOCUMENTO
      </Button>

      <Modal
        isOpen={uploadingFile}
        onClose={() => {}}
        title="PROCESANDO DOCUMENTO"
        dismissOnOverlay={false}
        maxWidth="sm"
        icon={<BiFile className="text-brand-accent text-xl" />}
      >
        <div className="text-center py-4">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-border-default rounded-full" />
            <div
              className="absolute inset-0 border-4 border-transparent border-t-brand-accent rounded-full animate-spin"
              style={{ animationDuration: '1.5s' }}
            />
            <div className="absolute inset-2 flex items-center justify-center">
              <BiUpload className="text-2xl text-brand-accent animate-pulse" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-text-on-elevated mb-2">
            Subiendo archivo...
          </h3>
          <p className="text-sm text-text-muted mb-4">
            <span className="font-medium text-brand-accent">
              {selectedFile?.name}
            </span>
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            Por favor espere mientras procesamos su documento. Este proceso
            puede tomar algunos minutos dependiendo del tamaño del archivo y la
            complejidad del contenido.
          </p>

          <div className="mt-6 w-full h-1 bg-hover-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-accent animate-pulse"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};