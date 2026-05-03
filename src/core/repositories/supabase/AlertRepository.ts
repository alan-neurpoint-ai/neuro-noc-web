import { type Alert } from "../../entities/supabase/Alert";

export interface AlertRepository {
  findAll(organizationId: string): Promise<Alert[]>;
  findById(id: string): Promise<Alert | null>;
  findActive(organizationId: string): Promise<Alert[]>;
  findByStatus(
    organizationId: string,
    status: Alert["status"],
  ): Promise<Alert[]>;
  findByCriticality(
    organizationId: string,
    criticality: Alert["criticality"],
  ): Promise<Alert[]>;
  create(
    data: Omit<Alert, "id" | "created_at" | "resolved_at">,
  ): Promise<Alert>;
  update(
    id: string,
    data: Partial<Omit<Alert, "id" | "created_at">>,
  ): Promise<Alert>;
  delete(id: string): Promise<void>;
  resolve(id: string, diagnosis?: string): Promise<void>;
  suppress(id: string, suppress: boolean): Promise<void>;
}
