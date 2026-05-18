import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  BiArrowBack,
  BiLink,
  BiFile,
  BiCalendar,
  BiUser,
} from 'react-icons/bi';
import { supabase } from '../../../../core/supabase';
import { Loading } from '../../../../core/presentation/components/ui/Loading';
import { Button } from '../../../../core/presentation/components/ui/Button';
import { Card } from '../../../../core/presentation/components/ui/Card';
import { TechnicalDocumentationRow } from '../../../../core/types/knowledge/technical-documentation.sql';

export const TechnicalDocumentationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<TechnicalDocumentationRow | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard/documentation');
      return;
    }

    const fetchDoc = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('technical_documentation')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDoc(data as TechnicalDocumentationRow);
      } catch (error) {
        console.error('Error loading documentation:', error);
        navigate('/dashboard/documentation');
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchDoc();
  }, [id, navigate]);

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

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'processed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
            Procesado
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
            Pendiente
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
            Fallido
          </span>
        );
      case 'inactive':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/5 text-white/40 border border-white/10 uppercase">
            Inactivo
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/5 text-white/40 border border-white/10 uppercase">
            Desconocido
          </span>
        );
    }
  };

  if (loading) {
    return <Loading message="Cargando documentación..." />;
  }

  if (!doc) {
    return <Loading message="Documento no encontrado" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={<BiArrowBack size={20} />}
            onClick={() => navigate('/dashboard/documentation')}
            className="p-2"
          />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
              Detalles del Documento
            </h1>
            <p className="text-sm text-white/40 font-headline">
              Información técnica completa
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {doc.file_url && (
            <Button
              variant="action"
              icon={<BiLink />}
              onClick={() => window.open(doc.file_url!, '_blank')}
            >
              ABRIR ENLACE
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BiFile className="text-brand-accent" />
              Información General
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Nombre
                </label>
                <p className="text-white font-medium mt-1">{doc.name}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">
                  Estado
                </label>
                <div className="mt-2">{getStatusBadge(doc.status)}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <BiCalendar className="text-white/40" />
                  Fecha de Creación
                </label>
                <p className="text-white/60 text-sm mt-1">
                  {formatDate(doc.created_at)}
                </p>
              </div>

              {doc.created_by && (
                <div>
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                    <BiUser className="text-white/40" />
                    Creado por
                  </label>
                  <p className="text-white/60 text-sm mt-1">{doc.created_by}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Descripción</h3>
            <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
              {doc.description || 'Sin descripción disponible'}
            </div>
          </Card>

          {doc.scraped_content && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Contenido Extraído
              </h3>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto bg-white/5 p-4 rounded-lg">
                {typeof doc.scraped_content === 'string'
                  ? doc.scraped_content
                  : JSON.stringify(doc.scraped_content, null, 2)}
              </div>
            </Card>
          )}

          {doc.file_url && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BiLink className="text-brand-accent" />
                Enlace del Documento
              </h3>
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline text-sm break-all"
              >
                {doc.file_url}
              </a>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
