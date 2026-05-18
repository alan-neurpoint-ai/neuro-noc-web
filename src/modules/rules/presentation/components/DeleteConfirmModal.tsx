import { BiTrash } from 'react-icons/bi';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Modal } from '../../../../core/presentation/components/ui/Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleName: string | undefined;
  onDelete: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  ruleName,
  onDelete,
}: DeleteConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Eliminación">
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <BiTrash className="text-3xl text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">¿Inactivar regla?</h3>
        <p className="text-sm text-white/60 mb-2">
          La regla <strong className="text-white">{ruleName}</strong> será
          marcada como inactiva.
        </p>
        <p className="text-xs text-white/40 mb-6">
          Esta acción no eliminará la regla, solo la ocultará de la vista.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            CANCELAR
          </Button>
          <Button variant="danger" onClick={onDelete}>
            INACTIVAR
          </Button>
        </div>
      </div>
    </Modal>
  );
};
