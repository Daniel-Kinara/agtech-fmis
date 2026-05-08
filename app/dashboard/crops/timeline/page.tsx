"use client"

import React, { useState } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Droplets, FlaskConical, Sprout, Hammer, ClipboardCheck } from "lucide-react"

export default function ActivityTimeline() {
  // 1. Local state to manage the new activity before sending to DB
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogActivity(formData: FormData) {
    setIsSubmitting(true)
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const data = {
      type: formData.get("activityType"),
      notes: formData.get("notes"),
      timestamp: new Date().toISOString()
    }
    
    console.log("Activity Logged:", data)
    setIsSubmitting(false)
    alert("Activity synced to Traceability Record!")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Timeline</h1>
          <p className="text-slate-500 font-medium italic">Your digital audit trail.</p>
        </div>

        {/* 2. THE QUICK-LOG DRAWER */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 shadow-lg">
              <Plus className="mr-2 h-5 w-5" /> Log Activity
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">Log Farm Action</SheetTitle>
              <SheetDescription>
                This action will be added to the crop&apos;s permanent traceability record.
              </SheetDescription>
            </SheetHeader>

            <form action={handleLogActivity} className="space-y-6 mt-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase">Activity Type</label>
                <Select name="activityType" required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="irrigation">
                      <div className="flex items-center gap-2"><Droplets size={16} className="text-blue-500"/> Irrigation</div>
                    </SelectItem>
                    <SelectItem value="fertilizer">
                      <div className="flex items-center gap-2"><FlaskConical size={16} className="text-purple-500"/> Fertilizer</div>
                    </SelectItem>
                    <SelectItem value="scouting">
                      <div className="flex items-center gap-2"><Sprout size={16} className="text-emerald-500"/> Pest Scouting</div>
                    </SelectItem>
                    <SelectItem value="maintenance">
                      <div className="flex items-center gap-2"><Hammer size={16} className="text-amber-500"/> Maintenance</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase">Input Quantity (if any)</label>
                <Input name="quantity" placeholder="e.g., 50kg NPK or 200L Water" className="h-12" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase">Observation Notes</label>
                <Textarea 
                  name="notes" 
                  placeholder="Describe the crop health or specific field section..." 
                  className="min-h-[120px] bg-slate-50 border-slate-200"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold shadow-xl"
                >
                  {isSubmitting ? "Syncing..." : "Confirm & Log Action"}
                </Button>
                <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
                  <ClipboardCheck size={12} /> GPS Timestamp will be attached
                </p>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* ... (The Timeline List we coded earlier goes here) */}
    </div>
  )
}