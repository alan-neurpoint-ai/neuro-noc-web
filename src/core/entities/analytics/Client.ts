export interface ClientStats {
  totalClients: number;
  activeClients: number;
  totalAlerts: number;
  criticalAlerts: number;
  totalAiConfigs: number;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  alertCount?: number;
  criticalAlertCount?: number;
}
