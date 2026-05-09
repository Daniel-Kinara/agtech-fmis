"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Map } from "lucide-react"

export function AddFieldForm({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get("name"),
      size_acres: parseFloat(formData.get("size") as string),
      soil_type: formData.get("soil"),
      current_crop: formData.get("current_crop") || null, // Add this line
      status: formData.get("current_crop") ? "Active" : "Preparation", // Auto-set status
    }

    const { error } = await supabase.from("fields").insert([payload])

    if (error) {
      alert("Error saving field: " + error.message)
    } else {
      setOpen(false)
      onRefresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add New Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Map className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Land Registry</span>
          </div>
          <DialogTitle>Register Field/Plot</DialogTitle>
          <DialogDescription>
            Define the physical area before tracking crop cycles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Field Name</Label>
            <Input id="name" name="name" placeholder="e.g. West Orchard" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size (Acres)</Label>
              <Input id="size" name="size" type="number" step="0.1" placeholder="0.0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil">Soil Type</Label>
              <Select name="soil" defaultValue="Loamy">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Loamy">Loamy</SelectItem>
                  <SelectItem value="Sandy">Sandy</SelectItem>
                  <SelectItem value="Clay">Clay</SelectItem>
                  <SelectItem value="Silt">Silt</SelectItem>
                  <SelectItem value="Black Cotton">Black Cotton</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="current_crop">Current Crop (Optional)</Label>
            <Input 
              id="current_crop" 
              name="current_crop" 
              placeholder="e.g. Maize (Leave blank if empty)" 
            />
            <p className="text-[10px] text-slate-500 italic">
              If you enter a crop, the field status will automatically set to &quot;Active&quot;.
            </p>
          </div>
          <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Register Plot"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}