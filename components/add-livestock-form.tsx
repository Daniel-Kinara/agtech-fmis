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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export function AddLivestockForm({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      tag_number: formData.get("tag_number"),
      species: formData.get("species"),
      breed: formData.get("breed"),
      status: "Healthy",
    }

    const { error } = await supabase.from("livestock").insert([payload])

    if (error) {
      alert("Error adding animal: " + error.message)
    } else {
      setOpen(false)
      onRefresh() // This reloads the list automatically
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Animal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="tag_number" placeholder="Tag Number (e.g. COW-04)" required />
          <Select name="species" required>
            <SelectTrigger>
              <SelectValue placeholder="Select Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cattle">Cattle</SelectItem>
              <SelectItem value="Goat">Goat</SelectItem>
              <SelectItem value="Sheep">Sheep</SelectItem>
            </SelectContent>
          </Select>
          <Input name="breed" placeholder="Breed (e.g. Friesian)" />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving to Database..." : "Save Animal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}