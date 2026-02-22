import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { VehicleSearch } from "@/components/vehicles/vehicle-search"
import { VehicleListManager } from "@/components/vehicles/vehicle-list-manager"

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient()
  const { q, page, size } = await searchParams
  const searchQuery = typeof q === 'string' ? q : undefined
  const currentPage = typeof page === 'string' ? parseInt(page, 10) : 1
  const pageSize = typeof size === 'string' && PAGE_SIZE_OPTIONS.includes(parseInt(size, 10)) 
    ? parseInt(size, 10) 
    : 20
  const offset = (currentPage - 1) * pageSize

  let baseQuery = supabase
    .from('vehicles')
    .select('*', { count: 'exact' })

  if (searchQuery) {
    baseQuery = baseQuery.or(`brand.ilike.%${searchQuery}%,sub_brand.ilike.%${searchQuery}%`)
  }

  const { data: vehicles, count } = await baseQuery
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Historial de Vehículos'}
            </h1>
            <p className="text-muted-foreground font-medium">
              Dashboard de verificación de vehículos • <span className="text-primary">{totalCount} registros en total</span>
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
        <VehicleListManager 
          initialVehicles={vehicles || []} 
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}
