import { BiFile, BiLink } from 'react-icons/bi';

interface CreationTypeSelectorProps {
  creationType: 'manual' | 'document';
  onChange: (type: 'manual' | 'document') => void;
}

export const CreationTypeSelector = ({
  creationType,
  onChange,
}: CreationTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        onClick={() => onChange('manual')}
        className={`p-4 rounded-xl border-2 transition-all text-left ${
          creationType === 'manual'
            ? 'border-brand-primary bg-brand-primary/10'
            : 'border-border-default hover:border-border-default'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <BiFile className="text-xl text-brand-accent" />
          <span className="font-bold text-text-main">Creación Manual</span>
        </div>
        <p className="text-xs text-text-muted">
          Completa el formulario directamente y guarda en la base de datos
        </p>
      </button>

      <button
        onClick={() => onChange('document')}
        className={`p-4 rounded-xl border-2 transition-all text-left ${
          creationType === 'document'
            ? 'border-brand-primary bg-brand-primary/10'
            : 'border-border-default hover:border-border-default'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <BiLink className="text-xl text-brand-accent" />
          <span className="font-bold text-text-main">Desde Documento</span>
        </div>
        <p className="text-xs text-text-muted">
          Sube un documento PDF y el sistema procesará la información
        </p>
      </button>
    </div>
  );
};
