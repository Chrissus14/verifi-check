# Design: Agregar Tracción a Vehículos

## Technical Approach

Add two new columns to the vehicles table: `vehicle_type` (enum) and `traction` (enum). The vehicle_type field will control whether the traction field is displayed and required in the UI. Update TypeScript types, Zod schema, and the VehicleForm component to support these new fields.

## Architecture Decisions

### Decision: Vehicle Type Enum Values

**Choice**: Store vehicle_type as TEXT with enumerated values: 'automóvil', 'camioneta', 'motocicleta', 'camión', 'otro'

**Alternatives considered**: 
- Separate table for vehicle_types
- INTEGER with lookup table

**Rationale**: Simple text field allows easy extension, no additional tables needed. Follows existing pattern in test_type field.

### Decision: Traction Field Storage

**Choice**: Store traction as TEXT with values: 'delantera', 'trasera', '4x4', 'awd'

**Alternatives considered**:
- Separate traction_types table
- BOOLEAN fields (has_rwd, has_fwd, has_4wd)

**Rationale**: Single text field is simpler and matches how test_type is stored. Supports future extension.

### Decision: Conditional Validation Approach

**Choice**: Use Zod schema with .refine() for conditional validation of traction based on vehicle_type

**Alternatives considered**:
- Separate schemas for each vehicle type
- Manual validation in onSubmit handler

**Rationale**: Centralized validation in schema is more maintainable and provides better error messages.

### Decision: Traction Field Visibility

**Choice**: Show/hide traction field based on vehicle_type using React state and conditional rendering

**Alternatives considered**:
- Always show traction field but make it optional
- Use Radix UI conditional form pattern

**Rationale**: Matches spec requirement. Conditional rendering is straightforward with existing form structure.

## Data Flow

```
User Input Form
      │
      ▼
VehicleForm.tsx (React Hook Form + Zod)
      │
      ▼
onSubmit() handler
      │
      ├──→ Supabase: vehicles.insert/update
      │
      ▼
Database (vehicles table)
      │
      ▼
Server refresh / UI update
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/` | Create | New migration adding vehicle_type and traction columns |
| `src/types/vehicle.ts` | Modify | Add VehicleType type, TractionType type, update Vehicle interface, update Zod schema |
| `src/components/vehicles/vehicle-form.tsx` | Modify | Add vehicle_type dropdown, add traction dropdown with conditional visibility |

## Interfaces / Contracts

```typescript
// New types in src/types/vehicle.ts
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
      return data.traction !== undefined && data.traction !== "";
    }
    return true;
  },
  {
    message: "La tracción es requerida para automóviles y camionetas",
    path: ["traction"],
  }
);
```

## Migration / Rollout

```sql
-- New migration: add_vehicle_type_and_traction.sql
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_type TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS traction TEXT;

-- RLS policies remain the same (already configured for vehicles table)
```

No feature flags required. Migration is additive ( nullable columns).

## Open Questions

None. All technical decisions are resolved.
