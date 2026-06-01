import { useState } from 'react';
import { Input } from '../../../../core/presentation/components/ui/Input';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Modal } from '../../../../core/presentation/components/ui/Modal';
import { BiSave, BiCheckCircle } from 'react-icons/bi';

interface ManualFormProps {
  formData: {
    name: string;
    description: string;
    execution_schedule: string;
    affected_targets: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      execution_schedule: string;
      affected_targets: string;
    }>
  >;
  saving: boolean;
  onSave: () => void;
}

export const ManualForm = ({
  formData,
  setFormData,
  saving,
  onSave,
}: ManualFormProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const formatTargetsPreview = (text: string): string => {
    if (!text.trim()) return '';
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object') {
        return Object.entries(parsed as Record<string, unknown>)
          .map(([key, val]) => {
            if (Array.isArray(val)) {
              return `${key}: ${(val as string[]).join(', ')}`;
            }
            return `${key}: ${String(val)}`;
          })
          .join(', ');
      }
      return String(parsed);
    } catch {
      return text.length > 50 ? `${text.substring(0, 50)}...` : text;
    }
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    onSave();
  };

  return (
    <>
      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Nombre de la Regla *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Validar horario de mantenimiento, Verificar estado de nodos..."
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe los detalles de esta regla de negocio..."
          className="mt-2 w-full h-32 px-4 py-3 bg-hover-bg border border-border-default rounded-xl text-text-main placeholder:text-text-muted focus:border-brand-primary/50 focus:outline-none resize-none font-body text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Programación de Ejecución
        </label>
        <input
          type="datetime-local"
          value={formData.execution_schedule}
          onChange={(e) =>
            setFormData({ ...formData, execution_schedule: e.target.value })
          }
          className="mt-2 w-full px-4 py-2.5 bg-hover-bg border border-border-default rounded-xl text-text-main focus:border-brand-primary/50 focus:outline-none"
          style={{ colorScheme: 'dark' }}
        />
        <p className="text-[10px] text-text-muted mt-1">
          Define cuándo se ejecuta esta regla automáticamente
        </p>
      </div>

      <div>
        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Objetivos Afectados
        </label>
        <textarea
          value={formData.affected_targets}
          onChange={(e) =>
            setFormData({ ...formData, affected_targets: e.target.value })
          }
          placeholder="Ej: nodes: server1, server2, server3&#10;services: api, database, cache"
          className="mt-2 w-full h-28 px-4 py-3 bg-hover-bg border border-border-default rounded-xl text-text-main placeholder:text-text-muted focus:border-brand-primary/50 focus:outline-none resize-none text-sm"
        />
        <p className="text-[10px] text-text-muted mt-1">
          Escribe los objetivos en formato natural. Ej: "nodes: server1, server2" o "services: api, db"
        </p>
      </div>

      <Button
        variant="primary"
        icon={<BiSave />}
        onClick={handleSaveClick}
        isLoading={saving}
        className="w-full"
      >
        GUARDAR REGLA
      </Button>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="CONFIRMAR ACCIÓN"
        maxWidth="sm"
        icon={<BiCheckCircle className="text-brand-accent text-xl" />}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <BiCheckCircle className="text-3xl text-brand-accent" />
          </div>

          <h3 className="text-lg font-bold text-text-on-elevated mb-2">
            ¿Crear esta regla de negocio?
          </h3>

          <div className="text-left bg-hover-bg rounded-lg p-4 mb-4 text-sm space-y-2">
            <p className="text-text-muted">
              <span className="text-text-muted">Nombre:</span>{' '}
               <span className="text-text-on-elevated font-medium">
                  {formData.name || 'Sin nombre'}
              </span>
            </p>
            {formData.description && (
              <p className="text-text-muted">
                <span className="text-text-muted">Descripción:</span>{' '}
                 <span className="text-text-on-elevated">
                  {formData.description.substring(0, 50)}...
                </span>
              </p>
            )}
            {formData.affected_targets && (
              <p className="text-text-muted">
                <span className="text-text-muted">Objetivos:</span>{' '}
                <span className="text-text-on-elevated text-xs">
                  {formatTargetsPreview(formData.affected_targets)}
                </span>
              </p>
            )}
          </div>

          <p className="text-xs text-text-muted mb-6">
            Esta acción creará la regla en la base de datos.
          </p>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              CANCELAR
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmSave}
              isLoading={saving}
            >
              CONFIRMAR
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
