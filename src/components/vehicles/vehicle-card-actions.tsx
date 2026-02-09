'use client'

import { useState } from "react"
import { MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { type Vehicle } from "@/types/vehicle"

interface VehicleCardActionsProps {
  vehicle: Vehicle
  onEdit: (vehicle: Vehicle) => void
}

export function VehicleCardActions({ vehicle, onEdit }: VehicleCardActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function onDelete() {
    if (!confirm(`¿Estás seguro de que deseas eliminar el registro de ${vehicle.brand} ${vehicle.sub_brand}?`)) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicle.id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error(error)
      alert("Error al eliminar el vehículo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={loading} className="h-8 w-8">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
          <span className="sr-only">Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
