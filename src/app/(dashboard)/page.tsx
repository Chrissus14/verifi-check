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
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex flex-col gap-4 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">
              {searchQuery ? `Buscando "${searchQuery}"` : 'Registros de Hoy'}
            </h1>
            <Badge variant="secondary">{vehicles?.length || 0} Vehículos</Badge>
        </div>
        <VehicleSearch />
      </div>

      <VehicleListManager initialVehicles={vehicles || []} />
    </div>
  )
}
