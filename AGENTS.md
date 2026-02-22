# AGENTS.md - Development Guidelines for verifi-check

This document provides guidelines for AI agents working in this codebase.

## Project Overview

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Database/Auth**: Supabase
- **Form Handling**: React Hook Form + Zod validation

## Build, Lint & Test Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint

# No test framework configured - do not add tests
```

**Note**: There are no test scripts configured in this project. Do not add testing frameworks or tests.

## Code Style Guidelines

### Imports

- Use absolute imports with `@/` prefix (configured in tsconfig.json paths)
- Place React import first: `import * as React from "react"`
- Group imports: external libs → UI components → lib/utils → types → local
- Use `type` keyword for type-only imports: `import { type ClassValue } from "clsx"`

```typescript
// Good
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Resolver } from "react-hook-form"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { vehicleSchema, type Vehicle } from "@/types/vehicle"
```

### Formatting

- Use double quotes for strings
- Use semicolons at statement end
- Use Prettier defaults (2-space indent, trailing commas)
- Use arrow functions for callbacks when appropriate
- Destructure props in function signatures

### TypeScript

- **Always use strict mode** - no `any` types
- Define interfaces for object shapes (use `type` for unions/aliases)
- Use `zod` for form validation schemas with Spanish error messages
- Infer types when obvious; annotate when unclear
- Use `z.infer<typeof schema>` to derive form types from Zod schemas

```typescript
// Types file example
export type TestType = 'Dinámica' | 'Estática';

export interface Vehicle {
  id: string;
  brand: string;
  test_type: TestType;
}

// Zod schema
export const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca es requerida"),
  test_type: z.enum(['Dinámica', 'Estática']),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
```

### Naming Conventions

- **Components**: PascalCase (e.g., `VehicleForm`, `Button`)
- **Functions**: camelCase (e.g., `onSubmit`, `fetchData`)
- **Interfaces/Types**: PascalCase (e.g., `VehicleFormProps`)
- **Constants**: PascalCase for component-related (e.g., `buttonVariants`), camelCase elsewhere
- **Files**: kebab-case for components (`vehicle-form.tsx`), camelCase for utilities (`utils.ts`)

### React/Next.js Patterns

- Use `"use client"` directive for client components
- Use Server Actions for mutations (in `actions.ts` files)
- Prefer composition over abstraction
- Use `data-slot` attribute for polymorphic Radix components

```typescript
// Client component
"use client";

export function VehicleForm({ onSuccess }: VehicleFormProps) {
  const [open, setOpen] = useState(false);
  // ...
}
```

### Error Handling

- Use try/catch with async operations
- Throw errors with meaningful Spanish messages for user-facing errors
- Log errors to console for debugging
- Use `console.error` for Supabase errors, not user alerts (except critical)

```typescript
try {
  const { error } = await supabase.from("vehicles").insert(data);
  if (error) throw error;
} catch (error) {
  console.error("Error inserting vehicle:", error);
  alert("Error al guardar vehículo");
}
```

### UI Components (shadcn/ui)

- Components are in `@/components/ui/` directory
- Use `cn()` utility (from `@/lib/utils`) for conditional class merging
- Use `cva` (class-variance-authority) for component variants
- Follow existing component patterns for new UI elements

```typescript
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md...",
  { variants: { variant: { default: "...", destructive: "..." } } }
)
```

### Database (Supabase)

- Use typed Supabase client: `createClient()` from `@/lib/supabase/client`
- Row Level Security (RLS) is enabled on all tables
- Always get user via `supabase.auth.getUser()` before inserting user-specific data
- Use `upsert` with `onConflict` for catalog/ruler data

```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error("No usuario autenticado");

const { error } = await supabase.from("vehicles").insert({
  ...data,
  user_id: user.id,
});
```

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/        # Protected dashboard route group
│   ├── login/              # Login page
│   └── actions/            # Server Actions
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── auth/               # Auth components
│   └── vehicles/           # Vehicle-related components
├── lib/
│   ├── supabase/           # Supabase client/server utils
│   └── utils.ts            # cn() utility
└── types/
    └── vehicle.ts          # Vehicle types and Zod schemas
```

### Common Patterns

- **Form submissions**: React Hook Form + Zod resolver → Supabase insert/update → router.refresh()
- **Data loading**: Server components with async data fetching, or useEffect in client components
- **User-specific data**: Always filter queries by `user_id` from authenticated user

### ESLint Configuration

- Uses `eslint-config-next` with ESLint v9
- Follow Next.js ESLint rules
- Run `npm run lint` before committing

### What NOT to Do

- Do not use `any` type
- Do not disable strict mode
- Do not add console.log in production code (use console.error for errors)
- Do not add test files (no test framework configured)
- Do not commit secrets or credentials
- Do not use relative imports (use `@/` path alias)
