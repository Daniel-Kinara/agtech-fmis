"use client"

import React, { useEffect, useState, useCallback } from "react"
import { 
  Loader2, 
  Sprout, 
  Map as MapIcon, 
  ChevronRight, 
  Layers, 
  TrendingUp,
  AlertCircle,
  Wheat,
  Trash2,
  Plus
} from "lucide-react"
import { supabase } from "@/lib/supabase"

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Custom Components
import { AddFieldForm } from "@/components/add-field-form"
import { FieldActivitySidebar } from "@/components/field-activity-sidebar"

export default function CropsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fields, setFields] = useState<any[]>([])
  const [totalHarvest, setTotalHarvest] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedField, setSelectedField] = useState<{id: string, name: string} | null>(null)

  // Fetch all dashboard data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      
      // 1. Fetch Fields Registry
      const { data: fieldsData, error: fieldsError } = await supabase
        .from("fields")
        .select("*")
        .order("name", { ascending: true })

      if (fieldsError) throw fieldsError

      // 2. Fetch Total Harvest Volume
      const { data: harvestData, error: harvestError } = await supabase
        .from("harvests")
        .select("quantity")
      
      if (harvestError) throw harvestError

      const totalWeight = harvestData?.reduce((sum, h) => sum + (Number(h.quantity) || 0), 0) || 0
      
      setFields(fieldsData || [])
      setTotalHarvest(totalWeight)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  // Delete Field Logic
  const deleteField = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation()
    if (!confirm(`Delete "${name}"? This will wipe all activities and harvests for this field.`)) return

    try {
      const { error } = await supabase.from("fields").delete().eq("id", id)
      if (error) throw error
      fetchData() // Refresh stats and list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert("Error: " + err.message)
    }
  }

  // Stats Calculations
  const totalAcres = fields.reduce((acc, f) => acc + (Number(f.size_acres) || 0), 0)
  const activeFields = fields.filter(f => f.status === 'Active').length

  if (loading && fields.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="flex-col flex min-h-screen bg-slate-50/30">
      <div className="flex-1 space-y-4 p-8 pt-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Crop Management</h2>
            <p className="text-sm text-muted-foreground">Monitor field cycles, soil health, and total production.</p>
          </div>
          <AddFieldForm onRefresh={fetchData} />
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-slate-500">Total Land Size</CardTitle>
              <Layers className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalAcres.toFixed(2)} Acres</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-slate-500">Active Crops</CardTitle>
              <Sprout className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{activeFields} Plots</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-slate-500">Total Harvest</CardTitle>
              <Wheat className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalHarvest.toLocaleString()} KGs</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-slate-500">Avg Plot Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {fields.length > 0 ? (totalAcres / fields.length).toFixed(1) : 0} Ac
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Registry Table */}
        <Card className="shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Field Registry</CardTitle>
            <p className="text-xs text-slate-500">Click a row to view activity history or log new actions.</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[250px]">Field Name</TableHead>
                  <TableHead>Current Crop</TableHead>
                  <TableHead>Soil Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow 
                    key={field.id} 
                    className="cursor-pointer group transition-colors hover:bg-slate-50/50"
                    onClick={() => setSelectedField({ id: field.id, name: field.name })}
                  >
                    <TableCell className="font-bold text-slate-700">
                      <div className="flex items-center gap-2">
                        <MapIcon className="h-4 w-4 text-slate-400" />
                        {field.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {field.current_crop ? (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100">
                          {field.current_crop}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Fallow / Empty</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">{field.soil_type}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{field.size_acres} Ac</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          field.status === 'Active' ? "bg-emerald-500 animate-pulse" : 
                          field.status === 'Preparation' ? "bg-blue-500" : "bg-slate-300"
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          {field.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => deleteField(e, field.id, field.name)}
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {fields.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-400 italic">
                      No fields found. Click &quot;Add New Field&quot; to begin.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Global Sidebar Component */}
        <FieldActivitySidebar 
          fieldId={selectedField?.id || ""} 
          fieldName={selectedField?.name || ""}
          isOpen={!!selectedField}
          onClose={() => setSelectedField(null)}
          onFieldUpdate={fetchData} 
        />
      </div>
    </div>
  )
}

// Utility function for conditional classes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}