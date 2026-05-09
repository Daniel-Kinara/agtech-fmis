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
  Trash2
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AddFieldForm } from "@/components/add-field-form"
import { FieldActivitySidebar } from "@/components/field-activity-sidebar"
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
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the shape of our Field data
interface Field {
  id: string
  name: string
  size_acres: number
  soil_type: string
  current_crop: string | null
  status: string
  created_at: string
}

export default function CropsPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for the Activity Sidebar
  const [selectedField, setSelectedField] = useState<{id: string, name: string} | null>(null)

  const fetchFields = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: supabaseError } = await supabase
        .from("fields")
        .select("*")
        .order("name", { ascending: true })

      if (supabaseError) throw supabaseError
      setFields(data || [])
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to load fields.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFields()
  }, [fetchFields])
  const deleteField = async (e: React.MouseEvent, id: string, name: string) => {
  // Prevent the row click (which opens the sidebar) from firing
  e.stopPropagation();

  if (!confirm(`Are you sure you want to delete "${name}"? This will also remove all its activity history.`)) return;

  try {
    const { error } = await supabase
      .from("fields")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Update local state to remove the field from the UI
    setFields(prev => prev.filter(f => f.id !== id));
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    alert("Error deleting field: " + err.message);
  }
};

  // Calculate quick stats
  const totalAcres = fields.reduce((acc, f) => acc + (Number(f.size_acres) || 0), 0)
  const activeFields = fields.filter(f => f.status === 'Active').length

  return (
    <div className="flex-col flex min-h-screen bg-slate-50/30">
      <div className="flex-1 space-y-4 p-8 pt-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Crop Management</h2>
            <p className="text-sm text-muted-foreground">Monitor field cycles, soil health, and harvests.</p>
          </div>
          <AddFieldForm onRefresh={fetchFields} />
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Land Size</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAcres.toFixed(2)} Acres</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
              <Sprout className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeFields} Plots</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Plot Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {fields.length > 0 ? (totalAcres / fields.length).toFixed(1) : 0} Ac
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Fields Table */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Field Registry</CardTitle>
            <CardDescription>Click a row to view activity history or log new actions.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                <p className="text-slate-500 font-medium">Fetching field data...</p>
              </div>
            ) : fields.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-xl border-slate-200">
                <p className="text-slate-400">No fields registered yet. Use the button above to add your first plot.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="font-semibold">Field Name</TableHead>
                    <TableHead className="font-semibold">Current Crop</TableHead>
                    <TableHead className="font-semibold">Soil Type</TableHead>
                    <TableHead className="font-semibold text-right">Size</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow 
                      key={field.id} 
                      className="cursor-pointer hover:bg-slate-50/80 transition-colors group"
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
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex w-fit items-center gap-1">
                            <Sprout className="h-3 w-3" />
                            {field.current_crop}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Fallow / Empty</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600">{field.soil_type}</TableCell>
                      <TableCell className="text-right font-mono text-slate-600">
                        {Number(field.size_acres).toFixed(1)} Ac
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            field.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 
                            field.status === 'Preparation' ? 'bg-blue-400' : 'bg-slate-300'
                          }`} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">
                            {field.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={(e) => deleteField(e, field.id, field.name)}
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Field"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Sidebar Component */}
      <FieldActivitySidebar 
        fieldId={selectedField?.id || ""} 
        fieldName={selectedField?.name || ""}
        isOpen={!!selectedField}
        onClose={() => setSelectedField(null)}
        
        onFieldUpdate={fetchFields}
      />
    </div>
  )
}