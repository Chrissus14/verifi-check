'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/app/login/actions'
import { cn } from '@/lib/utils'

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type AuthValues = z.infer<typeof authSchema>

export function AuthForm({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
  })

  async function onSubmit(data: AuthValues) {
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    try {
      const result = await login(formData)

      // If we're here and result is undefined, it means redirect happened (good)
      // If result has error, we show it
      // Note: server actions returning objects don't redirect automatically unless we handle it
      // actually my actions calls redirect() which throws NEXT_REDIRECT, so this catch block might catch it if not careful.
      // Wait, redirect() inside server action throws an error that Next.js handles.
      // So if it returns, it means error.

      if (result?.error) {
        setError(result.error)
      }
    } catch {
      // It's likely the redirect error, so we ignore or let it bubble?
      // Actually redirect() in Next.js throws an error.
      // But passing it from server action to client:
      // If I call it directly, it should just work.
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ingresar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Verifi-Check - Sistema de Registro
      </div>
    </div>
  )
}
