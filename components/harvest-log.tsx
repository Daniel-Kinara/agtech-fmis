"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Loader2, Wheat, Trash2, TrendingUp, Calendar, Scale } from "lucide-react"
import { cn } from "@/lib/utils"

export function HarvestLog({ fieldId, currentCrop }: { fieldId: string, currentCrop: string | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [harvests, setHarvests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchHarvests = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("harvests")
      .select("*")
      .eq("field_id", fieldId)
      .order("harvest_date", { ascending: false })
    setHarvests(data || [])
    setLoading(false)
  }, [fieldId])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchHarvests() }, [fetchHarvests])

  async function handleAddHarvest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      field_id: fieldId,
      crop_name: currentCrop || "Unknown",
      quantity: parseFloat(formData.get("qty") as string),
      unit: formData.get("unit"),
      harvest_date: formData.get("date"),
    }

    const { error } = await supabase.from("harvests").insert([payload])
    if (!error) {
      fetchHarvests()
      e.currentTarget.reset()
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const { error } = await supabase.from("harvests").delete().eq("id", id)
    if (!error) {
      setHarvests((prev) => prev.filter(h => h.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Tactical Entry Form */}
      {currentCrop ? (
        <form onSubmit={handleAddHarvest} className="bg-[#33363f] border border-slate-600/50 rounded-2xl p-4 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Wheat className="h-4 w-4 fill-amber-400/20" />
            <span className="text-[11px] font-black uppercase tracking-widest">Record {currentCrop} Harvest</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 ml-1 flex items-center gap-1">
                <Scale className="h-3 w-3" /> Quantity
              </Label>
              <Input name="qty" type="number" step="0.1" required className="h-9 bg-slate-800/40 border-slate-600/50 text-white text-xs rounded-xl" placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-400 ml-1">Unit</Label>
              <Select name="unit" defaultValue="KGs">
                <SelectTrigger className="h-9 bg-slate-800/40 border-slate-600/50 text-white text-xs rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#33363f] border-slate-600 text-white">
                  <SelectItem value="KGs">KGs</SelectItem>
                  <SelectItem value="Bags">Bags</SelectItem>
                  <SelectItem value="Crates">Crates</SelectItem>
                  <SelectItem value="Tonnes">Tonnes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-400 ml-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Harvest Date
            </Label>
            <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="h-9 bg-slate-800/40 border-slate-600/50 text-white text-xs rounded-xl [color-scheme:dark]" />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[10px] tracking-[0.15em] h-10 rounded-2xl shadow-lg transition-all active:scale-[0.98]" 
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Yield"}
          </Button>
        </form>
      ) : (
        <div className="p-8 border border-dashed border-slate-700 rounded-2xl text-center bg-slate-900/20">
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">No active crop detected</p>
        </div>
      )}

      {/* 2. Production History List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
            <TrendingUp className="h-3 w-3" /> Production History
          </h4>
          <div className="h-px flex-1 bg-white/5 ml-4" />
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/20 overflow-hidden">
          <Table>
            <TableBody>
              {loading ? (
                <TableRow><TableCell className="h-20 text-center"><Loader2 className="h-5 w-5 animate-spin text-amber-500 mx-auto" /></TableCell></TableRow>
              ) : harvests.length === 0 ? (
                <TableRow><TableCell className="h-20 text-center text-[10px] uppercase font-black text-slate-600 tracking-widest">Archive Empty</TableCell></TableRow>
              ) : harvests.map((h) => (
                <TableRow key={h.id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-3">
                    <div className="text-[11px] font-black text-white uppercase">{h.crop_name}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">
                      {new Date(h.harvest_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-[11px] font-black text-amber-500 bg-amber-500/5 px-2 py-1 rounded-md border border-amber-500/10">
                      {h.quantity} {h.unit}
                    </span>
                  </TableCell>
                  <TableCell className="w-[50px] text-right pr-4">
                    <button 
                      onClick={() => handleDelete(h.id)}
                      disabled={deletingId === h.id}
                      className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      {deletingId === h.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}