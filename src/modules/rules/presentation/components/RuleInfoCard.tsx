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
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return formatAffectedTargets(parsed);
    } catch {
      return value;
    }
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '-';
    return entries
      .map(([key, val]) => {
        if (Array.isArray(val)) {
          return `${key}: ${(val as string[]).join(', ')}`;
        }
        return `${key}: ${String(val)}`;
      })
      .join('\n');
  }
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
      <h3 className="text-lg font-bold text-text-main mb-4">Información Actual</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Creado
          </label>
          <p className="text-text-muted text-sm mt-1">
            {formatDate(context.created_at)}
          </p>
        </div>
        {hasAffectedTargets && (
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Objetivos Afectados
            </label>
            <p className="text-text-muted text-sm mt-1 whitespace-pre-line">{targetsDisplay}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
