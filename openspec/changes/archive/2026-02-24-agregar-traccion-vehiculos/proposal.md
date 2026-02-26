# Proposal: Agregar Tracción a Vehículos

## Intent

Agregar el campo de tracción (tracción trasera/delantera/4x4) a los vehículos registrados en el sistema. Este campo aplica únicamente para automóviles y pickup trucks (camionetas), permitiendo registrar la configuración de tracción del vehículo para fines de verificación técnica.

## Scope

### In Scope
- Agregar campo `traction` a la tabla `vehicles` en Supabase
- Agregar campo `vehicle_type` a la tabla `vehicles` para determinar qué vehículos requieren tracción
- Actualizar TypeScript types en `src/types/vehicle.ts`
- Actualizar Zod schema en `src/types/vehicle.ts`
- Actualizar formulario `VehicleForm` en `src/components/vehicles/vehicle-form.tsx`
- Agregar migración de base de datos

### Out of Scope
- Agregar tracción a otros tipos de vehículos (motocicletas, camiones)
- Modificar la lógica de reglas de marca (brand rules)
- Modificar reportes o exportaciones

## Approach

Se agregarán dos campos a la tabla vehicles:
1. `vehicle_type`: Tipo de vehículo (automóvil, camioneta, etc.)
2. `traction`: Tipo de tracción (Trasera, Delantera, 4x4, AWD)

El campo `traction` será condicionalmente requerido solo cuando `vehicle_type` sea "automóvil" o "camioneta". Para otros tipos de vehículo, el campo será opcional (nullable).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `supabase/migrations/` | New | Agregar columnas vehicle_type y traction |
| `src/types/vehicle.ts` | Modified | Agregar tipos y Zod schema |
| `src/components/vehicles/vehicle-form.tsx` | Modified | Agregar campos al formulario |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Migración afecta datos existentes | Low | Agregar valores por defecto NULL |
| Compatibilidad con datos existentes | Low | Campo opcional para vehículos existentes |

## Rollback Plan

1. Revertir migración: `ALTER TABLE vehicles DROP COLUMN IF EXISTS traction;`
2. Revertir migración: `ALTER TABLE vehicles DROP COLUMN IF EXISTS vehicle_type;`
3. Revertir cambios en TypeScript types y Zod schema
4. Revertir cambios en VehicleForm

## Dependencies

- Ninguna dependencia externa

## Success Criteria

- [ ] Migración aplicada correctamente sin errores
- [ ] Campo traction visible solo para automóvil/camioneta
- [ ] Validación Zod acepta los nuevos campos
- [ ] Formulario guarda y recupera datos correctamente
- [ ] Lint pasa sin errores
