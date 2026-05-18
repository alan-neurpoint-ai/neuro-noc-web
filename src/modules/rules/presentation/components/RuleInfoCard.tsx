import { Card } from '../../../../core/presentation/components/ui/Card';

interface RuleContext {
  name: string | null;
  created_at: string | null;
  affected_targets: unknown;
}

interface RuleInfoCardProps {
  context: RuleContext | null;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatAffectedTargets = (value: unknown): string => {
  if (!value) return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value) || '-';
};

export const RuleInfoCard = ({ context }: RuleInfoCardProps) => {
  if (!context) return null;

  const hasAffectedTargets = !!context.affected_targets;
  const targetsDisplay = hasAffectedTargets
    ? formatAffectedTargets(context.affected_targets)
    : '';

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-white mb-4">Información Actual</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
            Creado
          </label>
          <p className="text-white/60 text-sm mt-1">
            {formatDate(context.created_at)}
          </p>
        </div>
        {hasAffectedTargets && (
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
              Objetivos Afectados
            </label>
            <p className="text-white/60 text-sm mt-1">{targetsDisplay}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
