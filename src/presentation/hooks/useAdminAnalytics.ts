import { useState, useCallback } from "react";
import { AnalyticsDataService } from "../../data/services/AnalyticsDataService";

import type { AnalyticsData } from "../../core/entities/analytics/analytics";
import { AnalyticsDomainService } from "../../data/services/AnalyticsDomainService";

const dataService = new AnalyticsDataService();
const domainService = new AnalyticsDomainService();

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    alertsOverTime: [],
    totalAlerts: 0,
    resolvedAlerts: 0,
    criticalAlerts: 0,
    avgResponseTime: 0,
    actionsSent: 0,
    emailsSent: 0,
    resolutionRate: 0,
    activeNodes: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = useCallback(
    async (orgId: string, isInternal: boolean) => {
      setIsLoading(true);
      try {
        const { alertsData, actionsData, nodesData } =
          await dataService.fetchAlertsData(orgId, isInternal);

        const processedData = domainService.processAnalyticsData(
          alertsData,
          actionsData,
          nodesData,
        );

        setAnalytics(processedData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { analytics, isLoading, fetchAnalytics };
};
