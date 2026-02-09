# Verifi-Check 🚗 ✅

**Verifi-Check** es una aplicación web moderna diseñada para gestionar y optimizar los registros de verificación vehicular. El objetivo principal es ayudar a los usuarios (o verificentros) a mantener un control preciso de las pruebas realizadas, automatizando sugerencias inteligentes basadas en la marca y submarca del vehículo.

## 🚀 Funcionalidades Principales

### 1. Registro de Vehículos

Captura de datos esenciales como marca, submarca, año del modelo y tipo de prueba necesaria.

### 2. Reglas Inteligentes (Smart Rules)

La aplicación cuenta con una lógica predefinida que sugiere automáticamente el **Tipo de Prueba** (Dinámica o Estática) al ingresar la marca y submarca:

- **Prueba Estática**: Sugerida para marcas de alto rendimiento o sistemas de tracción total (ej. Porsche, Ferrari, Audi AWD).
- **Prueba Dinámica**: Sugerida por defecto para la mayoría de los vehículos comerciales.

### 3. Personalización por Usuario (Brand Rules)

Los usuarios pueden definir sus propias reglas. Si un usuario marca un vehículo como "Estática" y elige "Guardar como regla", la aplicación recordará esta preferencia para todos los vehículos futuros de esa marca para ese usuario específico, priorizándola sobre las reglas generales.

### 4. Gestión con Supabase

Integración completa con Supabase para:

- Autenticación de usuarios.
- Almacenamiento persistente de vehículos.
- Sincronización de reglas personalizadas en tiempo real.

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js](https://nextjs.org/) (App Router)
- **Base de Datos & Auth**: [Supabase](https://supabase.com/)
- **Estilizado**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes**: [shadcn/ui](https://ui.shadcn.com/)
- **Validación**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 🏁 Inicio Rápido

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno para Supabase (`.env.local`).
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
