"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X, Banknote, Calendar as CalendarIcon, Zap, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogActivityFormProps {
  fieldId: string
  onRefresh: () => void
}

export function LogActivityForm({ fieldId, onRefresh }: LogActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState("Planting")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const type = formData.get("type") as string
    const cropName = formData.get("crop_name") as string
    const newStatus = formData.get("status") as string

    try {
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = { status: newStatus }
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
      console.error("Form Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out border border-slate-100 overflow-hidden",
      showForm ? "rounded-[1.2rem] bg-slate-900/20 shadow-lg p-4" : "rounded-full bg-slate-50/80 p-1.5 pr-4"
    )}>
      
      {/* Ultra-Compact Trigger Bar */}
      <div 
        className={cn(
          "flex items-center justify-between cursor-pointer",
          !showForm && "hover:bg-slate-100/50 transition-colors"
        )}
        onClick={() => !showForm && setShowForm(true)}
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center justify-center rounded-full transition-all duration-300",
            showForm ? "h-6 w-6 bg-emerald-500 text-white" : "h-7 w-7 bg-slate-900 text-white"
          )}>
            {showForm ? <Zap className="h-3 w-3" /> : <Plus className="h-4 w-4" />}
          </div>
          <span className={cn(
            "font-black uppercase tracking-[0.15em] transition-all",
            showForm ? "text-[9px] text-slate-400" : "text-[10px] text-slate-900"
          )}>
            {showForm ? "New Entry Mode" : "Log Activity"}
          </span>
        </div>
        
        {showForm && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); setShowForm(false); }}
            className="h-6 w-6 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Form Content: Tight spacing to keep 'Save' visible */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label className="text-[8px] uppercase font-black tracking-widest text-slate-400 ml-1">Type</Label>
              <Select name="type" defaultValue={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-8 rounded-lg bg-slate-50/50 border-slate-100 font-bold text-[10px]">
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
              <Label className="text-[8px] uppercase font-black tracking-widest text-slate-400 ml-1">Status</Label>
              <Select name="status" defaultValue="Active">
                <SelectTrigger className="h-8 rounded-lg bg-slate-50/50 border-slate-100 font-bold text-[10px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preparation">Preparation</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Harvesting">Harvesting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedType === "Planting" && (
            <div className="space-y-1 animate-in zoom-in-95">
              <Label className="text-[8px] uppercase font-black tracking-widest text-slate-400 ml-1">Crop Name</Label>
              <Input name="crop_name" className="h-8 rounded-lg bg-slate-50/50 border-slate-100 font-bold text-[10px]" placeholder="Maize, etc." required />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <Label className="text-[8px] uppercase font-black tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                <Banknote className="h-2.5 w-2.5" /> Cost
              </Label>
              <Input name="cost" type="number" className="h-8 rounded-lg bg-slate-50/50 border-slate-100 font-bold text-[10px]" placeholder="0.00" />
            </div>
            <div className="space-y-1">
              <Label className="text-[8px] uppercase font-black tracking-widest text-slate-400 ml-1 flex items-center gap-1">
                <CalendarIcon className="h-2.5 w-2.5" /> Date
              </Label>
              <Input name="date" type="date" className="h-8 rounded-lg bg-slate-50/50 border-slate-100 font-bold text-[10px]" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 font-black uppercase text-[9px] tracking-[0.2em] shadow-md transition-all active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Activity"}
          </Button>
        </form>
      )}
    </div>
  )
}