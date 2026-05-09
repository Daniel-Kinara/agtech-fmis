"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, ArrowRightLeft, Leaf, Beef } from "lucide-react"

export function LogSynergyForm({ onRefresh }: { onRefresh: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fields, setFields] = useState<any[]>([])
  const [transferType, setTransferType] = useState<'Fodder' | 'Manure'>('Fodder')

  useEffect(() => {
    async function getFields() {
      const { data } = await supabase.from("fields").select("id, name")
      setFields(data || [])
    }
    if (open) getFields()
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const { error } = await supabase.from("mixed_farming_logs").insert([{
      type: transferType,
      source_id: formData.get("source")?.toString(),
      destination_id: formData.get("destination")?.toString(),
      quantity: parseFloat(formData.get("quantity") as string),
      unit: formData.get("unit"),
      notes: formData.get("notes"),
      log_date: new Date().toISOString().split('T')[0]
    }])

    if (!error) { setOpen(false); onRefresh(); }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 h-11">
          <Plus className="mr-2 h-4 w-4" /> Log Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[400px] rounded-2xl p-4 gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ArrowRightLeft className="h-5 w-5 text-amber-500" /> Resource Transfer
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <Button 
            type="button"
            variant="ghost" 
            className={`flex-1 h-9 text-xs rounded-lg transition-all ${transferType === 'Fodder' ? 'bg-white shadow-sm' : ''}`} 
            onClick={() => setTransferType('Fodder')}
          >
            <Leaf className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Fodder
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            className={`flex-1 h-9 text-xs rounded-lg transition-all ${transferType === 'Manure' ? 'bg-white shadow-sm' : ''}`} 
            onClick={() => setTransferType('Manure')}
          >
            <Beef className="mr-2 h-3.5 w-3.5 text-orange-500" /> Manure
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {transferType === 'Fodder' ? 'Source Field' : 'Source Barn'}
              </Label>
              {transferType === 'Fodder' ? (
                <Select name="source" required>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select Field" /></SelectTrigger>
                  <SelectContent>{fields.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                </Select>
              ) : <Input name="source" placeholder="e.g. Dairy Barn" className="h-11" required />}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Destination</Label>
              {transferType === 'Manure' ? (
                <Select name="destination" required>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select Field" /></SelectTrigger>
                  <SelectContent>{fields.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
                </Select>
              ) : <Input name="destination" placeholder="e.g. Beef Herd" className="h-11" required />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Qty</Label>
              <Input name="quantity" type="number" step="0.1" className="h-11" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Unit</Label>
              <Select name="unit" defaultValue="KGs">
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="KGs">KGs</SelectItem>
                  <SelectItem value="Tons">Tons</SelectItem>
                  <SelectItem value="Bales">Bales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-amber-600 h-11 rounded-xl" disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Complete Log"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}