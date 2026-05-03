import type { Client, ClientStats } from "./Client";

export interface UseSuperadminAnalyticsReturn {
  stats: ClientStats;
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
  refetch: () => Promise<void>;
}
