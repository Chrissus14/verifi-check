import { z } from 'zod';

export type TestType = 'Dinámica' | 'Estática';

export interface Vehicle {
  id: string;
  user_id: string;
  brand: string;
  sub_brand: string;
  model_year: number;
  test_type: TestType;
  created_at: string;
}

export interface BrandRule {
  id: string;
  user_id: string;
  brand: string;
  test_type: TestType;
  created_at: string;
}

export const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca es requerida"),
  sub_brand: z.string().min(1, "Submarca es requerida"),
  model_year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  test_type: z.enum(['Dinámica', 'Estática']),
  save_as_rule: z.boolean().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
