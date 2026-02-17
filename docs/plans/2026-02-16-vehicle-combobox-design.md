# Design: Vehicle Combobox & Dynamic Filtering

Date: 2026-02-16

## Overview

Improve the vehicle registration experience by replacing free-text inputs for `brand` and `sub_brand` with a searchable `Combobox`. This ensures data consistency for common brands while maintaining flexibility for others.

## Architecture

- **Reusable UI Component**: A generic `Combobox` built on top of `shadcn/ui` (Popover + Command) located in `src/components/ui`.
- **Centralized Data**: Vehicle brands and common models stored in `lib/constants.ts` to support Mexican market specifics (e.g., Renault Kwid, VW Jetta).

## Components

- **VehicleForm**: Uses two instances of the `Combobox`.
  - **Brand Field**: Populated with `VEHICLE_BRANDS`.
  - **Sub-brand Field**: Dynamically populated based on the value of the Brand field.

## Data Flow

1. User selects a **Brand**.
2. Form state updates; `sub_brand` is reset to an empty string.
3. `VehicleForm` lookups `COMMON_MODELS[brand]`.
4. If models exist, **Sub-brand** becomes a `Combobox` with those options.
5. If no models exist, **Sub-brand** falls back to a standard `Input`.

## Error Handling & Edge Cases

- **Unknown Brands**: Users can still type and select a brand not in the list (though primarily encouraged to use the list).
- **Fallback UI**: Ensures that if a brand isn't in our `COMMON_MODELS` registry, the user isn't blocked from entering their model manually.

## Verification

- **Build Safety**: `npm run build` covers TypeScript integrity after removing `as any` from resolvers.
- **Linting**: All files verified with `npm run lint`.
- **Smart Rules**: Logic in `constants.ts` remains the source of truth for automatic `test_type` assignment.
