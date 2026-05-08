"use client"

import React, { useState } from 'react'
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel,
  getFilteredRowModel 
} from "@tanstack/react-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Beef, Plus, Search } from "lucide-react"

// Sample Data Structure based on our Schema
const data = [
  { id: "1", tag: "SF-001", species: "Cattle", breed: "Angus", health: "Healthy", weight: "520kg" },
  { id: "2", tag: "SF-002", species: "Sheep", breed: "Merino", health: "Treatment", weight: "65kg" },
  { id: "3", tag: "SF-003", species: "Cattle", breed: "Hereford", health: "Healthy", weight: "490kg" },
  { id: "4", tag: "SF-004", species: "Goat", breed: "Boer", health: "Critical", weight: "45kg" },
]

export default function LivestockPage() {
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = [
    { accessorKey: "tag", header: "Ear Tag" },
    { accessorKey: "species", header: "Species" },
    { accessorKey: "breed", header: "Breed" },
    { 
      accessorKey: "health", 
      header: "Status",
      cell: ({ row }: {row: {getValue: (key: string) => string}}) => {
        const status = row.getValue("health")
        return (
          <Badge className={
            status === 'Healthy' ? 'bg-green-100 text-green-800' : 
            status === 'Treatment' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }>
            {status}
          </Badge>
        )
      }
    },
    { accessorKey: "weight", header: "Weight" },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Beef className="text-green-700" /> Livestock Manager
          </h1>
          <p className="text-slate-500">Track individual animal performance and health.</p>
        </div>
        <Button className="bg-green-700 hover:bg-green-800 w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add New Animal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by tag or breed..." 
              className="pl-10"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}