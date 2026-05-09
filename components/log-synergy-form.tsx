"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Loader2, Plus, ArrowRightLeft, Leaf, Beef } from "lucide-react"

export function LogSynergyForm({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fields, setFields] = useState<any[]>([])
  const [transferType, setTransferType] = useState<'Fodder' | 'Manure'>('Fodder')

  // Fetch fields to populate the source/destination dropdowns
  useEffect(() => {
    async function getFields() {
      const { data } = await supabase.from("fields").select("id, name, current_crop")
      setFields(data || [])
    }
    if (open) getFields()
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)

    // Construct the payload, ensuring IDs/Names are treated as strings
    const payload = {
      type: transferType,
      source_id: formData.get("source")?.toString(),
      destination_id: formData.get("destination")?.toString(),
      quantity: parseFloat(formData.get("quantity") as string),
      unit: formData.get("unit"),
      notes: formData.get("notes"),
      log_date: new Date().toISOString().split('T')[0]
    }

    const { error } = await supabase.from("mixed_farming_logs").insert([payload])

    if (error) {
      alert("Error: " + error.message)
    } else {
      setOpen(false)
      onRefresh()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700 shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Log Resource Transfer
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-amber-500" />
            Resource Transfer
          </DialogTitle>
        </DialogHeader>

        {/* Transfer Type Toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-4">
          <Button 
            type="button"
            variant={transferType === 'Fodder' ? 'secondary' : 'ghost'} 
            className={`flex-1 text-xs transition-all ${
              transferType === 'Fodder' ? 'bg-white shadow-sm' : ''
            }`} 
            onClick={() => setTransferType('Fodder')}
          >
            <Leaf className="mr-2 h-3 w-3 text-emerald-500" /> Fodder/Crops
          </Button>
          <Button 
            type="button"
            variant={transferType === 'Manure' ? 'secondary' : 'ghost'} 
            className={`flex-1 text-xs transition-all ${
              transferType === 'Manure' ? 'bg-white shadow-sm' : ''
            }`} 
            onClick={() => setTransferType('Manure')}
          >
            <Beef className="mr-2 h-3 w-3 text-orange-500" /> Manure/Livestock
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Source Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-bold">
                {transferType === 'Fodder' ? 'Source Field' : 'Source (e.g. Dairy Barn)'}
              </Label>
              {transferType === 'Fodder' ? (
                <Select name="source" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name} {f.current_crop ? `(${f.current_crop})` : '(Fallow)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input name="source" placeholder="e.g. Barn A" required />
              )}
            </div>

            {/* Destination Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-bold">
                {transferType === 'Fodder' ? 'Destination (e.g. Beef Cows)' : 'Destination Field'}
              </Label>
              {transferType === 'Manure' ? (
                <Select name="destination" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input name="destination" placeholder="e.g. Dairy Unit" required />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Quantity</Label>
              <Input name="quantity" type="number" step="0.1" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold">Unit</Label>
              <Select name="unit" defaultValue={transferType === 'Fodder' ? 'Bales' : 'Tons'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bales">Bales</SelectItem>
                  <SelectItem value="Tons">Tons</SelectItem>
                  <SelectItem value="KGs">KGs</SelectItem>
                  <SelectItem value="Crates">Crates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">Notes</Label>
            <Input name="notes" placeholder="Additional details..." />
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm Transfer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}