"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Beaker, X, Plus } from "lucide-react"

export function AddSoilTestForm({ fieldId, onRefresh }: { fieldId: string, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const payload = {
      field_id: fieldId,
      ph_level: parseFloat(formData.get("ph") as string),
      moisture_percentage: parseInt(formData.get("moisture") as string),
      nitrogen_level: formData.get("nitrogen"),
      phosphorus_level: formData.get("phosphorus"),
      potassium_level: formData.get("potassium"),
      notes: formData.get("notes"),
      test_date: formData.get("date")
    }

    const { error } = await supabase.from("soil_health").insert([payload])

    if (error) {
      alert("Error: " + error.message)
    } else {
      setShowForm(false)
      onRefresh()
    }
    setLoading(false)
  }

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} variant="outline" className="w-full border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100">
        <Plus className="mr-2 h-4 w-4" /> New Soil Analysis
      </Button>
    )
  }

  return (
    <div className="relative p-4 border rounded-xl bg-slate-900/20 shadow-inner animate-in fade-in zoom-in duration-200">
      <button onClick={() => setShowForm(false)} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
        <X className="h-4 w-4" />
      </button>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <Beaker className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-tighter">Lab Results</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] font-bold">pH Level</Label>
            <Input name="ph" type="number" step="0.1" placeholder="6.5" required className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-bold">Moisture %</Label>
            <Input name="moisture" type="number" placeholder="40" className="h-8 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {['Nitrogen', 'Phosphorus', 'Potassium'].map((nutrient) => (
            <div key={nutrient} className="space-y-1">
              <Label className="text-[10px] font-bold">{nutrient[0]}</Label>
              <Select name={nutrient.toLowerCase()} defaultValue="Medium">
                <SelectTrigger className="h-8 text-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Med</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] font-bold">Test Date</Label>
          <Input name="date" type="date" className="h-8 text-xs" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <Button type="submit" size="sm" className="w-full bg-emerald-600" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Soil Data"}
        </Button>
      </form>
    </div>
  )
}