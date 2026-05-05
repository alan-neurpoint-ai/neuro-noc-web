import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import {
  HiArrowLeft,
  HiUserCircle,
  HiBriefcase,
  HiMail,
  HiPhone,
} from "react-icons/hi";
import { useSelectedClient } from "../../context/SelectedClientContext";
import { useAlerts } from "../../../../hooks/useAlerts";
import { Button } from "../../../../components/ui";
import {
  getCriticalityColor,
  getStatusColor,
  getStatusText,
} from "../../../../utils/alertColors";
import { VapiModals } from "./VapiModals";

export default function AdminAlertDetail() {
  const [vapiModal, setVapiModal] = useState<{
    isOpen: boolean;
    type: "transcript" | "audio" | null;
    vapiId: string | null;
  }>({ isOpen: false, type: null, vapiId: null });
  const openVapiModal = (type: "transcript" | "audio", vapiId: string) => {
    setVapiModal({ isOpen: true, type, vapiId });
  };

  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const { selectedClient } = useSelectedClient();
  const {
    selectedAlert,
    isLoadingDetail,
    fetchAlertById,
    clearSelectedAlert,
    resolveAlert,
    acknowledgeAlert,
    discardAlert,
    markAsProblem,
  } = useAlerts(selectedClient?.id);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (alertId) {
      fetchAlertById(alertId);
    }
    return () => {
      clearSelectedAlert();
    };
  }, [alertId, fetchAlertById, clearSelectedAlert]);

  const handleGoBack = () => {
    navigate("/dashboard/admin/alertas");
  };

  const handleResolve = async () => {
    if (!alertId) return;
    setIsProcessing(true);
    try {
      await resolveAlert(alertId);
      handleGoBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!alertId) return;
    setIsProcessing(true);
    try {
      await acknowledgeAlert(alertId);
      handleGoBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscard = async () => {
    if (!alertId) return;
    setIsProcessing(true);
    try {
      await discardAlert(alertId);
      handleGoBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsProblem = async () => {
    if (!alertId) return;
    setIsProcessing(true);
    try {
      await markAsProblem(alertId);
      handleGoBack();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingDetail) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-accent animate-pulse">
          Cargando detalles de la alerta...
        </div>
      </div>
    );
  }

  if (!selectedAlert) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No se encontró la alerta</p>
        <Button variant="exit" onClick={handleGoBack} className="mt-4">
          <HiArrowLeft size={16} />
          Volver a Alertas
        </Button>
      </div>
    );
  }

  const alert = selectedAlert;
  const isCompleted =
    alert.status === "RESOLVED" || alert.status === "DISCARDED";

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
        >
          <HiArrowLeft size={18} />
          <span className="text-xs uppercase tracking-wider">
            Volver a Alertas
          </span>
        </button>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-8 bg-accent rounded-full" />
          <h1 className="text-4xl font-black tracking-tighter bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            Detalle de <span className="text-accent">Alerta</span>
          </h1>
        </div>
        <p className="text-text-muted text-sm ml-3">
          Información completa de la alerta
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
          <p className="text-[9px] uppercase tracking-wider text-accent font-bold mb-2">
            Criticidad
          </p>
          <p
            className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${getCriticalityColor(alert.criticality)}`}
          >
            {alert.criticality}
          </p>
        </div>
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
          <p className="text-[9px] uppercase tracking-wider text-accent font-bold mb-2">
            Estado
          </p>
          <p
            className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${getStatusColor(alert.status)}`}
          >
            {getStatusText(alert.status)}
          </p>
        </div>
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
          <p className="text-[9px] uppercase tracking-wider text-accent font-bold mb-2">
            Creado
          </p>
          <p className="text-text-primary">
            {new Date(alert.created_at).toLocaleString()}
          </p>
        </div>
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-6">
          <p className="text-[9px] uppercase tracking-wider text-accent font-bold mb-2">
            Resuelto
          </p>
          <p className="text-text-primary">
            {alert.resolved_at
              ? new Date(alert.resolved_at).toLocaleString()
              : "Pendiente"}
          </p>
        </div>
      </div>

      <div className="bg-surface/30 border border-muted/20 rounded-xl p-6 mb-8">
        <h2 className="text-sm uppercase tracking-wider text-accent font-bold mb-4">
          Información de la Alerta
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
              Host / Nodo
            </p>
            <p className="text-text-primary mt-1">{alert.host_name}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
              Trigger ID
            </p>
            <p className="text-text-secondary text-sm mt-1">
              {alert.trigger_id || "—"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
              Problema
            </p>
            <p className="text-text-primary mt-1">{alert.issue}</p>
          </div>
          {alert.description && (
            <div className="md:col-span-2">
              <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
                Descripción
              </p>
              <p className="text-text-secondary text-sm mt-1">
                {alert.description}
              </p>
            </div>
          )}
          {alert.recommendations && (
            <div className="md:col-span-2">
              <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
                Recomendaciones
              </p>
              <p className="text-emerald-400 text-sm mt-1">
                {alert.recommendations}
              </p>
            </div>
          )}
          {alert.diagnosis && (
            <div className="md:col-span-2">
              <p className="text-[9px] uppercase tracking-wider text-accent/70 font-bold">
                Diagnóstico
              </p>
              <p className="text-text-secondary text-sm mt-1">
                {alert.diagnosis}
              </p>
            </div>
          )}
        </div>
      </div>

      {alert.contact && (
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-6 mb-8">
          <h2 className="text-sm uppercase tracking-wider text-accent font-bold mb-4">
            Contacto Notificado
          </h2>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <HiUserCircle size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h3 className="text-lg font-bold text-text-primary">
                  {alert.contact.full_name}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${alert.contact.is_internal ? "bg-accent/20 text-accent" : "bg-blue-primary/20 text-blue-glow"}`}
                >
                  {alert.contact.is_internal ? "Interno" : "Externo"}
                </span>
              </div>
              {alert.contact.job_title && (
                <div className="flex items-center gap-2 mb-3">
                  <HiBriefcase size={14} className="text-accent/60" />
                  <span className="text-sm text-text-muted">
                    {alert.contact.job_title}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-muted/20">
                <div className="flex items-center gap-2">
                  <HiMail size={16} className="text-accent/60" />
                  <span className="text-text-secondary">
                    {alert.contact.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiPhone size={16} className="text-accent/60" />
                  <span className="text-text-secondary">
                    {alert.contact.phone_number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {alert.actions && alert.actions.length > 0 && (
        <div className="bg-surface/30 border border-muted/20 rounded-xl p-6 mb-8">
          <h2 className="text-sm uppercase tracking-wider text-accent font-bold mb-4">
            Acciones Ejecutadas ({alert.actions.length})
          </h2>
          <div className="space-y-3">
            {alert.actions.map((action) => (
              <div
                key={action.id}
                className="bg-surface/50 border border-muted/20 rounded-lg p-4"
              >
                <p className="text-sm font-medium text-text-primary mb-2">
                  {action.action_performed}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-text-muted">
                  {action.n8n_execution_id && (
                    <div>n8n ID: {action.n8n_execution_id}</div>
                  )}
                  {action.email_execution_id && (
                    <div>Email ID: {action.email_execution_id}</div>
                  )}
                  {action.vapi_execution_id && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-accent/5 p-3 rounded-lg border border-accent/10">
                      <div>VAPI ID: {action.vapi_execution_id}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openVapiModal(
                              "transcript",
                              action.vapi_execution_id!,
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1 bg-accent/20 hover:bg-accent/30 text-accent rounded border border-accent/20 transition-all font-bold text-[10px]"
                        >
                          LEER LLAMADA
                        </button>
                        <button
                          onClick={() =>
                            openVapiModal("audio", action.vapi_execution_id!)
                          }
                          className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded border border-blue-500/20 transition-all font-bold text-[10px]"
                        >
                          OÍR LLAMADA
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    Ejecutado: {new Date(action.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isCompleted && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-accent rounded-full" />
            <p className="text-[10px] uppercase tracking-wider text-accent font-bold">
              Cambiar Estado de la Alerta
            </p>
          </div>

          <div className="bg-surface/30 border border-muted/20 rounded-lg p-4 mb-4">
            <p className="text-xs font-medium text-text-primary mb-2">
              ¿Qué significa cada estado?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-text-secondary">Resuelto:</span>
                <span className="text-text-muted">
                  Problema solucionado y verificado
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-text-secondary">En Proceso:</span>
                <span className="text-text-muted">
                  En revisión o investigación activa
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500" />
                <span className="text-text-secondary">Descartado:</span>
                <span className="text-text-muted">
                  Falso positivo o no requiere acción
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-text-secondary">Sin Resolver:</span>
                <span className="text-text-muted">
                  Pendiente, requiere atención posterior
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="success"
              onClick={handleResolve}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2"
            >
              Resuelto
            </Button>

            <Button
              variant="edit"
              onClick={handleAcknowledge}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2"
            >
              En Proceso
            </Button>

            <Button
              variant="delete"
              onClick={handleDiscard}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2"
            >
              Descartado
            </Button>

            <Button
              variant="exit"
              onClick={handleMarkAsProblem}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2"
            >
              Sin Resolver
            </Button>
          </div>
        </div>
      )}

      <VapiModals
        {...vapiModal}
        onClose={() => setVapiModal({ ...vapiModal, isOpen: false })}
      />
    </div>
  );
}
