"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Wheat, Trash2, TrendingUp } from "lucide-react"

export function HarvestLog({ fieldId, currentCrop }: { fieldId: string, currentCrop: string | null }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [harvests, setHarvests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchHarvests = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("harvests")
      .select("*")
      .eq("field_id", fieldId)
      .order("harvest_date", { ascending: false })
    setHarvests(data || [])
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchHarvests() }, [fieldId])

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

  return (
    <div className="space-y-6">
      {/* Quick Entry Form */}
      {currentCrop ? (
        <form onSubmit={handleAddHarvest} className="p-4 border rounded-xl bg-amber-50/30 border-amber-100 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 mb-2 font-bold text-xs uppercase">
            <Wheat className="h-4 w-4" /> Record {currentCrop} Harvest
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px]">Quantity</Label>
              <Input name="qty" type="number" step="0.1" required className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Unit</Label>
              <Select name="unit" defaultValue="KGs">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KGs">KGs</SelectItem>
                  <SelectItem value="Bags">Bags</SelectItem>
                  <SelectItem value="Crates">Crates</SelectItem>
                  <SelectItem value="Tonnes">Tonnes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px]">Date</Label>
            <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="h-8 text-xs" />
          </div>
          <Button type="submit" size="sm" className="w-full bg-amber-600 hover:bg-amber-700" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Yield"}
          </Button>
        </form>
      ) : (
        <div className="p-4 border border-dashed rounded-xl text-center text-slate-400 text-xs">
          No active crop to harvest. Plant a crop first!
        </div>
      )}

      {/* Historical Yields */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <TrendingUp className="h-3 w-3" /> Production History
        </h4>
        <div className="rounded-md border">
          <Table>
            <TableBody>
              {harvests.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs font-bold">{h.crop_name}</TableCell>
                  <TableCell className="text-xs">{h.quantity} {h.unit}</TableCell>
                  <TableCell className="text-[10px] text-slate-500">
                    {new Date(h.harvest_date).toLocaleDateString()}
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