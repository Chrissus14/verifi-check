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
        <Card key={vehicle.id} className="overflow-hidden">
          <div className="flex">
            <div className={`w-2 shrink-0 ${vehicle.test_type === 'Estática' ? 'bg-orange-500' : 'bg-green-500'}`} />
            <div className="flex w-full flex-col gap-1 p-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">{vehicle.brand} {vehicle.sub_brand}</span>
                <div className="flex items-center gap-1">
                  <Badge
                    variant={vehicle.test_type === 'Estática' ? "outline" : "default"}
                    className={vehicle.test_type === 'Estática' ? "text-orange-600 border-orange-200 bg-orange-50" : "bg-green-600 hover:bg-green-700"}
                  >
                    {vehicle.test_type}
                  </Badge>
                  <VehicleCardActions
                    vehicle={vehicle}
                    onEdit={(v) => setEditingVehicle(v)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Modelo {vehicle.model_year}</span>
                <span>{format(new Date(vehicle.created_at), 'HH:mm', { locale: es })}</span>
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
