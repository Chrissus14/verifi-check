'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { type Vehicle } from "@/types/vehicle"
import { VehicleForm } from "./vehicle-form"
import { VehicleCardActions } from "./vehicle-card-actions"

interface VehicleListManagerProps {
  initialVehicles: Vehicle[]
}

export function VehicleListManager({ initialVehicles }: VehicleListManagerProps) {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)

  return (
    <div className="flex flex-col gap-3">
      {initialVehicles.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No hay registros coincidentes.
        </div>
      )}

      {initialVehicles.map((vehicle) => (
        <Card key={vehicle.id} className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 backdrop-blur-sm">
          <div className="flex p-5 gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-bold text-xl tracking-tight text-foreground/90 leading-tight">
                        {vehicle.brand}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {vehicle.sub_brand} • Modelo {vehicle.model_year}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 rounded-full border-none font-semibold text-[11px] uppercase tracking-wider ${
                        vehicle.test_type === 'Estática'
                        ? "bg-[oklch(0.92_0.04_70)] text-[oklch(0.4_0.05_70)]"
                        : "bg-[oklch(0.92_0.04_150)] text-[oklch(0.4_0.05_150)]"
                    }`}
                  >
                    {vehicle.test_type}
                  </Badge>
                  <VehicleCardActions
                    vehicle={vehicle}
                    onEdit={(v) => setEditingVehicle(v)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/40">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Registrado a las {format(new Date(vehicle.created_at), 'HH:mm', { locale: es })}
                </div>
                <span className="text-[10px] text-muted-foreground/50 italic">
                    ID: {vehicle.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <VehicleForm
        editingVehicle={editingVehicle}
        onSuccess={() => setEditingVehicle(null)}
      />
    </div>
  )
}
