import { BiArrowBack, BiTrash, BiBrain } from 'react-icons/bi';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { CreationTypeSelector } from '../components/CreationTypeSelector';

interface RuleHeaderProps {
  isEditing: boolean;
  onNavigate: () => void;
  onDelete: () => void;
  showDelete: boolean;
  creationType: 'manual' | 'document';
  onCreationTypeChange: (type: 'manual' | 'document') => void;
}

export const RuleHeader = ({
  isEditing,
  onNavigate,
  onDelete,
  showDelete,
  creationType,
  onCreationTypeChange,
}: RuleHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={<BiArrowBack size={20} />}
            onClick={onNavigate}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tighter uppercase">
              {isEditing ? 'Editar Regla' : 'Nueva Regla de Negocio'}
            </h1>
            <p className="text-sm text-text-muted font-headline">
              {isEditing
                ? 'Modifica los datos de la regla'
                : 'Crea una nueva regla de negocio'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {showDelete && (
            <Button
              variant="ghost"
              icon={<BiTrash />}
              className="text-red-400 hover:text-red-300"
              onClick={onDelete}
            >
              ELIMINAR
            </Button>
          )}
        </div>
      </div>

      {!isEditing && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <BiBrain className="text-brand-accent" />
            Tipo de Creación
          </h3>
          <CreationTypeSelector
            creationType={creationType}
            onChange={onCreationTypeChange}
          />
        </Card>
      )}
    </>
  );
};
