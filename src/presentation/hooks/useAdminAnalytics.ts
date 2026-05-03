import { useState, useCallback } from "react";
import { analyticsService } from "../../data/services/analyticsService";
import type { AnalyticsData } from "../../core/entities/analytics/analytics";

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
          await analyticsService.fetchAlertsData(orgId, isInternal);
        const processedData = analyticsService.processAnalyticsData(
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
