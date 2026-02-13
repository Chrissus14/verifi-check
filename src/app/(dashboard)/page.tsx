import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { VehicleSearch } from "@/components/vehicles/vehicle-search"
import { VehicleListManager } from "@/components/vehicles/vehicle-list-manager"

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient()
  const { q } = await searchParams
  const searchQuery = typeof q === 'string' ? q : undefined

  // Fetch vehicles for today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let query = supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  if (searchQuery) {
    // If searching, we might want to show results beyond just today?
    // Or still filter by today? Usually search implies broader scope.
    // Let's search in all records if there is a query, otherwise just today.
    query = query.or(`brand.ilike.%${searchQuery}%,sub_brand.ilike.%${searchQuery}%`)
  } else {
    query = query.gte('created_at', today.toISOString())
  }

  const { data: vehicles } = await query

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Registros de Hoy'}
            </h1>
            <p className="text-muted-foreground font-medium">
              Dashboard de verificación de vehículos • <span className="text-primary">{vehicles?.length || 0} registros activos</span>
            </p>
          </div>
          <div className="w-full md:w-80">
            <VehicleSearch />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b pb-4">
          <Badge variant="secondary" className="px-3 py-1 rounded-lg bg-secondary/50 text-primary border-primary/10">
            Listado General
          </Badge>
        </div>
        <VehicleListManager initialVehicles={vehicles || []} />
      </div>
    </div>
  )
}
