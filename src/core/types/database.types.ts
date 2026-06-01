import type { RoleRow, RoleInsert, RoleUpdate } from "./auth/roles.sql";
import type { PermissionRow, PermissionInsert, PermissionUpdate } from "./auth/permissions.sql";
import type { RolePermissionRow, RolePermissionInsert } from "./auth/role-permissions.sql";
import type { OrganizationRow, OrganizationInsert, OrganizationUpdate } from "./tenant/organizations.sql";
import type { ContactRow, ContactInsert, ContactUpdate } from "./tenant/contacts.sql";
import type { PriorityContactRow, PriorityContactInsert, PriorityContactUpdate } from "./tenant/priority-contacts.sql";
import type { TechnicalDocumentationRow, TechnicalDocumentationInsert, TechnicalDocumentationUpdate } from "./knowledge/technical-documentation.sql";
import type { BusinessRuleRow, BusinessRuleInsert, BusinessRuleUpdate } from "./knowledge/business-rules.sql";
import type { BusinessRuleSourceRow, BusinessRuleSourceInsert } from "./knowledge/business-rule-sources.sql";
import type { TemporalContextRow, TemporalContextInsert } from "./monitoring/temporal-contexts.sql";
import type { AlertRow, AlertInsert } from "./monitoring/alerts.sql";
import type { AlertActionRow, AlertActionInsert } from "./monitoring/alert-actions.sql";
import type { AIConfigurationRow, AIConfigurationInsert, AIConfigurationUpdate } from "./knowledge/ai-configurations.sql";
import type { UserRow, UserInsert, UserUpdate } from "./auth/users.sql";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
        Relationships: Array<never>;
      };
      roles: {
        Row: RoleRow;
        Insert: RoleInsert;
        Update: RoleUpdate;
        Relationships: Array<never>;
      };
      permissions: {
        Row: PermissionRow;
        Insert: PermissionInsert;
        Update: PermissionUpdate;
        Relationships: Array<never>;
      };
      role_permissions: {
        Row: RolePermissionRow;
        Insert: RolePermissionInsert;
        Update: Partial<RolePermissionRow>;
        Relationships: Array<never>;
      };
      organizations: {
        Row: OrganizationRow;
        Insert: OrganizationInsert;
        Update: OrganizationUpdate;
        Relationships: Array<never>;
      };
      contacts: {
        Row: ContactRow;
        Insert: ContactInsert;
        Update: ContactUpdate;
        Relationships: Array<never>;
      };
      priority_contacts: {
        Row: PriorityContactRow;
        Insert: PriorityContactInsert;
        Update: PriorityContactUpdate;
        Relationships: Array<never>;
      };
      technical_documentation: {
        Row: TechnicalDocumentationRow;
        Insert: TechnicalDocumentationInsert;
        Update: TechnicalDocumentationUpdate;
        Relationships: Array<never>;
      };
      business_rules: {
        Row: BusinessRuleRow;
        Insert: BusinessRuleInsert;
        Update: BusinessRuleUpdate;
        Relationships: Array<never>;
      };
      business_rule_sources: {
        Row: BusinessRuleSourceRow;
        Insert: BusinessRuleSourceInsert;
        Update: Partial<BusinessRuleSourceRow>;
        Relationships: Array<never>;
      };
      temporal_contexts: {
        Row: TemporalContextRow;
        Insert: TemporalContextInsert;
        Update: Partial<TemporalContextRow>;
        Relationships: Array<never>;
      };
      alerts: {
        Row: AlertRow;
        Insert: AlertInsert;
        Update: Partial<AlertRow>;
        Relationships: Array<never>;
      };
      alert_actions: {
        Row: AlertActionRow;
        Insert: AlertActionInsert;
        Update: Partial<AlertActionRow>;
        Relationships: Array<never>;
      };
      ai_configurations: {
        Row: AIConfigurationRow;
        Insert: AIConfigurationInsert;
        Update: AIConfigurationUpdate;
        Relationships: Array<never>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, string>;
  };
}