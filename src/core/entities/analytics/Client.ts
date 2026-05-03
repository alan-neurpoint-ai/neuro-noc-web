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
  parent_organization_id: string | null;
  org_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  alertCount?: number;
  criticalAlertCount?: number;
}
