"use client"

import React, { useEffect, useState, useCallback } from "react"
import { 
  Loader2, Sprout, Map as MapIcon, ChevronRight, 
  Layers, TrendingUp, Wheat, Trash2 
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddFieldForm } from "@/components/add-field-form"
import { FieldActivitySidebar } from "@/components/field-activity-sidebar"
import { calculateHarvestReadiness } from "@/utils/crop-intelligence";
import { CropIntelligenceCard } from "@/components/crops/CropIntelligenceCard";


export default function CropsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fields, setFields] = useState<any[]>([])
  const [totalHarvest, setTotalHarvest] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedField, setSelectedField] = useState<{id: string, name: string} | null>(null)
  

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const { data: fieldsData } = await supabase.from("fields").select("*").order("name")
      const { data: harvestData } = await supabase.from("harvests").select("quantity")
      const totalWeight = harvestData?.reduce((sum, h) => sum + (Number(h.quantity) || 0), 0) || 0
      setFields(fieldsData || [])
      setTotalHarvest(totalWeight)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData() }, [fetchData])

  const deleteField = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation()
    if (!confirm(`Delete "${name}"?`)) return
    await supabase.from("fields").delete().eq("id", id)
    fetchData()
  }

  const totalAcres = fields.reduce((acc, f) => acc + (Number(f.size_acres) || 0), 0)
  const activeFields = fields.filter(f => f.status === 'Active').length

  if (loading && fields.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    )
  }

  return (
    <div className="flex-col flex min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Crop Management</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monitor field cycles and production.</p>
          </div>
          <div className="w-full sm:w-auto">
            <AddFieldForm onRefresh={fetchData} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Land" value={`${totalAcres.toFixed(1)} Ac`} icon={<Layers className="text-slate-400" />} />
          <StatCard title="Active Plots" value={activeFields} icon={<Sprout className="text-emerald-500" />} />
          <StatCard title="Harvest" value={`${totalHarvest.toLocaleString()} KG`} icon={<Wheat className="text-amber-500" />} />
          <StatCard title="Avg Size" value={`${(totalAcres / (fields.length || 1)).toFixed(1)} Ac`} icon={<TrendingUp className="text-blue-500" />} />
        </div>

        {/* Registry Card */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">Field Registry</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead className="dark:text-slate-300">Field Name</TableHead>
                    <TableHead className="dark:text-slate-300">Crop</TableHead>
                    <TableHead className="dark:text-slate-300">Size</TableHead>
                    <TableHead className="dark:text-slate-300">Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow 
                      key={field.id} 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                      onClick={() => setSelectedField({ id: field.id, name: field.name })}
                    >
                      <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <MapIcon className="h-4 w-4 text-slate-400" />
                          {field.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800">
                          {field.current_crop || "Fallow"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{field.size_acres} Ac</TableCell>
                      <TableCell>
                        <StatusBadge status={field.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => deleteField(e, field.id, field.name)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <FieldActivitySidebar fieldId={selectedField?.id || ""} fieldName={selectedField?.name || ""} isOpen={!!selectedField} onClose={() => setSelectedField(null)} onFieldUpdate={fetchData} />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ title, value, icon }: any) {
  return (
    <Card className="shadow-sm border-none bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active'
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600"}`} />
      <span className="text-[10px] font-bold uppercase text-slate-700 dark:text-slate-300">{status}</span>
    </div>
  )
}