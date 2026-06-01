import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../../../../core/supabase';
import { useAuthStore } from '../../../auth/presentation/stores/useAuthStore';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { ManualForm } from '../components/ManualRuleForm';
import { DocumentRuleForm } from '../components/DocumentRuleForm';
import { RuleHeader } from '../components/RuleHeader';
import { RuleInfoCard } from '../components/RuleInfoCard';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

interface RuleContext {
  name: string | null;
  created_at: string | null;
  affected_targets: unknown;
}

const formatTargetsForDisplay = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return formatTargetsForDisplay(parsed);
    } catch {
      return value;
    }
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    return entries
      .map(([key, val]) => {
        if (Array.isArray(val)) {
          return `${key}: ${(val as string[]).join(', ')}`;
        }
        return `${key}: ${String(val)}`;
      })
      .join('\n');
  }
  return String(value);
};

const convertToJson = (text: string): unknown => {
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
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
      return obj;
    }
    return { targets: items };
  }
};

export const BusinessRuleFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, selectedOrganization } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [context, setContext] = useState<RuleContext | null>(null);

  const isEditing = !!id && id !== 'create';
  const targetOrgId = selectedOrganization?.id || user?.organizationId;

  const [creationType, setCreationType] = useState<'manual' | 'document'>('manual');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    execution_schedule: '',
    affected_targets: '',
  });

  useEffect(() => {
    if (!targetOrgId) {
      navigate('/dashboard/rules');
      return;
    }

    if (isEditing && id) {
      const fetchRule = async () => {
        setLoading(true);
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.from('business_rule') as any)
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setContext(data as RuleContext);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            execution_schedule: data.execution_schedule
              ? data.execution_schedule.slice(0, 16)
              : '',
            affected_targets: formatTargetsForDisplay(data.affected_targets),
          });
        } catch (error) {
          console.error('Error loading rule:', error);
          navigate('/dashboard/rules');
        } finally {
          setTimeout(() => setLoading(false), 300);
        }
      };
      fetchRule();
    } else {
      setLoading(false);
    }
  }, [id, isEditing, navigate, targetOrgId]);

  const handleSave = async () => {
    if (!targetOrgId) return;
    if (!formData.name) {
      alert('Por favor complete el nombre de la regla');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        execution_schedule: formData.execution_schedule
          ? new Date(formData.execution_schedule).toISOString()
          : null,
        affected_targets: convertToJson(formData.affected_targets),
        organization_id: targetOrgId,
        status: 'active',
        created_by: user?.id,
      };

      if (isEditing && id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('business_rule') as any)
          .update({
            name: formData.name,
            description: formData.description,
            execution_schedule: formData.execution_schedule
              ? new Date(formData.execution_schedule).toISOString()
              : null,
            affected_targets: convertToJson(formData.affected_targets),
          })
          .eq('id', id);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('business_rule') as any).insert(payload);
      }

      navigate('/dashboard/rules');
    } catch (error) {
      console.error('Error saving rule:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('business_rule') as any)
        .update({ status: 'inactive' })
        .eq('id', id);
      navigate('/dashboard/rules');
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  if (loading) {
    return <Loading message="Cargando regla..." />;
  }

  return (
    <div className="space-y-6">
      <RuleHeader
        isEditing={isEditing}
        onNavigate={() => navigate('/dashboard/rules')}
        onDelete={() => setShowDeleteModal(true)}
        showDelete={isEditing}
        creationType={creationType}
        onCreationTypeChange={setCreationType}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 space-y-6">
            {creationType === 'manual' ? (
              <ManualForm
                formData={formData}
                setFormData={setFormData}
                saving={saving}
                onSave={handleSave}
              />
            ) : (
              <DocumentRuleForm
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <RuleInfoCard context={context} />

          <Card className="p-6 bg-brand-primary/5 border-brand-primary/20">
            <h3 className="text-sm font-bold text-brand-accent mb-2">
              Información
            </h3>
            <p className="text-xs text-text-muted">
              Las reglas de negocio definen automatizaciones que se ejecutan en
              tu sistema. Puedes crearlas manualmente o procesarlas desde
              documentos técnicos.
            </p>
          </Card>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        ruleName={context?.name ?? undefined}
        onDelete={handleDelete}
      />
    </div>
  );
};