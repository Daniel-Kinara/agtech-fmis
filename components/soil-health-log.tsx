"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Label } from "@/components/ui/label"
import { AddSoilTestForm } from "./add-soil-test-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Loader2, FlaskConical, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"

export function SoilHealthLog({ fieldId }: { fieldId: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchSoilData = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("soil_health")
      .select("*")
      .eq("field_id", fieldId)
      .order("test_date", { ascending: false })
    setLogs(data || [])
    setLoading(false)
  }, [fieldId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSoilData()
  }, [fetchSoilData])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const { error } = await supabase
        .from("soil_health")
        .delete()
        .eq("id", id)

      if (error) throw error
      
      setLogs((prev) => prev.filter(log => log.id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AddSoilTestForm fieldId={fieldId} onRefresh={fetchSoilData} />

      {/* Tactical Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-[#33363f] border border-white/5 shadow-xl">
          <Label className="text-[9px] uppercase text-emerald-400 font-black tracking-widest flex items-center gap-2">
            <FlaskConical className="h-3 w-3" /> Latest pH
          </Label>
          <div className="text-2xl font-black text-white mt-1">
            {logs[0]?.ph_level?.toFixed(1) || "--"}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[#33363f] border border-white/5 shadow-xl">
          <Label className="text-[9px] uppercase text-sky-400 font-black tracking-widest flex items-center gap-2">
            <Droplets className="h-3 w-3" /> Moisture
          </Label>
          <div className="text-2xl font-black text-white mt-1">
            {logs[0]?.moisture_percentage || "0"}%
          </div>
        </div>
      </div>

      {/* Professional Data Grid */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900/40 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-3">Analysis Date</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-3 text-center">pH</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-3 text-center">N | P | K</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-500 mx-auto" />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-[10px] uppercase font-black tracking-widest text-slate-600">
                  No telemetry recorded
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <TableCell className="text-[11px] font-bold text-slate-300">
                    {new Date(log.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-xs font-black text-white text-center">
                    {log.ph_level}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-[10px] font-mono font-black text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      {log.nitrogen_level[0]} · {log.phosphorus_level[0]} · {log.potassium_level[0]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <button 
                      onClick={() => handleDelete(log.id)}
                      disabled={deletingId === log.id}
                      className={cn(
                        "p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                        deletingId === log.id 
                          ? "bg-slate-800 text-slate-500" 
                          : "text-slate-600 hover:text-rose-500 hover:bg-rose-500/10"
                      )}
                    >
                      {deletingId === log.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}