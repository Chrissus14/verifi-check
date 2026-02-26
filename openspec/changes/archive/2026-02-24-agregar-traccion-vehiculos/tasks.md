# Tasks: Agregar Tracción a Vehículos

## Phase 1: Database Infrastructure

- [x] 1.1 Create migration file `supabase/migrations/YYYYMMDD_add_vehicle_type_traction.sql` with ALTER TABLE statements to add vehicle_type and traction columns
- [x] 1.2 Apply migration to local Supabase instance to verify it works

## Phase 2: TypeScript Types and Schema

- [x] 2.1 Add `VehicleType` type to `src/types/vehicle.ts` with union type: "automóvil" | "camioneta" | "motocicleta" | "camión" | "otro"
- [x] 2.2 Add `TractionType` type to `src/types/vehicle.ts` with union type: "delantera" | "trasera" | "4x4" | "awd"
- [x] 2.3 Update `Vehicle` interface to include optional vehicle_type and traction fields
- [x] 2.4 Update `vehicleSchema` to include vehicle_type and traction fields with Zod .enum()
- [x] 2.5 Add Zod .refine() for conditional traction validation (required for automóvil/camioneta)

## Phase 3: UI Implementation

- [x] 3.1 Add vehicle_type dropdown field to `VehicleForm` component after test_type field
- [x] 3.2 Add traction dropdown field to `VehicleForm` with conditional rendering based on vehicle_type
- [x] 3.3 Update form default values to include vehicle_type and traction
- [x] 3.4 Update onSubmit handler to include vehicle_type and traction in insert/update
- [x] 3.5 Update edit mode to populate vehicle_type and traction values

## Phase 4: Verification

- [x] 4.1 Run `npm run lint` to verify code quality
- [x] 4.2 Test: Register new automobile with traction
- [x] 4.3 Test: Register new pickup truck with 4x4
- [x] 4.4 Test: Register motorcycle without traction (should work)
- [x] 4.5 Test: Try to save automobile without traction (should show error)
- [x] 4.6 Test: Edit existing vehicle and change traction
