"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddSoilTestForm } from "./add-soil-test-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Beaker, Thermometer, Trash2, Loader2 } from "lucide-react"

export function SoilHealthLog({ fieldId }: { fieldId: string }) {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSoilData = async () => {
      setLoading(true)
      const { data } = await supabase
        .from("soil_health")
        .select("*")
        .eq("field_id", fieldId)
        .order("test_date", { ascending: false })
      setLogs(data || [])
      setLoading(false)
    }
    fetchSoilData()
  }, [fieldId])

  function fetchSoilData(): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="space-y-6">
      {/* Summary Mini-Cards */}
      <AddSoilTestForm fieldId={fieldId} onRefresh={fetchSoilData} />
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 border rounded-lg bg-emerald-50/50">
          <Label className="text-[10px] uppercase text-emerald-700 font-bold">Latest pH</Label>
          <div className="text-xl font-bold text-emerald-900">{logs[0]?.ph_level || "--"}</div>
        </div>
        <div className="p-3 border rounded-lg bg-blue-50/50">
          <Label className="text-[10px] uppercase text-blue-700 font-bold">Moisture</Label>
          <div className="text-xl font-bold text-blue-900">{logs[0]?.moisture_percentage || "0"}%</div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-[10px]">DATE</TableHead>
              <TableHead className="text-[10px]">pH</TableHead>
              <TableHead className="text-[10px]">NPK</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs">{new Date(log.test_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-xs font-bold">{log.ph_level}</TableCell>
                <TableCell className="text-[10px] uppercase font-mono">
                  {log.nitrogen_level[0]}|{log.phosphorus_level[0]}|{log.potassium_level[0]}
                </TableCell>
                <TableCell>
                   <button className="text-slate-300 hover:text-red-500"><Trash2 className="h-3 w-3"/></button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}