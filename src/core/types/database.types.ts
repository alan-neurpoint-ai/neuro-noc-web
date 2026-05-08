import type { RoleRow } from "./auth/roles.sql";
import type { PermissionRow } from "./auth/permissions.sql";
import type { RolePermissionRow } from "./auth/role-permissions.sql";
import type { OrganizationRow } from "./tenant/organizations.sql";
import type { ContactRow } from "./tenant/contacts.sql";
import type { PriorityContactRow } from "./tenant/priority-contacts.sql";
import type { TechnicalDocumentationRow } from "./knowledge/technical-documentation.sql";
import type { BusinessRuleRow } from "./knowledge/business-rules.sql";
import type { BusinessRuleSourceRow } from "./knowledge/business-rule-sources.sql";
import type { TemporalContextRow } from "./monitoring/temporal-contexts.sql";
import type { AlertRow } from "./monitoring/alerts.sql";
import type { AlertActionRow } from "./monitoring/alert-actions.sql";
import type { AIConfigurationRow } from "./knowledge/ai-configurations.sql";
import type { UserRow } from "./auth/users.sql";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDefinition<T> = {
  Row: T;
  Insert: T extends { id: unknown }
    ? Omit<T, "id" | "created_at" | "updated_at">
    : T;
  Update: Partial<T>;
};

interface TablesRecord {
  roles: RoleRow;
  permissions: PermissionRow;
  role_permissions: RolePermissionRow;
  organizations: OrganizationRow;
  contacts: ContactRow;
  priority_contacts: PriorityContactRow;
  technical_documentation: TechnicalDocumentationRow;
  business_rules: BusinessRuleRow;
  business_rule_sources: BusinessRuleSourceRow;
  temporal_contexts: TemporalContextRow;
  alerts: AlertRow;
  alert_actions: AlertActionRow;
  ai_configurations: AIConfigurationRow;
  users: UserRow;
}

export interface Database {
  public: {
    Tables: {
      [K in keyof TablesRecord]: TableDefinition<TablesRecord[K]>;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
  };
}
