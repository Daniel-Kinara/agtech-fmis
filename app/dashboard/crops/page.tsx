"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Loader2, Sprout, Plus, ChevronRight, Map } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Field {
  id: string
  name: string
  size_acres: number
  soil_type: string
  current_crop: string
  status: string
}

export default function CropsPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFields = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("fields")
        .select("*")
        .order("name", { ascending: true })

      if (error) throw error
      setFields(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchFields() }, [fetchFields])

  return (
    <div className="flex-col flex p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Crop Management</h2>
          <p className="text-muted-foreground text-sm">Track field usage and seasonal cycles.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Field
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Land</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fields.reduce((acc, f) => acc + (f.size_acres || 0), 0)} Acres
            </div>
          </CardContent>
        </Card>
        {/* Add more stats cards here as needed */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Current Crop</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id} className="cursor-pointer group">
                    <TableCell className="font-bold flex items-center gap-2">
                      <Map className="h-4 w-4 text-slate-400" /> {field.name}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Sprout className="h-3 w-3 text-emerald-500" /> {field.current_crop || "Empty"}
                      </span>
                    </TableCell>
                    <TableCell>{field.size_acres} Ac</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                        {field.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}