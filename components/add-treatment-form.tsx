"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X } from "lucide-react"

interface AddTreatmentFormProps {
  animalId: string
  onRefresh: () => void
}

export function AddTreatmentForm({ animalId, onRefresh }: AddTreatmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const payload = {
      animal_id: animalId,
      medicine_name: formData.get("medicine"),
      dosage: formData.get("dosage"),
      reason: formData.get("reason"),
      treatment_date: formData.get("date"),
    }

    const { error } = await supabase.from("treatments").insert([payload])

    if (error) {
      alert("Error saving treatment: " + error.message)
    } else {
      setShowForm(false)
      onRefresh() // Triggers the list update in the parent sidebar
    }
    setLoading(false)
  }

  if (!showForm) {
    return (
      <Button 
        onClick={() => setShowForm(true)} 
        variant="outline" 
        className="w-full border-dashed border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700"
      >
        <Plus className="mr-2 h-4 w-4" /> Log New Treatment
      </Button>
    )
  }

  return (
    <div className="relative p-4 border rounded-xl bg-slate-50 border-slate-200 shadow-sm animate-in fade-in zoom-in duration-200">
      <button 
        onClick={() => setShowForm(false)}
        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Medicine
            </Label>
            <Input 
              name="medicine" 
              className="h-9 text-sm bg-white" 
              placeholder="e.g. Ivermectin" 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Dosage
            </Label>
            <Input 
              name="dosage" 
              className="h-9 text-sm bg-white" 
              placeholder="e.g. 5ml" 
              required 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Reason / Notes
          </Label>
          <Input 
            name="reason" 
            className="h-9 text-sm bg-white" 
            placeholder="e.g. Routine deworming" 
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Date of Treatment
          </Label>
          <Input 
            name="date" 
            type="date" 
            className="h-9 text-sm bg-white" 
            defaultValue={new Date().toISOString().split('T')[0]} 
          />
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Confirm Treatment"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}