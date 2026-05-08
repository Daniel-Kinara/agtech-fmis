"use client"

import React, { useState } from 'react'
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef 
} from "@tanstack/react-table"

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Beef, Plus, Search, Filter } from "lucide-react"

// 1. Define the Data Type to fix TypeScript errors
type Livestock = {
  id: string
  tagId: string
  species: string
  breed: string
  health: 'Healthy' | 'Treatment' | 'Critical'
  weight: number
}

// 2. Mock Data
const initialData: Livestock[] = [
  { id: "1", tagId: "SF-442", species: "Cattle", breed: "Angus", health: "Healthy", weight: 520 },
  { id: "2", tagId: "SF-881", species: "Sheep", breed: "Merino", health: "Treatment", weight: 65 },
  { id: "3", tagId: "SF-102", species: "Cattle", breed: "Boran", health: "Healthy", weight: 480 },
  { id: "4", tagId: "SF-229", species: "Goat", breed: "Boer", health: "Critical", weight: 42 },
]

export default function LivestockPage() {
  const [globalFilter, setGlobalFilter] = useState("")

  // Local handler for the form to ensure the page works without external action files
  async function handleAddAnimal(formData: FormData) {
    const newAnimal = {
      tagId: formData.get("tagId"),
      species: formData.get("species"),
      breed: formData.get("breed"),
      weight: formData.get("weight"),
    }
    console.log("Saving to SmartFarm Database...", newAnimal)
    alert(`Animal ${newAnimal.tagId} has been queued for registration.`)
  }

  // 3. Columns Definition with Strict Typing
  const columns: ColumnDef<Livestock>[] = [
    {
      accessorKey: "tagId",
      header: "Ear Tag",
      cell: ({ row }) => <span className="font-bold text-slate-900">{row.original.tagId}</span>,
    },
    {
      accessorKey: "species",
      header: "Species",
    },
    {
      accessorKey: "breed",
      header: "Breed",
    },
    {
      accessorKey: "health",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.health
        return (
          <Badge 
            variant="outline"
            className={
              status === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
              status === 'Treatment' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
              'bg-rose-50 text-rose-700 border-rose-200'
            }
          >
            {status}
          </Badge>
        )
      }
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: ({ row }) => <span className="font-medium">{row.original.weight} Kg</span>,
    },
  ]

  const table = useReactTable({
    data: initialData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Beef className="text-green-700" /> Livestock Manager
          </h1>
          <p className="text-slate-500">Track and monitor your farm&apos;s animal assets.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-700 hover:bg-green-800 h-12 px-6 shadow-sm">
              <Plus className="mr-2 h-5 w-5" /> Register Animal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>New Animal Entry</DialogTitle>
              <DialogDescription>Input the ear tag and health status to sync with SmartFarm.</DialogDescription>
            </DialogHeader>
            <form action={handleAddAnimal} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Ear Tag ID</label>
                <Input name="tagId" placeholder="e.g. SF-700" required className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Species</label>
                  <Input name="species" placeholder="Cattle" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Weight (Kg)</label>
                  <Input name="weight" type="number" placeholder="400" className="h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Breed</label>
                <Input name="breed" placeholder="Boran / Angus" className="h-11" />
              </div>
              <Button type="submit" className="w-full bg-green-700 h-12 text-lg font-bold mt-2">
                Save Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-white border-b py-4 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by tag, species, or breed..." 
                className="pl-10 h-11 bg-slate-50 border-slate-200"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-11 px-6 border-slate-200 text-slate-600">
              <Filter className="mr-2 h-4 w-4" /> More Filters
            </Button>
          </div>
        </CardHeader>
        
        {/* Table Content */}
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-bold text-slate-700 h-14">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                    No matching animals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-slate-50/30">
          <p className="text-sm text-slate-500 font-medium">
            Showing {table.getRowModel().rows.length} of {initialData.length} livestock
          </p>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}