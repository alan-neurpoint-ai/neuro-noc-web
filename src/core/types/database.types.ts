import type {
  AIConfigurationInsert,
  AIConfigurationRow,
  AIConfigurationUpdate,
} from "./ai-configurations.sql";
import type { AlertActionInsert, AlertActionRow } from "./alert-actions.sql";
import type { AlertInsert, AlertRow } from "./alerts.sql";
import type {
  BusinessRuleSourceInsert,
  BusinessRuleSourceRow,
} from "./business-rule-sources.sql";
import type {
  BusinessRuleInsert,
  BusinessRuleRow,
  BusinessRuleUpdate,
} from "./business-rules.sql";
import type { ContactInsert, ContactRow, ContactUpdate } from "./contacts.sql";
import type {
  OrganizationInsert,
  OrganizationRow,
  OrganizationUpdate,
} from "./organizations.sql";
import type {
  PermissionInsert,
  PermissionRow,
  PermissionUpdate,
} from "./permissions.sql";
import type {
  PriorityContactInsert,
  PriorityContactRow,
  PriorityContactUpdate,
} from "./priority-contacts.sql";
import type {
  RolePermissionInsert,
  RolePermissionRow,
} from "./role-permissions.sql";
import type { RoleInsert, RoleRow, RoleUpdate } from "./roles.sql";
import type {
  TechnicalDocumentationInsert,
  TechnicalDocumentationRow,
  TechnicalDocumentationUpdate,
} from "./technical-documentation.sql";
import type {
  TemporalContextInsert,
  TemporalContextRow,
} from "./temporal-contexts.sql";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: RoleRow;
        Insert: RoleInsert;
        Update: RoleUpdate;
      };
      permissions: {
        Row: PermissionRow;
        Insert: PermissionInsert;
        Update: PermissionUpdate;
      };
      role_permissions: {
        Row: RolePermissionRow;
        Insert: RolePermissionInsert;
        Update: Partial<RolePermissionRow>;
      };
      organizations: {
        Row: OrganizationRow;
        Insert: OrganizationInsert;
        Update: OrganizationUpdate;
      };
      contacts: {
        Row: ContactRow;
        Insert: ContactInsert;
        Update: ContactUpdate;
      };
      priority_contacts: {
        Row: PriorityContactRow;
        Insert: PriorityContactInsert;
        Update: PriorityContactUpdate;
      };
      technical_documentation: {
        Row: TechnicalDocumentationRow;
        Insert: TechnicalDocumentationInsert;
        Update: TechnicalDocumentationUpdate;
      };
      business_rules: {
        Row: BusinessRuleRow;
        Insert: BusinessRuleInsert;
        Update: BusinessRuleUpdate;
      };
      business_rule_sources: {
        Row: BusinessRuleSourceRow;
        Insert: BusinessRuleSourceInsert;
        Update: Partial<BusinessRuleSourceRow>;
      };
      temporal_contexts: {
        Row: TemporalContextRow;
        Insert: TemporalContextInsert;
        Update: Partial<TemporalContextRow>;
      };
      alerts: {
        Row: AlertRow;
        Insert: AlertInsert;
        Update: Partial<AlertRow>;
      };
      alert_actions: {
        Row: AlertActionRow;
        Insert: AlertActionInsert;
        Update: Partial<AlertActionRow>;
      };
      ai_configurations: {
        Row: AIConfigurationRow;
        Insert: AIConfigurationInsert;
        Update: AIConfigurationUpdate;
      };
    };

    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
