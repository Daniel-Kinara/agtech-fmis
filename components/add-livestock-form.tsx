"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

export function AddLivestockForm({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Exact mapping for your 5 columns
    const payload = {
      tag_number: formData.get("tag_number"),
      species: formData.get("species"),
      breed: formData.get("breed"),
      status: formData.get("status"),
      weight: formData.get("weight") ? parseFloat(formData.get("weight") as string) : 0,
    }

    const { error } = await supabase.from("livestock").insert([payload])

    if (error) {
      alert("Error: " + error.message)
    } else {
      setOpen(false)
      onRefresh() // Refreshes the list on the main page
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Add Livestock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          <div className="space-y-2">
            <Label htmlFor="tag_number">Tag Number</Label>
            <Input id="tag_number" name="tag_number" placeholder="e.g. COW-001" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select name="species" required>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cattle">Cattle</SelectItem>
                  <SelectItem value="Goat">Goat</SelectItem>
                  <SelectItem value="Sheep">Sheep</SelectItem>
                  <SelectItem value="Pig">Pig</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" step="0.1" placeholder="0.0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input id="breed" name="breed" placeholder="e.g. Boran / Friesian" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="Healthy">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Healthy">Healthy</SelectItem>
                <SelectItem value="Sick">Sick</SelectItem>
                <SelectItem value="Quarantined">Quarantined</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save to Inventory"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}