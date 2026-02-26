import { z } from 'zod';

export type TestType = "Dinámica" | "Estática";
export type VehicleType = "automóvil" | "camioneta" | "motocicleta" | "camión" | "otro";
export type TractionType = "delantera" | "trasera" | "4x4" | "awd";

export interface Vehicle {
  id: string;
  user_id: string;
  brand: string;
  sub_brand: string;
  model_year: number;
  test_type: TestType;
  vehicle_type: VehicleType | null;
  traction: TractionType | null;
  created_at: string;
}

export interface BrandRule {
  id: string;
  user_id: string;
  brand: string;
  test_type: TestType;
  created_at: string;
}

export interface VehicleCatalogEntry {
  id: string;
  user_id: string;
  brand: string;
  sub_brand: string;
  created_at: string;
}

export const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca es requerida"),
  sub_brand: z.string().min(1, "Submarca es requerida"),
  model_year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  test_type: z.enum(["Dinámica", "Estática"]),
  vehicle_type: z.enum(["automóvil", "camioneta", "motocicleta", "camión", "otro"]).optional(),
  traction: z.enum(["delantera", "trasera", "4x4", "awd"]).optional(),
  save_as_rule: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.vehicle_type === "automóvil" || data.vehicle_type === "camioneta") {
      return data.traction !== undefined;
    }
    return true;
  },
  {
    message: "La tracción es requerida para automóviles y camionetas",
    path: ["traction"],
  }
);

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
