import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { VehicleForm } from "@/components/vehicles/vehicle-form"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch vehicles for today? Or all? User said "Lista principal que muestre los autos registrados HOY"
  // Let's filter by today.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Registros de Hoy</h1>
          <Badge variant="secondary">{vehicles?.length || 0} Vehículos</Badge>
      </div>

      <div className="flex flex-col gap-3">
        {vehicles?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                No hay registros aún hoy.
            </div>
        )}

        {vehicles?.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden">
             {/* Left border indicator using CSS or inline style for simple color coding */}
             <div className="flex">
                <div className={`w-2 shrink-0 ${vehicle.test_type === 'Estática' ? 'bg-orange-500' : 'bg-green-500'}`} />
                <div className="flex w-full flex-col gap-1 p-3">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">{vehicle.brand} {vehicle.sub_brand}</span>
                         <Badge variant={vehicle.test_type === 'Estática' ? "outline" : "default"} className={vehicle.test_type === 'Estática' ? "text-orange-600 border-orange-200 bg-orange-50" : "bg-green-600 hover:bg-green-700"}>
                            {vehicle.test_type}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Modelo {vehicle.model_year}</span>
                        <span>{format(new Date(vehicle.created_at), 'HH:mm', { locale: es })}</span>
                    </div>
                </div>
             </div>
          </Card>
        ))}
      </div>

      <VehicleForm />
    </div>
  )
}
