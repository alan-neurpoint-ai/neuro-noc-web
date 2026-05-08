import type {
  PermissionInsert,
  PermissionRow,
  PermissionUpdate,
} from "./permissions.sql";
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
