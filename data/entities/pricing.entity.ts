import { BaseEntity } from "./base.entity.ts";

export interface Pricing extends BaseEntity {
  device: string;
  average?: number;
  min?: number;
  max?: number;
  currency?: string;
  category?: "low" | "mid" | "high" | null;
  discontinued: boolean;
}
