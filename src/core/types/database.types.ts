import type { RoleRow } from "./roles.sql";
import type { PermissionRow } from "./permissions.sql";
import type { RolePermissionRow } from "./role-permissions.sql";
import type { OrganizationRow } from "./organizations.sql";
import type { ContactRow } from "./contacts.sql";
import type { PriorityContactRow } from "./priority-contacts.sql";
import type { TechnicalDocumentationRow } from "./technical-documentation.sql";
import type { BusinessRuleRow } from "./business-rules.sql";
import type { BusinessRuleSourceRow } from "./business-rule-sources.sql";
import type { TemporalContextRow } from "./temporal-contexts.sql";
import type { AlertRow } from "./alerts.sql";
import type { AlertActionRow } from "./alert-actions.sql";
import type { AIConfigurationRow } from "./ai-configurations.sql";
import type { UserRow } from "./users.sql";

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
