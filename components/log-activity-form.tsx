"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X } from "lucide-react"

interface LogActivityFormProps {
  fieldId: string
  onRefresh: () => void
}

export function LogActivityForm({ fieldId, onRefresh }: LogActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const type = formData.get("type") as string
    const cropName = formData.get("crop_name") as string
    const newStatus = formData.get("status") as string

    try {
      // 1. Insert the activity into crop_activities
      const { error: activityError } = await supabase
        .from("crop_activities")
        .insert([{
          field_id: fieldId,
          activity_type: type,
          notes: formData.get("notes"),
          cost: parseFloat(formData.get("cost") as string || "0"),
          activity_date: formData.get("date")
        }])

      if (activityError) throw activityError

      // 2. Update the field status and current crop in the 'fields' table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData:any = { status: newStatus }
     
      if (type === "Planting") updateData.current_crop = cropName
      if (type === "Harvest") updateData.current_crop = null

      const { error: fieldError } = await supabase
        .from("fields")
        .update(updateData)
        .eq("id", fieldId)

      if (fieldError) throw fieldError

      setShowForm(false)
      onRefresh()
    } catch (err) {
      const error = err as Error
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} variant="outline" className="w-full border-dashed">
        <Plus className="mr-2 h-4 w-4" /> Log Field Activity
      </Button>
    )
  }

  return (
    <div className="relative p-4 border rounded-xl bg-slate-50 border-slate-200 animate-in slide-in-from-top-2">
      <button onClick={() => setShowForm(false)} className="absolute right-2 top-2 text-slate-400"><X className="h-4 w-4" /></button>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold">Activity Type</Label>
            <Select name="type" defaultValue="Planting">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planting">Planting</SelectItem>
                <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                <SelectItem value="Pesticide">Pesticide</SelectItem>
                <SelectItem value="Harvest">Harvest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold">Update Status</Label>
            <Select name="status" defaultValue="Active">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preparation">Preparation</SelectItem>
                <SelectItem value="Active">Active (Growing)</SelectItem>
                <SelectItem value="Harvesting">Harvesting</SelectItem>
                <SelectItem value="Fallow">Fallow (Resting)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] uppercase font-bold">Crop Name (if planting)</Label>
          <Input name="crop_name" className="h-8 text-xs" placeholder="e.g. Maize, Tomatoes" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold">Cost (KES)</Label>
            <Input name="cost" type="number" className="h-8 text-xs" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase font-bold">Date</Label>
            <Input name="date" type="date" className="h-8 text-xs" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <Button type="submit" size="sm" className="w-full bg-emerald-600" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Activity"}
        </Button>
      </form>
    </div>
  )
}