import type { ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: string | number;
}

export type RoleName = "super_admin" | "admin" | "client" | "user";

export interface OrganizationOption {
  value: string;
  label: string;
  description: string;
}