import {
  CRITICALITY_COLORS,
  DEFAULT_CRITICALITY_COLOR,
  STATUS_COLORS,
  DEFAULT_STATUS_COLOR,
  STATUS_TEXTS,
  DEFAULT_STATUS_TEXT,
} from "../constants/alertColors.config";

export const getCriticalityColor = (criticality: string): string => {
  return CRITICALITY_COLORS[criticality] || DEFAULT_CRITICALITY_COLOR;
};

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status] || DEFAULT_STATUS_COLOR;
};

export const getStatusText = (status: string): string => {
  return STATUS_TEXTS[status] || DEFAULT_STATUS_TEXT;
};

// Funciones adicionales útiles
export const getAllCriticalities = (): string[] =>
  Object.keys(CRITICALITY_COLORS);
export const getAllStatuses = (): string[] => Object.keys(STATUS_COLORS);
export const registerCriticalityColor = (
  criticality: string,
  colorClass: string,
): void => {
  CRITICALITY_COLORS[criticality] = colorClass;
};
export const registerStatusColor = (
  status: string,
  colorClass: string,
): void => {
  STATUS_COLORS[status] = colorClass;
};
export const registerStatusText = (status: string, text: string): void => {
  STATUS_TEXTS[status] = text;
};
