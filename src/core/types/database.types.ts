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
