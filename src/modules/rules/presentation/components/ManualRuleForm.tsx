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

  const convertToJson = (text: string): string => {
    if (!text.trim()) return '';

    try {
      JSON.parse(text);
      return text;
    } catch {
      const items = text
        .split(/[,;\n]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      if (text.includes(':')) {
        const obj: Record<string, string[]> = {};
        text.split(/[,;\n]+/).forEach((pair) => {
          const [key, ...values] = pair.split(':');
          if (key && values.length > 0) {
            obj[key.trim()] = values.map((v) => v.trim()).filter((v) => v);
          }
        });
        return JSON.stringify(obj, null, 2);
      }

      return JSON.stringify({ targets: items }, null, 2);
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
        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
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
        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe los detalles de esta regla de negocio..."
          className="mt-2 w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-primary/50 focus:outline-none resize-none font-body text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
          Programación de Ejecución
        </label>
        <input
          type="datetime-local"
          value={formData.execution_schedule}
          onChange={(e) =>
            setFormData({ ...formData, execution_schedule: e.target.value })
          }
          className="mt-2 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-brand-primary/50 focus:outline-none"
          style={{ colorScheme: 'dark' }}
        />
        <p className="text-[10px] text-white/30 mt-1">
          Define cuándo se ejecuta esta regla automáticamente
        </p>
      </div>

      <div>
        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
          Objetivos Afectados
        </label>
        <textarea
          value={formData.affected_targets}
          onChange={(e) =>
            setFormData({ ...formData, affected_targets: e.target.value })
          }
          placeholder="Ej: nodes: server1, server2, server3 o services: api, database, cache"
          className="mt-2 w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-brand-primary/50 focus:outline-none resize-none font-mono text-sm"
        />
        <p className="text-[10px] text-white/30 mt-1">
          Escribe los objetivos de forma natural. Se convertirán a JSON
          automáticamente.
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

          <h3 className="text-lg font-bold text-white mb-2">
            ¿Crear esta regla de negocio?
          </h3>

          <div className="text-left bg-white/5 rounded-lg p-4 mb-4 text-sm space-y-2">
            <p className="text-white/60">
              <span className="text-white/40">Nombre:</span>{' '}
              <span className="text-white font-medium">
                {formData.name || 'Sin nombre'}
              </span>
            </p>
            {formData.description && (
              <p className="text-white/60">
                <span className="text-white/40">Descripción:</span>{' '}
                <span className="text-white">
                  {formData.description.substring(0, 50)}...
                </span>
              </p>
            )}
            {formData.affected_targets && (
              <p className="text-white/60">
                <span className="text-white/40">Objetivos:</span>{' '}
                <span className="text-brand-accent font-mono text-xs">
                  {convertToJson(formData.affected_targets).substring(0, 50)}...
                </span>
              </p>
            )}
          </div>

          <p className="text-xs text-white/40 mb-6">
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
