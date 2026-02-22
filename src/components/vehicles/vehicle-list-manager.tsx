'use client'

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { type Vehicle } from "@/types/vehicle"
import { VehicleForm } from "./vehicle-form"
import { VehicleCardActions } from "./vehicle-card-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface VehicleListManagerProps {
  initialVehicles: Vehicle[]
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function VehicleListManager({ 
  initialVehicles, 
  currentPage, 
  totalPages,
  totalCount,
  pageSize
}: VehicleListManagerProps) {
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    
    router.push(`?${params.toString()}`)
  }

  function handlePageSizeChange(size: string) {
    const params = new URLSearchParams(searchParams)
    params.set('size', size)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const renderPagination = () => {
    if (totalPages <= 1 && PAGE_SIZE_OPTIONS.indexOf(pageSize) <= PAGE_SIZE_OPTIONS.indexOf(20)) return null

    const items = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          href="#" 
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(currentPage - 1)
          }}
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    )

    items.push(
      <PaginationItem key="1">
        <PaginationLink 
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(1)
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )

    if (showEllipsisStart) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (showEllipsisEnd) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          href="#" 
          onClick={(e) => {
            e.preventDefault()
            handlePageChange(currentPage + 1)
          }}
          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    )

    return (
      <div className="flex items-center justify-end mt-4">
        <Pagination>
          <PaginationContent>
            {items}
          </PaginationContent>
        </Pagination>
      </div>
    )
  }

  const renderPageSizeSelector = () => (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Mostrar</span>
      <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">por página</span>
      <span className="text-sm text-muted-foreground ml-auto">
        Total: {totalCount} registros
      </span>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {initialVehicles.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No hay registros coincidentes.
        </div>
      )}

      {/* Mobile: Cards view */}
      <div className="md:hidden flex flex-col gap-3">
        {renderPageSizeSelector()}
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
                      {format(new Date(vehicle.created_at), 'dd MMM yyyy, HH:mm', { locale: es })}
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 italic">
                      ID: {vehicle.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop: Table view */}
      <div className="hidden md:block">
        {renderPageSizeSelector()}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Marca</TableHead>
                <TableHead className="w-[200px]">Submarca</TableHead>
                <TableHead className="w-[100px]">Modelo</TableHead>
                <TableHead className="w-[120px]">Tipo de Prueba</TableHead>
                <TableHead className="w-[180px]">Fecha de Registro</TableHead>
                <TableHead className="text-right w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.sub_brand}</TableCell>
                  <TableCell>{vehicle.model_year}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(vehicle.created_at), 'dd MMM yyyy, HH:mm', { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">
                    <VehicleCardActions
                      vehicle={vehicle}
                      onEdit={(v) => setEditingVehicle(v)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {renderPagination()}
      </div>

      {/* Mobile pagination */}
      <div className="md:hidden mt-4">
        {renderPagination()}
      </div>

      <VehicleForm
        editingVehicle={editingVehicle}
        onSuccess={() => setEditingVehicle(null)}
      />
    </div>
  )
}
